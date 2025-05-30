import React from 'react';
import './Map.css';

const MapFallback = ({ onRetry }) => {
  return (
    <div className="map-fallback">
      <div className="fallback-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
        </svg>
      </div>
      <h2>Map Loading Error</h2>
      <p>We couldn't load the recycling points map. This might be due to:</p>
      <ul>
        <li>No internet connection</li>
        <li>Google Maps API service disruption</li>
        <li>Your browser blocking location services</li>
      </ul>
      <button className="retry-map-button" onClick={onRetry}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
          <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
        </svg>
        Retry Loading Map
      </button>
      <p className="alternative-text">
        Alternatively, you can use the <a href="https://www.google.com/maps/search/recycling+point" target="_blank" rel="noopener noreferrer">Google Maps website</a> to find recycling points near you.
      </p>
    </div>
  );
};

export default MapFallback;
