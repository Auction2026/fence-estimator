# API DOCUMENTATION
## Fence Depot Fence Estimator - Backend API Reference

**Base URL:** `http://localhost:3000/api`  
**Authentication:** ****** in Authorization header  
**Format:** JSON request/response

---

## AUTHENTICATION

### Register New User
```
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "username": "john_estimator",
  "email": "john@fencedepot.com",
  "password": "securepassword",
  "company": "Fence Depot",
  "phone": "555-555-5555"
}

Response 201:
{
  "success": true,
  "message": "User created successfully",
  "userId": "507f1f77bcf86cd799439011"
}

Response 400 (duplicate email):
{
  "success": false,
  "message": "Email already registered"
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "john@fencedepot.com",
  "password": "securepassword"
}

Response 200:
{
  "success": true,
  "token": "******",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_estimator",
    "email": "john@fencedepot.com",
    "role": "estimator",
    "company": "Fence Depot"
  }
}

Response 401:
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

## PROJECTS

All project endpoints require: `Authorization: ****** <token>`

### List All Projects
```
GET /api/projects

Query Parameters:
  ?status=new          Filter by status
  ?page=1&limit=20     Pagination
  ?search=smith        Search by customer name

Response 200:
{
  "success": true,
  "projects": [
    {
      "_id": "507f191e810c19729de860ea",
      "projectNumber": "PE-2026-0001",
      "customerName": "John Smith",
      "customerEmail": "john@email.com",
      "customerPhone": "555-123-4567",
      "address": "123 Main St",
      "city": "Anytown",
      "state": "TX",
      "zip": "75001",
      "status": "estimated",
      "createdAt": "2026-01-15T10:30:00Z",
      "updatedAt": "2026-01-16T14:00:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "pages": 3
}
```

### Create Project
```
POST /api/projects
Content-Type: application/json

Request Body:
{
  "customerName": "John Smith",
  "customerEmail": "john@email.com",
  "customerPhone": "555-123-4567",
  "address": "123 Main St",
  "city": "Anytown",
  "state": "TX",
  "zip": "75001",
  "projectName": "Backyard Fence - Smith Residence"
}

Response 201:
{
  "success": true,
  "project": {
    "_id": "507f191e810c19729de860ea",
    "projectNumber": "PE-2026-0001",
    "customerName": "John Smith",
    "status": "new",
    "createdAt": "2026-01-15T10:30:00Z"
  }
}
```

### Get Single Project
```
GET /api/projects/:id

Response 200:
{
  "success": true,
  "project": { ...complete project object... }
}

Response 404:
{
  "success": false,
  "message": "Project not found"
}
```

### Update Project
```
PUT /api/projects/:id
Content-Type: application/json

Request Body: (any fields to update)
{
  "status": "estimated",
  "customerPhone": "555-999-9999"
}

Response 200:
{
  "success": true,
  "project": { ...updated project... }
}
```

### Delete Project
```
DELETE /api/projects/:id

Response 200:
{
  "success": true,
  "message": "Project deleted"
}
```

---

## ESTIMATES

### List Estimates for a Project
```
GET /api/estimates?projectId=507f191e810c19729de860ea

Response 200:
{
  "success": true,
  "estimates": [
    {
      "_id": "...",
      "estimateNumber": "EST-2026-0001",
      "projectId": "...",
      "materialsTotal": 2650.00,
      "laborTotal": 2160.00,
      "equipmentTotal": 350.00,
      "subtotal": 5160.00,
      "taxRate": 8.5,
      "taxAmount": 438.60,
      "total": 5598.60,
      "status": "draft",
      "lineItems": [...],
      "createdAt": "..."
    }
  ]
}
```

### Create Estimate
```
POST /api/estimates
Content-Type: application/json

Request Body:
{
  "projectId": "507f191e810c19729de860ea",
  "materialsTotal": 2650.00,
  "laborTotal": 2160.00,
  "equipmentTotal": 350.00,
  "taxRate": 8.5,
  "lineItems": [
    {
      "category": "materials",
      "description": "6ft Chain Link Fabric 11.5ga",
      "quantity": 4,
      "unit": "roll",
      "unitCost": 85.00,
      "totalCost": 340.00
    }
  ]
}

Response 201:
{
  "success": true,
  "estimate": { ...complete estimate object... }
}
```

---

## CONTRACTS

### Create Contract
```
POST /api/contracts
Content-Type: application/json

Request Body:
{
  "projectId": "...",
  "estimateId": "...",
  "terms": "Payment due upon completion. 50% deposit required to start.",
  "paymentSchedule": "50% deposit, 50% on completion",
  "startDate": "2026-02-01",
  "completionDate": "2026-02-05"
}

Response 201:
{
  "success": true,
  "contract": {
    "_id": "...",
    "contractNumber": "C-2026-0001",
    "status": "draft",
    ...
  }
}
```

### Generate Contract PDF
```
GET /api/contracts/:id/pdf

Response: PDF file download (application/pdf)
```

---

## CHANGE ORDERS

### List Change Orders
```
GET /api/change-orders?projectId=...

Response 200:
{
  "success": true,
  "changeOrders": [
    {
      "_id": "...",
      "coNumber": "CO-001",
      "description": "Add 25 LF fence and 1 gate",
      "total": 1280.00,
      "status": "pending"
    }
  ]
}
```

### Create Change Order
```
POST /api/change-orders
Content-Type: application/json

Request Body:
{
  "projectId": "...",
  "contractId": "...",
  "description": "Add 25 LF fence along east side",
  "lineItems": [...],
  "total": 1280.00
}
```

---

## NOTES

### List Notes
```
GET /api/notes?projectId=...

Response 200:
{
  "success": true,
  "notes": [
    {
      "_id": "...",
      "category": "site-visit",
      "content": "Measured east fence line. Soil is rocky.",
      "createdAt": "...",
      "createdBy": { "username": "john_estimator" }
    }
  ]
}
```

### Create Note
```
POST /api/notes
Content-Type: application/json

Request Body:
{
  "projectId": "...",
  "category": "site-visit",
  "content": "Measured east fence line. Soil is rocky."
}
```

---

## INVENTORY/PRODUCTS

### List Products
```
GET /api/inventory

Query Parameters:
  ?category=fabric     Filter by category
  ?search=chain+link   Search by name
  ?page=1&limit=50

Response 200:
{
  "success": true,
  "products": [
    {
      "_id": "...",
      "sku": "CL-6-11.5GA",
      "name": "Chain Link Fabric 6ft x 50ft 11.5ga Galvanized",
      "category": "fabric",
      "unit": "roll",
      "cost": 65.00,
      "price": 85.00
    }
  ]
}
```

### Add/Update Product (Admin only)
```
POST /api/inventory
PUT /api/inventory/:id
```

---

## SIGN-OFFS

### Save Sign-Off
```
POST /api/sign-offs
Content-Type: application/json

Request Body:
{
  "projectId": "...",
  "type": "completion",
  "signatureData": "data:image/png;base64,...",
  "signedBy": "John Smith",
  "notes": "Work completed to satisfaction"
}
```

---

## ERROR CODES

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (not logged in) |
| 403 | Forbidden (no permission) |
| 404 | Not Found |
| 500 | Server Error (check logs) |

---

## AUTHENTICATION HEADER

Every API call (except login/register) must include:
```
Authorization: ****** ******
```

The token is returned when you login and should be stored in localStorage.

---

*API Documentation - Fence Depot Fence Estimator v1.0*
