"use strict";

/*
  =========================================================
  CLINICCARE — HOME PAGE JAVASCRIPT
  =========================================================

  V1 PURPOSE:
  - Smooth page interactions
  - Smooth "How it works" navigation
  - Lightweight reveal animations
  - No unnecessary polling or heavy effects
  - Safe for future backend/API integration

  BACKEND / API:
  The homepage does not need to call the backend directly in V1.
  Queue data should be fetched on queue.js / token.js.

  Future API example:

  const API_BASE_URL = "https://your-api.com/api";

  async function getClinicStatus() {
    const response = await fetch(`${API_BASE_URL}/queue/status`);
    return response.json();
  }

  Keep backend/API logic separate from UI animation logic.
*/


document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     ELEMENTS
     ======================================================= */

  const page = document.body;

  const howItWorksLink = document.querySelector(
    'a[href="#how-it-works"]'
  );

  const sections = document.querySelectorAll(
    ".hero-section, .visit-section, .services-section, .how-section, .privacy-notice"
  );

  const cards = document.querySelectorAll(
    ".tracking-card, .service-card, .step"
  );


  /* =======================================================
     PAGE READY
     ======================================================= */

  page.classList.add("page-ready");


  /* =======================================================
     SMOOTH HOW-IT-WORKS SCROLL
     ======================================================= */

  if (howItWorksLink) {

    howItWorksLink.addEventListener("click", (event) => {

      const target = document.querySelector("#how-it-works");

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      /*
        Update the URL without forcing a page reload.
      */

      if (window.history && window.history.replaceState) {

        window.history.replaceState(
          null,
          "",
          "#how-it-works"
        );

      }

    });

  }


  /* =======================================================
     SCROLL REVEAL
     =======================================================

     Uses IntersectionObserver instead of scroll events.
     This keeps the page smooth and lightweight.
  */

  if (
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");

          observer.unobserve(entry.target);

        });

      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
      }
    );


    sections.forEach((section) => {

      if (!section.classList.contains("hero-section")) {

        section.classList.add("reveal-on-scroll");

        revealObserver.observe(section);

      }

    });


    cards.forEach((card) => {

      card.classList.add("reveal-card");

      revealObserver.observe(card);

    });

  }


  /* =======================================================
     REDUCED MOTION SUPPORT
     ======================================================= */

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  if (reducedMotion.matches) {

    document.documentElement.style.scrollBehavior = "auto";

  }


  /*
    If the user changes their system motion preference
    while the page is open, respect the new setting.
  */

  if (typeof reducedMotion.addEventListener === "function") {

    reducedMotion.addEventListener("change", (event) => {

      if (event.matches) {

        document.documentElement.style.scrollBehavior = "auto";

      } else {

        document.documentElement.style.scrollBehavior = "smooth";

      }

    });

  }


  /* =======================================================
     MOBILE NAV — ACTIVE STATE
     =======================================================

     The HTML already contains the correct active state.
     This only prevents accidental double navigation logic.
  */

  const currentPage = "index.html";

  document
    .querySelectorAll(".mobile-nav-item")
    .forEach((item) => {

      const href = item.getAttribute("href");

      if (
        href === currentPage ||
        href === "./" ||
        href === ""
      ) {

        item.classList.add("active");

      }

    });


  /* =======================================================
     KEYBOARD / ACCESSIBILITY
     ======================================================= */

  document.addEventListener("keydown", (event) => {

    /*
      Escape returns focus to the top-level page.
      This is intentionally lightweight and does not
      interfere with normal form or navigation behaviour.
    */

    if (event.key === "Escape") {

      const activeElement = document.activeElement;

      if (
        activeElement &&
        typeof activeElement.blur === "function"
      ) {

        activeElement.blur();

      }

    }

  });


  /* =======================================================
     BACKEND PLACEHOLDER
     =======================================================

     Do NOT connect the homepage directly to the database.

     Recommended architecture:

       Registration
          ↓
       Backend API
          ↓
       Database
          ↓
       Queue / Token API
          ↓
       queue.js / token.js

     The homepage only provides navigation.

     Example future API:

       GET /api/clinic/status

     Example response:

       {
         "isOpen": true,
         "queueStatus": "live"
       }

     Then the clinic-status UI can be updated here.

     IMPORTANT:
     Never put database credentials, API secrets,
     passwords or private keys inside this JavaScript file.
  */


  /* =======================================================
     CLEAN PAGE INITIALIZATION
     ======================================================= */

  requestAnimationFrame(() => {

    page.classList.add("initialized");

  });

});