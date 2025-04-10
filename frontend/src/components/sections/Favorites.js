import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const Favorites = () => {
  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const userKey = `favorites_${loggedInUser?.id}`;
  const [favorites, setFavorites] = useState([]);
  const initialized = useRef(false);

  useEffect(() => {
    const userKey = `favorites_${loggedInUser?.id}`;
    if (initialized.current) return;
    initialized.current = true;
  
    const rawFavorites = JSON.parse(localStorage.getItem(userKey)) || [];
    setFavorites(rawFavorites);
  }, [loggedInUser]);
  

  const removeFavorite = (id) => {
    const updated = favorites.filter((item) => item.id !== id);
    localStorage.setItem(userKey, JSON.stringify(updated));
    setFavorites(updated);
  };

  const checkAndGoToProduct = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/products/${id}`);
      if (!res.ok) throw new Error();
      navigate(`/product/${id}`);
    } catch {
      alert("⚠️ Acest anunț nu mai este disponibil.");
    }
  };

  return (
    <div>
      <h3>Favorites</h3>
      {favorites.length === 0 ? (
        <p>No favorite products yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {favorites.map((item) => (
            <li key={item.id} style={{ marginBottom: "20px" }}>
              <strong>{item.title}</strong>
              <div style={{ marginTop: "8px", display: "flex", gap: "10px" }}>
                <button
                  onClick={() => checkAndGoToProduct(item.id)}
                  style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    padding: "6px 12px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  ✅ Vezi produs
                </button>
                <button
                  onClick={() => removeFavorite(item.id)}
                  style={{
                    backgroundColor: "#f44336",
                    color: "white",
                    padding: "6px 12px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  💔 Remove
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
