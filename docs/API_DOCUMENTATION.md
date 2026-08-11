# API DOCUMENTATION
## Fence Depot Fence Estimator Backend API

**Base URL:** `http://localhost:3001`  
**Auth:** All routes except `/health` and `/api/auth/login` require JWT token  
**Header:** `Authorization: ******

---

## HEALTH CHECK

### GET /health
Returns server status.

**Response:**
```json
{ "status": "ok", "timestamp": "2024-08-11T14:30:00.000Z" }
```

---

## AUTHENTICATION — /api/auth

### POST /api/auth/register
Create a new user account (admin only).

**Body:**
```json
{
  "username": "john_smith",
  "email": "john@fencedepot.ca",
  "password": "MyPassword123",
  "role": "estimator",
  "company": "Fence Depot",
  "firstName": "John",
  "lastName": "Smith",
  "phone": "780-555-0100"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "userId": "abc123..."
}
```

**Errors:**
- 400: Username/email already exists, validation failed
- 401: Not authenticated
- 403: Not admin

---

### POST /api/auth/login
Authenticate user and receive JWT token.

**Body:**
```json
{
  "username": "john_smith",
  "password": "MyPassword123"
}
```

**Response (200):**
```json
{
  "token": "******",
  "user": {
    "id": "abc123",
    "username": "john_smith",
    "role": "estimator",
    "company": "Fence Depot"
  }
}
```

**Errors:**
- 401: Invalid credentials

---

### GET /api/auth/me
Get current user info.

**Response (200):**
```json
{
  "id": "abc123",
  "username": "john_smith",
  "email": "john@fencedepot.ca",
  "role": "estimator"
}
```

---

## PROJECTS — /api/projects

### GET /api/projects
List all projects (filtered by user role).

**Query params:**
- `status` — filter by status (draft/estimate/approved/in_progress/completed)
- `page` — page number (default 1)
- `limit` — results per page (default 20)

**Response (200):**
```json
{
  "projects": [...],
  "total": 45,
  "page": 1,
  "pages": 3
}
```

---

### POST /api/projects
Create a new project.

**Body:**
```json
{
  "customerName": "John Smith",
  "customerEmail": "john@email.com",
  "customerPhone": "780-555-0100",
  "address": "123 Main Street",
  "city": "Edmonton",
  "province": "AB",
  "postalCode": "T5A 0A1",
  "projectNotes": "Corner lot, existing chain link to remove"
}
```

**Response (201):**
```json
{
  "message": "Project created",
  "projectId": "PRJ-2024-001",
  "id": "..."
}
```

---

### GET /api/projects/:id
Get single project details.

**Response (200):** Full project object with estimates and specs.

---

### PUT /api/projects/:id
Update project fields.

**Body:** Any updatable project fields.

**Response (200):** Updated project object.

---

### DELETE /api/projects/:id
Delete a draft project (admin only).

**Response (200):** `{ "message": "Project deleted" }`

---

## ESTIMATES — /api/estimates

### GET /api/estimates
List all estimates.

**Query params:** `status`, `projectId`, `page`, `limit`

---

### POST /api/estimates
Create a new estimate.

**Body:**
```json
{
  "projectId": "PRJ-2024-001",
  "customerName": "John Smith",
  "fenceType": "Chain Link",
  "linearFeet": 200,
  "height": 6,
  "materialCost": 1850.00,
  "laborHours": 20,
  "laborRate": 65.00,
  "laborCost": 1300.00,
  "equipmentCost": 0,
  "disposalCost": 0,
  "markupPercent": 20,
  "taxPercent": 5,
  "validUntil": "2024-09-11",
  "notes": "Includes removal of existing fence",
  "lineItems": [
    {
      "productPlu": "CL-F-0348-50",
      "productName": "Chain Link Fabric 48\" x 50ft",
      "quantity": 4,
      "unitCost": 68.50,
      "unitSell": 89.00,
      "lineTotal": 356.00
    }
  ]
}
```

**Response (201):**
```json
{
  "message": "Estimate created",
  "estimateNumber": "EST-2024-001",
  "total": 3948.75
}
```

---

### GET /api/estimates/:id
Get single estimate with all line items.

---

### PUT /api/estimates/:id
Update estimate (only if not pricing-locked).

---

### POST /api/estimates/:id/approve
Approve estimate and lock pricing.

**Response (200):**
```json
{
  "message": "Estimate approved and pricing locked",
  "estimateId": "...",
  "lockedAt": "2024-08-11T14:30:00Z"
}
```

---

### POST /api/estimates/:id/unlock
Unlock pricing on approved estimate (admin only).

---

### POST /api/estimates/:id/email
Email the estimate to the customer.

**Body:**
```json
{
  "recipientEmail": "customer@email.com",
  "message": "Please find your fence estimate attached."
}
```

---

## PRODUCTS — /api/products

### GET /api/products
List all inventory products.

**Query params:**
- `department` — filter by department
- `search` — search in description
- `active` — 1 for active only

**Response (200):**
```json
{
  "products": [
    {
      "plu": "CL-F-0348-50",
      "description": "Chain Link Fabric 3-1/2\" Mesh 48\" x 50ft",
      "department": "Chain Link",
      "unitOfMeasure": "ROLL",
      "costPrice": 68.50,
      "sellPrice": 89.00,
      "onHandQty": 25.0
    }
  ],
  "total": 250
}
```

---

### GET /api/products/:plu
Get single product by PLU code.

---

### PUT /api/products/:plu
Update product price or quantity (admin/estimator).

**Body:**
```json
{
  "sellPrice": 95.00,
  "onHandQty": 20
}
```

---

## CHANGE ORDERS — /api/change-orders

### POST /api/change-orders
Create a new change order.

**Body:**
```json
{
  "projectId": "...",
  "estimateId": "...",
  "requestedBy": "Customer",
  "description": "Add 15ft run on north side",
  "reason": "Customer request at site visit",
  "materialCostDelta": 143.20,
  "laborCostDelta": 100.00
}
```

---

### PUT /api/change-orders/:id/approve
Approve or decline a change order.

**Body:** `{ "action": "approve" }` or `{ "action": "decline", "reason": "Out of scope" }`

---

## PDF — /api/pdf

### GET /api/pdf/estimate/:id
Generate and download a PDF for an estimate.

**Response:** Binary PDF stream (`Content-Type: application/pdf`)

---

## ERROR CODES

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request (validation error) |
| 401 | Unauthorized (not logged in or token expired) |
| 403 | Forbidden (insufficient role) |
| 404 | Not found |
| 409 | Conflict (duplicate record) |
| 423 | Locked (estimate pricing is locked) |
| 500 | Internal server error |
