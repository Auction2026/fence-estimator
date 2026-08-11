# COMPLETE FILE INDEX
## Fence Depot Fence Estimator — All Files & Folders

---

## ROOT DIRECTORY

| File | Description | Lines |
|------|-------------|-------|
| `index.html` | Main frontend application (8 tabs, estimate wizard, 61-SKU inventory) | 1749 |
| `index-professional.html` | Enhanced professional version of the frontend | varies |
| `FENCE_MATERIAL_SPECIFICATIONS.md` | Technical fence material specifications reference | varies |
| `BACKUP_LOG.md` | Session and backup log | varies |
| `MEGA_RESEARCH_SESSION_LOG.md` | Research and development log | varies |

---

## BACKEND (backend/)

| File | Description | Lines |
|------|-------------|-------|
| `backend/server.js` | Complete Express.js backend server | 1234 |
| `backend/package.json` | Node.js dependencies and scripts | 25 |
| `backend/.env.example` | Environment variables template | ~20 |

**Available Scripts:**
```
npm start    → Run production server
npm run dev  → Run with nodemon (auto-restart)
npm test     → Run Jest tests
```

---

## DATABASE (database/)

| File | Description | Lines |
|------|-------------|-------|
| `database/schema.sql` | All 9 database tables with indexes | 230+ |
| `database/seed.sql` | 250+ products: chain link, wood, vinyl, hardware, labor | 350+ |

**Tables in schema.sql:**
1. `users` — System users (admin, estimator, crew)
2. `customers` — Customer records
3. `projects` — Fence installation projects
4. `fence_specifications` — Technical fence specs per project
5. `estimates` — Financial estimates
6. `estimate_line_items` — Individual products in each estimate
7. `inventory_products` — Master product catalog
8. `change_orders` — Scope changes after approval
9. `audit_log` — Full action history

### Migrations (database/migrations/)

| File | Purpose |
|------|---------|
| `001_create_database.sql` | Create database + app user |
| `002_create_tables.sql` | Run schema.sql (reference) |
| `003_add_indexes.sql` | Performance indexes |
| `004_seed_data.sql` | Load seed products (reference) |

### Procedures (database/procedures/)

| File | Contents |
|------|----------|
| `stored_procedures.sql` | sp_backup_estimates, sp_recalculate_estimate_totals, sp_maintenance_cleanup |

---

## DOCUMENTATION (docs/)

| File | Description |
|------|-------------|
| `docs/README.md` | Documentation overview and navigation |
| `docs/API_DOCUMENTATION.md` | All REST API endpoints with examples |
| `docs/SETUP_GUIDE.md` | Quick-start reference card |
| `docs/PART_4_IMPLEMENTATION_MENU.md` | 6-step setup guide (detailed) |
| `docs/PART_5_TROUBLESHOOTING_GUIDE.md` | 110+ issues with solutions |
| `docs/INDEX.md` | This file — complete project index |

### Wire Grid Diagrams (docs/WIRE_GRIDS/)

| File | Diagram Description |
|------|---------------------|
| `SYSTEM_ARCHITECTURE.md` | Diagram 1: Full system overview |
| `DATA_FLOW_DIAGRAM.md` | Diagram 2: Data flow through estimate creation |
| `USER_WORKFLOW.md` | Diagram 3: User journey from lead to completion |
| `PROJECT_LIFECYCLE.md` | Diagram 4: Project status flow |
| `TAB_DEPENDENCIES.md` | Diagram 5: 8-tab application map |
| `CALCULATION_FLOW.md` | Diagram 6: Materials & cost calculation engine |
| `AUTHENTICATION_FLOW.md` | Diagram 7: Login, JWT tokens, roles |
| `DATABASE_RELATIONSHIPS.md` | Diagram 8: Entity relationship diagram (ERD) |
| `PRICING_LOCK_FLOW.md` | Diagram 9: Estimate pricing protection |
| `CHANGE_ORDER_FLOW.md` | Diagram 10: Scope change process |

---

## TECHNOLOGY STACK

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js v18, Express.js v4 |
| Database (primary) | MongoDB with Mongoose |
| Database (relational) | MySQL 8.0 |
| Authentication | JWT (jsonwebtoken), bcrypt |
| PDF Generation | PDFKit |
| Email | Nodemailer |
| Process Manager | PM2 (production) |

---

## INVENTORY COVERAGE

| Department | Products |
|------------|---------|
| Chain Link Fabric | 20 (various mesh, height, color) |
| Chain Link Line Posts | 22 |
| Chain Link Terminal Posts | 9 |
| Chain Link Top Rail | 8 |
| Commercial Fittings (hardware) | 30 |
| Barbed Wire | 7 |
| Chain Link Gates | 23 |
| Wood Fence | 29 |
| Vinyl/PVC Fence | 13 |
| Aluminum Fence | 10 |
| Installation Materials | 19 |
| Privacy Slats | 11 |
| Ornamental/Wrought Iron | 9 |
| Temporary Fence | 6 |
| Hardware/Misc | 15 |
| Labor Codes | 15 |
| **TOTAL** | **246+** |

---

## GITHUB REPOSITORY

**URL:** https://github.com/Auction2026/fence-estimator  
**Branch:** main  
**Owner:** Auction2026

---

## QUICK LINKS

- [Setup Instructions](PART_4_IMPLEMENTATION_MENU.md)
- [Troubleshooting](PART_5_TROUBLESHOOTING_GUIDE.md)
- [API Docs](API_DOCUMENTATION.md)
- [Architecture Diagram](WIRE_GRIDS/SYSTEM_ARCHITECTURE.md)
- [Database ERD](WIRE_GRIDS/DATABASE_RELATIONSHIPS.md)
