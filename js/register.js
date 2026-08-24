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

  // Form inputs
  const nameInput = document.getElementById("name");
  const ageInput = document.getElementById("age");
  const mobileInput = document.getElementById("mobile");
  const reasonInput = document.getElementById("reason");
  const issueInput = document.getElementById("issue");

  // Character counter
  const issueCount = document.getElementById("issueCount");

  // Form groups
  const nameGroup = nameInput.closest(".form-group");
  const ageGroup = ageInput.closest(".form-group");
  const mobileGroup = mobileInput.closest(".form-group");
  const reasonGroup = reasonInput.closest(".form-group");


  /* =======================================================
     2. NAME VALIDATION
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


  /* =======================================================
     3. AGE VALIDATION
     ======================================================= */

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


  /* =======================================================
     4. MOBILE VALIDATION
     ======================================================= */

  function validateMobile() {

    const mobile = mobileInput.value.trim();

    /*
     * Indian mobile number:
     * - Exactly 10 digits
     * - Starts with 6, 7, 8 or 9
     */

    const mobilePattern = /^[6-9][0-9]{9}$/;

    if (!mobilePattern.test(mobile)) {

      mobileGroup.classList.add("has-error");

      return false;
    }

    mobileGroup.classList.remove("has-error");

    return true;
  }


  /* =======================================================
     5. REASON VALIDATION
     ======================================================= */

  function validateReason() {

    if (!reasonInput.value) {

      reasonGroup.classList.add("has-error");

      return false;
    }

    reasonGroup.classList.remove("has-error");

    return true;
  }


  /* =======================================================
     6. COMPLETE FORM VALIDATION
     ======================================================= */

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
     7. REAL-TIME VALIDATION
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
     8. ADDITIONAL INFORMATION CHARACTER COUNTER
     ======================================================= */

  issueInput.addEventListener("input", () => {

    issueCount.textContent =
      issueInput.value.length;

  });


  /* =======================================================
     9. FORM SUBMISSION
     ======================================================= */

  form.addEventListener("submit", async (event) => {

    event.preventDefault();


    // Validate required fields

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

      reason: reasonInput.value,

      issue: issueInput.value.trim()

    };


    console.log(
      "Patient registration:",
      patientData
    );


    /* -------------------------------------------------------
       Loading state
       ------------------------------------------------------- */

    submitButton.disabled = true;

    submitButton.innerHTML = `
      <span>Getting Token...</span>
    `;


    try {

      /*
       * =====================================================
       * TEMPORARY DEMO REQUEST
       * =====================================================
       *
       * This simulates communication with the backend.
       *
       * Later this will be replaced with something like:
       *
       * const response = await fetch(
       *   "YOUR_BACKEND_API/register",
       *   {
       *     method: "POST",
       *     headers: {
       *       "Content-Type": "application/json"
       *     },
       *     body: JSON.stringify(patientData)
       *   }
       * );
       *
       * The backend will then:
       *
       * 1. Save patient data
       * 2. Generate the actual token
       * 3. Save the queue entry
       * 4. Return the token
       *
       * =====================================================
       */

      await new Promise((resolve) => {

        setTimeout(resolve, 1000);

      });


      /* -------------------------------------------------------
         Generate temporary token
         ------------------------------------------------------- */

      const token = generateDemoToken();


      /* -------------------------------------------------------
         Display token
         ------------------------------------------------------- */

      showToken(
        token,
        patientData
      );


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
     10. DEMO TOKEN GENERATOR
     ======================================================= */

  function generateDemoToken() {

    const number =
      Math.floor(Math.random() * 900) + 1;

    return `A-${String(number).padStart(3, "0")}`;

  }


  /* =======================================================
     11. SHOW TOKEN RESULT
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


    // Scroll to token

    tokenResult.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });


    // Restore button

    resetSubmitButton();

  }


  /* =======================================================
     12. RESET BUTTON
     ======================================================= */

  function resetSubmitButton() {

    submitButton.disabled = false;

    submitButton.innerHTML = `
      Get Token
      <span>→</span>
    `;

  }

});