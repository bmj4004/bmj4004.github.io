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
- Browser-based conference editor protected by GitHub login; publishing creates
  a repository commit through a separately deployed Worker

## Tech

The public site is static **HTML + CSS + vanilla JavaScript**, hosted on GitHub
Pages with no build step. The optional conference editor uses a small Cloudflare
Worker so repository credentials never enter the static bundle.

## Structure

- `index.html` — main page
- `assets/css/style.css` — soft pastel theme (light + dark)
- `assets/js/script.js` — tab navigation, theme/language switches, filters, and conference editor UI
- `assets/data/sysvenues.json` — conference data rendered by the Deadlines tab
- `assets/js/conference-admin-config.js` — public URL of the admin Worker (no secrets)
- `conference-admin-worker/` — GitHub OAuth and restricted repository write API;
  see its [setup guide](./conference-admin-worker/README.md)
- `portfolio-1.html`, `portfolio-2.html`, `semi-proj1.html` — project detail pages

Conference data is adapted, with attribution, from
[Dan Tsafrir's Systems Conferences](https://dants.github.io/index_sysvenues_deadline.html).

## License

[MIT](./LICENSE)
