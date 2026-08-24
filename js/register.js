/* =========================================================
   CLINIC AUTOMATION — PATIENT REGISTRATION
   File: register.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     1. ELEMENTS
     ======================================================= */

  const form = document.getElementById("registrationForm");

  const submitButton = document.getElementById("submitButton");

  const tokenResult = document.getElementById("tokenResult");

  const tokenNumber = document.getElementById("tokenNumber");

  const patientDisplay = document.getElementById("patientDisplay");


  // Inputs

  const nameInput = document.getElementById("name");

  const ageInput = document.getElementById("age");

  const mobileInput = document.getElementById("mobile");

  const reasonInput = document.getElementById("reason");


  // Form groups

  const nameGroup = nameInput.closest(".form-group");

  const ageGroup = ageInput.closest(".form-group");

  const mobileGroup = mobileInput.closest(".form-group");

  const reasonGroup = reasonInput.closest(".form-group");


  /* =======================================================
     2. VALIDATION
     ======================================================= */

  function validateName() {

    const name = nameInput.value.trim();

    if (name.length < 2) {

      nameGroup.classList.add("has-error");

      return false;
    }

    nameGroup.classList.remove("has-error");

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

      ageGroup.classList.add("has-error");

      return false;
    }

    ageGroup.classList.remove("has-error");

    return true;
  }


  function validateMobile() {

    const mobile = mobileInput.value.trim();

    const mobilePattern = /^[6-9][0-9]{9}$/;

    if (!mobilePattern.test(mobile)) {

      mobileGroup.classList.add("has-error");

      return false;
    }

    mobileGroup.classList.remove("has-error");

    return true;
  }


  function validateReason() {

    if (!reasonInput.value) {

      reasonGroup.classList.add("has-error");

      return false;
    }

    reasonGroup.classList.remove("has-error");

    return true;
  }


  function validateForm() {

    const nameValid = validateName();

    const ageValid = validateAge();

    const mobileValid = validateMobile();

    const reasonValid = validateReason();


    return (
      nameValid &&
      ageValid &&
      mobileValid &&
      reasonValid
    );
  }


  /* =======================================================
     3. REAL-TIME VALIDATION
     ======================================================= */

  nameInput.addEventListener("blur", validateName);

  ageInput.addEventListener("blur", validateAge);

  mobileInput.addEventListener("blur", validateMobile);

  reasonInput.addEventListener("change", validateReason);


  nameInput.addEventListener("input", () => {
    nameGroup.classList.remove("has-error");
  });


  ageInput.addEventListener("input", () => {
    ageGroup.classList.remove("has-error");
  });


  mobileInput.addEventListener("input", () => {

    // Allow numbers only

    mobileInput.value =
      mobileInput.value.replace(/\D/g, "");

    mobileGroup.classList.remove("has-error");
  });


  reasonInput.addEventListener("change", () => {
    reasonGroup.classList.remove("has-error");
  });


  /* =======================================================
     4. FORM SUBMISSION
     ======================================================= */

  form.addEventListener("submit", async (event) => {

    event.preventDefault();


    // Stop if validation fails

    if (!validateForm()) {

      return;
    }


    /* -------------------------------------------------------
       Collect patient information
       ------------------------------------------------------- */

    const patientData = {

      name: nameInput.value.trim(),

      age: Number(ageInput.value),

      mobile: mobileInput.value.trim(),

      reason: reasonInput.value

    };


    /* -------------------------------------------------------
       Loading state
       ------------------------------------------------------- */

    submitButton.disabled = true;

    submitButton.innerHTML = `
      <span>Getting Token...</span>
    `;


    try {

      /*
       * -----------------------------------------------------
       * TEMPORARY DEMO
       * -----------------------------------------------------
       *
       * This simulates a backend request.
       *
       * Later this section will become:
       *
       * fetch("YOUR_BACKEND_API/register", {
       *   method: "POST",
       *   headers: {
       *     "Content-Type": "application/json"
       *   },
       *   body: JSON.stringify(patientData)
       * })
       *
       * The backend will generate the REAL token.
       * -----------------------------------------------------
       */

      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });


      /* -------------------------------------------------------
         Temporary token
         ------------------------------------------------------- */

      const token = generateDemoToken();


      /* -------------------------------------------------------
         Show result
         ------------------------------------------------------- */

      showToken(token, patientData);


    } catch (error) {

      console.error(
        "Registration error:",
        error
      );

      alert(
        "Something went wrong. Please try again."
      );


      resetSubmitButton();
    }

  });


  /* =======================================================
     5. DEMO TOKEN GENERATOR
     ======================================================= */

  function generateDemoToken() {

    const number =
      Math.floor(Math.random() * 900) + 1;

    return `A-${String(number).padStart(3, "0")}`;
  }


  /* =======================================================
     6. SHOW TOKEN
     ======================================================= */

  function showToken(token, patientData) {

    // Hide registration form

    form.style.display = "none";


    // Update token

    tokenNumber.textContent = token;


    // Show patient name

    patientDisplay.textContent =
      `Patient: ${patientData.name}`;


    // Show token section

    tokenResult.classList.add("show");


    // Scroll to result

    tokenResult.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });


    // Restore button for safety

    resetSubmitButton();
  }


  /* =======================================================
     7. RESET BUTTON
     ======================================================= */

  function resetSubmitButton() {

    submitButton.disabled = false;

    submitButton.innerHTML = `
      Get Token
      <span>→</span>
    `;
  }

});