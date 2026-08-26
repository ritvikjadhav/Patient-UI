"use strict";

document.addEventListener("DOMContentLoaded", () => {

/* =========================================================
TOKEN PAGE — V1
========================================================= */

/* =========================================================
ELEMENTS
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
GET TEMPORARY PATIENT DATA
=========================================================

 V1:
 Data comes from localStorage.

 BACKEND:
 This will later come from an authenticated API request,
 for example:

 GET /api/queue/my-status

 The backend should return:

 {
   "patient": {
     "name": "RITVIK JADHAV"
   },
   "queue": {
     "token": "A-024",
     "status": "Waiting",
     "aheadOfYou": 4,
     "estimatedWait": 12,
     "position": 5
   }
 }

 ========================================================= */

function getPatientData() {

const storedData =
  localStorage.getItem("clinicPatient");

if (!storedData) {
  return null;
}

try {

  return JSON.parse(storedData);

} catch (error) {

  console.error(
    "Invalid patient data.",
    error
  );

  return null;
}

}

/* =========================================================
RENDER PATIENT DATA
========================================================= */

function renderPatientData(patient) {

if (!patient) {
  return;
}


/* ---------- PATIENT NAME ---------- */

if (patientNameElement) {

  patientNameElement.textContent =
    patient.name || "Patient";

}


/* ---------- TOKEN ---------- */

if (tokenNumberElement) {

  tokenNumberElement.textContent =
    patient.token || "A-024";

}


/* ---------- STATUS ---------- */

if (statusTextElement) {

  statusTextElement.textContent =
    patient.status || "Waiting";

}


/* ---------- AHEAD OF YOU ---------- */

if (aheadOfYouElement) {

  aheadOfYouElement.textContent =
    Number.isFinite(Number(patient.aheadOfYou))
      ? patient.aheadOfYou
      : "0";

}


/* ---------- ESTIMATED WAIT ---------- */

if (estimatedWaitElement) {

  estimatedWaitElement.textContent =
    Number.isFinite(Number(patient.estimatedWait))
      ? patient.estimatedWait
      : "0";

}


/* ---------- POSITION ---------- */

if (queuePositionElement) {

  queuePositionElement.textContent =
    Number.isFinite(Number(patient.queuePosition))
      ? patient.queuePosition
      : "1";

}


/* =======================================================
   STATUS VISUAL
   ======================================================= */

updateStatusVisual(
  patient.status || "Waiting"
);

}

/* =========================================================
STATUS VISUAL
========================================================= */

function updateStatusVisual(status) {

if (!statusTextElement) {
  return;
}

const status =
  String(statusTextElement.textContent)
    .toLowerCase();


const statusBadge =
  statusTextElement.closest(".status-badge");

if (!statusBadge) {
  return;
}


statusBadge.classList.remove(
  "status-waiting",
  "status-called",
  "status-serving",
  "status-completed"
);


if (
  status.includes("called")
) {

  statusBadge.classList.add(
    "status-called"
  );

} else if (
  status.includes("serving") ||
  status.includes("consultation")
) {

  statusBadge.classList.add(
    "status-serving"
  );

} else if (
  status.includes("completed") ||
  status.includes("complete")
) {

  statusBadge.classList.add(
    "status-completed"
  );

} else {

  statusBadge.classList.add(
    "status-waiting"
  );

}

}

/* =========================================================
LOAD PATIENT
========================================================= */

const patient =
getPatientData();

/* =========================================================
NO REGISTRATION FOUND
========================================================= */

if (!patient) {

/*
 * No registration exists in this browser.
 *
 * In production, the backend should determine whether
 * the patient has an active registration.
 */

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
  aheadOfYouElement.textContent = "—";
}

if (estimatedWaitElement) {
  estimatedWaitElement.textContent = "—";
}

if (queuePositionElement) {
  queuePositionElement.textContent = "—";
}

return;

}

/* =========================================================
INITIAL RENDER
========================================================= */

renderPatientData(patient);

/* =========================================================
REFRESH
========================================================= */

if (refreshButton) {

refreshButton.addEventListener(
  "click",
  async () => {

    refreshButton.disabled = true;

    refreshButton.textContent =
      "↻  Refreshing...";


    /*
     * ===================================================
     * BACKEND INTEGRATION POINT
     * ===================================================
     *
     * Replace the temporary localStorage refresh below
     * with your API call.
     *
     * Example:
     *
     * const response = await fetch(
     *   "/api/queue/my-status"
     * );
     *
     * if (!response.ok) {
     *   throw new Error("Unable to fetch queue status");
     * }
     *
     * const latestData =
     *   await response.json();
     *
     * renderPatientData({
     *   name: latestData.patient.name,
     *   token: latestData.queue.token,
     *   status: latestData.queue.status,
     *   aheadOfYou: latestData.queue.aheadOfYou,
     *   estimatedWait: latestData.queue.estimatedWait,
     *   queuePosition: latestData.queue.position
     * });
     *
     * ===================================================
     */


    /* ---------- TEMPORARY V1 REFRESH ---------- */

    await new Promise(resolve => {
      setTimeout(resolve, 400);
    });


    const latestPatient =
      getPatientData();

    if (latestPatient) {
      renderPatientData(latestPatient);
    }


    refreshButton.disabled = false;

    refreshButton.textContent =
      "↻  Refresh Status";

  }
);

}

/* =========================================================
OPTIONAL AUTO REFRESH
=========================================================

 V1:
 Refreshes localStorage every 15 seconds.

 BACKEND:
 Change this to an API request when the backend is ready.

 ========================================================= */

const AUTO_REFRESH_INTERVAL =
15000;

setInterval(() => {

const latestPatient =
  getPatientData();

if (latestPatient) {
  renderPatientData(latestPatient);
}

}, AUTO_REFRESH_INTERVAL);

});