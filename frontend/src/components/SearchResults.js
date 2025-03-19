import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import "../SearchResults.css";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

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

  // ✅ Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = results.slice(indexOfFirstProduct, indexOfLastProduct);

  const nextPage = () => {
    if (indexOfLastProduct < results.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="search-results-container">
      <h2 className="search-results-title">Search Results for "{searchTerm}"</h2>

      {error && <p className="search-error">{error}</p>}

      {results.length > 0 && (
        <div className="search-results-box">
          {/* ✅ First Product (Now Properly Positioned Like Other Products) */}
          {results[0] && (
            <div className="product-card">
              {/* ✅ Extract First Image Correctly */}
              {results[0]?.images && results[0]?.images.length > 0 ? (
                <img
                  src={`http://localhost:8080/uploads/${results[0].images[0]}`} // Fixing URL
                  alt={results[0].title}
                  className="product-image"
                />
              ) : (
                <p className="no-image">No image available</p>
              )}
              <p className="product-title">{results[0]?.title}</p>
              <p className="product-price">{results[0]?.price} USD</p>
              <Link to={`/product/${results[0]?.id}`} className="view-product-btn">
                View Product
              </Link>
            </div>
          )}

          {/* ✅ Scrollable List of Similar Products */}
          <div className="products-list-container">
            {currentProducts.slice(1).map((product) => (
              <div key={product.id} className="product-card">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={`http://localhost:8080/uploads/${product.images[0]}`} // Fixing URL
                    alt={product.title}
                    className="product-image"
                  />
                ) : (
                  <p className="no-image">No image available</p>
                )}
                <p className="product-title">{product.title}</p>
                <p className="product-price">{product.price} USD</p>
                <Link to={`/product/${product.id}`} className="view-product-btn">
                  View
                </Link>
              </div>
            ))}
          </div>

          {/* ✅ Pagination Controls */}
          {results.length > productsPerPage && (
            <div className="pagination">
              <button onClick={prevPage} disabled={currentPage === 1}>
                Previous
              </button>
              <button onClick={nextPage} disabled={indexOfLastProduct >= results.length}>
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
