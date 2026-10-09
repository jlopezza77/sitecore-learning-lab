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

### Access

Currently **public** (anyone with the URL; `noindex` keeps it out of search). To make it invite-only again, add these to `staticwebapp.config.json` (`login.html` is already in place):

```json
"routes": [
  { "route": "/login.html", "allowedRoles": ["anonymous", "authenticated"] },
  { "route": "/.auth/*", "allowedRoles": ["anonymous", "authenticated"] },
  { "route": "/*", "allowedRoles": ["viewer"] }
],
"responseOverrides": {
  "401": { "redirect": "/login.html", "statusCode": 302 },
  "403": { "redirect": "/login.html?denied=1", "statusCode": 302 }
}
```

Then give each person access:

1. Azure portal → `adaptive-portfolio` → **Role management** → **Invite**.
2. Choose the provider (Azure Active Directory works for any Microsoft account, including Outlook and Gmail-linked ones; GitHub uses their username), enter their email or username, set the role to `viewer`, and set an expiration of up to 168 hours.
3. **Generate**, copy the invite link, and send it. They open it and sign in once. After that they can use the normal URL.

Remove access in the same screen (select the user → Delete). The Free plan allows up to 25 invited users. Pages also send `X-Robots-Tag: noindex`.

## Before sharing

The employer's name is withheld because this repo is public. Results are aggregates only. If you rename the client, change `org` in `site/data.js` and the eyebrow and footer text in the HTML files.

## Moving it out later

Copy the `adaptive/` folder into its own repo, then move Azure's workflow for this app to it and change `app_location` to `site`.
