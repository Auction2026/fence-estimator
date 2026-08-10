# System Architecture Diagram

## Overview

This diagram shows the high-level components of the Fence Depot Fence Estimator and how they connect.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FENCE DEPOT FENCE ESTIMATOR                         │
└─────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────┐
│           BROWSER (User)           │
│  ┌──────────────────────────────┐  │
│  │     index.html (Frontend)    │  │
│  │  17 Tabs / Estimate Wizard   │  │
│  │  HTML + CSS + JavaScript     │  │
│  └──────────────┬───────────────┘  │
└─────────────────┼──────────────────┘
                  │  HTTP / REST API calls
                  ▼
┌────────────────────────────────────┐
│         BACKEND (Node.js)          │
│  ┌──────────────────────────────┐  │
│  │         server.js            │  │
│  │       Express.js API         │  │
│  ├──────────────────────────────┤  │
│  │  routes/      controllers/   │  │
│  │  middleware/  utils/         │  │
│  └──────────────┬───────────────┘  │
└─────────────────┼──────────────────┘
                  │  SQL queries
                  ▼
┌────────────────────────────────────┐
│          DATABASE (MySQL)          │
│  ┌──────────────────────────────┐  │
│  │  schema.sql  /  seed.sql     │  │
│  │  Projects, Estimates,        │  │
│  │  Contracts, Inventory,       │  │
│  │  Users, Change Orders        │  │
│  └──────────────────────────────┘  │
└────────────────────────────────────┘

EXTERNAL SERVICES
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Google Maps │  │  Email SMTP  │  │  PDF Engine  │
│  (Mapping)   │  │  (Alerts)    │  │  (Contracts) │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## Component Descriptions

| Component | Technology | Purpose |
|---|---|---|
| Frontend | HTML / CSS / JavaScript | User interface — all 17 tabs |
| Backend API | Node.js / Express.js | Business logic, calculations, auth |
| Database | MySQL | Persistent storage for all data |
| Google Maps | Maps JavaScript API | Site mapping and layout drawing |
| Email | SMTP (Nodemailer) | Notifications and contract delivery |
| PDF Engine | Puppeteer / PDFKit | Contract and estimate PDF generation |

---

## Communication Flow

```
User Action
    │
    ▼
Frontend (browser)
    │── Validates input locally
    │── Calls REST API endpoint
    ▼
Backend (Express.js)
    │── Authenticates request (JWT)
    │── Validates data
    │── Runs calculations
    │── Queries database
    ▼
Database (MySQL)
    │── Returns data
    ▼
Backend
    │── Formats response (JSON)
    ▼
Frontend
    │── Updates UI
    ▼
User sees result
```
