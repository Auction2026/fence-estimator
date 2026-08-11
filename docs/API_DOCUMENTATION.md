
# API Documentation

## Base URL
`http://localhost:3000/api`

## Endpoints used by the frontend
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `GET /projects`
- `POST /projects`
- `GET /projects/:projectId`
- `PUT /projects/:projectId`
- `DELETE /projects/:projectId`
- `POST /projects/:projectId/estimates`
- `POST /estimates/calculate`
- `GET /estimates/:estimateId`
- `POST /contracts`
- `GET /contracts/:contractId`
- `POST /contracts/:contractId/sign`
- `POST /contracts/:contractId/change-orders`
- `GET /contracts/:contractId/change-orders`
- `GET /products/search?q=term`
- `GET /products/category/:category`
- `POST /projects/:projectId/drawings`
- `POST /projects/:projectId/notes`
- `GET /dashboard/summary`
