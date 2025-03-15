import React, { useState } from "react";
import { createProduct } from "../services/productService"; // ✅ Correct Path




const AddProduct = () => {
  const [product, setProduct] = useState({ name: "", price: "" });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createProduct(product)
      .then(() => {
        alert("Product added successfully!");
        setProduct({ name: "", price: "" });
      })
      .catch((error) => console.error("Error adding product:", error));
  };

  return (
    <div>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Product Name" value={product.name} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" value={product.price} onChange={handleChange} required />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
