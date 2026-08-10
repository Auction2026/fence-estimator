# API Documentation

Base URL: `http://localhost:5000`

> `backend/server.js` currently exposes authentication, projects, estimates, contracts, and health endpoints. Change-order and sign-off MongoDB models exist, but there are no live Express routes for them yet, so direct calls return `404 Not Found`.

## Authentication

### POST `/api/auth/register`
Register a new user.

**Request**
```json
{
  "username": "estimator1",
  "email": "estimator1@example.com",
  "password": "StrongPassword123!",
  "role": "estimator",
  "company": "Fence Depot",
  "phone": "+1-613-555-0101"
}
```

**Success response**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "<jwt>",
  "user": {
    "id": "66b7b8d7d9e0f12345678901",
    "username": "estimator1",
    "email": "estimator1@example.com",
    "role": "estimator",
    "company": "Fence Depot"
  }
}
```

### POST `/api/auth/login`
Authenticate an existing user.

**Request**
```json
{
  "email": "estimator1@example.com",
  "password": "StrongPassword123!"
}
```

**Success response**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "<jwt>",
  "user": {
    "id": "66b7b8d7d9e0f12345678901",
    "username": "estimator1",
    "email": "estimator1@example.com",
    "role": "estimator",
    "company": "Fence Depot"
  }
}
```

### GET `/api/auth/me`
Return the authenticated user profile.

**Headers**
```http
Authorization: ******
```

**Success response**
```json
{
  "success": true,
  "user": {
    "_id": "66b7b8d7d9e0f12345678901",
    "username": "estimator1",
    "email": "estimator1@example.com",
    "role": "estimator",
    "company": "Fence Depot",
    "phone": "+1-613-555-0101",
    "createdAt": "2026-08-10T20:10:00.000Z",
    "updatedAt": "2026-08-10T20:10:00.000Z"
  }
}
```

## Projects

### POST `/api/projects`
Create a project.

**Headers**
```http
Authorization: ******
Content-Type: application/json
```

**Request**
```json
{
  "customerName": "John Smith",
  "customerEmail": "john.smith@example.com",
  "customerPhone": "+1-613-555-0123",
  "address": "123 Main St",
  "city": "Cornwall",
  "province": "ON",
  "postalCode": "K6H1A1",
  "propertySize": "100 x 140 ft",
  "projectNotes": "Rear-yard chain link replacement."
}
```

**Success response**
```json
{
  "success": true,
  "message": "Project created successfully",
  "project": {
    "projectId": "PRJ-1723333333333",
    "customerName": "John Smith",
    "customerEmail": "john.smith@example.com",
    "customerPhone": "+1-613-555-0123",
    "address": "123 Main St",
    "city": "Cornwall",
    "province": "ON",
    "postalCode": "K6H1A1",
    "propertySize": "100 x 140 ft",
    "projectNotes": "Rear-yard chain link replacement.",
    "status": "draft",
    "estimator": "66b7b8d7d9e0f12345678901"
  }
}
```

### GET `/api/projects`
List projects for the authenticated estimator.

**Headers**
```http
Authorization: ******
```

**Success response**
```json
{
  "success": true,
  "count": 1,
  "projects": [
    {
      "projectId": "PRJ-1723333333333",
      "customerName": "John Smith",
      "status": "draft",
      "city": "Cornwall",
      "province": "ON",
      "estimator": {
        "username": "estimator1",
        "email": "estimator1@example.com",
        "company": "Fence Depot"
      }
    }
  ]
}
```

### GET `/api/projects/:projectId`
Fetch one project by business identifier.

**Example**
```http
GET /api/projects/PRJ-1723333333333
Authorization: ******
```

**Success response**
```json
{
  "success": true,
  "project": {
    "projectId": "PRJ-1723333333333",
    "customerName": "John Smith",
    "customerEmail": "john.smith@example.com",
    "customerPhone": "+1-613-555-0123",
    "address": "123 Main St",
    "city": "Cornwall",
    "province": "ON",
    "postalCode": "K6H1A1",
    "propertySize": "100 x 140 ft",
    "projectNotes": "Rear-yard chain link replacement.",
    "status": "draft"
  }
}
```

### PUT `/api/projects/:projectId`
Update an existing project.

**Request**
```json
{
  "propertySize": "110 x 140 ft",
  "projectNotes": "Rear-yard chain link replacement with one 4 ft gate.",
  "status": "estimate"
}
```

**Success response**
```json
{
  "success": true,
  "message": "Project updated successfully",
  "project": {
    "projectId": "PRJ-1723333333333",
    "propertySize": "110 x 140 ft",
    "projectNotes": "Rear-yard chain link replacement with one 4 ft gate.",
    "status": "estimate"
  }
}
```

### DELETE `/api/projects/:projectId`
Not implemented in `backend/server.js`.

**Current response**
```json
{
  "error": "Not Found",
  "message": "Endpoint DELETE /api/projects/PRJ-1723333333333 not found"
}
```

## Estimates

### POST `/api/estimates`
Create an estimate and return a price breakdown.

**Request**
```json
{
  "projectId": "PRJ-1723333333333",
  "customerName": "John Smith",
  "fenceType": "Chain Link",
  "linearFeet": 100,
  "height": 60,
  "barchedWire": false,
  "installationType": "Residential",
  "laborRate": 50,
  "permitCost": 150,
  "utilityCost": 60,
  "contingency": 125,
  "notes": "Black chain link, one walk gate."
}
```

**Success response**
```json
{
  "success": true,
  "message": "Estimate created successfully",
  "estimate": {
    "estimateNumber": "EST-1723333334444",
    "projectId": "PRJ-1723333333333",
    "customerName": "John Smith",
    "fenceType": "Chain Link",
    "linearFeet": 100,
    "height": 60,
    "materialCost": 1725,
    "laborHours": 20,
    "laborRate": 50,
    "laborCost": 1000,
    "equipmentCost": 150,
    "permitCost": 150,
    "utilityCost": 60,
    "contingency": 125,
    "subtotal": 3210,
    "tax": 417.3,
    "total": 3627.3,
    "status": "draft"
  },
  "breakdown": {
    "materials": 1725,
    "labor": 1000,
    "equipment": 150,
    "permits": 150,
    "utilities": 60,
    "contingency": 125,
    "subtotal": 3210,
    "tax": 417.3,
    "total": 3627.3
  }
}
```

### GET `/api/estimates/:projectId`
List estimates for a project.

**Example**
```http
GET /api/estimates/PRJ-1723333333333
Authorization: ******
```

**Success response**
```json
{
  "success": true,
  "count": 1,
  "estimates": [
    {
      "estimateNumber": "EST-1723333334444",
      "projectId": "PRJ-1723333333333",
      "total": 3627.3,
      "status": "draft",
      "estimator": {
        "username": "estimator1",
        "email": "estimator1@example.com"
      }
    }
  ]
}
```

## Contracts

### POST `/api/contracts`
Create a contract from an estimate and lock the price.

**Request**
```json
{
  "estimateNumber": "EST-1723333334444",
  "projectId": "PRJ-1723333333333",
  "customerName": "John Smith",
  "scopeOfWork": "Install 100 linear feet of 5 ft black chain link fence.",
  "depositAmount": 900,
  "warranty": "2 years on materials, 1 year on labor",
  "terms": "Deposit due upon signing. Balance due upon completion."
}
```

**Success response**
```json
{
  "success": true,
  "message": "🔒 Contract created successfully. PRICING IS NOW LOCKED!",
  "contract": {
    "contractNumber": "CON-1723333335555",
    "estimateNumber": "EST-1723333334444",
    "projectId": "PRJ-1723333333333",
    "customerName": "John Smith",
    "totalPrice": 3627.3,
    "priceLocked": true,
    "depositAmount": 900,
    "status": "pending"
  },
  "warning": "The price in this contract is LOCKED and cannot be changed without a Change Order"
}
```

### GET `/api/contracts/:projectId`
List contracts for a project.

**Success response**
```json
{
  "success": true,
  "count": 1,
  "contracts": [
    {
      "contractNumber": "CON-1723333335555",
      "estimateNumber": "EST-1723333334444",
      "projectId": "PRJ-1723333333333",
      "totalPrice": 3627.3,
      "priceLocked": true,
      "status": "pending"
    }
  ]
}
```

## Change orders
No change-order REST endpoints are currently implemented in `backend/server.js`.

**Current behavior**
```http
POST /api/change-orders
```
```json
{
  "error": "Not Found",
  "message": "Endpoint POST /api/change-orders not found"
}
```

## Sign-offs
No sign-off REST endpoints are currently implemented in `backend/server.js`.

**Current behavior**
```http
POST /api/sign-offs
```
```json
{
  "error": "Not Found",
  "message": "Endpoint POST /api/sign-offs not found"
}
```

## Health

### GET `/api/health`
Basic process health response.

**Success response**
```json
{
  "status": "OK",
  "timestamp": "2026-08-10T22:00:00.000Z",
  "uptime": 1842.503
}
```
