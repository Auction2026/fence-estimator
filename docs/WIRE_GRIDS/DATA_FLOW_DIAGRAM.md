# Data Flow Diagram

## Overview

This diagram shows how data moves through the system from user input to database storage and back.

```
USER INPUT
    │
    ▼
┌─────────────────────────────────┐
│  FRONTEND — index.html          │
│  • Form fields / Tab inputs     │
│  • Local validation (JS)        │
│  • localStorage (draft save)    │
└──────────────┬──────────────────┘
               │  fetch() / XMLHttpRequest
               │  JSON payload
               ▼
┌─────────────────────────────────┐
│  BACKEND — Express.js Routes    │
│  POST /api/projects             │
│  POST /api/estimates            │
│  POST /api/contracts            │
│  GET  /api/inventory            │
│  ... (all 17 tab APIs)          │
└──────────────┬──────────────────┘
               │
               ├─── JWT Middleware (auth check)
               │
               ├─── Validation Middleware
               │
               ▼
┌─────────────────────────────────┐
│  CONTROLLERS                    │
│  • projectController.js         │
│  • estimateController.js        │
│  • contractController.js        │
│  • inventoryController.js       │
└──────────────┬──────────────────┘
               │  Business logic / Calculations
               ▼
┌─────────────────────────────────┐
│  DATABASE — MySQL               │
│  INSERT / UPDATE / SELECT       │
│  Tables: projects, estimates,   │
│  contracts, inventory, users,   │
│  change_orders, sign_offs       │
└──────────────┬──────────────────┘
               │  Result rows
               ▼
┌─────────────────────────────────┐
│  BACKEND — Response Builder     │
│  • Format JSON response         │
│  • Attach calculated totals     │
│  • Return HTTP 200 / 400 / 500  │
└──────────────┬──────────────────┘
               │  JSON response
               ▼
┌─────────────────────────────────┐
│  FRONTEND — UI Update           │
│  • Parse JSON                   │
│  • Render to DOM                │
│  • Update tab display           │
│  • Show success / error message │
└─────────────────────────────────┘
               │
               ▼
         USER SEES RESULT
```

---

## Data Types

| Data | Source | Destination | Storage |
|---|---|---|---|
| Project info | Tab 1 form | `projects` table | MySQL |
| Fence specs | Tab 2 form | `fence_specs` table | MySQL |
| Material list | Calculation engine | `estimate_items` table | MySQL |
| Inventory prices | `inventory` table | Estimate total | MySQL |
| Contract | Estimate + sign | `contracts` table | MySQL |
| Change orders | After contract | `change_orders` table | MySQL |
| Draft estimate | Browser | `localStorage` | Browser |
| JWT token | Login response | `localStorage` | Browser |

---

## Error Paths

```
Backend error (500)
    │
    ▼
Frontend catches HTTP 500
    │
    ▼
Displays: "Server error — please try again"
    │
    ▼
Error logged to backend console / log file

Validation error (400)
    │
    ▼
Frontend catches HTTP 400
    │
    ▼
Highlights invalid field, shows message
```
