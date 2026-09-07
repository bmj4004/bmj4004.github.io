# bmj4004.github.io

Personal academic homepage of **Bae Min Jun (배민준)** — graduate (integrated MS–PhD) student
at Sungkyunkwan University, researching systems software at
[SYSLAB](https://sites.google.com/g.skku.edu/syslab).

🔗 Live: https://bmj4004.github.io

## Features

- Single page with tabs: **About · Resume · Publications · Extra · Deadlines**
- Bilingual UI (Korean / English)
- Light / dark theme that follows the system setting, with a manual sun·moon toggle
- Publication list filterable by **Domestic / International**, grouped by year
- Tables for 16 selected systems conferences, switchable by submission deadline or event date,
  with search, historical years, official links, and detail tooltips
- Public conference update form that opens a prefilled GitHub Issue
- Owner-only `/approve` workflow that validates requested fields before committing data

## Tech

The site is static **HTML + CSS + vanilla JavaScript**, hosted on GitHub Pages
with no build step. Conference changes are proposed through GitHub Issues, so no
password, access token, or backend URL is stored in the static bundle.

## Structure

- `index.html` — main page
- `assets/css/style.css` — soft pastel theme (light + dark)
- `assets/js/script.js` — tab navigation, theme/language switches, filters, and conference editor UI
- `assets/data/sysvenues.json` — conference data rendered by the Deadlines tab
- `.github/scripts/conference-request-core.mjs` — strict request validation and data update logic
- `.github/workflows/approve-conference-update.yml` — owner-only Issue approval workflow
- `portfolio-1.html`, `portfolio-2.html`, `semi-proj1.html` — project detail pages

## Approving a conference request

1. Review the requested values and official links in the Issue.
2. As the repository owner, comment exactly `/approve` on the open Issue.
3. GitHub Actions validates the machine-readable request, updates
   `assets/data/sysvenues.json`, commits it, requests a Pages build, and closes the Issue.

Comments from accounts other than the repository owner do not run the approval job.

## License

[MIT](./LICENSE)
