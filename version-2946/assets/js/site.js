(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var menuToggle = document.querySelector(".menu-toggle");
    var navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
      menuToggle.addEventListener("click", function () {
        var opened = navLinks.classList.toggle("is-open");
        menuToggle.setAttribute("aria-expanded", opened ? "true" : "false");
      });
    }

    var hero = document.getElementById("hero-carousel");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var prev = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      var active = 0;
      var timer = null;

      function setSlide(index) {
        if (!slides.length) {
          return;
        }
        active = (index + slides.length) % slides.length;
        slides.forEach(function (slide, itemIndex) {
          slide.classList.toggle("is-active", itemIndex === active);
        });
        dots.forEach(function (dot, itemIndex) {
          dot.classList.toggle("is-active", itemIndex === active);
        });
      }

      function restart() {
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(function () {
          setSlide(active + 1);
        }, 5000);
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          setSlide(index);
          restart();
        });
      });

      if (prev) {
        prev.addEventListener("click", function () {
          setSlide(active - 1);
          restart();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          setSlide(active + 1);
          restart();
        });
      }

      restart();
    }

    document.querySelectorAll("[data-filter-panel]").forEach(function (panel) {
      var container = panel.parentElement || document;
      var cards = Array.prototype.slice.call(container.querySelectorAll("[data-movie-card]"));
      var searchInput = panel.querySelector("[data-search-input]");
      var yearSelect = panel.querySelector("[data-year-select]");
      var typeSelect = panel.querySelector("[data-type-select]");

      function applyFilter() {
        var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
        var year = yearSelect ? yearSelect.value : "";
        var type = typeSelect ? typeSelect.value : "";

        cards.forEach(function (card) {
          var text = [
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-year"),
            card.getAttribute("data-type"),
            card.getAttribute("data-category"),
            card.getAttribute("data-tags")
          ].join(" ").toLowerCase();
          var matchedQuery = !query || text.indexOf(query) !== -1;
          var matchedYear = !year || card.getAttribute("data-year") === year;
          var matchedType = !type || card.getAttribute("data-type") === type;
          card.classList.toggle("is-hidden", !(matchedQuery && matchedYear && matchedType));
        });
      }

      [searchInput, yearSelect, typeSelect].forEach(function (control) {
        if (control) {
          control.addEventListener("input", applyFilter);
          control.addEventListener("change", applyFilter);
        }
      });
    });
  });
})();
