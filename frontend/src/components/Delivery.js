import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/Delivery.css';

const Delivery = () => {
  const [fromAddress, setFromAddress] = useState({
    name: '',
    street1: '',
    city: '',
    state: '',
    zip: '',
    country: 'RO',
    phone: '',
    email: ''
  });
  
  const [toAddress, setToAddress] = useState({
    name: '',
    street1: '',
    city: '',
    state: '',
    zip: '',
    country: 'RO',
    phone: '',
    email: ''
  });
  
  const [parcel, setParcel] = useState({
    length: '',
    width: '',
    height: '',
    weight: ''
  });
  
  const [shipment, setShipment] = useState(null);
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleFromAddressChange = (e) => {
    setFromAddress({
      ...fromAddress,
      [e.target.name]: e.target.value
    });
  };
  
  const handleToAddressChange = (e) => {
    setToAddress({
      ...toAddress,
      [e.target.name]: e.target.value
    });
  };
  
  const handleParcelChange = (e) => {
    setParcel({
      ...parcel,
      [e.target.name]: e.target.value
    });
  };

  // Pre-fill form with test values for easier testing
  // Înlocuiește funcția fillTestValues cu aceasta:
const fillTestValues = () => {
  setFromAddress({
    name: 'John Doe',
    street1: '6512 Greene Rd.',
    city: 'Woodridge',
    state: 'IL',
    zip: '60517',
    country: 'US',
    phone: '+1 555 555 5555',
    email: 'john@example.com'
  });

  setToAddress({
    name: 'Jane Smith',
    street1: '388 Townsend St',
    city: 'San Francisco',
    state: 'CA',
    zip: '94107',
    country: 'US',
    phone: '+1 555 555 1234',
    email: 'jane@example.com'
  });

  setParcel({
    length: '10',
    width: '15',
    height: '20',
    weight: '1'
  });
};

     // Înlocuiește funcția createShipment cu aceasta:
const createShipment = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setRates([]);
  setShipment(null);
  console.log("Submitting shipment request");

  try {
    // Validare câmpuri esențiale
    if (!fromAddress.name || !fromAddress.street1 || !fromAddress.city || !fromAddress.state || !fromAddress.zip || !fromAddress.country) {
      throw new Error('Please fill all sender address fields');
    }

    if (!toAddress.name || !toAddress.street1 || !toAddress.city || !toAddress.state || !toAddress.zip || !toAddress.country) {
      throw new Error('Please fill all recipient address fields');
    }

    if (!parcel.length || !parcel.width || !parcel.height || !parcel.weight) {
      throw new Error('Please fill all parcel dimensions');
    }

    // Construire obiect request
    const requestData = {
      address_from: {
        name: fromAddress.name,
        street1: fromAddress.street1,
        city: fromAddress.city,
        state: fromAddress.state,
        zip: fromAddress.zip,
        country: fromAddress.country,
        phone: fromAddress.phone,
        email: fromAddress.email
      },
      address_to: {
        name: toAddress.name,
        street1: toAddress.street1,
        city: toAddress.city,
        state: toAddress.state,
        zip: toAddress.zip,
        country: toAddress.country,
        phone: toAddress.phone,
        email: toAddress.email
      },
      parcels: [
        {
          length: parseFloat(parcel.length),
          width: parseFloat(parcel.width),
          height: parseFloat(parcel.height),
          distance_unit: 'cm',
          weight: parseFloat(parcel.weight),
          mass_unit: 'kg'
        }
      ],
      async: false
    };

    console.log("Request data:", requestData);

    // Trimitere către Shippo API
    const response = await axios.post(
      'https://api.goshippo.com/shipments/',
      requestData,
      {
        headers: {
          'Authorization': 'ShippoToken shippo_test_b71c4d7eda1b61250f65ca1a1ede65f87a1f5bdc',
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("Shipment created:", response.data);
    setShipment(response.data);

    // Obținere tarife pentru transport
    if (response.data.object_id) {
      console.log("Fetching rates for shipment:", response.data.object_id);
      const ratesResponse = await axios.get(
        `https://api.goshippo.com/shipments/${response.data.object_id}/rates/`,
        {
          headers: {
            'Authorization': 'ShippoToken shippo_test_b71c4d7eda1b61250f65ca1a1ede65f87a1f5bdc',
            'Content-Type': 'application/json'
          }
        }
      );
      console.log("Rates received:", ratesResponse.data);
      setRates(ratesResponse.data.results || []);
    }
  } catch (err) {
    console.error('Error creating shipment:', err);
    setError('Error creating shipment. Please check your details and try again.');
  } finally {
    setLoading(false);
  }
};

  
  return (
    <div className="delivery-container">      <h2>Delivery Calculator</h2>
      
      <button 
        type="button" 
        className="test-values-btn" 
        onClick={fillTestValues}
        style={{ marginBottom: '15px', backgroundColor: '#e9ecef', color: '#333' }}
      >
        Fill Test Values
      </button>
      
      {error && <div className="error-message" style={{ padding: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}
      
      <form onSubmit={createShipment}>
        <div className="address-columns">
          <div className="address-column">
            <h3>Sender Address</h3>
            <div className="form-group">
              <label htmlFor="fromName">Full Name:</label>
              <input 
                type="text" 
                id="fromName" 
                name="name" 
                value={fromAddress.name} 
                onChange={handleFromAddressChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="fromStreet1">Address:</label>
              <input 
                type="text" 
                id="fromStreet1" 
                name="street1" 
                value={fromAddress.street1} 
                onChange={handleFromAddressChange}
                required 
              />
            </div>
              <div className="form-group">
              <label htmlFor="fromCity">City:</label>
              <input 
                type="text" 
                id="fromCity" 
                name="city" 
                value={fromAddress.city} 
                onChange={handleFromAddressChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="fromState">State/Province:</label>
              <input 
                type="text" 
                id="fromState" 
                name="state" 
                value={fromAddress.state} 
                onChange={handleFromAddressChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="fromZip">Postal Code:</label>
              <input 
                type="text" 
                id="fromZip" 
                name="zip" 
                value={fromAddress.zip} 
                onChange={handleFromAddressChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="fromCountry">Country:</label>              <select 
                id="fromCountry" 
                name="country" 
                value={fromAddress.country} 
                onChange={handleFromAddressChange}
                required
              >
                <option value="RO">Romania</option>
                <option value="DE">Germany</option>
                <option value="GB">United Kingdom</option>
                <option value="FR">France</option>
                <option value="IT">Italy</option>
                <option value="ES">Spain</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="fromPhone">Phone:</label>
              <input 
                type="tel" 
                id="fromPhone" 
                name="phone" 
                value={fromAddress.phone} 
                onChange={handleFromAddressChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="fromEmail">Email:</label>
              <input 
                type="email" 
                id="fromEmail" 
                name="email" 
                value={fromAddress.email} 
                onChange={handleFromAddressChange}
                required 
              />
            </div>
          </div>
          
          <div className="address-column">
            <h3>Recipient Address</h3>
            <div className="form-group">
              <label htmlFor="toName">Full Name:</label>
              <input 
                type="text" 
                id="toName" 
                name="name" 
                value={toAddress.name} 
                onChange={handleToAddressChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="toStreet1">Address:</label>
              <input 
                type="text" 
                id="toStreet1" 
                name="street1" 
                value={toAddress.street1} 
                onChange={handleToAddressChange}
                required 
              />
            </div>
              <div className="form-group">
              <label htmlFor="toCity">City:</label>
              <input 
                type="text" 
                id="toCity" 
                name="city" 
                value={toAddress.city} 
                onChange={handleToAddressChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="toState">State/Province:</label>
              <input 
                type="text" 
                id="toState" 
                name="state" 
                value={toAddress.state} 
                onChange={handleToAddressChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="toZip">Postal Code:</label>
              <input 
                type="text" 
                id="toZip" 
                name="zip" 
                value={toAddress.zip} 
                onChange={handleToAddressChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="toCountry">Country:</label>              <select 
                id="toCountry" 
                name="country" 
                value={toAddress.country} 
                onChange={handleToAddressChange}
                required
              >
                <option value="RO">Romania</option>
                <option value="DE">Germany</option>
                <option value="GB">United Kingdom</option>
                <option value="FR">France</option>
                <option value="IT">Italy</option>
                <option value="ES">Spain</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="toPhone">Phone:</label>
              <input 
                type="tel" 
                id="toPhone" 
                name="phone" 
                value={toAddress.phone} 
                onChange={handleToAddressChange}
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="toEmail">Email:</label>
              <input 
                type="email" 
                id="toEmail" 
                name="email" 
                value={toAddress.email} 
                onChange={handleToAddressChange}
                required 
              />
            </div>
          </div>
        </div>
        
        <div className="parcel-details">
          <h3>Parcel Details</h3>
          <div className="parcel-inputs">
            <div className="form-group">
              <label htmlFor="length">Length (cm):</label>
              <input 
                type="number" 
                id="length" 
                name="length" 
                value={parcel.length} 
                onChange={handleParcelChange}
                required 
                min="1"
                step="0.1"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="width">Width (cm):</label>
              <input 
                type="number" 
                id="width" 
                name="width" 
                value={parcel.width} 
                onChange={handleParcelChange}
                required 
                min="1"
                step="0.1"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="height">Height (cm):</label>
              <input 
                type="number" 
                id="height" 
                name="height" 
                value={parcel.height} 
                onChange={handleParcelChange}
                required 
                min="1"
                step="0.1"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="weight">Weight (kg):</label>
              <input 
                type="number" 
                id="weight" 
                name="weight" 
                value={parcel.weight} 
                onChange={handleParcelChange}
                required 
                min="0.1"
                step="0.1"
              />
            </div>
          </div>
        </div>
        
        <button type="submit" className="calculate-btn" disabled={loading}>
          {loading ? 'Calculating...' : 'Calculate Shipping Options'}
        </button>
      </form>
      
      {rates.length > 0 && (
        <div className="shipping-rates">
          <h3>Available Shipping Options</h3>
          <div className="rates-list">
            {rates.map((rate) => (
              <div key={rate.object_id} className="rate-card">
                <div className="rate-provider">{rate.provider}</div>
                <div className="rate-service">{rate.servicelevel.name}</div>
                <div className="rate-price">{rate.amount} {rate.currency}</div>
                <div className="rate-days">
                  {rate.estimated_days === 1 
                    ? '1 day delivery' 
                    : `${rate.estimated_days} days delivery`}
                </div>
                <button className="select-rate-btn">
                  Select This Option
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Delivery;
