# Fence Depot Estimator API Documentation

All endpoints below use JSON request and response bodies. Authentication is typically provided with a ****** in the Authorization header.

## Auth

### POST /api/auth/login
- **Method:** POST
- **URL:** `/api/auth/login`
- **Auth required:** No
- **Request body:**
```json
{
  "email": "estimator@fencedepot.com",
  "password": "StrongPassword!"
}
```
- **Response:**
```json
{
  "token": "jwt-token",
  "user": {
    "user_id": "uuid",
    "role": "estimator"
  }
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### POST /api/auth/register
- **Method:** POST
- **URL:** `/api/auth/register`
- **Auth required:** Admin
- **Request body:**
```json
{
  "username": "jdoe",
  "email": "jdoe@fencedepot.com",
  "password": "StrongPassword!",
  "role": "estimator"
}
```
- **Response:**
```json
{
  "message": "User created",
  "user_id": "uuid"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### POST /api/auth/refresh
- **Method:** POST
- **URL:** `/api/auth/refresh`
- **Auth required:** Yes
- **Request body:**
```json
{
  "refreshToken": "opaque-refresh-token"
}
```
- **Response:**
```json
{
  "token": "new-jwt-token"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### POST /api/auth/logout
- **Method:** POST
- **URL:** `/api/auth/logout`
- **Auth required:** Yes
- **Request body:**
```json
{}
```
- **Response:**
```json
{
  "message": "Logged out"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

## Projects

### GET /api/projects
- **Method:** GET
- **URL:** `/api/projects`
- **Auth required:** Yes
- **Request body:**
```json
{}
```
- **Response:**
```json
{
  "data": [
    {
      "project_id": "uuid",
      "project_number": "PRJ-20260811-001000"
    }
  ]
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### POST /api/projects
- **Method:** POST
- **URL:** `/api/projects`
- **Auth required:** Yes
- **Request body:**
```json
{
  "customer_first_name": "Sam",
  "customer_last_name": "Carter",
  "address_street": "123 Main St",
  "address_city": "Austin",
  "address_state": "TX",
  "address_zip": "78701",
  "status": "draft",
  "estimator_id": "uuid"
}
```
- **Response:**
```json
{
  "project_id": "uuid",
  "project_number": "PRJ-20260811-001000"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### GET /api/projects/:projectId
- **Method:** GET
- **URL:** `/api/projects/:projectId`
- **Auth required:** Yes
- **Request body:**
```json
{}
```
- **Response:**
```json
{
  "project_id": "uuid",
  "status": "estimate"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### PUT /api/projects/:projectId
- **Method:** PUT
- **URL:** `/api/projects/:projectId`
- **Auth required:** Yes
- **Request body:**
```json
{
  "status": "active",
  "notes": "Crew scheduled for Monday"
}
```
- **Response:**
```json
{
  "message": "Project updated"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### DELETE /api/projects/:projectId
- **Method:** DELETE
- **URL:** `/api/projects/:projectId`
- **Auth required:** Admin
- **Request body:**
```json
{}
```
- **Response:**
```json
{
  "message": "Project deleted"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

## Fence Specs

### GET /api/specs
- **Method:** GET
- **URL:** `/api/specs`
- **Auth required:** Yes
- **Request body:**
```json
{}
```
- **Response:**
```json
{
  "data": [
    {
      "spec_id": "uuid",
      "fence_type": "wood"
    }
  ]
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### POST /api/specs
- **Method:** POST
- **URL:** `/api/specs`
- **Auth required:** Yes
- **Request body:**
```json
{
  "project_id": "uuid",
  "fence_type": "wood",
  "height_feet": 6,
  "linear_feet": 145,
  "number_of_posts": 24
}
```
- **Response:**
```json
{
  "spec_id": "uuid"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### GET /api/specs/:specId
- **Method:** GET
- **URL:** `/api/specs/:specId`
- **Auth required:** Yes
- **Request body:**
```json
{}
```
- **Response:**
```json
{
  "spec_id": "uuid",
  "materials_grade": "premium"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### PUT /api/specs/:specId
- **Method:** PUT
- **URL:** `/api/specs/:specId`
- **Auth required:** Yes
- **Request body:**
```json
{
  "number_of_gates": 2,
  "gate_type": "double_drive"
}
```
- **Response:**
```json
{
  "message": "Specification updated"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### DELETE /api/specs/:specId
- **Method:** DELETE
- **URL:** `/api/specs/:specId`
- **Auth required:** Yes
- **Request body:**
```json
{}
```
- **Response:**
```json
{
  "message": "Specification deleted"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

## Estimates

### GET /api/estimates
- **Method:** GET
- **URL:** `/api/estimates`
- **Auth required:** Yes
- **Request body:**
```json
{}
```
- **Response:**
```json
{
  "data": [
    {
      "estimate_id": "uuid",
      "status": "sent"
    }
  ]
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### POST /api/estimates
- **Method:** POST
- **URL:** `/api/estimates`
- **Auth required:** Yes
- **Request body:**
```json
{
  "project_id": "uuid",
  "spec_id": "uuid",
  "materials_cost": 3200,
  "labor_cost": 1800,
  "subtotal": 5000,
  "tax_amount": 412.5,
  "total_amount": 5412.5,
  "created_by": "uuid"
}
```
- **Response:**
```json
{
  "estimate_id": "uuid",
  "estimate_number": "EST-20260811-005000"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### GET /api/estimates/:estimateId
- **Method:** GET
- **URL:** `/api/estimates/:estimateId`
- **Auth required:** Yes
- **Request body:**
```json
{}
```
- **Response:**
```json
{
  "estimate_number": "EST-20260811-005000",
  "status": "draft"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### PUT /api/estimates/:estimateId
- **Method:** PUT
- **URL:** `/api/estimates/:estimateId`
- **Auth required:** Yes
- **Request body:**
```json
{
  "status": "accepted"
}
```
- **Response:**
```json
{
  "message": "Estimate updated"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### DELETE /api/estimates/:estimateId
- **Method:** DELETE
- **URL:** `/api/estimates/:estimateId`
- **Auth required:** Admin
- **Request body:**
```json
{}
```
- **Response:**
```json
{
  "message": "Estimate deleted"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

## Contracts

### GET /api/contracts
- **Method:** GET
- **URL:** `/api/contracts`
- **Auth required:** Yes
- **Request body:**
```json
{}
```
- **Response:**
```json
{
  "data": [
    {
      "contract_id": "uuid",
      "status": "active"
    }
  ]
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### POST /api/contracts
- **Method:** POST
- **URL:** `/api/contracts`
- **Auth required:** Yes
- **Request body:**
```json
{
  "project_id": "uuid",
  "estimate_id": "uuid",
  "scope_of_work": "Install 145 LF of cedar privacy fence",
  "total_price": 6200,
  "deposit_amount": 1500,
  "balance_amount": 4700
}
```
- **Response:**
```json
{
  "contract_id": "uuid",
  "contract_number": "CON-20260811-007000"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### GET /api/contracts/:contractId
- **Method:** GET
- **URL:** `/api/contracts/:contractId`
- **Auth required:** Yes
- **Request body:**
```json
{}
```
- **Response:**
```json
{
  "contract_id": "uuid",
  "price_locked": true
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### PUT /api/contracts/:contractId
- **Method:** PUT
- **URL:** `/api/contracts/:contractId`
- **Auth required:** Yes
- **Request body:**
```json
{
  "status": "pending_signature"
}
```
- **Response:**
```json
{
  "message": "Contract updated"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### DELETE /api/contracts/:contractId
- **Method:** DELETE
- **URL:** `/api/contracts/:contractId`
- **Auth required:** Admin
- **Request body:**
```json
{}
```
- **Response:**
```json
{
  "message": "Contract deleted"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

## Change Orders

### GET /api/change-orders
- **Method:** GET
- **URL:** `/api/change-orders`
- **Auth required:** Yes
- **Request body:**
```json
{}
```
- **Response:**
```json
{
  "data": [
    {
      "change_order_id": "uuid",
      "status": "pending"
    }
  ]
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### POST /api/change-orders
- **Method:** POST
- **URL:** `/api/change-orders`
- **Auth required:** Yes
- **Request body:**
```json
{
  "contract_id": "uuid",
  "project_id": "uuid",
  "description": "Add one double drive gate",
  "materials_change": 450,
  "labor_change": 275,
  "total_change": 725,
  "created_by": "uuid"
}
```
- **Response:**
```json
{
  "change_order_id": "uuid",
  "change_order_number": "CO-20260811-009000"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### GET /api/change-orders/:changeOrderId
- **Method:** GET
- **URL:** `/api/change-orders/:changeOrderId`
- **Auth required:** Yes
- **Request body:**
```json
{}
```
- **Response:**
```json
{
  "change_order_number": "CO-20260811-009000",
  "status": "pending"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### PUT /api/change-orders/:changeOrderId
- **Method:** PUT
- **URL:** `/api/change-orders/:changeOrderId`
- **Auth required:** Yes
- **Request body:**
```json
{
  "status": "approved",
  "customer_approved": true
}
```
- **Response:**
```json
{
  "message": "Change order updated"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### DELETE /api/change-orders/:changeOrderId
- **Method:** DELETE
- **URL:** `/api/change-orders/:changeOrderId`
- **Auth required:** Admin
- **Request body:**
```json
{}
```
- **Response:**
```json
{
  "message": "Change order deleted"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

## Sign-Offs

### GET /api/signoffs
- **Method:** GET
- **URL:** `/api/signoffs`
- **Auth required:** Yes
- **Request body:**
```json
{}
```
- **Response:**
```json
{
  "data": [
    {
      "signoff_id": "uuid",
      "status": "draft"
    }
  ]
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### POST /api/signoffs
- **Method:** POST
- **URL:** `/api/signoffs`
- **Auth required:** Yes
- **Request body:**
```json
{
  "project_id": "uuid",
  "completion_date": "2026-08-11",
  "inspection_passed": true,
  "walkthrough_completed": true
}
```
- **Response:**
```json
{
  "signoff_id": "uuid",
  "signoff_number": "SO-20260811-003000"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### GET /api/signoffs/:signoffId
- **Method:** GET
- **URL:** `/api/signoffs/:signoffId`
- **Auth required:** Yes
- **Request body:**
```json
{}
```
- **Response:**
```json
{
  "signoff_id": "uuid",
  "customer_satisfied": true
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### PUT /api/signoffs/:signoffId
- **Method:** PUT
- **URL:** `/api/signoffs/:signoffId`
- **Auth required:** Yes
- **Request body:**
```json
{
  "status": "signed"
}
```
- **Response:**
```json
{
  "message": "Sign-off updated"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### DELETE /api/signoffs/:signoffId
- **Method:** DELETE
- **URL:** `/api/signoffs/:signoffId`
- **Auth required:** Admin
- **Request body:**
```json
{}
```
- **Response:**
```json
{
  "message": "Sign-off deleted"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

## Notes

### GET /api/notes
- **Method:** GET
- **URL:** `/api/notes`
- **Auth required:** Yes
- **Request body:**
```json
{}
```
- **Response:**
```json
{
  "data": [
    {
      "note_id": "uuid",
      "category": "installation"
    }
  ]
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### POST /api/notes
- **Method:** POST
- **URL:** `/api/notes`
- **Auth required:** Yes
- **Request body:**
```json
{
  "project_id": "uuid",
  "title": "Gate clearance",
  "category": "installation",
  "content": "Allow extra clearance for grade change.",
  "created_by": "uuid"
}
```
- **Response:**
```json
{
  "note_id": "uuid"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### GET /api/notes/:noteId
- **Method:** GET
- **URL:** `/api/notes/:noteId`
- **Auth required:** Yes
- **Request body:**
```json
{}
```
- **Response:**
```json
{
  "title": "Gate clearance",
  "is_pinned": false
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### PUT /api/notes/:noteId
- **Method:** PUT
- **URL:** `/api/notes/:noteId`
- **Auth required:** Yes
- **Request body:**
```json
{
  "is_pinned": true
}
```
- **Response:**
```json
{
  "message": "Note updated"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### DELETE /api/notes/:noteId
- **Method:** DELETE
- **URL:** `/api/notes/:noteId`
- **Auth required:** Yes
- **Request body:**
```json
{}
```
- **Response:**
```json
{
  "message": "Note deleted"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

## Products

### GET /api/products
- **Method:** GET
- **URL:** `/api/products`
- **Auth required:** Yes
- **Request body:**
```json
{}
```
- **Response:**
```json
{
  "data": [
    {
      "inventory_id": "uuid",
      "sku": "CL-MESH-11G-4"
    }
  ]
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### POST /api/products
- **Method:** POST
- **URL:** `/api/products`
- **Auth required:** Admin
- **Request body:**
```json
{
  "sku": "CUSTOM-001",
  "name": "Custom Bracket",
  "category": "Hardware",
  "subcategory": "Brackets",
  "fence_type": "hardware",
  "unit": "each",
  "unit_cost": 3.25,
  "retail_price": 4.95
}
```
- **Response:**
```json
{
  "inventory_id": "uuid"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### GET /api/products/:inventoryId
- **Method:** GET
- **URL:** `/api/products/:inventoryId`
- **Auth required:** Yes
- **Request body:**
```json
{}
```
- **Response:**
```json
{
  "sku": "CL-MESH-11G-4",
  "quantity_on_hand": 25
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### PUT /api/products/:inventoryId
- **Method:** PUT
- **URL:** `/api/products/:inventoryId`
- **Auth required:** Admin
- **Request body:**
```json
{
  "quantity_on_hand": 30,
  "retail_price": 75.99
}
```
- **Response:**
```json
{
  "message": "Product updated"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.

### DELETE /api/products/:inventoryId
- **Method:** DELETE
- **URL:** `/api/products/:inventoryId`
- **Auth required:** Admin
- **Request body:**
```json
{}
```
- **Response:**
```json
{
  "message": "Product deleted"
}
```
- **Notes:** Validate UUID route parameters, return 404 when a record is missing, and include audit-friendly error messages.
