import React from 'react';

const Favorites = () => {
  const favorites = [
    { id: 1, title: "Vintage Desk" },
    { id: 2, title: "Used Laptop" },
  ];

  return (
    <div>
      <h3>Favorites</h3>
      <ul>
        {favorites.map(item => (
          <li key={item.id}>{item.title} <button>Remove</button></li>
        ))}
      </ul>
    </div>
  );
};

export default Favorites;
