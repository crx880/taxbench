/* ============================================================
   TaxBench – Site-wide JavaScript
   Mobile nav, theme toggle, active nav link highlight.
   ============================================================ */

(function () {
  "use strict";

  /* ---- Theme Toggle ---- */
  function getTheme() {
    var stored = localStorage.getItem("cti-theme");
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("cti-theme", theme);
    var toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      toggle.textContent = theme === "dark" ? "Light" : "Dark";
    }
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute("data-theme") || "light";
    applyTheme(current === "dark" ? "light" : "dark");
  }

  /* ---- Mobile Nav ---- */
  function initMobileNav() {
    var toggle = document.querySelector(".mobile-nav-toggle");
    var nav = document.querySelector(".site-nav__links");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.addEventListener("click", function (e) {
      if (!nav.contains(e.target) && e.target !== toggle) {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- Active Nav Link ---- */
  function setActiveNav() {
    var path = window.location.pathname;
    var links = document.querySelectorAll(".site-nav__links a");
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute("href");
      if (href === "/" && (path === "/" || path.endsWith("index.html"))) {
        links[i].classList.add("active");
      } else if (href && href !== "/" && path.indexOf(href.replace(/\/$/, "").split("/").pop()) !== -1) {
        links[i].classList.add("active");
      }
    }
  }

  /* ---- Init ---- */
  function init() {
    applyTheme(getTheme());

    var themeToggle = document.querySelector(".theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", toggleTheme);
    }

    initMobileNav();
    setActiveNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
