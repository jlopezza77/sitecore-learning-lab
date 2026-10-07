# Learning lab: cross-channel digital marketing (SitecoreAI concepts on Azure)

A beginner-friendly, free hands-on lab built by JJ Lopez to learn the concepts behind SitecoreAI: headless content, CDP, personalization, A/B testing, cross-channel journeys and business-value analytics. It uses a fictional LATAM digital bank, **Banco Pacífico Digital**, operating in Mexico, Colombia and Brazil.

- Concept map to SitecoreAI: [docs/sitecore-mapping.md](docs/sitecore-mapping.md)
- What I learned each day: [LEARNING-JOURNAL.md](LEARNING-JOURNAL.md)

## Run it locally (no installs besides Node)

```bash
node dev-server.js
# Website:   http://localhost:4280
# Dashboard: http://localhost:4280/dashboard.html
```

Data is kept in memory locally. In Azure it uses Cosmos DB when `COSMOS_CONNECTION_STRING` is set.

## Architecture

```
Browser (site/)  ──► content/<market>.json        Level 1  Headless content
     │
     ├── POST /api/track ──► profile in Cosmos DB  Level 2-3  CDP + segments
     ├── GET  /api/decide ─► hero experience       Level 4-5  Personalize + A/B
     │
Dashboard ── POST /api/journeys/abandoned ─► email Level 6  Cross-channel
          └─ GET  /api/stats ─► lift, $ value      Level 7  Analytics
```

| Folder | What it is |
|---|---|
| `site/` | Static website + dashboard (Azure Static Web Apps) |
| `site/content/` | Localized content per market (the "CMS") |
| `api/src/lib/logic.js` | All marketing logic: tracking, segmentation, decisioning, journey, stats |
| `api/src/lib/store.js` | Storage: memory locally, Cosmos DB in Azure |
| `api/src/functions/http.js` | Azure Functions endpoints |
| `dev-server.js` | Local server that replaces Azure for development |

## 10-minute demo script (value first, technology second)

1. **The business problem (1 min)**: a LATAM digital bank shows the same generic page to everyone in three countries, and people who start applications and abandon them are lost.
2. **Localized content (1 min)**: switch MX → CO → BR. It's one content model, so marketing localizes without developers.
3. **Real-time personalization (3 min)**: click "Ver más" on the credit card twice. The hero changes to the card offer. Open "Behind the scenes" to see the profile, segment and the decision reason.
4. **Cross-channel (2 min)**: start an application and cancel it. On the dashboard, run the email journey. Back on the site, open the email link; the visitor returns with `?src=email` and converts, attributed to email.
5. **Business value (3 min)**: simulate traffic. Show the conversion lift of personalized vs control, the extra customers and the estimated $ value, plus the email recovery rate. Tie it to the public stories: HSBC +45% leads, Aer Lingus +1,675% conversions.

> Simulated traffic uses assumed rates for learning purposes; it is not a benchmark.

## Deploy to Azure (free)

1. Create a **Cosmos DB for NoSQL** account with **free tier** enabled (provisioned throughput, not serverless).
2. Create a **Static Web App** (Free plan) linked to this GitHub repo: app location `site`, api location `api`, no build output.
3. In the Static Web App → Environment variables, add `COSMOS_CONNECTION_STRING`.
4. Set a **budget alert** of $5 on the subscription.

Note: `/api/reset` and `/api/simulate` are open endpoints, which is fine for a demo lab but not for production.
