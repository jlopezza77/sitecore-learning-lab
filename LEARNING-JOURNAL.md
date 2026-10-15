# Learning journal – Cross-channel digital marketing with SitecoreAI

Goal: understand cross-channel digital marketing hands-on, the way SitecoreAI delivers it, applied to a LATAM financial services brand (fictional: **Banco Pacífico Digital**, MX / CO / BR).

## Day 1 – 2026-10-06
**Researched**
- SitecoreAI (Nov 2025): XM Cloud + CDP + Personalize + Search + DAM + Content Hub unified, with Agentic Studio (20+ marketing agents).
- TEAMCX: TEAM International's Sitecore unit for LATAM; financial services is a main target.
- Reference success stories: HSBC, Emirates NBD (on Azure), Aer Lingus, Sephora.

**Built**
- Localized headless content for 3 markets.
- Event tracking → unified profile → segment → personalized hero.
- A/B control group to measure lift.
- Abandoned-application email journey.
- Business value dashboard.

**Learned**
- Personalization without a control group is an opinion, not a result.
- Cross-channel = the email knows what happened on the web (same profile).
- Same content model, different market → localization is content, not code.
- Azure Functions names cannot contain "/" — a route can, so name and route must be set separately (found in the cloud, not locally: test where you deploy).

**Next**
- [x] Deployed to Azure Static Web Apps + Cosmos DB free tier (Cloud Shell + GitHub Actions): https://proud-mud-0dc4d820f.2.azurestaticapps.net
- [ ] Sitecore Learning portal: SitecoreAI fundamentals course
- [ ] Replace simulated outbox with Azure Communication Services email
- [ ] Add Azure OpenAI to generate localized offer copy (≈ Sitecore Stream / Agentic Studio)
- [ ] Practice the 10-minute demo in English and Spanish

## Day 2 – 2026-10-15: React + Next.js, lesson 1
**Researched**
- SitecoreAI front-ends are built with Next.js (React) through Sitecore's SDK (formerly JSS, now Content SDK).

**Built**
- `web/`: Next.js 16 + React 19 + TypeScript version of the bank, side by side with the original.
- Components: `Header`, `Hero`, `ProductCard`, `TrustSection`; same content JSON as the original site.
- Static export published at `/next/` of the same Azure Static Web App (shares the API).

**Learned**
- A component is a function that returns JSX; props are its parameters.
- Same component + different props = different result (the core idea of React).
- In Sitecore, developers build components and marketing assembles pages with them; props = fields marketing fills in.

**Next**
- [ ] Lesson 1 exercise: `Footer` component + optional `badge` prop
- [ ] Lesson 2: state and events (`useState`)

## Day 3 – 
**Researched**

**Built**

**Learned**

**Next**
