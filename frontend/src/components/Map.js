import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import './Map.css';

const MapComponent = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [ecoSwapLocations, setEcoSwapLocations] = useState([]);
  const [recyclingPoints, setRecyclingPoints] = useState([]);
  const [isLoadingRecyclingPoints, setIsLoadingRecyclingPoints] = useState(false);
  
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

  // Function to fetch recycling points using Overpass API
  const fetchRecyclingPoints = async (position) => {
    if (!position) return;
    
    setIsLoadingRecyclingPoints(true);
    
    try {
      // Define the bounding box around the user's location (approx. 5km radius)
      const radius = 0.05; // roughly 5km in degrees
      const bbox = `${position.lat - radius},${position.lng - radius},${position.lat + radius},${position.lng + radius}`;
      
      // Build the Overpass API query
      const query = `
        [out:json];
        node["amenity"="recycling"](${bbox});
        out body;
      `;
      
      // URL encode the query
      const encodedQuery = encodeURIComponent(query);
      const url = `https://overpass-api.de/api/interpreter?data=${encodedQuery}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      // Transform the data for our map
      const points = data.elements.map((element, index) => ({
        id: element.id || `recycling-${index}`,
        name: element.tags.name || 'Recycling Point',
        position: { 
          lat: element.lat, 
          lng: element.lon 
        },
        description: element.tags.operator || 'Recycling facility',
        isRecyclingPoint: true
      }));
      
      setRecyclingPoints(points);
      console.log(`Found ${points.length} recycling points near you`);
    } catch (error) {
      console.error('Error fetching recycling points:', error);
    } finally {
      setIsLoadingRecyclingPoints(false);
    }
  };

  // Load user's current location and fetch recycling points
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentPosition(userPosition);
          
          // Fetch recycling points near the user's location
          fetchRecyclingPoints(userPosition);
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
      <p>Find EcoSwap collection and exchange points near you!</p>
      {isLoadingRecyclingPoints && <div className="loading-indicator">Looking for recycling points near you...</div>}
      {recyclingPoints.length > 0 && <p className="recycling-points-found">Found {recyclingPoints.length} recycling points near your location! <span className="legend"><span className="green-dot"></span> = Recycling Point</span></p>}
      {/* 
        IMPORTANT: I  f you're seeing "ApiNotActivatedMapError", you need to:
        1. Go to Google Cloud Console (https://console.cloud.google.com/)
        2. Select your project
        3. Go to "APIs & Services" > "Dashboard"
        4. Click "ENABLE APIS AND SERVICES"
        5. Search for "Maps JavaScript API" and enable it
        6. Make sure billing is enabled for your account
      */}
      <LoadScript
        googleMapsApiKey="AIzaSyDdWRophBdKq73p8cb7wbGoUJ9pd0StQG8"
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
          
          {/* Recycling Points markers */}
          {recyclingPoints.map((point) => (
            <Marker
              key={point.id}
              position={point.position}
              onClick={() => handleMarkerClick(point)}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                scaledSize: new window.google.maps.Size(35, 35)
              }}
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
                {selectedPlace.isRecyclingPoint ? (
                  <div className="recycling-info">
                    <p><strong>Type:</strong> Recycling Point</p>
                    <p>This is a public recycling facility</p>
                  </div>
                ) : (
                  <button className="direction-button">
                    Get Directions
                  </button>
                )}
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
