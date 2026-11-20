(function () {
  'use strict';
  var theme;
  try { theme = localStorage.getItem('carbook-theme'); } catch (_) {}
  if (theme !== 'light' && theme !== 'dark') theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  function apply(value) {
    document.documentElement.dataset.theme = value;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = value === 'dark' ? '#101218' : '#f6f7fb';
    var button = document.getElementById('theme');
    if (button) {
      var label = value === 'dark' ? button.dataset.light : button.dataset.dark;
      button.textContent = button.dataset.iconOnly ? (value === 'dark' ? '☀' : '☾') : (value === 'dark' ? '☀ ' : '☾ ') + label;
      button.title = label;
      button.setAttribute('aria-label', label);
      button.setAttribute('aria-pressed', String(value === 'dark'));
    }
  }
  apply(theme);
  // Each language has real static URLs so legal content remains available without JavaScript.
  var uk = /\/uk\/[^/]*$/.test(location.pathname);
  var preferred;
  try { preferred = localStorage.getItem('carbook-language'); } catch (_) {}
  var query = new URLSearchParams(location.search);
  if (query.get('lang') === 'en' || query.get('lang') === 'uk') {
    preferred = query.get('lang');
    try { localStorage.setItem('carbook-language', preferred); } catch (_) {}
  }
  if (preferred && preferred !== (uk ? 'uk' : 'en')) {
    var url = new URL(location.href);
    var file = url.pathname.split('/').pop() || 'index.html';
    url.pathname = uk ? url.pathname.replace(/uk\/[^/]*$/, file) : url.pathname.replace(/[^/]*$/, 'uk/' + file);
    url.searchParams.delete('lang');
    location.replace(url.href);
  }
  document.addEventListener('DOMContentLoaded', function () {
    apply(theme);
    document.getElementById('theme').addEventListener('click', function () {
      theme = theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('carbook-theme', theme); } catch (_) {}
      apply(theme);
    });
    var language = document.querySelector('.language');
    language.addEventListener('click', function () {
      var next = uk ? 'en' : 'uk';
      try { localStorage.setItem('carbook-language', next); } catch (_) {}
      // URL also conveys the choice when browser storage is unavailable.
      var target = new URL(language.href);
      target.searchParams.set('lang', next);
      language.href = target.href;
    });
  });
})();
