# Adaptive Security Awareness Portfolio

Static site that shows the security awareness program I run for a luxury resort (name withheld) on Adaptive Security. It covers phishing simulation results, training campaigns, the 41 custom modules built with Adaptive's AI Content Studio, and the workflow I use to brief and generate each module.

The project is self-contained. It shares the `learning` repo but nothing else with the Sitecore lab, so this folder can be moved or deleted on its own.

## Pages

| Page | What it shows |
| --- | --- |
| `index.html` | KPIs, fail-rate chart per campaign, phishing and training tables, searchable module library |
| `module-request.html` | The Training Module Request brief (Content, Design, Claude Improvement) with a live recreation of Adaptive's "Generate training module" wizard and a copyable Preview |
| `phishing-plan.html` | 2026 month-by-month calendar. Ended items are read-only with results. Planned items can be edited (date, time, duration, release tracking) and are saved in the browser |

All figures live in `site/data.js`. They are aggregate counts read from the Adaptive admin console in October 2026, with no employee names or individual results. Update that file to refresh the numbers.

## Run locally

```bash
cd adaptive
node dev-server.js   # http://localhost:4281
```

No installs needed.

## Deploy to Azure (Free plan, $0)

Live at https://happy-glacier-0058ab310.5.azurestaticapps.net. The Static Web App `adaptive-portfolio` (plan **Free**, resource group `adaptive-portfolio_group`) is linked to this repo through the Azure portal. Azure added its own workflow under `.github/workflows/` and the deployment-token secret, with `app_location: adaptive/site`. It runs only when files under `adaptive/` change, and the Sitecore workflow ignores `adaptive/**`.

The site sends `X-Robots-Tag: noindex` so search engines don't list it. It is still reachable by anyone with the URL. To restrict it, Static Web Apps lets you invite specific users and limit routes to an `authenticated` role (see `staticwebapp.config.json` docs).

## Before sharing

The employer's name is withheld because this repo is public. Results are aggregates only. If you rename the client, change `org` in `site/data.js` and the eyebrow and footer text in the HTML files.

## Moving it out later

Copy the `adaptive/` folder into its own repo, then move Azure's workflow for this app to it and change `app_location` to `site`.
