// Shared shell: sidebar navigation, theme toggle, small helpers.
(function () {
  const P = window.PORTFOLIO;
  const pages = [
    ['index.html', 'Overview'],
    ['module-request.html', 'Training Module Request'],
    ['phishing-plan.html', 'Phishing Schedule Plan'],
  ];
  const here = location.pathname.split('/').pop() || 'index.html';

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } },
  };
  window.store = store;

  const saved = store.get('theme');
  if (saved) document.documentElement.dataset.theme = saved;

  const side = document.querySelector('.side');
  if (side) {
    side.innerHTML = `
      <div class="brand"><span class="brand-mark">◆</span>${P.org}</div>
      ${pages.map(([href, label]) => `<a href="${href}"${href === here ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
      <div class="spacer"></div>
      <button class="theme-btn" type="button">Toggle theme</button>
      <div class="side-foot">${P.team}<br>Built on ${P.platform}</div>`;
    side.querySelector('.theme-btn').addEventListener('click', () => {
      const dark = document.documentElement.dataset.theme
        ? document.documentElement.dataset.theme === 'dark'
        : matchMedia('(prefers-color-scheme: dark)').matches;
      const next = dark ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      store.set('theme', next);
    });
  }

  window.fmt = {
    pct: (n, d = 1) => `${n.toFixed(d)}%`,
    int: (n) => n.toLocaleString('en-US'),
    date: (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  };
  window.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
})();
