"use strict";

/* =========================================================
   CLINIC AUTOMATION — PATIENT HOME
   File: js/home.js
   Version: V1
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     REDUCED MOTION
     Respect the user's accessibility preference.
     ======================================================= */

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  /* =======================================================
     PAGE LOAD
     ======================================================= */

  document.body.classList.add("page-ready");


  /* =======================================================
     SCROLL REVEAL
     Lightweight IntersectionObserver animation.
     ======================================================= */

  if (!prefersReducedMotion && "IntersectionObserver" in window) {

    const revealElements = document.querySelectorAll(
      ".primary-action-section, " +
      ".tracking-section, " +
      ".services-section, " +
      ".how-section, " +
      ".privacy-notice"
    );

    revealElements.forEach((element) => {
      element.classList.add("reveal-on-scroll");
    });


    const observer = new IntersectionObserver(
      (entries, observerInstance) => {

        entries.forEach((entry) => {

          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");

          observerInstance.unobserve(entry.target);

        });

      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -35px 0px"
      }
    );


    revealElements.forEach((element) => {
      observer.observe(element);
    });

  }


  /* =======================================================
     REGISTER CARD
     Small interaction feedback.
     ======================================================= */

  const registerCard = document.querySelector(".register-card");

  if (registerCard && !prefersReducedMotion) {

    registerCard.addEventListener("pointerdown", () => {
      registerCard.classList.add("is-pressed");
    });

    registerCard.addEventListener("pointerup", () => {
      registerCard.classList.remove("is-pressed");
    });

    registerCard.addEventListener("pointercancel", () => {
      registerCard.classList.remove("is-pressed");
    });

    registerCard.addEventListener("pointerleave", () => {
      registerCard.classList.remove("is-pressed");
    });

  }


  /* =======================================================
     LIVE STATUS
     ======================================================= */

  const statusPulse = document.querySelector(".status-pulse");

  if (statusPulse && !prefersReducedMotion) {

    statusPulse.classList.add("is-live");

  }


  /* =======================================================
     SMOOTH INTERNAL LINKS
     ======================================================= */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {

    link.addEventListener("click", (event) => {

      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });

    });

  });


  /* =======================================================
     PAGE VISIBILITY
     Keep interactions clean when tab is inactive.
     ======================================================= */

  document.addEventListener("visibilitychange", () => {

    if (document.hidden) {
      document.body.classList.add("page-hidden");
    } else {
      document.body.classList.remove("page-hidden");
    }

  });

});