import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import "../RecommendedProducts.css";

// Cache pentru recomandări ca să evităm reîncărcarea între navigări
const recommendationsCache = {
  data: {},
  timestamp: {},
  CACHE_DURATION: 1000 * 60 * 1, // Reduced to 1 minute for more frequent updates
  forceRefresh: true // Flag to force refresh - start with true to force initial fetch
};

const RecommendedProducts = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // Add a refresh key for forcing updates
  const { currentUser } = useContext(AuthContext);  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!currentUser || !currentUser.id) {
        setLoading(false);
        console.warn("No current user or user ID found for recommendations");
        return;
      }

      const userId = currentUser.id;
      const now = Date.now();
      
      // Additional debug info about the current user
      console.log('Current user data:', {
        userId: userId,
        userIdType: typeof userId,
        currentUser: currentUser
      });
      
      // Log cache status for debugging
      console.log('Cache status:', {
        hasCachedData: !!recommendationsCache.data[userId],
        cacheTimestamp: recommendationsCache.timestamp[userId],
        cacheAge: recommendationsCache.timestamp[userId] ? now - recommendationsCache.timestamp[userId] : 'N/A',
        cacheDuration: recommendationsCache.CACHE_DURATION,
        forceRefresh: recommendationsCache.forceRefresh,
        isCacheValid: recommendationsCache.timestamp[userId] && 
                     (now - recommendationsCache.timestamp[userId] < recommendationsCache.CACHE_DURATION)
      });
      
      // Verifică dacă avem recomandări în cache și dacă sunt încă valide
      if (
        !recommendationsCache.forceRefresh && // Don't use cache if force refresh is true
        recommendationsCache.data[userId] && 
        recommendationsCache.timestamp[userId] && 
        now - recommendationsCache.timestamp[userId] < recommendationsCache.CACHE_DURATION &&
        recommendationsCache.data[userId].length === 8 // Asigură-te că avem exact 8 recomandări
      ) {
        // Folosește recomandările din cache
        console.log(`Using cached recommendations for user ID: ${userId}`);
        setRecommendations(recommendationsCache.data[userId]);
        setLoading(false);
        return;
      }
      
      // Reset force refresh flag
      recommendationsCache.forceRefresh = false;      try {
        setLoading(true);
        // Ensure userId is properly formatted - convert to number if it's a string
        const parsedUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;
        console.log(`Fetching recommendations for user ID: ${parsedUserId}`);
        const response = await axios.get(
          `http://localhost:8080/api/recommendations/${parsedUserId}`
        );
          if (response.data && Array.isArray(response.data)) {
          console.log(`Received ${response.data.length} recommendations`);
          
          // Verifică dacă avem exact 8 recomandări
          if (response.data.length === 8) {
            // Salvează recomandările în cache
            recommendationsCache.data[userId] = response.data;
            recommendationsCache.timestamp[userId] = now;
            
            setRecommendations(response.data);
          } else {
            console.warn(`Expected exactly 8 recommendations, but got ${response.data.length}`);
            
            // Still set the recommendations even if not exactly 8
            recommendationsCache.data[userId] = response.data;
            recommendationsCache.timestamp[userId] = now;
            setRecommendations(response.data);
          }
        } else {
          console.warn("Recommendations data is not an array:", response.data);
          setRecommendations([]);
        }      } catch (err) {
        console.error("Error fetching recommendations:", err);
        if (err.response) {
          console.error("Response data:", err.response.data);
          console.error("Response status:", err.response.status);
          
          // In case of 500 Internal Server Error, clear the cache to try again next time
          if (err.response.status === 500 && currentUser && currentUser.id) {
            console.log("Server error detected. Clearing recommendations cache for recovery.");
            delete recommendationsCache.data[currentUser.id];
            delete recommendationsCache.timestamp[currentUser.id];
          }
        }
        // Fail silently - don't show error to user, just don't display recommendations
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };    fetchRecommendations();
  }, [currentUser, refreshKey]); // Added refreshKey to dependencies to allow forced refresh
    // Function to manually refresh recommendations
  const handleRefresh = () => {
    console.log('Manually refreshing recommendations');
    // Clear all cache to ensure fresh data
    recommendationsCache.data = {};
    recommendationsCache.timestamp = {};
    recommendationsCache.forceRefresh = true;
    
    // Clear cache for current user specifically
    if (currentUser && currentUser.id) {
      console.log(`Clearing cache for user ID: ${currentUser.id}`);
      delete recommendationsCache.data[currentUser.id];
      delete recommendationsCache.timestamp[currentUser.id];
    }
    // Trigger re-fetch by updating refreshKey
    setRefreshKey(prevKey => prevKey + 1);
  };

  if (loading) {
    return <div className="recommendations-loading">Se încarcă recomandările...</div>;
  }
  if (!currentUser || recommendations.length === 0) {
    return null;
  }  return (
    <div className="recommendations-container">
      <h3 className="recommendations-title">
        Recommendations:
        <span className="recommendations-subtitle">
          Based on your search history and trending items
        </span>        <button 
          className="refresh-recommendations-btn" 
          onClick={handleRefresh} 
          title="Refresh recommendations"
        >
          Refresh Recommendations
        </button>
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
              <div className="no-recommendation-image">No image available</div>
            )}
            <div className="recommendation-details">              <h4 className="recommendation-title">{product.title}</h4>
              <p className="recommendation-price">${product.price?.toFixed(2)}</p>              <Link to={`/product/${product.id}`} className="view-recommendation-btn">
                View details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Exportăm această funcție pentru a putea fi apelată din alte componente
export const invalidateRecommendationsCache = (userId) => {
  if (userId) {
    delete recommendationsCache.data[userId];
    delete recommendationsCache.timestamp[userId];
    recommendationsCache.forceRefresh = true;
    console.log(`Invalidated recommendations cache for user ID: ${userId}`);
  } else {
    recommendationsCache.data = {};
    recommendationsCache.timestamp = {};
    recommendationsCache.forceRefresh = true;
    console.log('Invalidated all recommendations cache');
  }
  
  // Return true to indicate successful invalidation
  return true;
};

export default RecommendedProducts;
