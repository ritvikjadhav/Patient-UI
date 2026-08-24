/* =========================================================
   PATIENT REGISTRATION
   File: register.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("registrationForm");
  const submitButton = document.getElementById("submitButton");

  const nameInput = document.getElementById("name");
  const ageInput = document.getElementById("age");
  const mobileInput = document.getElementById("mobile");
  const reasonInput = document.getElementById("reason");
  const issueInput = document.getElementById("issue");

  const nameError = document.getElementById("nameError");
  const ageError = document.getElementById("ageError");
  const mobileError = document.getElementById("mobileError");
  const reasonError = document.getElementById("reasonError");

  const tokenResult = document.getElementById("tokenResult");
  const tokenNumber = document.getElementById("tokenNumber");
  const patientDisplay = document.getElementById("patientDisplay");

  const formHeader = document.querySelector(".form-header");
  const privacyNote = document.querySelector(".privacy-note");


  /* =========================================================
     ERROR FUNCTIONS
     ========================================================= */

  function showError(input, errorElement) {
    input.classList.add("input-error");
    errorElement.classList.add("show");
  }

  function hideError(input, errorElement) {
    input.classList.remove("input-error");
    errorElement.classList.remove("show");
  }


  /* =========================================================
     VALIDATION
     ========================================================= */

  function validateName() {

    const name = nameInput.value.trim();

    if (name.length < 2) {
      showError(nameInput, nameError);
      return false;
    }

    hideError(nameInput, nameError);
    return true;
  }


  function validateAge() {

    const age = Number(ageInput.value);

    if (
      !ageInput.value ||
      !Number.isInteger(age) ||
      age < 1 ||
      age > 120
    ) {
      showError(ageInput, ageError);
      return false;
    }

    hideError(ageInput, ageError);
    return true;
  }


  function validateMobile() {

    const mobile = mobileInput.value.trim();

    if (!/^[6-9][0-9]{9}$/.test(mobile)) {
      showError(mobileInput, mobileError);
      return false;
    }

    hideError(mobileInput, mobileError);
    return true;
  }


  function validateReason() {

    if (!reasonInput.value) {
      showError(reasonInput, reasonError);
      return false;
    }

    hideError(reasonInput, reasonError);
    return true;
  }


  function validateForm() {

    const validName = validateName();
    const validAge = validateAge();
    const validMobile = validateMobile();
    const validReason = validateReason();

    return (
      validName &&
      validAge &&
      validMobile &&
      validReason
    );
  }


  /* =========================================================
     MOBILE NUMBER
     ========================================================= */

  mobileInput.addEventListener("input", () => {

    mobileInput.value = mobileInput.value
      .replace(/\D/g, "")
      .slice(0, 10);

    if (mobileInput.value.length === 10) {
      validateMobile();
    }

  });


  /* =========================================================
     REAL-TIME ERROR REMOVAL
     ========================================================= */

  nameInput.addEventListener("input", () => {

    if (nameInput.value.trim().length >= 2) {
      hideError(nameInput, nameError);
    }

  });


  ageInput.addEventListener("input", () => {

    const age = Number(ageInput.value);

    if (age >= 1 && age <= 120) {
      hideError(ageInput, ageError);
    }

  });


  reasonInput.addEventListener("change", () => {

    if (reasonInput.value) {
      hideError(reasonInput, reasonError);
    }

  });


  /* =========================================================
     FORM SUBMIT
     ========================================================= */

  form.addEventListener("submit", (event) => {

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


    /* =======================================================
       COLLECT PATIENT DATA
       ======================================================= */

    const patientData = {

      name: nameInput.value.trim(),

      age: Number(ageInput.value),

      mobile: mobileInput.value.trim(),

      reason: reasonInput.value,

      issue: issueInput.value.trim()

    };


    console.log("Patient Data:", patientData);


    /* =======================================================
       BUTTON LOADING
       ======================================================= */

    submitButton.disabled = true;

    submitButton.innerHTML = `
      <span>Joining Queue...</span>
    `;


    /* =======================================================
       DEMO TOKEN

       TEMPORARY ONLY.

       Backend teammate will replace this later.
       ======================================================= */

    setTimeout(() => {

      const tokenNumberValue =
        "A-" +
        String(
          Math.floor(Math.random() * 900) + 100
        );


      showToken(
        tokenNumberValue,
        patientData.name
      );


    }, 700);

  });


  /* =========================================================
     SHOW TOKEN
     ========================================================= */

  function showToken(token, patientName) {

    /* Token */

    tokenNumber.textContent = token;


    /* Patient name */

    patientDisplay.textContent =
      patientName;


    /* Hide registration */

    form.style.display = "none";


    if (formHeader) {
      formHeader.style.display = "none";
    }


    if (privacyNote) {
      privacyNote.style.display = "none";
    }


    /* Show token screen */

    tokenResult.classList.add("show");


    /* Scroll to top */

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }

});