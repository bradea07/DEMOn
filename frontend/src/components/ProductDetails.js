import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const currentUser = loggedInUser ? loggedInUser.id : null;
  const loggedInUsername = loggedInUser ? loggedInUser.username : "Unknown";

  // ✅ Verifici dacă utilizatorul logat e și ownerul produsului
  const isOwner = product?.user?.id === currentUser;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/products/${id}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const fetchMessages = async () => {
    if (!product || !product.id || !currentUser) return;
    try {
      const response = await fetch(`http://localhost:8080/messages/product/${product.id}`);
      if (!response.ok) return;

      const data = await response.json();

      const filteredMessages = data.filter(
        msg =>
          (msg.sender.id === currentUser || msg.receiver.id === currentUser) &&
          (msg.sender.id === product.user.id || msg.receiver.id === product.user.id)
      );

      setMessages(filteredMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !product?.user?.id) return;

    const messageData = {
      sender: { id: currentUser, username: loggedInUsername },
      receiver: { id: product.user.id, username: product.user.username },
      product: { id: product.id },
      content: newMessage,
    };

    try {
      const response = await fetch("http://localhost:8080/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        fetchMessages();
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>{product?.title}</h2>
      <p><strong>Category:</strong> {product?.category}</p>
      <p><strong>Description:</strong> {product?.description}</p>
      <p><strong>Price:</strong> {product?.price} USD</p>
      <p><strong>Brand:</strong> {product?.brand}</p>
      <p><strong>Condition:</strong> {product?.condition || "Not Available"}</p>

      {product?.imageUrls?.length > 0 ? (
        product.imageUrls.map((img, index) => (
          <img key={index} src={`http://localhost:8080${img}`} alt="Product" width="200" />
        ))
      ) : (
        <p style={{ color: "red" }}>No image available</p>
      )}

      {/* ✅ Afișează doar dacă NU e produsul tău */}
      {!isOwner && (
        <button onClick={() => { setChatOpen(!chatOpen); fetchMessages(); }}>
          {chatOpen ? "Close Chat" : "Send Message"}
        </button>
      )}

      {/* ✅ Mesaj informativ dacă e produsul tău */}
      {isOwner && <p style={{ color: "gray" }}>🛠️ This is your product.</p>}

      {chatOpen && (
        <div style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "350px",
          background: "#F0F0F0",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "10px"
        }}>
          <h4>Chat with Seller</h4>
          {product?.user ? (
            <div style={{ maxHeight: "200px", overflowY: "auto", padding: "10px" }}>
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      textAlign: msg.sender.id === currentUser ? "left" : "right",
                      backgroundColor: msg.sender.id === currentUser ? "#DCF8C6" : "#FFFFFF",
                      color: "black",
                      padding: "8px",
                      borderRadius: "10px",
                      margin: "5px",
                      maxWidth: "75%",
                      alignSelf: msg.sender.id === currentUser ? "flex-start" : "flex-end",
                    }}
                  >
                    <strong>{msg.sender.username}:</strong> {msg.content}
                  </div>
                ))
              ) : (
                <p>No messages yet.</p>
              )}
            </div>
          ) : (
            <p style={{ color: "red" }}>⚠️ Seller information unavailable</p>
          )}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            style={{ width: "100%", marginBottom: "5px", padding: "5px" }}
          />
          <button onClick={sendMessage} style={{ width: "100%", backgroundColor: "#4CAF50", color: "white" }}>
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
