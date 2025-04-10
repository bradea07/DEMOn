import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import SearchPage from "./components/SearchPage";
import SearchResults from "./components/SearchResults";
import ProductDetails from "./components/ProductDetails";
import AddProduct from "./components/AddProduct";
import MyProfile from "./components/MyProfile";
import Settings from "./components/Settings";
import Navbar from "./components/Navbar";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import EditProduct from "./components/EditProduct"; // ✅ importat

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
      {isLoggedIn && (
        <Navbar
          onLogout={() => {
            localStorage.removeItem("userToken");
            setIsLoggedIn(false);
          }}
        />
      )}

      <Routes>
        <Route path="/login" element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/" />} />
        <Route path="/signup" element={!isLoggedIn ? <Signup /> : <Navigate to="/" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {isLoggedIn ? (
          <>
            <Route path="/" element={<SearchPage />} />
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/edit-product/:id" element={<EditProduct />} /> {/* ✅ ruta pentru edit */}
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
