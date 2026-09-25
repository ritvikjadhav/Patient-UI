"use strict";

/*
=========================================================
CLINIC CARE — PATIENT HOME
Production-ready homepage interactions
=========================================================

Responsibilities:
- Smooth anchor navigation
- Scroll reveal animations
- Staggered card entrance
- Mobile navigation active state
- Button press feedback
- Live-status visual state
- Reduced-motion accessibility
- No fake queue data
- No database/API logic

Backend queue data belongs in queue.js / token.js.
=========================================================
*/


document.addEventListener("DOMContentLoaded", () => {

  /* =====================================================
     ELEMENTS
     ===================================================== */

  const body = document.body;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const mobileNavItems = document.querySelectorAll(
    ".mobile-nav-item"
  );

  const revealSections = document.querySelectorAll(
    ".hero-section, " +
    ".visit-section, " +
    ".services-section, " +
    ".how-section, " +
    ".privacy-notice"
  );

  const revealCards = document.querySelectorAll(
    ".tracking-card, " +
    ".service-card, " +
    ".step"
  );


  /* =====================================================
     PAGE READY
     ===================================================== */

  requestAnimationFrame(() => {
    body.classList.add("page-ready");
    body.classList.add("initialized");
  });


  /* =====================================================
     REDUCED MOTION
     ===================================================== */

  const applyMotionPreference = () => {

    if (reduceMotion.matches) {

      document.documentElement.classList.add(
        "reduce-motion"
      );

    } else {

      document.documentElement.classList.remove(
        "reduce-motion"
      );

    }

  };

  applyMotionPreference();


  if (
    typeof reduceMotion.addEventListener === "function"
  ) {

    reduceMotion.addEventListener(
      "change",
      applyMotionPreference
    );

  }


  /* =====================================================
     SMOOTH INTERNAL NAVIGATION
     ===================================================== */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach((link) => {

      link.addEventListener("click", (event) => {

        const targetId = link
          .getAttribute("href")
          ?.substring(1);

        if (!targetId) {
          return;
        }

        const target = document.getElementById(
          targetId
        );

        if (!target) {
          return;
        }

        event.preventDefault();

        const header = document.querySelector(
          ".app-header"
        );

        const headerHeight = header
          ? header.offsetHeight
          : 0;

        const targetPosition =
          target.getBoundingClientRect().top +
          window.scrollY -
          headerHeight -
          20;


        if (reduceMotion.matches) {

          window.scrollTo(
            0,
            Math.max(0, targetPosition)
          );

        } else {

          window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: "smooth"
          });

        }


        /* Update URL without reloading */

        if (
          window.history &&
          typeof window.history.pushState === "function"
        ) {

          window.history.pushState(
            null,
            "",
            `#${targetId}`
          );

        }

      });

    });


  /* =====================================================
     SCROLL REVEAL
     ===================================================== */

  if (
    "IntersectionObserver" in window &&
    !reduceMotion.matches
  ) {

    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add(
              "is-visible"
            );

            observer.unobserve(
              entry.target
            );

          });

        },
        {
          threshold: 0.08,

          rootMargin:
            "0px 0px -50px 0px"
        }
      );


    /* Sections */

    revealSections.forEach((section) => {

      if (
        section.classList.contains(
          "hero-section"
        )
      ) {
        return;
      }

      section.classList.add(
        "reveal-on-scroll"
      );

      revealObserver.observe(section);

    });


    /* Cards */

    revealCards.forEach((card, index) => {

      card.classList.add(
        "reveal-card"
      );

      /*
        Small stagger without making the page
        feel like a presentation animation.
      */

      card.style.setProperty(
        "--reveal-delay",
        `${Math.min(index * 70, 280)}ms`
      );

      revealObserver.observe(card);

    });

  } else {

    /*
      Accessibility fallback:
      everything is immediately visible.
    */

    revealSections.forEach((section) => {
      section.classList.add("is-visible");
    });

    revealCards.forEach((card) => {
      card.classList.add("is-visible");
    });

  }


  /* =====================================================
     MOBILE NAV ACTIVE STATE
     ===================================================== */

  const currentPath =
    window.location.pathname
      .split("/")
      .pop() || "index.html";


  mobileNavItems.forEach((item) => {

    const href = item.getAttribute("href");

    if (!href) {
      return;
    }

    const itemPath =
      href.split("/").pop() || "index.html";

    item.classList.remove("active");

    if (
      itemPath === currentPath ||
      (
        currentPath === "" &&
        itemPath === "index.html"
      )
    ) {

      item.classList.add("active");

      item.setAttribute(
        "aria-current",
        "page"
      );

    } else {

      item.removeAttribute(
        "aria-current"
      );

    }

  });


  /* =====================================================
     BUTTON PRESS FEEDBACK
     ===================================================== */

  const interactiveElements =
    document.querySelectorAll(
      ".hero-primary-action, " +
      ".hero-secondary-action, " +
      ".tracking-card, " +
      ".service-card, " +
      ".mobile-nav-item"
    );


  interactiveElements.forEach((element) => {

    element.addEventListener(
      "pointerdown",
      () => {

        if (reduceMotion.matches) {
          return;
        }

        element.classList.add(
          "is-pressed"
        );

      }
    );


    const removePressedState = () => {

      element.classList.remove(
        "is-pressed"
      );

    };


    element.addEventListener(
      "pointerup",
      removePressedState
    );

    element.addEventListener(
      "pointercancel",
      removePressedState
    );

    element.addEventListener(
      "pointerleave",
      removePressedState
    );

  });


  /* =====================================================
     LIVE STATUS
     ===================================================== */

  const liveIndicators =
    document.querySelectorAll(
      ".status-live, .live-badge"
    );


  liveIndicators.forEach((indicator) => {

    indicator.setAttribute(
      "aria-label",
      "Clinic queue is currently live"
    );

  });


  /* =====================================================
     KEYBOARD ACCESSIBILITY
     ===================================================== */

  document.addEventListener(
    "keydown",
    (event) => {

      /*
        Escape only removes temporary interaction
        states. It does not interfere with forms.
      */

      if (event.key !== "Escape") {
        return;
      }

      document
        .querySelectorAll(".is-pressed")
        .forEach((element) => {

          element.classList.remove(
            "is-pressed"
          );

        });

    }
  );


  /* =====================================================
     PAGE VISIBILITY
     ===================================================== */

  document.addEventListener(
    "visibilitychange",
    () => {

      /*
        The homepage does not poll the backend.
        When the user returns to the page, queue.js
        can handle fresh queue data if required.
      */

      if (
        document.visibilityState === "visible"
      ) {

        body.classList.add(
          "page-active"
        );

      }

    }
  );


  /* =====================================================
     FINAL INITIALIZATION
     ===================================================== */

  window.setTimeout(() => {

    body.classList.add(
      "home-loaded"
    );

  }, reduceMotion.matches ? 0 : 120);

});