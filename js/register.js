/* =========================================
   Patient Registration Logic
   File: js/register.js
   ========================================= */

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('registrationForm');
  const submitBtn = document.getElementById('submitBtn');
  const formSection = document.getElementById('formSection');
  const successSection = document.getElementById('successSection');

  // Input elements
  const nameInput = document.getElementById('name');
  const ageInput = document.getElementById('age');
  const mobileInput = document.getElementById('mobile');
  const reasonInput = document.getElementById('reason');

  // Form Groups (for error states)
  const nameGroup = document.getElementById('nameGroup');
  const ageGroup = document.getElementById('ageGroup');
  const mobileGroup = document.getElementById('mobileGroup');
  const reasonGroup = document.getElementById('reasonGroup');

  // ---------- Validation Functions ----------
  function validateName() {
    const value = nameInput.value.trim();
    if (!value) {
      nameGroup.classList.add('error');
      return false;
    }
    nameGroup.classList.remove('error');
    return true;
  }

  function validateAge() {
    const value = parseInt(ageInput.value, 10);
    if (!ageInput.value || isNaN(value) || value < 1 || value > 120) {
      ageGroup.classList.add('error');
      return false;
    }
    ageGroup.classList.remove('error');
    return true;
  }

  function validateMobile() {
    const value = mobileInput.value.trim();
    const mobilePattern = /^[0-9]{10}$/;
    if (!mobilePattern.test(value)) {
      mobileGroup.classList.add('error');
      return false;
    }
    mobileGroup.classList.remove('error');
    return true;
  }

  function validateReason() {
    const value = reasonInput.value.trim();
    if (!value) {
      reasonGroup.classList.add('error');
      return false;
    }
    reasonGroup.classList.remove('error');
    return true;
  }

  function validateForm() {
    const isNameValid = validateName();
    const isAgeValid = validateAge();
    const isMobileValid = validateMobile();
    const isReasonValid = validateReason();

    return isNameValid && isAgeValid && isMobileValid && isReasonValid;
  }

  // ---------- Real-time validation (optional but good UX) ----------
  nameInput.addEventListener('blur', validateName);
  ageInput.addEventListener('blur', validateAge);
  mobileInput.addEventListener('blur', validateMobile);
  reasonInput.addEventListener('blur', validateReason);

  // Clear error when user starts typing
  nameInput.addEventListener('input', () => nameGroup.classList.remove('error'));
  ageInput.addEventListener('input', () => ageGroup.classList.remove('error'));
  mobileInput.addEventListener('input', () => mobileGroup.classList.remove('error'));
  reasonInput.addEventListener('input', () => reasonGroup.classList.remove('error'));

  // ---------- Form Submit ----------
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Validate all fields
    if (!validateForm()) {
      return;
    }

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Collect form data
    const formData = {
      name: nameInput.value.trim(),
      age: parseInt(ageInput.value, 10),
      mobile: mobileInput.value.trim(),
      reason: reasonInput.value.trim()
    };

    // Simulate API call (Replace this later with real backend call)
    setTimeout(() => {
      // Generate a temporary token (Backend will provide real token later)
      const randomNum = Math.floor(Math.random() * 90) + 10;
      const token = 'A-' + String(randomNum).padStart(3, '0');

      // Show success state
      showSuccess(token, formData.name);

      // Reset button state
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }, 1200);
  });

  // ---------- Show Success Screen ----------
  function showSuccess(token, patientName) {
    // Hide form
    formSection.style.display = 'none';

    // Update success content
    document.getElementById('tokenDisplay').textContent = token;
    document.getElementById('patientNameDisplay').textContent = 'Patient: ' + patientName;

    // Show success section
    successSection.classList.add('show');
  }
});
