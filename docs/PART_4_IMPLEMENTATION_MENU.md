
# Part 4: Implementation Menu

This guide documents the **target production setup** for the Fence Depot estimator: a **vanilla JavaScript frontend**, a **Node.js/Express API on port 3001**, and a **PostgreSQL database**. If your current checkout still contains the earlier root-level HTML prototype and backend-only sample, use this document as the implementation baseline for the finalized deployment layout.

---

## 1. Pre-Installation Checklist

Before you install anything, confirm that you have the following:

### Required software
- **Node.js 18.x or newer**
- **npm 9.x or newer**
- **PostgreSQL 14.x or newer**
- **Git 2.35+**
- A modern browser: **Chrome, Edge, Firefox, or Safari**
- A code editor such as **VS Code**

### Recommended utilities
- **Postman** or **Insomnia** for API testing
- **psql** command-line client for PostgreSQL administration
- **PM2** for process management in production
- **nginx** for reverse proxying and TLS termination

### Minimum hardware
- 2 CPU cores
- 4 GB RAM
- 10 GB free disk space
- Stable network access for package installation

### Network and security checklist
- Port **3001** available for the backend API
- Port **5432** available for PostgreSQL
- Firewall rules prepared for HTTP/HTTPS access
- A secure **JWT secret** ready for non-development environments
- SMTP credentials available if estimate emails or contract notifications are enabled

### Repository layout expected by this guide
```text
fence-estimator/
├── backend/
│   ├── package.json
│   ├── server.js / app.js
│   ├── migrations/
│   ├── seeds/
│   └── .env
├── frontend/
│   ├── package.json   # optional if bundling or dev server is used
│   ├── index.html
│   ├── css/
│   └── js/
└── docs/
```

---

## STEP 1: Install Node.js & npm

### Windows
1. Go to **https://nodejs.org/**.
2. Download the **LTS** installer for Windows.
3. Run the installer and accept the default options.
4. Ensure **Add to PATH** is enabled.
5. Open **PowerShell** and verify:
   ```powershell
   node -v
   npm -v
   ```

### macOS
#### Option A: Official installer
1. Download the **LTS .pkg installer** from **https://nodejs.org/**.
2. Run the installer.
3. Verify:
   ```bash
   node -v
   npm -v
   ```

#### Option B: Homebrew
```bash
brew update
brew install node@18
brew link --overwrite node@18
node -v
npm -v
```

### Linux
#### Ubuntu / Debian
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm -v
```

#### RHEL / CentOS / Rocky / AlmaLinux
```bash
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs
node -v
npm -v
```

### Validation checklist
- `node -v` returns `v18.x`, `v20.x`, or newer
- `npm -v` returns a supported version
- `npm config get prefix` points to a valid install directory

---

## STEP 2: Install PostgreSQL

### Windows
1. Download PostgreSQL 14+ from **https://www.postgresql.org/download/**.
2. Run the installer.
3. Install:
   - PostgreSQL Server
   - pgAdmin
   - Command line tools
4. Set and store the **postgres** superuser password.
5. Keep the default port **5432** unless your environment requires another.

### macOS
#### Homebrew
```bash
brew update
brew install postgresql@14
brew services start postgresql@14
psql --version
```

### Linux
#### Ubuntu / Debian
```bash
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql
psql --version
```

#### RHEL / CentOS / Rocky / AlmaLinux
```bash
sudo dnf install -y postgresql-server postgresql-contrib
sudo postgresql-setup --initdb
sudo systemctl enable postgresql
sudo systemctl start postgresql
psql --version
```

### Create the application database and user
Use the PostgreSQL superuser account:

```sql
CREATE DATABASE fence_depot;
CREATE USER fence_app WITH ENCRYPTED PASSWORD 'ChangeThisStrongPassword!';
GRANT ALL PRIVILEGES ON DATABASE fence_depot TO fence_app;
```

Then assign schema permissions after connecting to the new database:

```sql
\c fence_depot
GRANT USAGE, CREATE ON SCHEMA public TO fence_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO fence_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO fence_app;
```

### Recommended extensions
```sql
\c fence_depot
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;
```

### Database validation
```bash
psql -h localhost -U fence_app -d fence_depot -c "SELECT current_database(), current_user;"
```

---

## STEP 3: Clone or Download the Repository

### Option A: Clone with Git
```bash
git clone https://github.com/<your-org>/fence-estimator.git
cd fence-estimator
```

### Option B: Download ZIP
1. Open the repository in GitHub.
2. Click **Code** → **Download ZIP**.
3. Extract the archive.
4. Open a terminal in the extracted folder.

### Verify contents
At minimum, confirm that the repository contains:
- `backend/`
- `frontend/` or a root-level prototype frontend
- `docs/`
- environment template files

---

## STEP 4: Install Dependencies

### Backend dependencies
```bash
cd backend
npm install
```

### Frontend dependencies
If the frontend is a separated app with its own tooling:
```bash
cd ../frontend
npm install
```

### If the frontend is static-only
If your checkout uses root-level HTML/CSS/JS files and has no frontend package manifest, you may skip `npm install` for the frontend and serve the files with:
- VS Code Live Server
- `npx serve .`
- Express static middleware

### Recommended global tools
```bash
npm install -g pm2
```

### Validation
```bash
cd ../backend
npm ls --depth=0
```

---

## STEP 5: Configure Environment

Create `backend/.env` from the example file.

### Linux/macOS
```bash
cd backend
cp .env.example .env
```

### Windows PowerShell
```powershell
cd backend
Copy-Item .env.example .env
```

### Example `.env`
```env
NODE_ENV=development
PORT=3001
API_BASE_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=fence_depot
DB_USER=fence_app
DB_PASSWORD=ChangeThisStrongPassword!
DATABASE_URL=******localhost:5432/fence_depot

JWT_SECRET=replace-with-a-very-long-random-secret
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10

LOG_LEVEL=info
CORS_ORIGIN=http://localhost:3000

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=notifications@example.com
SMTP_PASSWORD=replace-me
SMTP_FROM="Fence Depot <notifications@example.com>"
```

### Environment variable reference
| Variable | Purpose |
|---|---|
| `PORT` | Express API port; default production target is `3001` |
| `DATABASE_URL` | Full PostgreSQL connection string |
| `DB_*` | Individual database connection parts |
| `JWT_SECRET` | Secret used to sign and verify JWTs |
| `JWT_EXPIRES_IN` | Token lifetime |
| `FRONTEND_URL` | Used for redirects, CORS, and generated links |
| `CORS_ORIGIN` | Allowed browser origin |
| `SMTP_*` | Email delivery configuration |
| `LOG_LEVEL` | Logging verbosity |

### Generate a secure JWT secret
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

---

## STEP 6: Start the Application

### 6.1 Run database migrations
Use the migration command defined by the project. Common patterns:

```bash
cd backend
npm run migrate
```

or

```bash
npx knex migrate:latest
```

or

```bash
node ./migrations/run.js
```

### 6.2 Seed initial data
```bash
npm run seed
```

Common seed data should include:
- admin role definitions
- default catalog items
- tax defaults
- labor defaults
- sample inventory categories

### 6.3 Start the backend
#### Development
```bash
npm run dev
```

#### Production-style local run
```bash
npm start
```

Expected result:
- API listening on **http://localhost:3001**
- health endpoint available at **http://localhost:3001/api/health**

### 6.4 Start the frontend
If the frontend has its own dev server:
```bash
cd ../frontend
npm run dev
```

If the frontend is plain static files, one quick option is:
```bash
npx serve .
```

### 6.5 Open the application
- Frontend: `http://localhost:3000` or the static host you chose
- Backend API: `http://localhost:3001`

---

## Testing the Installation

### Backend health check
```bash
curl http://localhost:3001/api/health
```
Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-08-11T00:00:00.000Z"
}
```

### Authentication smoke test
```bash
curl -X POST http://localhost:3001/api/auth/login   -H "Content-Type: application/json"   -d '{"email":"admin@fencedepot.local","password":"ChangeMe123!"}'
```
Expected response includes:
- `token`
- `user`
- role such as `admin`

### Project creation smoke test
```bash
curl -X POST http://localhost:3001/api/projects   -H "Authorization: ******"   -H "Content-Type: application/json"   -d '{
    "customerName":"Pat Example",
    "customerEmail":"pat@example.com",
    "customerPhone":"555-0100",
    "address":"100 Main St",
    "city":"Calgary",
    "province":"AB",
    "postalCode":"T1T1T1"
  }'
```

### Estimate calculation smoke test
1. Create or open a project.
2. Add fence specs and catalog items.
3. Open the **Estimate** tab.
4. Confirm that material cost, labor cost, overhead, markup, tax, and total are computed.

### Browser verification checklist
- Login page loads
- Tabs switch without console errors
- Project save persists after refresh
- Estimate totals are stable after reload
- Contract price lock prevents editing after lock
- Change order updates total after approval

---

## Deployment Procedures

## A. Deploy with PM2

### Install PM2
```bash
npm install -g pm2
```

### Start the backend
```bash
cd /var/www/fence-estimator/backend
pm2 start npm --name fence-depot-api -- start
pm2 save
pm2 startup
```

### Useful PM2 commands
```bash
pm2 list
pm2 logs fence-depot-api
pm2 restart fence-depot-api
pm2 stop fence-depot-api
pm2 delete fence-depot-api
```

### Recommended ecosystem file
`ecosystem.config.js`
```js
module.exports = {
  apps: [
    {
      name: 'fence-depot-api',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/fence-estimator/backend',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    }
  ]
};
```

## B. nginx reverse proxy

### Install nginx
#### Ubuntu / Debian
```bash
sudo apt-get update
sudo apt-get install -y nginx
```

### Example nginx site config
```nginx
server {
    listen 80;
    server_name estimator.example.com;

    location / {
        root /var/www/fence-estimator/frontend;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Enable the site
```bash
sudo ln -s /etc/nginx/sites-available/fence-depot /etc/nginx/sites-enabled/fence-depot
sudo nginx -t
sudo systemctl reload nginx
```

### Add HTTPS with Let's Encrypt
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d estimator.example.com
```

---

## User Setup Guide: Creating the First Admin User

There are three safe ways to create the first administrative account.

### Option 1: Seed script (recommended)
If the project includes a seed command:
```bash
cd backend
npm run seed
```
Recommended seed account:
- Email: `admin@fencedepot.local`
- Password: `ChangeMe123!`

Change the password immediately after first login.

### Option 2: SQL insert with a bcrypt hash
Generate a bcrypt hash from the backend folder after dependencies are installed:
```bash
cd backend
node -e "console.log(require('bcryptjs').hashSync('ChangeMe123!', 10))"
```

Then insert the admin user in PostgreSQL:
```sql
INSERT INTO users (
  email,
  password_hash,
  first_name,
  last_name,
  role,
  is_active,
  created_at,
  updated_at
) VALUES (
  'admin@fencedepot.local',
  '<PASTE_BCRYPT_HASH_HERE>',
  'Fence',
  'Admin',
  'admin',
  true,
  NOW(),
  NOW()
);
```

### Option 3: Temporary bootstrap endpoint
If your deployment enables first-run bootstrap mode, set:
```env
ADMIN_BOOTSTRAP=true
```
Then call the setup route once, disable it, and restart the application.

### First-login checklist
- Sign in with the bootstrap credentials
- Change the password
- Confirm role = `admin`
- Create at least one estimator account
- Load the item catalog before creating live estimates
- Set labor defaults, tax defaults, and company contact data

---

## Post-Install Operational Checklist

- [ ] `backend/.env` created and secured
- [ ] PostgreSQL reachable from the API host
- [ ] Migrations completed without errors
- [ ] Seed data loaded
- [ ] Admin account created and tested
- [ ] `/api/health` returns 200
- [ ] Frontend can log in and call protected API routes
- [ ] PM2 process is online in production
- [ ] nginx proxy passes `/api/*` to port 3001
- [ ] TLS certificate installed for production domains

## Common First-Day Tasks
- Import inventory and supplier pricing into the catalog
- Validate estimate calculations against a known sample project
- Test price locking and change-order approval flows
- Create at least one backup of the PostgreSQL database
- Document your environment-specific values in a secure secrets manager
