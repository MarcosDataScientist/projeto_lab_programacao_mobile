# Product and Listing Management Application

Mobile application developed for the completion of the programming laboratory course. The system allows managing products, marketplace listings, and calculating contribution margins.

## 📋 Application Objectives

The application offers the following features:

- **Product Registration**: Product persistence with information such as SKU, name, description, cost, and inventory
- **Smart Search**: Product search by SKU, name, or barcode (with camera reading support)
- **Contribution Margin Calculator**: Calculation of contribution margin based on the registered product cost
- **Listing Management**: Registration of listings by marketplace with display of respective contribution margins
- **Order Margin Calculator**: Calculation of contribution margin for complete orders with multiple products and quantities

## 🛠 Technologies Used

### Database
- **PostgreSQL**: Relational database for data persistence

### Back-end
- **Flask**: Python web framework for REST API creation
- **SQLAlchemy**: ORM (Object-Relational Mapping) for orchestrating database requests
- **Flask-CORS**: Middleware to enable CORS (Cross-Origin Resource Sharing)
- **python-dotenv**: Environment variable management

### Front-end
- **React Native**: Framework for building cross-platform mobile applications
- **Expo CLI**: Tool for mobile development and emulation
- **React Navigation**: Library for navigation between screens
- **Expo Barcode Scanner**: Module for barcode reading via camera
- **Axios**: HTTP client for API communication

## 📁 Project Structure

```
projeto_final/
├── Backend/
│   ├── app.py                 # Main Flask application
│   ├── requirements.txt       # Python dependencies
│   ├── config/
│   │   ├── config.py          # Application configuration
│   │   └── database.py        # Database configuration
│   ├── model/                 # SQLAlchemy models
│   │   ├── product.py
│   │   ├── listing.py
│   │   └── product_annotation.py
│   ├── controller/            # Controllers (Blueprints)
│   │   ├── product_controller.py
│   │   ├── listing_controller.py
│   │   └── order_calculator_controller.py
│   ├── service/               # Business logic
│   │   ├── product_service.py
│   │   └── listing_service.py
│   └── exception/             # Exception handling
│       └── exception_handler.py
├── Frontend/
│   ├── App.js                 # Main component
│   ├── package.json           # Node.js dependencies
│   ├── src/
│   │   ├── screens/           # Application screens
│   │   │   ├── ProductListScreen.js
│   │   │   ├── ProductFormScreen.js
│   │   │   ├── ListingScreen.js
│   │   │   ├── ListingFormScreen.js
│   │   │   ├── OrderCalculatorScreen.js
│   │   │   └── BarcodeScannerScreen.js
│   │   ├── components/        # Reusable components
│   │   │   ├── ProductItem.js
│   │   │   └── ListingItem.js
│   │   └── services/
│   │       └── api.js          # HTTP client configuration
└── Database/
    ├── schema.sql              # Database creation script
    └── modelagem.drawio        # Modeling diagram
```

## 🚀 How to Use the Application

> **⚠️ Important:** This project requires **two separate `.env` files**:
> - One in `Backend/.env` - for database and server configuration
> - One in `Frontend/.env` - for API URL configuration
> 
> Both files are required and must be created manually. See the setup sections below for details.

### Prerequisites

- Python 3.8+ (with Conda for environment management)
- Node.js 16+ and npm
- PostgreSQL installed and running
- Expo CLI installed globally (`npm install -g expo-cli`)

### Backend Setup

1. **Create virtual environment with Conda:**
   ```bash
   conda create -n projeto_final_japa python=3.13
   conda activate projeto_final_japa
   ```

2. **Install dependencies:**
   ```bash
   cd Backend
   pip install -r requirements.txt
   ```

3. **Configure environment variables:**
   Create a `.env` file in the `Backend/` folder with the following content:
   ```env
   # DATABASE CONFIG
   DATA_BASE_URL=localhost:5432/database_name
   DATA_BASE_USER=your_user
   DATA_BASE_PASSWORD=your_password

   # BACKEND CONFIG
   BACKEND_PORT=5000
   ```
   
   > **Important:** This `.env` file is for the Backend configuration. You will also need to create another `.env` file in the Frontend folder (see Frontend Setup section below).

4. **Create the database:**
   Execute the `schema.sql` script in PostgreSQL to create the tables:
   ```bash
   psql -U your_user -d database_name -f ../Database/schema.sql
   ```

5. **Run the server:**
   ```bash
   python app.py
   ```
   The server will be available at `http://localhost:5000`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd Frontend
   npm install
   ```

2. **Configure API URL:**
   Create a `.env` file in the `Frontend/` folder with the following content:
   ```env
   API_BASE_URL=http://192.168.0.8:5000/api
   ```
   > **Note**: 
   > - Replace `192.168.0.8` with your machine's IP address on the local network. To find your IP on Windows, run `ipconfig` in PowerShell and look for "IPv4 Address".
   > - The port `5000` must match the `BACKEND_PORT` configured in the Backend `.env` file.
   > - **Important:** This is a separate `.env` file from the Backend one. You need **two `.env` files**: one in `Backend/` and one in `Frontend/`.

3. **Run the application:**
   ```bash
   npm start
   ```
   Then, choose one of the options:
   - Press `a` to open in Android Emulator
   - Press `i` to open in iOS Simulator
   - Scan the QR code with the Expo Go app on your physical device

## 📱 Application Features

### 1. Product Management
- List all registered products
- Search products by SKU, name, or barcode
- Register new products
- Edit existing products
- Delete products
- Calculate contribution margin in the registration form

### 2. Barcode Scanner
- Access device camera
- Scan barcodes
- Use scanned code to search for products

### 3. Listing Management
- List all registered listings
- Register new listings linked to products
- Edit existing listings
- Delete listings
- View contribution margin for each listing

### 4. Order Margin Calculator
- Add multiple products to the order
- Define quantities and unit prices
- Calculate total order contribution margin
- View item details and general summary

## 🔧 API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products?search={term}` - Search products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `POST /api/products/{id}/contribution-margin` - Calculate contribution margin

### Listings
- `GET /api/listings` - List all listings
- `GET /api/listings?product_id={id}` - List listings by product
- `GET /api/listings?marketplace={name}` - List listings by marketplace
- `GET /api/listings/{id}` - Get listing by ID
- `POST /api/listings` - Create listing
- `PUT /api/listings/{id}` - Update listing
- `DELETE /api/listings/{id}` - Delete listing

### Order Calculator
- `POST /api/order-calculator/calculate` - Calculate order margin

## 📊 Data Model

The database has three main tables:

1. **product**: Stores product information
2. **listing**: Stores listings linked to products (1:N relationship)
3. **product_annotation**: Stores product annotations (weak entity)

## 🐛 Troubleshooting

### Backend cannot connect to database
- Check if PostgreSQL is running
- Verify credentials in the `.env` file
- Verify that the database was created

### Frontend cannot connect to API
- Check if the backend is running
- Verify the IP configured in the Frontend `.env` file
- Make sure the device/emulator is on the same network

### Error scanning barcode
- Check if camera permissions were granted
- On emulator, you may need to configure a virtual camera

## 📝 Development Notes

This project was developed using concepts and examples provided in the programming laboratory course classes, including:
- React Native basics
- React Native navigation
- Hooks and back-end integration
- Multi-platform APIs

## 👨‍💻 Author

Developed as the final project for the programming laboratory course.
