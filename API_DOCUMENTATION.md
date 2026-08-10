# API Documentation
## Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

## Projects (Tab 1)
- `POST /api/projects`
- `GET /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`

## Fence Specs (Tab 2)
- `POST /api/fence-specs`
- `GET /api/fence-specs/project/:projectId`
- `PUT /api/fence-specs/:id`

## Estimates (Tab 8)
- `POST /api/estimates`
- `GET /api/estimates/:id`
- `GET /api/estimates/:id/pdf`

## Contracts (Tab 9)
- `POST /api/contracts`
- `PUT /api/contracts/:id/lock`
- `GET /api/contracts/:id/pdf`

## Change Orders (Tab 12)
- `POST /api/change-orders`
- `PUT /api/change-orders/:id/approve`

## Sign-off (Tab 13)
- `POST /api/signoff`
- `GET /api/signoff/project/:projectId`

## Notes (Tab 14)
- `POST /api/notes`
- `GET /api/notes/project/:projectId`

## Admin (Tab 15)
- `GET /api/admin/dashboard`
- `GET /api/admin/users`

## Documents
- `GET /api/documents/estimate/:id`
- `GET /api/documents/contract/:id`
