# How this lab maps to SitecoreAI

| Level | Marketing concept | SitecoreAI capability | In this lab | Azure service |
|---|---|---|---|---|
| 1. Content | Headless content, one model for many markets/languages | XM Cloud (now SitecoreAI) + Next.js / JSS, multisite, language versions | `site/content/es-MX.json`, `es-CO.json`, `pt-BR.json` – same structure, localized copy and offers | Static Web Apps (Free) |
| 2. Data | Collect behavioral events, unify into a profile | Sitecore CDP (events API, guest profile) | `POST /api/track` → profile with interests, segment, application status | Functions + Cosmos DB (free tier) |
| 3. Segmentation | Group visitors by behavior | CDP segments / audiences | Rule: ≥1 view of a product (product detail opened) → segment `card`, `loan` or `savings` | Functions |
| 4. Personalization | Show the right content to the right person | Sitecore Personalize (decisioning, experiences) | `GET /api/decide` swaps the hero banner to the segment's offer | Functions |
| 5. Experimentation | Prove it works with a control group | Personalize A/B/n experiments | 50/50 hashed split: personalized vs control (generic) | Functions |
| 6. Cross-channel journey | Continue the conversation in another channel | Sitecore Send / CDP triggered flows | Abandoned application → email in the visitor's language; link returns with `?src=email` for attribution | Functions (simulated outbox; Azure Communication Services for real email) |
| 7. Analytics & value | Translate data into business outcomes | Sitecore analytics, Personalize performance reports | Dashboard: conversion lift, extra customers, $ value, email recovery rate | Static Web Apps page |

## Concepts glossary (in my own words)

- **Omnichannel vs cross-channel**: omnichannel = present everywhere; cross-channel = the channels *share context* (what you did on the web changes the email you get).
- **CDP vs CRM**: CRM stores known customers and sales interactions; a CDP collects behavior from anonymous + known visitors and unifies it into one real-time profile used for activation.
- **Composable / MACH**: Microservices, API-first, Cloud-native, Headless – pick best-of-breed pieces connected by APIs. SitecoreAI unifies the composable pieces in one platform.
- **Control group / lift**: without a control group you cannot prove personalization caused the improvement. Lift = (personalized rate − control rate) / control rate.
- **First-party data & consent**: data the brand collects directly with consent – key under LGPD (Brazil), Ley Federal de Protección de Datos (México), Ley 1581 (Colombia).

## Public success stories I use as reference

- HSBC Commercial Banking – +45% leads (Canada), +15% (Australia)
- Emirates NBD – hyper-personalized offers, Sitecore on Microsoft Azure
- Aer Lingus – +1,675% conversions through personalization
- Low-cost airline – 10M visitors in one day, +$400K sales from personalization
- Sephora – email open rate 17% → 40%

LATAM context: TEAM International is the exclusive Sitecore reseller for Colombia, Mexico, Brazil and Argentina (TEAMCX, Platinum Partner since July 2026), Azure-native and MACC-eligible; financial services is a priority sector.
