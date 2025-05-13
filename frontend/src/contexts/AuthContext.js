import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const getUserFromStorage = () => {
      try {
        const userToken = localStorage.getItem('userToken');
        const storedUser = localStorage.getItem('user');
        
        if (userToken && storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading user from storage:', error);
        setLoading(false);
      }
    };

    getUserFromStorage();

    // Listen for storage changes (if user logs in from another tab)
    const handleStorageChange = () => {
      getUserFromStorage();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Function to update user info in context and localStorage
  const updateCurrentUser = (userData) => {
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setCurrentUser(userData);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('userToken');
      setCurrentUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, updateCurrentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
