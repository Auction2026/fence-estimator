# API Documentation

## Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

## Projects and tabs
- `GET /api/tabs`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id`
- `GET /api/projects/:projectId/tabs/:tabKey`
- `PUT /api/projects/:projectId/tabs/:tabKey`

## Estimates
- `GET /api/estimates`
- `POST /api/estimates`
- `POST /api/estimates/calculate`
- `GET /api/estimates/:id`

## Contracts
- `GET /api/contracts`
- `POST /api/contracts`
- `GET /api/contracts/:id`
- `PUT /api/contracts/:id`

## Admin
- `GET /api/admin/dashboard`
- `GET /api/admin/catalog`
