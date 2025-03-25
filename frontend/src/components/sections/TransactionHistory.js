import React from 'react';

const TransactionHistory = () => {
  const history = [
    { id: 1, item: "Bike", status: "Exchanged" },
    { id: 2, item: "Shoes", status: "Pending" },
  ];

  return (
    <div>
      <h3>Transaction History</h3>
      <ul>
        {history.map(h => (
          <li key={h.id}>{h.item} - {h.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionHistory;
