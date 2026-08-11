# API Documentation
**Fence Estimator Pro** – REST API Reference

## Base URL
`http://localhost:3000/api`

## Authentication
All endpoints (except login/register) require: `Authorization: ******`

---

## Auth Endpoints

### POST /api/auth/login
Login and receive JWT token.
```json
Request: { "username": "admin", "password": "pass123" }
Response: { "token": "jwt...", "user": { "id": "...", "role": "admin" } }
```

### POST /api/auth/register
Create new user account.
```json
Request: { "username": "user1", "email": "u@co.com", "password": "pass", "role": "estimator", "company": "Fence Co" }
Response: { "message": "User created", "id": "..." }
```

### POST /api/auth/logout
Logout current session.
```json
Response: { "message": "Logged out" }
```

---

## Project Endpoints

### GET /api/projects
Get all projects (paginated).
- Query params: `page=1&limit=50&status=active`

### POST /api/projects
Create new project.
```json
{ "customerName": "John Smith", "customerEmail": "j@example.com", "customerPhone": "555-1234",
  "address": "123 Main St", "city": "Toronto", "province": "ON", "postalCode": "M1A 1A1" }
```

### GET /api/projects/:id
Get single project with all related data.

### PUT /api/projects/:id
Update project fields.

### DELETE /api/projects/:id
Delete project (admin only).

---

## Fence Specs Endpoints

### POST /api/fence-specs
Save fence specifications.
```json
{ "projectId": "PROJ-001", "fenceType": "chain-link", "height": 6, "linearFeet": 150, "numberPosts": 20 }
```

### GET /api/fence-specs/:projectId
Get specs for a project.

### PUT /api/fence-specs/:projectId
Update specs.

---

## Estimate Endpoints

### POST /api/estimates
Save a calculated estimate.
```json
{ "estimateNumber": "EST-2026-0001", "projectId": "PROJ-001", "materialCost": 2500, "total": 5800 }
```

### GET /api/estimates?projectId=PROJ-001
Get estimates for a project.

### POST /api/estimates/calculate
Server-side calculation (alternative to client-side).
```json
{ "fenceType": "chain-link", "height": 6, "linearFeet": 150 }
```

---

## Contract Endpoints

### POST /api/contracts
Create contract from estimate.

### GET /api/contracts/project/:projectId
Get contract for a project.

### PUT /api/contracts/:id/sign
Record signature.
```json
{ "signatureType": "customer", "signatureName": "John Smith" }
```

---

## Inventory Endpoints

### GET /api/inventory
Get products (paginated, searchable).
- Query: `?search=chain+link&category=chain-link&page=1&limit=25`

### GET /api/inventory/:sku
Get single product by SKU.

---

## Change Order Endpoints

### POST /api/change-orders
Create change order.

### GET /api/change-orders?projectId=PROJ-001
Get all COs for a project.

### PUT /api/change-orders/:id/approve
Approve a change order.

---

## Admin Endpoints (Admin role required)

### GET /api/admin/users
List all users.

### POST /api/admin/users
Create user.

### DELETE /api/admin/users/:id
Delete user.

### GET /api/admin/stats
Get dashboard statistics.

---

## HTTP Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request |
| 401 | Not authenticated |
| 403 | Not authorized |
| 404 | Not found |
| 500 | Server error |
