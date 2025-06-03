import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../SearchResults.css";
import "../RecommendedProducts.css";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const productsPerPage = 8; // Changed to 8 products per page to match recommendations
  const navigate = useNavigate();

  // Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    condition: "",
    location: "",
    brand: "",
  });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Categories list
  const categories = [
    "Electronics", "Home & Furniture", "Vehicles", "Real Estate", "Jobs",
    "Services", "Fashion & Beauty", "Hobbies, Sports & Kids", "Agriculture",
    "Industrial Equipment", "Pets", "Education & Books", "Food & Drinks",
    "Events & Tickets", "Health & Personal Care",
  ];

  // Product condition options
  const conditionOptions = [
    "New", "Used - Like New", "Used - Good", "Used - Acceptable"
  ];

  // Initialize states from URL parameters
  useEffect(() => {
    setSearchTerm(queryParams.get("query") || "");
    setFilters({
      category: queryParams.get("category") || "",
      condition: queryParams.get("condition") || "",
      location: queryParams.get("location") || "",
      brand: queryParams.get("brand") || "",
      minPrice: queryParams.get("minPrice") || "",
      maxPrice: queryParams.get("maxPrice") || "",
    });
  }, [location.search]);

  // Fetch search results when URL parameters change
  useEffect(() => {
    setLoading(true);
    let params = new URLSearchParams();
    
    if (queryParams.get("query")) params.append('query', queryParams.get("query"));
    if (queryParams.get("category")) params.append('category', queryParams.get("category"));
    if (queryParams.get("condition")) params.append('condition', queryParams.get("condition"));
    if (queryParams.get("location")) params.append('location', queryParams.get("location"));
    if (queryParams.get("brand")) params.append('brand', queryParams.get("brand"));
    if (queryParams.get("minPrice")) params.append('minPrice', queryParams.get("minPrice"));
    if (queryParams.get("maxPrice")) params.append('maxPrice', queryParams.get("maxPrice"));
    
    axios
      .get(`http://localhost:8080/api/products/search-with-filters?${params.toString()}`)
      .then((response) => {
        setResults(response.data);
        setError(response.data.length === 0 ? "No products found." : "");
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
        setError("Error fetching search results.");
        setLoading(false);
      });
  }, [location.search]);

  // Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = results.slice(indexOfFirstProduct, indexOfLastProduct);

  const nextPage = () => {
    if (indexOfLastProduct < results.length) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();

    let searchParams = new URLSearchParams();

    // Fetch all products if search is empty
    if (!searchTerm.trim()) {
      searchParams.append("allProducts", "true");
    } else {
      searchParams.append("query", searchTerm);
    }

    // Add all active filters
    if (filters.category) searchParams.append("category", filters.category);
    if (filters.minPrice) searchParams.append("minPrice", filters.minPrice);
    if (filters.maxPrice) searchParams.append("maxPrice", filters.maxPrice);
    if (filters.condition) searchParams.append("condition", filters.condition);
    if (filters.location) searchParams.append("location", filters.location);
    if (filters.brand) searchParams.append("brand", filters.brand);

    navigate(`/search-results?${searchParams.toString()}`);
  };

  return (
    <div className="search-page-container">
      <div className="search-header">
      </div>
      <h2 className="search-title">Find What You're Looking For</h2>
      
      <div className="search-box">
        <form onSubmit={handleSearch}>
          <div className="search-bar">
            <input
              type="text"
              placeholder="What are you looking for?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              autoComplete="off"
            />
          </div>
          
          <div className="button-row">
            <button type="submit" className="search-button">
              <span>Search</span>
            </button>
            <button type="button" onClick={toggleFilters} className="filter-toggle-btn">
              <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
            </button>
          </div>

          {showFilters && (
            <div className="filters-container">
              <div className="filter-row">
                <div className="filter-group">
                  <label htmlFor="category">Category</label>
                  <select
                    name="category"
                    id="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="filter-select"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="condition">Condition</label>
                  <select
                    name="condition"
                    id="condition"
                    value={filters.condition}
                    onChange={handleFilterChange}
                    className="filter-select"
                  >
                    <option value="">Any Condition</option>
                    {conditionOptions.map((condition, index) => (
                      <option key={index} value={condition}>{condition}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="filter-row">
                <div className="filter-group">
                  <label htmlFor="minPrice">Min Price</label>
                  <input
                    type="number"
                    name="minPrice"
                    id="minPrice"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    min="0"
                    className="filter-input"
                  />
                </div>

                <div className="filter-group">
                  <label htmlFor="maxPrice">Max Price</label>
                  <input
                    type="number"
                    name="maxPrice"
                    id="maxPrice"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    min="0"
                    className="filter-input"
                  />
                </div>
              </div>

              <div className="filter-row">
                <div className="filter-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    placeholder="Enter location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="filter-input"
                  />
                </div>

                <div className="filter-group">
                  <label htmlFor="brand">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    id="brand"
                    placeholder="Enter brand"
                    value={filters.brand}
                    onChange={handleFilterChange}
                    className="filter-input"
                  />
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Loading / Empty / Product Grid */}
      {loading ? (
        <div className="recommendations-loading">Loading search results...</div>
      ) : results.length === 0 ? (
        <div className="no-results">
          <i className="fas fa-search"></i>
          <h3>No products found</h3>
          <p>
            We couldn't find any products matching your search criteria. Try
            adjusting your filters or search term.
          </p>
        </div>
      ) : (
        <div className="recommendations-container">
          <h3 className="recommendations-title">
            Search Results
            <span className="recommendations-subtitle">
              {results.length} products found
            </span>
          </h3>
          <div className="recommendations-grid">
            {currentProducts.map((product) => (
              <div key={product.id} className="recommendation-card">
                {product.imageUrls && product.imageUrls.length > 0 ? (
                  <img
                    src={`http://localhost:8080${product.imageUrls[0]}`}
                    alt={product.title}
                    className="recommendation-image"
                  />
                ) : (
                  <div className="no-recommendation-image">No image available</div>
                )}
                <div className="recommendation-details">
                  <h4 className="recommendation-title">{product.title}</h4>
                  <p className="recommendation-price">${product.price?.toFixed(2)}</p>
                  <Link to={`/product/${product.id}`} className="view-recommendation-btn">
                    View details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {results.length > productsPerPage && (
            <div className="search-pagination">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                &laquo; Previous
              </button>
              <div className="pagination-info">
                Page {currentPage} of{" "}
                {Math.ceil(results.length / productsPerPage)}
              </div>
              <button
                onClick={nextPage}
                disabled={indexOfLastProduct >= results.length}
                className="pagination-btn"
              >
                Next &raquo;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
