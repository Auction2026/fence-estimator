# API DOCUMENTATION

> Base path: `/api`
> Source of truth for currently implemented routes: `/home/runner/work/fence-estimator/fence-estimator/backend/server.js`

## 1. API conventions

- Requests and responses use JSON except for future file streams.
- Protected endpoints require `Authorization: ******
- The server currently returns simple JSON error envelopes.
- List routes currently return full collections for the requesting user or project.

## 2. Authentication details

### JWT token format
```http
Authorization: ******
Content-Type: application/json
```

### Token behavior
- Tokens contain `userId` and `role`.
- Tokens expire after seven days by default.
- Invalid or expired tokens return HTTP 401.

## 3. Status codes

| Code | Meaning |
| --- | --- |
| 200 | Successful read or update. |
| 201 | Successful creation. |
| 400 | Validation failure or duplicate user. |
| 401 | Missing or invalid token. |
| 403 | Role restriction, if enabled for future routes. |
| 404 | Resource or route not found. |
| 429 | Recommended for future rate limiting. |
| 500 | Unexpected server error. |

## 4. Rate limiting, pagination, filtering, and sorting

### Current state
- Rate limiting is not implemented in the checked-in backend.
- Pagination, filtering, and sorting query parameters are mostly documented target behavior rather than active behavior.

### Recommended production policy
- Auth endpoints: 10 requests/minute per IP.
- Read endpoints: 120 requests/minute per token.
- Write endpoints: 60 requests/minute per token.

### Recommended query parameters for future list routes
- `page`
- `pageSize`
- `sortBy`
- `sortOrder=asc|desc`
- `search`
- resource-specific filters such as `status`, `role`, or `fenceType`

## 5. Endpoint summary

| Group | Status | Notes |
| --- | --- | --- |
| Authentication | Implemented | JWT bearer token auth for protected routes. |
| Projects | Implemented | Project creation, listing, retrieval, and update routes. |
| Estimates | Implemented | Estimate creation and project-specific listing routes. |
| Contracts | Implemented | Contract creation and project-specific listing routes. |
| Users | Planned extension | Target admin/user-management contract, not in current backend. |
| Products | Planned extension | Target product-catalog contract, not in current backend. |
| Health | Implemented | Readiness/liveness endpoint. |

## POST /auth/register

- **Purpose:** Register a new user.
- **Authorization:** Public

### Example request
```json
{"username":"estimator1","email":"estimator@example.com","password":"secret123","role":"estimator","company":"Fence Depot","phone":"5551234567"}
```

### Example response
```json
{"success":true,"message":"User registered successfully","token":"<jwt>","user":{"id":"66b...","username":"estimator1","email":"estimator@example.com","role":"estimator","company":"Fence Depot"}}
```

### Common error cases
- `400` when required input is missing or invalid.
- `404` when the route or referenced resource does not exist.
- `500` when the server or database fails unexpectedly.

## POST /auth/login

- **Purpose:** Authenticate an existing user and return a JWT.
- **Authorization:** Public

### Example request
```json
{"email":"estimator@example.com","password":"secret123"}
```

### Example response
```json
{"success":true,"message":"Login successful","token":"<jwt>","user":{"id":"66b...","username":"estimator1","email":"estimator@example.com","role":"estimator","company":"Fence Depot"}}
```

### Common error cases
- `400` when required input is missing or invalid.
- `404` when the route or referenced resource does not exist.
- `500` when the server or database fails unexpectedly.

## GET /auth/me

- **Purpose:** Return the current authenticated user profile.
- **Authorization:** ****** required

### Example request
- No request body.

### Example response
```json
{"success":true,"user":{"_id":"66b...","username":"estimator1","email":"estimator@example.com","role":"estimator","company":"Fence Depot"}}
```

### Common error cases
- `400` when required input is missing or invalid.
- `401` when the bearer token is missing, expired, or invalid.
- `404` when the route or referenced resource does not exist.
- `500` when the server or database fails unexpectedly.

## POST /projects

- **Purpose:** Create a project.
- **Authorization:** ****** required

### Example request
```json
{"customerName":"Jane Customer","customerEmail":"jane@example.com","customerPhone":"555-444-3322","address":"123 Fence Lane","city":"Toronto","province":"ON","postalCode":"M5V 2T6","propertySize":"1200","projectNotes":"Rear yard replacement"}
```

### Example response
```json
{"success":true,"message":"Project created successfully","project":{"projectId":"PRJ-1723420000000","customerName":"Jane Customer","status":"draft"}}
```

### Common error cases
- `400` when required input is missing or invalid.
- `401` when the bearer token is missing, expired, or invalid.
- `404` when the route or referenced resource does not exist.
- `500` when the server or database fails unexpectedly.

## GET /projects

- **Purpose:** List the current estimator's projects.
- **Authorization:** ****** required
- **Recommended query parameters:** `page`, `pageSize`, `sortBy`, `sortOrder`, plus resource-specific filters.

### Example request
- No request body.

### Example response
```json
{"success":true,"count":2,"projects":[{"projectId":"PRJ-1","customerName":"Jane Customer","status":"estimate"},{"projectId":"PRJ-2","customerName":"John Customer","status":"draft"}]}
```

### Common error cases
- `400` when required input is missing or invalid.
- `401` when the bearer token is missing, expired, or invalid.
- `404` when the route or referenced resource does not exist.
- `500` when the server or database fails unexpectedly.

## GET /projects/:projectId

- **Purpose:** Fetch one project by projectId.
- **Authorization:** ****** required

### Example request
- No request body.

### Example response
```json
{"success":true,"project":{"projectId":"PRJ-1723420000000","customerName":"Jane Customer","customerEmail":"jane@example.com","status":"draft"}}
```

### Common error cases
- `400` when required input is missing or invalid.
- `401` when the bearer token is missing, expired, or invalid.
- `404` when the route or referenced resource does not exist.
- `500` when the server or database fails unexpectedly.

## PUT /projects/:projectId

- **Purpose:** Update an existing project.
- **Authorization:** ****** required

### Example request
```json
{"status":"estimate","projectNotes":"Site visit complete"}
```

### Example response
```json
{"success":true,"message":"Project updated successfully","project":{"projectId":"PRJ-1723420000000","status":"estimate"}}
```

### Common error cases
- `400` when required input is missing or invalid.
- `401` when the bearer token is missing, expired, or invalid.
- `404` when the route or referenced resource does not exist.
- `500` when the server or database fails unexpectedly.

## POST /estimates

- **Purpose:** Create an estimate with CalculationEngine.
- **Authorization:** ****** required

### Example request
```json
{"projectId":"PRJ-1723420000000","customerName":"Jane Customer","fenceType":"Wood","linearFeet":180,"height":48,"barchedWire":false,"installationType":"Residential","laborRate":55,"permitCost":125,"utilityCost":50,"contingency":100,"notes":"Premium cedar boards"}
```

### Example response
```json
{"success":true,"message":"Estimate created successfully","estimate":{"estimateNumber":"EST-1723420000000","projectId":"PRJ-1723420000000","materialCost":645,"laborCost":198,"equipmentCost":150,"subtotal":1118,"tax":145.34,"total":1263.34},"breakdown":{"materials":645,"labor":198,"equipment":150,"permits":125,"utilities":50,"contingency":100,"subtotal":1118,"tax":145.34,"total":1263.34}}
```

### Common error cases
- `400` when required input is missing or invalid.
- `401` when the bearer token is missing, expired, or invalid.
- `404` when the route or referenced resource does not exist.
- `500` when the server or database fails unexpectedly.

## GET /estimates/:projectId

- **Purpose:** List estimates for a project.
- **Authorization:** ****** required

### Example request
- No request body.

### Example response
```json
{"success":true,"count":1,"estimates":[{"estimateNumber":"EST-1723420000000","projectId":"PRJ-1723420000000","fenceType":"Wood","total":1263.34}]}
```

### Common error cases
- `400` when required input is missing or invalid.
- `401` when the bearer token is missing, expired, or invalid.
- `404` when the route or referenced resource does not exist.
- `500` when the server or database fails unexpectedly.

## POST /contracts

- **Purpose:** Create a contract from an estimate.
- **Authorization:** ****** required

### Example request
```json
{"estimateNumber":"EST-1723420000000","projectId":"PRJ-1723420000000","customerName":"Jane Customer","scopeOfWork":"Install 180 LF of cedar privacy fence","depositAmount":315.84,"warranty":"2 years on materials, 1 year on labor","terms":"Deposit due at signing. Balance due at completion."}
```

### Example response
```json
{"success":true,"message":"🔒 Contract created successfully. PRICING IS NOW LOCKED!","contract":{"contractNumber":"CON-1723420000000","estimateNumber":"EST-1723420000000","projectId":"PRJ-1723420000000","totalPrice":1263.34,"status":"pending"},"warning":"The price in this contract is LOCKED and cannot be changed without a Change Order"}
```

### Common error cases
- `400` when required input is missing or invalid.
- `401` when the bearer token is missing, expired, or invalid.
- `404` when the route or referenced resource does not exist.
- `500` when the server or database fails unexpectedly.

## GET /contracts/:projectId

- **Purpose:** List contracts for a project.
- **Authorization:** ****** required

### Example request
- No request body.

### Example response
```json
{"success":true,"count":1,"contracts":[{"contractNumber":"CON-1723420000000","projectId":"PRJ-1723420000000","status":"pending","totalPrice":1263.34}]}
```

### Common error cases
- `400` when required input is missing or invalid.
- `401` when the bearer token is missing, expired, or invalid.
- `404` when the route or referenced resource does not exist.
- `500` when the server or database fails unexpectedly.

## GET /users

- **Purpose:** List users with pagination and filtering.
- **Authorization:** Admin token required (planned)
- **Recommended query parameters:** `page`, `pageSize`, `sortBy`, `sortOrder`, plus resource-specific filters.

### Example request
- No request body.

### Example response
```json
{"success":true,"count":2,"users":[{"id":"u1","username":"admin","role":"admin","company":"Fence Depot"},{"id":"u2","username":"estimator1","role":"estimator","company":"Fence Depot"}]}
```

### Common error cases
- `400` when required input is missing or invalid.
- `401` when the bearer token is missing, expired, or invalid.
- `404` when the route or referenced resource does not exist.
- `500` when the server or database fails unexpectedly.

## POST /users

- **Purpose:** Create a user from an admin workflow.
- **Authorization:** Admin token required (planned)

### Example request
```json
{"username":"crewlead","email":"crewlead@example.com","password":"secret123","role":"crew","company":"Fence Depot","phone":"5558889999"}
```

### Example response
```json
{"success":true,"message":"User created successfully","user":{"id":"u3","username":"crewlead","role":"crew"}}
```

### Common error cases
- `400` when required input is missing or invalid.
- `401` when the bearer token is missing, expired, or invalid.
- `404` when the route or referenced resource does not exist.
- `500` when the server or database fails unexpectedly.

## GET /users/:userId

- **Purpose:** Fetch a specific user.
- **Authorization:** Admin or self (planned)

### Example request
- No request body.

### Example response
```json
{"success":true,"user":{"id":"u2","username":"estimator1","email":"estimator@example.com","role":"estimator","company":"Fence Depot"}}
```

### Common error cases
- `400` when required input is missing or invalid.
- `401` when the bearer token is missing, expired, or invalid.
- `404` when the route or referenced resource does not exist.
- `500` when the server or database fails unexpectedly.

## PUT /users/:userId

- **Purpose:** Update user profile fields or role.
- **Authorization:** Admin or self (planned)

### Example request
```json
{"role":"admin","phone":"5557771212"}
```

### Example response
```json
{"success":true,"message":"User updated successfully"}
```

### Common error cases
- `400` when required input is missing or invalid.
- `401` when the bearer token is missing, expired, or invalid.
- `404` when the route or referenced resource does not exist.
- `500` when the server or database fails unexpectedly.

## DELETE /users/:userId

- **Purpose:** Deactivate or delete a user.
- **Authorization:** Admin only (planned)

### Example request
- No request body.

### Example response
```json
{"success":true,"message":"User deactivated successfully"}
```

### Common error cases
- `400` when required input is missing or invalid.
- `401` when the bearer token is missing, expired, or invalid.
- `404` when the route or referenced resource does not exist.
- `500` when the server or database fails unexpectedly.

## GET /products

- **Purpose:** List products with pagination, filters, and sorting.
- **Authorization:** ****** required (planned)
- **Recommended query parameters:** `page`, `pageSize`, `sortBy`, `sortOrder`, plus resource-specific filters.

### Example request
- No request body.

### Example response
```json
{"success":true,"count":2,"products":[{"sku":"CL-PANEL-8","name":"Chain Link Panel 8ft","price":95.5,"stock":15},{"sku":"POST-2-3-8","name":"2 3/8 Post","price":44.25,"stock":120}]}
```

### Common error cases
- `400` when required input is missing or invalid.
- `401` when the bearer token is missing, expired, or invalid.
- `404` when the route or referenced resource does not exist.
- `500` when the server or database fails unexpectedly.

## POST /products

- **Purpose:** Create a product catalog record.
- **Authorization:** Admin token required (planned)

### Example request
```json
{"sku":"WOOD-CEDAR-6X8","name":"Cedar Privacy Panel 6x8","price":184.99,"stock":30,"category":"Wood","active":true}
```

### Example response
```json
{"success":true,"message":"Product created successfully"}
```

### Common error cases
- `400` when required input is missing or invalid.
- `401` when the bearer token is missing, expired, or invalid.
- `404` when the route or referenced resource does not exist.
- `500` when the server or database fails unexpectedly.

## GET /products/:sku

- **Purpose:** Fetch a single product by SKU.
- **Authorization:** ****** required (planned)

### Example request
- No request body.

### Example response
```json
{"success":true,"product":{"sku":"WOOD-CEDAR-6X8","name":"Cedar Privacy Panel 6x8","price":184.99,"stock":30}}
```

### Common error cases
- `400` when required input is missing or invalid.
- `401` when the bearer token is missing, expired, or invalid.
- `404` when the route or referenced resource does not exist.
- `500` when the server or database fails unexpectedly.

## PUT /products/:sku

- **Purpose:** Update product pricing or stock.
- **Authorization:** Admin token required (planned)

### Example request
```json
{"price":189.99,"stock":22}
```

### Example response
```json
{"success":true,"message":"Product updated successfully"}
```

### Common error cases
- `400` when required input is missing or invalid.
- `401` when the bearer token is missing, expired, or invalid.
- `404` when the route or referenced resource does not exist.
- `500` when the server or database fails unexpectedly.

## DELETE /products/:sku

- **Purpose:** Retire a catalog record.
- **Authorization:** Admin token required (planned)

### Example request
- No request body.

### Example response
```json
{"success":true,"message":"Product retired successfully"}
```

### Common error cases
- `400` when required input is missing or invalid.
- `401` when the bearer token is missing, expired, or invalid.
- `404` when the route or referenced resource does not exist.
- `500` when the server or database fails unexpectedly.

## GET /health

- **Purpose:** Return health and uptime information.
- **Authorization:** Public

### Example request
- No request body.

### Example response
```json
{"status":"OK","timestamp":"2026-08-12T00:00:00.000Z","uptime":1234.56}
```

### Common error cases
- `400` when required input is missing or invalid.
- `404` when the route or referenced resource does not exist.
- `500` when the server or database fails unexpectedly.

## Error dictionary

| Error string | Meaning | Typical fix |
| --- | --- | --- |
| `No token provided` | Authorization header missing. | Send `Authorization: ****** |
| `Invalid token` | Token invalid or expired. | Log in again and verify `JWT_SECRET`. |
| `Validation Error` | Required fields missing or malformed. | Correct the request body. |
| `User Already Exists` | Username or email is already in use. | Use a unique value. |
| `Authentication Failed` | Email or password did not match. | Verify credentials. |
| `Project not found` | Unknown projectId. | Use an existing `projectId`. |
| `Estimate not found` | Contract creation referenced a missing estimate. | Confirm the estimate number first. |

## Example cURL calls

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"estimator1","email":"estimator@example.com","password":"secret123","company":"Fence Depot"}'
```

### Create a project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: ******" \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Jane Customer","customerEmail":"jane@example.com","customerPhone":"555-444-3322","address":"123 Fence Lane","city":"Toronto","province":"ON","postalCode":"M5V 2T6"}'
```

### Create an estimate
```bash
curl -X POST http://localhost:5000/api/estimates \
  -H "Authorization: ******" \
  -H "Content-Type: application/json" \
  -d '{"projectId":"PRJ-1723420000000","customerName":"Jane Customer","fenceType":"Wood","linearFeet":180}'
```

## Known gaps between docs and current code

- `/api/users` and `/api/products` are documented target contracts and not live in the current backend.
- The backend defines schemas for change orders, notes, and sign-off, but does not yet expose routes for them.
- File upload, PDF streaming, and email routes are still future integration work.

