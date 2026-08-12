# Fence Depot Estimator - Implementation Guide

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB 6+ (optional — app works offline with browser localStorage)
- A modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

---

## Quick Start (Frontend Only — No Server Required)

The frontend works entirely in the browser with localStorage. No backend or database required for basic use.

1. Open `frontend/index.html` directly in your browser, OR
2. Serve it with any static file server:

```bash
cd frontend
npx serve . -p 8080
# Then open http://localhost:8080
```

---

## Full Stack Setup

### 1. Clone / Download Repository

```bash
git clone https://github.com/Auction2026/fence-estimator.git
cd fence-estimator
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your settings (see Environment Variables below)
npm start          # Production
npm run dev        # Development with auto-reload
```

### 3. Frontend Setup

```bash
cd frontend
# No build step needed — vanilla JavaScript
npx serve . -p 8080
```

---

## Environment Variables (backend/.env)

```env
# Server
PORT=3001
NODE_ENV=development

# Database (optional)
MONGO_URI=mongodb://localhost:27017/fence-estimator

# Security — CHANGE THESE IN PRODUCTION
JWT_SECRET=your-secret-key-min-32-chars
JWT_EXPIRES=24h

# Email (optional — for sending estimates)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@email.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Fence Depot <no-reply@fencedepot.com>
```

---

## Database Setup (PostgreSQL — optional)

If using PostgreSQL instead of MongoDB:

```bash
# 1. Create database
psql -U postgres -c "CREATE DATABASE fence_estimator;"

# 2. Run schema
psql -U postgres -d fence_estimator -f database/schema.sql

# 3. Seed data
psql -U postgres -d fence_estimator -f database/seed.sql

# 4. Optional: stored procedures
psql -U postgres -d fence_estimator -f database/procedures/backup-procedures.sql
```

---

## Project File Structure

```
fence-estimator/
├── frontend/                    # Frontend application
│   ├── index.html               # Main HTML (17 tabs)
│   ├── package.json
│   ├── css/
│   │   ├── styles.css           # Main stylesheet
│   │   └── responsive.css       # Responsive breakpoints
│   └── js/
│       ├── app.js               # App initialization + tab system
│       ├── api.js               # API communication
│       ├── calculations.js      # Cost calculation engine
│       ├── validation.js        # Form validation
│       ├── storage.js           # localStorage management
│       ├── ui.js                # UI utilities
│       ├── tabs/
│       │   ├── tab1-project.js
│       │   ├── tab2-specs.js
│       │   ├── tab3-layout.js
│       │   ├── tab4-installation.js
│       │   ├── tab5-drawings.js
│       │   ├── tab6-permits.js
│       │   ├── tab7-utilities.js
│       │   ├── tab8-estimate.js
│       │   ├── tab9-contract.js
│       │   ├── tab10-extras.js
│       │   ├── tab11-crew.js
│       │   ├── tab12-changeorder.js
│       │   ├── tab13-signoff.js
│       │   ├── tab14-notes.js
│       │   ├── tab15-admin.js
│       │   ├── tab16-catalog.js
│       │   └── tab17-mapping.js
│       └── tools/
│           ├── drawing.js       # Canvas drawing utilities
│           ├── mapping.js       # Google Maps integration
│           ├── printing.js      # Print to PDF
│           └── export.js        # CSV/JSON export
├── backend/                     # Node.js / Express API
│   ├── server.js                # Main server file
│   ├── package.json
│   ├── .env.example
│   ├── routes/
│   │   └── api.js               # All API routes
│   ├── controllers/
│   │   ├── projectController.js # Business logic
│   │   └── catalogData.js       # Product catalog data
│   └── middleware/
│       └── auth.js              # JWT authentication
├── database/
│   ├── schema.sql               # PostgreSQL schema (9 tables)
│   ├── seed.sql                 # 100+ product SKUs + sample data
│   ├── migrations/
│   │   ├── migration-001-initial-schema.sql
│   │   ├── migration-002-add-indexes.sql
│   │   ├── migration-003-add-constraints.sql
│   │   └── migration-004-seed-products.sql
│   └── procedures/
│       └── backup-procedures.sql
└── docs/
    ├── IMPLEMENTATION_GUIDE.md  # This file
    └── COMPLETE_DOCUMENTATION.md
```

---

## Tab Overview

| Tab | Name | Purpose |
|-----|------|---------|
| 1 | Project Info | Customer details, address, property type |
| 2 | Specifications | Fence type, height, linear feet, color, gates |
| 3 | Layout Diagram | Interactive canvas drawing tool |
| 4 | Installation | Labor task breakdown with costs |
| 5 | Shop Drawings | Upload/manage drawing files |
| 6 | Permits | Permit tracking and inspection dates |
| 7 | Utilities | 811 utility locate management |
| 8 | Estimate | Full cost breakdown with PDF export |
| 9 | Contract | Price lock and digital signature |
| 10 | Extras | Add-on items and custom line items |
| 11 | Crew | Team member assignment and hours |
| 12 | Change Orders | Track and approve changes |
| 13 | Sign-Off | Completion checklist and final signature |
| 14 | Notes | Project notes organized by category |
| 15 | Admin | Saved projects, settings, import/export |
| 16 | Catalog | Product catalog with 100+ SKUs |
| 17 | Mapping | Google Maps property location |

---

## Google Maps Setup (Tab 17)

1. Get an API key: https://console.cloud.google.com/google/maps-apis/
2. Enable "Maps JavaScript API" and "Geocoding API"
3. In `frontend/index.html`, uncomment the Maps script at the bottom:
   ```html
   <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=Tab17Mapping.init" async defer></script>
   ```
4. Replace `YOUR_API_KEY` with your actual key

---

## Data Persistence

- **Browser localStorage**: All data auto-saves to the browser. Works offline.
- **Backend API**: When the backend is running and the user is logged in, data syncs to MongoDB.
- **Export**: Use Admin tab to export all projects as JSON backup.

---

## Troubleshooting

| Problem | Solution |
|---------|---------|
| Page shows blank | Open browser console (F12), look for JS errors |
| Tabs not switching | Ensure all `<script>` tags load correctly |
| Estimate shows $0 | Go to Tab 2, fill Fence Type and Linear Feet, click Save |
| Drawing not working | Use Chrome or Firefox; check canvas support |
| Backend won't start | Run `npm install` in backend/, check .env |
| MongoDB connection fails | App still works with localStorage; check MONGO_URI |
| Maps not showing | Add Google Maps API key (see above) |
| Signature not saving | Use mouse or touch on signature canvas |
| PDF export fails | Use browser Print > Save as PDF as fallback |
