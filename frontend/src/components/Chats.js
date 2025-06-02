import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useUnreadMessages } from "../contexts/UnreadMessagesContext";
import "./Chats.css";

const Chats = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [unreadMessages, setUnreadMessages] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null); // Referință pentru scrollul automat
  
  const { markChatAsRead, checkUnreadMessages } = useUnreadMessages();

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const userId = loggedInUser?.id;

  useEffect(() => {
    if (userId) {
      // Fetch user's conversations
      const getConversations = async () => {
        try {
          const res = await fetch(`http://localhost:8080/messages/conversations/${userId}`);
          if (!res.ok) throw new Error("Conversations not found");
          const data = await res.json();
          
          if (!Array.isArray(data)) {
            console.error("Data is not an array", data);
            setConversations([]);
          } else {
            setConversations(data);
            
            // Check for unread messages in each conversation
            const unreadCounts = {};
            await Promise.all(
              data.map(async (conv) => {
                const otherUserId = conv.sender.id === userId ? conv.receiver.id : conv.sender.id;
                try {
                  const unreadRes = await fetch(
                    `http://localhost:8080/messages/unread/${userId}/${otherUserId}/${conv.product.id}`
                  );
                  if (unreadRes.ok) {
                    const count = await unreadRes.json();
                    if (count > 0) {
                      unreadCounts[`${otherUserId}-${conv.product.id}`] = count;
                    }
                  }
                } catch (err) {
                  console.error("Error checking unread messages for conversation:", err);
                }
              })
            );
            
            setUnreadMessages(unreadCounts);
          }
        } catch (err) {
          console.error("Error loading conversations:", err);
          setConversations([]);
        }
      };
      
      getConversations();
      
      // Update unread messages periodically
      const interval = setInterval(getConversations, 10000); // Every 10 seconds pentru o experiență mai reactivă
      
      return () => clearInterval(interval);
    }
  }, [userId]);

  const loadMessages = async (chat) => {
    setSelectedChat(chat);
    
    try {
      setIsLoadingMessages(true);
      
      const otherUserId = chat.sender.id === userId ? chat.receiver.id : chat.sender.id;
      const key = `${otherUserId}-${chat.product.id}`;
      
      // Immediately update unread count in context if there are unread messages
      if (unreadMessages[key]) {
        markChatAsRead(otherUserId, chat.product.id);
        
        // Update local unread state
        setUnreadMessages(prev => {
          const updated = {...prev};
          delete updated[key];
          return updated;
        });
      }
      
      // Get messages
      const res = await fetch(`http://localhost:8080/messages/product/${chat.product.id}`);
      const data = await res.json();
      
      const filtered = data.filter(
        (msg) =>
          (msg.sender.id === userId || msg.receiver.id === userId) &&
          (msg.sender.id === chat.sender.id || msg.receiver.id === chat.sender.id)
      );
      // Sortare cronologică a mesajelor - cele mai vechi primele
      const sortedMessages = filtered.sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
      );
      setChatMessages(sortedMessages);
      
    } catch (err) {
      console.error("Error loading messages:", err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    setIsSending(true);

    const otherUser =
      selectedChat.sender.id === userId
        ? selectedChat.receiver
        : selectedChat.sender;

    const msg = {
      sender: { id: userId },
      receiver: { id: otherUser.id },
      product: { id: selectedChat.product.id },
      content: newMessage,
    };

    try {
      const response = await fetch("http://localhost:8080/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg),
      });

      if (response.ok) {
        // Încorporăm mesajul nou direct în chatMessages pentru a evita reîncărcarea
        const sentMessage = {
          ...msg,
          id: Date.now(), // ID temporar
          timestamp: new Date().toISOString(),
          sender: {
            ...loggedInUser,
            id: userId
          },
          receiver: otherUser,
          product: selectedChat.product
        };
        
        // Adăugăm direct mesajul în lista locală pentru afișare instantă
        setChatMessages(prevMessages => [...prevMessages, sentMessage]);
        
        // Resetăm câmpul de mesaj
        setNewMessage("");
        
        // Actualizăm și lista de conversații pentru a reflecta noua ordine
        const getConversations = async () => {
          try {
            const res = await fetch(`http://localhost:8080/messages/conversations/${userId}`);
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data)) {
                setConversations(data);
              }
            }
          } catch (err) {
            console.error("Error updating conversations after send:", err);
          }
        };
        getConversations();
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getProfilePic = (user) => {
    if (!user || !user.profilePic || user.profilePic.trim() === "") {
      return "/default-avatar.jpg"; // ✅ fallback absolut
    }
    return user.profilePic;
  };
  
  // Adăugăm efectul pentru actualizarea automată a mesajelor din conversația curentă
  useEffect(() => {
    if (selectedChat) {
      // Prima încărcare a mesajelor
      loadMessages(selectedChat);
      
      // Actualizare automată la fiecare 5 secunde
      const messageInterval = setInterval(() => {
        loadMessages(selectedChat);
      }, 5000);
      
      return () => clearInterval(messageInterval);
    }
  }, [selectedChat?.product?.id, selectedChat?.sender?.id, selectedChat?.receiver?.id]);

  // Funcție pentru a face scroll automat la cel mai nou mesaj
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };
  
  // Apelăm scroll automat când se modifică lista de mesaje
  useEffect(() => {
    // Folosim un timeout scurt pentru a ne asigura că scrollul se face după renderizare
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [chatMessages]);

  return (
    <div className="chat-container">
      {/* Conversations Sidebar */}
      <div className="chat-sidebar">
        <div className="sidebar-header">
          <h3>Conversations</h3>
        </div>
        
        <div className="conversations-list">
          {conversations.length > 0 ? (
            conversations.map((conv, idx) => {
              const otherUser = conv.sender.id === userId ? conv.receiver : conv.sender;
              const isActive = selectedChat && 
                selectedChat.product.id === conv.product.id && 
                ((conv.sender.id === selectedChat.sender.id && conv.receiver.id === selectedChat.receiver.id) ||
                (conv.sender.id === selectedChat.receiver.id && conv.receiver.id === selectedChat.sender.id));
              
              // Check if conversation has unread messages
              const convKey = `${otherUser.id}-${conv.product.id}`;
              const hasUnread = unreadMessages[convKey] > 0;
              
              return (
                <div
                  key={idx}
                  onClick={() => loadMessages(conv)}
                  className={`conversation-item ${isActive ? 'active' : ''} ${hasUnread ? 'unread' : ''} fade-in`}
                >
                  <img
                    src={getProfilePic(otherUser)}
                    alt={otherUser.username}
                    className="conversation-avatar"
                  />
                  <div className="conversation-details">
                    <div className="conversation-username">
                      <Link to={`/user/${otherUser.id}`} className="user-profile-link">
                        @{otherUser.username}
                      </Link>
                      {/* Show timestamp or status if needed */}
                    </div>
                    <div className="conversation-product">
                      {conv.product.title}
                    </div>
                  </div>
                  {hasUnread && <div className="unread-indicator"></div>}
                </div>
              );
            })
          ) : (
            <div className="empty-conversation-list">
              <p>No conversations yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Panel */}
      <div className="chat-panel">
        {selectedChat ? (
          <>
            <div className="chat-header">
              <h4>
                Chat with{" "}
                <Link to={`/user/${selectedChat.sender.id === userId 
                  ? selectedChat.receiver.id 
                  : selectedChat.sender.id}`} 
                  className="user-profile-link">
                  @{selectedChat.sender.id === userId
                    ? selectedChat.receiver.username
                    : selectedChat.sender.username
                  }
                </Link>{" "}
                about <strong>{selectedChat.product.title}</strong>
              </h4>
              <button
                onClick={() => setSelectedChat(null)}
                className="close-chat-btn"
              >
                Close
              </button>
            </div>

            <div className="messages-container">
              {chatMessages.map((msg, idx) => {
                const isOwn = msg.sender.id === userId;
                return (
                  <div
                    key={idx}
                    className={`message-item ${isOwn ? 'own' : 'other'} slide-in`}
                  >
                    <img
                      src={getProfilePic(msg.sender)}
                      alt={msg.sender.username}
                      className="message-avatar"
                    />
                    <div className="message-bubble">
                      {!isOwn && (
                        <div className="message-sender">{msg.sender.username}</div>
                      )}
                      <div className="message-content">{msg.content}</div>
                    </div>
                  </div>
                );
              })}
              {/* Referință pentru scrollul automat */}
              <div ref={messagesEndRef} />
            </div>

            <div className="message-input-container">
              <textarea
                className="message-textarea"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <button className="send-button" onClick={sendMessage} disabled={isSending}>
                {isSending ? (
                  <i className="fa fa-spinner fa-spin"></i>
                ) : (
                  <i className="fa fa-paper-plane">→</i>
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="empty-chat fade-in">
            <i className="fa fa-comments">💬</i>
            <p>Select a conversation to start chatting</p>
          </div>
        )}
        {isLoadingMessages && <div className="loading-messages">Loading messages...</div>}
      </div>
    </div>
  );
};

export default Chats;
