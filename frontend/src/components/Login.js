import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.usernameOrEmail.trim()) {
      newErrors.usernameOrEmail = "Username or Email is required";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const requestData = {
      email: formData.usernameOrEmail.includes("@")
        ? formData.usernameOrEmail
        : null,
      username: formData.usernameOrEmail.includes("@")
        ? null
        : formData.usernameOrEmail,
      password: formData.password,
    };

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("userToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setIsLoggedIn(true);
      setMessage("✅ Login successful! Redirecting...");
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      console.error("❌ Login error:", error);
      setMessage(`❌ ${error.message}`);
    }
  };

  return (
    <div className="login-container">
      <div className="ecoswap-title">EcoSwap</div>
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="usernameOrEmail"
              placeholder="Username or Email"
              value={formData.usernameOrEmail}
              onChange={handleChange}
            />
            {errors.usernameOrEmail && (
              <span className="error-text">{errors.usernameOrEmail}</span>
            )}
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          {/* ✅ Forgot Password link */}
          <div className="input-group">
            <span
              className="forgot-password-link"
              onClick={() => navigate("/forgot-password")}
              style={{
                fontSize: "0.9rem",
                color: "#7bac08",
                cursor: "pointer",
                marginBottom: "10px",
                display: "inline-block",
                fontWeight: "bold",
              }}
            >
              Forgot password?
            </span>
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        {message && <p>{message}</p>}

        <p>Don't have an account?</p>
        <button className="login-btn" onClick={() => navigate("/signup")}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;
