# API Documentation

## Health
### `GET /api/health`
Returns service status and uptime.

## Authentication
### `POST /api/auth/register`
Registers a new user.

### `POST /api/auth/login`
Returns a JWT for subsequent requests.

## Projects
### `POST /api/projects`
Creates a project.
Required fields: `customerName`, `customerEmail`, `customerPhone`, `address`, `city`, `province`, `postalCode`.

### `GET /api/projects`
Lists projects available to the current user.

### `GET /api/projects/:projectId`
Returns one project.

### `PUT /api/projects/:projectId`
Updates a project.

## Estimates
### `POST /api/estimates`
Creates an estimate using fence type, linear footage, and installation assumptions.

### `GET /api/estimates/:projectId`
Lists estimates for a project.

## Contracts
### `POST /api/contracts`
Creates a contract from an estimate.

### `GET /api/contracts/:projectId`
Lists contracts for a project.

## Auth headers
Protected routes require `Authorization: ******
