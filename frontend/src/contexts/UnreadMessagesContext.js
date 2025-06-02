import React, { createContext, useContext, useState, useEffect } from 'react';

const UnreadMessagesContext = createContext();

export const useUnreadMessages = () => {
  const context = useContext(UnreadMessagesContext);
  if (!context) {
    throw new Error('useUnreadMessages must be used within UnreadMessagesProvider');
  }
  return context;
};

export const UnreadMessagesProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const userId = loggedInUser?.id;

  const checkUnreadMessages = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`http://localhost:8080/messages/unread/${userId}`);
      if (response.ok) {
        const count = await response.json();
        setUnreadCount(count);
      }
    } catch (err) {
      console.error("Error checking unread messages:", err);
    }
  };

  const markChatAsRead = async (otherUserId, productId) => {
    if (!userId) return;
    try {
      // Update UI immediately
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Then sync with backend
      await fetch(`http://localhost:8080/messages/markRead/${userId}/${otherUserId}/${productId}`, {
        method: 'POST'
      });
      
      // Refresh count from server to ensure accuracy
      setTimeout(checkUnreadMessages, 100);
    } catch (err) {
      console.error("Error marking chat as read:", err);
      // Revert optimistic update on error
      checkUnreadMessages();
    }
  };

  const decrementUnreadCount = (amount = 1) => {
    setUnreadCount(prev => Math.max(0, prev - amount));
  };

  useEffect(() => {
    if (userId) {
      checkUnreadMessages();
      // Check periodically
      const interval = setInterval(checkUnreadMessages, 30000);
      return () => clearInterval(interval);
    }
  }, [userId]);

  const value = {
    unreadCount,
    checkUnreadMessages,
    markChatAsRead,
    decrementUnreadCount,
    setUnreadCount
  };

  return (
    <UnreadMessagesContext.Provider value={value}>
      {children}
    </UnreadMessagesContext.Provider>
  );
};
