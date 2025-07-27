# Bazaar Setu Platform

A comprehensive marketplace platform connecting suppliers, vendors, and administrators.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Available Scripts](#available-scripts)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before setting up the project, make sure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS version)
- [MongoDB Community Edition](https://www.mongodb.com/try/download/community)

## Installation

1. Clone or copy the project folder
```bash
# Navigate to the project directory
cd "path/to/Bazaar Setu"

# Install dependencies
npm install
```

## Environment Configuration

1. Create a `.env` file in the root directory
2. Add the following configuration:
```env
# Server Configuration
PORT=5000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/bazaar-setu

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d

# Email Configuration (if using nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
```
3. Update the values according to your setup

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:5000
- API Endpoints: http://localhost:5000/api/

## Project Structure
```
Bazaar Setu/
├── middleware/        # Express middleware
│   └── auth.js       # Authentication middleware
├── models/           # MongoDB models
│   ├── Complaint.js
│   ├── Order.js
│   ├── Product.js
│   └── User.js
├── public/           # Static files
│   └── index.html
├── routes/           # API routes
│   ├── admin.js
│   ├── auth.js
│   ├── supplier.js
│   └── vendor.js
├── uploads/          # File uploads directory
├── .env             # Environment variables
├── package.json     # Project dependencies
├── README.md        # Project documentation
└── server.js        # Application entry point
```

## API Endpoints

### Authentication Routes
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login

### Admin Routes
- Base URL: `/api/admin/`
- Protected routes requiring admin authentication

### Vendor Routes
- Base URL: `/api/vendor/`
- Protected routes requiring vendor authentication

### Supplier Routes
- Base URL: `/api/supplier/`
- Protected routes requiring supplier authentication

## Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with auto-reload (using nodemon)

## Troubleshooting

### MongoDB Connection Issues
1. Verify MongoDB service is running:
   ```bash
   # Windows
   net start MongoDB
   ```
2. Check MongoDB connection string in .env file
3. Ensure MongoDB port (27017) is not blocked
4. Try connecting using MongoDB Compass to verify database accessibility

### Server Start Issues
1. Check if the specified port is available
2. Verify all environment variables are set correctly
3. Look for error messages in the console

### Dependency Installation Issues
If you encounter problems during `npm install`:
```bash
# Remove existing dependencies
rm -rf node_modules
rm package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install
```

## Database Management

The MongoDB database will be automatically created with the following structure:
- Database Name: bazaar-setu
- Collections:
  - users
  - products
  - orders
  - complaints

## Dependencies

### Main Dependencies
- express - Web framework
- mongoose - MongoDB object modeling
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- cors - Cross-origin resource sharing
- dotenv - Environment variables
- nodemailer - Email functionality

### Development Dependencies
- nodemon - Auto-reload during development

## Contributing

1. Create a `.gitignore` file before committing:
```
node_modules/
.env
uploads/*
!uploads/.gitkeep
```

## License

This project is licensed under the MIT License.
