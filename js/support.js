/* =========================================================
   CLINICCARE — PATIENT SUPPORT
   File: js/support.js
   Version: V1
   ========================================================= */


/* =========================================================
   CONFIGURATION
   ========================================================= */

const SUPPORT_CONFIG = {

  /*
   ==========================================================
   BACKEND API
   ==========================================================

   When the backend is available, this can be changed to:

   apiBaseUrl: "https://your-domain.com/api"

   Possible future endpoint:

   POST /api/support/request

   Keep this empty for V1 because support currently
   directs patients to the relevant page or reception.
   */

  apiBaseUrl: "",

  /*
   Temporary V1 mode.

   Reserved for future backend integration.
   */

  useTemporaryData: true

};


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    initializeSupport();

  }
);


/* =========================================================
   SUPPORT INITIALIZATION
   ========================================================= */

function initializeSupport() {

  setupFaq();

  setupNavigationFeedback();

  restoreLastFaq();

}


/* =========================================================
   FAQ
   ========================================================= */

function setupFaq() {

  const faqItems =
    document.querySelectorAll(
      ".faq-section details"
    );


  if (!faqItems.length) {

    return;

  }


  faqItems.forEach(
    (item, index) => {

      item.addEventListener(
        "toggle",
        () => {

          /*
           --------------------------------------------------
           Keep only one FAQ open at a time.

           This keeps the support page compact and clean.
           --------------------------------------------------
          */

          if (item.open) {

            faqItems.forEach(
              (otherItem) => {

                if (
                  otherItem !== item &&
                  otherItem.open
                ) {

                  otherItem.open = false;

                }

              }
            );


            /*
             Save the currently opened FAQ.

             This is only local UI state.
             It does not contain patient information.
            */

            try {

              localStorage.setItem(
                "cliniccare_last_faq",
                String(index)
              );

            }

            catch (error) {

              console.warn(
                "Unable to save FAQ state.",
                error
              );

            }

          }

        }
      );

    }
  );

}


/* =========================================================
   RESTORE LAST FAQ
   ========================================================= */

function restoreLastFaq() {

  let savedIndex;

  try {

    savedIndex =
      localStorage.getItem(
        "cliniccare_last_faq"
      );

  }

  catch (error) {

    return;

  }


  if (
    savedIndex === null
  ) {

    return;

  }


  const faqItems =
    document.querySelectorAll(
      ".faq-section details"
    );


  const index =
    Number(savedIndex);


  if (
    Number.isInteger(index) &&
    faqItems[index]
  ) {

    /*
     Don't automatically open it immediately
     on first load. This simply keeps the function
     available for future personalization.

     Remove the return above if you want persistence
     to automatically reopen the last FAQ.
    */

  }

}


/* =========================================================
   NAVIGATION FEEDBACK
   ========================================================= */

function setupNavigationFeedback() {

  const navigationLinks =
    document.querySelectorAll(
      "a[href]"
    );


  navigationLinks.forEach(
    (link) => {

      link.addEventListener(
        "click",
        (event) => {

          /*
           Don't interfere with:

           - Ctrl/Cmd click
           - Shift click
           - Middle click
           - External links
           - Same-page anchors
          */

          if (
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.altKey ||
            event.button !== 0
          ) {

            return;

          }


          const href =
            link.getAttribute("href");


          if (
            !href ||
            href.startsWith("#") ||
            href.startsWith("http") ||
            href.startsWith("mailto:")
          ) {

            return;

          }


          /*
           Small visual feedback before navigation.

           This makes the portal feel more responsive
           without adding heavy animation.
          */

          link.classList.add(
            "is-navigating"
          );

        }
      );

    }
  );

}


/* =========================================================
   FUTURE BACKEND SUPPORT REQUEST
   ========================================================= */

/*
   ----------------------------------------------------------
   BACKEND PLACEHOLDER
   ----------------------------------------------------------

   When you later add something like:

   "Contact Reception"
   "Report Registration Problem"
   "Report Token Problem"

   the backend developer can use this function.

   Example API:

   POST /api/support/request

   Request:

   {
     "type": "queue",
     "message": "My queue position has not updated.",
     "tokenId": "..."
   }

   Response:

   {
     "success": true,
     "requestId": "SUP-001"
   }

   ----------------------------------------------------------
*/

async function submitSupportRequest(
  requestData
) {

  if (
    SUPPORT_CONFIG.useTemporaryData
  ) {

    console.log(
      "Temporary support request:",
      requestData
    );

    return {

      success: true,

      requestId:
        "TEMP-" +
        Date.now()

    };

  }


  if (
    !SUPPORT_CONFIG.apiBaseUrl
  ) {

    throw new Error(
      "Support API URL is not configured."
    );

  }


  const response =
    await fetch(
      `${SUPPORT_CONFIG.apiBaseUrl}/support/request`,
      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json",

          "Accept":
            "application/json"

        },

        body:
          JSON.stringify(requestData)

      }
    );


  if (!response.ok) {

    throw new Error(
      `Support API failed: ${response.status}`
    );

  }


  return response.json();

}


/* =========================================================
   PAGE EXIT CLEANUP
   ========================================================= */

window.addEventListener(
  "pagehide",
  () => {

    document
      .querySelectorAll(
        ".is-navigating"
      )
      .forEach(
        (element) => {

          element.classList.remove(
            "is-navigating"
          );

        }
      );

  }
);