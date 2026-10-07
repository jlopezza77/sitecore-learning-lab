// All the marketing logic of the lab, in one place.
// Each handler maps to a SitecoreAI capability (see docs/sitecore-mapping.md).

const crypto = require('crypto');
const store = require('./store');

const PRODUCTS = ['card', 'loan', 'savings'];
const MARKETS = ['es-MX', 'es-CO', 'pt-BR'];
const SEGMENT_THRESHOLD = 1; // views of a product before we consider the visitor "interested"
const VALUE_PER_CUSTOMER_USD = 150; // assumed first-year value of a new customer, used for the business case

// A/B split: half of eligible visitors get personalization, half stay as a control group.
// Deterministic hash so a visitor always lands in the same group.
function abGroup(visitorId) {
  const byte = crypto.createHash('sha256').update(visitorId).digest()[0];
  return byte % 2 === 0 ? 'personalized' : 'control';
}

function newProfile(visitorId, market) {
  const now = new Date().toISOString();
  return {
    id: visitorId,
    market: MARKETS.includes(market) ? market : 'es-MX',
    group: abGroup(visitorId),
    interests: { card: 0, loan: 0, savings: 0 },
    segment: null,
    applicationStarted: null,
    converted: false,
    convertedVia: null,
    outbox: [],
    firstSeen: now,
    lastSeen: now,
    simulated: false,
  };
}

// Segmentation rule: the product with the most views, if it passed the threshold.
function computeSegment(interests) {
  const [top, views] = Object.entries(interests).sort((a, b) => b[1] - a[1])[0];
  return views >= SEGMENT_THRESHOLD ? top : null;
}

// CDP: collect a behavioral event and update the unified profile.
async function track({ visitorId, market, type, product, source }) {
  if (!visitorId || !type) return { status: 400, body: { error: 'visitorId and type are required' } };
  const profile = (await store.getProfile(visitorId)) || newProfile(visitorId, market);
  if (market && MARKETS.includes(market)) profile.market = market;
  profile.lastSeen = new Date().toISOString();

  if (type === 'view_product' && PRODUCTS.includes(product)) profile.interests[product] += 1;
  if (type === 'application_started') profile.applicationStarted = product || profile.segment;
  if (type === 'application_submitted' && !profile.converted) {
    profile.converted = true;
    profile.convertedVia = source === 'email' ? 'email' : 'web';
  }
  profile.segment = computeSegment(profile.interests);

  await store.addEvent({ id: crypto.randomUUID(), visitorId, type, product: product || null, source: source || 'web', market: profile.market, ts: profile.lastSeen });
  await store.saveProfile(profile);
  return { status: 200, body: profile };
}

// Personalize: decide which hero experience this visitor sees.
async function decide({ visitorId, market }) {
  const profile = (visitorId && (await store.getProfile(visitorId))) || newProfile(visitorId || 'anonymous', market);
  let experience = 'default';
  let reason = 'No segment yet: showing the generic hero.';
  if (profile.segment && profile.group === 'personalized') {
    experience = profile.segment;
    reason = `Segment "${profile.segment}" + A/B group "personalized": showing the ${profile.segment} offer.`;
  } else if (profile.segment) {
    reason = `Segment "${profile.segment}" but A/B group "control": showing generic hero so we can measure lift.`;
  }
  return { status: 200, body: { experience, reason, profile } };
}

// Cross-channel journey: anyone who started an application and did not finish gets an email (simulated outbox).
async function runAbandonmentJourney() {
  let sent = 0;
  let recovered = 0;
  for (const p of await store.allProfiles()) {
    if (!p.applicationStarted || p.converted || p.outbox.some((m) => m.template === 'abandoned')) continue;
    p.outbox.push({ channel: 'email', template: 'abandoned', product: p.applicationStarted, market: p.market, sentAt: new Date().toISOString() });
    sent += 1;
    // Simulated visitors "react" to the email; real visitors convert by opening the link from the debug panel.
    if (p.simulated && Math.random() < 0.15) {
      p.converted = true;
      p.convertedVia = 'email';
      recovered += 1;
    }
    await store.saveProfile(p);
  }
  return { status: 200, body: { sent, recovered } };
}

// Analytics: turn profiles into business numbers.
async function stats() {
  const profiles = await store.allProfiles();
  const rate = (list) => (list.length ? list.filter((p) => p.converted && p.convertedVia === 'web').length / list.length : 0);
  const eligible = profiles.filter((p) => p.segment);
  const pers = eligible.filter((p) => p.group === 'personalized');
  const ctrl = eligible.filter((p) => p.group === 'control');
  const persRate = rate(pers);
  const ctrlRate = rate(ctrl);
  const lift = ctrlRate ? (persRate - ctrlRate) / ctrlRate : null;
  const extraConversions = Math.round((persRate - ctrlRate) * pers.length);

  const messaged = profiles.filter((p) => p.outbox.length);
  const emailRecovered = profiles.filter((p) => p.convertedVia === 'email').length;

  const byMarket = MARKETS.map((m) => {
    const list = profiles.filter((p) => p.market === m);
    return { market: m, visitors: list.length, conversions: list.filter((p) => p.converted).length };
  });
  const bySegment = PRODUCTS.map((s) => ({ segment: s, visitors: profiles.filter((p) => p.segment === s).length }));

  return {
    status: 200,
    body: {
      storage: store.mode(),
      visitors: profiles.length,
      simulated: profiles.filter((p) => p.simulated).length,
      eligible: eligible.length,
      personalization: {
        personalizedVisitors: pers.length,
        controlVisitors: ctrl.length,
        personalizedRate: persRate,
        controlRate: ctrlRate,
        lift,
        extraConversions,
        extraValueUsd: extraConversions * VALUE_PER_CUSTOMER_USD,
      },
      email: {
        sent: messaged.length,
        recovered: emailRecovered,
        recoveryRate: messaged.length ? emailRecovered / messaged.length : 0,
        recoveredValueUsd: emailRecovered * VALUE_PER_CUSTOMER_USD,
      },
      totalConversions: profiles.filter((p) => p.converted).length,
      valuePerCustomerUsd: VALUE_PER_CUSTOMER_USD,
      byMarket,
      bySegment,
      outbox: messaged.slice(-10).map((p) => ({ visitorId: p.id, ...p.outbox[p.outbox.length - 1] })),
    },
  };
}

// Traffic generator so the dashboard has data. Results are SIMULATED, not real benchmarks.
async function simulate({ count = 200 } = {}) {
  const n = Math.min(Number(count) || 200, 1000);
  for (let i = 0; i < n; i++) {
    const p = newProfile(`sim-${crypto.randomUUID()}`, MARKETS[Math.floor(Math.random() * MARKETS.length)]);
    p.simulated = true;
    const product = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    p.interests[product] = Math.floor(Math.random() * 4); // 0-3 views
    p.segment = computeSegment(p.interests);
    const convertChance = !p.segment ? 0.03 : p.group === 'personalized' ? 0.14 : 0.07;
    if (Math.random() < convertChance) {
      p.converted = true;
      p.convertedVia = 'web';
    } else if (p.segment && Math.random() < 0.35) {
      p.applicationStarted = product;
    }
    await store.saveProfile(p);
  }
  return { status: 200, body: { created: n } };
}

async function reset() {
  await store.reset();
  return { status: 200, body: { ok: true } };
}

module.exports = { track, decide, runAbandonmentJourney, stats, simulate, reset };
