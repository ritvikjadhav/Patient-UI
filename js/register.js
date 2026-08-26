"use strict";

/* =========================================================
   CLINIC AUTOMATION — PATIENT REGISTRATION
   File: js/register.js

   V1 FRONTEND
   ---------------------------------------------------------
   Current:
   - Form validation
   - LocalStorage fallback
   - Token UI flow

   FUTURE:
   - Replace the LocalStorage registration section with
     a backend API request.
   - The backend/API will handle database operations.
   
   IMPORTANT:
   Frontend should NOT connect directly to MySQL.
   
   Recommended architecture:

   registration.html
          ↓
      register.js
          ↓
      Backend API
          ↓
       Database
          ↓
      API Response
          ↓
       token.html

   ========================================================= */


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const registrationForm = document.getElementById("registrationForm");

const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const mobileInput = document.getElementById("mobile");
const reasonInput = document.getElementById("reason");
const issueInput = document.getElementById("issue");

const nameError = document.getElementById("nameError");
const ageError = document.getElementById("ageError");
const mobileError = document.getElementById("mobileError");
const reasonError = document.getElementById("reasonError");

const characterCount = document.getElementById("characterCount");
const submitButton = document.getElementById("submitButton");


/* =========================================================
   STORAGE KEYS
   ---------------------------------------------------------
   These are only temporary V1 frontend storage keys.

   When the backend is connected, these should no longer
   be treated as the source of truth.
   ========================================================= */

const STORAGE_KEYS = {

  registration: "clinicRegistration",

  token: "clinicToken",

  queue: "clinicQueue"

};


/* =========================================================
   CHARACTER COUNTER
   ========================================================= */

function updateCharacterCount() {

  if (!issueInput || !characterCount) {
    return;
  }

  const length = issueInput.value.length;

  characterCount.textContent = `${length} / 300`;

}


/* =========================================================
   CLEAR ERRORS
   ========================================================= */

function clearErrors() {

  const errors = [
    nameError,
    ageError,
    mobileError,
    reasonError
  ];

  errors.forEach(error => {

    if (error) {
      error.textContent = "";
    }

  });


  const fields = [
    nameInput,
    ageInput,
    mobileInput,
    reasonInput
  ];

  fields.forEach(field => {

    if (field) {
      field.classList.remove("input-error");
    }

  });

}


/* =========================================================
   SHOW ERROR
   ========================================================= */

function showError(field, errorElement, message) {

  if (field) {
    field.classList.add("input-error");
  }

  if (errorElement) {
    errorElement.textContent = message;
  }

}


/* =========================================================
   VALIDATE FORM
   ========================================================= */

function validateForm() {

  clearErrors();

  let isValid = true;

  const name = nameInput.value.trim();

  const age = Number(ageInput.value);

  const mobile = mobileInput.value.trim();

  const reason = reasonInput.value;


  /* -------------------------------------------------------
     NAME
     ------------------------------------------------------- */

  if (name.length < 2) {

    showError(
      nameInput,
      nameError,
      "Please enter your full name."
    );

    isValid = false;

  } else if (!/^[a-zA-Z\s.'-]+$/.test(name)) {

    showError(
      nameInput,
      nameError,
      "Please enter a valid name."
    );

    isValid = false;

  }


  /* -------------------------------------------------------
     AGE
     ------------------------------------------------------- */

  if (
    !Number.isInteger(age) ||
    age < 1 ||
    age > 120
  ) {

    showError(
      ageInput,
      ageError,
      "Please enter a valid age."
    );

    isValid = false;

  }


  /* -------------------------------------------------------
     MOBILE
     ------------------------------------------------------- */

  if (!/^[6-9]\d{9}$/.test(mobile)) {

    showError(
      mobileInput,
      mobileError,
      "Enter a valid 10-digit mobile number."
    );

    isValid = false;

  }


  /* -------------------------------------------------------
     REASON
     ------------------------------------------------------- */

  if (!reason) {

    showError(
      reasonInput,
      reasonError,
      "Please select a reason for your visit."
    );

    isValid = false;

  }


  return isValid;

}


/* =========================================================
   COLLECT FORM DATA
   ---------------------------------------------------------
   IMPORTANT FOR BACKEND DEVELOPER
   ---------------------------------------------------------
   This object is the payload that should eventually be
   sent to the backend API.

   Expected API payload:

   {
     name: "...",
     age: 25,
     mobile: "9876543210",
     reason: "General Consultation",
     issue: "..."
   }

   The backend should generate the official token.
   The frontend should NOT generate the final production
   token because token generation must be controlled by
   the server/database.
   ========================================================= */

function getRegistrationData() {

  return {

    name: nameInput.value.trim(),

    age: Number(ageInput.value),

    mobile: mobileInput.value.trim(),

    reason: reasonInput.value,

    issue: issueInput.value.trim()

  };

}


/* =========================================================
   API INTEGRATION POINT
   =========================================================
   
   BACKEND DEVELOPER:
   
   Replace the V1 LocalStorage flow with an API request here.

   Example future endpoint:

   POST /api/patients/register

   Request body:

   {
     "name": "John Doe",
     "age": 25,
     "mobile": "9876543210",
     "reason": "General Consultation",
     "issue": "Fever"
   }

   Expected backend response:

   {
     "success": true,
     "token": "A023",
     "queuePosition": 7,
     "estimatedWait": 35,
     "registrationId": "..."
   }

   Example implementation:

   async function registerPatientWithAPI(data) {

     const response = await fetch(
       "/api/patients/register",
       {
         method: "POST",

         headers: {
           "Content-Type": "application/json"
         },

         body: JSON.stringify(data)
       }
     );

     if (!response.ok) {
       throw new Error(
         "Registration request failed."
       );
     }

     return await response.json();

   }

   ========================================================= */


/* =========================================================
   TEMPORARY V1 TOKEN GENERATOR
   ---------------------------------------------------------
   This exists ONLY until the backend/database is connected.

   DO NOT use this token generation logic in production.

   Production token should be generated by the backend.
   ========================================================= */

function generateTemporaryToken() {

  const existingToken =
    localStorage.getItem(STORAGE_KEYS.token);

  if (existingToken) {
    return existingToken;
  }


  const today = new Date();

  const dateKey =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");


  const storedQueue =
    JSON.parse(
      localStorage.getItem(
        STORAGE_KEYS.queue
      ) || "null"
    );


  let queueNumber = 1;


  if (
    storedQueue &&
    storedQueue.date === dateKey &&
    Array.isArray(storedQueue.tokens)
  ) {

    queueNumber =
      storedQueue.tokens.length + 1;

  }


  return `A${String(queueNumber).padStart(3, "0")}`;

}


/* =========================================================
   V1 LOCAL STORAGE FALLBACK
   ---------------------------------------------------------
   This function is ONLY for frontend testing.

   Once the backend is available:

   DELETE / DISABLE this function

   and use the API integration point above.
   ========================================================= */

function saveRegistrationLocally() {

  const token =
    generateTemporaryToken();


  const registration = {

    token: token,

    name: nameInput.value.trim(),

    age: Number(ageInput.value),

    mobile: mobileInput.value.trim(),

    reason: reasonInput.value,

    issue: issueInput.value.trim(),

    registeredAt:
      new Date().toISOString(),

    status: "Waiting"

  };


  /* -------------------------------------------------------
     Save registration
     ------------------------------------------------------- */

  localStorage.setItem(
    STORAGE_KEYS.registration,
    JSON.stringify(registration)
  );


  /* -------------------------------------------------------
     Save temporary token
     ------------------------------------------------------- */

  localStorage.setItem(
    STORAGE_KEYS.token,
    token
  );


  /* -------------------------------------------------------
     Temporary queue
     ------------------------------------------------------- */

  const today = new Date();

  const dateKey =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");


  let queueData =
    JSON.parse(
      localStorage.getItem(
        STORAGE_KEYS.queue
      ) || "null"
    );


  if (
    !queueData ||
    queueData.date !== dateKey
  ) {

    queueData = {

      date: dateKey,

      tokens: []

    };

  }


  queueData.tokens.push({

    token: token,

    name: registration.name,

    status: "Waiting",

    registeredAt:
      registration.registeredAt

  });


  localStorage.setItem(
    STORAGE_KEYS.queue,
    JSON.stringify(queueData)
  );


  return registration;

}


/* =========================================================
   SAVE BACKEND RESPONSE
   ---------------------------------------------------------
   When API is connected, use this function to store only
   the information needed by the patient UI.

   The backend remains the source of truth.
   ========================================================= */

function saveRegistrationResponse(data) {

  const registration = {

    token: data.token,

    name: nameInput.value.trim(),

    age: Number(ageInput.value),

    mobile: mobileInput.value.trim(),

    reason: reasonInput.value,

    issue: issueInput.value.trim(),

    queuePosition:
      data.queuePosition ?? null,

    estimatedWait:
      data.estimatedWait ?? null,

    registrationId:
      data.registrationId ?? null,

    status:
      data.status || "Waiting"

  };


  localStorage.setItem(
    STORAGE_KEYS.registration,
    JSON.stringify(registration)
  );


  localStorage.setItem(
    STORAGE_KEYS.token,
    data.token
  );


  return registration;

}


/* =========================================================
   SUBMIT BUTTON STATE
   ========================================================= */

function setLoadingState(isLoading) {

  if (!submitButton) {
    return;
  }


  const text =
    submitButton.querySelector("span");


  if (isLoading) {

    submitButton.disabled = true;

    submitButton.classList.add(
      "is-loading"
    );


    if (text) {

      text.textContent =
        "Creating your token...";

    }

  } else {

    submitButton.disabled = false;

    submitButton.classList.remove(
      "is-loading"
    );


    if (text) {

      text.textContent =
        "Register & Get Token";

    }

  }

}


/* =========================================================
   FORM SUBMISSION
   ========================================================= */

if (registrationForm) {

  registrationForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      /* ---------------------------------------------------
         Validate
         --------------------------------------------------- */

      if (!validateForm()) {

        const firstError =
          document.querySelector(
            ".input-error"
          );


        if (firstError) {

          firstError.focus();

        }


        return;

      }


      /* ---------------------------------------------------
         Loading state
         --------------------------------------------------- */

      setLoadingState(true);


      try {

        const registrationData =
          getRegistrationData();


        /* =================================================
           FUTURE BACKEND/API CALL
           =================================================

           BACKEND DEVELOPER:

           Replace the temporary V1 code below with:

           const result =
             await registerPatientWithAPI(
               registrationData
             );

           Then:

           saveRegistrationResponse(result);

           ================================================= */


        /*
         * -------------------------------------------------
         * V1 TEMPORARY MODE
         * -------------------------------------------------
         *
         * Remove this section when backend is connected.
         */

        await new Promise(resolve => {

          setTimeout(resolve, 450);

        });


        const result =
          saveRegistrationLocally();


        /*
         * -------------------------------------------------
         * PRODUCTION MODE
         * -------------------------------------------------
         *
         * Example:
         *
         * const result =
         *   await registerPatientWithAPI(
         *     registrationData
         *   );
         *
         * saveRegistrationResponse(result);
         *
         * -------------------------------------------------
         */


        if (!result) {

          throw new Error(
            "Registration failed."
          );

        }


        /* ---------------------------------------------------
           Go to token page
           --------------------------------------------------- */

        window.location.href =
          "token.html";


      } catch (error) {

        console.error(
          "Registration error:",
          error
        );


        alert(
          "Unable to complete registration. Please try again."
        );


        setLoadingState(false);

      }

    }
  );

}


/* =========================================================
   CHARACTER COUNT
   ========================================================= */

if (issueInput) {

  issueInput.addEventListener(
    "input",
    updateCharacterCount
  );

}


/* =========================================================
   MOBILE NUMBER
   ========================================================= */

if (mobileInput) {

  mobileInput.addEventListener(
    "input",
    () => {

      mobileInput.value =
        mobileInput.value
          .replace(/\D/g, "")
          .slice(0, 10);

    }
  );

}


/* =========================================================
   AGE INPUT
   ========================================================= */

if (ageInput) {

  ageInput.addEventListener(
    "input",
    () => {

      ageInput.value =
        ageInput.value
          .replace(/\D/g, "")
          .slice(0, 3);

    }
  );

}


/* =========================================================
   REMOVE FIELD ERRORS WHILE EDITING
   ========================================================= */

[
  nameInput,
  ageInput,
  mobileInput,
  reasonInput
].forEach(field => {

  if (!field) {
    return;
  }


  field.addEventListener(
    "input",
    () => {

      field.classList.remove(
        "input-error"
      );


      const error =
        document.getElementById(
          `${field.id}Error`
        );


      if (error) {

        error.textContent = "";

      }

    }
  );

});


/* =========================================================
   INITIALIZE
   ========================================================= */

updateCharacterCount();