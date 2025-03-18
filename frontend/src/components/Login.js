import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({ usernameOrEmail: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); 

    const requestData = {
      email: formData.usernameOrEmail.includes("@") ? formData.usernameOrEmail : null,
      username: formData.usernameOrEmail.includes("@") ? null : formData.usernameOrEmail,
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
      <div className="ecoswap-title">EcoSwap</div> {/* EcoSwap Title */}
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
          <button type="submit" className="login-btn">Login</button>
        </form>
        {message && <p>{message}</p>}
        <p>Don't have an account?</p>
        <button className="login-btn" onClick={() => navigate("/signup")}>Sign Up</button>
      </div>
    </div>
  );
};

export default Login;
