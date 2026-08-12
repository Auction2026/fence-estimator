# COMPLETE IMPLEMENTATION GUIDE

> Application root: `/home/runner/work/fence-estimator/fence-estimator`
> Audience: developers, DevOps engineers, QA, project managers, and estimators

## 1. System overview

- Fence Estimator is a 17-tab fence project workflow application.
- The frontend is a static browser application under `frontend/`.
- The backend is an Express API under `backend/` with JWT authentication and MongoDB persistence.
- Primary business flow: project intake -> specs -> estimate -> contract -> change order -> sign-off.

## 2. System requirements

- Node.js 18+ recommended, Node.js 20 used in container examples.
- npm 9+ recommended.
- MongoDB 7 or a compatible managed MongoDB service.
- Modern Chromium, Firefox, Safari, or Edge browser.
- Optional: Docker, docker compose, curl, Postman, mongosh.

## 3. Tech stack overview

- Frontend: HTML5, CSS3, vanilla JavaScript.
- Backend: Node.js, Express, mongoose, bcryptjs, jsonwebtoken.
- Docs and operations: Markdown, GitHub Actions, Docker, nginx.
- Document support: pdfkit.
- Email support: nodemailer.

## 4. Repository structure

- `backend/server.js` contains the current API, schemas, auth middleware, and calculation engine.
- `frontend/index.html` contains the 17-tab application shell.
- `frontend/js/app.js` manages tab changes and localStorage-backed UI state.
- `frontend/js/calculations.js` and `frontend/js/validation.js` contain shared helpers created for testable business logic.
- `tests/` contains Jest test coverage for those helpers.

## 5. Installation summary

- Clone the repository.
- Install backend dependencies.
- Create a backend `.env` file from `.env.example`.
- Start MongoDB or point `MONGO_URI` at a managed cluster.
- Run the backend and serve the frontend.

## 6. Step-by-step installation

### 6.1 Clone the repository
```bash
git clone https://github.com/Auction2026/fence-estimator.git
cd /home/runner/work/fence-estimator/fence-estimator
```

### 6.2 Install backend dependencies
```bash
cd /home/runner/work/fence-estimator/fence-estimator/backend
npm install
```

### 6.3 Prepare environment variables
```bash
cd /home/runner/work/fence-estimator/fence-estimator/backend
cp .env.example .env
```

### 6.4 Start MongoDB
- Run a local MongoDB instance or use a hosted cluster.
- Example local URI: `mongodb://localhost:27017/fence-estimator`.

### 6.5 Start the backend
```bash
cd /home/runner/work/fence-estimator/fence-estimator/backend
npm run dev
```

### 6.6 Start or open the frontend
```bash
cd /home/runner/work/fence-estimator/fence-estimator/frontend
python -m http.server 3000
```

### 6.7 Verify the stack
- Open `http://localhost:3000`.
- Call `http://localhost:5000/api/health`.
- Confirm the browser console is free of startup errors.

## 7. Database setup instructions

### 7.1 Current supported database
- The live server uses MongoDB through Mongoose, not PostgreSQL.
- Collections are created automatically when documents are inserted.

### 7.2 Local database checklist
1. Install MongoDB Community Server.
2. Start the `mongod` service or process.
3. Confirm connectivity with `mongosh`.
4. Point `MONGO_URI` to the running instance.

### 7.3 Managed database checklist
1. Create a cluster.
2. Create a database user with least privilege.
3. Allow the application network or IP range.
4. Copy the SRV URI into `MONGO_URI`.
5. Test startup from the backend process.

### 7.4 Collections used by the app
- `users`
- `projects`
- `fencespecs`
- `estimates`
- `contracts`
- `changeorders`
- `signoffs`
- `notes`

## 8. Environment variable configuration

| Variable | Required | Example | Notes |
| --- | --- | --- | --- |
| `MONGO_URI` | Yes | `mongodb://localhost:27017/fence-estimator` | Primary database connection string. |
| `PORT` | No | `5000` | Express listen port. |
| `NODE_ENV` | No | `development` | Enables environment-specific behavior. |
| `JWT_SECRET` | Yes | `replace-me` | Used for token signing and verification. |
| `EMAIL_HOST` | No | `smtp.gmail.com` | SMTP host. |
| `EMAIL_PORT` | No | `587` | SMTP port. |
| `EMAIL_USER` | No | `ops@example.com` | SMTP user or API key username. |
| `EMAIL_PASSWORD` | No | `secret` | SMTP password or app password. |
| `FRONTEND_URL` | No | `http://localhost:3000` | Helpful for links and cross-origin policy. |
| `GOOGLE_MAPS_API_KEY` | No | `AIza...` | Enables mapping features. |
| `STRIPE_PUBLIC_KEY` | No | `pk_...` | Reserved integration field. |
| `STRIPE_SECRET_KEY` | No | `sk_...` | Reserved integration field. |

## 9. Development runtime versus production runtime

### Development
- Use `npm run dev` for live reload.
- Use local MongoDB or a non-production cluster.
- Keep example SMTP and API credentials isolated.
- Expect faster iteration but weaker hardening.

### Production
- Use `npm start` or a container.
- Enforce HTTPS.
- Use a strong randomly generated `JWT_SECRET`.
- Put MongoDB on managed or isolated infrastructure.
- Serve the frontend through nginx or a CDN-backed static host.

## 10. Deployment guide

### 10.1 Single VM deployment
1. Install Node.js, nginx, and access to MongoDB.
2. Place the repository on the server.
3. Run the backend under systemd or a process manager.
4. Serve `frontend/` with nginx.
5. Proxy `/api` to the backend port.

### 10.2 Container deployment
1. Build the backend image using `Dockerfile`.
2. Use `docker-compose.yml` for local orchestration or as a template for a real platform.
3. Mount persistent volumes for databases if you run them locally.
4. Inject secrets through environment management.

### 10.3 Managed split deployment
1. Host frontend assets on a static host.
2. Host API on a container or Node-friendly service.
3. Use MongoDB Atlas or equivalent for persistence.
4. Configure CORS and API base URLs consistently.

## 11. Security practices

- Never commit real secrets.
- Restrict MongoDB network access.
- Rotate JWT and SMTP secrets on a defined schedule.
- Review CORS before exposing the API cross-origin.
- Limit admin access and document privileged actions.
- Validate and sanitize free-text fields.
- Treat signed contract changes as change-order events.

## 12. Troubleshooting quick checks

- Backend will not start: verify `MONGO_URI`, dependencies, and port usage.
- Frontend looks blank: check browser console and asset paths.
- 401 errors: check bearer token presence and `JWT_SECRET` consistency.
- Totals look wrong: compare frontend formulas with backend CalculationEngine output.
- Mapping fails: verify Google Maps key configuration.

## 13. User manual for the 17 tabs

### 1. Project — Project Information

#### Purpose
- Capture customer identity and site basics before pricing starts.

#### Standard operator workflow
1. Open the tab after completing its prerequisites.
2. Enter or review the data needed for the current phase.
3. Save or confirm the information before moving on.

#### What to verify
- Required fields are populated.
- Downstream totals or summaries reflect the latest data.
- Any customer-facing values are reviewed before export or signature.

#### Common operator mistakes
- Skipping saves after editing values.
- Copying placeholder demo data into real quotes.
- Assuming previous-tab changes always refresh later values automatically.

#### Best-practice note
- Treat **Project Information** as an auditable step in the job lifecycle.

### 2. Specs — Fence Specifications

#### Purpose
- Define the fence type, footage, posts, height, and gate counts that drive cost.

#### Standard operator workflow
1. Open the tab after completing its prerequisites.
2. Enter or review the data needed for the current phase.
3. Save or confirm the information before moving on.

#### What to verify
- Required fields are populated.
- Downstream totals or summaries reflect the latest data.
- Any customer-facing values are reviewed before export or signature.

#### Common operator mistakes
- Skipping saves after editing values.
- Copying placeholder demo data into real quotes.
- Assuming previous-tab changes always refresh later values automatically.

#### Best-practice note
- Treat **Fence Specifications** as an auditable step in the job lifecycle.

### 3. Layout — Layout Diagram

#### Purpose
- Sketch fence runs, corners, and gate placement for estimating and installation.

#### Standard operator workflow
1. Open the tab after completing its prerequisites.
2. Enter or review the data needed for the current phase.
3. Save or confirm the information before moving on.

#### What to verify
- Required fields are populated.
- Downstream totals or summaries reflect the latest data.
- Any customer-facing values are reviewed before export or signature.

#### Common operator mistakes
- Skipping saves after editing values.
- Copying placeholder demo data into real quotes.
- Assuming previous-tab changes always refresh later values automatically.

#### Best-practice note
- Treat **Layout Diagram** as an auditable step in the job lifecycle.

### 4. Install — Installation Breakdown

#### Purpose
- Review task sequencing and labor assumptions.

#### Standard operator workflow
1. Open the tab after completing its prerequisites.
2. Enter or review the data needed for the current phase.
3. Save or confirm the information before moving on.

#### What to verify
- Required fields are populated.
- Downstream totals or summaries reflect the latest data.
- Any customer-facing values are reviewed before export or signature.

#### Common operator mistakes
- Skipping saves after editing values.
- Copying placeholder demo data into real quotes.
- Assuming previous-tab changes always refresh later values automatically.

#### Best-practice note
- Treat **Installation Breakdown** as an auditable step in the job lifecycle.

### 5. Drawings — Shop Drawings

#### Purpose
- Attach PDFs or images for layouts and engineered details.

#### Standard operator workflow
1. Open the tab after completing its prerequisites.
2. Enter or review the data needed for the current phase.
3. Save or confirm the information before moving on.

#### What to verify
- Required fields are populated.
- Downstream totals or summaries reflect the latest data.
- Any customer-facing values are reviewed before export or signature.

#### Common operator mistakes
- Skipping saves after editing values.
- Copying placeholder demo data into real quotes.
- Assuming previous-tab changes always refresh later values automatically.

#### Best-practice note
- Treat **Shop Drawings** as an auditable step in the job lifecycle.

### 6. Permits — Permits

#### Purpose
- Track jurisdiction approval details and status.

#### Standard operator workflow
1. Open the tab after completing its prerequisites.
2. Enter or review the data needed for the current phase.
3. Save or confirm the information before moving on.

#### What to verify
- Required fields are populated.
- Downstream totals or summaries reflect the latest data.
- Any customer-facing values are reviewed before export or signature.

#### Common operator mistakes
- Skipping saves after editing values.
- Copying placeholder demo data into real quotes.
- Assuming previous-tab changes always refresh later values automatically.

#### Best-practice note
- Treat **Permits** as an auditable step in the job lifecycle.

### 7. Utilities — Utilities Locate

#### Purpose
- Record utility-locate completion before digging.

#### Standard operator workflow
1. Open the tab after completing its prerequisites.
2. Enter or review the data needed for the current phase.
3. Save or confirm the information before moving on.

#### What to verify
- Required fields are populated.
- Downstream totals or summaries reflect the latest data.
- Any customer-facing values are reviewed before export or signature.

#### Common operator mistakes
- Skipping saves after editing values.
- Copying placeholder demo data into real quotes.
- Assuming previous-tab changes always refresh later values automatically.

#### Best-practice note
- Treat **Utilities Locate** as an auditable step in the job lifecycle.

### 8. Estimate — Estimate Summary

#### Purpose
- Review materials, labor, equipment, tax, and final total.

#### Standard operator workflow
1. Open the tab after completing its prerequisites.
2. Enter or review the data needed for the current phase.
3. Save or confirm the information before moving on.

#### What to verify
- Required fields are populated.
- Downstream totals or summaries reflect the latest data.
- Any customer-facing values are reviewed before export or signature.

#### Common operator mistakes
- Skipping saves after editing values.
- Copying placeholder demo data into real quotes.
- Assuming previous-tab changes always refresh later values automatically.

#### Best-practice note
- Treat **Estimate Summary** as an auditable step in the job lifecycle.

### 9. Contract — Contract

#### Purpose
- Confirm customer pricing and capture signatures.

#### Standard operator workflow
1. Open the tab after completing its prerequisites.
2. Enter or review the data needed for the current phase.
3. Save or confirm the information before moving on.

#### What to verify
- Required fields are populated.
- Downstream totals or summaries reflect the latest data.
- Any customer-facing values are reviewed before export or signature.

#### Common operator mistakes
- Skipping saves after editing values.
- Copying placeholder demo data into real quotes.
- Assuming previous-tab changes always refresh later values automatically.

#### Best-practice note
- Treat **Contract** as an auditable step in the job lifecycle.

### 10. Extras — Extras and Options

#### Purpose
- Track add-ons and optional work items.

#### Standard operator workflow
1. Open the tab after completing its prerequisites.
2. Enter or review the data needed for the current phase.
3. Save or confirm the information before moving on.

#### What to verify
- Required fields are populated.
- Downstream totals or summaries reflect the latest data.
- Any customer-facing values are reviewed before export or signature.

#### Common operator mistakes
- Skipping saves after editing values.
- Copying placeholder demo data into real quotes.
- Assuming previous-tab changes always refresh later values automatically.

#### Best-practice note
- Treat **Extras and Options** as an auditable step in the job lifecycle.

### 11. Crew — Crew Planning

#### Purpose
- Assign foremen, laborers, and specialists.

#### Standard operator workflow
1. Open the tab after completing its prerequisites.
2. Enter or review the data needed for the current phase.
3. Save or confirm the information before moving on.

#### What to verify
- Required fields are populated.
- Downstream totals or summaries reflect the latest data.
- Any customer-facing values are reviewed before export or signature.

#### Common operator mistakes
- Skipping saves after editing values.
- Copying placeholder demo data into real quotes.
- Assuming previous-tab changes always refresh later values automatically.

#### Best-practice note
- Treat **Crew Planning** as an auditable step in the job lifecycle.

### 12. Changes — Change Orders

#### Purpose
- Document price or scope changes after contract creation.

#### Standard operator workflow
1. Open the tab after completing its prerequisites.
2. Enter or review the data needed for the current phase.
3. Save or confirm the information before moving on.

#### What to verify
- Required fields are populated.
- Downstream totals or summaries reflect the latest data.
- Any customer-facing values are reviewed before export or signature.

#### Common operator mistakes
- Skipping saves after editing values.
- Copying placeholder demo data into real quotes.
- Assuming previous-tab changes always refresh later values automatically.

#### Best-practice note
- Treat **Change Orders** as an auditable step in the job lifecycle.

### 13. SignOff — Project Sign-Off

#### Purpose
- Capture closeout checklist completion and acceptance.

#### Standard operator workflow
1. Open the tab after completing its prerequisites.
2. Enter or review the data needed for the current phase.
3. Save or confirm the information before moving on.

#### What to verify
- Required fields are populated.
- Downstream totals or summaries reflect the latest data.
- Any customer-facing values are reviewed before export or signature.

#### Common operator mistakes
- Skipping saves after editing values.
- Copying placeholder demo data into real quotes.
- Assuming previous-tab changes always refresh later values automatically.

#### Best-practice note
- Treat **Project Sign-Off** as an auditable step in the job lifecycle.

### 14. Notes — Notes

#### Purpose
- Store reusable or project-specific notes.

#### Standard operator workflow
1. Open the tab after completing its prerequisites.
2. Enter or review the data needed for the current phase.
3. Save or confirm the information before moving on.

#### What to verify
- Required fields are populated.
- Downstream totals or summaries reflect the latest data.
- Any customer-facing values are reviewed before export or signature.

#### Common operator mistakes
- Skipping saves after editing values.
- Copying placeholder demo data into real quotes.
- Assuming previous-tab changes always refresh later values automatically.

#### Best-practice note
- Treat **Notes** as an auditable step in the job lifecycle.

### 15. Admin — Admin Dashboard

#### Purpose
- Review project counts and summary metrics.

#### Standard operator workflow
1. Open the tab after completing its prerequisites.
2. Enter or review the data needed for the current phase.
3. Save or confirm the information before moving on.

#### What to verify
- Required fields are populated.
- Downstream totals or summaries reflect the latest data.
- Any customer-facing values are reviewed before export or signature.

#### Common operator mistakes
- Skipping saves after editing values.
- Copying placeholder demo data into real quotes.
- Assuming previous-tab changes always refresh later values automatically.

#### Best-practice note
- Treat **Admin Dashboard** as an auditable step in the job lifecycle.

### 16. Catalog — Product Catalog

#### Purpose
- Search SKUs, pricing, and stock levels.

#### Standard operator workflow
1. Open the tab after completing its prerequisites.
2. Enter or review the data needed for the current phase.
3. Save or confirm the information before moving on.

#### What to verify
- Required fields are populated.
- Downstream totals or summaries reflect the latest data.
- Any customer-facing values are reviewed before export or signature.

#### Common operator mistakes
- Skipping saves after editing values.
- Copying placeholder demo data into real quotes.
- Assuming previous-tab changes always refresh later values automatically.

#### Best-practice note
- Treat **Product Catalog** as an auditable step in the job lifecycle.

### 17. Mapping — Property Mapping

#### Purpose
- Use map context for routing and site verification.

#### Standard operator workflow
1. Open the tab after completing its prerequisites.
2. Enter or review the data needed for the current phase.
3. Save or confirm the information before moving on.

#### What to verify
- Required fields are populated.
- Downstream totals or summaries reflect the latest data.
- Any customer-facing values are reviewed before export or signature.

#### Common operator mistakes
- Skipping saves after editing values.
- Copying placeholder demo data into real quotes.
- Assuming previous-tab changes always refresh later values automatically.

#### Best-practice note
- Treat **Property Mapping** as an auditable step in the job lifecycle.

## 14. FAQ

### FAQ 1: Can the frontend run without the backend?
Yes. The static UI can be opened directly in a browser for demos because it stores state in localStorage.

### FAQ 2: What database is active today?
The checked-in backend uses MongoDB through Mongoose.

### FAQ 3: Why do some old docs mention PostgreSQL?
Those references are legacy planning notes and do not match the current server implementation.

### FAQ 4: How long do tokens last?
The backend issues JWTs that expire after seven days by default.

### FAQ 5: Can I deploy frontend and backend separately?
Yes. That is the recommended production approach.

### FAQ 6: What should I back up?
MongoDB data, generated PDFs, uploaded drawings, and environment configuration outside the repo.

### FAQ 7: How do I handle pricing changes after signature?
Create a change order instead of editing the original contract total.

### FAQ 8: What if estimate math differs between UI and API?
Use one approved calculation path and keep shared helpers synchronized.

### FAQ 9: Is HTTPS required?
Yes for any non-local environment because JWTs and customer data are involved.

### FAQ 10: How do I demo the app fast?
Open `frontend/index.html`, complete Tabs 1-9, and show the estimate and contract flow.

### FAQ 11: Does the app support email?
The backend includes nodemailer, but the final production email workflow still depends on environment configuration.

### FAQ 12: Can multiple estimators use it?
Yes, user records include roles and company information.

### FAQ 13: How do I troubleshoot a blank map?
Check the Google Maps API key, billing status, and browser console.

### FAQ 14: Where are calculations defined?
The backend uses `CalculationEngine`, and shared testable helpers live in `frontend/js/calculations.js`.

### FAQ 15: Where are validations defined?
Shared validation helpers live in `frontend/js/validation.js`.

### FAQ 16: How do I know the API is up?
Call `/api/health` and expect a JSON OK response.

### FAQ 17: Should MongoDB be public?
No. Keep it on a private network or managed cluster with restricted access.

### FAQ 18: Can Docker run this locally?
Yes. Use the included Dockerfile and docker-compose.yml as a starting point.

### FAQ 19: Do I need a build step for the frontend?
Not in the current codebase; it is plain static HTML/CSS/JS.

### FAQ 20: What is the first file a new developer should read?
Start with `backend/server.js` and `frontend/index.html` after the README.

## 15. Go-live checklist

- [ ] MongoDB backups enabled.
- [ ] JWT secret rotated for production.
- [ ] Health check available through the load balancer.
- [ ] Frontend static hosting confirmed.
- [ ] API reachable from the frontend origin.
- [ ] SMTP test email succeeds.
- [ ] Full quote-to-contract flow tested.
- [ ] Change-order flow documented internally.
- [ ] Estimator training completed.
- [ ] Rollback plan documented.

## 16. Appendix: sample `.env` file

```env
MONGO_URI=mongodb://localhost:27017/fence-estimator
PORT=5000
NODE_ENV=development
JWT_SECRET=change-me
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=demo@example.com
EMAIL_PASSWORD=demo-password
FRONTEND_URL=http://localhost:3000
GOOGLE_MAPS_API_KEY=replace-me
STRIPE_PUBLIC_KEY=replace-me
STRIPE_SECRET_KEY=replace-me
```

