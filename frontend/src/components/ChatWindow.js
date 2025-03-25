import { useState, useEffect, useCallback, useRef } from "react";

const ChatWindow = () => {
    const [chatUsers, setChatUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const chatRef = useRef(null);

    // ✅ Fetch unique chat users
    const fetchChatUsers = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:8080/messages/user/${loggedInUser.id}`);
            const data = await response.json();
    
            // ✅ Extract unique usernames and filter out the logged-in user
            const uniqueUsers = [];
            const usernameSet = new Set();
    
            data.forEach((msg) => {
                const otherUser = msg.sender.username === loggedInUser.username ? msg.receiver : msg.sender;
    
                if (!usernameSet.has(otherUser.username) && otherUser.username !== loggedInUser.username) {
                    usernameSet.add(otherUser.username);
                    uniqueUsers.push(otherUser);
                }
            });
    
            setChatUsers(uniqueUsers);
        } catch (error) {
            console.error("Error fetching chat users:", error);
        }
    }, [loggedInUser]);
    
    

    const fetchMessages = async () => {
        if (!loggedInUser || !selectedUser || !selectedProductId) return;
        try {
            const response = await fetch(`http://localhost:8080/messages/conversation/${loggedInUser.id}/${selectedUser.id}/${selectedProductId}`);
    
            if (!response.ok) {
                console.warn("❌ Failed to fetch messages!");
                setMessages([]);
                return;
            }
    
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error("❌ Error fetching messages:", error);
        }
    };
    
    
    
    
    
    
    

    // ✅ Fetch users once on mount
    useEffect(() => {
        fetchChatUsers();
    }, [fetchChatUsers]);

    // ✅ Fetch messages when a user is selected
    useEffect(() => {
        fetchMessages();
    }, [fetchMessages, selectedUser]);

    // ✅ Auto-refresh messages every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchMessages();
        }, 3000);
        return () => clearInterval(interval);
    }, [fetchMessages]);
    

    // ✅ Auto-scroll to the latest message
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedUser) return;
    
        const messageData = {
            sender: { id: loggedInUser.id },
            receiver: { id: selectedUser.id },
            content: newMessage,
            product: { id: selectedProductId }, // Ensure this is included
        };
    
        try {
            const response = await fetch("http://localhost:8080/messages/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(messageData),
            });
    
            if (response.ok) {
                setNewMessage("");
                fetchMessages();
            } else {
                const errorText = await response.text();
                console.error("❌ Failed to send message:", errorText);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };
    
    
    
    

    return (
        <div style={{ position: "fixed", bottom: "60px", right: "20px", width: "400px", background: "#fff", border: "1px solid #ccc", padding: "10px", borderRadius: "10px" }}>
            <h3>Chats</h3>
            <div style={{ maxHeight: "150px", overflowY: "auto" }}>
                {chatUsers.length === 0 ? (
                    <p>No chats available</p>
                ) : (
                    chatUsers.map((user) => (
                        <button key={user.id} onClick={() => setSelectedUser(user)} style={{ display: "block", width: "100%", textAlign: "left", padding: "8px", borderBottom: "1px solid #ddd" }}>
                            {user.username}
                        </button>
                    ))
                )}
            </div>

            {selectedUser && (
                <>
                    <h4>Chat with {selectedUser.username}</h4>
                    <div ref={chatRef} style={{ maxHeight: "250px", overflowY: "auto", padding: "10px", background: "#f9f9f9", borderRadius: "5px" }}>
                    {messages.map((msg, index) => (
    <div key={index} style={{
        textAlign: msg.sender.username === loggedInUser.username ? "right" : "left",
        backgroundColor: msg.sender.username === loggedInUser.username ? "#DCF8C6" : "#FFFFFF",
        padding: "8px",
        borderRadius: "10px",
        margin: "5px",
        maxWidth: "75%",
        alignSelf: msg.sender.username === loggedInUser.username ? "flex-end" : "flex-start",
    }}>
        <strong>{msg.sender.username}:</strong> {msg.content}
    </div>
))}

                    </div>

                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        style={{ width: "100%", marginBottom: "5px", padding: "5px" }}
                    />
                    <button onClick={sendMessage} style={{ width: "100%", backgroundColor: "#4CAF50", color: "white" }}>Send</button>
                </>
            )}
        </div>
    );
};

export default ChatWindow;
