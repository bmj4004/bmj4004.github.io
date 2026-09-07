const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CHANGE_FIELDS = ['mode', 'venue', 'fullName', 'cycle', 'year', 'value', 'url', 'location', 'details'];
const MAX_LENGTH = {
  venue: 80,
  fullName: 180,
  cycle: 60,
  value: 40,
  url: 500,
  location: 120,
  details: 240,
};

const fail = (message) => { throw new Error(message); };

const asSafeString = (change, field, required = false) => {
  if (typeof change[field] !== 'string') fail(`${field} must be a string.`);
  const value = change[field].trim();
  if (required && !value) fail(`${field} is required.`);
  if (value.length > MAX_LENGTH[field]) fail(`${field} is too long.`);
  if (/[\u0000-\u001f\u007f]/.test(value)) fail(`${field} contains control characters.`);
  if (value.includes('```')) fail(`${field} contains a disallowed Markdown fence.`);
  return value;
};

const validDateValue = (value, year) => {
  const match = value.match(/^(\d{4})-(0[1-9]|1[0-2])-([0-2]\d|3[01])(?:\.\.([0-2]\d|3[01]))?$/);
  if (!match || match[1] !== year) return false;
  const date = new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00Z`);
  return !Number.isNaN(date.getTime())
    && String(date.getUTCFullYear()) === match[1]
    && String(date.getUTCMonth() + 1).padStart(2, '0') === match[2]
    && String(date.getUTCDate()).padStart(2, '0') === match[3];
};

const normalizeUrl = (value) => {
  if (!value) return '';
  let parsed;
  try { parsed = new URL(value); } catch (_) { fail('url is invalid.'); }
  if (!['http:', 'https:'].includes(parsed.protocol)) fail('url must use http or https.');
  if (parsed.username || parsed.password) fail('url must not contain credentials.');
  return parsed.href;
};

export const parseConferenceRequest = (issueBody) => {
  if (typeof issueBody !== 'string' || issueBody.length > 30000) fail('Issue body is missing or too large.');
  const marker = '## Machine-readable request';
  if (issueBody.split(marker).length !== 2) fail('Expected exactly one machine-readable request section.');
  const section = issueBody.slice(issueBody.indexOf(marker) + marker.length);
  const blocks = [...section.matchAll(/```json\s*\n([\s\S]*?)\n```/g)];
  if (blocks.length !== 1) fail('Expected exactly one JSON request block.');
  let request;
  try { request = JSON.parse(blocks[0][1]); } catch (_) { fail('The JSON request block is invalid.'); }
  return validateConferenceRequest(request);
};

export const validateConferenceRequest = (request) => {
  if (!request || typeof request !== 'object' || Array.isArray(request)) fail('Request must be an object.');
  const requestFields = Object.keys(request).sort().join(',');
  if (requestFields !== 'changes,version') fail('Request contains unexpected fields.');
  if (request.version !== 1) fail('Unsupported request version.');
  if (!Array.isArray(request.changes) || request.changes.length < 1 || request.changes.length > 10) {
    fail('A request must contain between 1 and 10 changes.');
  }

  const seen = new Set();
  const changes = request.changes.map((rawChange, index) => {
    if (!rawChange || typeof rawChange !== 'object' || Array.isArray(rawChange)) fail(`Change ${index + 1} must be an object.`);
    if (Object.keys(rawChange).sort().join(',') !== [...CHANGE_FIELDS].sort().join(',')) {
      fail(`Change ${index + 1} contains missing or unexpected fields.`);
    }
    const mode = asSafeString(rawChange, 'mode', true);
    if (!['deadline', 'date'].includes(mode)) fail(`Change ${index + 1} has an invalid mode.`);
    const year = asSafeString(rawChange, 'year', true);
    if (!/^\d{4}$/.test(year) || Number(year) < 2010 || Number(year) > 2100) fail(`Change ${index + 1} has an invalid year.`);
    const value = asSafeString(rawChange, 'value', true);
    if (!validDateValue(value, year)) fail(`Change ${index + 1} has an invalid date value.`);

    const change = {
      mode,
      venue: asSafeString(rawChange, 'venue', true),
      fullName: asSafeString(rawChange, 'fullName'),
      cycle: asSafeString(rawChange, 'cycle'),
      year,
      value,
      url: normalizeUrl(asSafeString(rawChange, 'url')),
      location: asSafeString(rawChange, 'location'),
      details: asSafeString(rawChange, 'details'),
    };
    const key = JSON.stringify([mode, change.venue.toLocaleLowerCase(), change.cycle.toLocaleLowerCase(), year]);
    if (seen.has(key)) fail(`Change ${index + 1} duplicates another requested entry.`);
    seen.add(key);
    return change;
  });

  return { version: 1, changes };
};

const scheduleForRow = (row) => {
  const schedules = row.events.flatMap((event) => {
    const match = String(event.value || '').match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return [];
    const monthIndex = Number(match[2]) - 1;
    if (monthIndex < 0 || monthIndex >= MONTHS.length) return [];
    const day = Number(match[3]);
    return [{
      month: MONTHS[monthIndex],
      monthIndex,
      day: day >= 1 && day <= 31 ? day : 32,
      year: Number(event.year) || Number(match[1]) || 0,
    }];
  }).sort((a, b) => b.year - a.year);
  if (schedules.length) return schedules[0];
  const fallback = MONTHS.indexOf(row.month);
  return { month: fallback >= 0 ? row.month : MONTHS[0], monthIndex: Math.max(fallback, 0), day: 32, year: 0 };
};

const compareRows = (a, b) => {
  const scheduleA = scheduleForRow(a);
  const scheduleB = scheduleForRow(b);
  return scheduleA.monthIndex - scheduleB.monthIndex
    || scheduleA.day - scheduleB.day
    || a.venue.localeCompare(b.venue)
    || (a.cycle || '').localeCompare(b.cycle || '');
};

const normalizeView = (view) => {
  view.years = [...new Set(view.years.map(String))].sort((a, b) => Number(b) - Number(a));
  view.rows.forEach((row) => {
    const byYear = new Map(row.events.map((event) => [String(event.year), event]));
    row.events = view.years.map((year) => byYear.get(year) || {
      year,
      value: '-',
      url: '',
      location: '',
      details: '',
    });
    row.month = scheduleForRow(row).month;
  });
  view.rows.sort(compareRows);
};

const validateConferenceDataShape = (data) => {
  if (!data || typeof data !== 'object' || !data.views || typeof data.views !== 'object') fail('Conference data has an invalid shape.');
  for (const mode of ['deadline', 'date']) {
    const view = data.views[mode];
    if (!view || !Array.isArray(view.years) || !Array.isArray(view.rows)) fail(`Conference data is missing the ${mode} view.`);
    for (const row of view.rows) {
      if (!row || typeof row.venue !== 'string' || !Array.isArray(row.events)) fail(`The ${mode} view contains an invalid row.`);
    }
  }
};

export const applyConferenceRequest = (sourceData, request, snapshot) => {
  validateConferenceDataShape(sourceData);
  const validated = validateConferenceRequest(request);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(snapshot)) fail('Snapshot must use YYYY-MM-DD.');
  const data = JSON.parse(JSON.stringify(sourceData));

  for (const change of validated.changes) {
    const view = data.views[change.mode];
    if (!view.years.map(String).includes(change.year)) view.years.push(change.year);
    normalizeView(view);
    let row = view.rows.find((candidate) =>
      candidate.venue.toLocaleLowerCase() === change.venue.toLocaleLowerCase()
      && (candidate.cycle || '').toLocaleLowerCase() === change.cycle.toLocaleLowerCase()
    );
    if (!row) {
      row = {
        month: MONTHS[0],
        venue: change.venue,
        fullName: change.fullName,
        cycle: change.cycle,
        events: view.years.map((year) => ({ year, value: '-', url: '', location: '', details: '' })),
      };
      view.rows.push(row);
    }
    row.fullName = change.fullName || row.fullName || '';
    row.cycle = change.cycle;
    const event = row.events.find((candidate) => String(candidate.year) === change.year);
    Object.assign(event, {
      year: change.year,
      value: change.value,
      url: change.url,
      location: change.location,
      details: change.details,
    });
  }

  Object.values(data.views).forEach(normalizeView);
  data.snapshot = snapshot;
  validateConferenceDataShape(data);
  return data;
};
