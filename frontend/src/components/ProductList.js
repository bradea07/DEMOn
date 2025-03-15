import React, { useEffect, useState } from "react";
import { getAllProducts } from "../services/productService"; // ✅ Fix this import

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAllProducts()
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  return (
    <div>
      <h2>Product List</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - {product.price} USD
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
