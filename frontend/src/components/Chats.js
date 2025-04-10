import React, { useEffect, useState } from "react";

const Chats = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const userId = loggedInUser?.id;

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:8080/messages/conversations/${userId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Conversations not found");
          return res.json();
        })
        .then((data) => {
          if (!Array.isArray(data)) {
            console.error("Data is not an array", data);
            setConversations([]);
          } else {
            setConversations(data);
          }
        })
        .catch((err) => {
          console.error("Error loading conversations:", err);
          setConversations([]);
        });
    }
  }, [userId]);

  const loadMessages = (chat) => {
    setSelectedChat(chat);

    fetch(`http://localhost:8080/messages/product/${chat.product.id}`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (msg) =>
            (msg.sender.id === userId || msg.receiver.id === userId) &&
            (msg.sender.id === chat.sender.id || msg.receiver.id === chat.sender.id)
        );
        setChatMessages(filtered);
      })
      .catch((err) => console.error("Error loading messages:", err));
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

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
        setNewMessage("");
        loadMessages(selectedChat);
      }
    } catch (err) {
      console.error("Error sending message:", err);
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
  

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      {/* Sidebar */}
      <div style={{ width: "30%", borderRight: "1px solid #ccc" }}>
        <h3>Your Conversations</h3>
        {conversations.map((conv, idx) => {
          const otherUser =
            conv.sender.id === userId ? conv.receiver : conv.sender;

          return (
            <div
              key={idx}
              onClick={() => loadMessages(conv)}
              style={{
                cursor: "pointer",
                padding: "10px",
                borderBottom: "1px solid #ddd",
                backgroundColor:
                  selectedChat?.product.id === conv.product.id &&
                  (conv.sender.id === selectedChat.sender.id ||
                    conv.receiver.id === selectedChat.receiver.id)
                    ? "#f0f0f0"
                    : "transparent",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img
                src={getProfilePic(otherUser)}
                alt="avatar"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  marginRight: "10px",
                  objectFit: "cover",
                }}
              />
              <div style={{ lineHeight: "1.3" }}>
                <strong>@{otherUser.username}</strong> <br />
                <strong>{conv.product.title}</strong>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chat Panel */}
      <div style={{ width: "70%" }}>
        {selectedChat ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4>
                Chat with{" "}
                {
                  selectedChat.sender.id === userId
                    ? selectedChat.receiver.username
                    : selectedChat.sender.username
                }{" "}
                about <strong>{selectedChat.product.title}</strong>
              </h4>
              <button
                onClick={() => setSelectedChat(null)}
                style={{
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                Close Chat
              </button>
            </div>

            <div
              style={{
                height: "400px",
                overflowY: "auto",
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {chatMessages.map((msg, idx) => {
                const isOwn = msg.sender.id === userId;
                return (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      flexDirection: isOwn ? "row-reverse" : "row",
                      alignItems: "flex-end",
                      marginBottom: "10px",
                    }}
                  >
                    <img
                      src={getProfilePic(msg.sender)}
                      alt="avatar"
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        margin: isOwn ? "0 0 0 10px" : "0 10px 0 0",
                      }}
                    />
                    <div
                      style={{
                        backgroundColor: isOwn ? "#DCF8C6" : "#ffffff",
                        padding: "10px",
                        borderRadius: "15px",
                        maxWidth: "60%",
                        textAlign: "left",
                      }}
                    >
                      {msg.sender.id === userId ? (
                        <span>{msg.content}</span>
                      ) : (
                        <span>
                          <strong>{msg.sender.username}:</strong> {msg.content}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <textarea
              placeholder="Type a message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              style={{
                width: "100%",
                padding: "8px",
                marginBottom: "5px",
                resize: "none",
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                width: "100%",
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "10px",
              }}
            >
              Send
            </button>
          </>
        ) : (
          <p>Select a conversation to see messages</p>
        )}
      </div>
    </div>
  );
};

export default Chats;
