/* =========================================================
   CLINIC AUTOMATION — PATIENT LIVE QUEUE
   File: js/queue.js
   Version: V1 Launch Ready

   DATABASE / API INTEGRATION
   ---------------------------------------------------------
   This V1 file uses demo/local data so the UI can be tested
   without a backend.

   When the database/API is ready, replace the demo data inside
   fetchQueueData() with the real API request.

   Example:

   const response = await fetch("/api/queue/my-status", {
     method: "GET",
     headers: {
       "Content-Type": "application/json"
     }
   });

   const data = await response.json();

   return data;

   The backend should return data in this structure:

   {
     token: "A-024",
     status: "Waiting",
     aheadOfYou: 4,
     estimatedMinutes: 12,
     yourPosition: 5,
     currentlyServing: "A-019",
     servingStatus: "In consultation",
     queue: [
       {
         token: "A-019",
         status: "Serving"
       },
       {
         token: "A-020",
         status: "Next"
       },
       {
         token: "A-021",
         status: "Waiting"
       },
       {
         token: "A-022",
         status: "Waiting"
       },
       {
         token: "A-023",
         status: "Waiting"
       },
       {
         token: "A-024",
         status: "You",
         estimatedMinutes: 12
       }
     ]
   }

   IMPORTANT:
   Do not store sensitive patient information in
   localStorage in the production version.
   The backend should identify the authenticated patient
   and return only the required queue information.
   ========================================================= */


/* =========================================================
   DOM REFERENCES
   ========================================================= */

const currentTokenElement =
  document.getElementById("currentToken");

const queueStatusText =
  document.getElementById("queueStatusText");

const aheadOfYouElement =
  document.getElementById("aheadOfYou");

const estimatedMinutesElement =
  document.getElementById("estimatedMinutes");

const yourPositionElement =
  document.getElementById("yourPosition");

const servingTokenElement =
  document.getElementById("servingToken");

const servingStatusElement =
  document.getElementById("servingStatus");

const queueListElement =
  document.getElementById("queueList");

const refreshQueueButton =
  document.getElementById("refreshQueueButton");


/* =========================================================
   DEMO QUEUE DATA
   ---------------------------------------------------------
   Replace this function with the API call when backend
   integration is ready.
   ========================================================= */

async function fetchQueueData() {

  /*
   ==========================================================
   API / DATABASE CONNECTION POINT
   ==========================================================

   Example production implementation:

   const response = await fetch("/api/queue/my-status", {
     method: "GET",
     headers: {
       "Content-Type": "application/json"
     }
   });

   if (!response.ok) {
     throw new Error("Unable to load queue.");
   }

   return await response.json();

   ==========================================================
  */


  /*
   Temporary V1 demo data.
   */

  return {
    token: "A-024",
    status: "Waiting",

    aheadOfYou: 4,
    estimatedMinutes: 12,
    yourPosition: 5,

    currentlyServing: "A-019",
    servingStatus: "In consultation",

    queue: [
      {
        token: "A-019",
        status: "Serving"
      },
      {
        token: "A-020",
        status: "Next"
      },
      {
        token: "A-021",
        status: "Waiting"
      },
      {
        token: "A-022",
        status: "Waiting"
      },
      {
        token: "A-023",
        status: "Waiting"
      },
      {
        token: "A-024",
        status: "You",
        estimatedMinutes: 12
      }
    ]
  };
}


/* =========================================================
   UPDATE MAIN TOKEN INFORMATION
   ========================================================= */

function updateTokenInformation(data) {

  if (currentTokenElement) {
    currentTokenElement.textContent =
      data.token || "—";
  }

  if (queueStatusText) {
    queueStatusText.textContent =
      data.status || "Waiting";
  }

  if (aheadOfYouElement) {
    aheadOfYouElement.textContent =
      Number.isFinite(data.aheadOfYou)
        ? data.aheadOfYou
        : "—";
  }

  if (estimatedMinutesElement) {
    estimatedMinutesElement.textContent =
      Number.isFinite(data.estimatedMinutes)
        ? data.estimatedMinutes
        : "—";
  }

  if (yourPositionElement) {
    yourPositionElement.textContent =
      Number.isFinite(data.yourPosition)
        ? data.yourPosition
        : "—";
  }
}


/* =========================================================
   UPDATE CURRENTLY SERVING
   ========================================================= */

function updateServingInformation(data) {

  if (servingTokenElement) {
    servingTokenElement.textContent =
      data.currentlyServing || "—";
  }

  if (servingStatusElement) {
    servingStatusElement.textContent =
      data.servingStatus || "Waiting";
  }
}


/* =========================================================
   CREATE QUEUE ROW
   ========================================================= */

function createQueueRow(item, index) {

  const article =
    document.createElement("article");

  article.className = "queue-row";

  const isServing =
    item.status === "Serving";

  const isNext =
    item.status === "Next";

  const isYou =
    item.status === "You";

  if (isServing) {
    article.classList.add("current-row");
  }

  if (isYou) {
    article.classList.add("your-row");
  }


  /* =======================================================
     NUMBER / STATUS ICON
     ======================================================= */

  const number =
    document.createElement("span");

  number.className = "queue-number";

  if (isServing) {
    number.textContent = "✓";
  } else if (isYou) {
    number.textContent =
      index + 1;
  } else {
    number.textContent =
      index;
  }


  /* =======================================================
     CONTENT
     ======================================================= */

  const content =
    document.createElement("div");


  const title =
    document.createElement("strong");

  title.textContent =
    `Token ${item.token}`;


  if (isYou) {

    const youLabel =
      document.createElement("small");

    youLabel.textContent = "YOU";

    title.appendChild(youLabel);
  }


  content.appendChild(title);


  const description =
    document.createElement("span");


  if (isServing) {

    description.textContent =
      "Currently in consultation";

  } else if (isNext) {

    description.textContent =
      "Next in line";

  } else if (isYou) {

    if (
      Number.isFinite(item.estimatedMinutes)
    ) {

      description.textContent =
        `Estimated wait ~${item.estimatedMinutes} minutes`;

    } else {

      description.textContent =
        "Your current queue position";
    }

  } else {

    description.textContent =
      "Waiting";
  }


  content.appendChild(description);


  /* =======================================================
     RIGHT LABEL
     ======================================================= */

  let rightLabel = null;


  if (isServing || isYou) {

    rightLabel =
      document.createElement("b");

    if (isServing) {
      rightLabel.textContent =
        "Serving";
    }

    if (isYou) {
      rightLabel.textContent =
        "Your token";
    }
  }


  /* =======================================================
     APPEND
     ======================================================= */

  article.appendChild(number);
  article.appendChild(content);

  if (rightLabel) {
    article.appendChild(rightLabel);
  }

  return article;
}


/* =========================================================
   UPDATE QUEUE LIST
   ========================================================= */

function updateQueueList(data) {

  if (!queueListElement) {
    return;
  }

  const fragment =
    document.createDocumentFragment();

  if (
    !Array.isArray(data.queue) ||
    data.queue.length === 0
  ) {

    const emptyState =
      document.createElement("div");

    emptyState.className = "queue-row";

    emptyState.innerHTML = `
      <span class="queue-number">—</span>
      <div>
        <strong>No queue information</strong>
        <span>Please refresh in a moment.</span>
      </div>
    `;

    fragment.appendChild(emptyState);

  } else {

    data.queue.forEach((item, index) => {

      fragment.appendChild(
        createQueueRow(item, index)
      );

    });
  }

  queueListElement.replaceChildren(fragment);
}


/* =========================================================
   LOAD QUEUE
   ========================================================= */

async function loadQueue() {

  try {

    setRefreshState(true);


    const data =
      await fetchQueueData();


    if (!data) {
      throw new Error(
        "No queue data received."
      );
    }


    updateTokenInformation(data);

    updateServingInformation(data);

    updateQueueList(data);


    /*
     ========================================================
     Optional future behaviour:

     If the backend returns a queue version/timestamp,
     it can be used to determine whether the UI actually
     changed before animating the update.
     ========================================================
    */


  } catch (error) {

    console.error(
      "Queue loading failed:",
      error
    );

    showQueueError();

  } finally {

    setRefreshState(false);
  }
}


/* =========================================================
   REFRESH BUTTON STATE
   ========================================================= */

function setRefreshState(isLoading) {

  if (!refreshQueueButton) {
    return;
  }

  refreshQueueButton.classList.toggle(
    "is-loading",
    isLoading
  );

  refreshQueueButton.setAttribute(
    "aria-busy",
    String(isLoading)
  );


  if (isLoading) {

    refreshQueueButton.dataset.originalText =
      refreshQueueButton.textContent;

    refreshQueueButton.textContent =
      "↻ Updating...";

  } else {

    refreshQueueButton.textContent =
      "↻ Refresh";
  }
}


/* =========================================================
   ERROR STATE
   ========================================================= */

function showQueueError() {

  if (queueStatusText) {
    queueStatusText.textContent =
      "Unable to update";
  }

  if (queueListElement) {

    const errorRow =
      document.createElement("div");

    errorRow.className = "queue-row";

    errorRow.innerHTML = `
      <span class="queue-number">!</span>

      <div>
        <strong>Queue update unavailable</strong>
        <span>Please try refreshing again.</span>
      </div>
    `;

    queueListElement.replaceChildren(
      errorRow
    );
  }
}


/* =========================================================
   MANUAL REFRESH
   ========================================================= */

if (refreshQueueButton) {

  refreshQueueButton.addEventListener(
    "click",
    loadQueue
  );
}


/* =========================================================
   AUTOMATIC QUEUE REFRESH
   =========================================================

   V1:
   Refresh every 30 seconds.

   Production:
   WebSocket / Server-Sent Events can replace this
   polling mechanism for true real-time queue updates.

   Example future architecture:

   WebSocket
       ↓
   Queue event
       ↓
   Update UI
       ↓
   Patient sees new position

   ========================================================= */

const QUEUE_REFRESH_INTERVAL =
  30000;

let queueRefreshTimer =
  null;


function startQueueRefresh() {

  if (queueRefreshTimer) {
    clearInterval(queueRefreshTimer);
  }

  queueRefreshTimer =
    setInterval(
      loadQueue,
      QUEUE_REFRESH_INTERVAL
    );
}


/* =========================================================
   PAGE VISIBILITY
   ---------------------------------------------------------
   Don't waste requests while the patient has another
   browser tab/app open.
   ========================================================= */

document.addEventListener(
  "visibilitychange",
  () => {

    if (
      document.visibilityState === "visible"
    ) {

      loadQueue();

      startQueueRefresh();

    } else {

      if (queueRefreshTimer) {

        clearInterval(
          queueRefreshTimer
        );

        queueRefreshTimer = null;
      }
    }
  }
);


/* =========================================================
   INITIAL LOAD
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadQueue();

    startQueueRefresh();

  }
);