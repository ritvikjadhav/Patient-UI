// ClinicCare — Patient Registration

const STORAGE_KEY = "cliniccare_registration";
const TOKEN_COUNTER_KEY = "cliniccare_token_counter";
const TOKEN_PREFIX = "A-";

const form = document.getElementById("registrationForm");
const submitButton = document.getElementById("submitButton");

const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const mobileInput = document.getElementById("mobile");
const reasonInput = document.getElementById("reason");
const issueInput = document.getElementById("issue");
const characterCount = document.getElementById("characterCount");

let isSubmitting = false;


// ============================================================
// Helpers
// ============================================================

function valueOf(input) {
  return input ? input.value.trim() : "";
}

function errorElement(id) {
  return document.getElementById(id);
}

function setError(input, errorId, message) {
  const group = input?.closest(".form-group");
  const error = errorElement(errorId);

  group?.classList.add("has-error");

  input?.classList.add("input-error");
  input?.setAttribute("aria-invalid", "true");

  if (error) {
    error.textContent = message;
  }
}

function clearError(input, errorId) {
  const group = input?.closest(".form-group");
  const error = errorElement(errorId);

  group?.classList.remove("has-error");

  input?.classList.remove("input-error");
  input?.removeAttribute("aria-invalid");

  if (error) {
    error.textContent = "";
  }
}

function clearErrors() {
  clearError(nameInput, "nameError");
  clearError(ageInput, "ageError");
  clearError(mobileInput, "mobileError");

  // Reason of visit is OPTIONAL.
  // No validation is required for it.
}


// ============================================================
// Character Counter
// ============================================================

function updateCharacterCount() {
  if (!issueInput || !characterCount) return;

  characterCount.textContent =
    `${issueInput.value.length} / 300`;
}

issueInput?.addEventListener(
  "input",
  updateCharacterCount
);

updateCharacterCount();


// ============================================================
// Validation
// ============================================================

function validateName() {
  const name = valueOf(nameInput);

  clearError(nameInput, "nameError");

  if (!name) {
    setError(
      nameInput,
      "nameError",
      "Please enter your full name."
    );

    return false;
  }

  if (name.length < 2) {
    setError(
      nameInput,
      "nameError",
      "Name must contain at least 2 characters."
    );

    return false;
  }

  // Supports normal Indian/English names and
  // common punctuation such as apostrophes, dots and hyphens.
  const validName =
    /^[A-Za-zÀ-ÿ' .-]+$/.test(name);

  if (!validName) {
    setError(
      nameInput,
      "nameError",
      "Please enter a valid name."
    );

    return false;
  }

  return true;
}


function validateAge() {
  const ageValue = valueOf(ageInput);
  const age = Number(ageValue);

  clearError(ageInput, "ageError");

  if (!ageValue) {
    setError(
      ageInput,
      "ageError",
      "Please enter your age."
    );

    return false;
  }

  if (
    !Number.isInteger(age) ||
    age < 1 ||
    age > 120
  ) {
    setError(
      ageInput,
      "ageError",
      "Please enter an age between 1 and 120."
    );

    return false;
  }

  return true;
}


function validateMobile() {
  const mobile = valueOf(mobileInput);

  clearError(mobileInput, "mobileError");

  if (!mobile) {
    setError(
      mobileInput,
      "mobileError",
      "Please enter your mobile number."
    );

    return false;
  }

  if (!/^[0-9]{10}$/.test(mobile)) {
    setError(
      mobileInput,
      "mobileError",
      "Enter a valid 10-digit mobile number."
    );

    return false;
  }

  return true;
}


// Reason of Visit is intentionally NOT validated.
// It can be left blank.

function validateForm() {
  const validName = validateName();
  const validAge = validateAge();
  const validMobile = validateMobile();

  return (
    validName &&
    validAge &&
    validMobile
  );
}


// ============================================================
// Temporary V1 Token System
// ============================================================

function generateTemporaryToken() {
  let number = Number(
    localStorage.getItem(TOKEN_COUNTER_KEY)
  );

  if (
    !Number.isInteger(number) ||
    number < 23
  ) {
    number = 23;
  }

  number += 1;

  localStorage.setItem(
    TOKEN_COUNTER_KEY,
    String(number)
  );

  return (
    TOKEN_PREFIX +
    String(number).padStart(3, "0")
  );
}


// ============================================================
// Temporary Queue Data
// ============================================================

function createTemporaryQueueData(token) {
  return {
    token,
    status: "Waiting",
    currentlyServing: "A-019",
    aheadOfYou: 4,
    estimatedWait: 12,
    position: 5
  };
}


// ============================================================
// Backend Integration Point
// ============================================================

async function registerPatient(patientData) {

  /*
    ----------------------------------------------------------
    PRODUCTION BACKEND

    Replace the temporary implementation below with your API:

    const response = await fetch("/api/patients/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(patientData)
    });

    if (!response.ok) {
      throw new Error("Registration failed.");
    }

    return await response.json();

    Expected response example:

    {
      success: true,
      patientId: "12345",
      token: "A-024",
      position: 5,
      aheadOfYou: 4,
      estimatedWait: 12,
      status: "Waiting"
    }
    ----------------------------------------------------------
  */

  // Temporary V1 frontend-only registration
  const token = generateTemporaryToken();

  return {
    success: true,
    patientId: null,
    token,
    position: 5,
    aheadOfYou: 4,
    estimatedWait: 12,
    status: "Waiting"
  };
}


// ============================================================
// Save Registration
// ============================================================

function saveRegistration(patient, queue) {
  const now = new Date();

  const registration = {
    patient,

    queue,

    registration: {
      registeredAt: now.toISOString(),

      date: now
        .toISOString()
        .split("T")[0],

      source: "patient-portal"
    }
  };

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(registration)
  );
}


// ============================================================
// Button State
// ============================================================

function setLoading(loading) {
  if (!submitButton) return;

  submitButton.disabled = loading;

  submitButton.classList.toggle(
    "is-loading",
    loading
  );

  submitButton.setAttribute(
    "aria-busy",
    String(loading)
  );

  // Updated registration HTML uses .submit-label
  // instead of selecting the first generic span.
  const label =
    submitButton.querySelector(".submit-label");

  if (label) {
    label.textContent = loading
      ? "Registering..."
      : "Register & Get Token";
  }
}


// ============================================================
// Submit
// ============================================================

async function handleSubmit(event) {
  event.preventDefault();

  if (isSubmitting) return;

  clearErrors();

  const valid = validateForm();

  if (!valid) {
    const firstError =
      form?.querySelector(".input-error");

    firstError?.focus();

    return;
  }

  isSubmitting = true;
  setLoading(true);

  const patient = {
    name: valueOf(nameInput),

    age: Number(
      valueOf(ageInput)
    ),

    mobile: valueOf(mobileInput),

    // OPTIONAL
    reason: valueOf(reasonInput) || null,

    issue: valueOf(issueInput) || null
  };

  try {

    const result =
      await registerPatient(patient);

    if (
      !result?.success ||
      !result?.token
    ) {
      throw new Error(
        "Registration failed."
      );
    }

    const temporaryQueue =
      createTemporaryQueueData(
        result.token
      );

    const queue = {
      ...temporaryQueue,

      position:
        result.position ??
        temporaryQueue.position,

      aheadOfYou:
        result.aheadOfYou ??
        temporaryQueue.aheadOfYou,

      estimatedWait:
        result.estimatedWait ??
        temporaryQueue.estimatedWait,

      status:
        result.status ??
        temporaryQueue.status
    };

    saveRegistration(
      patient,
      queue
    );

    // Small delay so the button transition
    // can finish smoothly.
    await new Promise(resolve =>
      setTimeout(resolve, 250)
    );

    window.location.href =
      "token.html";

  } catch (error) {

    console.error(
      "Registration failed:",
      error
    );

    isSubmitting = false;

    setLoading(false);

    showSubmitError();
  }
}


// ============================================================
// Submit Error
// ============================================================

function showSubmitError() {
  let message =
    document.getElementById(
      "registrationError"
    );

  if (!message && form) {

    message =
      document.createElement("p");

    message.id =
      "registrationError";

    message.className =
      "form-status";

    message.setAttribute(
      "role",
      "alert"
    );

    message.setAttribute(
      "aria-live",
      "polite"
    );

    form.prepend(message);
  }

  if (message) {
    message.textContent =
      "Unable to complete registration. Please try again.";
  }
}


// ============================================================
// Input Cleanup + Live Error Clearing
// ============================================================

nameInput?.addEventListener(
  "input",
  () => {

    nameInput.value =
      nameInput.value
        .replace(/\s{2,}/g, " ");

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


ageInput?.addEventListener(
  "input",
  () => {

    ageInput.value =
      ageInput.value
        .replace(/\D/g, "")
        .slice(0, 3);

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


mobileInput?.addEventListener(
  "input",
  () => {

    mobileInput.value =
      mobileInput.value
        .replace(/\D/g, "")
        .slice(0, 10);

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


// Reason is optional.
// No validation is triggered when it changes.
reasonInput?.addEventListener(
  "change",
  () => {
    reasonInput.classList.remove(
      "input-error"
    );

    reasonInput.removeAttribute(
      "aria-invalid"
    );

    reasonInput
      .closest(".form-group")
      ?.classList.remove("has-error");
  }
);


// ============================================================
// Clear Registration Error While Editing
// ============================================================

form?.addEventListener(
  "input",
  () => {

    const error =
      document.getElementById(
        "registrationError"
      );

    if (error) {
      error.textContent = "";
    }
  }
);


// ============================================================
// Registration Page Animations
// Matches ClinicCare Home Page
// ============================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const page =
      document.body;

    page.classList.add(
      "page-ready"
    );

    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    function initRevealAnimations() {

      const sections =
        document.querySelectorAll(
          ".registration-card"
        );

      const cards =
        document.querySelectorAll(
          ".form-header, .form-group, .form-notice, .existing-note"
        );

      // Reduced motion:
      // show everything immediately.
      if (reducedMotion.matches) {

        sections.forEach(section => {
          section.classList.add(
            "reveal-on-scroll",
            "is-visible"
          );
        });

        cards.forEach(card => {
          card.classList.add(
            "reveal-card",
            "is-visible"
          );
        });

        return;
      }

      const observer =
        new IntersectionObserver(
          entries => {

            entries.forEach(entry => {

              if (
                !entry.isIntersecting
              ) {
                return;
              }

              entry.target.classList.add(
                "is-visible"
              );

              observer.unobserve(
                entry.target
              );
            });

          },
          {
            threshold: 0.08,
            rootMargin:
              "0px 0px -40px 0px"
          }
        );


      sections.forEach(section => {

        section.classList.add(
          "reveal-on-scroll"
        );

        observer.observe(section);
      });


      cards.forEach(
        (card, index) => {

          card.classList.add(
            "reveal-card"
          );

          card.style.setProperty(
            "--reveal-delay",
            `${index * 45}ms`
          );

          observer.observe(card);
        }
      );
    }

    initRevealAnimations();


    // Smooth scrolling
    document.documentElement.style.scrollBehavior =
      reducedMotion.matches
        ? "auto"
        : "smooth";


    // Mobile navigation
    const currentPage =
      window.location.pathname
        .split("/")
        .pop() ||
      "index.html";

    document
      .querySelectorAll(
        ".mobile-nav a"
      )
      .forEach(link => {

        const href =
          link.getAttribute("href");

        if (
          href === currentPage ||
          (
            currentPage === "" &&
            href === "index.html"
          )
        ) {
          link.classList.add(
            "active"
          );
        }
      });


    // Escape removes focus
    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Escape"
        ) {
          document.activeElement?.blur();
        }
      }
    );


    // Final initialization frame
    requestAnimationFrame(
      () => {
        page.classList.add(
          "initialized"
        );
      }
    );
  }
);


// ============================================================
// Form Event
// ============================================================

form?.addEventListener(
  "submit",
  handleSubmit
);