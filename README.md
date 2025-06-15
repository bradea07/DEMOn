# EcoSwap - Sustainable Marketplace & Recycling Platform

A comprehensive web application that combines an eco-friendly marketplace with recycling services. This project integrates multiple technologies including React.js frontend, Spring Boot backend, Google Maps API, OpenStreetMap data, and Shippo API for shipping and delivery services.

![EcoSwap Platform](https://example.com/screenshot.png)

## 🚀 Features

### Recycling Points Finder
- **Location-Based Search**: Find recycling points near your current location or any searched address
- **Interactive Map**: Visual display of recycling points with custom markers
- **Detailed Information**: View what materials each recycling point accepts
- **Optimal Routes**: Get walking directions to the nearest recycling point

### Delivery & Shipping System
- **Shipping Calculator**: Calculate shipping costs for different carriers and services
- **Address Management**: Save and manage sender and recipient addresses
- **Package Dimensions**: Specify package size and weight for accurate quotes
- **Multiple Shipping Options**: Compare rates across different carriers
- **Shipment Tracking**: Generate tracking numbers for packages
- **Email Notifications**: Automatic email confirmations for both sender and recipient

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v14.0 or higher)
- npm (v6.0 or higher)
- Java 17 or higher
- Maven
- MySQL Database

### API Keys Required:
- **Google Maps API Key** with the following APIs enabled:
  - Maps JavaScript API
  - Places API
  - Directions API
  - Geocoding API
- **Shippo API Key** for shipping features (create a free account at [goshippo.com](https://goshippo.com))

## 🔧 Installation

### Setting Up the Project

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/ecoswap.git
cd ecoswap
```

### Frontend Setup

1. **Navigate to the frontend directory**

```bash
cd frontend
```

2. **Install dependencies**

```bash
npm install
```

> **Important Note:** This command will generate the `node_modules` folder with all required dependencies based on package.json. The node_modules folder is intentionally excluded from the repository due to its large size.

3. **Create environment file for API keys**

Create a `.env` file in the frontend directory:

```
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_SHIPPO_API_KEY=your_shippo_api_key
```

### Backend Setup

1. **Navigate to the backend directory**

```bash
cd backend
```

2. **Install Maven dependencies**

```bash
mvn install
```

> **Important Note:** This command will download all required dependencies specified in the pom.xml file and generate the `target` folder. The target folder is excluded from the repository.

3. **Setup MySQL database**

Create a MySQL database named "ecoswap" and configure the connection in `application.properties`

## ⚙️ Configuration

### API Keys

#### Google Maps API

The application uses Google Maps API for maps, directions, and places functionality.

**How to obtain a Google Maps API Key:**
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Dashboard"
4. Click "ENABLE APIS AND SERVICES"
5. Search for and enable these APIs:
   - Maps JavaScript API
   - Places API
   - Directions API
   - Geocoding API
6. Go to "APIs & Services" > "Credentials"
7. Click "CREATE CREDENTIALS" > "API key"
8. Copy your new API key

**Where to add your API key:**

Option 1: Using Environment Variables (Recommended)
1. Create a `.env` file in the frontend directory
2. Add your Google Maps API key:

```
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
```

Option 2: Direct in Code
1. Open `src/components/Map.js`
2. Find the `LoadScript` component (around line 760)
3. Replace the `googleMapsApiKey` value with your API key:

```javascript
<LoadScript
  googleMapsApiKey="YOUR_API_KEY_HERE"
  libraries={["places", "geometry"]}
>
```

**Securing your API Key:**
- In Google Cloud Console, go to "APIs & Services" > "Credentials"
- Click on your API key and set restrictions:
  - HTTP referrers (websites): Add your domain
  - API restrictions: Restrict to only the APIs you're using

#### Shippo API

The application uses Shippo API for shipping and delivery functionality.

**How to obtain a Shippo API Key:**
1. Go to [goshippo.com](https://goshippo.com) and create a free account
2. After logging in, navigate to "API" section in the dashboard
3. Click on "API Keys" in the left menu
4. Generate a new Test API token (for development) or Live API token (for production)
5. Copy your API key

**Where to add your Shippo API key:**

For frontend:
1. Open `src/components/Delivery.js`
2. Replace the API token in the headers:

```javascript
headers: {
  'Authorization': 'ShippoToken YOUR_SHIPPO_API_KEY_HERE',
  'Content-Type': 'application/json'
}
```

For backend:
1. Open `src/main/java/com/ecoswap/controller/ShippingController.java`
2. Replace the API key value:

```java
private final String SHIPPO_API_KEY = "YOUR_SHIPPO_API_KEY_HERE";
```

**Testing vs. Production:**
- Test API keys (starting with "shippo_test_") are for development only
- Live API keys (starting with "shippo_live_") should be used in production
- Test mode creates test labels that cannot be used for actual shipping

### Database Configuration

Configure the MySQL database connection in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecoswap
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

> **Note**: For security reasons, it's recommended to use environment variables instead of hardcoding your API keys and database credentials.

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start the backend server**

```bash
# For Windows
cd backend
mvnw spring-boot:run

# For Linux/Mac
cd backend
./mvnw spring-boot:run
```

This will start the Spring Boot application on port 8080.

2. **Start the frontend development server**

```bash
cd frontend
npm start
```

The React application will start on port 3000 and automatically open in your default browser.

### Production Build

To create a production build:

```bash
# Build the backend
cd backend
mvn clean package

# Build the frontend
cd frontend
npm run build
```

The frontend build files will be created in the `frontend/build` directory. You can deploy the Spring Boot JAR file (`backend/target/ecoswap-0.0.1-SNAPSHOT.jar`) to serve both the API and frontend files.

### Accessing the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api

### Troubleshooting Common Issues

- **Node.js version**: Ensure you're using Node.js v14+ (`node -v` to check)
- **Port conflicts**: Make sure ports 3000 and 8080 are not in use
- **API Key errors**: Verify your Google Maps and Shippo API keys are correctly set up
- **Database connection**: Check your MySQL is running and credentials are correct
- **Path issues**: Make sure you're in the correct directory when running commands

## 🧭 How to Use the Application

### Recycling Points Finder

1. **Finding Recycling Points**
   - Navigate to the Recycling Points page
   - You'll see a map centered on New York City by default
   - Enter a location in the search box or use your current position
   - Recycling points will appear as green markers on the map

2. **Viewing Details**
   - Click on any green marker to see details about the recycling point
   - The info window shows the name, accepted materials, and distance

3. **Getting Directions**
   - After selecting a recycling point, click "Get Shortest Path"
   - The application will show a walking route from your location to the recycling point

4. **Finding the Nearest Point**
   - Click "Find Nearest Recycling Point" to automatically locate the closest facility
   - The nearest point will be highlighted with a yellow marker

### Delivery Calculator

1. **Setting Up a Shipment**
   - Navigate to the Delivery page
   - Fill in the sender's information (name, address, etc.)
   - Fill in the recipient's information
   - Enter the package dimensions and weight
   
2. **Calculating Shipping Options**
   - Click "Calculate Shipping Options"
   - The system will contact Shippo API and display available shipping methods
   - Each option shows the carrier, service level, price, and estimated delivery time

3. **Confirming Shipment**
   - Select your preferred shipping option
   - Click "Proceed to Confirmation"
   - Type "CONFIRM" in the confirmation field
   - Click "Confirm and Call Courier"
   
4. **Tracking & Notifications**
   - After confirmation, both sender and recipient receive email confirmations
   - The sender email contains pickup information
   - The recipient email contains delivery information

## 🛠️ Technical Details

### APIs Used

- **Google Maps JavaScript API**: For map display and interaction
- **Google Places API**: For location search and autocomplete
- **Google Directions API**: For calculating walking routes
- **OpenStreetMap Overpass API**: For fetching recycling point data
- **Shippo API**: For shipping calculations, rates comparison, and label generation

### Architecture

The application uses a full-stack architecture:

#### Frontend
- **React.js** frontend with functional components and hooks for state management
- Key components:
  - `MapComponent`: Handles map display and recycling points
  - `Delivery`: Handles shipping calculator and confirmation

#### Backend
- **Spring Boot** application with RESTful API endpoints
- **MySQL** database for persistent storage
- Key components:
  - `ShippingController`: Integrates with Shippo API
  - `ShippingService`: Handles business logic for shipping operations
  - `MailService`: Sends confirmation emails

### Data Structures

#### Recycling Points
```javascript
{
  id: "string",
  name: "string",
  position: {
    lat: number,
    lng: number
  },
  description: "string",
  acceptedMaterials: "string",
  isRecyclingPoint: boolean,
  distanceMeters: number,
  distanceFromUser: "string" // in km
}
```

#### Shipping Transaction
```java
{
  id: Long,
  transactionNumber: "string",
  amount: "string",
  currency: "string",
  shipmentId: "string",
  provider: "string",
  service: "string",
  estimatedDays: number,
  // Sender details
  fromName: "string",
  fromStreet: "string",
  fromCity: "string",
  // ... other address fields
  // Recipient details  
  toName: "string",
  toStreet: "string",
  toCity: "string",
  // ... other address fields
  // Package details
  parcelLength: "string",
  parcelWidth: "string",
  parcelHeight: "string",
  parcelWeight: "string"
}
```

## 🔒 Security Notes

- The Google Maps API key should be restricted to your domain to prevent unauthorized use
- The Shippo API key should be kept secure and not exposed in client-side code
- The application uses browser geolocation which requires user permission
- Personal data from shipping forms is stored in the database and used for email notifications
- Standard security practices for Spring Boot applications should be applied (CSRF protection, secure cookies, etc.)

## ⚠️ Troubleshooting

### Map Issues
- **Map Not Loading**: Check that your Google Maps API key is correct and has all required APIs enabled
- **No Recycling Points Found**: Try searching in a more populated area or increase search radius
- **Location Not Working**: Ensure you've granted location permissions in your browser

### Shipping Issues
- **No Shipping Rates Displayed**: Verify your Shippo API key is active and correctly configured
- **Address Validation Errors**: Ensure complete and valid addresses are entered
- **Email Notifications Not Received**: Check spam folder and verify the email service configuration
- **Test Mode Notice**: By default, the application uses Shippo's test API key, so no real shipments are created

### Backend Issues
- **Database Connection Errors**: Check your MySQL connection settings in application.properties
- **API 500 Errors**: Check server logs for detailed exception information
- **Email Service Failures**: Verify SMTP settings and credentials

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenStreetMap contributors for the recycling point data
- Google Maps for the mapping and directions functionality
- Shippo for the shipping API and documentation
- React.js and Spring Boot teams for the excellent frameworks
- West University of Timișoara for academic guidance


```

