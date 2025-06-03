import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../Styles/ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isFavorited, setIsFavorited] = useState(false);
  const [sellerRating, setSellerRating] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const currentUser = loggedInUser?.id;
  const username = loggedInUser?.username;

  const isOwner = product?.user?.id === currentUser;

  const userFavoritesKey = `favorites_${currentUser}`;

  // Helper function to get profile picture with fallback
  const getProfilePic = (user) => {
    if (!user || !user.profilePic || user.profilePic.trim() === "") {
      return "/default-avatar.jpg";
    }
    return user.profilePic.startsWith("http") ? user.profilePic : `http://localhost:8080${user.profilePic}`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      const userFavoritesKey = `favorites_${currentUser}`;
      try {
        const response = await fetch(`http://localhost:8080/api/products/${id}`);
        if (!response.ok) throw new Error("Product not found");
        const data = await response.json();
        setProduct(data);
  
        // Check favorite status from backend if user is logged in
        if (currentUser) {
          try {
            const favoriteResponse = await fetch(`http://localhost:8080/api/favorites/check/${currentUser}/${data.id}`);
            if (favoriteResponse.ok) {
              const favoriteData = await favoriteResponse.json();
              setIsFavorited(favoriteData.isFavorited);
            } else {
              // Fallback to localStorage check
              const storedFavorites = JSON.parse(localStorage.getItem(userFavoritesKey)) || [];
              setIsFavorited(storedFavorites.some((fav) => fav.id === data.id));
            }
          } catch (err) {
            console.error("Error checking favorite status:", err);
            // Fallback to localStorage check
            const storedFavorites = JSON.parse(localStorage.getItem(userFavoritesKey)) || [];
            setIsFavorited(storedFavorites.some((fav) => fav.id === data.id));
          }
        }
        
        // Fetch seller's ratings if product has a user
        if (data.user && data.user.id) {
          try {
            const ratingResponse = await fetch(`http://localhost:8080/api/ratings/user/${data.user.id}`);
            if (ratingResponse.ok) {
              const ratingData = await ratingResponse.json();
              if (ratingData.length > 0) {
                const sum = ratingData.reduce((total, rating) => total + rating.score, 0);
                setSellerRating((sum / ratingData.length).toFixed(1));
              }
            }
          } catch (err) {
            console.error("Error fetching seller ratings:", err);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProduct();
  }, [id, currentUser]); // ✅ fără warning
  

  const toggleFavorite = async () => {
    if (!currentUser) {
      alert('Please log in to add favorites');
      return;
    }

    try {
      if (isFavorited) {
        // Remove from favorites
        await fetch('http://localhost:8080/api/favorites/remove', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: currentUser,
            productId: product.id
          })
        });
        
        setIsFavorited(false);
        
        // Also update localStorage for backward compatibility
        const favorites = JSON.parse(localStorage.getItem(userFavoritesKey)) || [];
        const updated = favorites.filter((item) => item.id !== product.id);
        localStorage.setItem(userFavoritesKey, JSON.stringify(updated));
      } else {
        // Add to favorites
        const response = await fetch('http://localhost:8080/api/favorites/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: currentUser,
            productId: product.id
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }
        
        setIsFavorited(true);
        
        // Also update localStorage for backward compatibility
        const favorites = JSON.parse(localStorage.getItem(userFavoritesKey)) || [];
        const updated = [...favorites, product];
        localStorage.setItem(userFavoritesKey, JSON.stringify(updated));
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorites: ' + error.message);
    }
  };

  const fetchMessages = async () => {
    if (!product || !currentUser) return;
    try {
      const response = await fetch(`http://localhost:8080/messages/product/${product.id}`);
      if (!response.ok) return;

      const data = await response.json();
      const filtered = data.filter(
        msg =>
          (msg.sender.id === currentUser || msg.receiver.id === currentUser) &&
          (msg.sender.id === product.user.id || msg.receiver.id === product.user.id)
      );
      setMessages(filtered);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      sender: { id: currentUser, username },
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

  // Image gallery functions
  const nextImage = () => {
    if (product?.imageUrls?.length > 1) {
      setSelectedImageIndex((prev) => 
        prev === product.imageUrls.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product?.imageUrls?.length > 1) {
      setSelectedImageIndex((prev) => 
        prev === 0 ? product.imageUrls.length - 1 : prev - 1
      );
    }
  };

  const selectImage = (index) => {
    setSelectedImageIndex(index);
  };

  const openLightbox = () => {
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  // Get formatted date
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="product-details-wrapper">
      <div className="product-details-container">
        <div className="back-button-container">
          <button 
            className="back-button"
            onClick={() => navigate(-1)}
          >
            <span>←</span>
            <span>Back to Results</span>
          </button>
        </div>
        
        <div className="product-details-layout">
          {/* Left Column - Image Gallery */}
          <div className="product-images-column">
            <div className="main-image-container">
              {product.imageUrls?.length > 0 ? (
                <>
                  <div className="main-image-wrapper" onClick={openLightbox}>
                    <img 
                      src={`http://localhost:8080${product.imageUrls[selectedImageIndex]}`} 
                      alt={product.title} 
                      className="main-product-image"
                    />
                    {product.imageUrls.length > 1 && (
                      <>
                        <button className="image-nav-btn prev-btn" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
                          ❮
                        </button>
                        <button className="image-nav-btn next-btn" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
                          ❯
                        </button>
                        <div className="image-counter">
                          {selectedImageIndex + 1} / {product.imageUrls.length}
                        </div>
                      </>
                    )}
                    <div className="zoom-indicator">
                      <span>🔍</span>
                      <span>Click to zoom</span>
                    </div>
                  </div>
                  
                  {product.imageUrls.length > 1 && (
                    <div className="thumbnail-gallery">
                      {product.imageUrls.map((img, index) => (
                        <div 
                          key={index}
                          className={`thumbnail-wrapper ${index === selectedImageIndex ? 'active' : ''}`}
                          onClick={() => selectImage(index)}
                        >
                          <img 
                            src={`http://localhost:8080${img}`} 
                            alt={`${product.title} ${index + 1}`} 
                            className="thumbnail-image"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="no-image-placeholder">
                  <span>📷</span>
                  <p>No images available</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Product Information */}
          <div className="product-info-column">
            <div className="product-header">
              <h1 className="product-title">{product.title}</h1>
              <div className="price-and-date">
                <div className="product-price">€{product.price}</div>
                <div className="product-date">Listed {formatDate(product.createdAt)}</div>
              </div>
            </div>
            
            <div className="product-details-section">
              <h3>Product Details</h3>
              <div className="details-grid">
                <div className="detail-row">
                  <span className="detail-label">Category</span>
                  <span className="detail-value">{product.category}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Brand</span>
                  <span className="detail-value">{product.brand || "Not specified"}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Condition</span>
                  <span className="detail-value">{product.condition || "Not specified"}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Location</span>
                  <span className="detail-value">{product.location || "Not specified"}</span>
                </div>
              </div>
            </div>
            
            <div className="product-description-section">
              <h3>Description</h3>
              <div className="description-content">
                {product.description || "No description provided."}
              </div>
            </div>
            
            <div className="seller-section">
              <h3>Seller Information</h3>
              <div className="seller-card">
                <div className="seller-avatar">
                  <img 
                    src={getProfilePic(product.user)} 
                    alt={product.user.username}
                    className="seller-image"
                  />
                </div>
                <div className="seller-details">
                  <Link to={`/user/${product.user.id}`} className="seller-name">
                    {product.user.username}
                  </Link>
                  {sellerRating > 0 && (
                    <div className="seller-rating">
                      <span className="rating-stars">★</span>
                      <span className="rating-value">{sellerRating}</span>
                      <span className="rating-text">({sellerRating >= 4.5 ? 'Excellent' : sellerRating >= 4 ? 'Very Good' : sellerRating >= 3 ? 'Good' : 'Fair'} seller)</span>
                    </div>
                  )}
                  <div className="seller-stats">
                    <span>Active seller</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="action-section">
              {!isOwner ? (
                <div className="action-buttons">
                  <button 
                    className="btn-contact-seller primary-btn"
                    onClick={() => { setChatOpen(!chatOpen); fetchMessages(); }}
                  >
                    <span>💬</span>
                    <span>{chatOpen ? "Close Chat" : "Contact Seller"}</span>
                  </button>
                  <button 
                    className={`btn-favorite ${isFavorited ? 'favorited' : ''}`}
                    onClick={toggleFavorite}
                  >
                    <span>{isFavorited ? "❤️" : "🤍"}</span>
                    <span>{isFavorited ? "Remove from Favorites" : "Add to Favorites"}</span>
                  </button>
                </div>
              ) : (
                <div className="owner-notice">
                  <span>🛠️</span>
                  <span>This is your product listing</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              ✕
            </button>
            <img 
              src={`http://localhost:8080${product.imageUrls[selectedImageIndex]}`} 
              alt={product.title} 
              className="lightbox-image"
            />
            {product.imageUrls.length > 1 && (
              <>
                <button className="lightbox-nav-btn prev-btn" onClick={prevImage}>
                  ❮
                </button>
                <button className="lightbox-nav-btn next-btn" onClick={nextImage}>
                  ❯
                </button>
                <div className="lightbox-counter">
                  {selectedImageIndex + 1} / {product.imageUrls.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Chat Interface */}
      {chatOpen && (
        <div className="chat-overlay">
          <div className="chat-container">
            <div className="chat-header">
              <div className="chat-title">
                <img 
                  src={getProfilePic(product.user)} 
                  alt={product.user.username}
                  className="chat-avatar"
                />
                <div>
                  <h4>Chat with {product.user.username}</h4>
                  <span className="chat-product-title">About: {product.title}</span>
                </div>
              </div>
              <button 
                className="chat-close"
                onClick={() => setChatOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="chat-messages">
              {messages.length > 0 ? (
                messages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`message ${msg.sender.id === currentUser ? 'sent' : 'received'}`}
                  >
                    <img
                      src={getProfilePic(msg.sender)}
                      alt={msg.sender.username}
                      className="message-avatar"
                    />
                    <div className="message-content">
                      <div className="message-text">{msg.content}</div>
                      <div className="message-time">
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-messages">
                  <div className="no-messages-icon">💬</div>
                  <p>Start the conversation about this product!</p>
                  <span>Be polite and ask relevant questions</span>
                </div>
              )}
            </div>
            <div className="chat-input-container">
              <div className="chat-input">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button 
                  onClick={sendMessage}
                  className="send-button"
                  disabled={!newMessage.trim()}
                >
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
