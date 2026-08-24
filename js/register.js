/* =========================================================
   CLINIC AUTOMATION — PATIENT REGISTRATION
   File: js/register.js
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


  /* =======================================================
     ERROR ELEMENTS
     ======================================================= */

  const nameError = document.getElementById("nameError");
  const ageError = document.getElementById("ageError");
  const mobileError = document.getElementById("mobileError");
  const reasonError = document.getElementById("reasonError");


  /* =======================================================
     FORM SUBMIT
     ======================================================= */

  form.addEventListener("submit", (event) => {

    event.preventDefault();


    /* =====================================================
       CLEAR PREVIOUS ERRORS
       ===================================================== */

    clearErrors();


    /* =====================================================
       GET VALUES
       ===================================================== */

    const name = nameInput.value.trim();
    const age = ageInput.value.trim();
    const mobile = mobileInput.value.trim();
    const reason = reasonInput.value;
    const issue = issueInput.value.trim();


    /* =====================================================
       VALIDATION
       ===================================================== */

    let isValid = true;


    // Name
    if (name === "") {

      showError(
        nameInput,
        nameError,
        "Please enter your name."
      );

      isValid = false;
    }


    // Age
    const ageNumber = Number(age);

    if (
      age === "" ||
      !Number.isInteger(ageNumber) ||
      ageNumber < 1 ||
      ageNumber > 120
    ) {

      showError(
        ageInput,
        ageError,
        "Please enter a valid age between 1 and 120."
      );

      isValid = false;
    }


    // Mobile
    if (!/^[6-9][0-9]{9}$/.test(mobile)) {

      showError(
        mobileInput,
        mobileError,
        "Enter a valid 10-digit mobile number."
      );

      isValid = false;
    }


    // Reason
    if (reason === "") {

      showError(
        reasonInput,
        reasonError,
        "Please select a reason for your visit."
      );

      isValid = false;
    }


    /* =====================================================
       STOP IF INVALID
       ===================================================== */

    if (!isValid) {
      return;
    }


    /* =====================================================
       BUTTON LOADING STATE
       ===================================================== */

    submitButton.disabled = true;

    submitButton.innerHTML = `
      <span>Getting Token...</span>
    `;


    /* =====================================================
       PATIENT DATA
       ===================================================== */

    const tokenData = {

      name: name,

      age: ageNumber,

      mobile: mobile,

      reason: reason,

      issue: issue,


      /*
        TEMPORARY DEMO VALUES

        These will later come from
        your backend/database.
      */

      token: "A-024",

      queuePosition: 5,

      estimatedWait: 15,

      status: "Waiting"

    };


    /* =====================================================
       SAVE DATA

       Temporary frontend storage.

       Backend teammate can replace this
       with an API request later.
       ===================================================== */

    localStorage.setItem(
      "patientRegistration",
      JSON.stringify(tokenData)
    );


    /* =====================================================
       OPEN TOKEN PAGE
       ===================================================== */

    setTimeout(() => {

      window.location.href = "token.html";

    }, 500);

  });


  /* =======================================================
     CLEAR ERRORS
     ======================================================= */

  function clearErrors() {

    const groups = document.querySelectorAll(".form-group");

    groups.forEach((group) => {
      group.classList.remove("has-error");
    });

  }


  /* =======================================================
     SHOW ERROR
     ======================================================= */

  function showError(input, errorElement, message) {

    const group = input.closest(".form-group");

    if (group) {
      group.classList.add("has-error");
    }

    if (errorElement) {
      errorElement.textContent = message;
    }

  }


  /* =======================================================
     REAL-TIME ERROR CLEARING
     ======================================================= */

  nameInput.addEventListener("input", () => {

    const group = nameInput.closest(".form-group");

    if (nameInput.value.trim() !== "") {
      group.classList.remove("has-error");
    }

  });


  ageInput.addEventListener("input", () => {

    const group = ageInput.closest(".form-group");

    const age = Number(ageInput.value);

    if (
      Number.isInteger(age) &&
      age >= 1 &&
      age <= 120
    ) {
      group.classList.remove("has-error");
    }

  });


  mobileInput.addEventListener("input", () => {

    /*
      Allow numbers only.
    */

    mobileInput.value =
      mobileInput.value.replace(/\D/g, "").slice(0, 10);


    const group = mobileInput.closest(".form-group");

    if (/^[6-9][0-9]{9}$/.test(mobileInput.value)) {
      group.classList.remove("has-error");
    }

  });


  reasonInput.addEventListener("change", () => {

    const group = reasonInput.closest(".form-group");

    if (reasonInput.value !== "") {
      group.classList.remove("has-error");
    }

  });


  /* =======================================================
     BACKEND INTEGRATION — FUTURE
     =======================================================

     When your backend teammate gives you an API,
     replace the localStorage section with something like:

     const response = await fetch(
       "YOUR_BACKEND_API/register",
       {
         method: "POST",
         headers: {
           "Content-Type": "application/json"
         },
         body: JSON.stringify({
           name,
           age: ageNumber,
           mobile,
           reason,
           issue
         })
       }
     );

     const data = await response.json();

     localStorage.setItem(
       "patientRegistration",
       JSON.stringify(data)
     );

     window.location.href = "token.html";

     ======================================================= */

});