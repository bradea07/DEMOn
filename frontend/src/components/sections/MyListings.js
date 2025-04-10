import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyListings = ({ userId }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:8080/api/products/user/${userId}`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to fetch products", err));
  }, [userId]);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/api/products/${id}`)
      .then(() => {
        setProducts(products.filter((product) => product.id !== id));
      })
      .catch((err) => console.error("Failed to delete product", err));
  };

  return (
    <div>
      <h3>{products.length > 0 ? "Your Listings" : "No listings yet."}</h3>
      <ul>
        {products.map((product) => (
          <li key={product.id} style={{ marginBottom: "10px" }}>
            <strong>{product.title}</strong>
            <div style={{ marginTop: "5px" }}>
              <button
                onClick={() => navigate(`/edit-product/${product.id}`)}
                style={{
                  marginRight: "8px",
                  backgroundColor: "#7bac08",
                  color: "white",
                  padding: "5px 10px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                style={{
                  backgroundColor: "#d9534f",
                  color: "white",
                  padding: "5px 10px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                🗑️ Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyListings;
