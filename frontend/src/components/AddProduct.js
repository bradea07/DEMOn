import { useState, useEffect } from "react";
import "../AddProduct.css"; // ✅ Import the CSS file

const AddProduct = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    price: "",
    brand: "",
    product_condition: "",
  });

  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

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
  }, []);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages([...images, ...selectedFiles]);
  };

  const handleDeleteImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!user || !user.id) {
      alert("You must be logged in to add a product.");
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
    productData.append("user_id", user.id);

    if (images.length > 0) {
      images.forEach((image) => productData.append("images", image));
    }

    try {
      const response = await fetch("http://localhost:8080/api/products/add", {
        method: "POST",
        body: productData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add product.");
      }

      setMessage("✅ Product added successfully!");
      setImages([]);
    } catch (error) {
      alert(`Failed to add product: ${error.message}`);
    }
  };

  return (
    <div className="add-product-container">
      <h2 className="add-product-title">Add Product</h2>
      <div className="add-product-box">
        <form onSubmit={handleSubmit} className="add-product-form">
          <div className="columns-container">
            <div className="left-column">
              <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="add-product-input" required />
              <select name="category" value={formData.category} onChange={handleChange} className="add-product-select" required>
                <option value="">Select a category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="add-product-textarea" required />
              <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="add-product-input" required />
            </div>

            <div className="right-column">
              <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className="add-product-input" required />
              <input type="text" name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} className="add-product-input" required />
              <select name="product_condition" value={formData.product_condition} onChange={handleChange} className="add-product-select" required>
                <option value="">Select Condition</option>
                <option value="New">New</option>
                <option value="Used - Like New">Used - Like New</option>
                <option value="Used - Good">Used - Good</option>
                <option value="Used - Acceptable">Used - Acceptable</option>
              </select>
              <div className="file-input-container">
                <label className="custom-file-label" htmlFor="fileInput">Choose Files</label>
                <input id="fileInput" type="file" multiple accept="image/*" onChange={handleImageChange} className="add-product-file-input" />
              </div>
            </div>
          </div>

          <div className="image-preview-container">
            {images.map((image, index) => (
              <div key={index} className="image-preview">
                <img src={URL.createObjectURL(image)} alt="Preview" />
                <button type="button" onClick={() => handleDeleteImage(index)}>❌</button>
              </div>
            ))}
          </div>

          <button type="submit" className="add-product-button">Add Product</button>
        </form>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddProduct;
