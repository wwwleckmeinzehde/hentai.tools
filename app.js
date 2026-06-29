'use strict';

// ─── AGE VERIFICATION ─────────────────────────────────────────────────────────
(function () {
  const gate = document.getElementById('age-gate');

  if (sessionStorage.getItem('ht_age_ok') === '1') {
    gate.classList.add('hidden');
    return;
  }

  document.getElementById('age-yes').addEventListener('click', () => {
    sessionStorage.setItem('ht_age_ok', '1');
    gate.classList.add('hidden');
  });

  document.getElementById('age-no').addEventListener('click', () => {
    window.location.href = 'https://cactusmod.xyz';
  });
})();

// TAB NAVIGATION
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

// ─── SEARCH ───────────────────────────────────────────────────────────────────
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

searchBtn.addEventListener('click', () => {
  const q = searchInput.value.trim();
  if (!q) return;
  log(`Suche nach: "${q}" (Demo – keine echte API verbunden)`);
});

searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') searchBtn.click(); });

// ─── TAG BROWSER ──────────────────────────────────────────────────────────────
let selectedTags = new Set();

document.querySelectorAll('.tag').forEach(tag => {
  tag.addEventListener('click', () => {
    const t = tag.textContent.replace(/\s·\s[\d,]+$/, '').trim();
    if (selectedTags.has(t)) {
      selectedTags.delete(t);
      tag.classList.remove('selected');
    } else {
      selectedTags.add(t);
      tag.classList.add('selected');
    }
    renderSelectedTags();
  });
});

function renderSelectedTags() {
  const el = document.getElementById('selected-tags-display');
  el.innerHTML = '';
  selectedTags.forEach(t => {
    const chip = document.createElement('span');
    chip.className = 'tag selected';
    chip.textContent = t;
    chip.addEventListener('click', () => {
      selectedTags.delete(t);
      document.querySelectorAll('.tag').forEach(tag => {
        if (tag.textContent.replace(/\s·\s[\d,]+$/, '').trim() === t) tag.classList.remove('selected');
      });
      renderSelectedTags();
    });
    el.appendChild(chip);
  });
}

document.getElementById('clear-tags').addEventListener('click', () => {
  selectedTags.clear();
  document.querySelectorAll('.tag').forEach(t => t.classList.remove('selected'));
  renderSelectedTags();
});

document.getElementById('search-with-tags').addEventListener('click', () => {
  if (!selectedTags.size) return alert('Keine Tags ausgewählt.');
  searchInput.value = [...selectedTags].join(' ');
  document.querySelector('[data-tab="search"]').click();
  log(`Suche mit Tags: ${[...selectedTags].join(', ')}`);
});

// Tag filter
document.getElementById('tag-search').addEventListener('input', function () {
  const q = this.value.toLowerCase();
  document.querySelectorAll('.tag').forEach(tag => {
    tag.style.display = tag.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
});

// ─── RANDOM ───────────────────────────────────────────────────────────────────
const SAMPLE_TITLES = [
  'Hoshi no Kakera', 'Yume no Tobira', 'Akane no Sora', 'Shirogane no Hana',
  'Koi no Ribbon', 'Sekai no Owari', 'Tsuki no Kagami', 'Haru no Koe',
  'Natsu Matsuri', 'Fuyu no Tobari', 'Phantom Kiss', 'Sweet Confession',
  'Moonlight Serenade', 'Crimson Tide', 'Eternal Summer',
];
const SAMPLE_TAGS = [
  'big breasts', 'school uniform', 'glasses', 'maid', 'elf', 'kemonomimi',
  'tsundere', 'idol', 'witch', 'catgirl', 'romance', 'comedy', 'fantasy',
];
const SAMPLE_CATS = ['Manga', 'Doujinshi', 'Artbook'];
const SAMPLE_LANGS = ['JP', 'EN', 'DE'];

document.getElementById('random-btn').addEventListener('click', generateRandom);

function generateRandom() {
  const title = SAMPLE_TITLES[Math.floor(Math.random() * SAMPLE_TITLES.length)];
  const cat = SAMPLE_CATS[Math.floor(Math.random() * SAMPLE_CATS.length)];
  const lang = SAMPLE_LANGS[Math.floor(Math.random() * SAMPLE_LANGS.length)];
  const pages = Math.floor(Math.random() * 180) + 8;
  const tags = [...SAMPLE_TAGS].sort(() => Math.random() - 0.5).slice(0, 4);

  const el = document.getElementById('random-result');
  el.innerHTML = `
    <div class="random-card">
      <div class="rtitle">${title}</div>
      <div class="rmeta">${cat} · ${lang} · ${pages} Seiten</div>
      <div class="rtags">${tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
    </div>`;

  addToHistory(title, cat, lang);
}

function addToHistory(title, cat, lang) {
  const list = document.getElementById('random-history-list');
  const now = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  const item = document.createElement('div');
  item.className = 'history-item';
  item.innerHTML = `<span>${title} <small style="color:var(--text-muted)">${cat} · ${lang}</small></span><span class="htime">${now}</span>`;
  list.prepend(item);
  if (list.children.length > 10) list.lastElementChild.remove();
}

// ─── DOWNLOADER ───────────────────────────────────────────────────────────────
const dlLog = document.getElementById('dl-log');

document.getElementById('dl-analyze-btn').addEventListener('click', () => {
  const url = document.getElementById('dl-url').value.trim();
  if (!url) return;
  appendLog(`Analysiere: ${url}`);
  setTimeout(() => {
    appendLog('Gefunden: 32 Bilder · Titel: "Beispiel Gallery" · Format: JPG');
    document.getElementById('dl-options').style.display = 'flex';
    document.getElementById('dl-filename').value = 'beispiel-gallery';
  }, 800);
});

document.getElementById('dl-start-btn').addEventListener('click', () => {
  const fmt = document.getElementById('dl-format').value;
  const name = document.getElementById('dl-filename').value || 'gallery';
  appendLog(`Starte Download als ${fmt.toUpperCase()}...`);
  document.getElementById('dl-progress').style.display = 'flex';
  simulateProgress(name, fmt);
});

document.getElementById('dl-batch-btn').addEventListener('click', () => {
  const lines = document.getElementById('dl-batch-input').value.split('\n').filter(l => l.trim());
  if (!lines.length) return;
  appendLog(`Batch: ${lines.length} URLs geplant`);
  lines.forEach((url, i) => setTimeout(() => appendLog(`[${i+1}/${lines.length}] ${url.trim()}`), i * 300));
});

function simulateProgress(name, fmt) {
  const bar = document.getElementById('dl-progress-bar');
  const txt = document.getElementById('dl-progress-text');
  let p = 0;
  const iv = setInterval(() => {
    p += Math.random() * 12;
    if (p >= 100) {
      p = 100;
      clearInterval(iv);
      appendLog(`Fertig! Datei: ${name}.${fmt}`);
    }
    bar.style.width = p.toFixed(0) + '%';
    txt.textContent = p.toFixed(0) + '%';
  }, 200);
}

function appendLog(msg) {
  dlLog.textContent += '\n> ' + msg;
  dlLog.scrollTop = dlLog.scrollHeight;
}

// ─── FAVORITES ────────────────────────────────────────────────────────────────
let favorites = JSON.parse(localStorage.getItem('ht_favorites') || '[]');

function saveFavorites() {
  localStorage.setItem('ht_favorites', JSON.stringify(favorites));
}

function renderFavorites(filter = '') {
  const grid = document.getElementById('fav-grid');
  const items = filter
    ? favorites.filter(f => f.title.toLowerCase().includes(filter.toLowerCase()))
    : favorites;
  document.getElementById('fav-total').textContent = favorites.length;
  if (!items.length) {
    grid.innerHTML = '<div class="fav-empty">Keine Favoriten gefunden.</div>';
    return;
  }
  grid.innerHTML = items.map((f, i) => `
    <div class="fav-card">
      <div class="fav-card-thumb">♥</div>
      <div class="fav-card-info">
        <strong>${f.title}</strong>
        <span>${f.url || 'Keine URL'}</span>
      </div>
      <button class="fav-card-remove" data-idx="${favorites.indexOf(f)}" title="Entfernen">✕</button>
    </div>`).join('');

  grid.querySelectorAll('.fav-card-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      favorites.splice(parseInt(btn.dataset.idx), 1);
      saveFavorites();
      renderFavorites();
    });
  });
}

document.getElementById('fav-manual-add').addEventListener('click', () => {
  const url = document.getElementById('fav-manual-url').value.trim();
  const title = document.getElementById('fav-manual-title').value.trim() || url || 'Unbekannt';
  if (!title && !url) return;
  favorites.push({ title, url, added: Date.now() });
  saveFavorites();
  renderFavorites();
  document.getElementById('fav-manual-url').value = '';
  document.getElementById('fav-manual-title').value = '';
});

document.getElementById('fav-search').addEventListener('input', function () {
  renderFavorites(this.value);
});

document.getElementById('fav-export-btn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(favorites, null, 2)], { type: 'application/json' });
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(blob),
    download: 'hentai-tools-favorites.json',
  });
  a.click();
});

document.getElementById('fav-import-btn').addEventListener('click', () => {
  const input = Object.assign(document.createElement('input'), { type: 'file', accept: '.json' });
  input.addEventListener('change', () => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result);
        if (Array.isArray(data)) {
          favorites = [...favorites, ...data];
          saveFavorites();
          renderFavorites();
        }
      } catch { alert('Ungültige JSON-Datei.'); }
    };
    reader.readAsText(input.files[0]);
  });
  input.click();
});

document.getElementById('new-collection-btn').addEventListener('click', () => {
  const name = prompt('Sammlungsname:');
  if (!name) return;
  const el = document.createElement('div');
  el.className = 'collection';
  el.textContent = name;
  document.getElementById('collections-list').insertBefore(el, document.getElementById('new-collection-btn'));
});

function log(msg) {
  console.log('[hentai.tools]', msg);
}

// Init
renderFavorites();
