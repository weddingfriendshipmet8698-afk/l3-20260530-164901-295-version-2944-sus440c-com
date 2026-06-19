(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function bySel(sel, root) {
    return (root || document).querySelector(sel);
  }

  function allSel(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  function initNav() {
    var path = location.pathname.replace(/\\/g, '/');
    allSel('.nav a').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      if (href === 'index.html' && (path === '/' || /index\.html?$/.test(path))) {
        a.classList.add('active');
      }
      if (href !== 'index.html' && path.indexOf(href) !== -1) {
        a.classList.add('active');
      }
    });
  }

  function initHeroSlider() {
    var root = bySel('[data-hero-slider]');
    if (!root) return;
    var slides = allSel('.slide', root);
    if (slides.length <= 1) return;
    var index = 0;
    var timer;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (s, i) {
        s.classList.toggle('active', i === index);
      });
      var dots = allSel('[data-slide-dot]', root);
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    function play() {
      timer = setInterval(function () {
        show(index + 1);
      }, 4200);
    }

    function stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    var prev = bySel('[data-prev]', root);
    var next = bySel('[data-next]', root);
    if (prev) prev.addEventListener('click', function () { stop(); show(index - 1); play(); });
    if (next) next.addEventListener('click', function () { stop(); show(index + 1); play(); });

    allSel('[data-slide-dot]', root).forEach(function (dot) {
      dot.addEventListener('click', function () {
        var i = parseInt(dot.getAttribute('data-slide-dot'), 10) || 0;
        stop();
        show(i);
        play();
      });
    });

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', play);

    show(0);
    play();
  }

  function filterCards(root, query, opts) {
    var cards = allSel('[data-filter-item]', root);
    var count = 0;
    var q = (query || '').trim().toLowerCase();
    cards.forEach(function (card) {
      var hay = (card.getAttribute('data-search') || '').toLowerCase();
      var type = (card.getAttribute('data-type') || '').toLowerCase();
      var year = (card.getAttribute('data-year') || '').toLowerCase();
      var region = (card.getAttribute('data-region') || '').toLowerCase();
      var genre = (card.getAttribute('data-genre') || '').toLowerCase();
      var ok = true;
      if (q) ok = hay.indexOf(q) !== -1;
      if (ok && opts && opts.type && opts.type !== 'all') ok = type === opts.type.toLowerCase();
      if (ok && opts && opts.year && opts.year !== 'all') ok = year === opts.year;
      if (ok && opts && opts.region && opts.region !== 'all') ok = region === opts.region.toLowerCase();
      if (ok && opts && opts.genre && opts.genre !== 'all') ok = genre.indexOf(opts.genre.toLowerCase()) !== -1;
      card.style.display = ok ? '' : 'none';
      if (ok) count += 1;
    });
    var targetCount = bySel('[data-result-count]', root);
    if (targetCount) targetCount.textContent = count;
    var empty = bySel('[data-empty]', root);
    if (empty) empty.style.display = count ? 'none' : 'block';
  }

  function initFilters() {
    allSel('[data-filter-root]').forEach(function (root) {
      var input = bySel('[data-search-input]', root);
      var type = bySel('[data-type-filter]', root);
      var year = bySel('[data-year-filter]', root);
      var region = bySel('[data-region-filter]', root);
      var genre = bySel('[data-genre-filter]', root);
      function update() {
        filterCards(root, input ? input.value : '', {
          type: type ? type.value : 'all',
          year: year ? year.value : 'all',
          region: region ? region.value : 'all',
          genre: genre ? genre.value : 'all'
        });
      }
      [input, type, year, region, genre].forEach(function (el) {
        if (el) el.addEventListener('input', update);
        if (el) el.addEventListener('change', update);
      });
      update();
    });
  }

  function initVideoPlayers() {
    allSel('video[data-hls]').forEach(function (video) {
      var hls = video.getAttribute('data-hls');
      var mp4 = video.getAttribute('data-mp4');
      if (!hls || !mp4) return;
      // Native HLS where available; otherwise keep MP4 fallback.
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = hls;
        video.setAttribute('data-source-mode', 'hls-native');
      } else {
        video.src = mp4;
        video.setAttribute('data-source-mode', 'mp4-fallback');
      }
    });
  }

  function initSmoothJump() {
    allSel('[data-scroll-to]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var id = btn.getAttribute('data-scroll-to');
        if (!id) return;
        var el = document.getElementById(id);
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  ready(function () {
    initNav();
    initHeroSlider();
    initFilters();
    initVideoPlayers();
    initSmoothJump();
  });
})();
