/* =========================================================
   CLINIC AUTOMATION — PATIENT HOME
   File: js/home.js

   UI-focused version

   Current:
   - Works without backend
   - Reads demo registration/token data
   - Keeps patient information consistent across pages
   - Updates dashboard statistics
   - Handles navigation
   - Ready for backend integration later

   Backend later:
   Replace loadPatientData() with an API call.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     ELEMENTS
     ======================================================= */

  const patientName =
    document.getElementById("patientName");

  const patientInitial =
    document.getElementById("patientInitial");

  const tokenNumber =
    document.getElementById("tokenNumber");

  const queuePosition =
    document.getElementById("queuePosition");

  const estimatedWait =
    document.getElementById("estimatedWait");

  const tokenStatus =
    document.getElementById("tokenStatus");

  const servingToken =
    document.getElementById("servingToken");

  const lastUpdated =
    document.getElementById("lastUpdated");

  const refreshButton =
    document.getElementById("refreshButton");


  /* =======================================================
     DEMO DATA
     ======================================================= */

  const demoPatient = {
    name: "Patient",
    token: "A-024",
    queuePosition: 5,
    estimatedWait: 12,
    status: "Waiting",
    servingToken: "A-019"
  };


  /* =======================================================
     INITIALIZE
     ======================================================= */

  loadPatientData();


  /* =======================================================
     LOAD PATIENT DATA
     ======================================================= */

  function loadPatientData() {

    let data = null;


    /*
      Registration page currently stores:

      patientRegistration
    */

    const savedRegistration =
      localStorage.getItem("patientRegistration");


    if (savedRegistration) {

      try {

        data =
          JSON.parse(savedRegistration);

      } catch (error) {

        console.error(
          "Unable to read patient registration:",
          error
        );

      }

    }


    /*
      If there is no registration yet,
      use demo information so the UI
      remains launch-ready during development.
    */

    if (!data) {

      data = demoPatient;

    }


    updateHomeUI(data);

  }


  /* =======================================================
     UPDATE HOME UI
     ======================================================= */

  function updateHomeUI(data) {

    const name =
      data.name ||
      data.patientName ||
      "Patient";


    const token =
      data.token ||
      "A-024";


    const position =
      data.queuePosition ??
      5;


    const wait =
      data.estimatedWait ??
      12;


    const status =
      data.status ||
      "Waiting";


    const serving =
      data.servingToken ||
      "A-019";


    /* -----------------------------------------------------
       PATIENT NAME
       ----------------------------------------------------- */

    if (patientName) {

      patientName.textContent =
        name;

    }


    /* -----------------------------------------------------
       PATIENT INITIAL
       ----------------------------------------------------- */

    if (patientInitial) {

      patientInitial.textContent =
        getInitial(name);

    }


    /* -----------------------------------------------------
       TOKEN
       ----------------------------------------------------- */

    if (tokenNumber) {

      tokenNumber.textContent =
        token;

      animateValue(tokenNumber);

    }


    /* -----------------------------------------------------
       QUEUE POSITION
       ----------------------------------------------------- */

    if (queuePosition) {

      queuePosition.textContent =
        formatPosition(position);

      animateValue(queuePosition);

    }


    /* -----------------------------------------------------
       ESTIMATED WAIT
       ----------------------------------------------------- */

    if (estimatedWait) {

      estimatedWait.textContent =
        wait !== null &&
        wait !== undefined
          ? `~${wait}`
          : "—";

      animateValue(estimatedWait);

    }


    /* -----------------------------------------------------
       TOKEN STATUS
       ----------------------------------------------------- */

    if (tokenStatus) {

      tokenStatus.textContent =
        status;

      updateStatus(status);

    }


    /* -----------------------------------------------------
       CURRENTLY SERVING
       ----------------------------------------------------- */

    if (servingToken) {

      servingToken.textContent =
        serving;

    }


    /* -----------------------------------------------------
       LAST UPDATED
       ----------------------------------------------------- */

    updateLastUpdated();

  }


  /* =======================================================
     INITIAL LETTER
     ======================================================= */

  function getInitial(name) {

    if (!name) {
      return "P";
    }


    return name
      .trim()
      .charAt(0)
      .toUpperCase();

  }


  /* =======================================================
     QUEUE POSITION FORMAT
     ======================================================= */

  function formatPosition(position) {

    if (
      position === null ||
      position === undefined ||
      position === ""
    ) {

      return "—";

    }


    const number =
      Number(position);


    if (!Number.isFinite(number)) {

      return position;

    }


    const lastTwo =
      number % 100;


    if (
      lastTwo >= 11 &&
      lastTwo <= 13
    ) {

      return `${number}th`;

    }


    switch (number % 10) {

      case 1:
        return `${number}st`;

      case 2:
        return `${number}nd`;

      case 3:
        return `${number}rd`;

      default:
        return `${number}th`;

    }

  }


  /* =======================================================
     STATUS
     ======================================================= */

  function updateStatus(status) {

    const normalized =
      String(status)
        .toLowerCase()
        .trim();


    /*
      Support different class names
      depending on the home.html structure.
    */

    const statusElement =
      document.querySelector(
        ".token-status, .status-badge, .queue-status"
      );


    if (!statusElement) {
      return;
    }


    statusElement.classList.remove(
      "waiting",
      "called",
      "completed",
      "cancelled",
      "status-waiting",
      "status-called",
      "status-completed",
      "status-cancelled"
    );


    if (
      normalized === "called" ||
      normalized === "your turn"
    ) {

      statusElement.classList.add(
        "called",
        "status-called"
      );

      return;

    }


    if (
      normalized === "completed" ||
      normalized === "complete"
    ) {

      statusElement.classList.add(
        "completed",
        "status-completed"
      );

      return;

    }


    if (
      normalized === "cancelled" ||
      normalized === "canceled"
    ) {

      statusElement.classList.add(
        "cancelled",
        "status-cancelled"
      );

      return;

    }


    statusElement.classList.add(
      "waiting",
      "status-waiting"
    );

  }


  /* =======================================================
     LAST UPDATED
     ======================================================= */

  function updateLastUpdated() {

    if (!lastUpdated) {
      return;
    }


    const now =
      new Date();


    lastUpdated.textContent =
      now.toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit"
        }
      );

  }


  /* =======================================================
     VALUE ANIMATION
     ======================================================= */

  function animateValue(element) {

    element.classList.remove(
      "queue-value-updated"
    );


    /*
      Force browser reflow so the animation
      can run again when refreshed.
    */

    void element.offsetWidth;


    element.classList.add(
      "queue-value-updated"
    );

  }


  /* =======================================================
     REFRESH
     ======================================================= */

  if (refreshButton) {

    refreshButton.addEventListener(
      "click",
      () => {

        refreshButton.disabled = true;

        refreshButton.classList.add(
          "is-loading"
        );


        refreshButton.textContent =
          "Refreshing...";


        setTimeout(() => {

          loadPatientData();

          refreshButton.disabled =
            false;

          refreshButton.classList.remove(
            "is-loading"
          );


          refreshButton.textContent =
            "Refresh Status";

        }, 450);

      }
    );

  }


  /* =======================================================
     NAVIGATION
     ======================================================= */

  /*
    These work with normal HTML links.

    home/index
      → index.html

    registration
      → registration.html

    live queue
      → queue.html

    token
      → token.html

    support
      → support.html
  */


  document
    .querySelectorAll(
      "[data-navigation]"
    )
    .forEach((link) => {

      link.addEventListener(
        "click",
        () => {

          const destination =
            link.dataset.navigation;


          if (!destination) {
            return;
          }


          window.location.href =
            destination;

        }
      );

    });


  /* =======================================================
     AUTO UPDATE
     ======================================================= */

  /*
    UI-only refresh.

    Later this can become:

      GET /api/patient/status

    or:

      GET /api/queue/{token}
  */

  setInterval(() => {

    loadPatientData();

  }, 30000);


});