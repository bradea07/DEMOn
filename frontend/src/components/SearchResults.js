import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("query");

  useEffect(() => {
    if (searchTerm) {
      axios
        .get(`http://localhost:8080/api/products/search?keyword=${searchTerm}`)
        .then((response) => {
          setResults(response.data);
          setError("");
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
          setError("❌ No products found.");
        });
    }
  }, [searchTerm]);

  return (
    <div>
      <h2>Search Results for "{searchTerm}"</h2>

      {error && <p>{error}</p>}

      <ul>
        {results.map((product) => (
          <li key={product.id}>
            <Link to={`/product/${product.id}`}>
              <strong>{product.title}</strong> - {product.price} USD
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
