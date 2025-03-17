import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/products/${id}`);
                if (!response.ok) {
                    throw new Error("Product not found");
                }
                const data = await response.json();
                console.log("✅ Received Product Data:", data);
                setProduct(data);
            } catch (err) {
                console.error("❌ Error fetching product:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>❌ {error}</p>;

    return (
        <div>
            <h2>{product.title}</h2>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Description:</strong> {product.description}</p>
            <p><strong>Price:</strong> {product.price} USD</p>
            <p><strong>Brand:</strong> {product.brand}</p>
            <p><strong>Condition:</strong> {product.product_condition}</p>

            {/* ✅ Display Image */}
           {/* ✅ Load Image */}
           {product.imageUrls && product.imageUrls.length > 0 ? (
    product.imageUrls.map((img, index) => (
        <img key={index} src={`http://localhost:8080${img}`} alt="Product" width="200" />
    ))
) : (
    <p style={{ color: "red" }}>No image available</p>
)}



        </div>
    );
};

export default ProductDetails;
