(function () {
  const query = (selector, scope) => (scope || document).querySelector(selector);
  const queryAll = (selector, scope) => Array.from((scope || document).querySelectorAll(selector));

  const menuButton = query('[data-menu-toggle]');
  const mobileMenu = query('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  const hero = query('[data-hero]');

  if (hero) {
    const slides = queryAll('[data-hero-slide]', hero);
    const dots = queryAll('[data-hero-dot]', hero);
    const prev = query('[data-hero-prev]', hero);
    const next = query('[data-hero-next]', hero);
    let index = 0;
    let timer = null;

    const show = function (nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    };

    const play = function () {
      clearInterval(timer);
      timer = setInterval(function () {
        show(index + 1);
      }, 5000);
    };

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        play();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        play();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        play();
      });
    }

    play();
  }

  const filterPanel = query('[data-card-filter]');

  if (filterPanel) {
    const cards = queryAll('[data-card]');
    const keywordInput = query('[data-filter-keyword]', filterPanel);
    const yearSelect = query('[data-filter-year]', filterPanel);
    const regionSelect = query('[data-filter-region]', filterPanel);
    const typeSelect = query('[data-filter-type]', filterPanel);
    const categorySelect = query('[data-filter-category]', filterPanel);
    const emptyState = query('[data-empty-state]');
    const params = new URLSearchParams(window.location.search);
    const initialKeyword = params.get('q') || '';

    if (keywordInput && initialKeyword) {
      keywordInput.value = initialKeyword;
    }

    const normalize = function (value) {
      return String(value || '').trim().toLowerCase();
    };

    const apply = function () {
      const keyword = normalize(keywordInput && keywordInput.value);
      const year = normalize(yearSelect && yearSelect.value);
      const region = normalize(regionSelect && regionSelect.value);
      const type = normalize(typeSelect && typeSelect.value);
      const category = normalize(categorySelect && categorySelect.value);
      let visible = 0;

      cards.forEach(function (card) {
        const haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year'),
          card.getAttribute('data-tags')
        ].join(' '));
        const matchKeyword = !keyword || haystack.includes(keyword);
        const matchYear = !year || normalize(card.getAttribute('data-year')) === year;
        const matchRegion = !region || normalize(card.getAttribute('data-region')) === region;
        const matchType = !type || normalize(card.getAttribute('data-type')) === type;
        const matchCategory = !category || normalize(card.getAttribute('data-category')) === category;
        const matched = matchKeyword && matchYear && matchRegion && matchType && matchCategory;
        card.classList.toggle('is-hidden', !matched);
        if (matched) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle('is-visible', visible === 0);
      }
    };

    [keywordInput, yearSelect, regionSelect, typeSelect, categorySelect].forEach(function (control) {
      if (!control) {
        return;
      }
      control.addEventListener('input', apply);
      control.addEventListener('change', apply);
    });

    apply();
  }

  const playerWrap = query('[data-player-wrap]');

  if (playerWrap) {
    const video = query('[data-player]', playerWrap);
    const cover = query('[data-play]', playerWrap);
    const source = video ? query('source', video) : null;
    let hlsInstance = null;
    let prepared = false;

    const prepare = function () {
      if (!video || !source || prepared) {
        return;
      }

      const url = source.getAttribute('src');
      const nativeHls = video.canPlayType('application/vnd.apple.mpegurl') || video.canPlayType('application/x-mpegURL');

      if (window.Hls && window.Hls.isSupported() && !nativeHls) {
        hlsInstance = new window.Hls();
        hlsInstance.loadSource(url);
        hlsInstance.attachMedia(video);
      } else {
        video.src = url;
      }

      prepared = true;
    };

    const start = function () {
      prepare();

      if (cover) {
        cover.classList.add('is-hidden');
      }

      const promise = video.play();

      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    };

    if (cover) {
      cover.addEventListener('click', start);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          start();
        } else {
          video.pause();
        }
      });
    }

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }
})();
