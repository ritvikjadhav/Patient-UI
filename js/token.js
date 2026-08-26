/* =========================================================
   CLINICCARE — PATIENT TOKEN
   File: js/token.js

   V1 FEATURES
   ---------------------------------------------------------
   - Reads patient data from registration
   - Displays the exact registered patient name
   - Displays token generated during registration
   - Displays queue information
   - Refresh button
   - Prepared for backend/API integration
   - No hardcoded patient name
   ========================================================= */


/* =========================================================
   STORAGE KEYS
   ========================================================= */

const REGISTRATION_STORAGE_KEY =
  "cliniccare_registration";


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const patientNameElement =
  document.getElementById("patientName");

const tokenNumberElement =
  document.getElementById("tokenNumber");

const statusTextElement =
  document.getElementById("statusText");

const aheadOfYouElement =
  document.getElementById("aheadOfYou");

const estimatedWaitElement =
  document.getElementById("estimatedWait");

const queuePositionElement =
  document.getElementById("queuePosition");

const refreshButton =
  document.getElementById("refreshButton");


/* =========================================================
   GET REGISTRATION DATA
   ========================================================= */

function getRegistrationData() {

  const savedData =
    localStorage.getItem(
      REGISTRATION_STORAGE_KEY
    );


  if (!savedData) {

    return null;

  }


  try {

    return JSON.parse(savedData);

  } catch (error) {

    console.error(
      "Unable to read registration data:",
      error
    );

    return null;

  }

}


/* =========================================================
   FORMAT PATIENT NAME
   ========================================================= */

function formatPatientName(name) {

  if (!name) {

    return "Patient";

  }


  /*
   * Converts:
   *
   * "namaste"
   *       ↓
   * "Namaste"
   *
   * "RITVIK JADHAV"
   *       ↓
   * "Ritvik Jadhav"
   *
   * This is only presentation formatting.
   */

  return name
    .trim()
    .toLowerCase()
    .replace(
      /\b\w/g,
      character =>
        character.toUpperCase()
    );

}


/* =========================================================
   UPDATE PATIENT NAME
   ========================================================= */

function updatePatientName(data) {

  if (!patientNameElement) {
    return;
  }


  const name =
    data?.patient?.name;


  if (!name) {

    patientNameElement.textContent =
      "Patient";

    return;

  }


  patientNameElement.textContent =
    formatPatientName(name);

}


/* =========================================================
   UPDATE TOKEN INFORMATION
   ========================================================= */

function updateTokenInformation(data) {

  if (!data) {
    return;
  }


  const queue =
    data.queue || {};


  /* -------------------------------------------------------
     TOKEN
     ------------------------------------------------------- */

  if (tokenNumberElement) {

    tokenNumberElement.textContent =
      queue.token || "—";

  }


  /* -------------------------------------------------------
     STATUS
     ------------------------------------------------------- */

  if (statusTextElement) {

    statusTextElement.textContent =
      queue.status || "Waiting";

  }


  /* -------------------------------------------------------
     AHEAD OF YOU
     ------------------------------------------------------- */

  if (aheadOfYouElement) {

    aheadOfYouElement.textContent =
      Number.isFinite(
        Number(queue.aheadOfYou)
      )
        ? queue.aheadOfYou
        : "—";

  }


  /* -------------------------------------------------------
     ESTIMATED WAIT
     ------------------------------------------------------- */

  if (estimatedWaitElement) {

    estimatedWaitElement.textContent =
      Number.isFinite(
        Number(queue.estimatedWait)
      )
        ? queue.estimatedWait
        : "—";

  }


  /* -------------------------------------------------------
     POSITION
     ------------------------------------------------------- */

  if (queuePositionElement) {

    queuePositionElement.textContent =
      Number.isFinite(
        Number(queue.position)
      )
        ? queue.position
        : "—";

  }

}


/* =========================================================
   UPDATE COMPLETE PAGE
   ========================================================= */

function updateTokenPage(data) {

  if (!data) {

    handleMissingRegistration();

    return;

  }


  updatePatientName(data);

  updateTokenInformation(data);

}


/* =========================================================
   MISSING REGISTRATION
   ========================================================= */

function handleMissingRegistration() {

  console.warn(
    "No active clinic registration found."
  );


  if (patientNameElement) {

    patientNameElement.textContent =
      "No active registration";

  }


  if (tokenNumberElement) {

    tokenNumberElement.textContent =
      "—";

  }


  if (statusTextElement) {

    statusTextElement.textContent =
      "Not registered";

  }


  if (aheadOfYouElement) {

    aheadOfYouElement.textContent =
      "—";

  }


  if (estimatedWaitElement) {

    estimatedWaitElement.textContent =
      "—";

  }


  if (queuePositionElement) {

    queuePositionElement.textContent =
      "—";

  }

}


/* =========================================================
   REFRESH FROM TEMPORARY STORAGE
   ========================================================= */

function refreshTokenData() {

  const data =
    getRegistrationData();


  updateTokenPage(data);

}


/* =========================================================
   REFRESH BUTTON
   ========================================================= */

if (refreshButton) {

  refreshButton.addEventListener(
    "click",
    async () => {

      refreshButton.disabled = true;

      refreshButton.classList.add(
        "is-loading"
      );


      /*
       * Small delay gives the refresh action a smooth
       * visual response during V1.
       */

      await new Promise(
        resolve =>
          setTimeout(resolve, 250)
      );


      refreshTokenData();


      refreshButton.disabled = false;

      refreshButton.classList.remove(
        "is-loading"
      );

    }
  );

}


/* =========================================================
   BACKEND / API INTEGRATION
   =========================================================

   CURRENT V1:
   ---------------------------------------------------------
   Patient data is read from localStorage.

   FUTURE BACKEND:
   ---------------------------------------------------------
   The backend should identify the patient's active
   registration using a secure patient/session/registration
   identifier.

   Example:

   async function fetchTokenFromBackend() {

     const response = await fetch(
       "/api/patient/token",
       {
         method: "GET",
         headers: {
           "Content-Type": "application/json"
         }
       }
     );

     if (!response.ok) {
       throw new Error(
         "Unable to fetch token information."
       );
     }

     const data = await response.json();

     return data;
   }

   Expected backend response:

   {
     "success": true,
     "patient": {
       "id": 123,
       "name": "Namaste"
     },
     "queue": {
       "token": "A-024",
       "status": "Waiting",
       "currentlyServing": "A-019",
       "aheadOfYou": 4,
       "estimatedWait": 12,
       "position": 5
     }
   }

   IMPORTANT:
   ---------------------------------------------------------
   The backend should eventually become the source of truth
   for:

   - Patient identity
   - Token number
   - Queue position
   - Patients ahead
   - Estimated waiting time
   - Current serving token
   - Queue status

   Do NOT generate or trust queue numbers from the browser
   once the real database is connected.
   ========================================================= */


/* =========================================================
   FUTURE LIVE QUEUE POLLING
   =========================================================

   Once the backend API exists, this can periodically
   refresh the patient's queue status.

   Example:

   setInterval(async () => {

     try {

       const data =
         await fetchTokenFromBackend();

       updateTokenPage(data);

     } catch (error) {

       console.error(
         "Queue update failed:",
         error
       );

     }

   }, 10000);

   This would check the backend every 10 seconds.

   For a real production system, WebSocket or Server-Sent
   Events could be used for true real-time updates instead.
   ========================================================= */


/* =========================================================
   INITIAL LOAD
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    refreshTokenData();

  }
);


/* =========================================================
   TAB / WINDOW RETURN
   =========================================================

   If the patient registers in another tab and comes back
   to this page, refresh the displayed information.
   ========================================================= */

window.addEventListener(
  "storage",
  event => {

    if (
      event.key ===
      REGISTRATION_STORAGE_KEY
    ) {

      refreshTokenData();

    }

  }
);