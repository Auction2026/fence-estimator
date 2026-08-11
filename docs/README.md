# Fence Estimator Pro – Documentation

## Overview
Fence Estimator Pro is a complete web-based fence estimation and project management system built for Fence Depot. It provides a 17-tab single-page application for managing every aspect of a fence installation project from initial estimate to final sign-off.

## Documentation Index

| Document | Description |
|----------|-------------|
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Quick setup instructions |
| [PART_4_IMPLEMENTATION_MENU.md](PART_4_IMPLEMENTATION_MENU.md) | Complete 6-step setup guide |
| [PART_5_TROUBLESHOOTING_GUIDE.md](PART_5_TROUBLESHOOTING_GUIDE.md) | 110+ issues and solutions |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | REST API reference |
| [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) | Database tables and relationships |
| [VIEWING_GUIDE.md](VIEWING_GUIDE.md) | How to view the application |
| [INDEX.md](INDEX.md) | Complete file index |
| [WIRE_GRIDS/SYSTEM_ARCHITECTURE.md](WIRE_GRIDS/SYSTEM_ARCHITECTURE.md) | System architecture diagram |
| [WIRE_GRIDS/DATA_FLOW_DIAGRAM.md](WIRE_GRIDS/DATA_FLOW_DIAGRAM.md) | Data flow between components |
| [WIRE_GRIDS/USER_WORKFLOW.md](WIRE_GRIDS/USER_WORKFLOW.md) | Step-by-step user journey |
| [WIRE_GRIDS/PROJECT_LIFECYCLE.md](WIRE_GRIDS/PROJECT_LIFECYCLE.md) | Project status flow |
| [WIRE_GRIDS/TAB_DEPENDENCIES.md](WIRE_GRIDS/TAB_DEPENDENCIES.md) | Tab dependency map |
| [WIRE_GRIDS/CALCULATION_FLOW.md](WIRE_GRIDS/CALCULATION_FLOW.md) | Estimate calculation engine |
| [WIRE_GRIDS/AUTHENTICATION_FLOW.md](WIRE_GRIDS/AUTHENTICATION_FLOW.md) | Login and session flow |
| [WIRE_GRIDS/DATABASE_RELATIONSHIPS.md](WIRE_GRIDS/DATABASE_RELATIONSHIPS.md) | Entity relationship diagram |
| [WIRE_GRIDS/PRICING_LOCK_FLOW.md](WIRE_GRIDS/PRICING_LOCK_FLOW.md) | Price lock mechanism |
| [WIRE_GRIDS/CHANGE_ORDER_FLOW.md](WIRE_GRIDS/CHANGE_ORDER_FLOW.md) | Change order process |

## Quick Start
1. Run `mysql < database/schema.sql` to create tables
2. Run `mysql < database/seed.sql` to load products
3. `cd backend && npm install && npm start`
4. Open `frontend/index.html` in browser
5. Log in with admin credentials

*Fence Depot © 2026*
