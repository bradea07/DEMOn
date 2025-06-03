import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Styles/ProductDetailsNew.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State variables
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [sellerRating, setSellerRating] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // User data
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const currentUser = loggedInUser?.id;
  const isOwner = product?.user?.id === currentUser;
  const userFavoritesKey = `favorites_${currentUser}`;

  // Helper function to get profile picture with fallback
  const getProfilePic = (user) => {
    if (!user || !user.profilePic || user.profilePic.trim() === "") {
      return "/default-avatar.jpg";
    }
    return user.profilePic.startsWith("http") ? user.profilePic : `http://localhost:8080${user.profilePic}`;
  };

  // Load product data
  useEffect(() => {
    const fetchProduct = async () => {
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
            console.error("Error fetching seller rating:", err);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, currentUser, userFavoritesKey]);

  // Toggle favorite status
  const toggleFavorite = async () => {
    if (!currentUser) {
      alert("Please log in to save favorites");
      return;
    }

    try {
      if (isFavorited) {
        // Remove from favorites
        const response = await fetch(`http://localhost:8080/api/favorites/remove/${currentUser}/${product.id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setIsFavorited(false);
          // Update localStorage as fallback
          const storedFavorites = JSON.parse(localStorage.getItem(userFavoritesKey)) || [];
          const updatedFavorites = storedFavorites.filter(fav => fav.id !== product.id);
          localStorage.setItem(userFavoritesKey, JSON.stringify(updatedFavorites));
        }
      } else {
        // Add to favorites
        const favoriteData = {
          userId: currentUser,
          productId: product.id,
          productTitle: product.title,
          productPrice: product.price,
          productImageUrl: product.imageUrls?.[0] || null
        };

        const response = await fetch('http://localhost:8080/api/favorites/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(favoriteData)
        });

        if (response.ok) {
          setIsFavorited(true);
          // Update localStorage as fallback
          const storedFavorites = JSON.parse(localStorage.getItem(userFavoritesKey)) || [];
          storedFavorites.push({
            id: product.id,
            title: product.title,
            price: product.price,
            imageUrl: product.imageUrls?.[0] || null
          });
          localStorage.setItem(userFavoritesKey, JSON.stringify(storedFavorites));
        }
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      alert("Failed to update favorites");
    }
  };

  // Handle contact seller - navigate to chats
  const handleContactSeller = () => {
    if (!currentUser) {
      alert("Please log in to contact the seller");
      return;
    }

    if (isOwner) {
      return;
    }

    // Navigate to chats with seller and product information
    navigate("/chats", { 
      state: { 
        receiverId: product.user.id,
        productId: product.id,
        productTitle: product.title,
        sellerUsername: product.user.username
      } 
    });
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

  if (loading) return (
    <div className="product-page-wrapper">
      <div className="product-page-container">
        <div className="product-page-loading">Loading product details...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="product-page-wrapper">
      <div className="product-page-container">
        <div className="product-page-error">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="product-page-wrapper">
      <div className="product-page-container">
        {/* Back Button */}
        <div className="product-page-back-button-container">
          <button 
            className="product-page-back-button"
            onClick={() => navigate(-1)}
          >
            <span>←</span>
            <span>Back to Results</span>
          </button>
        </div>

        {/* Main Product Layout */}
        <div className="product-page-layout">
          {/* Left Column - Image Gallery */}
          <div className="product-page-images-column">
            <div className="product-page-main-image-container">
              {product.imageUrls?.length > 0 ? (
                <>
                  <div className="product-page-main-image-wrapper" onClick={openLightbox}>
                    <img 
                      src={`http://localhost:8080${product.imageUrls[selectedImageIndex]}`} 
                      alt={product.title} 
                      className="product-page-main-image"
                    />
                    {product.imageUrls.length > 1 && (
                      <>
                        <button className="product-page-image-nav-btn product-page-prev-btn" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
                          ❮
                        </button>
                        <button className="product-page-image-nav-btn product-page-next-btn" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
                          ❯
                        </button>
                        <div className="product-page-image-counter">
                          {selectedImageIndex + 1} / {product.imageUrls.length}
                        </div>
                      </>
                    )}
                    <div className="product-page-zoom-indicator">
                      <span>🔍</span>
                      <span>Click to zoom</span>
                    </div>
                  </div>
                  
                  {product.imageUrls.length > 1 && (
                    <div className="product-page-thumbnail-gallery">
                      {product.imageUrls.map((img, index) => (
                        <div 
                          key={index}
                          className={`product-page-thumbnail-wrapper ${index === selectedImageIndex ? 'active' : ''}`}
                          onClick={() => selectImage(index)}
                        >
                          <img 
                            src={`http://localhost:8080${img}`} 
                            alt={`${product.title} ${index + 1}`} 
                            className="product-page-thumbnail-image"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="product-page-no-image-placeholder">
                  <span>📷</span>
                  <p>No images available</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Product Information */}
          <div className="product-page-info-column">
            <div className="product-page-header">
              <h1 className="product-page-title">{product.title}</h1>
              <div className="product-page-price-and-date">
                <div className="product-page-price">€{product.price}</div>
                <div className="product-page-date">Listed {formatDate(product.createdAt)}</div>
              </div>
            </div>
            
            <div className="product-page-details-section">
              <h3>Product Details</h3>
              <div className="product-page-details-grid">
                <div className="product-page-detail-row">
                  <span className="product-page-detail-label">Category</span>
                  <span className="product-page-detail-value">{product.category}</span>
                </div>
                <div className="product-page-detail-row">
                  <span className="product-page-detail-label">Brand</span>
                  <span className="product-page-detail-value">{product.brand || "Not specified"}</span>
                </div>
                <div className="product-page-detail-row">
                  <span className="product-page-detail-label">Condition</span>
                  <span className="product-page-detail-value">{product.condition || "Not specified"}</span>
                </div>
                <div className="product-page-detail-row">
                  <span className="product-page-detail-label">Location</span>
                  <span className="product-page-detail-value">{product.location || "Not specified"}</span>
                </div>
              </div>
            </div>
            
            <div className="product-page-description-section">
              <h3>Description</h3>
              <div className="product-page-description-content">
                {product.description || "No description provided."}
              </div>
            </div>
            
            <div className="product-page-seller-section">
              <h3>Seller Information</h3>
              <div className="product-page-seller-card">
                <div className="product-page-seller-avatar">
                  <img 
                    src={getProfilePic(product.user)} 
                    alt={product.user.username}
                    className="product-page-seller-image"
                  />
                </div>
                <div className="product-page-seller-details">
                  <a href={`/user/${product.user.id}`} className="product-page-seller-name">
                    {product.user.username}
                  </a>
                  {sellerRating > 0 && (
                    <div className="product-page-seller-rating">
                      <span className="product-page-rating-stars">★</span>
                      <span className="product-page-rating-value">{sellerRating}</span>
                      <span className="product-page-rating-text">({sellerRating >= 4.5 ? 'Excellent' : sellerRating >= 4 ? 'Very Good' : sellerRating >= 3 ? 'Good' : 'Fair'} seller)</span>
                    </div>
                  )}
                  <div className="product-page-seller-stats">
                    <span>Active seller</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="product-page-action-section">
              {!isOwner ? (
                <div className="product-page-action-buttons">
                  <button 
                    className="product-page-contact-seller-btn product-page-primary-btn"
                    onClick={handleContactSeller}
                  >
                    <span>💬</span>
                    <span>Contact Seller</span>
                  </button>
                  <button 
                    className={`product-page-favorite-btn ${isFavorited ? 'favorited' : ''}`}
                    onClick={toggleFavorite}
                  >
                    <span>{isFavorited ? "❤️" : "🤍"}</span>
                    <span>{isFavorited ? "Remove from Favorites" : "Add to Favorites"}</span>
                  </button>
                </div>
              ) : (
                <div className="product-page-owner-notice">
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
        <div className="product-page-lightbox-overlay" onClick={closeLightbox}>
          <div className="product-page-lightbox-container" onClick={(e) => e.stopPropagation()}>
            <button className="product-page-lightbox-close" onClick={closeLightbox}>
              ✕
            </button>
            <img 
              src={`http://localhost:8080${product.imageUrls[selectedImageIndex]}`} 
              alt={product.title} 
              className="product-page-lightbox-image"
            />
            {product.imageUrls.length > 1 && (
              <>
                <button className="product-page-lightbox-nav-btn product-page-lightbox-prev-btn" onClick={prevImage}>
                  ❮
                </button>
                <button className="product-page-lightbox-nav-btn product-page-lightbox-next-btn" onClick={nextImage}>
                  ❯
                </button>
                <div className="product-page-lightbox-counter">
                  {selectedImageIndex + 1} / {product.imageUrls.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
