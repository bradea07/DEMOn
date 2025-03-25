import React from 'react';

const ActivityInsights = () => {
  const insights = {
    itemsDonated: 12,
    carbonSaved: 30, // in kg
    ecoLevel: "Eco Hero 🌱"
  };

  return (
    <div>
      <h3>Activity Insights</h3>
      <p>Items Donated: {insights.itemsDonated}</p>
      <p>Carbon Saved: {insights.carbonSaved}kg</p>
      <p>Badge: {insights.ecoLevel}</p>
    </div>
  );
};

export default ActivityInsights;
