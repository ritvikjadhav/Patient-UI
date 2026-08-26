/* =========================================================
   CLINICCARE — PATIENT REGISTRATION
   File: js/register.js

   V1:
   - Validates registration form
   - Stores patient data temporarily in localStorage
   - Generates a temporary queue token
   - Redirects to token.html
   - Prepared for future backend/API integration

   IMPORTANT:
   token.js should read the same:
   "cliniccare_registration"
   localStorage key.
   ========================================================= */


/* =========================================================
   CONFIGURATION
   ========================================================= */

const STORAGE_KEY = "cliniccare_registration";

const TOKEN_COUNTER_KEY = "cliniccare_token_counter";

const TOKEN_PREFIX = "A-";


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const registrationForm =
  document.getElementById("registrationForm");

const submitButton =
  document.getElementById("submitButton");

const nameInput =
  document.getElementById("name");

const ageInput =
  document.getElementById("age");

const mobileInput =
  document.getElementById("mobile");

const reasonInput =
  document.getElementById("reason");

const issueInput =
  document.getElementById("issue");

const characterCount =
  document.getElementById("characterCount");


/* =========================================================
   CHARACTER COUNT
   ========================================================= */

if (issueInput && characterCount) {

  const updateCharacterCount = () => {

    const currentLength =
      issueInput.value.length;

    characterCount.textContent =
      `${currentLength} / 300`;

  };

  issueInput.addEventListener(
    "input",
    updateCharacterCount
  );

  updateCharacterCount();

}


/* =========================================================
   INPUT HELPERS
   ========================================================= */

function getInputValue(input) {

  if (!input) {
    return "";
  }

  return input.value.trim();

}


/* =========================================================
   ERROR HANDLING
   ========================================================= */

function showError(input, errorId, message) {

  const errorElement =
    document.getElementById(errorId);

  if (input) {
    input.classList.add("input-error");
    input.setAttribute("aria-invalid", "true");
  }

  if (errorElement) {
    errorElement.textContent = message;
  }

}


function clearError(input, errorId) {

  const errorElement =
    document.getElementById(errorId);

  if (input) {
    input.classList.remove("input-error");
    input.removeAttribute("aria-invalid");
  }

  if (errorElement) {
    errorElement.textContent = "";
  }

}


/* =========================================================
   CLEAR ALL ERRORS
   ========================================================= */

function clearAllErrors() {

  clearError(nameInput, "nameError");

  clearError(ageInput, "ageError");

  clearError(mobileInput, "mobileError");

  clearError(reasonInput, "reasonError");

}


/* =========================================================
   NAME VALIDATION
   ========================================================= */

function validateName() {

  const name =
    getInputValue(nameInput);

  clearError(
    nameInput,
    "nameError"
  );

  if (!name) {

    showError(
      nameInput,
      "nameError",
      "Please enter your full name."
    );

    return false;

  }

  if (name.length < 2) {

    showError(
      nameInput,
      "nameError",
      "Name must contain at least 2 characters."
    );

    return false;

  }

  /*
   * Allows:
   * - Letters
   * - Spaces
   * - Apostrophes
   * - Hyphens
   */

  const validName =
    /^[A-Za-zÀ-ÿ' -]+$/.test(name);

  if (!validName) {

    showError(
      nameInput,
      "nameError",
      "Please enter a valid name."
    );

    return false;

  }

  return true;

}


/* =========================================================
   AGE VALIDATION
   ========================================================= */

function validateAge() {

  const age =
    Number(getInputValue(ageInput));

  clearError(
    ageInput,
    "ageError"
  );

  if (!age) {

    showError(
      ageInput,
      "ageError",
      "Please enter your age."
    );

    return false;

  }

  if (age < 1 || age > 120) {

    showError(
      ageInput,
      "ageError",
      "Please enter an age between 1 and 120."
    );

    return false;

  }

  return true;

}


/* =========================================================
   MOBILE VALIDATION
   ========================================================= */

function validateMobile() {

  const mobile =
    getInputValue(mobileInput);

  clearError(
    mobileInput,
    "mobileError"
  );

  if (!mobile) {

    showError(
      mobileInput,
      "mobileError",
      "Please enter your mobile number."
    );

    return false;

  }

  if (!/^[0-9]{10}$/.test(mobile)) {

    showError(
      mobileInput,
      "mobileError",
      "Enter a valid 10-digit mobile number."
    );

    return false;

  }

  return true;

}


/* =========================================================
   REASON VALIDATION
   ========================================================= */

function validateReason() {

  const reason =
    getInputValue(reasonInput);

  clearError(
    reasonInput,
    "reasonError"
  );

  if (!reason) {

    showError(
      reasonInput,
      "reasonError",
      "Please select a reason for your visit."
    );

    return false;

  }

  return true;

}


/* =========================================================
   VALIDATE FORM
   ========================================================= */

function validateForm() {

  const nameValid =
    validateName();

  const ageValid =
    validateAge();

  const mobileValid =
    validateMobile();

  const reasonValid =
    validateReason();

  return (
    nameValid &&
    ageValid &&
    mobileValid &&
    reasonValid
  );

}


/* =========================================================
   TEMPORARY TOKEN GENERATOR
   =========================================================

   This is ONLY for V1 frontend testing.

   Backend version should generate the token on the
   server/database side to avoid duplicate tokens when
   multiple patients register at the same time.
   ========================================================= */

function generateTemporaryToken() {

  let currentNumber =
    Number(
      localStorage.getItem(
        TOKEN_COUNTER_KEY
      )
    );

  /*
   * Start V1 demo queue from A-024.
   */

  if (
    !Number.isInteger(currentNumber) ||
    currentNumber < 24
  ) {

    currentNumber = 23;

  }

  currentNumber += 1;

  localStorage.setItem(
    TOKEN_COUNTER_KEY,
    String(currentNumber)
  );

  return (
    TOKEN_PREFIX +
    String(currentNumber).padStart(3, "0")
  );

}


/* =========================================================
   TEMPORARY QUEUE DATA
   ========================================================= */

function createTemporaryQueueData(token) {

  /*
   * Temporary values for frontend demonstration.
   *
   * These values will eventually come from the backend
   * queue API.
   */

  return {

    status: "Waiting",

    currentlyServing: "A-019",

    aheadOfYou: 4,

    estimatedWait: 12,

    position: 5,

    token: token

  };

}


/* =========================================================
   SAVE REGISTRATION
   ========================================================= */

function saveRegistration(patientData) {

  /*
   =========================================================
   TEMPORARY V1 STORAGE
   =========================================================

   Currently the patient registration is stored locally
   in the browser.

   This allows the complete frontend to work before the
   backend/database is connected.
   */

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(patientData)
  );


  /*
   =========================================================
   BACKEND / API INTEGRATION
   =========================================================

   WHEN BACKEND IS READY:

   Replace the localStorage registration logic with
   something similar to:

   fetch("/api/patients/register", {
     method: "POST",
     headers: {
       "Content-Type": "application/json"
     },
     body: JSON.stringify(patientData)
   });

   The backend should then:

   1. Validate patient information.
   2. Save patient information in the database.
   3. Generate a unique queue token.
   4. Calculate queue position.
   5. Calculate estimated waiting time.
   6. Return the registration/token information.

   Example expected response:

   {
     success: true,
     patientId: 123,
     token: "A-024",
     position: 5,
     aheadOfYou: 4,
     estimatedWait: 12,
     status: "Waiting"
   }

   IMPORTANT:
   Token generation should eventually happen on the
   backend/database, NOT inside this frontend JavaScript.
   ========================================================= */

}


/* =========================================================
   SUBMIT REGISTRATION
   ========================================================= */

async function handleRegistrationSubmit(event) {

  event.preventDefault();


  clearAllErrors();


  /* Validate */

  const isValid =
    validateForm();

  if (!isValid) {

    const firstError =
      document.querySelector(
        ".input-error"
      );

    if (firstError) {
      firstError.focus();
    }

    return;

  }


  /* =======================================================
     GET FORM DATA
     ======================================================= */

  const patientName =
    getInputValue(nameInput);

  const age =
    Number(getInputValue(ageInput));

  const mobile =
    getInputValue(mobileInput);

  const reason =
    getInputValue(reasonInput);

  const issue =
    getInputValue(issueInput);


  /* =======================================================
     GENERATE TEMPORARY TOKEN
     ======================================================= */

  const token =
    generateTemporaryToken();


  /* =======================================================
     CREATE PATIENT RECORD
     ======================================================= */

  const patientData = {

    /*
     * Patient information
     */

    patient: {

      name: patientName,

      age: age,

      mobile: mobile,

      reason: reason,

      issue: issue

    },


    /*
     * Queue information
     */

    queue: createTemporaryQueueData(token),


    /*
     * Registration information
     */

    registration: {

      registeredAt:
        new Date().toISOString(),

      date:
        new Date().toISOString().split("T")[0],

      source:
        "patient-portal"

    }

  };


  /* =======================================================
     DISABLE BUTTON
     ======================================================= */

  if (submitButton) {

    submitButton.disabled = true;

    submitButton.classList.add(
      "is-loading"
    );

    const buttonText =
      submitButton.querySelector("span");

    if (buttonText) {

      buttonText.textContent =
        "Registering...";

    }

  }


  /* =======================================================
     TEMPORARY FRONTEND SAVE
     ======================================================= */

  try {

    saveRegistration(
      patientData
    );


    /*
     * Small delay gives the button/loading state a smooth
     * transition instead of instantly changing pages.
     */

    await new Promise(
      resolve =>
        setTimeout(resolve, 350)
    );


    /* =====================================================
       REDIRECT TO TOKEN PAGE
       ===================================================== */

    window.location.href =
      "token.html";


  } catch (error) {

    console.error(
      "Registration failed:",
      error
    );


    if (submitButton) {

      submitButton.disabled = false;

      submitButton.classList.remove(
        "is-loading"
      );

      const buttonText =
        submitButton.querySelector("span");

      if (buttonText) {

        buttonText.textContent =
          "Register & Get Token";

      }

    }

    alert(
      "Something went wrong. Please try again."
    );

  }

}


/* =========================================================
   FORM EVENT
   ========================================================= */

if (registrationForm) {

  registrationForm.addEventListener(
    "submit",
    handleRegistrationSubmit
  );

}


/* =========================================================
   REAL-TIME INPUT CLEANUP
   ========================================================= */


/* Mobile: numbers only */

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


/* Age: numbers only */

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


/* Name: remove unnecessary leading spaces */

if (nameInput) {

  nameInput.addEventListener(
    "input",
    () => {

      nameInput.value =
        nameInput.value
          .replace(/\s{2,}/g, " ");

    }
  );

}


/* =========================================================
   CLEAR VALIDATION ERROR WHILE TYPING
   ========================================================= */

if (nameInput) {

  nameInput.addEventListener(
    "input",
    () => {

      if (
        nameInput.classList.contains(
          "input-error"
        )
      ) {

        clearError(
          nameInput,
          "nameError"
        );

      }

    }
  );

}


if (ageInput) {

  ageInput.addEventListener(
    "input",
    () => {

      if (
        ageInput.classList.contains(
          "input-error"
        )
      ) {

        clearError(
          ageInput,
          "ageError"
        );

      }

    }
  );

}


if (mobileInput) {

  mobileInput.addEventListener(
    "input",
    () => {

      if (
        mobileInput.classList.contains(
          "input-error"
        )
      ) {

        clearError(
          mobileInput,
          "mobileError"
        );

      }

    }
  );

}


if (reasonInput) {

  reasonInput.addEventListener(
    "change",
    () => {

      if (
        reasonInput.classList.contains(
          "input-error"
        )
      ) {

        clearError(
          reasonInput,
          "reasonError"
        );

      }

    }
  );

}


/* =========================================================
   DEVELOPMENT HELPER
   =========================================================

   Open browser console and run:

   JSON.parse(
     localStorage.getItem("cliniccare_registration")
   )

   to see the currently registered patient.

   To completely clear V1 test data:

   localStorage.removeItem("cliniccare_registration");

   localStorage.removeItem("cliniccare_token_counter");

   ========================================================= */