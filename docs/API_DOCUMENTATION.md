
# API Documentation

Base URL: `http://localhost:3001/api`

## Conventions
- Content type: `application/json`
- Auth: Use an `Authorization` header with a JWT for protected routes
- Success envelope usually includes `success: true`
- Error envelope usually includes `error` and `message`

## Authentication Endpoints

### POST /api/auth/login
**Description:** Authenticates a user and returns a JWT.

**Request body**
```json
{
  "email": "admin@fencedepot.local",
  "password": "ChangeMe123!"
}
```

**Success response**
```json
{
  "success": true,
  "token": "<jwt>",
  "user": {
    "id": "uuid",
    "email": "admin@fencedepot.local",
    "role": "admin"
  }
}
```

### POST /api/auth/logout
**Description:** Ends the current session on the client and optionally invalidates a server-side session record or token family.

**Request body**
```json
{}
```

**Success response**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### GET /api/auth/me
**Description:** Returns the current authenticated user profile.

**Headers**
```text
Authorization: ******
```

**Success response**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "admin@fencedepot.local",
    "role": "admin",
    "first_name": "Fence",
    "last_name": "Admin"
  }
}
```

---

## Project Endpoints

### GET /api/projects
**Description:** Returns the authenticated user’s project list.

**Query options**
- `status`
- `page`
- `pageSize`
- `search`

**Success response**
```json
{
  "success": true,
  "count": 1,
  "projects": [
    {
      "id": "uuid",
      "customer_name": "Pat Example",
      "status": "estimated"
    }
  ]
}
```

### POST /api/projects
**Description:** Creates a new project shell.

**Request body**
```json
{
  "customerName": "Pat Example",
  "customerEmail": "pat@example.com",
  "customerPhone": "555-0100",
  "address": "100 Main St",
  "city": "Calgary",
  "province": "AB",
  "postalCode": "T1T1T1",
  "projectNotes": "Corner lot with existing gate"
}
```

**Success response**
```json
{
  "success": true,
  "project": {
    "id": "uuid",
    "project_number": "PRJ-1001",
    "status": "draft"
  }
}
```

### GET /api/projects/:id
**Description:** Returns one project with summary relationships.

### PUT /api/projects/:id
**Description:** Updates project information.

**Request body (example)**
```json
{
  "customerPhone": "555-0101",
  "status": "active"
}
```

### DELETE /api/projects/:id
**Description:** Soft-deletes or archives a project, depending on business rules.

**Success response**
```json
{
  "success": true,
  "message": "Project archived"
}
```

---

## Fence Specs Endpoints

### GET /api/projects/:id/specs
**Description:** Returns the current fence specification record for a project.

### POST /api/projects/:id/specs
**Description:** Creates a fence specification record.

**Request body**
```json
{
  "fenceType": "Wood Privacy",
  "height": 72,
  "linearFeet": 185,
  "numberPosts": 24,
  "numberGates": 2,
  "installationType": "Residential",
  "color": "Natural Cedar"
}
```

### PUT /api/projects/:id/specs
**Description:** Updates the project’s fence specs.

---

## Estimate Endpoints

### GET /api/projects/:id/estimates
**Description:** Lists all estimates for a project.

### POST /api/projects/:id/estimates
**Description:** Creates a new estimate and returns a cost breakdown.

**Request body**
```json
{
  "fenceType": "Wood Privacy",
  "height": 72,
  "linearFeet": 185,
  "laborRate": 65,
  "overheadPercent": 12,
  "markupPercent": 18,
  "taxPercent": 5
}
```

**Success response**
```json
{
  "success": true,
  "estimate": {
    "id": "uuid",
    "estimate_number": "EST-1001",
    "is_locked": false,
    "total": 12450.77
  },
  "breakdown": {
    "materialCost": 7200,
    "laborCost": 2800,
    "overhead": 1200,
    "markup": 950,
    "tax": 300.77,
    "total": 12450.77
  }
}
```

### PUT /api/projects/:id/estimates/:estimateId
**Description:** Updates an existing estimate that is not locked.

### POST /api/projects/:id/estimates/lock
**Description:** Locks estimate pricing for contract generation.

**Request body**
```json
{
  "estimateId": "uuid",
  "approvedBy": "uuid"
}
```

**Success response**
```json
{
  "success": true,
  "message": "Estimate locked",
  "locked": true
}
```

---

## Inventory Endpoints

### GET /api/inventory
**Description:** Lists inventory or catalog items.

**Query options**
- `category`
- `active`
- `search`

### POST /api/inventory
**Description:** Creates a catalog item.

**Request body**
```json
{
  "sku": "POST-4X4-8",
  "name": "4x4 Pressure-Treated Post 8ft",
  "category": "posts",
  "unit": "each",
  "unitCost": 24.5,
  "sellPrice": 32.95,
  "active": true
}
```

### GET /api/inventory/:id
**Description:** Returns one inventory record.

### PUT /api/inventory/:id
**Description:** Updates inventory pricing or metadata.

### DELETE /api/inventory/:id
**Description:** Archives or deletes an inventory item.

---

## Contract Endpoints

### GET /api/projects/:id/contracts
**Description:** Lists contracts for a project.

### POST /api/projects/:id/contracts
**Description:** Creates a contract from a locked estimate.

**Request body**
```json
{
  "estimateId": "uuid",
  "scopeOfWork": "Install 185 LF of 6ft cedar privacy fence",
  "depositAmount": 2500,
  "terms": "Balance due on completion"
}
```

### PUT /api/projects/:id/contracts/:contractId
**Description:** Updates contract metadata that does not violate price-lock rules.

---

## Change Order Endpoints

### GET /api/projects/:id/change-orders
**Description:** Lists change orders for a project.

### POST /api/projects/:id/change-orders
**Description:** Creates a new change order.

**Request body**
```json
{
  "contractId": "uuid",
  "description": "Add one extra gate",
  "reason": "Customer requested backyard access",
  "costImpact": 850,
  "scheduleImpactDays": 1
}
```

### PUT /api/projects/:id/change-orders/:changeOrderId
**Description:** Updates a pending change order.

### POST /api/projects/:id/change-orders/:changeOrderId/approve
**Description:** Approves the change order and updates project totals.

### POST /api/projects/:id/change-orders/:changeOrderId/reject
**Description:** Rejects the change order.

---

## Notes Endpoints

### GET /api/projects/:id/notes
**Description:** Lists notes attached to a project.

### POST /api/projects/:id/notes
**Description:** Creates a project note.

**Request body**
```json
{
  "title": "Site access",
  "category": "site-conditions",
  "content": "Use side gate only; avoid irrigation line near east property line."
}
```

### PUT /api/projects/:id/notes/:noteId
**Description:** Updates a project note.

### DELETE /api/projects/:id/notes/:noteId
**Description:** Deletes or archives a project note.

---

## Sign-Off Endpoints

### GET /api/projects/:id/sign-offs
**Description:** Lists project sign-off records.

### POST /api/projects/:id/sign-offs
**Description:** Creates a closeout/sign-off record.

**Request body**
```json
{
  "contractId": "uuid",
  "completionDate": "2026-08-11",
  "fenceInspectionPassed": true,
  "customerWalkthrough": true,
  "warrantyExplained": true,
  "companyRep": "Jordan Lee"
}
```

### PUT /api/projects/:id/sign-offs/:signOffId
**Description:** Updates an in-progress sign-off form.

---

## Utility Endpoints

### GET /api/health
**Description:** Lightweight health check for infrastructure and smoke tests.

**Success response**
```json
{
  "status": "ok",
  "timestamp": "2026-08-11T00:00:00.000Z"
}
```

## Typical error response
```json
{
  "error": "ValidationError",
  "message": "Please provide all required project information"
}
```
