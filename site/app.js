// Front end of the lab. Three ideas to notice:
// 1. Content lives in content/<market>.json, separate from the page (headless CMS).
// 2. Every interaction is sent to /api/track (CDP event collection).
// 3. The hero is chosen by /api/decide (personalization).

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const source = params.get('src') || 'web';

let visitorId = localStorage.getItem('visitorId');
if (!visitorId) {
  visitorId = crypto.randomUUID();
  localStorage.setItem('visitorId', visitorId);
}
let market = params.get('market') || localStorage.getItem('market') || 'es-MX';
let content;
let currentProduct = null;

let currentGroup = null;

async function track(type, product, extra = {}) {
  await fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visitorId, market, type, product, source, ...extra }),
  });
  await personalize();
}

async function personalize() {
  const res = await fetch(`/api/decide?visitorId=${visitorId}&market=${market}`);
  const { experience, reason, profile } = await res.json();
  const hero = experience === 'default' ? content.hero.default : content.offers[experience];
  $('hero-title').textContent = hero.title;
  $('hero-subtitle').textContent = hero.subtitle;
  $('hero-cta').textContent = hero.cta;
  $('hero').classList.toggle('personalized', experience !== 'default');
  currentProduct = experience === 'default' ? null : experience;

  $('reason').textContent = `Decision: ${reason}`;
  const { id, group, groupForced, segment, interests, applicationStarted, converted, convertedVia, outbox } = profile;
  currentGroup = group;
  $('profile').textContent = JSON.stringify({ visitorId: id, group, groupForced: !!groupForced, segment, interests, applicationStarted, converted, convertedVia, outbox }, null, 2);
  $('open-email').hidden = !(outbox && outbox.length) || converted;
}

async function load() {
  $('market').value = market;
  content = await (await fetch(`content/${market}.json`)).json();
  document.documentElement.lang = market;
  const l = content.labels;
  $('form-title').textContent = l.formTitle;
  $('label-name').textContent = l.name;
  $('label-email').textContent = l.email;
  $('submit').textContent = l.submit;
  $('cancel').textContent = l.cancel;
  $('status').hidden = true;

  // Market-specific media and trust message come from the content file too (like a DAM + CMS).
  const t = content.trust;
  $('trust-img').src = t.image;
  $('trust-img').alt = t.alt;
  $('trust-title').textContent = t.title;
  $('trust-text').textContent = t.text;
  $('trust-badges').innerHTML = t.badges.map((b) => `<li>${b}</li>`).join('');
  $('trust-note').textContent = t.note;

  $('products').innerHTML = content.products
    .map((p) => `
      <article class="card">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="actions">
          <button class="btn primary" data-view="${p.id}">${l.learnMore}</button>
          <button class="btn" data-apply="${p.id}">${l.apply}</button>
        </div>
      </article>`)
    .join('');
  await personalize();
}

// Product detail window. Opening it is the "view_product" event that builds the segment.
function openDetails(productId) {
  const p = content.products.find((x) => x.id === productId);
  const l = content.labels;
  $('details-title').textContent = p.name;
  $('details-intro').textContent = p.details.intro;
  $('details-items').innerHTML = p.details.items
    .map((i) => `<div class="card"><h4>${i.name}</h4><ul>${i.features.map((f) => `<li>${f}</li>`).join('')}</ul></div>`)
    .join('');
  $('details-note').textContent = l.demoNote;
  $('details-apply').textContent = l.apply;
  $('details-close').textContent = l.close;
  $('details-apply').onclick = () => {
    $('details').close();
    openForm(productId);
  };
  $('details').showModal();
  track('view_product', productId);
}

function openForm(product) {
  currentProduct = product;
  track('application_started', product);
  $('form').showModal();
}

document.addEventListener('click', (e) => {
  if (e.target.dataset.view) openDetails(e.target.dataset.view);
  if (e.target.dataset.apply) openForm(e.target.dataset.apply);
});
$('hero-cta').onclick = () => (currentProduct ? openForm(currentProduct) : $('products').scrollIntoView({ behavior: 'smooth' }));
$('submit').onclick = async () => {
  $('form').close();
  await track('application_submitted', currentProduct);
  $('status').textContent = content.labels.thanks;
  $('status').hidden = false;
};
$('cancel').onclick = () => $('form').close();
$('details-close').onclick = () => $('details').close();
$('market').onchange = (e) => {
  market = e.target.value;
  localStorage.setItem('market', market);
  load();
};
$('open-email').onclick = () => (location.href = `/?src=email&market=${market}`);
$('switch-group').onclick = () =>
  track('demo_set_group', null, { group: currentGroup === 'personalized' ? 'control' : 'personalized' });
$('new-visitor').onclick = () => {
  localStorage.removeItem('visitorId');
  location.href = '/';
};

load();
