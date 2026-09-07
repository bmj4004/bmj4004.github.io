# Conference admin Worker

This Cloudflare Worker is the private write path for the conference editor on
`https://bmj4004.github.io`. The public site remains a static GitHub Pages site.

## Security model

- GitHub OAuth is used only to verify that the visitor is `bmj4004`.
- The OAuth client secret and repository token exist only as Worker secrets.
- The repository token should be a fine-grained PAT restricted to
  `bmj4004/bmj4004.github.io` with **Contents: Read and write** and no other
  permission.
- The browser receives a one-hour signed admin session, never the GitHub token.
- API writes accept only the configured site origin and the single configured
  JSON path. Payload structure, sizes, URLs, and the previous Git SHA are
  validated before a commit.

## One-time setup

1. Create a GitHub OAuth App under **Settings → Developer settings → OAuth
   Apps**.
   - Homepage URL: `https://bmj4004.github.io`
   - Callback URL: `https://YOUR-WORKER.workers.dev/auth/callback`
2. Create a fine-grained PAT restricted to this repository with only
   **Contents: Read and write**.
3. Copy `wrangler.toml.example` to `wrangler.toml` and deploy:

   ```sh
   npx wrangler login
   npx wrangler secret put GITHUB_CLIENT_ID
   npx wrangler secret put GITHUB_CLIENT_SECRET
   npx wrangler secret put GITHUB_TOKEN
   npx wrangler secret put SESSION_SECRET
   npx wrangler deploy
   ```

   Generate `SESSION_SECRET` with a cryptographically secure password generator;
   use at least 32 random characters.

4. Put the deployed URL in
   `assets/js/conference-admin-config.js`:

   ```js
   window.CONFERENCE_ADMIN_CONFIG = Object.freeze({
     apiBase: 'https://YOUR-WORKER.workers.dev',
   });
   ```

The editor will then sign in through GitHub and commit changes to
`assets/data/sysvenues.json`. GitHub Pages publishes the new data through its
normal deployment.
