/* =========================================================
   CLINIC AUTOMATION — LIVE QUEUE
   File: js/queue.js

   Purpose:
   - Display patient's live queue status
   - Fetch queue data from backend API
   - Refresh queue automatically
   - Handle manual refresh
   - Keep animations subtle and professional

   Backend:
   Replace API_ENDPOINT with your actual backend endpoint.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     CONFIGURATION
     ======================================================= */

  /*
    Example backend endpoint:

    https://your-backend.com/api/patient/queue

    The backend should return data similar to:

    {
      "token": "A-024",
      "status": "Waiting",
      "estimatedWait": 12,
      "aheadOfYou": 4,
      "currentlyServing": "A-019",
      "queue": [
        {
          "token": "A-019",
          "status": "In Consultation"
        },
        {
          "token": "A-020",
          "status": "Next in line"
        },
        {
          "token": "A-021",
          "status": "Waiting"
        }
      ]
    }
  */

  const API_ENDPOINT = "YOUR_BACKEND_API/queue";


  /* =======================================================
     SETTINGS
     ======================================================= */

  const REFRESH_INTERVAL = 30000;


  /* =======================================================
     ELEMENTS
     ======================================================= */

  const tokenElement =
    document.getElementById("currentToken") ||
    document.querySelector(".current-token-number");

  const statusElement =
    document.getElementById("tokenStatus");

  const waitElement =
    document.getElementById("estimatedWait");

  const aheadElement =
    document.getElementById("aheadOfYou");

  const servingElement =
    document.getElementById("currentlyServing");

  const queueList =
    document.getElementById("queueList") ||
    document.querySelector(".queue-list");

  const refreshButton =
    document.getElementById("refreshButton") ||
    document.querySelector(".refresh-queue");

  const liveMessage =
    document.getElementById("liveMessage");

  const liveIndicator =
    document.querySelector(".live-indicator");


  /* =======================================================
     STATE
     ======================================================= */

  let refreshTimer = null;

  let isLoading = false;


  /* =======================================================
     INITIAL LOAD
     ======================================================= */

  loadQueue();


  /* =======================================================
     AUTO REFRESH
     ======================================================= */

  startAutoRefresh();


  /* =======================================================
     MANUAL REFRESH
     ======================================================= */

  if (refreshButton) {

    refreshButton.addEventListener("click", () => {
      loadQueue(true);
    });

  }


  /* =======================================================
     PAGE VISIBILITY
     ======================================================= */

  /*
    Stop unnecessary requests while the patient
    has another browser tab/app open.

    Refresh immediately when they return.
  */

  document.addEventListener("visibilitychange", () => {

    if (document.hidden) {

      stopAutoRefresh();

    } else {

      loadQueue();

      startAutoRefresh();

    }

  });


  /* =======================================================
     LOAD QUEUE
     ======================================================= */

  async function loadQueue(manualRefresh = false) {

    if (isLoading) {
      return;
    }

    isLoading = true;

    setRefreshLoading(true);


    try {

      /*
        Backend request.

        No localStorage is used here.

        Authentication/session/token handling can
        be added by the backend teammate later.
      */

      const response = await fetch(API_ENDPOINT, {
        method: "GET",

        headers: {
          "Accept": "application/json"
        },

        cache: "no-store"
      });


      if (!response.ok) {
        throw new Error(
          `Queue request failed: ${response.status}`
        );
      }


      const data = await response.json();


      /*
        Validate that backend actually returned
        something usable.
      */

      if (!data || typeof data !== "object") {
        throw new Error("Invalid queue response.");
      }


      updateQueue(data);

      showConnectionState(true);


    } catch (error) {

      console.error(
        "Unable to load live queue:",
        error
      );

      showConnectionState(false);

    } finally {

      isLoading = false;

      setRefreshLoading(false);

    }

  }


  /* =======================================================
     UPDATE QUEUE
     ======================================================= */

  function updateQueue(data) {

    /*
      Current patient token
    */

    if (tokenElement && data.token) {

      updateValue(
        tokenElement,
        data.token
      );

    }


    /*
      Patient status
    */

    if (statusElement) {

      const status =
        data.status || "Waiting";

      updateValue(
        statusElement,
        status
      );

    }


    /*
      Estimated waiting time
    */

    if (waitElement) {

      const wait =
        data.estimatedWait;

      if (
        wait !== undefined &&
        wait !== null
      ) {

        updateValue(
          waitElement,
          wait
        );

      }

    }


    /*
      Number of patients ahead
    */

    if (aheadElement) {

      const ahead =
        data.aheadOfYou;

      if (
        ahead !== undefined &&
        ahead !== null
      ) {

        updateValue(
          aheadElement,
          ahead
        );

      }

    }


    /*
      Currently serving token
    */

    if (
      servingElement &&
      data.currentlyServing
    ) {

      updateValue(
        servingElement,
        data.currentlyServing
      );

    }


    /*
      Queue list
    */

    if (
      queueList &&
      Array.isArray(data.queue)
    ) {

      renderQueue(data.queue);

    }

  }


  /* =======================================================
     UPDATE SINGLE VALUE
     ======================================================= */

  function updateValue(element, value) {

    const newValue =
      String(value);

    const oldValue =
      element.textContent.trim();


    /*
      Avoid unnecessary animation
      when the value has not changed.
    */

    if (oldValue === newValue) {
      return;
    }


    element.classList.remove(
      "queue-value-updated"
    );


    /*
      Force browser to recognize
      the animation restart.
    */

    void element.offsetWidth;


    element.textContent =
      newValue;


    element.classList.add(
      "queue-value-updated"
    );


    setTimeout(() => {

      element.classList.remove(
        "queue-value-updated"
      );

    }, 300);

  }


  /* =======================================================
     RENDER QUEUE
     ======================================================= */

  function renderQueue(queue) {

    queueList.innerHTML = "";


    if (queue.length === 0) {

      const emptyState =
        document.createElement("li");

      emptyState.className =
        "queue-empty";

      emptyState.textContent =
        "No patients are currently ahead in the queue.";

      queueList.appendChild(
        emptyState
      );

      return;
    }


    queue.forEach((patient, index) => {

      const item =
        document.createElement("li");

      item.className =
        "queue-item";


      /*
        Identify special queue states.
      */

      const status =
        String(
          patient.status || ""
        ).toLowerCase();


      if (
        status.includes("consultation") ||
        status.includes("serving")
      ) {

        item.classList.add(
          "serving"
        );

      }


      if (
        patient.isCurrent === true ||
        patient.current === true
      ) {

        item.classList.add(
          "current"
        );

      }


      /* =================================================
         POSITION
         ================================================= */

      const number =
        document.createElement("span");

      number.className =
        "queue-number";

      number.textContent =
        patient.position ??
        index + 1;


      /* =================================================
         CONTENT
         ================================================= */

      const content =
        document.createElement("div");

      content.className =
        "queue-item-content";


      const token =
        document.createElement("strong");

      token.textContent =
        patient.token ||
        "—";


      const patientStatus =
        document.createElement("span");

      patientStatus.textContent =
        patient.status ||
        "Waiting";


      content.appendChild(token);

      content.appendChild(
        patientStatus
      );


      /* =================================================
         ARROW
         ================================================= */

      const arrow =
        document.createElement("span");

      arrow.className =
        "queue-arrow";

      arrow.setAttribute(
        "aria-hidden",
        "true"
      );

      arrow.textContent =
        "›";


      /* =================================================
         BUILD ITEM
         ================================================= */

      item.appendChild(number);

      item.appendChild(content);

      item.appendChild(arrow);

      queueList.appendChild(item);


      /*
        Small staggered entrance.

        This is intentionally subtle.
      */

      item.style.opacity = "0";
      item.style.transform =
        "translateY(5px)";


      requestAnimationFrame(() => {

        setTimeout(() => {

          item.style.opacity = "1";
          item.style.transform =
            "translateY(0)";

          item.style.transition =
            "opacity 0.22s ease, transform 0.22s ease";

        }, index * 35);

      });

    });

  }


  /* =======================================================
     REFRESH BUTTON STATE
     ======================================================= */

  function setRefreshLoading(loading) {

    if (!refreshButton) {
      return;
    }


    if (loading) {

      refreshButton.disabled =
        true;

      refreshButton.dataset.originalText =
        refreshButton.textContent;

      refreshButton.textContent =
        "Updating...";

      refreshButton.classList.add(
        "is-loading"
      );

    } else {

      refreshButton.disabled =
        false;

      refreshButton.textContent =
        refreshButton.dataset.originalText ||
        "Refresh Status";

      refreshButton.classList.remove(
        "is-loading"
      );

    }

  }


  /* =======================================================
     CONNECTION STATE
     ======================================================= */

  function showConnectionState(connected) {

    if (liveIndicator) {

      liveIndicator.classList.toggle(
        "offline",
        !connected
      );

    }


    if (liveMessage) {

      if (connected) {

        liveMessage.textContent =
          "Queue status is up to date.";

      } else {

        liveMessage.textContent =
          "Unable to update the queue. Please try again.";

      }

    }

  }


  /* =======================================================
     AUTO REFRESH
     ======================================================= */

  function startAutoRefresh() {

    stopAutoRefresh();


    refreshTimer =
      setInterval(() => {

        if (!document.hidden) {
          loadQueue();
        }

      }, REFRESH_INTERVAL);

  }


  /* =======================================================
     STOP AUTO REFRESH
     ======================================================= */

  function stopAutoRefresh() {

    if (refreshTimer) {

      clearInterval(
        refreshTimer
      );

      refreshTimer = null;

    }

  }


  /* =======================================================
     CLEANUP
     ======================================================= */

  window.addEventListener(
    "beforeunload",
    () => {

      stopAutoRefresh();

    }
  );

});
