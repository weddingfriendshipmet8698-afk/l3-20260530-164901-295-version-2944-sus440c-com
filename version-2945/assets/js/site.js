(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var siteNav = document.querySelector('[data-site-nav]');

    if (menuButton && siteNav) {
        menuButton.addEventListener('click', function () {
            siteNav.classList.toggle('is-open');
        });
    }

    var carousel = document.querySelector('[data-hero-carousel]');

    if (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
        var prev = carousel.querySelector('[data-hero-prev]');
        var next = carousel.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function startTimer() {
            clearInterval(timer);
            timer = setInterval(function () {
                showSlide(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                startTimer();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(index - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(index + 1);
                startTimer();
            });
        }

        startTimer();
    }

    var filterForm = document.querySelector('[data-filter-form]');

    if (filterForm) {
        var input = filterForm.querySelector('[data-filter-input]');
        var category = filterForm.querySelector('[data-category-filter]');
        var list = document.querySelector('[data-filter-list]');
        var count = document.querySelector('[data-filter-count]');
        var cards = list ? Array.prototype.slice.call(list.querySelectorAll('.movie-card')) : [];
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q') || '';

        if (input && q) {
            input.value = q;
        }

        function filterCards() {
            var keyword = input ? input.value.trim().toLowerCase() : '';
            var categoryValue = category ? category.value : '';
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute('data-title') || '',
                    card.getAttribute('data-category') || '',
                    card.getAttribute('data-year') || '',
                    card.getAttribute('data-genre') || '',
                    card.textContent || ''
                ].join(' ').toLowerCase();
                var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                var matchesCategory = !categoryValue || card.getAttribute('data-category') === categoryValue;
                var visibleCard = matchesKeyword && matchesCategory;

                card.setAttribute('data-filter-hidden', visibleCard ? 'false' : 'true');

                if (visibleCard) {
                    visible += 1;
                }
            });

            if (count) {
                count.textContent = '共 ' + visible + ' 部影片';
            }
        }

        filterForm.addEventListener('submit', function (event) {
            event.preventDefault();
            filterCards();
        });

        if (input) {
            input.addEventListener('input', filterCards);
        }

        if (category) {
            category.addEventListener('change', filterCards);
        }

        filterCards();
    }

    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player-shell]'));

    players.forEach(function (shell) {
        var video = shell.querySelector('[data-video-player]');
        var button = shell.querySelector('[data-play-trigger]');

        if (!video) {
            return;
        }

        var src = video.getAttribute('data-src');
        var hlsInstance = null;

        function attachSource() {
            if (!src || video.getAttribute('data-ready') === 'true') {
                return;
            }

            video.setAttribute('data-ready', 'true');

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });

                hlsInstance.loadSource(src);
                hlsInstance.attachMedia(video);
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = src;
            } else {
                video.src = src;
            }
        }

        function playVideo() {
            attachSource();
            var promise = video.play();

            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {});
            }
        }

        if (button) {
            button.addEventListener('click', playVideo);
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                playVideo();
            } else {
                video.pause();
            }
        });

        video.addEventListener('play', function () {
            if (button) {
                button.classList.add('is-hidden');
            }
        });

        video.addEventListener('pause', function () {
            if (button) {
                button.classList.remove('is-hidden');
            }
        });

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    });
}());
