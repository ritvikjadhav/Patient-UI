// ClinicCare patient registration

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


// Helpers

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
  clearError(reasonInput, "reasonError");
}


// Character counter

function updateCharacterCount() {
  if (!issueInput || !characterCount) return;

  characterCount.textContent = `${issueInput.value.length} / 300`;
}

issueInput?.addEventListener("input", updateCharacterCount);
updateCharacterCount();


// Validation

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

  if (!/^[A-Za-zÀ-ÿ' -]+$/.test(name)) {
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
  const age = Number(valueOf(ageInput));

  clearError(ageInput, "ageError");

  if (!valueOf(ageInput)) {
    setError(
      ageInput,
      "ageError",
      "Please enter your age."
    );
    return false;
  }

  if (!Number.isInteger(age) || age < 1 || age > 120) {
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

function validateReason() {
  const reason = valueOf(reasonInput);

  clearError(reasonInput, "reasonError");

  if (!reason) {
    setError(
      reasonInput,
      "reasonError",
      "Please select a reason for your visit."
    );
    return false;
  }

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


// Temporary V1 token

function generateTemporaryToken() {
  let number = Number(
    localStorage.getItem(TOKEN_COUNTER_KEY)
  );

  if (!Number.isInteger(number) || number < 23) {
    number = 23;
  }

  number += 1;

  localStorage.setItem(
    TOKEN_COUNTER_KEY,
    String(number)
  );

  return `${TOKEN_PREFIX}${String(number).padStart(3, "0")}`;
}


// Temporary queue data

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


// Backend integration point

async function registerPatient(patientData) {
  /*
   Replace this temporary implementation with:

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
  */

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


// Save temporary registration

function saveRegistration(patient, queue) {
  const registration = {
    patient,
    queue,
    registration: {
      registeredAt: new Date().toISOString(),
      date: new Date().toISOString().split("T")[0],
      source: "patient-portal"
    }
  };

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(registration)
  );
}


// Button state

function setLoading(loading) {
  if (!submitButton) return;

  submitButton.disabled = loading;
  submitButton.classList.toggle("is-loading", loading);
  submitButton.setAttribute(
    "aria-busy",
    String(loading)
  );

  const text =
    submitButton.querySelector("span");

  if (text) {
    text.textContent = loading
      ? "Registering..."
      : "Register & Get Token";
  }
}


// Submit

async function handleSubmit(event) {
  event.preventDefault();

  if (isSubmitting) return;

  clearErrors();

  if (!validateForm()) {
    const firstError =
      form?.querySelector(".input-error");

    firstError?.focus();
    return;
  }

  isSubmitting = true;
  setLoading(true);

  const patient = {
    name: valueOf(nameInput),
    age: Number(valueOf(ageInput)),
    mobile: valueOf(mobileInput),
    reason: valueOf(reasonInput),
    issue: valueOf(issueInput)
  };

  try {
    const result =
      await registerPatient(patient);

    if (!result?.success || !result.token) {
      throw new Error("Registration failed.");
    }

    const queue = {
      ...createTemporaryQueueData(result.token),
      position: result.position ?? 5,
      aheadOfYou: result.aheadOfYou ?? 4,
      estimatedWait: result.estimatedWait ?? 12,
      status: result.status ?? "Waiting"
    };

    saveRegistration(patient, queue);

    await new Promise(resolve =>
      setTimeout(resolve, 250)
    );

    window.location.href = "token.html";

  } catch (error) {
    console.error("Registration failed:", error);

    isSubmitting = false;
    setLoading(false);

    showSubmitError();
  }
}


// Submit error

function showSubmitError() {
  let message =
    document.getElementById("registrationError");

  if (!message && form) {
    message = document.createElement("p");
    message.id = "registrationError";
    message.className = "error-message";
    message.setAttribute("role", "alert");

    form.prepend(message);
  }

  if (message) {
    message.textContent =
      "Unable to complete registration. Please try again.";
  }
}


// Input cleanup + live error clearing

nameInput?.addEventListener("input", () => {
  nameInput.value =
    nameInput.value.replace(/\s{2,}/g, " ");

  if (nameInput.classList.contains("input-error")) {
    clearError(nameInput, "nameError");
  }
});

ageInput?.addEventListener("input", () => {
  ageInput.value =
    ageInput.value.replace(/\D/g, "").slice(0, 3);

  if (ageInput.classList.contains("input-error")) {
    clearError(ageInput, "ageError");
  }
});

mobileInput?.addEventListener("input", () => {
  mobileInput.value =
    mobileInput.value.replace(/\D/g, "").slice(0, 10);

  if (mobileInput.classList.contains("input-error")) {
    clearError(mobileInput, "mobileError");
  }
});

reasonInput?.addEventListener("change", () => {
  clearError(reasonInput, "reasonError");
});


// Clear server error when user edits

form?.addEventListener("input", () => {
  const error =
    document.getElementById("registrationError");

  if (error) {
    error.textContent = "";
  }
});


// Form event

form?.addEventListener("submit", handleSubmit);