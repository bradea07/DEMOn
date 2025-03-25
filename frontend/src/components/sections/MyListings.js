import React, { useState } from 'react';

const MyListings = () => {
  const [products, setProducts] = useState([
    { id: 1, title: "Old Chair", status: "Available" },
    { id: 2, title: "Lamp", status: "Donated" },
  ]);

  const handleDelete = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  return (
    <div>
      <h3>My Listings</h3>
      <button>Add New Product</button>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.title} - {product.status}
            <button>Edit</button>
            <button onClick={() => handleDelete(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyListings;
