"use strict";

document.addEventListener("DOMContentLoaded", () => {

/* =========================================================
REGISTRATION — V1
========================================================= */

const form = document.getElementById("registrationForm");

if (!form) {
return;
}

/* =========================================================
FORM ELEMENTS
========================================================= */

const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const mobileInput = document.getElementById("mobile");
const reasonInput = document.getElementById("reason");
const issueInput = document.getElementById("issue");

const nameError = document.getElementById("nameError");
const ageError = document.getElementById("ageError");
const mobileError = document.getElementById("mobileError");
const reasonError = document.getElementById("reasonError");

const characterCount =
document.getElementById("characterCount");

const submitButton =
document.getElementById("submitButton");

/* =========================================================
CHARACTER COUNTER
========================================================= */

if (issueInput && characterCount) {

const updateCharacterCount = () => {

  characterCount.textContent =
    `${issueInput.value.length} / 300`;

};

issueInput.addEventListener(
  "input",
  updateCharacterCount
);

updateCharacterCount();

}

/* =========================================================
HELPERS
========================================================= */

function clearErrors() {

if (nameError) nameError.textContent = "";
if (ageError) ageError.textContent = "";
if (mobileError) mobileError.textContent = "";
if (reasonError) reasonError.textContent = "";

document
  .querySelectorAll(".form-group")
  .forEach(group => {
    group.classList.remove("has-error");
  });

}

function showError(input, errorElement, message) {

if (errorElement) {
  errorElement.textContent = message;
}

if (input) {
  const group = input.closest(".form-group");

  if (group) {
    group.classList.add("has-error");
  }
}

}

/* =========================================================
VALIDATION
========================================================= */

function validateForm() {

clearErrors();

let isValid = true;


/* ---------- NAME ---------- */

const name =
  nameInput.value.trim();

if (!name) {

  showError(
    nameInput,
    nameError,
    "Please enter your full name."
  );

  isValid = false;

} else if (name.length < 2) {

  showError(
    nameInput,
    nameError,
    "Please enter a valid name."
  );

  isValid = false;
}


/* ---------- AGE ---------- */

const age =
  Number(ageInput.value);

if (!ageInput.value) {

  showError(
    ageInput,
    ageError,
    "Please enter your age."
  );

  isValid = false;

} else if (age < 1 || age > 120) {

  showError(
    ageInput,
    ageError,
    "Please enter an age between 1 and 120."
  );

  isValid = false;
}


/* ---------- MOBILE ---------- */

const mobile =
  mobileInput.value.trim();

if (!mobile) {

  showError(
    mobileInput,
    mobileError,
    "Please enter your mobile number."
  );

  isValid = false;

} else if (!/^[6-9]\d{9}$/.test(mobile)) {

  showError(
    mobileInput,
    mobileError,
    "Enter a valid 10-digit mobile number."
  );

  isValid = false;
}


/* ---------- REASON ---------- */

if (!reasonInput.value) {

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
FORM SUBMISSION
========================================================= */

form.addEventListener("submit", async (event) => {

event.preventDefault();


if (!validateForm()) {
  return;
}


/* =======================================================
   COLLECT PATIENT DATA
   ======================================================= */

const patientData = {

  name: nameInput.value.trim(),

  age: Number(ageInput.value),

  mobile: mobileInput.value.trim(),

  reason: reasonInput.value,

  issue: issueInput.value.trim(),

  /*
   * Temporary V1 queue data.
   *
   * These values are ONLY for frontend demonstration.
   * They will later come from the backend/database.
   */

  token: "A-024",

  aheadOfYou: 4,

  estimatedWait: 12,

  queuePosition: 5,

  status: "Waiting"

};


/* =======================================================
   BACKEND INTEGRATION POINT
   =======================================================

   WHEN BACKEND IS READY:

   Replace the localStorage section below with something
   similar to:

   const response = await fetch("/api/registrations", {
     method: "POST",
     headers: {
       "Content-Type": "application/json"
     },
     body: JSON.stringify({
       name: patientData.name,
       age: patientData.age,
       mobile: patientData.mobile,
       reason: patientData.reason,
       issue: patientData.issue
     })
   });

   const result = await response.json();

   The backend should return something like:

   {
     "token": "A-024",
     "queuePosition": 5,
     "aheadOfYou": 4,
     "estimatedWait": 12,
     "status": "Waiting"
   }

   Then save the returned result for the token page.

   ======================================================= */


/* =======================================================
   TEMPORARY V1 STORAGE
   ======================================================= */

try {

  localStorage.setItem(
    "clinicPatient",
    JSON.stringify(patientData)
  );

} catch (error) {

  console.error(
    "Unable to save patient registration.",
    error
  );

  alert(
    "Unable to save your registration. Please try again."
  );

  return;
}


/* =======================================================
   SUBMIT UI
   ======================================================= */

if (submitButton) {

  submitButton.disabled = true;

  const buttonText =
    submitButton.querySelector("span:first-child");

  if (buttonText) {
    buttonText.textContent =
      "Registration Successful";
  }

}


/* =======================================================
   SMALL SUCCESS DELAY
   ======================================================= */

await new Promise(resolve => {
  setTimeout(resolve, 500);
});


/* =======================================================
   GO TO TOKEN PAGE
   ======================================================= */

window.location.href = "token.html";

});

/* =========================================================
INPUT CLEANUP
========================================================= */

if (nameInput) {

nameInput.addEventListener("input", () => {

  nameInput.value =
    nameInput.value.replace(/\s{2,}/g, " ");

});

}

if (mobileInput) {

mobileInput.addEventListener("input", () => {

  mobileInput.value =
    mobileInput.value
      .replace(/\D/g, "")
      .slice(0, 10);

});

}

if (ageInput) {

ageInput.addEventListener("input", () => {

  ageInput.value =
    ageInput.value
      .replace(/\D/g, "")
      .slice(0, 3);

});

}

/* =========================================================
CLEAR FIELD ERROR WHEN USER CORRECTS INPUT
========================================================= */

[
nameInput,
ageInput,
mobileInput,
reasonInput
].forEach(input => {

if (!input) {
  return;
}

input.addEventListener("input", () => {

  const group =
    input.closest(".form-group");

  if (group) {
    group.classList.remove("has-error");
  }

  const error =
    group?.querySelector(".error-message");

  if (error) {
    error.textContent = "";
  }

});

});

});