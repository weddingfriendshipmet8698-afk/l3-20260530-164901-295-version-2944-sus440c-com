
(function () {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => nav.classList.toggle('open'));
  }

  const backtop = document.querySelector('[data-backtop]');
  if (backtop) {
    const onScroll = () => backtop.classList.toggle('show', window.scrollY > 500);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    backtop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  document.querySelectorAll('[data-filter-input]').forEach((input) => {
    const target = input.getAttribute('data-filter-input');
    const grid = document.querySelector(target);
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll('[data-search]'));
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      cards.forEach((card) => {
        const txt = (card.getAttribute('data-search') || '').toLowerCase();
        card.style.display = !q || txt.includes(q) ? '' : 'none';
      });
    });
  });

  document.querySelectorAll('[data-sort-select]').forEach((select) => {
    const target = select.getAttribute('data-sort-select');
    const grid = document.querySelector(target);
    if (!grid) return;
    const original = Array.from(grid.children);
    select.addEventListener('change', () => {
      const val = select.value;
      const children = Array.from(grid.children);
      children.sort((a, b) => {
        const ay = parseInt(a.getAttribute('data-year') || '0', 10);
        const by = parseInt(b.getAttribute('data-year') || '0', 10);
        const as = parseInt(a.getAttribute('data-score') || '0', 10);
        const bs = parseInt(b.getAttribute('data-score') || '0', 10);
        if (val === 'year-desc') return by - ay;
        if (val === 'year-asc') return ay - by;
        if (val === 'title-asc') return (a.textContent || '').localeCompare(b.textContent || '', 'zh');
        if (val === 'score-desc') return bs - as;
        return 0;
      });
      children.forEach((el) => grid.appendChild(el));
    });
    select.addEventListener('dblclick', () => original.forEach((el) => grid.appendChild(el)));
  });

  // Search page / query-driven search.
  const searchRoot = document.querySelector('[data-search-page]');
  if (searchRoot && Array.isArray(window.SITE_CATALOG)) {
    const input = document.querySelector('[data-search-query]');
    const results = document.querySelector('[data-search-results]');
    const count = document.querySelector('[data-search-count]');
    const params = new URLSearchParams(location.search);
    const initial = (params.get('q') || '').trim();
    if (input) input.value = initial;

    const render = () => {
      const q = (input.value || '').trim().toLowerCase();
      const items = !q ? window.SITE_CATALOG.slice(0, 120) : window.SITE_CATALOG.filter((x) => {
        const hay = [x.title, x.region, x.type, x.genre, x.tags, x.one_line].join(' ').toLowerCase();
        return hay.includes(q);
      }).slice(0, 200);
      if (count) count.textContent = String(items.length);
      results.innerHTML = items.map((x) => `
        <a class="search-result" href="movies/movie-${x.id}.html" style="--accent:${x.accent};--accent2:${x.accent2};">
          <div class="mini">${x.id}</div>
          <div class="mini-body">
            <h3>${x.title}</h3>
            <div class="meta-row"><span>${x.region}</span><span>·</span><span>${x.year}</span><span>·</span><span>${x.type}</span></div>
            <div class="card-desc">${x.one_line}</div>
          </div>
        </a>
      `).join('') || '<div class="panel">没有找到匹配内容。</div>';
    };
    render();
    input.addEventListener('input', render);
  }

  const playBtn = document.querySelector('[data-play-toggle]');
  const video = document.querySelector('video[data-player]');
  if (playBtn && video) {
    playBtn.addEventListener('click', () => {
      if (video.paused) video.play(); else video.pause();
    });
  }
})();
