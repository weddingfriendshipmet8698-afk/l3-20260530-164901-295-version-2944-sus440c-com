(function () {
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[src="' + src + '"]');
      if (existing) {
        existing.addEventListener("load", resolve);
        existing.addEventListener("error", reject);
        if (window.Hls) {
          resolve();
        }
        return;
      }
      var script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  window.setupMoviePlayer = function (streamUrl) {
    var video = document.getElementById("movie-player");
    var trigger = document.getElementById("player-overlay");
    var hlsInstance = null;
    var attached = false;

    if (!video || !streamUrl) {
      return;
    }

    function showTrigger() {
      if (trigger) {
        trigger.classList.remove("is-hidden");
      }
    }

    function hideTrigger() {
      if (trigger) {
        trigger.classList.add("is-hidden");
      }
    }

    function playVideo() {
      hideTrigger();
      var result = video.play();
      if (result && typeof result.catch === "function") {
        result.catch(function () {
          showTrigger();
        });
      }
    }

    function attachWithHls() {
      if (attached) {
        playVideo();
        return;
      }

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
        attached = true;
        playVideo();
        return;
      }

      function useHls() {
        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({ enableWorker: true });
          hlsInstance.loadSource(streamUrl);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
            attached = true;
            playVideo();
          });
          hlsInstance.on(window.Hls.Events.ERROR, function (eventName, data) {
            if (data && data.fatal) {
              showTrigger();
            }
          });
        } else {
          video.src = streamUrl;
          attached = true;
          playVideo();
        }
      }

      if (window.Hls) {
        useHls();
      } else {
        loadScript("https://cdn.jsdelivr.net/npm/hls.js@latest").then(useHls).catch(function () {
          video.src = streamUrl;
          attached = true;
          playVideo();
        });
      }
    }

    if (trigger) {
      trigger.addEventListener("click", function () {
        attachWithHls();
      });
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        attachWithHls();
      } else {
        video.pause();
      }
    });

    video.addEventListener("play", hideTrigger);
    video.addEventListener("pause", function () {
      if (!video.ended) {
        showTrigger();
      }
    });
    video.addEventListener("ended", showTrigger);

    window.addEventListener("beforeunload", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };
})();
