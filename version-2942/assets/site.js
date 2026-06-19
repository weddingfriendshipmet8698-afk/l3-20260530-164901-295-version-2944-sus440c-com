(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var menu = document.querySelector('[data-menu]');
  if (menuButton && menu) {
    menuButton.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dotsBox = hero.querySelector('[data-hero-dots]');
    var index = 0;
    var dots = [];

    function showSlide(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    if (dotsBox) {
      slides.forEach(function (_, i) {
        var button = document.createElement('button');
        button.type = 'button';
        button.addEventListener('click', function () {
          showSlide(i);
        });
        dotsBox.appendChild(button);
        dots.push(button);
      });
    }

    showSlide(0);
    window.setInterval(function () {
      showSlide(index + 1);
    }, 5200);
  }

  var searchForm = document.querySelector('[data-search-form]');
  var searchInput = document.querySelector('[data-search-input]');
  var searchList = document.querySelector('[data-search-list]');
  if (searchForm && searchInput && searchList) {
    var cards = Array.prototype.slice.call(searchList.querySelectorAll('.movie-card'));
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
    });
    searchInput.addEventListener('input', function () {
      var q = searchInput.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var text = card.innerText.toLowerCase();
        card.style.display = !q || text.indexOf(q) !== -1 ? '' : 'none';
      });
    });
  }

  var player = document.querySelector('[data-player]');
  if (player) {
    var video = player.querySelector('video');
    var button = player.querySelector('.play-btn');
    var hlsInstance = null;
    var prepared = false;

    function startPlayer() {
      if (!video) {
        return;
      }
      var source = video.getAttribute('data-source');
      if (!source) {
        return;
      }
      if (!prepared) {
        prepared = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
        } else {
          video.src = source;
        }
      }
      player.classList.add('playing');
      video.controls = true;
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          player.classList.remove('playing');
        });
      }
    }

    if (button) {
      button.addEventListener('click', startPlayer);
    }
    video.addEventListener('click', function () {
      if (!prepared || video.paused) {
        startPlayer();
      }
    });
    video.addEventListener('play', function () {
      player.classList.add('playing');
    });
    video.addEventListener('pause', function () {
      if (!video.ended) {
        player.classList.remove('playing');
      }
    });
    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }
})();
