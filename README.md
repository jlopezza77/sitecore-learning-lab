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
3. **Real-time personalization (3 min)**: click "Ver más" on the credit card: a detail window shows the card types, and the hero changes to the card offer. Open "Behind the scenes" to see the profile, segment and the decision reason.
4. **Cross-channel (2 min)**: start an application and cancel it. On the dashboard, run the email journey. Back on the site, open the email link; the visitor returns with `?src=email` and converts, attributed to email.
5. **Business value (3 min)**: simulate traffic. Show the conversion lift of personalized vs control, the extra customers and the estimated $ value, plus the email recovery rate. Tie it to the public stories: HSBC +45% leads, Aer Lingus +1,675% conversions.

> Simulated traffic uses assumed rates for learning purposes; it is not a benchmark.

## Why it matters: the business value of each part of the demo

*Versión en español más abajo: [Por qué es valioso](#por-qué-es-valioso-el-valor-de-negocio-de-cada-parte-de-la-demo).*

The demo shows how a company wins more customers with the same traffic and the same marketing budget. The technology is the means; the outcome is the argument.

### 1. Localized content (switching between MX, CO and BR)
- **Problem:** a bank in 3 countries usually runs 3 separate sites, or depends on IT for every change. Launching a campaign takes weeks.
- **What Sitecore does:** one content model with versions per language and market. Marketing publishes without developers.
- **Value:**
  - **Faster time to market.** A new campaign (for example, the Gold card) is built once as a structure, and each country only translates and adapts the copy. No need to coordinate 3 development projects or wait for IT. In the demo, adding a country means adding one content file, with no code changes.
  - **Lower cost of duplicate sites.** Every separate site carries its own hosting, licenses, security patches, testing and team. Once unified, that cost is paid once and components are reused across countries and brands.
  - **The offer adapts to each country.** It's not just translation: each market has its own product, regulation and financial language. In the demo, the card highlights "cuota de manejo $0" (no handling fee) in Colombia, "0% interest for 6 months" in Mexico and "anuidade zero" (no annual fee) in Brazil; the savings account talks about "% E.A." (effective annual rate) in Colombia and "% do CDI" (Brazil's benchmark rate) and Pix in Brazil. Amounts and currencies change too (MXN, COP, BRL).
- **Real cases (sitecore.com):**
  - **HSBC Commercial Banking** launched a new proposition in **50 markets** with Sitecore: **+45% leads in Canada**, +15% in Australia, and users were 5x more likely to express interest in contacting the bank.
  - **Canadian Western Bank** unified **10 brand websites** on one platform: **+50% lead generation opportunities**, **70% productivity gain**, 25% more content reuse, and went from 1 to 17 people publishing without relying on IT.

### 2. Real-time profile (the "Behind the scenes" panel)
- **Problem:** most visitors are anonymous, and the bank doesn't know what they're looking for until they fill in a form, if they ever do.
- **What Sitecore does (CDP):** every click builds a profile from the first visit, even while the visitor is anonymous.
- **Value:** the bank understands customer intent before they ever talk to an advisor. This is **first-party data**: collected by the bank on its own site, with the customer's consent. That matters for two reasons:
  - **Privacy laws in LATAM.** Brazil has the **LGPD** (in force since 2020, enforced by the ANPD). Mexico published a **new Federal Law on the Protection of Personal Data Held by Private Parties** on March 20, 2025; the former INAI's functions moved to the Secretariat of Anti-Corruption and Good Governance. Colombia has **Law 1581 of 2012**, enforced by the SIC. All of them require knowing what data you hold, why, and under what consent. A platform that centralizes the profile and consent makes compliance easier; data scattered across third-party tools makes it harder.
  - **Less dependence on third-party data.** Safari and Firefox already block third-party cookies by default. Google, however, **decided to keep them in Chrome** (April 2025) after years of announcing their removal. Still, the trend is clear: browsers, ad blockers and regulation keep reducing what you can learn about customers from other people's data. First-party data, collected with consent, is the asset that doesn't depend on decisions made by Google or Apple.

### 3. Personalization (the banner switches to the card offer)
- **Problem:** showing everyone the same thing wastes traffic that was already paid for with advertising.
- **What Sitecore does (Personalize):** shows the offer relevant to the segment, in the moment.
- **Value:** more conversions from the same traffic, without spending more on ads. Public cases on sitecore.com: HSBC saw **+45% leads** in Canada and Aer Lingus **+1,675% conversions**.

### 4. Control group (A/B)
- **Problem:** marketing says "personalization works" and finance asks "how do you know?".
- **What Sitecore does:** built-in experiments with a control group.
- **Value:** impact is measured, not assumed, and it justifies the investment to the CFO. This is key in a value-based sale.

### 5. Cross-channel (abandoned application email)
- **Problem:** at a bank, many people start a card or loan application and never finish it. That customer is lost.
- **What Sitecore does:** the web channel and email share the same profile, so the message knows which product was left unfinished and which language to use.
- **Value:** recovering revenue that was almost won. Sephora, using Moosend (now **Sitecore Send**), moved from mass campaigns to behavior-segmented emails: open rates rose from **17% to 40%**, online sales grew **+5%**, and automated emails reduced cart abandonment. In LATAM, the natural next step is WhatsApp.

### 6. Dashboard (lift, extra customers, estimated $)
- **Problem:** executives don't buy "a CDP"; they buy growth.
- **Value:** it translates technology into business language: "X more customers, worth $Y".

### How this relates to the Channel Solutions Engineer role
A Channel SE teaches partners (such as TEAMCX) to sell and demonstrate Sitecore. This demo shows three of the role's requirements:
- **"Demonstrating software using a value-based approach":** it starts with the problem and ends with money, not features.
- **"Understanding of cross-channel digital marketing":** it connects content, data, personalization and channels.
- **"Ability to absorb large amounts of information quickly":** learned and built independently, on Azure, the same cloud TEAMCX uses to sell Sitecore.

**Closing line:**
> "Sitecore doesn't sell a CMS; it sells the ability to convert more of the traffic you already have, measure it and prove it. My job as a Channel SE would be to make sure every partner in LATAM can tell this story with their own customer's numbers."

### Sources and a note on LATAM
I found no public Sitecore success stories with named LATAM customers and metrics (searched in English, Spanish and Portuguese, October 2026). That's why the demo uses a fictional bank and verified global cases. A good interview question: *"What LATAM customer references do TEAMCX or Sitecore have that I could use with partners?"*

- [HSBC Commercial Banking (sitecore.com)](https://www.sitecore.com/solutions/customers/hsbc/hsbc-cmb-best-digital-experience-transformation-2021)
- [Canadian Western Bank (sitecore.com)](https://www.sitecore.com/solutions/customers/canadianwesternbank/canadianwesternbank-drives-50-percent-more-conversions-and-70-percent-productivity-gain)
- [Sephora with Moosend / Sitecore Send (sitecore.com)](https://www.sitecore.com/solutions/customers/sephora/sephora-boosts-website-traffic-and-sales-with-moosend)
- [Aer Lingus (sitecore.com)](https://www.sitecore.com/solutions/customers/aer-lingus/aer-lingus-improved-conversions-by-1675-percent-with-sitecore)
- [Google keeps third-party cookies in Chrome (eMarketer)](https://www.emarketer.com/content/google-backs-off-third-party-cookie-ban-amid-regulatory-pressure)
- [Mexico's new personal data law, 2025 (Garrigues, in Spanish)](https://www.garrigues.com/es_ES/noticia/mexico-nueva-ley-federal-proteccion-datos-personales-posesion-particulares-introduce)
- [TEAMCX: TEAM International and Sitecore in LATAM](https://www.teaminternational.com/de/blog/team-international-sitecore-partnership-teamcx-latam)

## Por qué es valioso: el valor de negocio de cada parte de la demo

*English version above: [Why it matters](#why-it-matters-the-business-value-of-each-part-of-the-demo).*

La demo muestra cómo una empresa gana más clientes con el mismo tráfico y el mismo presupuesto de marketing. La tecnología es el medio; el resultado es el argumento.

### 1. Contenido localizado (cambiar entre MX, CO y BR)
- **Problema:** un banco en 3 países suele tener 3 sitios distintos, o depende de TI para cada cambio. Lanzar una campaña tarda semanas.
- **Qué hace Sitecore:** un solo modelo de contenido con versiones por idioma y mercado. Marketing publica sin programadores.
- **Valor:**
  - **Salir más rápido al mercado.** Una campaña nueva (por ejemplo, la tarjeta Oro) se crea una vez como estructura y cada país solo traduce y adapta el texto. No hay que coordinar 3 proyectos de desarrollo ni esperar a TI. En la demo, agregar un país es agregar un archivo de contenido, sin tocar código.
  - **Gastar menos en sitios duplicados.** Cada sitio separado tiene su propio hosting, licencias, parches de seguridad, pruebas y equipo. Al unificarlos, ese costo se paga una vez y los componentes se reutilizan entre países y marcas.
  - **La oferta se adapta a cada país.** No es solo traducir: cada mercado tiene su propio producto, regulación y lenguaje financiero. En la demo, la tarjeta destaca "cuota de manejo $0" en Colombia, "0% de interés a 6 meses" en México y "anuidade zero" en Brasil; la cuenta de ahorro habla de "% E.A." en Colombia y de "% do CDI" y Pix en Brasil. Montos y monedas también cambian (MXN, COP, BRL).
- **Casos reales (sitecore.com):**
  - **HSBC Commercial Banking** lanzó una nueva propuesta en **50 mercados** con Sitecore: **+45% de leads en Canadá**, +15% en Australia, y los usuarios fueron 5 veces más propensos a querer contactar al banco.
  - **Canadian Western Bank** unificó **10 sitios** de sus marcas en una sola plataforma: **+50% en oportunidades de leads**, **70% de ganancia en productividad**, 25% más reutilización de contenido, y pasó de 1 a 17 personas publicando sin depender de TI.

### 2. Perfil en tiempo real (panel "Behind the scenes")
- **Problema:** la mayoría de los visitantes son anónimos y el banco no sabe qué buscan hasta que llenan un formulario, si es que lo llenan.
- **Qué hace Sitecore (CDP):** cada clic construye un perfil desde la primera visita, aunque el visitante sea anónimo.
- **Valor:** el banco entiende la intención del cliente antes de que hable con un asesor. Son **datos propios (first-party)**: los recoge el banco en su propio sitio, con el consentimiento del cliente. Eso importa por dos razones:
  - **Leyes de privacidad en LATAM.** Brasil tiene la **LGPD** (vigente desde 2020, supervisada por la ANPD). México publicó una **nueva Ley Federal de Protección de Datos Personales en Posesión de los Particulares** el 20 de marzo de 2025; las funciones del INAI pasaron a la Secretaría Anticorrupción y Buen Gobierno. Colombia tiene la **Ley 1581 de 2012**, supervisada por la SIC. Todas exigen saber qué datos tienes, para qué y con qué consentimiento. Una plataforma que centraliza el perfil y el consentimiento facilita cumplir; los datos repartidos en herramientas de terceros lo complican.
  - **Menos dependencia de datos de terceros.** Safari y Firefox ya bloquean las cookies de terceros por defecto. Google, en cambio, **decidió mantenerlas en Chrome** (abril de 2025) después de años anunciando su eliminación. Aun así, la tendencia es clara: navegadores, bloqueadores y regulación reducen lo que se puede saber del cliente con datos ajenos. El dato propio, recogido con consentimiento, es el activo que no depende de las decisiones de Google o Apple.

### 3. Personalización (el banner cambia a la oferta de tarjeta)
- **Problema:** mostrarle a todos lo mismo desperdicia tráfico que ya se pagó con publicidad.
- **Qué hace Sitecore (Personalize):** muestra en el momento la oferta relevante para el segmento.
- **Valor:** más conversión con el mismo tráfico, sin gastar más en publicidad. Casos públicos en sitecore.com: HSBC tuvo **+45% de leads** en Canadá y Aer Lingus **+1,675% en conversiones**.

### 4. Grupo de control (A/B)
- **Problema:** marketing dice "la personalización funciona" y finanzas pregunta "¿cómo lo sabes?".
- **Qué hace Sitecore:** experimentos con grupo de control integrados.
- **Valor:** el impacto se mide, no se supone, y justifica la inversión ante el CFO. Es clave en una venta con enfoque en valor.

### 5. Cross-channel (email de solicitud abandonada)
- **Problema:** en un banco, mucha gente empieza una solicitud de tarjeta o préstamo y no la termina. Ese cliente se pierde.
- **Qué hace Sitecore:** el canal web y el email comparten el mismo perfil, así que el mensaje sabe qué producto quedó a medias y en qué idioma hablar.
- **Valor:** recuperar ingresos que ya estaban casi ganados. Sephora, con Moosend (hoy **Sitecore Send**), pasó de campañas masivas a emails segmentados por comportamiento: la tasa de apertura subió de **17% a 40%**, las ventas online **+5%**, y los emails automáticos redujeron el abandono de carrito. En LATAM, el siguiente paso natural es WhatsApp.

### 6. Dashboard (lift, clientes extra, $ estimados)
- **Problema:** los ejecutivos no compran "un CDP"; compran crecimiento.
- **Valor:** traduce la tecnología al lenguaje del negocio: "X clientes más, equivalentes a $Y".

### Relación con el puesto de Channel Solutions Engineer
El Channel SE enseña a los partners (como TEAMCX) a vender y demostrar Sitecore. Esta demo prueba tres requisitos de la vacante:
- **"Demonstrating software using a value-based approach":** empieza por el problema y termina con dinero, no con funcionalidades.
- **"Understanding of cross-channel digital marketing":** conecta contenido, datos, personalización y canales.
- **"Ability to absorb large amounts of information quickly":** aprendido y construido por cuenta propia, en Azure, la misma nube con la que TEAMCX vende Sitecore.

**Frase de cierre:**
> "Sitecore no vende un CMS; vende la capacidad de convertir más del tráfico que ya tienes, medirlo y demostrarlo. Mi trabajo como Channel SE sería que cada partner en LATAM pueda contar esta historia con los números de su propio cliente."

### Fuentes y nota sobre LATAM
No encontré casos de éxito públicos de Sitecore con clientes de LATAM con nombre y métricas (búsqueda en inglés, español y portugués, octubre 2026). Por eso la demo usa un banco ficticio y casos globales verificados. Buena pregunta para la entrevista: *"¿Qué referencias de clientes en LATAM tiene TEAMCX o Sitecore que pueda usar con los partners?"*

- [HSBC Commercial Banking (sitecore.com)](https://www.sitecore.com/solutions/customers/hsbc/hsbc-cmb-best-digital-experience-transformation-2021)
- [Canadian Western Bank (sitecore.com)](https://www.sitecore.com/solutions/customers/canadianwesternbank/canadianwesternbank-drives-50-percent-more-conversions-and-70-percent-productivity-gain)
- [Sephora con Moosend / Sitecore Send (sitecore.com)](https://www.sitecore.com/solutions/customers/sephora/sephora-boosts-website-traffic-and-sales-with-moosend)
- [Aer Lingus (sitecore.com)](https://www.sitecore.com/solutions/customers/aer-lingus/aer-lingus-improved-conversions-by-1675-percent-with-sitecore)
- [Google mantiene las cookies de terceros en Chrome (eMarketer)](https://www.emarketer.com/content/google-backs-off-third-party-cookie-ban-amid-regulatory-pressure)
- [Nueva ley de datos personales en México, 2025 (Garrigues)](https://www.garrigues.com/es_ES/noticia/mexico-nueva-ley-federal-proteccion-datos-personales-posesion-particulares-introduce)
- [TEAMCX: TEAM International y Sitecore en LATAM](https://www.teaminternational.com/de/blog/team-international-sitecore-partnership-teamcx-latam)

## Deploy to Azure (free)

1. Create a **Cosmos DB for NoSQL** account with **free tier** enabled (provisioned throughput, not serverless).
2. Create a **Static Web App** (Free plan) linked to this GitHub repo: app location `site`, api location `api`, no build output.
3. In the Static Web App → Environment variables, add `COSMOS_CONNECTION_STRING`.
4. Set a **budget alert** of $5 on the subscription.

Note: `/api/reset` and `/api/simulate` are open endpoints, which is fine for a demo lab but not for production.
