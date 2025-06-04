import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import '../Signup.css';
import { useLocation } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [captchaToken, setCaptchaToken] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const fromLogin = location.state?.fromLogin;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCaptchaChange = (token) => {
    console.log("Received captcha token:", token);
    setCaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.password.trim() !== formData.confirmPassword.trim()) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    if (!captchaToken) {
      setMessage("❌ Please complete the CAPTCHA.");
      return;
    }

    try {
      const payload = { ...formData, captcha: captchaToken };

      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.text();

      if (response.ok) {
        setMessage("✅ " + data);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage("❌ " + data);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("❌ Network error, please try again.");
    }
  };

  return (
    <div className="signup-container">
      <h1 className="ecoswap-title">EcoSwap</h1>
      
      <div className={`signup-box ${fromLogin ? "animate-entry" : ""}`}>

        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-container">
            <div className="input-fields">
              <div className="input-group">
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Full Name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="input-group">
                <input 
                  type="text" 
                  name="username" 
                  placeholder="Username" 
                  value={formData.username} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="input-group">
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="input-group">
                <input 
                  type="password" 
                  name="password" 
                  placeholder="Password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="input-group">
                <input 
                  type="password" 
                  name="confirmPassword" 
                  placeholder="Confirm Password" 
                  value={formData.confirmPassword} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="recaptcha-container">
              <ReCAPTCHA
                sitekey="6LfXxQMrAAAAACuZ1DRMYU9c28yX1egU5YxrJ19_"
                onChange={handleCaptchaChange}
                size="compact"
              />
            </div>

            <div className="button-container">
              <button type="submit" className="signup-btn">Sign Up</button>
              {message && <p className="message">{message}</p>}
              <p className="login-link">Already have an account?</p>
              <button 
  type="button"
  className="signup-btn" 
  onClick={() => navigate("/login", { state: { fromSignup: true } })}
>
  Back to Login
</button>

            </div>
          </div>
        </form>
      </div>

      <div className="illustration-side"></div>
    </div>
  );
};

export default Signup;
