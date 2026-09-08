/* Queue V1 */

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


/* Backend / API */

async function fetchQueueData() {

  /*
    BACKEND CONNECTION POINT

    Replace the demo return below with:

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

    Expected response:

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


/* Update token information */

function updateToken(data) {

  currentToken.textContent = data.token || "—";
  queueStatus.textContent = data.status || "Waiting";

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

  servingToken.textContent =
    data.currentlyServing || "—";

  servingStatus.textContent =
    data.servingStatus || "Waiting";
}


/* Create queue row */

function createQueueRow(item, index) {

  const row = document.createElement("article");
  row.className = "queue-row";

  const serving = item.status === "Serving";
  const you = item.status === "You";

  if (serving) {
    row.classList.add("current-row");
  }

  if (you) {
    row.classList.add("your-row");
  }

  const number = document.createElement("span");
  number.className = "queue-number";

  number.textContent = serving
    ? "✓"
    : you
      ? index + 1
      : index;

  const content = document.createElement("div");

  const title = document.createElement("strong");
  title.textContent = `Token ${item.token}`;

  if (you) {
    const label = document.createElement("small");
    label.textContent = "YOU";
    title.appendChild(label);
  }

  const description = document.createElement("span");

  if (serving) {
    description.textContent = "Currently in consultation";
  } else if (item.status === "Next") {
    description.textContent = "Next in line";
  } else if (you) {
    description.textContent =
      Number.isFinite(item.estimatedMinutes)
        ? `Estimated wait ~${item.estimatedMinutes} minutes`
        : "Your current queue position";
  } else {
    description.textContent = "Waiting";
  }

  content.append(title, description);
  row.append(number, content);

  if (serving || you) {

    const label = document.createElement("b");

    label.textContent =
      serving ? "Serving" : "Your token";

    row.appendChild(label);
  }

  return row;
}


/* Update queue */

function updateQueue(data) {

  if (!Array.isArray(data.queue)) {
    return;
  }

  const fragment = document.createDocumentFragment();

  data.queue.forEach((item, index) => {
    fragment.appendChild(
      createQueueRow(item, index)
    );
  });

  queueList.replaceChildren(fragment);
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
    state ? "↻ Updating..." : "↻ Refresh";
}


/* Load queue */

async function loadQueue() {

  if (loading) {
    return;
  }

  setLoading(true);

  try {

    const data = await fetchQueueData();

    updateToken(data);
    updateQueue(data);

  } catch (error) {

    console.error("Queue update failed:", error);

    queueStatus.textContent =
      "Unable to update";

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

  clearInterval(refreshTimer);

  refreshTimer = setInterval(
    loadQueue,
    30000
  );
}


/* Pause polling when page is hidden */

document.addEventListener(
  "visibilitychange",
  () => {

    if (document.visibilityState === "visible") {

      loadQueue();
      startAutoRefresh();

    } else {

      clearInterval(refreshTimer);
    }
  }
);


/* Initial load */

loadQueue();
startAutoRefresh();