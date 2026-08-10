# Fence Depot Fence Estimator

Fence Depot Fence Estimator is a single-page estimating workflow paired with an Express backend for customer intake, project tracking, estimate generation, contract creation, and downstream operational documentation.

## Features
1. Dashboard
2. New Estimate
3. Projects
4. Inventory
5. Materials & Costs
6. Suppliers
7. Analytics
8. Settings
9. Contracts
10. Change Orders
11. Sign-Off
12. Reports
13. Customer Portal
14. Scheduling
15. Crew Management
16. Photo Gallery
17. Mapping

## Quick start
1. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
3. Start the backend and open the frontend:
   ```bash
   npm start
   ```
   Then open `index.html` in a browser or serve the repository with `npx http-server .`.

## Folder structure
```text
backend/                 Express.js API and MongoDB-backed application server
backend/server.js        Main backend entry point
database/                PostgreSQL schema, seed data, migrations, procedures
docs/                    Implementation, API, schema, and troubleshooting guides
docs/WIRE_GRIDS/         Mermaid architecture and workflow diagrams
index.html               Existing single-page frontend
```

## Documentation
- [API documentation](docs/API_DOCUMENTATION.md)
- [Database schema guide](docs/DATABASE_SCHEMA.md)
- [Part 4 implementation menu](docs/PART_4_IMPLEMENTATION_MENU.md)
- [Part 5 troubleshooting guide](docs/PART_5_TROUBLESHOOTING_GUIDE.md)
- [System architecture](docs/WIRE_GRIDS/SYSTEM_ARCHITECTURE.md)
- [Data flow diagram](docs/WIRE_GRIDS/DATA_FLOW_DIAGRAM.md)
- [User workflow](docs/WIRE_GRIDS/USER_WORKFLOW.md)
- [Project lifecycle](docs/WIRE_GRIDS/PROJECT_LIFECYCLE.md)
- [Tab dependencies](docs/WIRE_GRIDS/TAB_DEPENDENCIES.md)
- [Calculation flow](docs/WIRE_GRIDS/CALCULATION_FLOW.md)
- [Authentication flow](docs/WIRE_GRIDS/AUTHENTICATION_FLOW.md)
- [Database relationships](docs/WIRE_GRIDS/DATABASE_RELATIONSHIPS.md)
- [Pricing lock flow](docs/WIRE_GRIDS/PRICING_LOCK_FLOW.md)
- [Change order flow](docs/WIRE_GRIDS/CHANGE_ORDER_FLOW.md)

## Notes
- The current backend runtime uses MongoDB via `MONGO_URI`.
- The PostgreSQL assets in `database/` provide a complete relational schema package for future integration or reporting workflows.
