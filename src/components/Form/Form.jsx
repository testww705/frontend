import { useState } from "react";
import "./Form.css";

function Form() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const res = await fetch("https://backend-production-34be.up.railway.app/send.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        setForm({ name: "", email: "", message: "" });
      } else {
        setErrors({ submit: data.error || "Error sending message" });
      }
    } catch (err) {
      setErrors({ submit: "Network error" });
    }
  };

  return (
    <div className="form-card">
      <h2 className="form-title">Contact Form</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <input
            type="text"
            placeholder="Your Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            placeholder="Email *"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className={errors.email ? "input-error" : ""}
          />
          {errors.email && (
            <span className="error-text">{errors.email}</span>
          )}
        </div>

        <div className="form-group">
          <textarea
            placeholder="Your Message"
            rows="4"
            value={form.message}
            onChange={(e) =>
              setForm({ ...form, message: e.target.value })
            }
          />
        </div>

        <button type="submit" className="submit-btn">
          Send Message
        </button>
      </form>

      {submitted && (
        <div className="success-message">
          Your message has been sent successfully.
        </div>
      )}
    </div>
  );
}

export default Form;
