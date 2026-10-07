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

## Por qué es valioso: el valor de negocio de cada parte de la demo

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
