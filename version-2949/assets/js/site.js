(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobilePanel = document.querySelector('.mobile-panel');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var tabs = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-tab]'));
    var index = 0;

    function showSlide(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      tabs.forEach(function (tab, i) {
        tab.classList.toggle('is-active', i === index);
      });
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        showSlide(i);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(index + 1);
      }, 5600);
    }
  }

  var grids = Array.prototype.slice.call(document.querySelectorAll('[data-searchable-grid]'));
  grids.forEach(function (grid) {
    var input = document.querySelector('[data-filter-input]');
    var yearSelect = document.querySelector('[data-year-filter]');
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';

    if (input && q) {
      input.value = q;
    }

    if (yearSelect) {
      var years = cards
        .map(function (card) { return card.getAttribute('data-year') || ''; })
        .filter(Boolean)
        .filter(function (value, index, array) { return array.indexOf(value) === index; })
        .sort(function (a, b) { return Number(b) - Number(a); });

      years.forEach(function (year) {
        var option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
      });
    }

    function applyFilter() {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var year = yearSelect ? yearSelect.value : '';
      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year'),
          card.getAttribute('data-tags'),
          card.textContent
        ].join(' ').toLowerCase();
        var yearOk = !year || card.getAttribute('data-year') === year;
        var keywordOk = !keyword || haystack.indexOf(keyword) !== -1;
        card.classList.toggle('is-filter-hidden', !(yearOk && keywordOk));
      });
    }

    if (input) {
      input.addEventListener('input', applyFilter);
    }

    if (yearSelect) {
      yearSelect.addEventListener('change', applyFilter);
    }

    applyFilter();
  });
})();
