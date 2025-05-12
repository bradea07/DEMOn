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
  const category = queryParams.get("category");
  const condition = queryParams.get("condition");
  const location_param = queryParams.get("location");
  const brand = queryParams.get("brand");
  const minPrice = queryParams.get("minPrice");
  const maxPrice = queryParams.get("maxPrice");

  useEffect(() => {
    // Build the URL with query parameters
    let url = 'http://localhost:8080/api/products/search-with-filters?';
    let params = new URLSearchParams();
    
    if (searchTerm) params.append('query', searchTerm);
    if (category) params.append('category', category);
    if (condition) params.append('condition', condition);
    if (location_param) params.append('location', location_param);
    if (brand) params.append('brand', brand);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    
    axios
      .get(`http://localhost:8080/api/products/search-with-filters?${params.toString()}`)
      .then((response) => {
        setResults(response.data);
        setError(response.data.length === 0 ? "❌ No products found." : "");
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
        setError("❌ Error fetching search results.");
      });
  }, [searchTerm, category, condition, location_param, brand, minPrice, maxPrice]);

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
  // Function to generate a title based on filters applied
  const generateSearchTitle = () => {
    let title = "Search Results";
    
    if (searchTerm) {
      title += ` for "${searchTerm}"`;
    }
    
    let appliedFilters = [];
    if (category) appliedFilters.push(`Category: ${category}`);
    if (condition) appliedFilters.push(`Condition: ${condition}`);
    if (location_param) appliedFilters.push(`Location: ${location_param}`);
    if (brand) appliedFilters.push(`Brand: ${brand}`);
    if (minPrice) appliedFilters.push(`Min Price: ${minPrice}`);
    if (maxPrice) appliedFilters.push(`Max Price: ${maxPrice}`);
    
    if (appliedFilters.length > 0) {
      title += ` with ${appliedFilters.join(', ')}`;
    }
    
    return title;
  };

  return (
    <div className="search-results-container">
      <h2 className="search-results-title">{generateSearchTitle()}</h2>

      {results.length === 0 ? (
        <p className="search-error">No products match your search criteria. Try adjusting your filters.</p>
      ) : (
        <div className="search-results-box">          {/* ✅ First Product (Now Properly Positioned Like Other Products) */}
          {results[0] && (
            <div className="product-card">
              {/* ✅ Extract First Image Correctly */}
              {results[0]?.imageUrls && results[0]?.imageUrls.length > 0 ? (
                <img
                  src={`http://localhost:8080${results[0].imageUrls[0]}`} // Correct URL format
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
                {product.imageUrls && product.imageUrls.length > 0 ? (
                  <img
                    src={`http://localhost:8080${product.imageUrls[0]}`} // Correct URL format
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
            ))}          </div>

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
