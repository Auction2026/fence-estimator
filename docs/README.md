# Fence Depot Fence Estimator — Documentation

## Welcome

This folder contains all documentation for the **Fence Depot Fence Estimator** — a complete web application for creating professional fence installation estimates.

---

## Quick Navigation

| Document | Description |
|----------|-------------|
| [PART 4 — Implementation Menu](PART_4_IMPLEMENTATION_MENU.md) | Step-by-step setup guide for installing and running the app |
| [PART 5 — Troubleshooting Guide](PART_5_TROUBLESHOOTING_GUIDE.md) | 110+ common issues with solutions |
| [API Documentation](API_DOCUMENTATION.md) | All backend API endpoints |
| [Setup Guide](SETUP_GUIDE.md) | Quick-start reference card |
| [INDEX](INDEX.md) | Complete file listing for the whole project |

---

## Wire Grid Diagrams

| Diagram | Description |
|---------|-------------|
| [System Architecture](WIRE_GRIDS/SYSTEM_ARCHITECTURE.md) | Full system overview: frontend → backend → database |
| [Data Flow Diagram](WIRE_GRIDS/DATA_FLOW_DIAGRAM.md) | How data moves through the estimate creation process |
| [User Workflow](WIRE_GRIDS/USER_WORKFLOW.md) | Step-by-step user journey from lead to completed project |
| [Project Lifecycle](WIRE_GRIDS/PROJECT_LIFECYCLE.md) | Project status progression from draft to completed |
| [Tab Dependencies](WIRE_GRIDS/TAB_DEPENDENCIES.md) | How the 8 application tabs relate to each other |
| [Calculation Flow](WIRE_GRIDS/CALCULATION_FLOW.md) | How materials and costs are calculated |
| [Authentication Flow](WIRE_GRIDS/AUTHENTICATION_FLOW.md) | Login, JWT tokens, and role permissions |
| [Database Relationships](WIRE_GRIDS/DATABASE_RELATIONSHIPS.md) | ERD for all 9 database tables |
| [Pricing Lock Flow](WIRE_GRIDS/PRICING_LOCK_FLOW.md) | How approved estimates are protected from changes |
| [Change Order Flow](WIRE_GRIDS/CHANGE_ORDER_FLOW.md) | Process for handling scope changes after approval |

---

## Project Summary

**Technology Stack:**
- Frontend: HTML5, CSS3, Vanilla JavaScript (single file SPA)
- Backend: Node.js + Express.js
- Database: MongoDB (via Mongoose) + MySQL (schema.sql)
- Authentication: JWT (jsonwebtoken) + bcrypt
- PDF: PDFKit
- Email: Nodemailer

**Key Features:**
- 8-tab web application
- 5-step estimate wizard
- 61-SKU built-in inventory database
- Automatic materials calculation
- PDF generation
- Email estimate delivery
- Role-based access (admin/estimator/crew)
- Change order management
- Pricing lock system
- Audit trail

**Repository:** https://github.com/Auction2026/fence-estimator
