/* =========================================================
   CLINIC AUTOMATION — PATIENT TOKEN
   File: js/token.js

   Database / Backend Ready

   Frontend flow:

   token.html
        ↓
   token.js
        ↓
   Backend API
        ↓
   Database
        ↓
   Token + Queue Status
   ========================================================= */


document.addEventListener("DOMContentLoaded", () => {


  /* =======================================================
     CONFIGURATION
     ======================================================= */

  /*
    Replace this with your real backend URL later.

    Example:

    const API_BASE_URL =
      "https://your-backend.com/api";

    For now keep it empty so the page can still
    be tested without a backend.
  */

  const API_BASE_URL = "";


  /* =======================================================
     ELEMENTS
     ======================================================= */

  const tokenNumber =
    document.getElementById("tokenNumber");

  const patientName =
    document.getElementById("patientName");

  const queuePosition =
    document.getElementById("queuePosition");

  const estimatedWait =
    document.getElementById("estimatedWait");

  const statusText =
    document.getElementById("statusText");

  const refreshButton =
    document.getElementById("refreshButton");

  const backButton =
    document.getElementById("backButton");


  /* =======================================================
     PAGE STATE
     ======================================================= */

  let currentToken = null;

  let refreshTimer = null;


  /* =======================================================
     INITIALIZE
     ======================================================= */

  initializeTokenPage();


  /* =======================================================
     INITIALIZE TOKEN PAGE
     ======================================================= */

  function initializeTokenPage() {

    /*
      The token should normally be provided by the backend.

      For development/testing, we allow a token from
      the URL:

      token.html?token=A-024
    */

    const urlParams =
      new URLSearchParams(window.location.search);

    currentToken =
      urlParams.get("token");


    /*
      If there is no token in the URL, show a clear
      state instead of silently using fake data.
    */

    if (!currentToken) {

      showNoTokenState();

      return;
    }


    /*
      Display token immediately.
      The backend will provide the actual patient,
      queue position and status.
    */

    if (tokenNumber) {
      tokenNumber.textContent =
        currentToken;
    }


    /*
      Load the current queue information.
    */

    loadTokenStatus();


    /*
      Refresh automatically every 30 seconds.

      This will become useful when the backend is
      updating the patient's queue in real time.
    */

    refreshTimer =
      setInterval(loadTokenStatus, 30000);

  }


  /* =======================================================
     LOAD TOKEN STATUS
     ======================================================= */

  async function loadTokenStatus() {

    /*
      If backend URL has not been configured yet,
      don't make a fake API request.
    */

    if (!API_BASE_URL) {

      setDemoState();

      return;
    }


    setLoadingState();


    try {

      const response =
        await fetch(
          `${API_BASE_URL}/queue/${encodeURIComponent(currentToken)}`,
          {
            method: "GET",
            headers: {
              "Accept": "application/json"
            }
          }
        );


      /*
        Backend returned an error.
      */

      if (!response.ok) {

        throw new Error(
          `Server returned ${response.status}`
        );

      }


      const data =
        await response.json();


      /*
        Display backend data.
      */

      updateTokenUI(data);


    } catch (error) {

      console.error(
        "Unable to load token status:",
        error
      );


      showConnectionError();

    }

  }


  /* =======================================================
     UPDATE TOKEN UI
     ======================================================= */

  function updateTokenUI(data) {

    /*
      Expected backend response:

      {
        token: "A-024",
        patientName: "John Doe",
        queuePosition: 5,
        estimatedWait: 15,
        status: "Waiting"
      }
    */


    if (tokenNumber) {

      tokenNumber.textContent =
        data.token || currentToken;

    }


    if (patientName) {

      patientName.textContent =
        data.patientName || "Patient";

    }


    if (queuePosition) {

      queuePosition.textContent =
        formatQueuePosition(
          data.queuePosition
        );

    }


    if (estimatedWait) {

      estimatedWait.textContent =
        data.estimatedWait !== undefined &&
        data.estimatedWait !== null
          ? `~${data.estimatedWait}`
          : "—";

    }


    if (statusText) {

      statusText.textContent =
        data.status || "Waiting";

    }


    updateStatusAppearance(
      data.status || "Waiting"
    );

  }


  /* =======================================================
     FORMAT QUEUE POSITION
     ======================================================= */

  function formatQueuePosition(position) {

    if (
      position === undefined ||
      position === null ||
      position === ""
    ) {
      return "—";
    }


    const number =
      Number(position);


    if (!Number.isFinite(number)) {

      return position;

    }


    /*
      Example:

      1 → 1st
      2 → 2nd
      3 → 3rd
      5 → 5th
    */

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
     DEMO STATE
     ======================================================= */

  /*
    This is ONLY for frontend testing.

    It is NOT database data.

    Delete this section once the backend is connected.
  */

  function setDemoState() {

    if (patientName) {

      patientName.textContent =
        "Patient";

    }


    if (queuePosition) {

      queuePosition.textContent =
        "—";

    }


    if (estimatedWait) {

      estimatedWait.textContent =
        "—";

    }


    if (statusText) {

      statusText.textContent =
        "Waiting";

    }

  }


  /* =======================================================
     LOADING STATE
     ======================================================= */

  function setLoadingState() {

    if (refreshButton) {

      refreshButton.disabled = true;

      refreshButton.textContent =
        "Refreshing...";

    }

  }


  /* =======================================================
     RESTORE REFRESH BUTTON
     ======================================================= */

  function restoreRefreshButton() {

    if (refreshButton) {

      refreshButton.disabled = false;

      refreshButton.textContent =
        "Refresh Status";

    }

  }


  /* =======================================================
     CONNECTION ERROR
     ======================================================= */

  function showConnectionError() {

    restoreRefreshButton();


    if (statusText) {

      statusText.textContent =
        "Unable to update";

    }

  }


  /* =======================================================
     NO TOKEN STATE
     ======================================================= */

  function showNoTokenState() {

    if (tokenNumber) {

      tokenNumber.textContent =
        "—";

    }


    if (patientName) {

      patientName.textContent =
        "Registration not found";

    }


    if (queuePosition) {

      queuePosition.textContent =
        "—";

    }


    if (estimatedWait) {

      estimatedWait.textContent =
        "—";

    }


    if (statusText) {

      statusText.textContent =
        "No token available";

    }

  }


  /* =======================================================
     STATUS APPEARANCE
     ======================================================= */

  function updateStatusAppearance(status) {

    const statusBadge =
      document.querySelector(".status-badge");

    const statusDot =
      document.querySelector(".status-dot");


    if (!statusBadge || !statusDot) {
      return;
    }


    /*
      Remove previous status classes.
    */

    statusBadge.classList.remove(
      "status-waiting",
      "status-called",
      "status-completed",
      "status-cancelled"
    );


    const normalizedStatus =
      String(status)
        .toLowerCase()
        .trim();


    if (
      normalizedStatus === "called" ||
      normalizedStatus === "your turn"
    ) {

      statusBadge.classList.add(
        "status-called"
      );

      return;

    }


    if (
      normalizedStatus === "completed" ||
      normalizedStatus === "complete"
    ) {

      statusBadge.classList.add(
        "status-completed"
      );

      return;

    }


    if (
      normalizedStatus === "cancelled" ||
      normalizedStatus === "canceled"
    ) {

      statusBadge.classList.add(
        "status-cancelled"
      );

      return;

    }


    /*
      Default status.
    */

    statusBadge.classList.add(
      "status-waiting"
    );

  }


  /* =======================================================
     REFRESH BUTTON
     ======================================================= */

  if (refreshButton) {

    refreshButton.addEventListener(
      "click",
      async () => {

        if (!currentToken) {
          return;
        }


        await loadTokenStatus();

        restoreRefreshButton();

      }
    );

  }


  /* =======================================================
     BACK BUTTON
     ======================================================= */

  if (backButton) {

    backButton.addEventListener(
      "click",
      () => {

        /*
          Stop automatic queue refresh.
        */

        if (refreshTimer) {

          clearInterval(refreshTimer);

        }


        window.location.href =
          "index.html";

      }
    );

  }


  /* =======================================================
     CLEANUP
     ======================================================= */

  window.addEventListener(
    "beforeunload",
    () => {

      if (refreshTimer) {

        clearInterval(refreshTimer);

      }

    }
  );

});