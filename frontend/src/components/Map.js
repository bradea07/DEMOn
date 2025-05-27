import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import './Map.css';

const MapComponent = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [ecoSwapLocations, setEcoSwapLocations] = useState([]);
  
  // Map container style
  const mapContainerStyle = {
    width: '100%',
    height: '600px'
  };
  
  // Default center (will be overridden by user location if available)
  const center = {
    lat: 45.760696, 
    lng: 21.226788 // Default coordinates for Timisoara
  };

  // Load user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting current position:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser');
    }
    
    // Mock EcoSwap locations - replace with actual API call in production
    setEcoSwapLocations([
      {
        id: 1,
        name: 'EcoSwap Timisoara Center',
        position: { lat: 45.760696, lng: 21.226788 },
        description: 'Main EcoSwap location in Timisoara'
      },
      {
        id: 2,
        name: 'EcoSwap Arad',
        position: { lat: 46.166667, lng: 21.316667 },
        description: 'Our location in Arad'
      },
      {
        id: 3,
        name: 'EcoSwap Cluj',
        position: { lat: 46.770920, lng: 23.589920 },
        description: 'Our newest location in Cluj-Napoca'
      }
    ]);
  }, []);

  const handleMarkerClick = (location) => {
    setSelectedPlace(location);
  };

  return (
    <div className="map-container">
      <h2>EcoSwap Locations</h2>
      <p>Find EcoSwap collection and exchange points near you!</p>      {/* 
        IMPORTANT: I  f you're seeing "ApiNotActivatedMapError", you need to:
        1. Go to Google Cloud Console (https://console.cloud.google.com/)
        2. Select your project
        3. Go to "APIs & Services" > "Dashboard"
        4. Click "ENABLE APIS AND SERVICES"
        5. Search for "Maps JavaScript API" and enable it
        6. Make sure billing is enabled for your account
      */}
      <LoadScript
        googleMapsApiKey="AIzaSyAJPIEGuFEiK9ZalKe588s5ibLnhaSkbiQ"
        onLoad={() => setMapLoaded(true)}
        libraries={["places"]}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={currentPosition || center}
          zoom={10}
        >
          {/* User's current location marker */}
          {currentPosition && (
            <Marker
              position={currentPosition}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
              }}
              title="Your location"
            />
          )}
          
          {/* EcoSwap location markers */}
          {ecoSwapLocations.map((location) => (
            <Marker
              key={location.id}
              position={location.position}
              onClick={() => handleMarkerClick(location)}
            />
          ))}
          
          {/* Info window for selected location */}
          {selectedPlace && (
            <InfoWindow
              position={selectedPlace.position}
              onCloseClick={() => setSelectedPlace(null)}
            >
              <div className="info-window">
                <h3>{selectedPlace.name}</h3>
                <p>{selectedPlace.description}</p>
                <button className="direction-button">
                  Get Directions
                </button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
      
      {!mapLoaded && <div className="map-loading">Loading map...</div>}
    </div>
  );
};

export default MapComponent;
