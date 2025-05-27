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

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8080/api/products/${id}`)
      .then(() => {
        setProducts(products.filter((product) => product.id !== id));
      })
      .catch((err) => console.error("Failed to delete product", err));
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

  const deleteSelected = () => {
    if (selectedProducts.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedProducts.length} selected listing(s)?`)) {
      // Create an array of promises for each delete operation
      const deletePromises = selectedProducts.map(id => 
        axios.delete(`http://localhost:8080/api/products/${id}`)
      );
      
      // Execute all delete operations
      Promise.all(deletePromises)
        .then(() => {
          // Filter out the deleted products
          setProducts(products.filter(product => !selectedProducts.includes(product.id)));
          // Clear selections
          setSelectedProducts([]);
          // Exit selection mode
          setSelectMode(false);
        })
        .catch(err => {
          console.error("Failed to delete some products", err);
          // Refresh the list to get the current state
          axios
            .get(`http://localhost:8080/api/products/user/${userId}`)
            .then((res) => setProducts(res.data))
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
                  className="delete-selected-btn" 
                  onClick={deleteSelected}
                  disabled={selectedProducts.length === 0}
                >
                  Delete Selected ({selectedProducts.length})
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
                className={`listing-item ${selectMode && selectedProducts.includes(product.id) ? 'selected' : ''}`}
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
                    <strong>{product.title}</strong>
                    <span className="listing-price">{product.price} USD</span>
                  </div>
                  
                  {!selectMode && (
                    <div className="listing-actions">
                      <button
                        onClick={() => navigate(`/edit-product/${product.id}`)}
                        className="edit-btn"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="delete-btn"
                      >
                        🗑️ Delete
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
