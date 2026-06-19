(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    bindMenu();
    bindSearch();
    bindImages();
    bindPlayers();
  });

  function bindMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      toggle.textContent = nav.classList.contains('open') ? '×' : '☰';
    });
  }

  function bindImages() {
    document.querySelectorAll('img').forEach(function (img) {
      img.addEventListener('error', function () {
        img.classList.add('image-fade');
      }, { once: true });
    });
  }

  function bindSearch() {
    var inputs = document.querySelectorAll('[data-search-input]');
    var catalog = Array.isArray(window.siteCatalog) ? window.siteCatalog : [];
    inputs.forEach(function (input) {
      var results = input.parentElement.querySelector('[data-search-results]');
      if (!results) {
        return;
      }
      input.addEventListener('input', function () {
        var query = input.value.trim().toLowerCase();
        results.innerHTML = '';
        if (!query) {
          results.classList.remove('open');
          return;
        }
        var matches = catalog.filter(function (item) {
          return [item.title, item.region, item.type, item.year, item.genre, item.description]
            .join(' ')
            .toLowerCase()
            .indexOf(query) !== -1;
        }).slice(0, 10);
        if (!matches.length) {
          results.innerHTML = '<span class="empty-result">未找到相关影片</span>';
          results.classList.add('open');
          return;
        }
        matches.forEach(function (item) {
          var link = document.createElement('a');
          link.href = item.url;
          link.innerHTML = '<strong>' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(item.region + ' · ' + item.type + ' · ' + item.year) + '</span>';
          results.appendChild(link);
        });
        results.classList.add('open');
      });
      document.addEventListener('click', function (event) {
        if (!input.parentElement.contains(event.target)) {
          results.classList.remove('open');
        }
      });
    });
  }

  function bindPlayers() {
    document.querySelectorAll('[data-player]').forEach(function (player) {
      var video = player.querySelector('video');
      var source = video ? video.getAttribute('data-stream') : '';
      var message = player.querySelector('[data-player-message]');
      var initialized = false;
      var hls = null;
      if (!video || !source) {
        return;
      }

      function showMessage(text) {
        if (!message) {
          return;
        }
        message.textContent = text;
        player.classList.add('has-message');
      }

      function initSource() {
        if (initialized) {
          return;
        }
        initialized = true;
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(source);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.ERROR, function (_, data) {
            if (!data || !data.fatal) {
              return;
            }
            if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
              hls.startLoad();
              showMessage('视频加载遇到网络波动');
            } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
              hls.recoverMediaError();
              showMessage('视频播放正在恢复');
            } else {
              showMessage('视频暂时无法播放');
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else {
          video.src = source;
        }
      }

      function playToggle() {
        initSource();
        if (video.paused) {
          var playPromise = video.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
              showMessage('请再次点击播放');
            });
          }
        } else {
          video.pause();
        }
      }

      player.querySelectorAll('[data-player-play]').forEach(function (button) {
        button.addEventListener('click', playToggle);
      });
      var mute = player.querySelector('[data-player-mute]');
      if (mute) {
        mute.addEventListener('click', function () {
          video.muted = !video.muted;
          mute.textContent = video.muted ? '取消静音' : '静音';
        });
      }
      var fullscreen = player.querySelector('[data-player-fullscreen]');
      if (fullscreen) {
        fullscreen.addEventListener('click', function () {
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else if (player.requestFullscreen) {
            player.requestFullscreen();
          }
        });
      }
      video.addEventListener('click', playToggle);
      video.addEventListener('play', function () {
        player.classList.add('is-playing');
        player.classList.remove('has-message');
      });
      video.addEventListener('pause', function () {
        player.classList.remove('is-playing');
      });
      window.addEventListener('beforeunload', function () {
        if (hls) {
          hls.destroy();
        }
      });
    });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[char];
    });
  }
})();
