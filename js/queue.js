/* Queue V2 */

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

    /*
      Currently serving patient is NOT included here.
      Doctor/backend removes completed patients.
    */

    queue: [
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


/* Normalize queue */

function normalizeQueue(data) {

  if (!data || !Array.isArray(data.queue)) {

    return {
      ...data,
      queue: []
    };
  }

  const servingTokenValue =
    typeof data.currentlyServing === "object"
      ? data.currentlyServing?.token
      : data.currentlyServing;

  return {
    ...data,

    queue: data.queue.filter((item) => {

      if (!item || !item.token) {
        return false;
      }

      if (
        item.status === "Completed" ||
        item.status === "Served" ||
        item.status === "Removed"
      ) {
        return false;
      }

      if (
        servingTokenValue &&
        item.token === servingTokenValue
      ) {
        return false;
      }

      return true;
    })
  };
}


/* Update token information */

function updateToken(data) {

  currentToken.textContent =
    data.token || "—";

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


/* Update currently serving */

function updateCurrentlyServing(data) {

  const serving =
    data.currentlyServing;

  if (!serving) {

    servingToken.textContent = "—";

    servingStatus.textContent =
      "No consultation";

    return;
  }

  if (typeof serving === "string") {

    servingToken.textContent =
      serving;

    servingStatus.textContent =
      data.servingStatus ||
      "In consultation";

    return;
  }

  servingToken.textContent =
    serving.token || "—";

  servingStatus.textContent =
    serving.status ||
    "In consultation";
}


/* Create queue row */

function createQueueRow(item, position) {

  const row =
    document.createElement("article");

  row.className =
    "queue-row";

  const next =
    item.status === "Next";

  const you =
    item.status === "You";

  if (you) {
    row.classList.add("your-row");
  }

  const number =
    document.createElement("span");

  number.className =
    "queue-number";

  number.textContent =
    position;


  const content =
    document.createElement("div");


  const title =
    document.createElement("strong");

  title.textContent =
    `Token ${item.token}`;


  if (you) {

    const label =
      document.createElement("small");

    label.textContent =
      "YOU";

    title.appendChild(label);
  }


  const description =
    document.createElement("span");


  if (next) {

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


  content.append(
    title,
    description
  );


  row.append(
    number,
    content
  );


  if (you) {

    const label =
      document.createElement("b");

    label.textContent =
      "Your token";

    row.appendChild(label);
  }


  return row;
}


/* Update queue */

function updateQueue(data) {

  if (!Array.isArray(data.queue)) {
    queueList.replaceChildren();
    return;
  }

  const fragment =
    document.createDocumentFragment();

  let position = 1;


  data.queue.forEach((item) => {

    fragment.appendChild(
      createQueueRow(
        item,
        position
      )
    );

    position++;
  });


  queueList.replaceChildren(
    fragment
  );
}


/* Calculate queue position */

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

    aheadOfYou.textContent =
      "—";

    yourPosition.textContent =
      "—";

    return;
  }


  const patientsAhead =
    data.queue
      .slice(0, myIndex)
      .filter(
        (item) =>
          item.status !== "Completed" &&
          item.status !== "Served" &&
          item.status !== "Removed"
      )
      .length;


  aheadOfYou.textContent =
    patientsAhead;


  yourPosition.textContent =
    myIndex + 1;
}


/* Update estimated wait */

function updateEstimatedWait(data) {

  if (
    Number.isFinite(
      data.estimatedMinutes
    )
  ) {

    estimatedMinutes.textContent =
      Math.max(
        0,
        data.estimatedMinutes
      );

    return;
  }


  if (!Array.isArray(data.queue)) {

    estimatedMinutes.textContent =
      "—";

    return;
  }


  const myIndex =
    data.queue.findIndex(
      (item) =>
        item.status === "You" ||
        item.token === data.token
    );


  if (myIndex === -1) {

    estimatedMinutes.textContent =
      "—";

    return;
  }


  const patientsAhead =
    data.queue
      .slice(0, myIndex)
      .filter(
        (item) =>
          item.status !== "Completed" &&
          item.status !== "Served" &&
          item.status !== "Removed"
      )
      .length;


  const minutesPerPatient =
    Number.isFinite(
      data.minutesPerPatient
    )
      ? data.minutesPerPatient
      : 3;


  estimatedMinutes.textContent =
    patientsAhead *
    minutesPerPatient;
}


/* Loading state */

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


/* Queue error */

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


    lastQueueData =
      data;


    updateToken(data);

    updateCurrentlyServing(data);

    updateQueue(data);

    calculateQueuePosition(data);

    updateEstimatedWait(data);


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


/* Manual refresh */

refreshButton.addEventListener(
  "click",
  loadQueue
);


/* Automatic refresh */

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


/* Pause polling when hidden */

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


/* Initial load */

loadQueue();

startAutoRefresh();