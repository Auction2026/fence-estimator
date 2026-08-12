# Fence Depot Estimator - Complete Documentation

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [API Documentation](#2-api-documentation)
3. [Database Schema](#3-database-schema)
4. [Frontend Modules](#4-frontend-modules)
5. [Calculation Engine](#5-calculation-engine)
6. [Flow Diagrams](#6-flow-diagrams)
7. [Deployment Guide](#7-deployment-guide)
8. [Troubleshooting Guide](#8-troubleshooting-guide)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    BROWSER (Frontend)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  index.html  (17-tab SPA)                             │   │
│  │  css/styles.css + css/responsive.css                  │   │
│  │  js/app.js → tab system, session management           │   │
│  │  js/calculations.js → cost engine                     │   │
│  │  js/storage.js → localStorage persistence             │   │
│  │  js/api.js → fetch() calls to backend                 │   │
│  │  js/ui.js → DOM manipulation                          │   │
│  │  js/tabs/tab1..tab17.js → tab-specific logic          │   │
│  │  js/tools/ → drawing, mapping, printing, export       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/JSON (fetch API)
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                 BACKEND (Node.js / Express)                   │
│  backend/server.js (main entry)                              │
│  backend/routes/api.js (route definitions)                   │
│  backend/controllers/projectController.js (business logic)   │
│  backend/middleware/auth.js (JWT validation)                 │
└─────────────────────┬───────────────────────────────────────┘
                      │ Mongoose / pg
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE                                   │
│  MongoDB (primary) OR PostgreSQL (optional)                  │
│  Collections/Tables: users, customers, projects, estimates,  │
│  contracts, permits, change_orders, products, notes          │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. API Documentation

### Base URL
- Local: `http://localhost:3001/api`
- Production: `https://yourdomain.com/api`

### Authentication

All protected routes require:
```
Authorization: ******
```

### Endpoints

#### Auth
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | /auth/login | Login | No |
| POST | /auth/register | Register | No |
| POST | /auth/logout | Logout | No |

**Login Request:**
```json
{ "username": "admin", "password": "Admin123!" }
```
**Login Response:**
```json
{ "success": true, "token": "eyJ...", "user": { "id": "...", "username": "admin", "role": "admin" } }
```

#### Projects
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /projects | List all projects | Yes |
| POST | /projects | Create project | Yes |
| GET | /projects/:id | Get project | Yes |
| PUT | /projects/:id | Update project | Yes |
| DELETE | /projects/:id | Delete project | Yes |

#### Estimates
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | /estimates/calculate | Calculate estimate | Yes |
| POST | /projects/:id/estimate | Save estimate | Yes |
| GET | /projects/:id/estimate | Get estimate | Yes |

**Calculate Request:**
```json
{
  "fenceType": "chain_link",
  "height": 6,
  "linearFeet": 250,
  "gates": 2,
  "taxRatePct": 8,
  "markupPct": 30
}
```

#### Products
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /products | List products (q, category params) | Yes |
| GET | /products/:id | Get single product | Yes |

#### Admin
| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /admin/stats | System statistics | Admin |
| GET | /admin/users | User list | Admin |

---

## 3. Database Schema

### Tables Summary

| Table | Rows (typical) | Primary Key | Notes |
|-------|---------------|-------------|-------|
| users | 1–50 | id (serial) | Role: admin/estimator/viewer |
| customers | 100–5000 | id (serial) | Linked to projects |
| projects | 100–5000 | id (serial) | Core table |
| estimates | 100–5000 | id (serial) | Versioned |
| contracts | 100–5000 | id (serial) | One per project |
| permits | 100–5000 | id (serial) | One per project |
| change_orders | 500–20000 | id (serial) | Many per project |
| products | 100–1000 | id (serial) | Product catalog |
| notes | 500–20000 | id (serial) | Many per project |

### Key Relationships

```
users (1) ──< projects (many) >── customers (1)
projects (1) ──< estimates (many)
projects (1) ──< contracts (1..n)
projects (1) ──< permits (1)
projects (1) ──< change_orders (many)
projects (1) ──< extras (many)
projects (1) ──< notes (many)
```

---

## 4. Frontend Modules

### calculations.js

Core functions:

| Function | Input | Output | Description |
|----------|-------|--------|-------------|
| `calculateMaterials(specs)` | fence specs object | materials cost object | Material costs with markup |
| `calculateLabor(specs)` | fence specs object | labor cost object | Labor costs by task |
| `calculateEquipment(specs)` | fence specs object | equipment cost object | Tool/fuel costs |
| `calculateExtras(extras[])` | extras array | extras total | Sum of extras |
| `calculateFullEstimate(project)` | project object | complete estimate | Full estimate all sections |

### storage.js

| Function | Description |
|----------|-------------|
| `saveProject(project)` | Save project to localStorage |
| `loadProject(id)` | Load project from localStorage |
| `getAllProjects()` | Get all saved projects |
| `exportProjectJSON(id)` | Download project as JSON |
| `importProjectJSON(file)` | Import JSON file |
| `autoSave()` | Auto-save current project |

### ui.js

| Function | Description |
|----------|-------------|
| `showToast(msg, type)` | Show toast notification |
| `openModal(id)` | Open modal dialog |
| `getFormData(formId)` | Get all form values as object |
| `populateForm(formId, data)` | Populate form from data object |
| `renderTable(tbodyId, rows, cols)` | Render data table |

---

## 5. Calculation Engine

### Material Cost Formula

```
baseMaterial = matRate[fenceType] × linearFeet × (height / 4)
postMaterial = postCount × $18/post
gateMaterial = gateCount × $85/gate
hardware     = linearFeet × $0.80/ft
concrete     = postCount × $4/post

subtotal     = sum of above
withMarkup   = subtotal × (1 + markupPct/100)   [default 30%]
materialTax  = withMarkup × taxRate              [default 8%]
```

### Labor Cost Formula

```
linearFootLabor = linearFeet × laborRate[fenceType]
postSetting     = postCount × $45/post
gateInstall     = gateCount × gateLaborRate
cleanup         = linearFeet × $0.50/ft
removalDemo     = linearFeet × $2.50/ft (if removal)

laborTotal = sum of above (no tax on labor)
```

### Post Count Formula

```
postCount = ceil(linearFeet / postSpacing) + 1 + (corners × 2)
postSpacing:
  chain_link:   8 ft
  wood_privacy: 8 ft
  vinyl:        8 ft
  aluminum:     6 ft
  wrought_iron: 6 ft
  split_rail:   8 ft
  farm:         10 ft
```

### Labor Rates by Fence Type ($/linear foot)

| Type | Mat Rate | Labor Rate | Gate Labor |
|------|----------|------------|------------|
| chain_link | $4.50 | $8.50 | $120 |
| wood_privacy | $8.00 | $14.00 | $180 |
| vinyl | $10.00 | $16.00 | $200 |
| aluminum | $12.00 | $18.00 | $220 |
| wrought_iron | $16.00 | $22.00 | $280 |
| split_rail | $4.00 | $9.00 | $130 |
| farm | $2.50 | $6.00 | $100 |

---

## 6. Flow Diagrams

### Diagram 1: New Project Flow

```
START
  │
  ▼
Open App → Tab 1: Enter customer info
  │
  ▼
Tab 2: Enter fence specifications
  (Type, Height, Linear Feet, Gates, Color)
  │
  ▼
Tab 3: Draw layout on canvas (optional)
  │
  ▼
Tab 7: Add utility locate info
  │
  ▼
Tab 6: Add permit information
  │
  ▼
Tab 8: Review auto-calculated estimate
  ├── Adjust tax rate if needed
  └── Click Recalculate
  │
  ▼
Tab 10: Add extras/add-ons (optional)
  │
  ▼
Tab 8: Save final estimate
  │
  ▼
Tab 9: Lock contract + get signature
  │
  ▼
Tab 4: Assign installation tasks
Tab 11: Assign crew members
  │
  ▼
Tab 13: Complete sign-off checklist
  │
  ▼
END
```

### Diagram 2: Estimate Calculation Flow

```
User enters specs (Tab 2)
  │
  ▼
calculations.calculateFullEstimate(project)
  │
  ├─ calculateMaterials(specs)
  │    └── baseMat + posts + gates + hardware + concrete
  │        × markup → + tax
  │
  ├─ calculateLabor(specs)
  │    └── linFt × rate + posts + gates + cleanup + removal
  │
  ├─ calculateEquipment(specs)
  │    └── digger rental + fuel + misc
  │
  ├─ calculateExtras(extras[])
  │    └── Σ (qty × rate) for each extra
  │
  └─ calculateChangeOrders(changeOrders[])
       └── Σ approved change order amounts
  │
  ▼
grandTotal = mat + labor + equipment + extras + COs + tax
  │
  ▼
Display in Tab 8 + update stats boxes
```

### Diagram 3: Data Persistence Flow

```
User makes changes
  │
  ▼
Tab module saves to FenceApp.project object
  │
  ▼
Storage.saveProject(project)
  │
  ├── localStorage[fe_project_{id}] = JSON.stringify(project)
  ├── Storage.addToProjectsList(project)
  └── Storage.saveSession()
  │
  ▼
If backend available & user logged in:
  │
  └── API.updateProject(id, project)
       └── PUT /api/projects/:id (JSON body)
```

### Diagram 4: Authentication Flow

```
User clicks Login
  │
  ▼
API.login(username, password)
  │
  POST /api/auth/login
  │
  ▼
Server: bcrypt.compare(password, hash)
  │
  ├── FAIL → 401 Invalid credentials
  │
  └── PASS → jwt.sign({id, role}, secret, {expiresIn: '24h'})
               │
               ▼
           Response: { token, user }
               │
               ▼
           localStorage.setItem('fe_token', token)
           FenceApp.isLoggedIn = true
```

### Diagram 5: Print / Export Flow

```
User clicks Print Estimate (Tab 8)
  │
  ▼
PrintTool.printEstimate()
  │
  ├── Build HTML string from project data
  ├── Open new browser window
  ├── Write HTML + print styles
  └── window.print() → PDF dialog
  │
  OR
  │
  ▼
ExportTool.exportEstimateCSV()
  │
  ├── Build CSV rows from project data
  ├── Create Blob
  └── Trigger download link
```

### Diagram 6: Change Order Flow

```
Crew discovers scope change on-site
  │
  ▼
Tab 12: + New Change Order
  ├── Enter description & amount
  └── Submit
  │
  ▼
Change order added with status: "pending"
  │
  ▼
Supervisor reviews → Approve or Deny
  │
  ├── Approved: amount added to estimate total
  └── Denied: order tracked but not counted
  │
  ▼
Tab 8: Estimate recalculates with approved COs
```

### Diagram 7: Canvas Drawing Flow

```
User opens Tab 3
  │
  ▼
Tab3Layout.init() → canvas setup
  │
  ▼
User clicks on canvas → mousedown
  │
  ▼
onMouseDown: save startX, startY
  │
  ▼
User drags → mousemove
  │
  ▼
onMouseMove: draw preview line (dashed)
  │
  ▼
User releases → mouseup
  │
  ▼
addShape(x1,y1,x2,y2):
  ├── calculate length in feet
  ├── push shape to shapes[]
  └── redraw all shapes
  │
  ▼
Save Layout → project.layout.shapes + imageData
```

### Diagram 8: Sign-Off Flow

```
Installation complete
  │
  ▼
Tab 13: Open Sign-Off tab
  │
  ▼
Check all items in completion checklist
  │
  ▼
Progress bar reaches 100%
  │
  ▼
Customer draws signature on canvas
  │
  ▼
Enter completion date, foreman name, warranty period
  │
  ▼
Click Save Sign-Off
  │
  ▼
project.signoff = {
  checklist: [true × 10],
  signature: <dataURL>,
  completionDate: '...',
  signedAt: '...'
}
  │
  ▼
Project marked complete
```

### Diagram 9: Product Catalog Flow

```
User opens Tab 16
  │
  ▼
Tab16Catalog.init()
  ├── Render department filter buttons
  └── Render product grid (local catalog ~24 items)
  │
  ▼
If user logged in:
  └── API.getProducts() → server catalog
       └── Merge with local catalog
  │
  ▼
User searches → filter() by name/SKU/dept
  │
  ▼
User clicks "+ Add to Estimate"
  │
  ▼
Product pushed to FenceApp.project.extras[]
Storage.saveProject()
UI.showToast('Added to extras ✓')
```

### Diagram 10: Backend API Request Flow

```
Frontend: API.getProjects()
  │
  ├── fetch('GET', '/api/projects', headers: {Authorization: ******
  │
  ▼
backend/server.js receives request
  │
  ▼
auth middleware:
  ├── jwt.verify(token, JWT_SECRET)
  ├── FAIL → 401
  └── PASS → req.user = decoded payload
  │
  ▼
Route handler: controller.getProjects(req, res)
  │
  ├── If MongoDB connected:
  │    └── ProjectModel.find({createdBy: req.user.id})
  │
  └── Else (in-memory store):
       └── STORE.projects.filter(...)
  │
  ▼
res.json({ success: true, projects: [...] })
  │
  ▼
Frontend: receives JSON → renders project list
```

---

## 7. Deployment Guide

### Local Development

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npx serve . -p 8080
```

### Production (Simple VPS)

```bash
# Install PM2
npm install -g pm2

# Start backend
cd backend
pm2 start server.js --name fence-estimator-api

# Serve frontend with nginx
sudo nano /etc/nginx/sites-available/fence-estimator
```

**nginx config:**
```nginx
server {
  listen 80;
  server_name yourdomain.com;

  # Frontend
  root /var/www/fence-estimator/frontend;
  index index.html;

  # API proxy
  location /api/ {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

---

## 8. Troubleshooting Guide

| # | Problem | Cause | Fix |
|---|---------|-------|-----|
| 1 | App won't open | Wrong URL | Open `frontend/index.html` directly |
| 2 | Tabs not responding | JavaScript error | Open Console (F12), fix errors |
| 3 | Estimate shows $0 | Missing specs | Fill Tab 2 completely |
| 4 | Drawing not working | Canvas not supported | Use Chrome/Firefox |
| 5 | Data lost after refresh | Browser cleared localStorage | Use Export to backup |
| 6 | Backend won't start | Missing deps | Run `npm install` |
| 7 | Port 3001 in use | Another process | Change PORT in .env |
| 8 | JWT errors | Wrong secret | Check JWT_SECRET in .env |
| 9 | MongoDB error | Not running | `sudo systemctl start mongod` |
| 10 | CORS error | URL mismatch | Add frontend URL to CORS in server.js |
| 11 | Google Maps blank | Missing API key | Add key to index.html script |
| 12 | PDF too small | Print settings | Set paper to Letter, no margins |
| 13 | CSV won't open | Wrong app | Open with Excel or Numbers |
| 14 | Signature not capturing | Touch events | Enable touch events in browser |
| 15 | Contract locked by mistake | UI locked | Reload — lock only persists on save |
| 16 | Extra items not calculating | Missing rate or qty | Enter both qty AND rate |
| 17 | Change order total wrong | Not approved | Click Approve on change order |
| 18 | Permit badge wrong color | Status mismatch | Re-select status from dropdown |
| 19 | Utility not saving | Form not submitted | Click Save Utilities Info button |
| 20 | Notes not persisting | Not saved | Click Save All in Notes tab |
| 21 | Admin shows 0 projects | No projects saved | Create a project first |
| 22 | Import fails | Wrong format | Only import .json exported from this app |
| 23 | Header shows wrong name | No project loaded | Go to Tab 1, fill name, click Save |
| 24 | Backend offline warning | No server | App still works with localStorage |
| 25 | Layout canvas too small | Screen too small | Use a wider screen or landscape mode |
| 26 | State dropdown empty | JS error on init | Reload page |
| 27 | Crew cost not updating | Missing hours or rate | Enter both hours AND rate |
| 28 | Phone validation fails | Format wrong | Use (555) 123-4567 or 5551234567 |
| 29 | ZIP validation fails | Format wrong | Use 5-digit ZIP: 12345 |
| 30 | Email validation fails | Format wrong | Use user@domain.com format |
| 31 | Tax calculation wrong | Wrong tax rate | Change tax rate in Tab 8 |
| 32 | Markup too high | Default 30% | Change in Admin Settings |
| 33 | Export CSV is empty | No estimate saved | Run estimate first (Tab 8) |
| 34 | Map markers wrong | Wrong address | Check Tab 1 address fields |
| 35 | 811 ticket not tracking | Not entered | Fill ticket number field |
| 36 | HOA status unclear | No selection | Select from HOA dropdown |
| 37 | Shop drawings not showing | No uploads | Drag files to dropzone |
| 38 | File too large error | > 10 MB | Compress image before upload |
| 39 | Print layout cut off | Browser margin | Reduce print margins to None |
| 40 | Change not reflected | Cache | Hard-refresh (Ctrl+Shift+R) |
