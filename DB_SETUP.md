# Database Setup with JSON Server

## Overview
This project uses `json-server` to simulate a REST API with a `db.json` file for development purposes.

## Setup Instructions

### 1. Install json-server globally
```bash
npm install -g json-server
```

### 2. Start the JSON Server
Navigate to the rental_app directory and run:
```bash
json-server --watch db.json --port 3001
```

This will start the server at `http://localhost:3001`

### 3. Start the React App
In another terminal, run:
```bash
npm start
```

## API Endpoints

The JSON server provides the following endpoints:

### Users (Customers)
- `GET /users` - Get all customers
- `POST /users` - Create new customer
- `GET /users/:id` - Get customer by ID
- `PUT /users/:id` - Update customer
- `DELETE /users/:id` - Delete customer

### Providers
- `GET /providers` - Get all providers
- `POST /providers` - Create new provider
- `GET /providers/:id` - Get provider by ID
- `PUT /providers/:id` - Update provider
- `DELETE /providers/:id` - Delete provider

### Equipment
- `GET /equipments` - Get all equipment
- `POST /equipments` - Add new equipment
- `GET /equipments/:id` - Get equipment by ID
- `PUT /equipments/:id` - Update equipment
- `DELETE /equipments/:id` - Delete equipment

### Requests
- `GET /requests` - Get all rental requests
- `POST /requests` - Create new request
- `GET /requests/:id` - Get request by ID
- `PUT /requests/:id` - Update request
- `DELETE /requests/:id` - Delete request

## Data Structure

### User Object
```json
{
  "id": 1,
  "name": "John Customer",
  "email": "customer@example.com",
  "password": "password123",
  "phone": "9876543210",
  "address": "123 Customer Street, City",
  "userType": "customer",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Provider Object
```json
{
  "id": 1,
  "name": "Farm Equipment Provider",
  "email": "provider@example.com",
  "password": "password123",
  "phone": "9876543220",
  "address": "789 Provider Road, Farm City",
  "userType": "provider",
  "businessName": "Green Farm Equipment",
  "licenseNumber": "LIC123456",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Equipment Object
```json
{
  "id": 1,
  "name": "Heavy Duty Tractor",
  "category": "Heavy Machinery",
  "type": "Tractor",
  "description": "Powerful tractor suitable for heavy farming operations",
  "price": 2500,
  "address": "Farm City, State",
  "available": true,
  "providerId": 1,
  "providerEmail": "provider@example.com",
  "specifications": {
    "horsepower": "75 HP",
    "fuelType": "Diesel"
  },
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Request Object
```json
{
  "id": 1,
  "customerId": 1,
  "customerEmail": "customer@example.com",
  "customerName": "John Customer",
  "equipmentId": 1,
  "equipmentName": "Heavy Duty Tractor",
  "providerId": 1,
  "providerEmail": "provider@example.com",
  "providerName": "Farm Equipment Provider",
  "startDate": "2024-02-01",
  "endDate": "2024-02-05",
  "totalDays": 4,
  "pricePerDay": 2500,
  "totalAmount": 10000,
  "status": "pending",
  "message": "Need tractor for plowing 10 acres of land",
  "requestDate": "2024-01-15T10:30:00Z",
  "responseDate": null,
  "responseMessage": null
}
```

## LocalStorage Usage

The frontend uses localStorage only for:
- `userType`: "customer" or "provider"
- `loggedUser`: Contains only `{id, name, email, userType}`

All other data operations are performed through the JSON server API.

## Test Credentials

### Customer Login
- Email: customer@example.com
- Password: password123

### Provider Login
- Email: provider@example.com
- Password: password123
