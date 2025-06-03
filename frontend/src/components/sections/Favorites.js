import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

const Favorites = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !currentUser) return;
    initialized.current = true;
    
    fetchFavorites();
  }, [currentUser]);

  const fetchFavorites = async () => {
    if (!currentUser || !currentUser.id) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/api/favorites/user/${currentUser.id}`);
      setFavorites(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setError("Failed to load favorites");
      
      // Fallback to localStorage
      const userKey = `favorites_${currentUser.id}`;
      const localFavorites = JSON.parse(localStorage.getItem(userKey)) || [];
      setFavorites(localFavorites.map(fav => ({
        id: fav.id,
        productId: fav.id,
        productTitle: fav.title,
        productPrice: fav.price,
        productImageUrl: fav.imageUrls?.[0]
      })));
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId, productId) => {
    try {
      await axios.delete('http://localhost:8080/api/favorites/remove', {
        data: {
          userId: currentUser.id,
          productId: productId
        }
      });
      
      // Update state
      setFavorites(favorites.filter(fav => fav.id !== favoriteId));
      
      // Also update localStorage for consistency
      const userKey = `favorites_${currentUser.id}`;
      const localFavorites = JSON.parse(localStorage.getItem(userKey)) || [];
      const updated = localFavorites.filter(item => item.id !== productId);
      localStorage.setItem(userKey, JSON.stringify(updated));
      
    } catch (err) {
      console.error("Error removing favorite:", err);
      alert("Failed to remove from favorites. Please try again.");
    }
  };

  const checkAndGoToProduct = async (productId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/products/${productId}`);
      if (!res.ok) throw new Error();
      navigate(`/product/${productId}`);
    } catch {
      alert("⚠️ This product is no longer available.");
    }
  };

  if (!currentUser) {
    return (
      <div>
        <h3>Favorites</h3>
        <p>Please log in to view your favorites.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <h3>Favorites</h3>
        <p>Loading favorites...</p>
      </div>
    );
  }

  return (
    <div>
      <h3>My Favorites</h3>
      {error && (
        <div style={{ color: '#ff6b35', marginBottom: '15px', padding: '10px', background: '#fff3f0', borderRadius: '6px', border: '1px solid #ffe0d6' }}>
          {error} (showing local data)
        </div>
      )}
      {favorites.length === 0 ? (
        <div className="empty-state">
          <p>No favorite products yet.</p>
        </div>
      ) : (
        <ul>
          {favorites.map((item) => (
            <li key={item.id} className="item-card">
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                {item.productImageUrl && (
                  <img 
                    src={`http://localhost:8080${item.productImageUrl}`}
                    alt={item.productTitle}
                    className="item-card img"
                  />
                )}
                <div className="item-details">
                  <div className="item-title">{item.productTitle}</div>
                  {item.productPrice && (
                    <div className="item-price">
                      ${item.productPrice}
                    </div>
                  )}
                </div>
              </div>
              <div className="item-actions">
                <button
                  onClick={() => checkAndGoToProduct(item.productId)}
                >
                  View Product
                </button>
                <button
                  onClick={() => removeFavorite(item.id, item.productId)}
                  className="danger"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Favorites;
