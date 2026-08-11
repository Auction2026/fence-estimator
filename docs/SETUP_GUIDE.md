# QUICK SETUP GUIDE
## Fence Depot Fence Estimator — 5-Minute Reference Card

---

## WHAT YOU NEED (Prerequisites)

| Software | Download From | Version |
|----------|--------------|---------|
| Node.js  | nodejs.org   | v18 LTS or newer |
| Git      | git-scm.com  | Any recent version |
| MySQL    | dev.mysql.com/downloads | v8.0+ |
| Browser  | chrome.google.com | Chrome recommended |

---

## STEP 1 — GET THE CODE

```bash
git clone https://github.com/Auction2026/fence-estimator.git
cd fence-estimator
```

---

## STEP 2 — SET UP BACKEND

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your settings:
```
DB_HOST=localhost
JWT_SECRET=change-this-to-something-random
PORT=3001
```

Start the server:
```bash
npm start
```

✅ You should see: `🚀 Server running on port 3001`

---

## STEP 3 — SET UP DATABASE

Log in to MySQL and run:
```bash
mysql -u root -p fence_estimator < database/schema.sql
mysql -u root -p fence_estimator < database/seed.sql
```

---

## STEP 4 — OPEN THE APP

**Option A (simple):** Double-click `index.html` in your file manager

**Option B (full features):**
```bash
npm install -g serve
serve . -p 3000
```
Then open: http://localhost:3000

---

## DEFAULT LOGIN

After running the database seed, log in with the seeded `admin` or `estimator` usernames.

⚠️ **The seed file uses temporary bcrypt hashes. Set your own passwords immediately:**

```sql
-- In MySQL, generate a bcrypt hash for your chosen password using:
--   node -e "const b=require('bcryptjs'); b.hash('YourNewPassword',10).then(console.log)"
-- Then update:
UPDATE users SET password_hash='<your_bcrypt_hash>' WHERE username='admin';
UPDATE users SET password_hash='<your_bcrypt_hash>' WHERE username='estimator';
```

---

## DAILY STARTUP (Every Time You Use It)

```bash
# Terminal 1: Start backend
cd fence-estimator/backend
npm start

# Browser: Open app
http://localhost:3000
```

---

## USEFUL COMMANDS

```bash
# Check if backend is running
curl http://localhost:3001/health

# Check product count in database
mysql -u root -p -e "SELECT COUNT(*) FROM fence_estimator.inventory_products"

# Restart backend
cd backend && npm start

# Update to latest version
git pull origin main && npm install
```

---

## NEED HELP?

- Setup problems: See `docs/PART_4_IMPLEMENTATION_MENU.md`
- Error messages: See `docs/PART_5_TROUBLESHOOTING_GUIDE.md`
- API details: See `docs/API_DOCUMENTATION.md`
- Diagrams: See `docs/WIRE_GRIDS/` folder
