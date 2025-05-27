import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import RecommendedProducts from "./RecommendedProducts";
// Remove Navbar import since it's already included in App.js
import "../SearchPage.css";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    productCondition: "",
    location: "",    brand: "",
  });
  const authContext = useContext(AuthContext);
  const currentUser = authContext ? authContext.currentUser : null;
  const navigate = useNavigate();

  // Categories list (same as in AddProduct.js)
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

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };
  // Verifică dacă cel puțin un câmp de căutare sau filtru este completat
  const isSearchEnabled = () => {
    return searchTerm.trim() !== '' || 
           filters.category !== '' || 
           filters.minPrice !== '' || 
           filters.maxPrice !== '' || 
           filters.productCondition !== '' || 
           filters.location !== '' || 
           filters.brand !== '';
  };
  const handleSearch = (e) => {
    e.preventDefault();
    
    // Dacă nu există niciun criteriu de căutare, nu face nimic
    if (!isSearchEnabled()) {
      return;
    }
    
    let searchParams = new URLSearchParams();
    
    // Add search term if provided
    if (searchTerm.trim()) {
      searchParams.append("query", searchTerm);
    }
    
    // Add filters if they have values
    if (filters.category) searchParams.append("category", filters.category);
    if (filters.minPrice) searchParams.append("minPrice", filters.minPrice);
    if (filters.maxPrice) searchParams.append("maxPrice", filters.maxPrice);
    if (filters.productCondition) searchParams.append("condition", filters.productCondition);
    if (filters.location) searchParams.append("location", filters.location);    if (filters.brand) searchParams.append("brand", filters.brand);

    // Record search for logged-in users
    if (currentUser && currentUser.id) {
      const recordSearchParams = new URLSearchParams();
      recordSearchParams.append("userId", currentUser.id.toString());
      if (searchTerm.trim()) recordSearchParams.append("query", searchTerm);
      if (filters.category) recordSearchParams.append("category", filters.category);
      if (filters.brand) recordSearchParams.append("brand", filters.brand);
      if (filters.productCondition) recordSearchParams.append("condition", filters.productCondition);
      if (filters.location) recordSearchParams.append("location", filters.location);
      if (filters.minPrice) recordSearchParams.append("minPrice", filters.minPrice);
      if (filters.maxPrice) recordSearchParams.append("maxPrice", filters.maxPrice);

      // Send to backend - but don't wait for response to improve UX
      axios.post(`http://localhost:8080/api/recommendations/record-search?${recordSearchParams.toString()}`)
        .catch(err => {
          console.error("Error recording search:", err);
          if (err.response) {
            console.error("Response data:", err.response.data);
            console.error("Response status:", err.response.status);
          }
        });
    }

    navigate(`/search-results?${searchParams.toString()}`);
  };
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <div className="search-page-container">
        {/* Header cu gradient */}
      <div className="search-header">
      </div>
        <h2 className="search-title">Search for products</h2>
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
            <button type="button" onClick={toggleFilters} className="filter-toggle-btn">
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
                      <option key={index} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <label htmlFor="productCondition">Condition</label>
                  <select
                    name="productCondition"
                    id="productCondition"
                    value={filters.productCondition}
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
          )}          <button 
            type="submit" 
            className="search-button"
          >            🔍 Search
          </button>
        </form>
      </div>
      
      {/* Display personalized recommendations if user is logged in */}
      {currentUser && <RecommendedProducts />}
    </div>
  );
};

export default SearchPage;
