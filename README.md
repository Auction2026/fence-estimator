# 🔧 Fence Depot Estimator

A complete professional fence estimating application for Fence Depot.

## Quick Start

1. Open `index.html` in your browser to use the estimator immediately (no setup required)
2. See [docs/PART_4_IMPLEMENTATION_MENU.md](docs/PART_4_IMPLEMENTATION_MENU.md) for full server setup

## What's Included

| Folder / File | What It Does |
|---|---|
| `index.html` | Complete single-page estimating app (runs in any browser) |
| `backend/` | Node.js/Express API server |
| `database/` | PostgreSQL schema, 300+ product seeds, migrations |
| `docs/` | Implementation guide, troubleshooting, architecture |

## Estimator Features

- ✅ Customer & project management
- ✅ 5-step estimate wizard (chain link, wood, vinyl, aluminum, ornamental)
- ✅ Auto-calculation of materials, labor, concrete, hardware
- ✅ Price locking & contract generation
- ✅ Change order tracking
- ✅ Crew & permit management
- ✅ Central notes hub
- ✅ Sign-off & completion tracking
- ✅ PDF generation & email delivery

## Documentation

| Document | Description |
|---|---|
| [Implementation Guide](docs/PART_4_IMPLEMENTATION_MENU.md) | Step-by-step setup (easy language) |
| [Troubleshooting Guide](docs/PART_5_TROUBLESHOOTING_GUIDE.md) | 110+ issues with solutions |
| [System Architecture](docs/WIRE_GRIDS/SYSTEM_ARCHITECTURE.md) | How the whole system works |
| [Data Flow](docs/WIRE_GRIDS/DATA_FLOW_DIAGRAM.md) | How data moves through the app |
| [User Workflow](docs/WIRE_GRIDS/USER_WORKFLOW.md) | Step-by-step user journey |
| [Calculation Flow](docs/WIRE_GRIDS/CALCULATION_FLOW.md) | How estimates are calculated |
| [Database Relationships](docs/WIRE_GRIDS/DATABASE_RELATIONSHIPS.md) | ERD diagram |
| [Pricing Lock Flow](docs/WIRE_GRIDS/PRICING_LOCK_FLOW.md) | How price locking works |
| [Change Order Flow](docs/WIRE_GRIDS/CHANGE_ORDER_FLOW.md) | Change order process |
| [Authentication Flow](docs/WIRE_GRIDS/AUTHENTICATION_FLOW.md) | Login & security |
| [Tab Dependencies](docs/WIRE_GRIDS/TAB_DEPENDENCIES.md) | Which tabs depend on which data |

## Technology Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (no framework required)
- **Backend:** Node.js 20 + Express 4
- **Database:** PostgreSQL 15+
- **PDF:** PDFKit
- **Email:** Nodemailer

## Repository

**GitHub:** https://github.com/Auction2026/fence-estimator
