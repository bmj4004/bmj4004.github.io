const MONTHS = new Set(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
const encoder = new TextEncoder();
const decoder = new TextDecoder();

const securityHeaders = {
  'Cache-Control': 'no-store',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
};

const base64UrlEncode = (bytes) => {
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const base64UrlDecode = (value) => {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((value.length + 3) % 4);
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

const importSigningKey = (secret) => crypto.subtle.importKey(
  'raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']
);

const createSignedToken = async (payload, secret) => {
  const body = base64UrlEncode(encoder.encode(JSON.stringify(payload)));
  const key = await importSigningKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  return `${body}.${base64UrlEncode(new Uint8Array(signature))}`;
};

const readSignedToken = async (token, secret, purpose) => {
  const [body, signature, extra] = String(token || '').split('.');
  if (!body || !signature || extra) throw new Error('Invalid token');
  const key = await importSigningKey(secret);
  const valid = await crypto.subtle.verify('HMAC', key, base64UrlDecode(signature), encoder.encode(body));
  if (!valid) throw new Error('Invalid token');
  const payload = JSON.parse(decoder.decode(base64UrlDecode(body)));
  if (payload.purpose !== purpose || !Number.isFinite(payload.exp) || payload.exp < Date.now()) {
    throw new Error('Expired token');
  }
  return payload;
};

const corsHeaders = (env) => ({
  ...securityHeaders,
  'Access-Control-Allow-Origin': env.SITE_ORIGIN,
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Max-Age': '86400',
  Vary: 'Origin',
});

const json = (body, status, env, withCors = true) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    ...(withCors ? corsHeaders(env) : securityHeaders),
  },
});

const redirect = (location) => new Response(null, {
  status: 302,
  headers: { Location: location, ...securityHeaders },
});

const requiredEnvironment = (env) => {
  const required = [
    'SITE_ORIGIN', 'GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET', 'GITHUB_TOKEN',
    'GITHUB_OWNER', 'GITHUB_REPO', 'GITHUB_ADMIN', 'SESSION_SECRET',
  ];
  const missing = required.filter((key) => !env[key]);
  if (missing.length) throw new Error(`Missing Worker configuration: ${missing.join(', ')}`);
  if (env.SESSION_SECRET.length < 32) throw new Error('SESSION_SECRET must be at least 32 characters');
};

const validatedReturnUrl = (candidate, env) => {
  const fallback = new URL('/', env.SITE_ORIGIN);
  if (!candidate) return fallback;
  try {
    const url = new URL(candidate);
    return url.origin === new URL(env.SITE_ORIGIN).origin ? url : fallback;
  } catch (_) {
    return fallback;
  }
};

const githubHeaders = (env) => ({
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${env.GITHUB_TOKEN}`,
  'User-Agent': 'bmj4004-conference-admin',
  'X-GitHub-Api-Version': '2022-11-28',
});

const githubContentUrl = (env) => {
  const owner = encodeURIComponent(env.GITHUB_OWNER);
  const repo = encodeURIComponent(env.GITHUB_REPO);
  const path = (env.GITHUB_DATA_PATH || 'assets/data/sysvenues.json')
    .split('/').map(encodeURIComponent).join('/');
  return `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
};

const githubError = async (response) => {
  const payload = await response.json().catch(() => ({}));
  const error = new Error(payload.message || `GitHub API returned ${response.status}`);
  error.status = response.status;
  return error;
};

const decodeGithubContent = (content) => {
  const binary = atob(content.replace(/\s/g, ''));
  return decoder.decode(Uint8Array.from(binary, (character) => character.charCodeAt(0)));
};

const encodeGithubContent = (content) => {
  const bytes = encoder.encode(content);
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000));
  }
  return btoa(binary);
};

const getRepositoryData = async (env) => {
  const branch = env.GITHUB_BRANCH || 'main';
  const response = await fetch(`${githubContentUrl(env)}?ref=${encodeURIComponent(branch)}`, {
    headers: githubHeaders(env),
  });
  if (!response.ok) throw await githubError(response);
  const file = await response.json();
  return { data: JSON.parse(decodeGithubContent(file.content)), sha: file.sha };
};

const putRepositoryData = async (env, data, sha, login) => {
  const response = await fetch(githubContentUrl(env), {
    method: 'PUT',
    headers: { ...githubHeaders(env), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `Update conference schedule (${login})`,
      content: encodeGithubContent(`${JSON.stringify(data, null, 2)}\n`),
      sha,
      branch: env.GITHUB_BRANCH || 'main',
    }),
  });
  if (!response.ok) throw await githubError(response);
  return response.json();
};

const assertString = (value, name, max, allowEmpty = true) => {
  if (typeof value !== 'string' || value.length > max || (!allowEmpty && !value.trim())) {
    throw new Error(`Invalid ${name}`);
  }
};

const validateConferenceData = (data) => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid data object');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.snapshot || '')) throw new Error('Invalid snapshot date');
  if (!data.views || typeof data.views !== 'object') throw new Error('Missing views');

  for (const mode of ['deadline', 'date']) {
    const view = data.views[mode];
    if (!view || view.mode !== mode || !Array.isArray(view.years) || !Array.isArray(view.rows)) {
      throw new Error(`Invalid ${mode} view`);
    }
    if (!view.years.length || view.years.length > 30 || view.rows.length > 500) {
      throw new Error(`Invalid ${mode} view size`);
    }
    const years = view.years.map(String);
    if (new Set(years).size !== years.length || years.some((year) => !/^20\d{2}$/.test(year))) {
      throw new Error(`Invalid ${mode} years`);
    }

    view.rows.forEach((row, rowIndex) => {
      if (!row || typeof row !== 'object' || !MONTHS.has(row.month)) throw new Error(`Invalid month at ${mode}/${rowIndex}`);
      assertString(row.venue, 'venue', 80, false);
      assertString(row.fullName, 'fullName', 180);
      assertString(row.cycle, 'cycle', 60);
      if (!Array.isArray(row.events) || row.events.length !== years.length) {
        throw new Error(`Invalid events at ${mode}/${rowIndex}`);
      }
      const eventYears = new Set();
      row.events.forEach((event, eventIndex) => {
        const year = String(event.year);
        if (!years.includes(year) || eventYears.has(year)) throw new Error(`Invalid event year at ${mode}/${rowIndex}/${eventIndex}`);
        eventYears.add(year);
        assertString(event.value, 'value', 40, false);
        assertString(event.url, 'url', 500);
        assertString(event.location, 'location', 120);
        assertString(event.details, 'details', 240);
        if (event.url) {
          const url = new URL(event.url);
          if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid event URL');
        }
      });
    });
  }
};

const authenticateRequest = async (request, env) => {
  const authorization = request.headers.get('Authorization') || '';
  if (!authorization.startsWith('Bearer ')) throw new Error('Unauthorized');
  const session = await readSignedToken(authorization.slice(7), env.SESSION_SECRET, 'session');
  if (String(session.login).toLowerCase() !== env.GITHUB_ADMIN.toLowerCase()) throw new Error('Unauthorized');
  return session;
};

const handleAuthStart = async (request, env) => {
  const requestUrl = new URL(request.url);
  const returnTo = validatedReturnUrl(requestUrl.searchParams.get('return_to'), env);
  const state = await createSignedToken({
    purpose: 'oauth-state',
    exp: Date.now() + 10 * 60 * 1000,
    returnTo: returnTo.href,
  }, env.SESSION_SECRET);
  const authorizationUrl = new URL('https://github.com/login/oauth/authorize');
  authorizationUrl.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
  authorizationUrl.searchParams.set('redirect_uri', `${requestUrl.origin}/auth/callback`);
  authorizationUrl.searchParams.set('scope', 'read:user');
  authorizationUrl.searchParams.set('state', state);
  authorizationUrl.searchParams.set('allow_signup', 'false');
  return redirect(authorizationUrl.href);
};

const handleAuthCallback = async (request, env) => {
  const requestUrl = new URL(request.url);
  let state;
  try {
    state = await readSignedToken(requestUrl.searchParams.get('state'), env.SESSION_SECRET, 'oauth-state');
  } catch (_) {
    return json({ error: 'Invalid or expired OAuth state' }, 400, env, false);
  }

  const returnTo = validatedReturnUrl(state.returnTo, env);
  const fail = (message) => {
    returnTo.hash = `conference-admin-error=${encodeURIComponent(message)}`;
    return redirect(returnTo.href);
  };
  if (requestUrl.searchParams.get('error')) return fail('GitHub authorization was cancelled.');
  const code = requestUrl.searchParams.get('code');
  if (!code) return fail('GitHub did not return an authorization code.');

  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${requestUrl.origin}/auth/callback`,
    }),
  });
  const tokenPayload = await tokenResponse.json().catch(() => ({}));
  if (!tokenResponse.ok || !tokenPayload.access_token) return fail('Could not complete GitHub authorization.');

  const userResponse = await fetch('https://api.github.com/user', {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${tokenPayload.access_token}`,
      'User-Agent': 'bmj4004-conference-admin',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  const user = await userResponse.json().catch(() => ({}));
  if (!userResponse.ok || String(user.login).toLowerCase() !== env.GITHUB_ADMIN.toLowerCase()) {
    return fail('This GitHub account is not authorized.');
  }

  const session = await createSignedToken({
    purpose: 'session',
    login: user.login,
    exp: Date.now() + 60 * 60 * 1000,
  }, env.SESSION_SECRET);
  returnTo.hash = `conference-admin-token=${encodeURIComponent(session)}`;
  return redirect(returnTo.href);
};

const handleApi = async (request, env) => {
  if (request.headers.get('Origin') !== env.SITE_ORIGIN) {
    return json({ error: 'Origin not allowed' }, 403, env);
  }
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(env) });

  let session;
  try {
    session = await authenticateRequest(request, env);
  } catch (_) {
    return json({ error: 'Unauthorized or expired session' }, 401, env);
  }

  if (request.method === 'GET') {
    const current = await getRepositoryData(env);
    return json({ ...current, login: session.login }, 200, env);
  }

  if (request.method === 'PUT') {
    const declaredLength = Number(request.headers.get('Content-Length') || 0);
    if (declaredLength > 600000) return json({ error: 'Request is too large' }, 413, env);
    const rawBody = await request.text();
    if (rawBody.length > 600000) return json({ error: 'Request is too large' }, 413, env);
    const payload = JSON.parse(rawBody);
    if (!/^[0-9a-f]{40,64}$/i.test(payload.sha || '')) return json({ error: 'Invalid base revision' }, 400, env);
    validateConferenceData(payload.data);
    const result = await putRepositoryData(env, payload.data, payload.sha, session.login);
    return json({
      sha: result.content.sha,
      commitUrl: result.commit?.html_url || '',
    }, 200, env);
  }

  return json({ error: 'Method not allowed' }, 405, env);
};

export default {
  async fetch(request, env) {
    try {
      requiredEnvironment(env);
      const url = new URL(request.url);
      if (url.pathname === '/auth/start' && request.method === 'GET') return handleAuthStart(request, env);
      if (url.pathname === '/auth/callback' && request.method === 'GET') return handleAuthCallback(request, env);
      if (url.pathname === '/api/data') return handleApi(request, env);
      if (url.pathname === '/health') return json({ ok: true }, 200, env, false);
      return json({ error: 'Not found' }, 404, env, false);
    } catch (error) {
      console.error(error);
      const status = error.status === 409 ? 409 : 500;
      const message = status === 409 ? 'The conference data changed; reload before publishing.' : 'Internal server error';
      return json({ error: message }, status, env, new URL(request.url).pathname.startsWith('/api/'));
    }
  },
};
