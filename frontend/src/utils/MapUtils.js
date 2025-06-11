/**
 * Geocoding utility function to convert addresses to coordinates
 * This is useful for testing locations on the map
 * @param {string} address - The address to geocode
 * @returns {Promise<{lat: number, lng: number}>} - The coordinates
 */
export const geocodeAddress = async (address) => {
  try {
    const geocoder = new window.google.maps.Geocoder();
    
    return new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK') {
          const location = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          };
          resolve(location);
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });
  } catch (error) {
    console.error('Error in geocoding:', error);
    throw error;
  }
};

/**
 * Get distance between two points in kilometers
 * @param {Object} point1 - {lat, lng}
 * @param {Object} point2 - {lat, lng}
 * @returns {number} - Distance in kilometers
 */
export const getDistance = (point1, point2) => {
  // Helper function using the Haversine formula
  const rad = (x) => (x * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  
  const dLat = rad(point2.lat - point1.lat);
  const dLng = rad(point2.lng - point1.lng);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(rad(point1.lat)) * Math.cos(rad(point2.lat)) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance; 
};
