import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../Styles/MyStore.css";

const MyStore = ({ userId }) => {
  const [products, setProducts] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState("products"); // Can be "products" or "reviews"

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        // Fetch user's products
        const productsResponse = await axios.get(`http://localhost:8080/api/products/user/${userId}`);
        setProducts(productsResponse.data);
        
        // Fetch user's ratings
        try {
          const ratingsResponse = await axios.get(`http://localhost:8080/api/ratings/user/${userId}`);
          setRatings(ratingsResponse.data);
        } catch (err) {
          console.log("Rating endpoint not available, using empty ratings");
          setRatings([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching store data:", err);
        setError("Failed to load store data. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchStoreData();
  }, [userId]);
    // Calculate average rating
  const calculateAverageRating = () => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((total, rating) => total + rating.score, 0);
    return (sum / ratings.length).toFixed(1);
  };
  
  // Toggle between products and reviews view
  const toggleView = (view) => {
    setActiveView(view);
  };

  if (loading) {
    return <div className="loading">Loading store data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="my-store-container">      <div className="store-header">
        <h3>My Store Management</h3>
        <p>Online Manage Your Products Here</p>
      </div><div className="store-stats">
        <div 
          className="stat-card"
          onClick={() => toggleView("products")}
        >
          <span className="stat-number">{products.length}</span>
          <span className="stat-label">Active Listings</span>
        </div>
        <div 
          className="stat-card"
          onClick={() => toggleView("reviews")}
        >
          <span className="stat-number">{ratings.length}</span>
          <span className="stat-label">Reviews</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{calculateAverageRating()}</span>
          <span className="stat-label">Rating</span>
        </div>
      </div>
        <div className="store-actions">        <Link to="/add-product" className="store-action-btn">
          <i className="fas fa-plus-circle"></i> Add New Product
        </Link>
        <Link to="/my-profile" onClick={() => document.querySelector('button[data-section="MyListings"]')?.click()} className="store-action-btn">
          <i className="fas fa-list"></i> Manage Listings
        </Link>
      </div><div className="recent-activities">
        <h4>{activeView === "products" ? "Recent Activities" : "Your Reviews"}</h4>
        
        {activeView === "products" ? (
          // Products View
          products.length > 0 ? (
            <div className="recent-products">
              <h5>Your Latest Products</h5>
              <div className="recent-products-grid">
                {products.slice(0, 3).map((product) => (
                  <div key={product.id} className="recent-product-card">
                    {product.imageUrls && product.imageUrls.length > 0 ? (
                      <img
                        src={`http://localhost:8080${product.imageUrls[0]}`}
                        alt={product.title}
                        className="recent-product-image"
                      />
                    ) : (
                      <div className="no-image">No image</div>
                    )}                    <div className="recent-product-details">
                      <h6>{product.title}</h6>
                      <p className="recent-product-price">${product.price}</p>
                      <Link to={`/product/${product.id}`} className="view-product-btn">
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              {products.length > 3 && (
                <div className="view-all-products">
                  <Link to="/my-profile" onClick={() => document.querySelector('button[data-section="MyListings"]')?.click()} className="view-all-link">
                    View all {products.length} products
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <p className="no-items">You haven't listed any products yet.</p>
          )
        ) : (
          // Reviews View
          ratings.length > 0 ? (
            <div className="reviews-list">
              {ratings.map((rating) => (
                <div key={rating.id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <span className="reviewer-name">{rating.reviewerUsername || "Anonymous"}</span>
                      <span className="review-date">{new Date(rating.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="review-score">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={`star ${i < rating.score ? "filled" : ""}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="review-content">
                    <p>{rating.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-items">You haven't received any reviews yet.</p>
          )
        )}
      </div>
    </div>
  );
};

export default MyStore;
