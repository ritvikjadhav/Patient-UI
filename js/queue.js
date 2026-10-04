
const $ = (id) => document.getElementById(id);

const currentToken = $("currentToken");
const queueStatus = $("queueStatusText");
const aheadOfYou = $("aheadOfYou");
const estimatedMinutes = $("estimatedMinutes");
const yourPosition = $("yourPosition");
const servingToken = $("servingToken");
const servingStatus = $("servingStatus");
const queueList = $("queueList");
const refreshButton = $("refreshQueueButton");

let refreshTimer = null;
let loading = false;
let lastQueueData = null;
let waitStartedAt = null;


/* Backend / API */

async function fetchQueueData() {

  /*
    BACKEND CONNECTION POINT

    Replace the demo return with:

    const response = await fetch("/api/queue/my-status", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Queue request failed");
    }

    return await response.json();

    Recommended response:

    {
      patientName: "Ritvik",
      token: "A-024",
      status: "Waiting",
      aheadOfYou: 4,
      estimatedMinutes: 12,
      yourPosition: 5,

      currentlyServing: {
        token: "A-019",
        name: "Patient Name",
        status: "In consultation"
      },

      queue: [
        {
          token: "A-019",
          name: "Patient Name",
          status: "Serving"
        },
        {
          token: "A-020",
          name: "Patient Name",
          status: "Next"
        },
        {
          token: "A-021",
          name: "Patient Name",
          status: "Waiting"
        },
        {
          token: "A-022",
          name: "Patient Name",
          status: "Waiting"
        },
        {
          token: "A-023",
          name: "Patient Name",
          status: "Waiting"
        },
        {
          token: "A-024",
          name: "Ritvik",
          status: "You",
          estimatedMinutes: 12
        }
      ]
    }
  */

  return {
    patientName: "Ritvik",
    token: "A-024",
    status: "Waiting",
    aheadOfYou: 4,
    estimatedMinutes: 12,
    yourPosition: 5,

    currentlyServing: {
      token: "A-019",
      name: "Patient A",
      status: "In consultation"
    },

    queue: [
      {
        token: "A-019",
        name: "Patient A",
        status: "Serving"
      },
      {
        token: "A-020",
        name: "Patient B",
        status: "Next"
      },
      {
        token: "A-021",
        name: "Patient C",
        status: "Waiting"
      },
      {
        token: "A-022",
        name: "Patient D",
        status: "Waiting"
      },
      {
        token: "A-023",
        name: "Patient E",
        status: "Waiting"
      },
      {
        token: "A-024",
        name: "Ritvik",
        status: "You",
        estimatedMinutes: 12
      }
    ]
  };
}


/* Normalize queue data */

function normalizeQueue(data) {

  if (!data || !Array.isArray(data.queue)) {
    return {
      ...data,
      queue: []
    };
  }

  return {
    ...data,
    queue: data.queue.filter(
      (item) =>
        item &&
        item.token &&
        item.status !== "Completed" &&
        item.status !== "Served" &&
        item.status !== "Removed"
    )
  };
}


/* Update token information */

function updateToken(data) {

  currentToken.textContent = data.token || "—";

  queueStatus.textContent =
    data.status || "Waiting";

  aheadOfYou.textContent =
    Number.isFinite(data.aheadOfYou)
      ? data.aheadOfYou
      : "—";

  estimatedMinutes.textContent =
    Number.isFinite(data.estimatedMinutes)
      ? data.estimatedMinutes
      : "—";

  yourPosition.textContent =
    Number.isFinite(data.yourPosition)
      ? data.yourPosition
      : "—";
}


/* Update currently serving patient */

function updateCurrentlyServing(data) {

  const serving = data.currentlyServing;

  if (!serving) {

    servingToken.textContent = "—";
    servingStatus.textContent = "No consultation";

    return;
  }

  if (typeof serving === "string") {

    servingToken.textContent = serving;
    servingStatus.textContent =
      data.servingStatus || "In consultation";

    return;
  }

  servingToken.textContent =
    serving.token || "—";

  servingStatus.textContent =
    serving.status || "In consultation";
}


/* Create queue row */

function createQueueRow(item, index) {

  const row = document.createElement("article");

  row.className = "queue-row";

  const serving =
    item.status === "Serving";

  const next =
    item.status === "Next";

  const you =
    item.status === "You";

  if (serving) {
    row.classList.add("current-row");
  }

  if (you) {
    row.classList.add("your-row");
  }

  const number =
    document.createElement("span");

  number.className =
    "queue-number";

  number.textContent =
    serving
      ? "✓"
      : you
        ? index + 1
        : index;

  const content =
    document.createElement("div");

  const title =
    document.createElement("strong");

  title.textContent =
    `Token ${item.token}`;

  if (you) {

    const label =
      document.createElement("small");

    label.textContent = "YOU";

    title.appendChild(label);
  }

  const description =
    document.createElement("span");

  if (serving) {

    description.textContent =
      item.name
        ? `${item.name} is currently in consultation`
        : "Currently in consultation";

  } else if (next) {

    description.textContent =
      item.name
        ? `${item.name} is next in line`
        : "Next in line";

  } else if (you) {

    description.textContent =
      Number.isFinite(item.estimatedMinutes)
        ? `Estimated wait ~${item.estimatedMinutes} minutes`
        : "Your current queue position";

  } else {

    description.textContent =
      item.name
        ? `${item.name} is waiting`
        : "Waiting";
  }

  content.append(title, description);

  row.append(number, content);

  if (serving || you) {

    const label =
      document.createElement("b");

    label.textContent =
      serving
        ? "Serving"
        : "Your token";

    row.appendChild(label);
  }

  return row;
}


/* Update queue */

function updateQueue(data) {

  if (!Array.isArray(data.queue)) {
    return;
  }

  const fragment =
    document.createDocumentFragment();

  data.queue.forEach(
    (item, index) => {

      fragment.appendChild(
        createQueueRow(item, index)
      );
    }
  );

  queueList.replaceChildren(fragment);
}


/* Recalculate patient position */

function calculateQueuePosition(data) {

  if (!Array.isArray(data.queue)) {
    return;
  }

  const myIndex =
    data.queue.findIndex(
      (item) =>
        item.status === "You" ||
        item.token === data.token
    );

  if (myIndex === -1) {

    aheadOfYou.textContent = "—";
    yourPosition.textContent = "—";

    return;
  }

  const patientsAhead =
    data.queue
      .slice(0, myIndex)
      .filter(
        (item) =>
          item.status !== "Serving" &&
          item.status !== "Completed"
      )
      .length;

  aheadOfYou.textContent =
    patientsAhead;

  yourPosition.textContent =
    myIndex + 1;
}


/* Calculate estimated wait */

function calculateEstimatedWait(data) {

  if (!Array.isArray(data.queue)) {
    return;
  }

  const myIndex =
    data.queue.findIndex(
      (item) =>
        item.status === "You" ||
        item.token === data.token
    );

  if (myIndex === -1) {
    estimatedMinutes.textContent = "—";
    return;
  }

  const patientsAhead =
    data.queue
      .slice(0, myIndex)
      .filter(
        (item) =>
          item.status !== "Serving" &&
          item.status !== "Completed"
      )
      .length;

  const minutesPerPatient =
    Number.isFinite(data.minutesPerPatient)
      ? data.minutesPerPatient
      : 3;

  let minutes =
    patientsAhead * minutesPerPatient;

  if (
    waitStartedAt &&
    minutes > 0
  ) {

    const elapsed =
      Math.floor(
        (Date.now() - waitStartedAt) / 60000
      );

    minutes =
      Math.max(
        0,
        minutes - elapsed
      );
  }

  estimatedMinutes.textContent =
    minutes;
}


/* Set loading state */

function setLoading(state) {

  loading = state;

  refreshButton.classList.toggle(
    "is-loading",
    state
  );

  refreshButton.setAttribute(
    "aria-busy",
    String(state)
  );

  refreshButton.textContent =
    state
      ? "↻ Updating..."
      : "↻ Refresh";
}


/* Show queue error */

function showQueueError() {

  queueStatus.textContent =
    "Unable to update";

  servingStatus.textContent =
    "Live queue unavailable";
}


/* Load queue */

async function loadQueue() {

  if (loading) {
    return;
  }

  setLoading(true);

  try {

    const rawData =
      await fetchQueueData();

    const data =
      normalizeQueue(rawData);

    lastQueueData = data;

    if (!waitStartedAt) {
      waitStartedAt = Date.now();
    }

    updateToken(data);
    updateCurrentlyServing(data);
    updateQueue(data);
    calculateQueuePosition(data);
    calculateEstimatedWait(data);

  } catch (error) {

    console.error(
      "Queue update failed:",
      error
    );

    showQueueError();

  } finally {

    setLoading(false);
  }
}


/* Refresh queue */

refreshButton.addEventListener(
  "click",
  loadQueue
);


/* Refresh estimated wait */

function updateWaitTimer() {

  if (!lastQueueData) {
    return;
  }

  calculateEstimatedWait(
    lastQueueData
  );
}


/* Automatic queue refresh */

function startAutoRefresh() {

  clearInterval(
    refreshTimer
  );

  refreshTimer =
    setInterval(
      loadQueue,
      30000
    );
}


/* Pause polling when page is hidden */

document.addEventListener(
  "visibilitychange",
  () => {

    if (
      document.visibilityState ===
      "visible"
    ) {

      loadQueue();
      startAutoRefresh();

    } else {

      clearInterval(
        refreshTimer
      );
    }
  }
);


/* Update timer every minute */

setInterval(
  updateWaitTimer,
  60000
);


/* Initial load */

loadQueue();
startAutoRefresh();