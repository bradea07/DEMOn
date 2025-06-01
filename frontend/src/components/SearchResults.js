import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../SearchResults.css";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const productsPerPage = 12; // Increased for better grid display
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
    
    // Add search term if provided
    if (searchTerm.trim()) {
      searchParams.append("query", searchTerm);
    }
    
    // Add filters if they have values
    if (filters.category) searchParams.append("category", filters.category);
    if (filters.minPrice) searchParams.append("minPrice", filters.minPrice);
    if (filters.maxPrice) searchParams.append("maxPrice", filters.maxPrice);
    if (filters.condition) searchParams.append("condition", filters.condition);
    if (filters.location) searchParams.append("location", filters.location);
    if (filters.brand) searchParams.append("brand", filters.brand);

    navigate(`/search-results?${searchParams.toString()}`);
  };

  // Function to generate a title based on filters applied
  const generateSearchTitle = () => {
    let title = "Search Results";
    
    if (searchTerm) {
      title += ` for "${searchTerm}"`;
    }
    
    let appliedFilters = [];
    if (filters.category) appliedFilters.push(`Category: ${filters.category}`);
    if (filters.condition) appliedFilters.push(`Condition: ${filters.condition}`);
    if (filters.location) appliedFilters.push(`Location: ${filters.location}`);
    if (filters.brand) appliedFilters.push(`Brand: ${filters.brand}`);
    if (filters.minPrice) appliedFilters.push(`Min Price: $${filters.minPrice}`);
    if (filters.maxPrice) appliedFilters.push(`Max Price: $${filters.maxPrice}`);
    
    if (appliedFilters.length > 0) {
      title += ` with ${appliedFilters.join(', ')}`;
    }
    
    return title;
  };

  // Generate a short description from the product description
  const getShortDescription = (description) => {
    if (!description) return "No description available";
    return description.length > 120 ? description.substring(0, 120) + "..." : description;
  };

 return (
  <div
    style={{
      backgroundImage: "url('/background3.png')",
      backgroundSize: "cover",
      backgroundAttachment: "fixed",
      backgroundPosition: "center",
      minHeight: "100vh",
      width: "100%",
    }}
  >
    <div className="search-results-wrapper">
      
      {/* Search Box with Filters */}
      <div className="search-box">
        <form onSubmit={handleSearch}>
          <div className="search-bar">
            <input
              type="text"
              placeholder="What are you looking for?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button
              type="button"
              onClick={toggleFilters}
              className="filter-toggle-btn"
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
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
                      <option key={index} value={category}>
                        {category}
                      </option>
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
                      <option key={index} value={condition}>
                        {condition}
                      </option>
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

          <button type="submit" className="search-button">
            🔍 Search Products
          </button>
        </form>
      </div>

      {/* Search Results Title */}
      <h2 className="search-results-title">{generateSearchTitle()}</h2>

      {/* Loading / Empty / Product Grid */}
      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
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
        <>
          <div className="search-results-grid">
            {currentProducts.map((product) => (
              <div key={product.id} className="product-card">
                <Link to={`/product/${product.id}`} className="product-link">
                  <div className="product-image-container">
                    {product.imageUrls && product.imageUrls.length > 0 ? (
                      <img
                        src={`http://localhost:8080${product.imageUrls[0]}`}
                        alt={product.title}
                        className="product-image"
                      />
                    ) : (
                      <div className="no-image">No image available</div>
                    )}
                  </div>
                </Link>
                <div className="product-info">
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-description">
                    {getShortDescription(product.description)}
                  </p>
                  <p className="product-price">${product.price}</p>

                  {product.category && (
                    <p className="product-category">
                      <i className="fas fa-tag"></i> {product.category}
                    </p>
                  )}

                  {product.location && (
                    <p className="product-location">
                      <i className="fas fa-map-marker-alt"></i>{" "}
                      {product.location}
                    </p>
                  )}

                  {product.sellerUsername && (
                    <div className="product-user">
                      <div className="user-avatar">👤</div>
                      <span className="user-name">
                        {product.sellerUsername}
                      </span>
                    </div>
                  )}

                  <Link
                    to={`/product/${product.id}`}
                    className="view-product-btn"
                  >
                    View Details
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
        </>
      )}
    </div>
  </div>
);

};

export default SearchResults;
