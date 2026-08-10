# Part 4 Implementation Menu

## Pre-installation checklist
- Node.js 18.x or newer (`node -v`)
- npm 9.x or newer (`npm -v`)
- PostgreSQL 14.x or newer (`psql --version`)
- Git 2.40 or newer (`git --version`)
- Optional for local static serving: `npx http-server` or any equivalent static file server
- Access to `backend/.env.example`
- Permission to create a database and role in PostgreSQL

## Step 1: Clone and install
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd fence-estimator
   ```
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Confirm the backend entry point exists:
   ```bash
   ls server.js
   ```

## Step 2: Database setup
> The current `backend/server.js` uses MongoDB through `MONGO_URI`. The PostgreSQL assets in `/database` support a relational deployment, reporting pipeline, or future migration path.

1. Create the PostgreSQL database and application role:
   ```sql
   CREATE ROLE fence_app LOGIN PASSWORD 'change-me';
   CREATE DATABASE fence_estimator OWNER fence_app;
   ```
2. Connect to PostgreSQL:
   ```bash
   psql -U fence_app -d fence_estimator -h localhost
   ```
3. Run the initial schema migration:
   ```bash
   psql -U fence_app -d fence_estimator -f database/migrations/001_initial_schema.sql
   ```
4. Run the performance index migration:
   ```bash
   psql -U fence_app -d fence_estimator -f database/migrations/002_indexes.sql
   ```
5. Load procedures:
   ```bash
   psql -U fence_app -d fence_estimator -f database/procedures/backup.sql
   ```
6. Seed the inventory and admin account:
   ```bash
   psql -U fence_app -d fence_estimator -f database/seed.sql
   ```
7. Verify the seed count:
   ```sql
   SELECT COUNT(*) AS inventory_items FROM inventory;
   SELECT username, role FROM users;
   ```

## Step 3: Environment configuration
1. Copy the example file:
   ```bash
   cd backend
   cp .env.example .env
   ```
2. Edit `.env` and populate all required values.
3. Minimum required variables for the existing backend:
   - `MONGO_URI`
   - `PORT`
   - `NODE_ENV`
   - `JWT_SECRET`
   - `FRONTEND_URL`
4. Recommended production additions if you wire PostgreSQL into a deployment process:
   - `PGHOST`
   - `PGPORT`
   - `PGDATABASE`
   - `PGUSER`
   - `PGPASSWORD`
   - `PGSSLMODE`

## Step 4: Start backend server
From the `backend` folder:
```bash
node server.js
```
Or use the npm script:
```bash
npm start
```
Expected startup output includes the listening URL and `/api` base path.

## Step 5: Open frontend
Option A: open the SPA directly:
```bash
xdg-open index.html
```
Option B: serve it over HTTP for better browser compatibility:
```bash
npx http-server .
```
Then open the reported URL in the browser.

## Step 6: Create first admin user
### PostgreSQL admin seed path
`database/seed.sql` inserts one admin record with a placeholder bcrypt hash. Replace the hash before production rollout.

### API registration path
If you are using the current MongoDB-based backend models, create an admin with the register endpoint and then update the stored role if needed:
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@example.com",
  "password": "StrongPassword123!",
  "role": "admin",
  "company": "Fence Depot",
  "phone": "+1-613-555-0100"
}
```
Confirm the account with:
```http
GET /api/auth/me
Authorization: ******
```

## Configuration guide
### `MONGO_URI`
MongoDB connection string consumed by `backend/server.js`. Example: `mongodb://localhost:27017/fence-estimator`.

### `PORT`
Express listening port. Defaults to `5000` if unset.

### `NODE_ENV`
Controls environment behavior such as error detail. Use `development`, `test`, or `production`.

### `JWT_SECRET`
Secret used to sign authentication tokens. Must be long, random, and unique per environment.

### `EMAIL_USER`
SMTP username for outbound email through nodemailer.

### `EMAIL_PASSWORD`
SMTP credential or app password paired with `EMAIL_USER`.

### `EMAIL_HOST`
SMTP server host name, for example `smtp.gmail.com`.

### `EMAIL_PORT`
SMTP port, typically `587` for STARTTLS or `465` for implicit TLS.

### `FRONTEND_URL`
Allowed frontend origin for browser clients and CORS policy decisions.

### `GOOGLE_MAPS_API_KEY`
Key for map, geocoding, or place lookup integrations.

### `STRIPE_PUBLIC_KEY`
Publishable Stripe key for client-side payment workflows.

### `STRIPE_SECRET_KEY`
Server-side Stripe key for secure payment actions.

### Recommended PostgreSQL deployment variables
- `PGHOST`: PostgreSQL host name or IP
- `PGPORT`: PostgreSQL port, usually `5432`
- `PGDATABASE`: target database name
- `PGUSER`: database user
- `PGPASSWORD`: database password
- `PGSSLMODE`: SSL mode such as `disable`, `require`, or `verify-full`

## Go-live checklist
- [ ] Replace all placeholder secrets in `.env`
- [ ] Rotate `JWT_SECRET` to a high-entropy production value
- [ ] Confirm MongoDB connectivity for the current backend implementation
- [ ] Run PostgreSQL migrations if using the relational schema package
- [ ] Replace the seeded admin placeholder hash with a real bcrypt hash
- [ ] Restrict CORS to the deployed frontend origin
- [ ] Validate SMTP settings with a live outbound email test
- [ ] Back up both MongoDB data and PostgreSQL schema assets
- [ ] Enable HTTPS at the reverse proxy or hosting layer
- [ ] Verify `/api/health` responds successfully
- [ ] Test register, login, project creation, estimate generation, and contract creation end to end
- [ ] Confirm log retention and monitoring are enabled
