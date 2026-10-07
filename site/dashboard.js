// Analytics view: turns raw profiles into the numbers a business stakeholder cares about.
const $ = (id) => document.getElementById(id);
const pct = (x) => (x == null ? '—' : `${(x * 100).toFixed(1)}%`);
const usd = (x) => `$${x.toLocaleString('en-US')}`;
const kpi = (label, value, good) => `<div class="card kpi ${good ? 'good' : ''}"><div class="value">${value}</div><div class="label">${label}</div></div>`;
const contentCache = {};

async function subjectFor(market) {
  contentCache[market] ||= await (await fetch(`content/${market}.json`)).json();
  return contentCache[market].email.abandoned.subject;
}

async function render() {
  const s = await (await fetch('/api/stats')).json();
  const p = s.personalization;
  $('meta').textContent = `${s.visitors} visitors (${s.simulated} simulated) · storage: ${s.storage} · value per new customer assumed at ${usd(s.valuePerCustomerUsd)}. Simulated data is for learning, not a real benchmark.`;

  $('kpis-pers').innerHTML = [
    kpi('Conversion, personalized', pct(p.personalizedRate)),
    kpi('Conversion, control (generic)', pct(p.controlRate)),
    kpi('Lift from personalization', p.lift == null ? '—' : `${p.lift >= 0 ? '+' : ''}${(p.lift * 100).toFixed(0)}%`, true),
    kpi('Extra customers → estimated value', `${p.extraConversions} → ${usd(p.extraValueUsd)}`, true),
  ].join('');

  const max = Math.max(p.personalizedRate, p.controlRate, 0.01);
  $('ab').innerHTML = `
    <h3>A/B test among interested visitors (${s.eligible})</h3>
    <div class="bar-row"><span class="name">Personalized (${p.personalizedVisitors})</span><div class="bar" style="width:${(p.personalizedRate / max) * 70}%"></div>${pct(p.personalizedRate)}</div>
    <div class="bar-row"><span class="name">Control (${p.controlVisitors})</span><div class="bar control" style="width:${(p.controlRate / max) * 70}%"></div>${pct(p.controlRate)}</div>`;

  $('kpis-email').innerHTML = [
    kpi('Emails sent', s.email.sent),
    kpi('Applications recovered', s.email.recovered, true),
    kpi('Recovery rate', pct(s.email.recoveryRate), true),
    kpi('Recovered value', usd(s.email.recoveredValueUsd), true),
  ].join('');

  $('markets').innerHTML = '<tr><th>Market</th><th>Visitors</th><th>Conversions</th></tr>' +
    s.byMarket.map((m) => `<tr><td>${m.market}</td><td>${m.visitors}</td><td>${m.conversions}</td></tr>`).join('');
  $('segments').innerHTML = '<tr><th>Segment</th><th>Visitors</th></tr>' +
    s.bySegment.map((x) => `<tr><td>${x.segment}</td><td>${x.visitors}</td></tr>`).join('');

  const rows = await Promise.all(s.outbox.map(async (m) => `<tr><td>${m.market}</td><td>${m.product}</td><td>${await subjectFor(m.market)}</td><td>${new Date(m.sentAt).toLocaleString()}</td></tr>`));
  $('outbox').innerHTML = '<tr><th>Market</th><th>Product</th><th>Subject (from CMS content)</th><th>Sent</th></tr>' + rows.join('');
}

const post = (url, body) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) });
$('sim').onclick = async () => { await post('/api/simulate', { count: 200 }); render(); };
$('journey').onclick = async () => { await post('/api/journeys/abandoned'); render(); };
$('refresh').onclick = render;
$('reset').onclick = async () => { await post('/api/reset'); render(); };

render();
