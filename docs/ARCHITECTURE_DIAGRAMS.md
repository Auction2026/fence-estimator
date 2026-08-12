# ARCHITECTURE DIAGRAMS

> All diagrams are ASCII/text so they render well in terminals, GitHub, and plain editors.

## 1. System architecture overview

```text
+--------------------+        HTTPS        +----------------------+
| Estimator Browser  | ------------------> | Static Frontend      |
| Admin Browser      |                     | HTML/CSS/JS          |
+--------------------+                     +----------+-----------+
                                                       |
                                                       | XHR / fetch
                                                       v
                                             +---------+----------+
                                             | Express API        |
                                             | backend/server.js  |
                                             +----+----------+----+
                                                  |          |
                                                  |          +--> SMTP / PDF / Maps
                                                  v
                                             +----+----------------+
                                             | MongoDB via         |
                                             | Mongoose            |
                                             +---------------------+
```

## 2. Frontend component tree

```text
frontend/index.html
└── #app
    ├── header.app-header
    │   ├── .logo
    │   └── .nav-menu
    ├── main.main-container
    │   ├── .tab-navigation
    │   │   ├── Tab 1  Project
    │   │   ├── Tab 2  Specs
    │   │   ├── Tab 3  Layout
    │   │   ├── Tab 4  Install
    │   │   ├── Tab 5  Drawings
    │   │   ├── Tab 6  Permits
    │   │   ├── Tab 7  Utilities
    │   │   ├── Tab 8  Estimate
    │   │   ├── Tab 9  Contract
    │   │   ├── Tab 10 Extras
    │   │   ├── Tab 11 Crew
    │   │   ├── Tab 12 Changes
    │   │   ├── Tab 13 SignOff
    │   │   ├── Tab 14 Notes
    │   │   ├── Tab 15 Admin
    │   │   ├── Tab 16 Catalog
    │   │   └── Tab 17 Mapping
    │   └── .tab-content-area
    └── footer.app-footer
```

## 3. Frontend module diagram

```text
frontend/js/app.js
├── initializeApp()
├── setupEventListeners()
├── switchTab()
├── saveProject()
├── saveSpecs()
├── calculateEstimate()
├── calculateTotal()
├── updateEstimateDisplay()
├── saveAppState()
├── loadAppState()
├── loadSavedData()
├── showHome()
└── logout()

frontend/js/calculations.js
├── normalizeFenceType()
├── calculateMaterialCost()
├── calculateLaborCost()
├── calculateEquipmentCost()
├── calculateGateCost()
├── calculatePermitCost()
├── calculateTotal()
└── calculateEstimate()

frontend/js/validation.js
├── isRequired()
├── isValidEmail()
├── isValidPhone()
├── isValidPostalCode()
├── validateProjectData()
├── validateFenceSpecs()
├── validateEstimateInput()
└── validateUserRegistration()
```

## 4. Backend module diagram

```text
backend/server.js
├── Express app bootstrap
├── Middleware
│   ├── cors()
│   ├── express.json()
│   ├── express.urlencoded()
│   ├── express.static('public')
│   └── request logger
├── connectDB()
├── Mongoose schemas/models
│   ├── User
│   ├── Project
│   ├── FenceSpecs
│   ├── Estimate
│   ├── Contract
│   ├── ChangeOrder
│   ├── SignOff
│   └── Notes
├── auth middleware
├── authorizeRole helper
├── CalculationEngine
└── API routes
```

## 5. Database ER diagram

```text
+---------+        estimator        +----------+
|  User   | 1 ------------------- * | Project  |
+---------+                         +----------+
     |                                    |
     | createdBy                          | projectId
     v                                    |
+---------+                               |
| Notes   |                               |
+---------+                               |
                                          +---- 1 --- * ----+--------------+
                                                             |              |
                                                             v              v
                                                       +-----------+   +-----------+
                                                       | FenceSpecs|   | Estimate   |
                                                       +-----------+   +-----------+
                                                                               |
                                                                               | estimateNumber
                                                                               v
                                                                          +-----------+
                                                                          | Contract  |
                                                                          +-----------+
                                                                               |
                                                                               | contractNumber
                                                                               v
                                                                          +-------------+
                                                                          | ChangeOrder |
                                                                          +-------------+

Project/projectId -----------------------------------------------------> SignOff
```

## 6. Estimate data flow

```text
Project tab input
       +
Specs tab input
       |
       v
CalculationEngine / calculations.js
       |
       +--> material cost
       +--> labor hours and labor cost
       +--> equipment cost
       +--> gate/permit/utility adjustments
       +--> subtotal, tax, total
       |
       v
Estimate tab display / API estimate record
```

## 7. Contract flow

```text
Estimate accepted
      |
      v
POST /api/contracts
      |
      +--> load estimate by estimateNumber
      +--> derive default scope, material, and labor summary
      +--> compute default deposit if needed
      +--> create locked contract record
      +--> update Project.status to contract
      v
Contract tab / signed workflow
```

## 8. Deployment architecture

```text
                 +-------------------------------+
Internet ------> | nginx / static host / CDN     |
                 +---------------+---------------+
                                 |
                                 | /api proxy
                                 v
                         +-------+--------+
                         | Express API    |
                         | container or VM|
                         +-------+--------+
                                 |
                                 v
                         +-------+--------+
                         | MongoDB        |
                         | local/managed  |
                         +----------------+
```

## 9. Docker compose topology

```text
+-------------------+     +-------------------+     +-------------------+
| frontend (nginx)  | --> | app (node)        | --> | mongo             |
| serves static UI  |     | Express backend   |     | primary database  |
+-------------------+     +-------------------+     +-------------------+
          |
          +----------------------------------> +-------------------+
                                               | db (postgres)     |
                                               | optional reporting|
                                               +-------------------+
```

## 10. Layer responsibilities

| Layer | Primary responsibility | Key files |
| --- | --- | --- |
| Browser UI | Forms, navigation, local state | `frontend/index.html`, `frontend/js/app.js` |
| Shared logic | Estimation math and validation | `frontend/js/calculations.js`, `frontend/js/validation.js` |
| API | Auth, persistence, route handling | `backend/server.js` |
| Database | Business records and workflow state | MongoDB collections |
| Automation | CI build/test/deploy | `.github/workflows/ci.yml` |
| Containers | Reproducible local/prod packaging | `Dockerfile`, `docker-compose.yml` |

## 11. Scaling notes

- Split the monolithic backend file into routes, models, services, and middleware as the API surface grows.
- Keep frontend and backend estimation logic synchronized to prevent quote drift.
- Store generated PDFs and uploaded drawings outside ephemeral containers.
- Add queue-backed jobs if PDF, email, or import workflows become long running.
## 12. Request lifecycle diagram

```text
Browser request
     |
     v
nginx/static host
     |
     +--> static asset request -> frontend file served directly
     |
     +--> /api request -> proxy to Express
                           |
                           v
                     middleware chain
                           |
                           +--> auth check (when protected)
                           +--> validation/business logic
                           +--> Mongoose model call
                           +--> JSON response
```

## 13. 17-tab dependency map

```text
Tab 1 Project  -> required by Tabs 8 and 9
Tab 2 Specs    -> required by Tab 8
Tab 3 Layout   -> supports Tab 5 and installation planning
Tab 6 Permits  -> informs Tab 8 cost and scheduling
Tab 7 Utilities-> informs installation readiness
Tab 8 Estimate -> precedes Tab 9 Contract
Tab 9 Contract -> precedes Tab 12 Changes and Tab 13 SignOff
Tab 12 Changes -> may alter closeout history but not original price lock
```

## 14. Security boundary diagram

```text
[Public Internet]
       |
       v
+-------------------+
| TLS termination    |
+-------------------+
       |
       +--> static assets (public)
       |
       +--> /api/auth/* (public write endpoints)
       |
       +--> /api/* protected business endpoints
                        |
                        v
                 JWT verification
                        |
                        v
                 MongoDB private network
```

## 15. Failure-domain view

- Frontend static host failure affects UI availability but not stored data.
- Express API failure affects authentication and persistence.
- MongoDB failure affects all write and most read operations.
- SMTP, PDF, or Maps failures are integration failures and should not corrupt primary records.
- CI failure blocks automated delivery but not runtime traffic.

## 16. Suggested future module split

```text
backend/
├── app.js
├── server.js
├── models/
│   ├── user.js
│   ├── project.js
│   ├── estimate.js
│   └── ...
├── routes/
│   ├── auth.js
│   ├── projects.js
│   ├── estimates.js
│   └── contracts.js
├── services/
│   ├── calculations.js
│   ├── pdf.js
│   └── email.js
└── middleware/
    ├── auth.js
    ├── errors.js
    └── validation.js
```

