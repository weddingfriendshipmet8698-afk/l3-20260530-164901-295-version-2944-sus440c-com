(function () {
    window.initMoviePlayer = function (playbackUrl) {
        const video = document.querySelector('[data-player-video]');
        const overlay = document.querySelector('[data-player-overlay]');

        if (!video || !playbackUrl) {
            return;
        }

        const hideOverlay = function () {
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
        };

        const showOverlay = function () {
            if (overlay && video.currentTime === 0) {
                overlay.classList.remove('is-hidden');
            }
        };

        const start = function () {
            hideOverlay();
            const action = video.play();

            if (action && typeof action.catch === 'function') {
                action.catch(function () {
                    if (overlay) {
                        overlay.classList.remove('is-hidden');
                    }
                });
            }
        };

        if (window.Hls && window.Hls.isSupported()) {
            const hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: false
            });
            hls.loadSource(playbackUrl);
            hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = playbackUrl;
        } else {
            video.src = playbackUrl;
        }

        if (overlay) {
            overlay.addEventListener('click', start);
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                start();
            } else {
                video.pause();
            }
        });

        video.addEventListener('play', hideOverlay);
        video.addEventListener('ended', showOverlay);
    };
})();
