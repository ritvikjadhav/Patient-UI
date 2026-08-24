import { useState } from "react";
import "./PatientRegis.css";
const commonReasons = [
  "Fever",
  "Cold / Cough",
  "Headache",
  "Body Pain",
  "Stomach Pain",
  "Vomiting / Nausea",
  "Throat Pain",
  "Skin Problem",
  "Follow-up",
];

function PatientRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    mobile: "",
    reason: "",
  });

  const [selectedReason, setSelectedReason] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  const handleReasonSelect = (reason) => {
    setSelectedReason(reason);

    setFormData((previous) => ({
      ...previous,
      reason,
    }));

    setErrors((previous) => ({
      ...previous,
      reason: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name.";
    }

    if (!formData.age) {
      newErrors.age = "Please enter your age.";
    } else if (Number(formData.age) < 1 || Number(formData.age) > 120) {
      newErrors.age = "Please enter a valid age.";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Please enter your mobile number.";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number.";
    }

    if (!formData.reason.trim()) {
      newErrors.reason = "Please select or enter a reason for your visit.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      /*
        BACKEND INTEGRATION POINT

        Replace this section when the backend API is ready.

        Example:

        const response = await fetch(
          "YOUR_BACKEND_API/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Registration failed.");
        }

        // Later:
        // Navigate to the Token screen.
        // Example:
        // navigate("/patient/token", { state: data });
      */

      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Patient registration:", formData);

      alert("Registration submitted successfully!");

    } catch (error) {
      console.error(error);

      setErrors({
        submit: "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="patient-page">
      <div className="background-blob background-blob-one"></div>
      <div className="background-blob background-blob-two"></div>

      <section className="registration-wrapper">
        <div className="clinic-header">
          <div className="clinic-mark">+</div>

          <span className="clinic-name">
            Clinic Automation System
          </span>
        </div>

        <div className="registration-card">
          <div className="registration-heading">
            <span className="eyebrow">PATIENT REGISTRATION</span>

            <h1>Join the consultation queue</h1>

            <p>
              Enter your details below to register for today's
              consultation.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Patient Name */}
            <div className="form-field">
              <label htmlFor="name">
                Patient Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                className={errors.name ? "input-error" : ""}
              />

              {errors.name && (
                <span className="field-error">
                  {errors.name}
                </span>
              )}
            </div>

            {/* Age */}
            <div className="form-field">
              <label htmlFor="age">
                Age
              </label>

              <input
                id="age"
                name="age"
                type="number"
                min="1"
                max="120"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter your age"
                className={errors.age ? "input-error" : ""}
              />

              {errors.age && (
                <span className="field-error">
                  {errors.age}
                </span>
              )}
            </div>

            {/* Mobile */}
            <div className="form-field">
              <label htmlFor="mobile">
                Mobile Number
              </label>

              <div
                className={`mobile-input ${
                  errors.mobile ? "input-error" : ""
                }`}
              >
                <span className="country-code">+91</span>

                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  inputMode="numeric"
                  maxLength="10"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter 10-digit number"
                  autoComplete="tel"
                />
              </div>

              {errors.mobile && (
                <span className="field-error">
                  {errors.mobile}
                </span>
              )}
            </div>

            {/* Reason */}
            <div className="form-field">
              <div className="reason-heading">
                <label>
                  Reason for Visit
                </label>

                <span className="optional-text">
                  Choose one
                </span>
              </div>

              <div className="reason-grid">
                {commonReasons.map((reason) => (
                  <button
                    type="button"
                    key={reason}
                    className={`reason-chip ${
                      selectedReason === reason
                        ? "reason-chip-selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleReasonSelect(reason)
                    }
                  >
                    {selectedReason === reason && (
                      <span className="chip-check">✓</span>
                    )}

                    {reason}
                  </button>
                ))}
              </div>

              <div className="custom-reason">
                <span className="custom-reason-label">
                  Or describe your reason
                </span>

                <textarea
                  name="reason"
                  value={
                    commonReasons.includes(formData.reason)
                      ? ""
                      : formData.reason
                  }
                  onChange={(event) => {
                    setSelectedReason("");
                   handleChange(event);
                  }}
                  placeholder="Tell us briefly what brings you today..."
                  rows="3"
                  className={errors.reason ? "input-error" : ""}
                />
              </div>

              {errors.reason && (
                <span className="field-error">
                  {errors.reason}
                </span>
              )}
            </div>

            {errors.submit && (
              <div className="submit-error">
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Joining Queue...
                </>
              ) : (
                <>
                  Join Queue
                  <span className="button-arrow">→</span>
                </>
              )}
            </button>

            <p className="privacy-note">
              Your information is used for today's clinic visit.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

export default PatientRegistration;
