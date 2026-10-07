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
- **Valor:** salir más rápido al mercado y gastar menos en mantener sitios duplicados. La oferta se adapta a cada país: "cuota de manejo" en Colombia, "anualidad" en México, Pix y CDI en Brasil.

### 2. Perfil en tiempo real (panel "Behind the scenes")
- **Problema:** la mayoría de los visitantes son anónimos y el banco no sabe qué buscan hasta que llenan un formulario, si es que lo llenan.
- **Qué hace Sitecore (CDP):** cada clic construye un perfil desde la primera visita, aunque el visitante sea anónimo.
- **Valor:** el banco entiende la intención del cliente antes de que hable con un asesor. Son datos propios (first-party), que importan cada vez más con las leyes de privacidad y el fin de las cookies de terceros.

### 3. Personalización (el banner cambia a la oferta de tarjeta)
- **Problema:** mostrarle a todos lo mismo desperdicia tráfico que ya se pagó con publicidad.
- **Qué hace Sitecore (Personalize):** muestra en el momento la oferta relevante para el segmento.
- **Valor:** más conversión con el mismo tráfico, sin gastar más en publicidad. Casos públicos: HSBC tuvo **+45% de leads** en Canadá y Aer Lingus **+1,675% en conversiones**.

### 4. Grupo de control (A/B)
- **Problema:** marketing dice "la personalización funciona" y finanzas pregunta "¿cómo lo sabes?".
- **Qué hace Sitecore:** experimentos con grupo de control integrados.
- **Valor:** el impacto se mide, no se supone, y justifica la inversión ante el CFO. Es clave en una venta con enfoque en valor.

### 5. Cross-channel (email de solicitud abandonada)
- **Problema:** en un banco, mucha gente empieza una solicitud de tarjeta o préstamo y no la termina. Ese cliente se pierde.
- **Qué hace Sitecore:** el canal web y el email comparten el mismo perfil, así que el mensaje sabe qué producto quedó a medias y en qué idioma hablar.
- **Valor:** recuperar ingresos que ya estaban casi ganados. Sephora subió la tasa de apertura de sus emails de **17% a 40%** con mensajes más relevantes. En LATAM, el siguiente paso natural es WhatsApp.

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

## Deploy to Azure (free)

1. Create a **Cosmos DB for NoSQL** account with **free tier** enabled (provisioned throughput, not serverless).
2. Create a **Static Web App** (Free plan) linked to this GitHub repo: app location `site`, api location `api`, no build output.
3. In the Static Web App → Environment variables, add `COSMOS_CONNECTION_STRING`.
4. Set a **budget alert** of $5 on the subscription.

Note: `/api/reset` and `/api/simulate` are open endpoints, which is fine for a demo lab but not for production.
