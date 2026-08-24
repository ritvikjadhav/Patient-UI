/* =========================================================
   PATIENT REGISTRATION
   File: register.js

   Backend / Database:
   Handled by backend team.
   This file only collects data, sends the request,
   and displays the response.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     ELEMENTS
     ======================================================= */

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


  /* =======================================================
     ERROR FUNCTIONS
     ======================================================= */

  function showError(input, errorElement) {
    input.classList.add("input-error");
    errorElement.classList.add("show");
  }


  function hideError(input, errorElement) {
    input.classList.remove("input-error");
    errorElement.classList.remove("show");
  }


  /* =======================================================
     VALIDATION
     ======================================================= */

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

    const pattern = /^[6-9][0-9]{9}$/;

    if (!pattern.test(mobile)) {
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

    return (
      validateName() &&
      validateAge() &&
      validateMobile() &&
      validateReason()
    );
  }


  /* =======================================================
     MOBILE INPUT
     ======================================================= */

  mobileInput.addEventListener("input", () => {

    mobileInput.value =
      mobileInput.value
        .replace(/\D/g, "")
        .slice(0, 10);

    if (mobileInput.value.length === 10) {
      validateMobile();
    }

  });


  /* =======================================================
     REAL-TIME VALIDATION
     ======================================================= */

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


  /* =======================================================
     FORM SUBMIT
     ======================================================= */

  form.addEventListener("submit", async (event) => {

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


    /* =====================================================
       PATIENT DATA

       These are the fields your backend teammate
       can use for the API request.
       ===================================================== */

    const patientData = {

      name: nameInput.value.trim(),

      age: Number(ageInput.value),

      mobile: mobileInput.value.trim(),

      reason: reasonInput.value,

      issue: issueInput.value.trim()

    };


    console.log("Patient data:", patientData);


    /* =====================================================
       LOADING STATE
       ===================================================== */

    submitButton.disabled = true;

    submitButton.classList.add("loading");

    submitButton.innerHTML = `
      <span>Joining Queue...</span>
      <span class="button-spinner"></span>
    `;


    /* =====================================================
       BACKEND INTEGRATION POINT
       =====================================================

       Your backend teammate will provide the API URL.

       Example:

       const response = await fetch(
         "https://your-backend-url/api/patients/register",
         {
           method: "POST",
           headers: {
             "Content-Type": "application/json"
           },
           body: JSON.stringify(patientData)
         }
       );

       const data = await response.json();

       if (!response.ok) {
         throw new Error(
           data.message || "Registration failed."
         );
       }

       showToken(data.token, data.patientName);

       ===================================================== */

    try {

      /*
       * TEMPORARILY STOP HERE.
       *
       * Do NOT generate a fake token.
       *
       * Once backend teammate gives the API endpoint,
       * put the fetch() request above here.
       */

      console.log(
        "Ready to send patient data to backend:",
        patientData
      );


      /*
       * Temporary delay only for UI testing.
       */

      await new Promise((resolve) => {
        setTimeout(resolve, 700);
      });


      /*
       * REMOVE THIS DEMO SECTION WHEN BACKEND IS CONNECTED.
       */

      const demoToken = "A-024";

      showToken(
        demoToken,
        patientData.name
      );


    } catch (error) {

      console.error(
        "Registration error:",
        error
      );

      alert(
        "Unable to register right now. Please try again."
      );

      submitButton.disabled = false;

      submitButton.classList.remove("loading");

      submitButton.innerHTML = `
        <span>Get Token</span>
        <span>→</span>
      `;

    }

  });


  /* =======================================================
     SHOW TOKEN SCREEN
     ======================================================= */

  function showToken(token, patientName) {

    tokenNumber.textContent = token;

    patientDisplay.textContent = patientName;

    form.style.display = "none";

    if (formHeader) {
      formHeader.style.display = "none";
    }

    if (privacyNote) {
      privacyNote.style.display = "none";
    }

    tokenResult.classList.add("show");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }

});