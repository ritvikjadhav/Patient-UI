"use strict";

/* =========================================================
   CLINIC AUTOMATION — PATIENT REGISTRATION
   File: js/register.js
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


  /* -----------------------------------------
     NAME
     ----------------------------------------- */

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


  /* -----------------------------------------
     AGE
     ----------------------------------------- */

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


  /* -----------------------------------------
     MOBILE
     ----------------------------------------- */

  if (!/^[6-9]\d{9}$/.test(mobile)) {

    showError(
      mobileInput,
      mobileError,
      "Enter a valid 10-digit mobile number."
    );

    isValid = false;

  }


  /* -----------------------------------------
     REASON
     ----------------------------------------- */

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
   GENERATE TOKEN
   ========================================================= */

function generateToken() {

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
      localStorage.getItem(STORAGE_KEYS.queue) || "null"
    );

  let queueNumber = 1;

  if (
    storedQueue &&
    storedQueue.date === dateKey &&
    Array.isArray(storedQueue.tokens)
  ) {
    queueNumber = storedQueue.tokens.length + 1;
  }

  const token = `A${String(queueNumber).padStart(3, "0")}`;

  return token;

}


/* =========================================================
   SAVE REGISTRATION
   ========================================================= */

function saveRegistration() {

  const token = generateToken();

  const registration = {

    token: token,

    name: nameInput.value.trim(),

    age: Number(ageInput.value),

    mobile: mobileInput.value.trim(),

    reason: reasonInput.value,

    issue: issueInput.value.trim(),

    registeredAt: new Date().toISOString(),

    status: "Waiting"

  };


  /* -----------------------------------------
     Save patient registration
     ----------------------------------------- */

  localStorage.setItem(
    STORAGE_KEYS.registration,
    JSON.stringify(registration)
  );


  /* -----------------------------------------
     Save token
     ----------------------------------------- */

  localStorage.setItem(
    STORAGE_KEYS.token,
    token
  );


  /* -----------------------------------------
     Update today's queue
     ----------------------------------------- */

  const today = new Date();

  const dateKey =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");


  let queueData =
    JSON.parse(
      localStorage.getItem(STORAGE_KEYS.queue) || "null"
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
    registeredAt: registration.registeredAt
  });


  localStorage.setItem(
    STORAGE_KEYS.queue,
    JSON.stringify(queueData)
  );


  return registration;

}


/* =========================================================
   SUBMIT BUTTON LOADING STATE
   ========================================================= */

function setLoadingState(isLoading) {

  if (!submitButton) {
    return;
  }

  if (isLoading) {

    submitButton.disabled = true;

    submitButton.classList.add("is-loading");

    const text = submitButton.querySelector("span");

    if (text) {
      text.textContent = "Creating your token...";
    }

  } else {

    submitButton.disabled = false;

    submitButton.classList.remove("is-loading");

    const text = submitButton.querySelector("span");

    if (text) {
      text.textContent = "Register & Get Token";
    }

  }

}


/* =========================================================
   FORM SUBMISSION
   ========================================================= */

if (registrationForm) {

  registrationForm.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();


      /* Validate */

      if (!validateForm()) {

        const firstError =
          document.querySelector(".input-error");

        if (firstError) {
          firstError.focus();
        }

        return;

      }


      /* Loading */

      setLoadingState(true);


      /*
       * Small delay gives the interface a smooth
       * submission state before moving to token page.
       */

      setTimeout(() => {

        saveRegistration();

        window.location.href = "token.html";

      }, 450);

    }
  );

}


/* =========================================================
   LIVE CHARACTER COUNT
   ========================================================= */

if (issueInput) {

  issueInput.addEventListener(
    "input",
    updateCharacterCount
  );

}


/* =========================================================
   MOBILE NUMBER INPUT
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
   REMOVE ERROR WHEN USER CORRECTS FIELD
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

      field.classList.remove("input-error");

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