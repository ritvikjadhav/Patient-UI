const SUPPORT_CONFIG = {
  apiBaseUrl: "",
  useTemporaryData: true
};

document.addEventListener("DOMContentLoaded", initializeSupport);

function initializeSupport() {
  setupFaq();
  setupNavigationFeedback();
}

function setupFaq() {
  const faqItems = document.querySelectorAll(".faq-section details");

  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;

      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.open) {
          otherItem.open = false;
        }
      });
    });
  });
}

function setupNavigationFeedback() {
  const navigationLinks = document.querySelectorAll(
    'a[href]:not([target="_blank"])'
  );

  navigationLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {
        return;
      }

      const href = link.getAttribute("href");

      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("//") ||
        /^(https?:|mailto:|tel:|javascript:)/i.test(href)
      ) {
        return;
      }

      link.classList.add("is-navigating");
    });
  });
}

async function submitSupportRequest(requestData) {
  if (!requestData || typeof requestData !== "object") {
    throw new TypeError("A valid support request is required.");
  }

  if (SUPPORT_CONFIG.useTemporaryData) {
    return {
      success: true,
      requestId: `TEMP-${Date.now()}`
    };
  }

  const baseUrl = SUPPORT_CONFIG.apiBaseUrl.trim();

  if (!baseUrl) {
    throw new Error("Support API URL is not configured.");
  }

  const response = await fetch(
    `${baseUrl.replace(/\/+$/, "")}/support/request`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(requestData)
    }
  );

  if (!response.ok) {
    throw new Error(`Support request failed (${response.status}).`);
  }

  return response.json();
}

window.addEventListener("pagehide", () => {
  document.querySelectorAll(".is-navigating").forEach((element) => {
    element.classList.remove("is-navigating");
  });
});