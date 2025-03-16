import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        setError("");
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
        setError("❌ Product not found.");
      });
  }, [id]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!product) return <p>Loading...</p>;

  return (
    <div>
      <h2>{product.title}</h2>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Price:</strong> {product.price} USD</p>
      <p><strong>Brand:</strong> {product.brand}</p>
      <p><strong>Condition:</strong> {product.productCondition}</p>
      {/* ✅ Display Image if Available */}
      {product.image_url ? (
        <img src={product.image_url} alt={product.title} width="200" />
      ) : (
        <p>No image available</p>
      )}
    </div>
  );
};

export default ProductDetails;
