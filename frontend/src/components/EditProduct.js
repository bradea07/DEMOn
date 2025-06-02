import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../AddProduct.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faUpload } from '@fortawesome/free-solid-svg-icons';

const EditProduct = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    price: "",
    brand: "",
    product_condition: "",
    phone: "",
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    "Electronics", "Home & Furniture", "Vehicles", "Real Estate", "Jobs",
    "Services", "Fashion & Beauty", "Hobbies, Sports & Kids", "Agriculture",
    "Industrial Equipment", "Pets", "Education & Books", "Food & Drinks",
    "Events & Tickets", "Health & Personal Care",
  ];
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing localStorage user:", error);
      }
    }

    fetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          title: data.title,
          category: data.category,
          description: data.description,
          location: data.location,
          price: data.price,
          brand: data.brand,
          product_condition: data.productCondition, // Mapping correct
          phone: data.phone || "",
        });
        
        // Load existing images if available
        if (data.images && data.images.length > 0) {
          setExistingImages(data.images.map(img => ({
            id: img.id,
            url: `http://localhost:8080/${img.imageUrl}`
          })));
        }
      })
      .catch((err) => console.error("Error loading product", err));
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const remainingSlots = 9 - (images.length + existingImages.length);
    const filesToAdd = selectedFiles.slice(0, remainingSlots);
    setImages([...images, ...filesToAdd]);
  };

  const handleSingleImageChange = (e, targetIndex) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...images];
      // Fill empty slots up to the target index if needed
      while (newImages.length <= targetIndex) {
        newImages.push(null);
      }
      newImages[targetIndex] = file;
      setImages(newImages.filter(img => img !== null));
    }
  };

  const handleDeleteImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleDeleteExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    if (!user || !user.id) {
      setMessage("❌ You must be logged in to edit a product.");
      setIsSubmitting(false);
      return;
    }

    if (isNaN(formData.price) || Number(formData.price) <= 0) {
      setMessage("❌ Please enter a valid price greater than 0.");
      setIsSubmitting(false);
      return;
    }

    // Validate that at least one image is present (either existing or new)
    if (images.length === 0 && existingImages.length === 0) {
      setMessage("❌ Please upload at least one image for your product.");
      setIsSubmitting(false);
      return;
    }

    const productData = new FormData();
    productData.append("title", formData.title.trim());
    productData.append("category", formData.category);
    productData.append("description", formData.description.trim());
    productData.append("location", formData.location.trim());
    productData.append("price", formData.price);
    productData.append("brand", formData.brand.trim());
    productData.append("product_condition", formData.product_condition);
    productData.append("phone", formData.phone.trim());
    productData.append("user_id", user.id);

    // Add existing image IDs to keep
    if (existingImages.length > 0) {
      existingImages.forEach(image => {
        productData.append("existingImageIds", image.id);
      });
    }

    // Add new images if any
    if (images.length > 0) {
      images.forEach((image) => productData.append("images", image));
    }

    try {
      const response = await fetch(`http://localhost:8080/api/products/${id}`, {
        method: "PUT",
        body: productData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update product.");
      }

      setMessage("✅ Product updated successfully!");
      setTimeout(() => setMessage(""), 4000); // message disappears after 4 seconds
    } catch (error) {
      setMessage(`❌ Failed to update product: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      // Scroll to top to show message
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  return (
    <div className="add-product-container">      <h2 className="add-product-title">
        Update Listing
      </h2>
      
      {message && (
        <div className={`add-product-message ${message.includes("✅") ? "success" : "error"}`}>
          {message}
        </div>
      )}
      
      <div className="add-product-box">
        <form onSubmit={handleSubmit} className="add-product-form">
          <div className="columns-container">
            <div className="left-column">
              <label htmlFor="title">Title</label>
              <input 
                type="text" 
                id="title"
                name="title" 
                placeholder="Enter product title" 
                value={formData.title} 
                onChange={handleChange} 
                className="add-product-input" 
                required 
              />
              
              <label htmlFor="category">Category</label>
              <select 
                id="category"
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
                className="add-product-select" 
                required
              >
                <option value="">Select a category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
              
              <label htmlFor="description">Description</label>
              <textarea 
                id="description"
                name="description" 
                placeholder="Describe your product" 
                value={formData.description} 
                onChange={handleChange} 
                className="add-product-textarea" 
                required 
              />
              
              <label htmlFor="location">Location</label>
              <input 
                type="text" 
                id="location"
                name="location" 
                placeholder="Your location" 
                value={formData.location} 
                onChange={handleChange} 
                className="add-product-input" 
                required 
              />
            </div>

            <div className="right-column">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                placeholder="Price in RON"
                value={formData.price}
                onChange={handleChange}
                className="add-product-input"
                min="1.00"
                step="1.00"
                required
              />
              
              <label htmlFor="brand">Brand</label>
              <input 
                type="text" 
                id="brand"
                name="brand" 
                placeholder="Product brand" 
                value={formData.brand} 
                onChange={handleChange} 
                className="add-product-input" 
                required 
              />
              
              <label htmlFor="phone">Phone Number</label>
              <input 
                type="tel" 
                id="phone"
                name="phone" 
                placeholder="Your contact phone number" 
                value={formData.phone} 
                onChange={handleChange} 
                className="add-product-input" 
                required 
              />
              
              <label htmlFor="product_condition">Condition</label>
              <select 
                id="product_condition"
                name="product_condition" 
                value={formData.product_condition} 
                onChange={handleChange} 
                className="add-product-select" 
                required
              >
                <option value="">Select Condition</option>
                <option value="New">New</option>
                <option value="Used - Like New">Used - Like New</option>
                <option value="Used - Good">Used - Good</option>
                <option value="Used - Acceptable">Used - Acceptable</option>
              </select>
            </div>
          </div>

          {/* Image Upload Section - Moved below form */}
          <div className="file-input-container">
            <div className="file-input-header">
              <label htmlFor="images">Product Images <span className="required-asterisk">*</span></label>              <label className="custom-file-label" htmlFor="fileInput">
                Select Images
              </label>
              <input 
                id="fileInput" 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleImageChange} 
                className="add-product-file-input" 
              />
            </div>
            
            {/* Image Grid: 9 slots (3x3) */}
            <div className="image-grid-container">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
                // First display existing images, then new ones
                const existingImage = existingImages[index];
                const newImage = !existingImage && images[index - existingImages.length];
                
                return (
                  <div key={index} className="image-slot">
                    {existingImage ? (
                      <div className="image-preview-slot">
                        <img src={existingImage.url} alt="Product" />
                        <button 
                          type="button" 
                          className="remove-image-btn"
                          onClick={() => handleDeleteExistingImage(index)}
                        >
                          ×
                        </button>
                      </div>
                    ) : newImage ? (
                      <div className="image-preview-slot">
                        <img src={URL.createObjectURL(newImage)} alt="Preview" />
                        <button 
                          type="button" 
                          className="remove-image-btn"
                          onClick={() => handleDeleteImage(index - existingImages.length)}
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <label className="image-placeholder" htmlFor={`fileInput-${index}`}>
                        <FontAwesomeIcon icon={faCamera} style={{color: '#003d3d'}} />
                        <input
                          id={`fileInput-${index}`}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSingleImageChange(e, index - existingImages.length)}
                          className="add-product-file-input"
                        />
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button 
            type="submit" 
            className="add-product-button" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
