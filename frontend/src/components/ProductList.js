import React, { useState } from "react";
import { getAllProducts } from "../services/productService";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const fetchProducts = () => {
    getAllProducts()
      .then((response) => {
        setProducts(response.data);
        setLoaded(true);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  };

  return (
    <div>
      <h2>Product List</h2>
      {!loaded && <button onClick={fetchProducts}>Load Products</button>}
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
