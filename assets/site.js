(function () {
    const menuButton = document.querySelector('[data-menu-button]');
    const mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('open');
        });
    }

    const hero = document.querySelector('[data-hero]');

    if (hero) {
        const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
        const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
        const prev = hero.querySelector('[data-hero-prev]');
        const next = hero.querySelector('[data-hero-next]');
        let current = 0;
        let timer = null;

        const show = function (index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        };

        const start = function () {
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        };

        const restart = function () {
            window.clearInterval(timer);
            start();
        };

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                restart();
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
                restart();
            });
        });

        show(0);
        start();
    }

    const filterInput = document.querySelector('[data-filter-input]');
    const filterYear = document.querySelector('[data-filter-year]');
    const cards = Array.from(document.querySelectorAll('[data-card]'));

    if (cards.length && (filterInput || filterYear)) {
        const runFilter = function () {
            const keyword = filterInput ? filterInput.value.trim().toLowerCase() : '';
            const year = filterYear ? filterYear.value : '';

            cards.forEach(function (card) {
                const text = ((card.dataset.title || '') + ' ' + (card.dataset.meta || '')).toLowerCase();
                const cardYear = card.dataset.year || '';
                const keywordMatch = !keyword || text.indexOf(keyword) !== -1;
                const yearMatch = !year || cardYear === year;

                card.hidden = !(keywordMatch && yearMatch);
            });
        };

        if (filterInput) {
            filterInput.addEventListener('input', runFilter);
        }

        if (filterYear) {
            filterYear.addEventListener('change', runFilter);
        }
    }
})();
