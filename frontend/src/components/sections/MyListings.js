import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../Styles/MyListings.css";

const MyListings = ({ userId }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({ show: false, productId: null, productTitle: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:8080/api/products/user/${userId}`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Failed to fetch products", err));
  }, [userId]);

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

  // Handle delete product
  const handleDeleteProduct = async (productId) => {
    try {
      console.log(`Attempting to delete product with ID: ${productId}`);
      const response = await axios.delete(`http://localhost:8080/api/products/${productId}`);
      console.log('Delete response:', response);
      
      if (response.status === 200) {
        // Remove the product from the local state
        setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
        // Close the modal
        setDeleteConfirmModal({ show: false, productId: null, productTitle: "" });
        // Reset to first page if current page becomes empty
        const remainingProducts = products.filter(product => product.id !== productId);
        const newTotalPages = Math.ceil(remainingProducts.length / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(1);
        }
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  // Show delete confirmation modal
  const showDeleteConfirmation = (productId, productTitle) => {
    setDeleteConfirmModal({ show: true, productId, productTitle });
  };

  // Cancel delete operation
  const cancelDelete = () => {
    setDeleteConfirmModal({ show: false, productId: null, productTitle: "" });
  };

  return (
    <div className="my-listings-container">
      <div className="listings-header">
        <h3>{products.length > 0 ? "Your Listings" : "No listings yet."}</h3>
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
                className="listing-item"
              >
                <div className="listing-content">
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
                    <span className="listing-price">${product.price}</span>
                  </div>
                  
                  <div className="listing-actions">
                    <button
                      onClick={() => navigate(`/edit-product/${product.id}`)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => showDeleteConfirmation(product.id, product.title)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal.show && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <h3>Delete Product</h3>
            <p>Are you sure you want to delete <strong>"{deleteConfirmModal.productTitle}"</strong>?</p>
            <p className="warning-text">This action cannot be undone.</p>
            
            <div className="modal-buttons">
              <button 
                type="button" 
                onClick={cancelDelete}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={() => handleDeleteProduct(deleteConfirmModal.productId)}
                className="confirm-delete-btn"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyListings;
