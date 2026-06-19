(function () {
  var video = document.getElementById('video-player');
  var start = document.querySelector('[data-player-start]');

  if (!video || !start) {
    return;
  }

  var url = video.getAttribute('data-video');
  var ready = false;

  function attach() {
    if (ready || !url) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      ready = true;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(url);
      hls.attachMedia(video);
      ready = true;
      return;
    }

    video.src = url;
    ready = true;
  }

  function play() {
    attach();
    start.classList.add('is-hidden');
    var promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {
        start.classList.remove('is-hidden');
      });
    }
  }

  start.addEventListener('click', play);
  video.addEventListener('click', function () {
    if (video.paused) {
      play();
    }
  });
  video.addEventListener('play', function () {
    start.classList.add('is-hidden');
  });
  video.addEventListener('pause', function () {
    start.classList.remove('is-hidden');
  });
})();
