import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUnreadMessages } from "../contexts/UnreadMessagesContext";
import "./Chats.css";

const Chats = () => {
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [unreadMessages, setUnreadMessages] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [hasHandledNavigation, setHasHandledNavigation] = useState(false);
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

  // Handle navigation state for auto-opening conversations
  useEffect(() => {
    // Only attempt to handle navigation if we have state and either:
    // 1. We have conversations already loaded, or
    // 2. We're creating a new conversation (which doesn't need existing conversations)
    if (location.state && !hasHandledNavigation && 
        (conversations.length > 0 || (location.state.receiverId && location.state.productId))) {
      console.log("Handling navigation state:", location.state);
      
      // Additional check to prevent handling the same state multiple times
      const stateKey = `${location.state.receiverId}-${location.state.productId}`;
      const lastHandled = sessionStorage.getItem('lastHandledNavigation');
      
      if (stateKey !== lastHandled) {
        handleNavigationState();
        setHasHandledNavigation(true);
        sessionStorage.setItem('lastHandledNavigation', stateKey);
      }
    }
  }, [conversations, location.state, hasHandledNavigation]);

  // Reset navigation handling flag when location state changes
  useEffect(() => {
    // Only reset the flag if we actually have new navigation parameters
    if (location.state && location.state.receiverId && location.state.productId && hasHandledNavigation) {
      const currentStateKey = `${location.state.receiverId}-${location.state.productId}`;
      const lastHandledKey = sessionStorage.getItem('lastHandledNavigation');
      
      // Only reset if this is actually a different navigation
      if (currentStateKey !== lastHandledKey) {
        console.log("New location state detected, resetting handler flag");
        setHasHandledNavigation(false);
        sessionStorage.setItem('lastHandledNavigation', currentStateKey);
      }
    }
  }, [location.state, hasHandledNavigation]);

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
      
      // Special handling for new conversations
      if (chat.isNew) {
        console.log("This is a new conversation - keeping current messages, not resetting");
        // Don't reset messages for new conversations to preserve any messages that were just sent
        return;
      } else {
        try {
          // Get messages
          const res = await fetch(`http://localhost:8080/messages/product/${chat.product.id}`);
          
          if (!res.ok) {
            // Handle non-successful response
            if (res.status === 400) {
              console.log("No messages found for this product yet - setting empty array");
              setChatMessages([]);
            } else {
              throw new Error(`Server returned ${res.status}: ${res.statusText}`);
            }
          } else {
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
          }
        } catch (err) {
          console.error("Error loading messages:", err);
          // Set empty messages array on error to avoid UI breaking
          setChatMessages([]);
        }
      }
    } catch (err) {
      console.error("Error in loadMessages function:", err);
      setChatMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Function to handle auto-opening conversation from navigation state
  const handleNavigationState = async () => {
    const { receiverId, productId, productTitle, sellerUsername } = location.state || {};
    
    if (receiverId && productId && userId) {
      console.log("Auto-opening conversation:", { receiverId, productId, productTitle, sellerUsername });
      
      // Check if we already have this conversation selected to avoid duplicates
      if (selectedChat && 
          selectedChat.product?.id === parseInt(productId) &&
          ((selectedChat.receiver?.id === parseInt(receiverId)) || 
           (selectedChat.sender?.id === parseInt(receiverId)))) {
        console.log("Conversation already selected, skipping...");
        return;
      }
      
      // Try to find existing conversation
      const existingConv = conversations.find(conv => {
        const otherUserId = conv.sender.id === userId ? conv.receiver.id : conv.sender.id;
        return otherUserId === parseInt(receiverId) && conv.product.id === parseInt(productId);
      });
      
      if (existingConv) {
        // Load existing conversation
        console.log("Found existing conversation, loading messages...");
        loadMessages(existingConv);
      } else {
        // Create new conversation object for display
        console.log("Creating new conversation...");
        try {
          // First, fetch the product details
          const productRes = await fetch(`http://localhost:8080/api/products/${productId}`);
          if (!productRes.ok) throw new Error("Failed to fetch product");
          const product = await productRes.json();
          console.log("🔍 DEBUG: Product fetched:", product);
          
          // Ensure product has an ID
          if (!product.id) {
            product.id = parseInt(productId);
          }
          
          // Create a minimal receiver object if we can't fetch it
          let receiver = { id: parseInt(receiverId), username: sellerUsername || "Seller" };
          
          // Try to fetch full receiver details, but don't fail if we can't
          try {
            const userRes = await fetch(`http://localhost:8080/api/profile/${receiverId}`);
            if (userRes.ok) {
              const fetchedUser = await userRes.json();
              console.log("🔍 DEBUG: Receiver fetched:", fetchedUser);
              
              // Merge fetched data with our minimal object, ensuring ID is present
              receiver = { 
                ...fetchedUser,
                id: parseInt(receiverId), // Always use the ID from navigation
                username: fetchedUser.username || sellerUsername || "Seller"
              };
            } else {
              console.warn("⚠️ Couldn't fetch receiver details, using minimal object");
            }
          } catch (userError) {
            console.warn("⚠️ Error fetching receiver:", userError);
          }
          
          console.log("🔧 Final receiver object:", receiver);
          
          // Create a temporary conversation object
          const newConversation = {
            id: `temp-${Date.now()}`,
            sender: {
              ...loggedInUser,
              id: parseInt(userId)
            },
            receiver: receiver,
            product: product,
            isNew: true
          };
          
          console.log("🔧 Created new conversation object:", newConversation);
          
          // Check if we already have this conversation to avoid duplicates
          const isDuplicate = conversations.some(conv => 
            conv.product.id === product.id && 
            ((conv.receiver?.id === receiver.id) || (conv.sender?.id === receiver.id))
          );
          
          if (!isDuplicate) {
            // Add to conversations list and select it
            setConversations(prev => [newConversation, ...prev]);
            setSelectedChat(newConversation);
            setChatMessages([]); // Start with empty messages only for truly new conversations
            console.log("New conversation created and selected");
          } else {
            console.log("Conversation already exists, not creating duplicate");
            // Find and select the existing conversation
            const existing = conversations.find(conv => 
              conv.product.id === product.id && 
              ((conv.receiver?.id === receiver.id) || (conv.sender?.id === receiver.id))
            );
            if (existing) {
              setSelectedChat(existing);
              loadMessages(existing);
            }
          }
        } catch (error) {
          console.error("Error creating new conversation:", error);
          alert("Failed to create new conversation. Please try again.");
        }
      }
    } else {
      console.error("❌ Missing required parameters:", { receiverId, productId, userId });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    setIsSending(true);

    // 🛠️ IMPROVED: Better logic to determine the receiver
    let otherUser;
    
    console.log("🔍 DEBUG selectedChat structure:", {
      isNew: selectedChat.isNew,
      sender: selectedChat.sender,
      receiver: selectedChat.receiver,
      product: selectedChat.product
    });
    
    if (selectedChat.isNew) {
      // For new conversations created from "Contact Seller"
      otherUser = selectedChat.receiver;
      console.log("📝 Using receiver from NEW conversation:", otherUser);
    } else {
      // For existing conversations, determine who is the other user
      otherUser = selectedChat.sender.id === parseInt(userId) 
        ? selectedChat.receiver 
        : selectedChat.sender;
      console.log("📝 Using determined receiver from EXISTING conversation:", otherUser);
    }

    // 🧠 ADDITIONAL SAFETY: Validate that otherUser exists and has an ID
    if (!otherUser) {
      console.error("❌ Cannot determine receiver - missing receiver object");
      alert("Error: Couldn't determine message recipient. Please refresh and try again.");
      setIsSending(false);
      return;
    }
    
    // Ensure the receiver ID is valid
    if (!otherUser.id) {
      console.error("❌ Receiver is missing ID:", otherUser);
      alert("Error: Couldn't determine recipient ID. Please refresh and try again.");
      setIsSending(false);
      return;
    }

    // Make sure all IDs are numbers for consistency with backend
    const senderIdNum = parseInt(userId);
    const receiverIdNum = parseInt(otherUser.id);
    const productIdNum = parseInt(selectedChat.product.id);
    
    if (isNaN(senderIdNum) || isNaN(receiverIdNum) || isNaN(productIdNum)) {
      console.error("❌ Invalid ID format:", { 
        senderIdNum, 
        receiverIdNum, 
        productIdNum,
        originalIds: {
          senderId: userId,
          receiverId: otherUser.id,
          productId: selectedChat.product.id
        }
      });
      alert("Error: Invalid ID format. Please refresh and try again.");
      setIsSending(false);
      return;
    }

    const msg = {
      sender: { id: senderIdNum },
      receiver: { id: receiverIdNum },
      product: { id: productIdNum },
      content: newMessage,
    };

    // 🧪 DEBUG: Log the payload to verify all IDs are present
    console.log("📤 Sending message payload:", msg);
    console.log("🔍 Payload validation:", {
      userId: userId,
      senderId: msg.sender.id,
      receiverId: msg.receiver.id,
      productId: msg.product.id,
      content: msg.content,
      hasContent: !!msg.content.trim(),
      selectedChatType: selectedChat.isNew ? 'NEW' : 'EXISTING',
      otherUser: otherUser
    });

    // Validate required fields before sending
    if (!msg.sender.id || !msg.receiver.id || !msg.product.id || !msg.content.trim()) {
      console.error("❌ Missing required fields:", {
        senderId: msg.sender.id,
        receiverId: msg.receiver.id,
        productId: msg.product.id,
        hasContent: !!msg.content.trim()
      });
      setIsSending(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg),
      });

      if (response.ok) {
        console.log("✅ Message sent successfully");
        
        // If this was a new conversation, mark it as no longer new
        if (selectedChat.isNew) {
          setSelectedChat(prev => ({
            ...prev,
            isNew: false,
            id: `${userId}-${otherUser.id}-${selectedChat.product.id}` // Give it a proper ID
          }));
        }
        
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
        
        // Clear navigation state immediately after first message to prevent recreation
        if (location.state) {
          console.log("✅ Clearing navigation state after successful message");
          window.history.replaceState({}, document.title);
        }
        
        // Actualizăm și lista de conversații pentru a reflecta noua ordine (după un delay)
        setTimeout(async () => {
          try {
            const res = await fetch(`http://localhost:8080/messages/conversations/${userId}`);
            if (res.ok) {
              const data = await res.json();
              if (Array.isArray(data)) {
                setConversations(data);
                
                // Find the real conversation that was just created and update selectedChat
                const realConversation = data.find(conv => {
                  const otherUserId = conv.sender.id === userId ? conv.receiver.id : conv.sender.id;
                  return otherUserId === parseInt(otherUser.id) && conv.product.id === parseInt(selectedChat.product.id);
                });
                
                if (realConversation) {
                  console.log("🔄 Updating to real conversation:", realConversation);
                  setSelectedChat(realConversation);
                }
              }
            }
          } catch (err) {
            console.error("Error updating conversations after send:", err);
          }
        }, 1000); // Delay to ensure backend has processed the message
        
      } else {
        // 🔍 DEBUG: Log the exact error response
        console.error("❌ Failed to send message:", {
          status: response.status,
          statusText: response.statusText
        });
        
        try {
          const errorText = await response.text();
          console.error("❌ Backend error response:", errorText);
        } catch (e) {
          console.error("❌ Could not read error response");
        }
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
    if (selectedChat && !selectedChat.isNew) {
      // Prima încărcare a mesajelor doar pentru conversații existente
      loadMessages(selectedChat);
      
      // Actualizare automată la fiecare 5 secunde doar pentru conversații existente
      const messageInterval = setInterval(() => {
        if (!selectedChat.isNew) { // Double check to avoid loading during conversation creation
          loadMessages(selectedChat);
        }
      }, 5000);
      
      return () => clearInterval(messageInterval);
    } else if (selectedChat && selectedChat.isNew) {
      // For new conversations, just ensure we have an empty message array
      // Don't call loadMessages as it will reset to empty anyway
      console.log("Selected new conversation - keeping existing messages");
    }
  }, [selectedChat?.product?.id, selectedChat?.sender?.id, selectedChat?.receiver?.id, selectedChat?.isNew]);

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
    <div className="ecoswap-chat-container">
      {/* Conversations Sidebar */}
      <div className="ecoswap-chat-sidebar">
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
      <div className="ecoswap-chat-panel">
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
