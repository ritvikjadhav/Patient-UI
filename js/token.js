/* =========================================================
   CLINIC AUTOMATION — PATIENT TOKEN
   File: js/token.js

   Frontend Demo + Backend Ready

   Current:
   token.html
        ↓
   token.js
        ↓
   DEMO DATA

   Future:
   token.html
        ↓
   token.js
        ↓
   Backend API
        ↓
   Database
   ========================================================= */


document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     CONFIGURATION
     ======================================================= */

  /*
    Keep empty during frontend development.

    Later:

    const API_BASE_URL =
      "https://your-backend.com/api";
  */

  const API_BASE_URL = "";


  /* =======================================================
     DEMO DATA
     ======================================================= */

  /*
    Temporary frontend data.

    This allows the complete UI to work BEFORE
    the backend/database is connected.

    Remove/replace this when backend is ready.
  */

  const DEMO_TOKEN_DATA = {

    token: "A-024",

    patientName: "Patient Name",

    queuePosition: 5,

    estimatedWait: 15,

    status: "Waiting"

  };


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

  const tokenStatus =
    document.getElementById("tokenStatus");

  const statusMessage =
    document.getElementById("statusMessage");

  const refreshButton =
    document.getElementById("refreshButton");


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
      Check URL first.

      Example:

      token.html?token=A-024
    */

    const urlParams =
      new URLSearchParams(
        window.location.search
      );


    const urlToken =
      urlParams.get("token");


    /*
      If a token exists in the URL,
      use that token.

      Otherwise use demo token.
    */

    currentToken =
      urlToken || DEMO_TOKEN_DATA.token;


    /*
      Show token immediately.

      This guarantees the demo UI works.
    */

    if (tokenNumber) {

      tokenNumber.textContent =
        currentToken;

    }


    /*
      Load queue information.
    */

    loadTokenStatus();


    /*
      Automatic refresh.

      Backend can later update the queue
      without the patient manually refreshing.
    */

    refreshTimer =
      setInterval(
        loadTokenStatus,
        30000
      );

  }


  /* =======================================================
     LOAD TOKEN STATUS
     ======================================================= */

  async function loadTokenStatus() {

    /*
      No backend configured.

      Use demo data.
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


      if (!response.ok) {

        throw new Error(
          `Server returned ${response.status}`
        );

      }


      const data =
        await response.json();


      /*
        Update UI with database/backend data.
      */

      updateTokenUI(data);


    } catch (error) {

      console.error(
        "Unable to load token status:",
        error
      );


      showConnectionError();

    } finally {

      restoreRefreshButton();

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
        patientName: "Ritvik",
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

      if (
        data.estimatedWait !== undefined &&
        data.estimatedWait !== null
      ) {

        estimatedWait.textContent =
          `~${data.estimatedWait}`;

      } else {

        estimatedWait.textContent =
          "—";

      }

    }


    const status =
      data.status || "Waiting";


    if (tokenStatus) {

      tokenStatus.textContent =
        status;

    }


    updateStatusUI(status);

  }


  /* =======================================================
     DEMO STATE
     ======================================================= */

  function setDemoState() {

    /*
      Use demo data while backend is not connected.
    */

    updateTokenUI({

      token:
        currentToken,

      patientName:
        DEMO_TOKEN_DATA.patientName,

      queuePosition:
        DEMO_TOKEN_DATA.queuePosition,

      estimatedWait:
        DEMO_TOKEN_DATA.estimatedWait,

      status:
        DEMO_TOKEN_DATA.status

    });

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
     STATUS UI
     ======================================================= */

  function updateStatusUI(status) {

    const normalizedStatus =
      String(status)
        .toLowerCase()
        .trim();


    /*
      Token status text
    */

    if (tokenStatus) {

      tokenStatus.textContent =
        status;

    }


    /*
      Status message
    */

    if (statusMessage) {

      if (
        normalizedStatus === "called" ||
        normalizedStatus === "your turn"
      ) {

        statusMessage.textContent =
          "Your token has been called. Please proceed to the consultation area.";

      } else if (
        normalizedStatus === "completed" ||
        normalizedStatus === "complete"
      ) {

        statusMessage.textContent =
          "Your consultation has been completed.";

      } else if (
        normalizedStatus === "cancelled" ||
        normalizedStatus === "canceled"
      ) {

        statusMessage.textContent =
          "This token has been cancelled.";

      } else {

        statusMessage.textContent =
          "Please wait until your token is called.";

      }

    }


    /*
      Token status container
    */

    const tokenStatusElement =
      document.querySelector(
        ".token-status"
      );


    if (!tokenStatusElement) {
      return;
    }


    tokenStatusElement.classList.remove(
      "status-waiting",
      "status-called",
      "status-completed",
      "status-cancelled"
    );


    /*
      Waiting
    */

    if (
      normalizedStatus === "waiting"
    ) {

      tokenStatusElement.classList.add(
        "status-waiting"
      );

    }


    /*
      Called
    */

    else if (
      normalizedStatus === "called" ||
      normalizedStatus === "your turn"
    ) {

      tokenStatusElement.classList.add(
        "status-called"
      );

    }


    /*
      Completed
    */

    else if (
      normalizedStatus === "completed" ||
      normalizedStatus === "complete"
    ) {

      tokenStatusElement.classList.add(
        "status-completed"
      );

    }


    /*
      Cancelled
    */

    else if (
      normalizedStatus === "cancelled" ||
      normalizedStatus === "canceled"
    ) {

      tokenStatusElement.classList.add(
        "status-cancelled"
      );

    }

  }


  /* =======================================================
     LOADING STATE
     ======================================================= */

  function setLoadingState() {

    if (!refreshButton) {
      return;
    }


    refreshButton.disabled = true;

    refreshButton.textContent =
      "Refreshing...";

  }


  /* =======================================================
     RESTORE BUTTON
     ======================================================= */

  function restoreRefreshButton() {

    if (!refreshButton) {
      return;
    }


    refreshButton.disabled = false;

    refreshButton.textContent =
      "Refresh Status";

  }


  /* =======================================================
     CONNECTION ERROR
     ======================================================= */

  function showConnectionError() {

    if (tokenStatus) {

      tokenStatus.textContent =
        "Update unavailable";

    }


    if (statusMessage) {

      statusMessage.textContent =
        "We couldn't update the queue right now. Please try again.";

    }

  }


  /* =======================================================
     REFRESH BUTTON
     ======================================================= */

  if (refreshButton) {

    refreshButton.addEventListener(
      "click",
      async () => {

        await loadTokenStatus();

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