import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../Styles/MyListings.css";

const MyListings = ({ userId }) => {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:8080/api/products/user/${userId}`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to fetch products", err));
  }, [userId]);

  const handleToggleStatus = (id, currentStatus) => {
    const action = currentStatus ? "disable" : "enable";
    if (window.confirm(`Are you sure you want to ${action} this product?`)) {
      fetch(`http://localhost:8080/api/products/${id}/toggle-status`, {
        method: 'PUT',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Server returned ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          // Update the product in the local state
          setProducts(products.map(product => 
            product.id === id ? { ...product, active: data.active } : product
          ));
        })
        .catch((err) => {
          console.error("Failed to toggle product status", err);
          alert(`Error toggling product status: ${err.message}`);
        });
    }
  };

  const toggleProductSelection = (id) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(productId => productId !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const toggleSelectMode = () => {
    setSelectMode(!selectMode);
    // Clear selections when exiting select mode
    if (selectMode) {
      setSelectedProducts([]);
    }
  };

  const selectAll = () => {
    if (selectedProducts.length === products.length) {
      // If all are selected, deselect all
      setSelectedProducts([]);
    } else {
      // Otherwise select all
      setSelectedProducts(products.map(product => product.id));
    }
  };

  const toggleSelectedStatus = (newStatus) => {
    if (selectedProducts.length === 0) return;
    
    const action = newStatus ? "enable" : "disable";
    if (window.confirm(`Are you sure you want to ${action} ${selectedProducts.length} selected listing(s)?`)) {
      // Create an array of promises for each toggle operation
      const togglePromises = selectedProducts.map(id => 
        fetch(`http://localhost:8080/api/products/${id}/toggle-status`, {
          method: 'PUT',
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Server returned ${response.status}: ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => ({ id, active: data.active }))
      );
      
      // Execute all toggle operations
      Promise.all(togglePromises)
        .then((results) => {
          // Update the products with new status
          setProducts(products.map(product => {
            const result = results.find(r => r.id === product.id);
            return result ? { ...product, active: result.active } : product;
          }));
          // Clear selections
          setSelectedProducts([]);
          // Exit selection mode
          setSelectMode(false);
        })
        .catch(err => {
          console.error("Failed to toggle some products", err);
          alert(`Error toggling products: ${err.message}`);
          // Refresh the list to get the current state
          fetch(`http://localhost:8080/api/products/user/${userId}`)
            .then((res) => {
              if (!res.ok) throw new Error(`Server returned ${res.status}`);
              return res.json();
            })
            .then((data) => setProducts(data))
            .catch((err) => console.error("Failed to refresh products", err));
        });
    }
  };

  // Search filtering
  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.price && product.price.toString().includes(searchQuery))
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Page navigation
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="my-listings-container">
      <div className="listings-header">
        <h3>{products.length > 0 ? "Your Listings" : "No listings yet."}</h3>
        {products.length > 0 && (
          <div className="listings-actions">
            <button 
              className={`select-mode-btn ${selectMode ? 'active' : ''}`} 
              onClick={toggleSelectMode}
            >
              {selectMode ? "Cancel Selection" : "Select Items"}
            </button>
            
            {selectMode && (
              <>
                <button 
                  className="select-all-btn" 
                  onClick={selectAll}
                >
                  {selectedProducts.length === products.length ? "Deselect All" : "Select All"}
                </button>
                
                <button 
                  className="enable-selected-btn" 
                  onClick={() => toggleSelectedStatus(true)}
                  disabled={selectedProducts.length === 0}
                >
                  Enable Selected ({selectedProducts.length})
                </button>
                
                <button 
                  className="disable-selected-btn" 
                  onClick={() => toggleSelectedStatus(false)}
                  disabled={selectedProducts.length === 0}
                >
                  Disable Selected ({selectedProducts.length})
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {products.length > 0 && (
        <div className="search-and-filter">
          <div className="search-container">
            <input 
              type="text"
              placeholder="Search listings by title or price..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="search-input"
            />
          </div>
          <div className="items-per-page">
            <select 
              value={itemsPerPage} 
              onChange={handleItemsPerPageChange}
              className="items-per-page-select"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>items per page</span>
          </div>
        </div>
      )}

      {filteredProducts.length > 0 ? (
        <>
          <ul className="listings-list">
            {currentItems.map((product) => (
              <li 
                key={product.id} 
                className={`listing-item ${selectMode && selectedProducts.includes(product.id) ? 'selected' : ''} ${!product.active ? 'disabled-item' : ''}`}
              >
                <div className="listing-content">
                  {selectMode && (
                    <div className="listing-checkbox">
                      <input 
                        type="checkbox" 
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleProductSelection(product.id)}
                      />
                    </div>
                  )}
                  
                  <div className="listing-image">
                    {product.imageUrls && product.imageUrls.length > 0 ? (
                      <img
                        src={`http://localhost:8080${product.imageUrls[0]}`}
                        alt={product.title}
                      />
                    ) : (
                      <div className="no-image">No image</div>
                    )}
                  </div>
                  
                  <div className="listing-info">
                    <strong className={!product.active ? 'disabled-product' : ''}>{product.title}</strong>
                    <span className="listing-price">${product.price}</span>
                    {!product.active && <span className="status-badge disabled">Disabled</span>}
                  </div>
                  
                  {!selectMode && (
                    <div className="listing-actions">
                      <button
                        onClick={() => navigate(`/edit-product/${product.id}`)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(product.id, product.active)}
                        className={product.active ? "disable-btn" : "enable-btn"}
                      >
                        {product.active ? "Disable" : "Enable"}
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn" 
                onClick={prevPage} 
                disabled={currentPage === 1}
              >
                &laquo; Previous
              </button>
              
              <div className="page-numbers">
                {[...Array(totalPages).keys()].map(number => (
                  <button
                    key={number + 1}
                    onClick={() => paginate(number + 1)}
                    className={`page-number ${currentPage === number + 1 ? 'active' : ''}`}
                  >
                    {number + 1}
                  </button>
                ))}
              </div>
              
              <button 
                className="pagination-btn" 
                onClick={nextPage} 
                disabled={currentPage === totalPages}
              >
                Next &raquo;
              </button>
            </div>
          )}
          
          <div className="results-info">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} listing(s)
            {searchQuery && ` matching "${searchQuery}"`}
          </div>
        </>
      ) : (
        <p className="no-results">
          {searchQuery 
            ? `No listings found matching "${searchQuery}". Please try a different search.` 
            : "No listings available."}
        </p>
      )}
    </div>
  );
};

export default MyListings;
