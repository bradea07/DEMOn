import { useState, useEffect } from "react";

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

  const [images, setImages] = useState([]); // Store images
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  const categories = [
    "Electronics",
    "Home & Furniture",
    "Vehicles",
    "Real Estate",
    "Jobs",
    "Services",
    "Fashion & Beauty",
    "Hobbies, Sports & Kids",
    "Agriculture",
    "Industrial Equipment",
    "Pets",
    "Education & Books",
    "Food & Drinks",
    "Events & Tickets",
    "Health & Personal Care",
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        console.log("User detected:", JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing localStorage user:", error);
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!user || !user.id) {
        alert("You must be logged in to add a product.");
        return;
    }

    const productData = new FormData();
    productData.append("title", formData.title);
    productData.append("category", formData.category);
    productData.append("description", formData.description);
    productData.append("location", formData.location);
    productData.append("price", formData.price);
    productData.append("brand", formData.brand);
    productData.append("product_condition", formData.product_condition);
    productData.append("user_id", user.id);

    images.forEach((image) => {
        productData.append("images", image);
    });

    try {
        const response = await fetch("http://localhost:8080/api/products/add", {
            method: "POST",
            body: productData,
        });

        if (!response.ok) {
            throw new Error("Failed to add product.");
        }

        setMessage("✅ Product added successfully!");

        // ✅ Reset form fields and images after submission
        setFormData({
            title: "",
            category: "",
            description: "",
            location: "",
            price: "",
            brand: "",
            product_condition: "",
        });
        setImages([]);  // ✅ Ensure images array is cleared

    } catch (error) {
        console.error("❌ Error adding product:", error);
        alert(`Failed to add product: ${error.message}`);
    }
};




  return (
    <div>
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />

        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="">Select a category</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>

        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
        <input type="text" name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} required />

        <select name="product_condition" value={formData.product_condition} onChange={handleChange} required>
          <option value="">Select Condition</option>
          <option value="New">New</option>
          <option value="Used - Like New">Used - Like New</option>
          <option value="Used - Good">Used - Good</option>
          <option value="Used - Acceptable">Used - Acceptable</option>
        </select>

        {/* File input for images */}
        <input type="file" multiple accept="image/*" onChange={handleImageChange} />

        {/* Show image previews */}
        <div>
          {images.map((image, index) => (
            <img key={index} src={URL.createObjectURL(image)} alt="Preview" width="100" />
          ))}
        </div>

        <button type="submit">Add Product</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddProduct;
