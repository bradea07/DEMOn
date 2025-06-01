import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, DirectionsService, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import { MarkerClusterer } from '@react-google-maps/api';
import './Map.css';

const MapComponent = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [recyclingPoints, setRecyclingPoints] = useState([]);
  const [isLoadingRecyclingPoints, setIsLoadingRecyclingPoints] = useState(false);
  const [directions, setDirections] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
  const [visiblePointsLimit, setVisiblePointsLimit] = useState(null); // null means show all points
  const [locationStatus, setLocationStatus] = useState('pending'); // 'pending', 'success', 'error'
  const [watchId, setWatchId] = useState(null); // For continuous location tracking
  const [distanceFilter, setDistanceFilter] = useState(5000); // Default to 5km
  const [directionsStatus, setDirectionsStatus] = useState('idle'); // 'idle', 'loading', 'error'
  const [allRecyclingPoints, setAllRecyclingPoints] = useState([]); // Store all points for filtering
  const [locationInput, setLocationInput] = useState(''); // For custom location input
  const [searchedLocation, setSearchedLocation] = useState(null); // For storing geocoded location
  const [autocompleteService, setAutocompleteService] = useState(null); // For Google Places Autocomplete
  const [autocompleteResults, setAutocompleteResults] = useState([]); // For storing autocomplete suggestions
  const [showAutocomplete, setShowAutocomplete] = useState(false); // For showing/hiding autocomplete dropdown
  const [nearestPoint, setNearestPoint] = useState(null); // For storing the nearest recycling point
  const [markerAnimation, setMarkerAnimation] = useState(null); // For marker animation
  const [locationUpdated, setLocationUpdated] = useState(false); // For showing location updated notification
  const mapRef = React.useRef(null); // Reference to the Google Map instance
  
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
    
    // Clear any existing recycling points first
    setRecyclingPoints([]);
    setAllRecyclingPoints([]);
    setNearestPoint(null);
    
    setIsLoadingRecyclingPoints(true);
    console.log("Fetching recycling points for position:", position);
    
    try {
      // Define the bounding box around the user's location (approx. 2km radius)
      const radius = 0.02; // roughly 2km in degrees
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
      
      console.log("Sending request to Overpass API:", url);
      const response = await fetch(url);
      const data = await response.json();
      
      // Transform the data for our map
      const points = data.elements.map((element, index) => {
        // Extract recycling materials information
        let materials = [];
        
        // Check for specific recycling tags
        if (element.tags.recycling_type) {
          materials.push(element.tags.recycling_type);
        }
        
        // Check for individual material types
        if (element.tags.recycling_glass === "yes") materials.push("Glass");
        if (element.tags.recycling_paper === "yes") materials.push("Paper");
        if (element.tags.recycling_plastic === "yes") materials.push("Plastic");
        if (element.tags.recycling_metal === "yes") materials.push("Metal");
        if (element.tags.recycling_electronics === "yes") materials.push("Electronics");
        if (element.tags.recycling_batteries === "yes") materials.push("Batteries");
        if (element.tags.recycling_clothes === "yes") materials.push("Clothes");
        
        // If no specific materials were found, use a default
        if (materials.length === 0) {
          materials.push("General recycling");
        }
        
        return {
          id: element.id || `recycling-${index}`,
          name: element.tags.name || 'Recycling Point',
          position: { 
            lat: element.lat, 
            lng: element.lon 
          },
          description: element.tags.operator || 'Recycling facility',
          isRecyclingPoint: true,
          acceptedMaterials: materials.join(", ")
        };
      });
      
      setAllRecyclingPoints(points); // Store all points
      
      // Calculate distances for each point and store exact values
      if (position) {
        // Calculate distances for each point and store exact values
        const pointsWithDistance = points.map(point => {
          // Use precise spherical distance calculation
          const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
            new window.google.maps.LatLng(position.lat, position.lng),
            new window.google.maps.LatLng(point.position.lat, point.position.lng)
          );
          
          // Add both raw and formatted distance values
          return {
            ...point,
            distanceMeters: distance,
            distanceFromUser: (distance / 1000).toFixed(2) // Convert to km with 2 decimal places for display
          };
        });
        
        console.log("Found points with distances:", pointsWithDistance.map(p => ({id: p.id, dist: p.distanceMeters})));
        
        // Sort by distance (closest first)
        pointsWithDistance.sort((a, b) => a.distanceMeters - b.distanceMeters);
        
        // Show all points by default
        setRecyclingPoints(pointsWithDistance);
        console.log(`Found ${pointsWithDistance.length} recycling points near the location`);
      } else {
        setRecyclingPoints(points);
        console.log(`Found ${points.length} recycling points near the location`);
      }
      
      // Set visibility to show all points
      setVisiblePointsLimit(null);
      
    } catch (error) {
      console.error('Error fetching recycling points:', error);
    } finally {
      setIsLoadingRecyclingPoints(false);
    }
  };

  // Load user's current location but don't fetch recycling points automatically
  useEffect(() => {
    // Add event listener to detect Google Maps API loading errors
    const handleGMapsError = () => {
      console.error("Google Maps API failed to load");
      alert("There was an issue loading Google Maps. Please check your internet connection and try again.");
      setMapLoaded(false);
    };
    
    window.addEventListener('error', (e) => {
      if (e.message && (
        e.message.includes('Google Maps JavaScript API') ||
        e.message.includes('google is not defined')
      )) {
        handleGMapsError();
      }
    });

    setLocationStatus('pending');
    setRecyclingPoints([]); // Clear any existing recycling points
    
    if (navigator.geolocation) {
      // Show loading message for location
      console.log("Requesting real-time location permission...");
      
      // Set geolocation options to get the most accurate position possible
      const geoOptions = {
        enableHighAccuracy: true, // Use GPS when available for high accuracy
        timeout: 15000,          // Wait up to 15 seconds for a response
        maximumAge: 0            // Don't use cached position, always get fresh location
      };
      
      // Success handler for geolocation
      const geoSuccess = (position) => {
        console.log("Real-time location received:", position);
        
        const userPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        console.log("Using your real location coordinates:", userPosition);
        setCurrentPosition(userPosition);
        setLocationStatus('success');
        
        // Set initial animation for the marker
        // ✅ FIX for the error: Cannot read properties of undefined (reading 'DROP')
// Place this inside the geoSuccess function where you set the animation
if (window.google && window.google.maps && window.google.maps.Animation) {
  setMarkerAnimation(window.google.maps.Animation.DROP);
  setTimeout(() => setMarkerAnimation(null), 2000);
} else {
  console.warn("google.maps.Animation.DROP is not available yet");
  setMarkerAnimation(null); // fallback or avoid setting it
}

        
        // NOTE: We don't automatically fetch recycling points anymore
        // User must manually search for a location or use "Find My Location" button
      };
      
      // Error handler for geolocation
      const geoError = (error) => {
        console.error("Geolocation error:", error);
        setLocationStatus('error');
        
        // Show specific error messages based on the error code
        switch(error.code) {
          case error.PERMISSION_DENIED:
            alert("Please allow location access to find recycling points near you. The app needs your location to work properly.");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Your current position is unavailable. Make sure your device's location services are enabled.");
            break;
          case error.TIMEOUT:
            alert("Getting your location timed out. Please try again or check your device settings.");
            break;
          default:
            alert("Unknown error occurred while getting your location. Please try again.");
        }
      };
      
      // Request the user's real-time position with our improved options and handlers
      navigator.geolocation.getCurrentPosition(
        geoSuccess, 
        geoError,
        geoOptions
      );
    } else {
      console.error("Geolocation is not supported by this browser");
      setLocationStatus('error');
      alert("Your browser doesn't support geolocation. Please use a modern browser to get real-time recycling points.");
    }
  }, []);

  // Watch for location changes
  useEffect(() => {
    if (navigator.geolocation && locationStatus === 'success') {
      // Update current position every 10 seconds
      const id = navigator.geolocation.watchPosition(
        (position) => {
          const userPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          setCurrentPosition(userPosition);
          
          // Optionally, fetch recycling points again if needed
          //fetchRecyclingPoints(userPosition);
        },
        (error) => {
          console.error("Error watching position:", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000, // Accept cached position if less than 10 seconds old
          timeout: 10000
        }
      );
      
      // Save the watch ID so we can clear it later
      setWatchId(id);
      
      // Clear the watch on component unmount
      return () => {
        navigator.geolocation.clearWatch(id);
      };
    }
  }, [locationStatus]);

  const handleMarkerClick = (location) => {
    setSelectedPlace(location);
  };

  const handleGetDirections = (origin, destination) => {
    if (!origin || !destination) {
      console.error("Missing origin or destination for directions", { origin, destination });
      alert("Cannot calculate directions: missing starting point or destination");
      return;
    }
    
    console.log("Getting walking directions from", origin, "to", destination);
    
    // Update directions status to loading
    setDirectionsStatus('loading');
    
    // Call Google Maps Directions API
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route({
      origin: new window.google.maps.LatLng(origin.lat, origin.lng),
      destination: new window.google.maps.LatLng(destination.lat, destination.lng),
      travelMode: window.google.maps.TravelMode.WALKING,
      provideRouteAlternatives: true,
      optimizeWaypoints: true,
      avoidHighways: true,
      avoidTolls: true
    }, (result, status) => {
      console.log("Directions result:", status, result);
      
      if (status === window.google.maps.DirectionsStatus.OK) {
        try {
          // Find the shortest route if multiple routes are returned
          if (result.routes && result.routes.length > 1) {
            let shortestRouteIndex = 0;
            let shortestDistance = Number.MAX_VALUE;
            
            // Loop through all routes to find the shortest one
            result.routes.forEach((route, index) => {
              if (route && route.legs && route.legs.length > 0) {
                let totalDistance = 0;
                route.legs.forEach(leg => {
                  if (leg && leg.distance) {
                    totalDistance += leg.distance.value;
                  }
                });
                
                if (totalDistance < shortestDistance) {
                  shortestDistance = totalDistance;
                  shortestRouteIndex = index;
                }
              }
            });
            
            // Set the shortest route as the active one
            const shortestRoute = JSON.parse(JSON.stringify(result)); // Deep clone to avoid reference issues
            shortestRoute.routes = [result.routes[shortestRouteIndex]];
            setDirections(shortestRoute);
            console.log("Using shortest route:", shortestDistance, "meters");
          } else {
            setDirections(result);
          }
          
          setShowDirections(true);
          setDirectionsStatus('idle');
        } catch (err) {
          console.error("Error processing directions:", err);
          setDirectionsStatus('error');
          alert('Error processing directions. Please try again.');
        }
      } else {
        console.error('Error fetching directions:', status, result);
        setDirectionsStatus('error');
        alert('Unable to calculate walking directions. Please try again later.');
      }
    });
  };
  
  // Show only the nearest recycling points (within a certain distance)
  const handleShowNearestPoints = (distance = distanceFilter) => {
    const position = searchedLocation || currentPosition;
    
    if (!position || !allRecyclingPoints.length) {
      alert('Please share your location or search for a location first.');
      return;
    }
    
    console.log(`Finding recycling points within ${distance}m of position:`, position);
    
    // Always recalculate distances for all points for accuracy
    const pointsWithDistance = allRecyclingPoints.map(point => {
      const pointDistance = window.google.maps.geometry.spherical.computeDistanceBetween(
        new window.google.maps.LatLng(position.lat, position.lng),
        new window.google.maps.LatLng(point.position.lat, point.position.lng)
      );
      
      // Print distances to debug
      console.log(`Point ${point.id || point.name}: ${pointDistance}m, ${(pointDistance/1000).toFixed(2)}km`);
      
      return {
        ...point,
        distanceMeters: pointDistance,
        distanceFromUser: (pointDistance / 1000).toFixed(2) // Convert to km with 2 decimal places
      };
    });
    
    // Filter by the exact distance parameter - make sure it's compared as a number
    const filteredPoints = pointsWithDistance.filter(point => {
      return Number(point.distanceMeters) <= Number(distance);
    });
    
    console.log(`Found ${filteredPoints.length} points within ${distance}m`);
    
    // Sort by distance from user
    filteredPoints.sort((a, b) => Number(a.distanceMeters) - Number(b.distanceMeters));
    
    // Update UI state
    setDistanceFilter(distance);
    setVisiblePointsLimit(distance);
    
    // Update the recycling points state with the filtered and sorted points
    // Also update the distanceFromUser property for display in the UI
    const pointsWithFormattedDistance = filteredPoints.map(point => ({
      ...point,
      distanceFromUser: (point.distanceMeters / 1000).toFixed(2) // Convert to km with 2 decimal places
    }));
    
    setRecyclingPoints(pointsWithFormattedDistance);
  };
  
  // Reset filters and show all recycling points
  const handleShowAllPoints = () => {
    setVisiblePointsLimit(null);
    
    // Make sure all points have distance information
    if ((currentPosition || searchedLocation) && allRecyclingPoints.length) {
      const position = searchedLocation || currentPosition;
      const pointsWithDistance = allRecyclingPoints.map(point => {
        const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
          new window.google.maps.LatLng(position.lat, position.lng),
          new window.google.maps.LatLng(point.position.lat, point.position.lng)
        );
        return {
          ...point,
          distanceMeters: distance,
          distanceFromUser: (distance / 1000).toFixed(2) // Convert to km with 2 decimal places
        };
      });
      
      // Sort by distance from user
      pointsWithDistance.sort((a, b) => a.distanceMeters - b.distanceMeters);
      setRecyclingPoints(pointsWithDistance);
    } else {
      setRecyclingPoints(allRecyclingPoints);
    }
  };
  
  // Clear directions from the map
  const handleClearDirections = () => {
    setShowDirections(false);
    setDirections(null);
    setDirectionsStatus('idle');
  };

  // Retry fetching the location
  const handleRetryLocation = () => {
    setLocationStatus('pending');
    setSearchedLocation(null); // Clear any searched location when using current location
    
    // Retry getting the user's position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        setCurrentPosition(userPosition);
        setLocationStatus('success');
        
        // Set animation for the marker
        if (window.google) {
          setMarkerAnimation(window.google.maps.Animation.BOUNCE);
          // Stop bouncing after 2 seconds
          setTimeout(() => setMarkerAnimation(null), 2000);
        }
        
        // Now fetch recycling points near the user's location
        fetchRecyclingPoints(userPosition);
        
        // Center the map on the user's position
        if (mapRef.current) {
          mapRef.current.panTo(userPosition);
          mapRef.current.setZoom(14);
        }
      },
      (error) => {
        setLocationStatus('error');
        console.error("Error getting location:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };
  
  // Handle custom location input change
  const handleLocationInputChange = (e) => {
    const input = e.target.value;
    setLocationInput(input);
    
    // Show autocomplete dropdown if there's input
    if (input.length > 0) {
      setShowAutocomplete(true);
      
      // If Google Places Autocomplete service is available, get suggestions
      if (autocompleteService && window.google) {
        autocompleteService.getPlacePredictions(
          { input },
          (predictions, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
              setAutocompleteResults(predictions);
            } else {
              setAutocompleteResults([]);
            }
          }
        );
      }
    } else {
      setShowAutocomplete(false);
      setAutocompleteResults([]);
    }
  };
  
  // Select a location from autocomplete results
  const handleSelectLocation = (placeId, description) => {
    setLocationInput(description);
    setShowAutocomplete(false);
    
    // Use the Places Service to get details of the selected place
    if (window.google && placeId) {
      const placesService = new window.google.maps.places.PlacesService(
        document.createElement('div') // Dummy element required by the API
      );
      
      placesService.getDetails(
        { placeId, fields: ['geometry'] },
        (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place && place.geometry) {
            const location = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng()
            };
            
            // Store the searched location
            setSearchedLocation(location);
            setCurrentPosition(null); // Clear current position when using searched location
            
            // Set animation for the marker
            if (window.google) {
              setMarkerAnimation(window.google.maps.Animation.BOUNCE);
              // Stop bouncing after 2 seconds
              setTimeout(() => setMarkerAnimation(null), 2000);
            }
            
            // Update the map view
            if (mapRef.current) {
              mapRef.current.panTo(location);
              mapRef.current.setZoom(14);
            }
            
            // Fetch recycling points at this new location
            fetchRecyclingPoints(location);
          }
        }
      );
    }
  };
  
  // Search for recycling points near the entered location
  const handleLocationSearch = () => {
    // If we have a selected place from autocomplete
    if (searchedLocation) {
      setCurrentPosition(null); // Clear current position when using searched location
      fetchRecyclingPoints(searchedLocation);
      
      // Center the map on the searched location
      if (mapRef.current) {
        mapRef.current.panTo(searchedLocation);
        mapRef.current.setZoom(14);
      }
      return;
    }
    
    // If we don't have a selected place but have text input, try to geocode it
    if (locationInput && window.google) {
      const geocoder = new window.google.maps.Geocoder();
      
      geocoder.geocode({ address: locationInput }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK && results[0]) {
          const location = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          };
          
          setSearchedLocation(location);
          setCurrentPosition(null); // Clear current position when using searched location
          
          // Set animation for the marker
          if (window.google) {
            setMarkerAnimation(window.google.maps.Animation.BOUNCE);
            // Stop bouncing after 2 seconds
            setTimeout(() => setMarkerAnimation(null), 2000);
          }
          
          fetchRecyclingPoints(location);
          
          // Center the map on the geocoded location
          if (mapRef.current) {
            mapRef.current.panTo(location);
            mapRef.current.setZoom(14);
          }
        } else {
          alert('Could not find that location. Please try again.');
        }
      });
    } else {
      alert('Please enter a location to search');
    }
  };
  
  // Find the closest recycling point to the current position and calculate route
  const findClosestRecyclingPoint = () => {
    // Always use allRecyclingPoints to find the truly closest point, not just the filtered ones
    if (!allRecyclingPoints.length) {
      alert('No recycling points found. Please search for a location first.');
      return;
    }
    
    const position = searchedLocation || currentPosition;
    
    if (!position) {
      alert('Please share your location or search for a location first.');
      return;
    }
    
    console.log("Finding closest point from position:", position);
    
    let closestPoint = null;
    let minDistance = Infinity;
    
    // Find the closest point from ALL points, not just currently filtered ones
    allRecyclingPoints.forEach(point => {
      // Always recalculate distance for accuracy
      const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
        new window.google.maps.LatLng(position.lat, position.lng),
        new window.google.maps.LatLng(point.position.lat, point.position.lng)
      );
      
      console.log(`Point ${point.id || point.name}: ${distance} meters`);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = {...point}; // Create a copy to avoid reference issues
      }
    });
    
    if (closestPoint) {
      // Always update distance information with fresh calculation
      closestPoint.distanceMeters = minDistance;
      closestPoint.distanceFromUser = (minDistance / 1000).toFixed(2);
      
      console.log("Found closest point:", closestPoint.name, "at", closestPoint.distanceFromUser, "km");
      
      // Highlight this point in the UI
      setNearestPoint(closestPoint);
      setSelectedPlace(closestPoint);
      
      // Show success notification
      setLocationUpdated(true);
      setTimeout(() => setLocationUpdated(false), 3000);
      
      // Pan to the closest point with smooth animation
      if (mapRef.current) {
        mapRef.current.panTo({
          lat: closestPoint.position.lat,
          lng: closestPoint.position.lng
        });
        
        // Zoom in with animation
        setTimeout(() => {
          if (mapRef.current) mapRef.current.setZoom(16);
        }, 300);
      }
      
      // Get directions to the closest point
      handleGetDirections(position, closestPoint.position);
    }
  };

  return (
    <div className="map-container">
      <h2>Recycling Points Near You</h2>
      <p>Find recycling points near your location or search for a specific address!</p>
      
      {/* Custom location search */}
      <div className="search-container">
        <div className="search-input-container">
          <input
            type="text"
            className="location-search-input"
            placeholder="Enter a location (e.g., address, city, landmark)"
            value={locationInput}
            onChange={handleLocationInputChange}
            onKeyDown={(e) => e.key === 'Enter' && handleLocationSearch()}
          />
          
          {/* Autocomplete dropdown */}
          {showAutocomplete && autocompleteResults.length > 0 && (
            <div className="autocomplete-dropdown">
              {autocompleteResults.map((result) => (
                <div
                  key={result.place_id}
                  className="autocomplete-item"
                  onClick={() => handleSelectLocation(result.place_id, result.description)}
                >
                  {result.description}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <button className="search-button" onClick={handleLocationSearch}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
          Search
        </button>
      </div>
      
      {isLoadingRecyclingPoints && <div className="loading-indicator">Looking for recycling points near the location...</div>}
      {recyclingPoints.length > 0 && (
        <p className="recycling-points-found">
          Found {recyclingPoints.length} recycling points near the location!
          <span className="legend"><span className="green-dot"></span> = Recycling Point</span>
          {nearestPoint && <span className="legend"><span className="yellow-dot"></span> = Nearest Point</span>}
        </p>
      )}
      
      <div className="location-buttons">
        {recyclingPoints.length > 0 && (
          <button className="find-closest-button" onClick={findClosestRecyclingPoint}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
            </svg>
            Find Nearest Recycling Point & Get Directions
          </button>
        )}
        
        {showDirections && (
          <button className="clear-directions-button" onClick={handleClearDirections}>
            Clear Directions
          </button>
        )}
      </div>
      

      
      {/* Directions status message */}
      {directionsStatus === 'loading' && (
        <div className="directions-status loading">
          Calculating the best route to the recycling point...
        </div>
      )}
      {directionsStatus === 'error' && (
        <div className="directions-status error">
          Unable to calculate directions. Please try again.
        </div>
      )}
      
      {/*
        IMPORTANT: If you're seeing "ApiNotActivatedMapError", you need to:
        1. Go to Google Cloud Console (https://console.cloud.google.com/)
        2. Select your project
        3. Go to "APIs & Services" > "Dashboard"
        4. Click "ENABLE APIS AND SERVICES"
        5. Search for "Maps JavaScript API" and enable it
        6. Make sure billing is enabled for your account
      */}
      <LoadScript
        googleMapsApiKey="AIzaSyDdWRophBdKq73p8cb7wbGoUJ9pd0StQG8"
        onLoad={() => {
          console.log("Google Maps API loaded successfully");
          setMapLoaded(true);
        }}
        onError={(error) => {
          console.error("Error loading Google Maps API:", error);
          setMapLoaded(false);
          alert("There was a problem loading Google Maps. Please refresh the page or try again later.");
        }}
        libraries={["places", "geometry"]}
      >
        {/* Initialize autocomplete service once map is loaded */}
        {mapLoaded && !autocompleteService && window.google && (() => {
          setAutocompleteService(new window.google.maps.places.AutocompleteService());
          return null;
        })()}
        
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={searchedLocation || currentPosition || center}
          zoom={14}
          onLoad={(map) => mapRef.current = map}
        >
          {/* Recycling Points markers */}
          <MarkerClusterer>
            {(clusterer) =>
              recyclingPoints.map((point) => {
                // Calculate distance from user's location to recycling point
                let distance = null;
                if (currentPosition || searchedLocation) {
                  const userPos = searchedLocation || currentPosition;
                  distance = window.google.maps.geometry.spherical.computeDistanceBetween(
                    new window.google.maps.LatLng(userPos.lat, userPos.lng),
                    new window.google.maps.LatLng(point.position.lat, point.position.lng)
                  );
                }
                
                // Add distance to point object
                point.distanceFromUser = distance ? (distance / 1000).toFixed(2) : null;
                
                return (
                  <Marker
                    key={point.id}
                    position={point.position}
                    onClick={() => handleMarkerClick(point)}
                    icon={{
                      url: nearestPoint && point.id === nearestPoint.id 
                        ? 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png' // Highlight nearest point
                        : 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                      scaledSize: new window.google.maps.Size(
                        nearestPoint && point.id === nearestPoint.id ? 45 : 35, 
                        nearestPoint && point.id === nearestPoint.id ? 45 : 35
                      )
                    }}
                    animation={nearestPoint && point.id === nearestPoint.id 
                      ? window.google.maps.Animation.BOUNCE 
                      : null}
                    clusterer={clusterer}
                    label={distance ? {
                      text: `${(distance / 1000).toFixed(1)}km`,
                      color: '#1b5e20',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      className: 'marker-label'
                    } : null}
                  />
                );
              })
            }
          </MarkerClusterer>
          
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
                    <p><strong>Accepts:</strong> {selectedPlace.acceptedMaterials}</p>
                    {(currentPosition || searchedLocation) && (
                      <div className="distance-info">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-geo" viewBox="0 0 16 16" style={{marginRight: '5px'}}>
                          <path fillRule="evenodd" d="M8 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM4 4a4 4 0 1 1 4.5 3.969V13.5a.5.5 0 0 1-1 0V7.97A4 4 0 0 1 4 3.999zm2.493 8.574a.5.5 0 0 1-.411.575c-.712.118-1.28.295-1.655.493a1.319 1.319 0 0 0-.37.265.301.301 0 0 0-.057.09V14l.002.008a.147.147 0 0 0 .016.033.617.617 0 0 0 .145.15c.165.13.435.27.813.395.751.25 1.82.414 3.024.414s2.273-.163 3.024-.414c.378-.126.648-.265.813-.395a.619.619 0 0 0 .146-.15.148.148 0 0 0 .015-.033L12 14v-.004a.301.301 0 0 0-.057-.09 1.318 1.318 0 0 0-.37-.264c-.376-.198-.943-.375-1.655-.493a.5.5 0 1 1 .164-.986c.77.127 1.452.328 1.957.594C12.5 13 13 13.4 13 14c0 .426-.26.752-.544.977-.29.228-.68.413-1.116.558-.878.293-2.059.465-3.34.465-1.281 0-2.462-.172-3.34-.465-.436-.145-.826-.33-1.116-.558C3.26 14.752 3 14.426 3 14c0-.599.5-1 .961-1.243.505-.266 1.187-.467 1.957-.594a.5.5 0 0 1 .575.411z"/>
                        </svg>
                        Distance: {selectedPlace.distanceFromUser || (() => {
                          const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
                            new window.google.maps.LatLng((searchedLocation || currentPosition).lat, (searchedLocation || currentPosition).lng),
                            new window.google.maps.LatLng(selectedPlace.position.lat, selectedPlace.position.lng)
                          );
                          return (distance / 1000).toFixed(2);
                        })()} km
                      </div>
                    )}
                    <button 
                      className="direction-button" 
                      onClick={() => handleGetDirections((searchedLocation || currentPosition), selectedPlace.position)}
                      disabled={directionsStatus === 'loading' || (!currentPosition && !searchedLocation)}
                    >
                      {directionsStatus === 'loading' ? 'Calculating...' : 'Get Shortest Path'}
                    </button>
                  </div>
                ) : (
                  <button 
                    className="direction-button" 
                    onClick={() => handleGetDirections((searchedLocation || currentPosition), selectedPlace.position)}
                    disabled={directionsStatus === 'loading' || (!currentPosition && !searchedLocation)}
                  >
                    {directionsStatus === 'loading' ? 'Calculating...' : 'Get Directions'}
                  </button>
                )}
              </div>
            </InfoWindow>
          )}
          
          {/* Directions renderer */}
          {showDirections && directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: '#2e7d32',
                  strokeWeight: 5
                }
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>
      
      {!mapLoaded && (
        <div className="map-loading">
          <div className="loading-spinner"></div>
          <p>Loading Google Maps...</p>
          <p className="loading-hint">If the map doesn't load after a minute, please refresh the page.</p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
