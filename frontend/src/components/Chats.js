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
          setConversations([]); // fallback
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

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      {/* Sidebar with conversation previews */}
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
              }}
            >
              <strong>@{otherUser.username}</strong> about{" "}
              <em>{conv.product.title}</em>
              <br />
              <small>{conv.content.slice(0, 30)}...</small>
            </div>
          );
        })}
      </div>

      {/* Chat panel */}
      <div style={{ width: "70%" }}>
        {selectedChat ? (
          <>
            <h4>
              Chat with{" "}
              {
                (selectedChat.sender.id === userId
                  ? selectedChat.receiver.username
                  : selectedChat.sender.username)
              }{" "}
              about <em>{selectedChat.product.title}</em>
            </h4>
            <div
              style={{
                height: "300px",
                overflowY: "auto",
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              {chatMessages.map((msg, idx) => {
  const isSentByMe = msg.sender?.id === userId;
  return (
    <div
      key={idx}
      style={{
        display: "flex",
        justifyContent: isSentByMe ? "flex-end" : "flex-start",
        marginBottom: "8px",
      }}
    >
      <div
        style={{
          backgroundColor: isSentByMe ? "#DCF8C6" : "#f1f0f0",
          padding: "10px",
          borderRadius: "10px",
          maxWidth: "60%",
        }}
      >
        <strong>{msg.sender?.username || "?"}</strong>: {msg.content}
      </div>
    </div>
  );
})}

            </div>
            <input
              type="text"
              placeholder="Type a message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{ width: "100%", padding: "8px", marginBottom: "5px" }}
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
