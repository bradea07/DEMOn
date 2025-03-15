import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProductList from "./components/ProductList";
import AddProduct from "./components/AddProduct";
import MyProfile from "./components/MyProfile";
import Settings from "./components/Settings";
import Navbar from "./components/Navbar";

// Function to check if user is authenticated
const isAuthenticated = () => {
  return localStorage.getItem("userToken") !== null; 
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  useEffect(() => {
    const checkAuth = () => setIsLoggedIn(isAuthenticated());
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <Router>
      {isLoggedIn && <Navbar onLogout={() => {
        localStorage.removeItem("userToken");
        setIsLoggedIn(false);
      }} />}
      
      <Routes>
        {/* If not logged in, redirect to login */}
        <Route path="/login" element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />} />
        <Route path="/signup" element={!isLoggedIn ? <Signup /> : <Navigate to="/" />} />

        {/* Protected Routes (Only visible when logged in) */}
        {isLoggedIn ? (
          <>
            <Route path="/" element={<ProductList />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/settings" element={<Settings />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
