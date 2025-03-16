import { useState, useEffect } from "react";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    image_url: "",
    location: "",
  });

  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null); // Store user details

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser)); // Parse user data
        console.log("User detected:", JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing localStorage user:", error);
      }
    }
  }, []);

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

    const productData = {
      ...formData,
      user: { id: user.id }, // Attach the user ID to the product
    };

    try {
      const response = await fetch("http://localhost:8080/api/products/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add product.");
      }

      setMessage("✅ Product added successfully!");
      setFormData({ title: "", category: "", description: "", image_url: "", location: "" });
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
        <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input type="text" name="image_url" placeholder="Image URL" value={formData.image_url} onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
        <button type="submit">Add Product</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddProduct;
