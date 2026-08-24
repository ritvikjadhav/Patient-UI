/* =========================================================
   CLINIC AUTOMATION — PATIENT TOKEN
   File: js/token.js

   Backend Integration:
   Replace the demo/localStorage data with API data
   when the backend is connected.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     ELEMENTS
     ======================================================= */

  const tokenNumber = document.getElementById("tokenNumber");
  const patientName = document.getElementById("patientName");

  const queuePosition = document.getElementById("queuePosition");
  const estimatedWait = document.getElementById("estimatedWait");

  const statusText = document.getElementById("statusText");

  const backButton = document.getElementById("backButton");
  const homeButton = document.getElementById("homeButton");


  /* =======================================================
     GET PATIENT DATA
     ======================================================= */

  /*
    Currently we read the data from localStorage.

    Later, your backend teammate can replace this with:

    fetch("YOUR_BACKEND_API/token")
  */

  const registrationData =
    JSON.parse(localStorage.getItem("patientRegistration"));


  /* =======================================================
     NO DATA HANDLING
     ======================================================= */

  if (!registrationData) {

    if (tokenNumber) {
      tokenNumber.textContent = "—";
    }

    if (patientName) {
      patientName.textContent = "No registration found";
    }

    if (queuePosition) {
      queuePosition.textContent = "—";
    }

    if (estimatedWait) {
      estimatedWait.textContent = "—";
    }

    if (statusText) {
      statusText.textContent = "Registration not found";
    }

    return;
  }


  /* =======================================================
     DISPLAY BASIC PATIENT DATA
     ======================================================= */

  if (tokenNumber) {
    tokenNumber.textContent =
      registrationData.token || "A-001";
  }

  if (patientName) {
    patientName.textContent =
      registrationData.name || "Patient";
  }


  /* =======================================================
     QUEUE INFORMATION
     ======================================================= */

  /*
    These values are temporary.

    Backend should eventually return:

    queuePosition
    estimatedWait
    status
  */

  if (queuePosition) {
    queuePosition.textContent =
      registrationData.queuePosition || "—";
  }

  if (estimatedWait) {
    estimatedWait.textContent =
      registrationData.estimatedWait
        ? `~${registrationData.estimatedWait}`
        : "—";
  }


  /* =======================================================
     STATUS
     ======================================================= */

  if (statusText) {

    statusText.textContent =
      registrationData.status || "Waiting";

  }


  /* =======================================================
     BACK BUTTON
     ======================================================= */

  if (backButton) {

    backButton.addEventListener("click", () => {

      window.location.href = "index.html";

    });

  }


  /* =======================================================
     HOME BUTTON
     ======================================================= */

  if (homeButton) {

    homeButton.addEventListener("click", () => {

      window.location.href = "index.html";

    });

  }


  /* =======================================================
     BACKEND INTEGRATION
     ======================================================= */

  /*
    WHEN BACKEND IS READY:

    Example:

    async function getTokenStatus() {

      const response = await fetch(
        "YOUR_BACKEND_API/token/" +
        registrationData.token
      );

      const data = await response.json();

      tokenNumber.textContent = data.token;
      queuePosition.textContent = data.queuePosition;
      estimatedWait.textContent =
        `~${data.estimatedWait}`;

      statusText.textContent = data.status;
    }

    getTokenStatus();

  */


  /* =======================================================
     LIVE QUEUE UPDATE PLACEHOLDER
     ======================================================= */

  /*
    Later the backend can update:

    - Queue position
    - Estimated waiting time
    - Patient status

    Example:

    setInterval(getTokenStatus, 30000);

    This can refresh the status every 30 seconds.
  */

});