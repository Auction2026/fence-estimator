# DATABASE SCHEMA
## Fence Depot Fence Estimator - Complete Database Reference

---

## Overview

The application uses **MongoDB** (a document database) to store all data.
MongoDB stores data as flexible JSON-like documents organized into collections.

---

## Collections (Tables)

### 1. users

Stores all user accounts for the application.

| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Auto-generated unique ID |
| username | String | Login username (must be unique) |
| email | String | Email address (must be unique) |
| password | String | Bcrypt-hashed password (never stored plain) |
| role | String | Permission level: admin, estimator, or crew |
| company | String | Company name |
| phone | String | Contact phone number |
| createdAt | Date | When account was created |

**Roles:**
- `admin` - Full access including user management
- `estimator` - Can create/edit estimates and projects
- `crew` - View-only plus notes/photos

---

### 2. projects

The central table - every estimate links back to a project.

| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Auto-generated unique ID |
| userId | ObjectId | References users._id (who created) |
| projectNumber | String | Human-readable ID (PE-2026-0001) |
| customerName | String | Customer full name |
| customerEmail | String | Customer email |
| customerPhone | String | Customer phone number |
| customerAltPhone | String | Alternate phone (optional) |
| address | String | Job site street address |
| city | String | City |
| state | String | State abbreviation (TX) |
| zip | String | ZIP code |
| projectName | String | Name/description of project |
| status | String | new / surveyed / estimated / contracted / in_progress / complete |
| notes | String | General project notes |
| createdAt | Date | Created timestamp |
| updatedAt | Date | Last modified timestamp |

---

### 3. fence_specs

Fence specifications for a project (one per project).

| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Auto-generated unique ID |
| projectId | ObjectId | References projects._id |
| fenceType | String | chain-link, wood, vinyl, aluminum, etc. |
| height | Number | Fence height in feet |
| gauge | String | Wire gauge: 11.5, 11, 9, 6 |
| coating | String | galvanized, vinyl-coated |
| color | String | silver, black, green, brown |
| linearFeet | Number | Total linear footage |
| gatesCount | Number | Number of gates |
| gateSizes | Array | List of gate widths (e.g., ["4ft", "10ft"]) |
| terrain | String | flat, slight-slope, steep-slope, rocky |
| notes | String | Special conditions or notes |

---

### 4. estimates

Financial estimates for a project.

| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Auto-generated unique ID |
| projectId | ObjectId | References projects._id |
| estimateNumber | String | Human-readable (EST-2026-0001) |
| materialsTotal | Number | Total materials cost |
| laborTotal | Number | Total labor cost |
| equipmentTotal | Number | Total equipment cost |
| overhead | Number | Overhead amount |
| discount | Number | Discount amount |
| subtotal | Number | Sum before tax |
| taxRate | Number | Tax percentage (e.g., 8.5) |
| taxAmount | Number | Calculated tax amount |
| total | Number | Final total |
| status | String | draft / sent / accepted / declined |
| locked | Boolean | Whether prices are locked |
| lineItems | Array | Individual line items (see below) |
| createdAt | Date | Created timestamp |
| updatedAt | Date | Last modified timestamp |

**lineItems array structure:**
```json
{
  "category": "materials",
  "description": "6ft Chain Link Fabric",
  "sku": "CL-6-11.5GA",
  "quantity": 4,
  "unit": "roll",
  "unitCost": 85.00,
  "totalCost": 340.00
}
```

---

### 5. contracts

Legal contracts generated from estimates.

| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Auto-generated unique ID |
| projectId | ObjectId | References projects._id |
| estimateId | ObjectId | References estimates._id |
| contractNumber | String | Human-readable (C-2026-0001) |
| terms | String | Full contract terms text |
| paymentSchedule | String | Payment terms description |
| depositAmount | Number | Required deposit |
| startDate | Date | Scheduled start date |
| completionDate | Date | Scheduled completion date |
| status | String | draft / sent / signed / active / completed |
| signedAt | Date | When customer signed |
| pdfPath | String | Path to generated PDF file |
| createdAt | Date | Created timestamp |

---

### 6. change_orders

Modifications to signed contracts.

| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Auto-generated unique ID |
| projectId | ObjectId | References projects._id |
| contractId | ObjectId | References contracts._id |
| coNumber | String | Sequential number (CO-001) |
| description | String | Description of change |
| reason | String | Why change is needed |
| lineItems | Array | Change order line items |
| total | Number | Net change amount (can be negative) |
| status | String | draft / pending / approved / declined / complete |
| approvedAt | Date | When approved |
| approvedBy | String | Who approved it |
| createdAt | Date | Created timestamp |

---

### 7. sign_offs

Customer signatures for completion/approval.

| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Auto-generated unique ID |
| projectId | ObjectId | References projects._id |
| type | String | start / progress / completion / change-order |
| signatureData | String | Base64 encoded signature image |
| signedBy | String | Name of person who signed |
| signedAt | Date | Signature timestamp |
| ipAddress | String | IP address at signing |
| notes | String | Additional notes |

---

### 8. notes

Project notes and log entries.

| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Auto-generated unique ID |
| projectId | ObjectId | References projects._id |
| userId | ObjectId | References users._id (who wrote) |
| category | String | site-visit / customer-call / internal / issue / general |
| content | String | Note text content |
| attachments | Array | File paths for any attachments |
| createdAt | Date | Created timestamp |

---

### 9. products (inventory/catalog)

Product catalog for material lookups.

| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Auto-generated unique ID |
| sku | String | Stock Keeping Unit (unique) |
| name | String | Full product name |
| category | String | fabric / line-post / terminal-post / top-rail / hardware / gate / concrete / other |
| subcategory | String | More specific category |
| unit | String | each / roll / foot / bag / box |
| cost | Number | Your cost (what you pay) |
| price | Number | Selling price (what customer pays) |
| description | String | Detailed description |
| inStock | Boolean | Whether currently available |
| updatedAt | Date | Price last updated |

**Product Categories:**
- `fabric` - Chain link mesh/fabric
- `line-post` - Interior fence posts
- `terminal-post` - End, corner, and gate posts
- `top-rail` - Top rail pipes
- `hardware` - Bands, caps, ties, rings
- `gate` - Gate frames and hardware
- `concrete` - Post setting concrete
- `tension-wire` - Bottom and brace wire
- `barbed-wire` - Barbed wire products
- `privacy-slats` - Privacy inserts

---

## Backup and Restore

### Backup Command
```bash
mongodump --db fence_estimator_db --out ./backup/$(date +%Y%m%d)
```

### Restore Command
```bash
mongorestore --db fence_estimator_db ./backup/YYYYMMDD/fence_estimator_db/
```

### MongoDB Compass (Visual Tool)
Download MongoDB Compass to view and edit data visually:
https://www.mongodb.com/try/download/compass

---

## Index Summary

The database has indexes on commonly searched fields:
- `projects.userId` - Fast lookup by user
- `projects.status` - Filter by status
- `projects.projectNumber` - Find by number
- `estimates.projectId` - Estimates for a project
- `contracts.projectId` - Contracts for a project
- `notes.projectId` - Notes for a project
- `products.sku` - Lookup by SKU
- `products.category` - Filter products by type

---

*Database Schema Reference - Fence Depot Fence Estimator v1.0*
