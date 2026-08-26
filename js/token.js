/* =========================================================
   CLINICCARE — PATIENT TOKEN
   File: js/token.js
   Version: V1
   ========================================================= */


/* =========================================================
   CONFIGURATION
   ========================================================= */

const TOKEN_CONFIG = {

  /*
   ==========================================================
   BACKEND API — REPLACE THIS WHEN BACKEND IS READY
   ==========================================================

   Example:

   apiBaseUrl: "https://your-domain.com/api"

   The backend developer can then use:

   GET /api/patient/token/:tokenId

   or:

   GET /api/queue/token/:tokenId
   */

  apiBaseUrl: "",

  /*
   Temporary V1 mode.

   true  = use localStorage temporary data
   false = use backend API
  */

  useTemporaryData: true,

  /*
   How often the token status should refresh.

   Backend can later change this to WebSocket/SSE
   for true real-time queue updates.
  */

  refreshInterval: 15000

};


/* =========================================================
   TEMPORARY DATA
   ========================================================= */

const TEMPORARY_TOKEN_DATA = {

  patientName: "Ritvik Jadhav",

  tokenNumber: "A-024",

  status: "Waiting",

  aheadOfYou: 4,

  estimatedWait: 12,

  queuePosition: 5

};


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const elements = {

  patientName:
    document.getElementById("patientName"),

  tokenNumber:
    document.getElementById("tokenNumber"),

  statusText:
    document.getElementById("statusText"),

  aheadOfYou:
    document.getElementById("aheadOfYou"),

  estimatedWait:
    document.getElementById("estimatedWait"),

  queuePosition:
    document.getElementById("queuePosition"),

  refreshButton:
    document.getElementById("refreshButton")

};


/* =========================================================
   STORAGE KEYS
   ========================================================= */

const STORAGE_KEYS = {

  registration:
    "cliniccare_registration",

  token:
    "cliniccare_token"

};


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  initializeTokenPage();

});


/* =========================================================
   INITIALIZE TOKEN PAGE
   ========================================================= */

async function initializeTokenPage() {

  try {

    await loadTokenData();

    setupRefreshButton();

    startAutoRefresh();

  } catch (error) {

    console.error(
      "Token initialization failed:",
      error
    );

    showErrorState();

  }

}


/* =========================================================
   LOAD TOKEN DATA
   ========================================================= */

async function loadTokenData() {

  let tokenData;


  /*
   ==========================================================
   BACKEND MODE
   ==========================================================

   When backend is ready:

   1. Set:

      useTemporaryData: false

   2. Replace the endpoint below according
      to the backend API.

   Example response:

   {
     "patientName": "Ritvik Jadhav",
     "tokenNumber": "A-024",
     "status": "Waiting",
     "aheadOfYou": 4,
     "estimatedWait": 12,
     "queuePosition": 5
   }
   */

  if (!TOKEN_CONFIG.useTemporaryData) {

    tokenData =
      await fetchTokenFromBackend();

  }


  /*
   ==========================================================
   TEMPORARY V1 MODE
   ==========================================================

   First try data created during registration.

   If it doesn't exist, use temporary demo data.
   */

  else {

    tokenData =
      getTemporaryTokenData();

  }


  if (!tokenData) {

    throw new Error(
      "No token data available."
    );

  }


  updateTokenUI(tokenData);

}


/* =========================================================
   TEMPORARY DATA HANDLER
   ========================================================= */

function getTemporaryTokenData() {

  /*
   ----------------------------------------------------------
   Check registration data first.
   ----------------------------------------------------------
  */

  const registrationData =
    getStorageData(
      STORAGE_KEYS.registration
    );


  /*
   ----------------------------------------------------------
   Check saved token data.
   ----------------------------------------------------------
  */

  const savedTokenData =
    getStorageData(
      STORAGE_KEYS.token
    );


  /*
   ----------------------------------------------------------
   If token data already exists, use it.
   ----------------------------------------------------------
  */

  if (savedTokenData) {

    return {

      ...TEMPORARY_TOKEN_DATA,

      ...savedTokenData

    };

  }


  /*
   ----------------------------------------------------------
   If registration exists, create token data.
   ----------------------------------------------------------
  */

  if (registrationData) {

    const tokenData = {

      ...TEMPORARY_TOKEN_DATA,

      patientName:
        registrationData.name ||
        TEMPORARY_TOKEN_DATA.patientName

    };


    saveStorageData(
      STORAGE_KEYS.token,
      tokenData
    );


    return tokenData;

  }


  /*
   ----------------------------------------------------------
   Otherwise use demo data.
   ----------------------------------------------------------
  */

  return TEMPORARY_TOKEN_DATA;

}


/* =========================================================
   BACKEND API HANDLER
   ========================================================= */

async function fetchTokenFromBackend() {

  /*
   ==========================================================
   IMPORTANT FOR BACKEND DEVELOPER
   ==========================================================

   The frontend expects an API response containing:

   patientName
   tokenNumber
   status
   aheadOfYou
   estimatedWait
   queuePosition

   Example endpoint:

   GET /api/patient/token/:tokenId

   The tokenId should eventually come from:

   - secure session
   - authentication
   - registration response
   - URL parameter

   Do NOT rely on patient name or mobile number
   as the permanent identifier.
   */


  const savedTokenData =
    getStorageData(
      STORAGE_KEYS.token
    );


  if (!savedTokenData?.tokenId) {

    throw new Error(
      "No token ID available for backend request."
    );

  }


  const endpoint =
    `${TOKEN_CONFIG.apiBaseUrl}/patient/token/${encodeURIComponent(
      savedTokenData.tokenId
    )}`;


  const response =
    await fetch(
      endpoint,
      {

        method: "GET",

        headers: {

          "Accept":
            "application/json"

          /*
           --------------------------------------------------
           Add authorization here when authentication exists.

           "Authorization":
             `Bearer ${authToken}`
           --------------------------------------------------
          */

        },

        /*
         If your backend uses cookies/session:

         credentials: "include"
        */

      }
    );


  if (!response.ok) {

    throw new Error(
      `Token API failed: ${response.status}`
    );

  }


  const data =
    await response.json();


  return normalizeTokenData(data);

}


/* =========================================================
   NORMALIZE API DATA
   ========================================================= */

function normalizeTokenData(data) {

  return {

    patientName:
      data.patientName ||
      data.name ||
      "Patient",

    tokenNumber:
      data.tokenNumber ||
      data.token ||
      "--",

    status:
      data.status ||
      "Waiting",

    aheadOfYou:
      Number(
        data.aheadOfYou ??
        data.patientsAhead ??
        0
      ),

    estimatedWait:
      Number(
        data.estimatedWait ??
        data.waitingMinutes ??
        0
      ),

    queuePosition:
      Number(
        data.queuePosition ??
        data.position ??
        0
      ),

    /*
     Optional backend fields.

     They don't have to be displayed yet,
     but keeping them here makes the frontend
     easier to extend later.
    */

    tokenId:
      data.tokenId ||
      data.id ||
      null,

    doctorId:
      data.doctorId ||
      null,

    clinicId:
      data.clinicId ||
      null

  };

}


/* =========================================================
   UPDATE TOKEN UI
   ========================================================= */

function updateTokenUI(data) {

  /*
   Patient
  */

  if (elements.patientName) {

    elements.patientName.textContent =
      data.patientName;

  }


  /*
   Token
  */

  if (elements.tokenNumber) {

    elements.tokenNumber.textContent =
      data.tokenNumber;

  }


  /*
   Status
  */

  if (elements.statusText) {

    elements.statusText.textContent =
      formatStatus(data.status);

  }


  /*
   Patients ahead
  */

  if (elements.aheadOfYou) {

    elements.aheadOfYou.textContent =
      safeNumber(data.aheadOfYou);

  }


  /*
   Estimated wait
  */

  if (elements.estimatedWait) {

    elements.estimatedWait.textContent =
      safeNumber(data.estimatedWait);

  }


  /*
   Queue position
  */

  if (elements.queuePosition) {

    elements.queuePosition.textContent =
      safeNumber(data.queuePosition);

  }


  updateStatusAppearance(
    data.status
  );

}


/* =========================================================
   STATUS APPEARANCE
   ========================================================= */

function updateStatusAppearance(status) {

  const normalizedStatus =
    String(status || "")
      .trim()
      .toLowerCase();


  const statusBadge =
    document.querySelector(
      ".status-badge"
    );


  if (!statusBadge) {

    return;

  }


  /*
   Remove previous status classes.
  */

  statusBadge.classList.remove(
    "status-waiting",
    "status-serving",
    "status-called",
    "status-completed",
    "status-cancelled"
  );


  /*
   Add current status class.
  */

  if (
    normalizedStatus === "serving" ||
    normalizedStatus === "in consultation"
  ) {

    statusBadge.classList.add(
      "status-serving"
    );

  }

  else if (
    normalizedStatus === "called"
  ) {

    statusBadge.classList.add(
      "status-called"
    );

  }

  else if (
    normalizedStatus === "completed" ||
    normalizedStatus === "complete"
  ) {

    statusBadge.classList.add(
      "status-completed"
    );

  }

  else if (
    normalizedStatus === "cancelled" ||
    normalizedStatus === "canceled"
  ) {

    statusBadge.classList.add(
      "status-cancelled"
    );

  }

  else {

    statusBadge.classList.add(
      "status-waiting"
    );

  }

}


/* =========================================================
   REFRESH BUTTON
   ========================================================= */

function setupRefreshButton() {

  if (!elements.refreshButton) {

    return;

  }


  elements.refreshButton.addEventListener(
    "click",
    async () => {

      await refreshToken();

    }
  );

}


/* =========================================================
   REFRESH TOKEN
   ========================================================= */

async function refreshToken() {

  if (!elements.refreshButton) {

    return;

  }


  const button =
    elements.refreshButton;


  /*
   Prevent double clicking.
  */

  if (
    button.dataset.loading === "true"
  ) {

    return;

  }


  button.dataset.loading =
    "true";


  button.classList.add(
    "is-refreshing"
  );


  button.setAttribute(
    "aria-busy",
    "true"
  );


  const originalText =
    button.textContent;


  button.textContent =
    "↻  Updating...";


  try {

    await loadTokenData();

  }

  catch (error) {

    console.error(
      "Token refresh failed:",
      error
    );

  }

  finally {

    button.dataset.loading =
      "false";

    button.classList.remove(
      "is-refreshing"
    );

    button.removeAttribute(
      "aria-busy"
    );


    button.textContent =
      originalText;

  }

}


/* =========================================================
   AUTO REFRESH
   ========================================================= */

function startAutoRefresh() {

  /*
   ----------------------------------------------------------
   V1:

   Poll every 15 seconds.

   Backend V2 can replace this with:

   - WebSocket
   - Server-Sent Events
   - Firebase realtime listener
   - Socket.IO

   No UI changes should be required.
   ----------------------------------------------------------
  */

  setInterval(
    async () => {

      /*
       Don't refresh if the page is hidden.
      */

      if (
        document.visibilityState !==
        "visible"
      ) {

        return;

      }


      try {

        await loadTokenData();

      }

      catch (error) {

        console.error(
          "Automatic token refresh failed:",
          error
        );

      }

    },

    TOKEN_CONFIG.refreshInterval

  );

}


/* =========================================================
   STORAGE HELPERS
   ========================================================= */

function getStorageData(key) {

  try {

    const value =
      localStorage.getItem(key);


    if (!value) {

      return null;

    }


    return JSON.parse(value);

  }

  catch (error) {

    console.error(
      `Unable to read storage: ${key}`,
      error
    );

    return null;

  }

}


/* =========================================================
   SAVE STORAGE DATA
   ========================================================= */

function saveStorageData(
  key,
  data
) {

  try {

    localStorage.setItem(
      key,
      JSON.stringify(data)
    );

  }

  catch (error) {

    console.error(
      `Unable to save storage: ${key}`,
      error
    );

  }

}


/* =========================================================
   SAFE NUMBER
   ========================================================= */

function safeNumber(value) {

  const number =
    Number(value);


  if (
    !Number.isFinite(number)
  ) {

    return 0;

  }


  return Math.max(
    0,
    number
  );

}


/* =========================================================
   FORMAT STATUS
   ========================================================= */

function formatStatus(status) {

  if (!status) {

    return "Waiting";

  }


  const value =
    String(status)
      .trim()
      .toLowerCase();


  const statusMap = {

    waiting:
      "Waiting",

    serving:
      "In Consultation",

    "in consultation":
      "In Consultation",

    called:
      "Called",

    completed:
      "Completed",

    complete:
      "Completed",

    cancelled:
      "Cancelled",

    canceled:
      "Cancelled"

  };


  return (
    statusMap[value] ||
    status
  );

}


/* =========================================================
   ERROR STATE
   ========================================================= */

function showErrorState() {

  if (elements.statusText) {

    elements.statusText.textContent =
      "Unable to load";

  }


  if (elements.tokenNumber) {

    elements.tokenNumber.textContent =
      "--";

  }


  if (elements.aheadOfYou) {

    elements.aheadOfYou.textContent =
      "--";

  }


  if (elements.estimatedWait) {

    elements.estimatedWait.textContent =
      "--";

  }


  if (elements.queuePosition) {

    elements.queuePosition.textContent =
      "--";

  }

}