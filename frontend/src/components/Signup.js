import { useState } from "react";
import { useNavigate } from "react-router-dom"; 

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",  // ✅ Added confirmPassword field
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
  
    // Trim spaces from passwords before comparing
    const trimmedPassword = formData.password.trim();
    const trimmedConfirmPassword = formData.confirmPassword.trim();
  
    if (trimmedPassword !== trimmedConfirmPassword) {
      setMessage("❌ Passwords do not match.");
      return;
    }
  
    console.log("Sending user data:", formData); // Debugging log
  
    try {
      const response = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
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
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />  
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
        <button type="submit">Sign Up</button>
      </form>
      {message && <p>{message}</p>}
      <p>Already have an account?</p>
      <button onClick={() => navigate("/login")}>Back to Login</button>
    </div>
  );
};

export default Signup;
