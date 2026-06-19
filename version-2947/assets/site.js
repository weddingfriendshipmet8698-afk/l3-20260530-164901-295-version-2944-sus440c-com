
(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var scopes = document.querySelectorAll('[data-filter-scope]');

  scopes.forEach(function (scope) {
    var input = scope.querySelector('[data-filter-input]');
    var typeSelect = scope.querySelector('[data-filter-type]');
    var yearSelect = scope.querySelector('[data-filter-year]');
    var cards = scope.querySelectorAll('[data-card]');

    function applyFilter() {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var type = typeSelect ? typeSelect.value.trim() : '';
      var year = yearSelect ? yearSelect.value.trim() : '';

      cards.forEach(function (card) {
        var content = [
          card.dataset.title || '',
          card.dataset.type || '',
          card.dataset.region || '',
          card.dataset.year || '',
          card.dataset.genre || ''
        ].join(' ').toLowerCase();
        var matchKeyword = !keyword || content.indexOf(keyword) !== -1;
        var matchType = !type || (card.dataset.type || '').indexOf(type) !== -1;
        var matchYear = !year || card.dataset.year === year;
        card.hidden = !(matchKeyword && matchType && matchYear);
      });
    }

    if (input) {
      input.addEventListener('input', applyFilter);
    }

    if (typeSelect) {
      typeSelect.addEventListener('change', applyFilter);
    }

    if (yearSelect) {
      yearSelect.addEventListener('change', applyFilter);
    }
  });

  document.querySelectorAll('.player-shell').forEach(function (shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('.play-overlay');
    var stream = shell.dataset.stream;
    var hlsInstance = null;
    var started = false;

    function loadStream() {
      if (!video || !stream || started) {
        return;
      }

      started = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
      } else {
        video.src = stream;
      }
    }

    function playVideo() {
      loadStream();
      shell.classList.add('is-playing');
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        playVideo();
      });
    }

    shell.addEventListener('click', function (event) {
      if (event.target === video && !started) {
        playVideo();
      }
    });

    video.addEventListener('play', function () {
      shell.classList.add('is-playing');
    });

    video.addEventListener('ended', function () {
      shell.classList.remove('is-playing');
    });

    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
})();
