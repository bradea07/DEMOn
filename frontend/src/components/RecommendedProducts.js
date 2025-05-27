import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import "../RecommendedProducts.css";

const RecommendedProducts = () => {  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);
  
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!currentUser || !currentUser.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log(`Fetching recommendations for user ID: ${currentUser.id}`);
        const response = await axios.get(
          `http://localhost:8080/api/recommendations/${currentUser.id}`
        );
        
        if (response.data && Array.isArray(response.data)) {
          console.log(`Received ${response.data.length} recommendations`);
          setRecommendations(response.data);
        } else {
          console.warn("Recommendations data is not an array:", response.data);
          setRecommendations([]);
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        if (err.response) {
          console.error("Response data:", err.response.data);
          console.error("Response status:", err.response.status);
        }
        // Fail silently - don't show error to user, just don't display recommendations
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentUser]);

  if (loading) {
    return <div className="recommendations-loading">Loading recommendations...</div>;
  }

  if (!currentUser || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="recommendations-container">
      <h3 className="recommendations-title">
        <span className="recommendations-icon">💡</span> Recommended for You
      </h3>
      <div className="recommendations-grid">
        {recommendations.map((product) => (
          <div key={product.id} className="recommendation-card">
            {product.imageUrls && product.imageUrls.length > 0 ? (
              <img
                src={`http://localhost:8080${product.imageUrls[0]}`}
                alt={product.title}
                className="recommendation-image"
              />
            ) : (
              <div className="no-recommendation-image">No image</div>
            )}
            <div className="recommendation-details">
              <h4 className="recommendation-title">{product.title}</h4>
              <p className="recommendation-price">{product.price} USD</p>
              <Link to={`/product/${product.id}`} className="view-recommendation-btn">
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;
