import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Login from "./components/Login";
import Signup from "./components/Signup";
import SearchPage from "./components/SearchPage";
import SearchResults from "./components/SearchResults";
import ProductDetails from "./components/ProductDetails";
import AddProduct from "./components/AddProduct";
import MyProfile from "./components/MyProfile";
import UserProfile from "./components/UserProfile";
import Chats from "./components/Chats";
import NotificationsPage from "./components/NotificationsPage";

import Navbar from "./components/Navbar";
import Chatbot from "./components/Chatbot";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import EditProduct from "./components/EditProduct"; // ✅ importat
import Delivery from "./components/Delivery"; // Import Delivery component
import MapComponent from "./components/Map"; // Import Map component
import { UnreadMessagesProvider } from "./contexts/UnreadMessagesContext";
import "./Styles/Chatbot.css";

// Function to check if user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem("userToken");
  const user = localStorage.getItem("user");
  // Require both token and user data to be present
  return token !== null && user !== null;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  useEffect(() => {
    // Check if this is the first load of the application
    const firstLoadKey = "app_has_been_loaded";
    const isFirstLoad = !sessionStorage.getItem(firstLoadKey);
    
    if (isFirstLoad) {
      console.log("First application load - clearing authentication");
      // Clear authentication data only on first load
      localStorage.removeItem("userToken");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      // Mark that the app has been loaded once in this session
      sessionStorage.setItem(firstLoadKey, "true");
    } else {
      // On refresh, respect the current authentication state
      const authenticated = isAuthenticated();
      setIsLoggedIn(authenticated);
    }
    
    // Function to check authentication status for future calls
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      console.log("Authentication check:", authenticated ? "Authenticated" : "Not authenticated");
      setIsLoggedIn(authenticated);
    };
    
    // Listen for storage events (when localStorage changes)
    window.addEventListener("storage", checkAuth);
    
    
    const interval = setInterval(checkAuth, 30000); // Check every 30 seconds instead of 1 second
    
    // Clean up listeners on component unmount
    return () => {
      window.removeEventListener("storage", checkAuth);
      clearInterval(interval);
    };
  }, []);

  return (
    <UnreadMessagesProvider>
      <Router>
        {isLoggedIn && (
          <>
            <Navbar
              onLogout={() => {
                // Clear all authentication-related data
                localStorage.removeItem("userToken");
                localStorage.removeItem("user");
                setIsLoggedIn(false);
              }}
              toggleChatbot={toggleChatbot}
            />
            <Chatbot isOpen={isChatbotOpen} toggleChatbot={toggleChatbot} />
          </>
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
              <Route path="/user/:userId" element={<UserProfile />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/chats" element={<Chats />} />
              <Route path="/delivery" element={<Delivery />} />
              <Route path="/map" element={<MapComponent />} />
              
              <Route path="/edit-product/:id" element={<EditProduct />} /> {/* ✅ ruta pentru edit */}
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </Router>
    </UnreadMessagesProvider>
  );
}

export default App;
