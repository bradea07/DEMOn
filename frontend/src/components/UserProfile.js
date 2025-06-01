import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "../Styles/UserProfile.css";

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Rating form state
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [ratingValue, setRatingValue] = useState(5);
  const [ratingComment, setRatingComment] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingError, setRatingError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [hasRated, setHasRated] = useState(false);
  const [existingRating, setExistingRating] = useState(null);

  // Get current logged in user info only once when component mounts
  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      try {
        setCurrentUser(JSON.parse(userJson));
      } catch (err) {
        console.error("Error parsing user data from localStorage:", err);
      }
    }
  }, []); // Empty dependency array means this runs once on mount
  
  // Fetch user data, products, and ratings
  useEffect(() => {
    console.log("UserProfile component mounted with userId:", userId);
    
    const fetchUserData = async () => {
      try {
        // First try to fetch user data
        try {
          const userResponse = await axios.get(`http://localhost:8080/api/profile/${userId}`);
          console.log("User data fetched successfully:", userResponse.data);
          setUser(userResponse.data);
        } catch (userErr) {
          console.error("Error fetching user profile:", userErr);
          setError("User profile could not be loaded. The user may not exist.");
          setLoading(false);
          return; // Exit early if we can't get basic user data
        }
        
        // Fetch user's products
        try {
          const productsResponse = await axios.get(`http://localhost:8080/api/products/user/${userId}`);
          console.log("Products fetched successfully:", productsResponse.data);
          setProducts(productsResponse.data);
        } catch (productErr) {
          console.error("Error fetching user products:", productErr);
          setProducts([]); // Use empty array if endpoint fails
        }
        
        // Fetch user ratings - handle gracefully if endpoint doesn't exist
        try {
          const ratingsResponse = await axios.get(`http://localhost:8080/api/ratings/user/${userId}`);
          console.log("Ratings fetched successfully:", ratingsResponse.data);
          setRatings(ratingsResponse.data);
        } catch (ratingErr) {
          console.log("Rating endpoint not available, using empty ratings");
          setRatings([]); // Use empty array if endpoint doesn't exist
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error in fetchUserData:", err);
        setError("Failed to load user profile data. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [userId]); // Only re-run when userId changes

  // This effect runs when both currentUser and ratings are available
  // It determines if the current user has already rated the profile
  useEffect(() => {
    if (currentUser && ratings.length > 0) {
      const userRating = ratings.find(
        rating => rating.reviewerId === currentUser.id
      );
      
      if (userRating) {
        setHasRated(true);
        setExistingRating(userRating);
        
        // Pre-populate form with existing rating data
        setRatingValue(userRating.score);
        setRatingComment(userRating.comment);
      } else {
        setHasRated(false);
        setExistingRating(null);
      }
    }
  }, [currentUser, ratings]); // This dependency won't cause an infinite loop
  
  // Calculate average rating
  const calculateAverageRating = () => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((total, rating) => total + rating.score, 0);
    return (sum / ratings.length).toFixed(1);
  };

  // Render user products
  const renderProducts = () => {
    if (products.length === 0) {
      return <p className="no-items">This user hasn't listed any products yet.</p>;
    }

    return (
      <div className="user-products-grid">
        {products.map((product) => (
          <div key={product.id} className="user-product-card">
            <div className="user-product-image-container">
              {product.imageUrls && product.imageUrls.length > 0 ? (
                <img
                  src={`http://localhost:8080${product.imageUrls[0]}`}
                  alt={product.title}
                  className="user-product-image"
                />
              ) : (
                <div className="no-image-placeholder">
                  <i className="fas fa-image"></i>
                  <span>No image available</span>
                </div>
              )}
            </div>
            <div className="user-product-details">
              <h3 className="user-product-title">{product.title}</h3>
              <p className="user-product-price">${product.price}</p>
              <Link to={`/product/${product.id}`} className="view-product-btn">
                View Product
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render user ratings and comments
  const renderRatings = () => {
    if (ratings.length === 0) {
      return <p className="no-items">This user has no ratings yet.</p>;
    }

    return (
      <div className="user-ratings-list">
        {ratings.map((rating) => (
          <div key={rating.id} className="rating-card">
            <div className="rating-header">
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < rating.score ? "star filled" : "star"}>
                    ★
                  </span>
                ))}
              </div>
              <span className="rating-date">
                {new Date(rating.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="rating-comment">{rating.comment}</p>
            <p className="rating-author">
              By: {rating.reviewer ? rating.reviewer.username : "Anonymous"}
            </p>
          </div>
        ))}
      </div>
    );
  };
  
  // Render My Store section
  const renderMyStore = () => {
    return (
      <div className="my-store-container">
        <div className="store-header">
          <h3>My Store Management</h3>
          <p>Manage your products and track your sales</p>
        </div>
        
        <div className="store-stats">
          <div className="stat-card">
            <span className="stat-number">{products.length}</span>
            <span className="stat-label">Active Listings</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{ratings.length}</span>
            <span className="stat-label">Reviews</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{calculateAverageRating()}</span>
            <span className="stat-label">Rating</span>
          </div>
        </div>
        
        <div className="store-actions">
          <Link to="/add-product" className="store-action-btn">
            <i className="fas fa-plus-circle"></i> Add New Product
          </Link>
          <Link to="/my-profile" className="store-action-btn">
            <i className="fas fa-list"></i> Manage Listings
          </Link>
          <Link to="/settings" className="store-action-btn">
            <i className="fas fa-cog"></i> Store Settings
          </Link>
        </div>
      </div>
    );
  };

  // Handle rating submission
  const submitRating = async (e) => {
    e.preventDefault();
    
    if (!currentUser || !currentUser.id) {
      setRatingError("You must be logged in to leave a rating");
      return;
    }
    
    if (currentUser.id.toString() === userId) {
      setRatingError("You cannot rate yourself");
      return;
    }
    
    if (!ratingComment.trim()) {
      setRatingError("Please add a comment with your rating");
      return;
    }
    
    setSubmittingRating(true);
    setRatingError("");
    
    try {
      // If user already rated, prevent submitting again
      if (hasRated) {
        setRatingError("You have already rated this user and cannot modify your rating.");
        return;
      }
      
      const ratingData = {
        sellerId: parseInt(userId),
        reviewerId: currentUser.id,
        raterId: currentUser.id,
        score: ratingValue,
        comment: ratingComment
      };
      
      const response = await axios.post("http://localhost:8080/api/ratings", ratingData);
      
      // Add the new rating to the existing ratings
      setRatings([...ratings, response.data]);
      
      // Update state to show user has now rated
      setHasRated(true);
      
      // Save the existing rating data for future edits
      setExistingRating(response.data);
      
      // Reset form
      setShowRatingForm(false);
      
      // Switch to ratings tab to show the new rating
      setActiveTab("ratings");
      
    } catch (err) {
      console.error("Error submitting rating:", err);
      if (err.response && err.response.status === 400) {
        // If backend returns a 400 Bad Request, display the specific error message
        setRatingError(err.response.data || "You have already rated this user.");
      } else {
        // Generic error for other issues
        setRatingError("Failed to submit rating. Please try again.");
      }
    } finally {
      setSubmittingRating(false);
    }
  };
  
  // Render rating form
  const renderRatingForm = () => {
    if (!currentUser) {
      return <p className="login-to-rate">Please log in to leave a rating</p>;
    }
    
    if (currentUser.id.toString() === userId) {
      return null; // Don't show rating form for own profile
    }
    
    if (hasRated) {
      return <p className="already-rated">You have already rated this user.</p>;
    }
    
    return (
      <div className="rating-form-container">
        {!showRatingForm ? (
          <button 
            className="show-rating-form-btn" 
            onClick={() => setShowRatingForm(true)}
          >
            Leave a Rating
          </button>
        ) : (
          <form className="rating-form" onSubmit={submitRating}>
            <h3>Rate this user</h3>
            
            <div className="rating-stars-input">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`star-input ${i < ratingValue ? "filled" : ""}`}
                  onClick={() => setRatingValue(i + 1)}
                >
                  ★
                </span>
              ))}
              <span className="rating-value-display">{ratingValue}/5</span>
            </div>
            
            <textarea
              className="rating-comment-input"
              placeholder="Write your review here..."
              value={ratingComment}
              onChange={(e) => setRatingComment(e.target.value)}
              rows={4}
              required
            />
            
            {ratingError && <p className="rating-error">{ratingError}</p>}
            
            <div className="rating-form-actions">
              <button 
                type="button" 
                className="cancel-rating-btn"
                onClick={() => {
                  setShowRatingForm(false);
                  setRatingError("");
                  setRatingComment("");
                  setRatingValue(5);
                }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-rating-btn"
                disabled={submittingRating}
              >
                {submittingRating ? "Submitting..." : "Submit Rating"}
              </button>
            </div>
          </form>
        )}
      </div>
    );
  };
  
  if (loading) {
    return <div className="loading">Loading user profile...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="user-profile-container">
      {user && (
        <>
          <div className="user-profile-header">
            <div className="user-avatar">
              {user.profilePic ? (
                <img
                  src={user.profilePic.startsWith('http') ? user.profilePic : `http://localhost:8080${user.profilePic}`}
                  alt={`${user.username}'s profile`}
                />
              ) : (
                <div className="default-avatar">{user.username ? user.username.charAt(0) : '?'}</div>
              )}
            </div>
            <div className="user-info">
              <h2>{user.username || 'Unknown User'}</h2>
              <p className="user-location">{user.city || "Location not specified"}</p>
              <div className="user-rating">
                <span className="rating-value">{calculateAverageRating()}</span>
                <div className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={i < Math.round(calculateAverageRating()) ? "star filled" : "star"}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="rating-count">({ratings.length} ratings)</span>
              </div>
              <p className="member-since">
                Member since: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          <div className="user-profile-tabs">
            <button
              className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
              onClick={() => setActiveTab("products")}
            >
              Products ({products.length})
            </button>
            <button
              className={`tab-btn ${activeTab === "ratings" ? "active" : ""}`}
              onClick={() => setActiveTab("ratings")}
            >
              Ratings & Comments ({ratings.length})
            </button>
            {currentUser && currentUser.id === parseInt(userId) && (
              <button
                className={`tab-btn ${activeTab === "myStore" ? "active" : ""}`}
                onClick={() => setActiveTab("myStore")}
              >
                My Store
              </button>
            )}
          </div>

          <div className="user-profile-content">
            {activeTab === "products" ? renderProducts() : 
             activeTab === "ratings" ? (
              <>
                {renderRatingForm()}
                {renderRatings()}
              </>
             ) : renderMyStore()}
          </div>

          {/* Rating form - only visible to the current user */}
          {currentUser && currentUser.id === userId && (
            <div className="rating-form-container">
              <h3>Your Rating</h3>
              <form onSubmit={submitRating} className="rating-form">
                <div className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={i < ratingValue ? "star filled" : "star"}
                      onClick={() => setRatingValue(i + 1)}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <textarea
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  placeholder="Leave a comment about this user..."
                  className="rating-comment"
                />
                {ratingError && <p className="error-message">{ratingError}</p>}
                <button
                  type="submit"
                  className="submit-rating-btn"
                  disabled={submittingRating}
                >
                  {submittingRating ? "Submitting..." : "Submit Rating"}
                </button>
              </form>
            </div>
          )}
        </>
      )}
      {!user && !loading && (
        <div className="error">User not found or data missing.</div>
      )}
    </div>
  );
};

export default UserProfile;