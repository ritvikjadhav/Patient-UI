/* =========================================================
   CLINICCARE — PATIENT HOMEPAGE
   File: js/home.js

   Purpose:
   - Handle homepage interactions
   - Detect an active patient session/token
   - Prepare homepage for backend integration
   - No patient data is permanently stored here

   Backend:
   Replace the demo session check with an API request
   when the backend/database is connected.
   ========================================================= */


document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     ELEMENTS
     ======================================================= */

  const registerCard =
    document.querySelector(".register-card");

  const queueLinks =
    document.querySelectorAll(
      'a[href="queue.html"]'
    );

  const tokenLinks =
    document.querySelectorAll(
      'a[href="token.html"]'
    );

  const returningPatientLink =
    document.querySelector(
      'a[href*="returning=true"]'
    );


  /* =======================================================
     PAGE INITIALIZATION
     ======================================================= */

  initializeHomepage();


  /* =======================================================
     INITIALIZE
     ======================================================= */

  function initializeHomepage() {

    /*
      Backend integration will eventually happen here.

      Example:

      loadPatientSession();

      For now, the homepage works entirely through
      normal page navigation.
    */

    setupNavigation();

  }


  /* =======================================================
     NAVIGATION
     ======================================================= */

  function setupNavigation() {

    /*
      Register card
    */

    if (registerCard) {

      registerCard.addEventListener("click", () => {

        /*
          Allow the browser to handle the normal
          registration.html navigation.
        */

        registerCard.classList.add("is-opening");

      });

    }


    /*
      Queue links
    */

    queueLinks.forEach((link) => {

      link.addEventListener("click", () => {

        link.classList.add("is-opening");

      });

    });


    /*
      Token links
    */

    tokenLinks.forEach((link) => {

      link.addEventListener("click", () => {

        link.classList.add("is-opening");

      });

    });


    /*
      Returning patient
    */

    if (returningPatientLink) {

      returningPatientLink.addEventListener(
        "click",
        () => {

          /*
            registration.js will handle the
            returning=true parameter.
          */

          returningPatientLink.classList.add(
            "is-opening"
          );

        }
      );

    }

  }


  /* =======================================================
     BACKEND SESSION — FUTURE
     ======================================================= */

  /*
    When your backend is connected, this function can
    retrieve the patient's active visit.

    Example:

    async function loadPatientSession() {

      try {

        const response = await fetch(
          "YOUR_BACKEND_API/patient/session",
          {
            method: "GET",
            credentials: "include"
          }
        );

        if (!response.ok) {
          return;
        }

        const patient = await response.json();

        updateHomepage(patient);

      } catch (error) {

        console.error(
          "Unable to load patient session:",
          error
        );

      }

    }
  */


  /* =======================================================
     UPDATE HOMEPAGE — FUTURE BACKEND
     ======================================================= */

  /*
    Example backend response:

    {
      hasActiveVisit: true,
      token: "A-024",
      queuePosition: 5,
      estimatedWait: 15,
      status: "Waiting"
    }


    Then the homepage could dynamically show:

    "Active Token A-024"
    "5 patients ahead"
    "~15 minutes"


    Example:

    function updateHomepage(patient) {

      if (!patient.hasActiveVisit) {
        return;
      }

      // Update active token card
      // Update queue status
      // Update navigation
    }
  */


  /* =======================================================
     ACCESSIBILITY
     ======================================================= */

  document.addEventListener(
    "keydown",
    (event) => {

      /*
        Prevent accidental activation while the page
        is loading or transitioning.
      */

      if (event.key === "Escape") {

        document
          .querySelectorAll(".is-opening")
          .forEach((element) => {

            element.classList.remove(
              "is-opening"
            );

          });

      }

    }
  );


});