# PART 4: IMPLEMENTATION MENU – Setup Guide

**Fence Estimator Pro** – Complete 6-Step Setup Guide

---

## STEP 1: SERVER REQUIREMENTS

### Minimum Requirements
| Component | Requirement |
|-----------|------------|
| OS | Ubuntu 20.04+ / CentOS 8+ / Windows Server 2019+ |
| Node.js | v16.0 or higher |
| MySQL | v8.0 or higher (or MariaDB 10.5+) |
| RAM | 2 GB minimum (4 GB recommended) |
| Storage | 20 GB minimum |
| CPU | 2 cores minimum |

### Optional (Production)
- SSL Certificate (Let's Encrypt recommended)
- Nginx or Apache reverse proxy
- PM2 process manager
- Google Maps API key (for Tab 17 – Mapping)

---

## STEP 2: DATABASE SETUP

### 2a. Install MySQL
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# Start and enable
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure the installation
sudo mysql_secure_installation
```

### 2b. Create Database
```bash
# Connect to MySQL
mysql -u root -p

# Run these commands:
CREATE DATABASE fence_estimator CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'fence_user'@'localhost' IDENTIFIED BY 'your_secure_password_here';
GRANT ALL PRIVILEGES ON fence_estimator.* TO 'fence_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2c. Run Schema
```bash
mysql -u fence_user -p fence_estimator < database/schema.sql
```

### 2d. Load Product Data (950+ products)
```bash
mysql -u fence_user -p fence_estimator < database/seed.sql
```

### 2e. Verify Setup
```bash
mysql -u fence_user -p fence_estimator -e "SELECT COUNT(*) FROM inventory;"
# Should return: 950+
```

---

## STEP 3: BACKEND SETUP

### 3a. Navigate to backend folder
```bash
cd backend
```

### 3b. Install dependencies
```bash
npm install
```

### 3c. Configure environment
```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file
nano .env
```

**Fill in these values in .env:**
```
PORT=3000
NODE_ENV=production
DB_HOST=localhost
DB_PORT=3306
DB_USER=fence_user
DB_PASSWORD=your_secure_password_here
DB_NAME=fence_estimator
JWT_SECRET=your_very_long_random_secret_here_minimum_32_characters
JWT_EXPIRES_IN=7d
```

### 3d. Test backend connection
```bash
npm test
```

### 3e. Start backend
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

### 3f. Install PM2 for production (keeps backend running)
```bash
npm install -g pm2
pm2 start server.js --name fence-estimator
pm2 startup
pm2 save
```

---

## STEP 4: FRONTEND SETUP

### 4a. Navigate to frontend folder
```bash
cd frontend
```

### 4b. Install dependencies
```bash
npm install
```

### 4c. Update API endpoint
Open `frontend/js/api.js` and verify:
```javascript
const BASE = '/api';  // This should match your backend URL
```

If your backend is on a different server/port, change to:
```javascript
const BASE = 'http://your-server-ip:3000/api';
```

### 4d. Serve the frontend

**Option A – Simple (development/testing):**
```bash
npm start
# Opens at http://localhost:5000
```

**Option B – Nginx (production):**
```nginx
server {
    listen 80;
    server_name yourwebsite.com;

    root /path/to/fence-estimator/frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Option C – Windows IIS:**
- Copy `frontend/` folder to `C:\inetpub\wwwroot\fence-estimator\`
- Create URL rewrite rule to proxy `/api/*` to `http://localhost:3000/api/*`

---

## STEP 5: FIRST LOGIN

### 5a. Open your browser
Navigate to: `http://your-server-address/`

### 5b. Create your admin account
The first time you run, use the admin credentials from seed.sql:
- **Username:** admin
- **Password:** Change this immediately!

```sql
-- Update admin password (run in MySQL):
UPDATE users SET password_hash = '$2b$10$NEWHASHEDPASSWORD' WHERE username = 'admin';
```

Or use the backend API:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@yourcompany.com","password":"SecurePass123!","role":"admin","company":"Your Company"}'
```

### 5c. Configure settings
1. Log in as admin
2. Go to **Tab 15 – Admin Dashboard**
3. Under **System Settings**, configure:
   - Company Name
   - Tax Rate
   - Labour Rate
   - Google Maps API Key (optional)

---

## STEP 6: GO-LIVE CHECKLIST

### Pre-Launch ✅
- [ ] Database created and schema applied
- [ ] All 950+ products seeded
- [ ] Backend `.env` configured with secure values
- [ ] JWT_SECRET is at least 32 random characters
- [ ] Admin account created with secure password
- [ ] SSL certificate installed (for production)
- [ ] Backend running with PM2 or equivalent
- [ ] Frontend served via Nginx or IIS
- [ ] Firewall configured (port 80/443 open)
- [ ] Database backups scheduled

### Test Checklist ✅
- [ ] Can log in as admin
- [ ] Can create a new project (Tab 1)
- [ ] Can enter fence specs (Tab 2)
- [ ] Estimate calculates correctly (Tab 8)
- [ ] Contract generates with correct totals (Tab 9)
- [ ] Product catalog shows 950+ items (Tab 16)
- [ ] Change orders work (Tab 12)
- [ ] Sign-off saves correctly (Tab 13)
- [ ] Notes save and filter (Tab 14)

### Performance Checklist ✅
- [ ] Page loads under 3 seconds
- [ ] Product search returns in under 1 second
- [ ] Estimate calculation instant (client-side)
- [ ] Mobile layout looks correct (test on phone)

---

## TROUBLESHOOTING QUICK REFERENCE

| Issue | Solution |
|-------|----------|
| Cannot connect to database | Check DB_HOST, DB_USER, DB_PASSWORD in .env |
| JWT errors | Verify JWT_SECRET is set and at least 32 chars |
| Products not loading | Check backend is running; run seed.sql again |
| Maps not showing | Add Google Maps API key in Admin Settings |
| Backend not starting | Run `npm install` again; check Node.js version |
| SSL errors | Verify certificate paths in Nginx config |

For detailed troubleshooting, see: **docs/PART_5_TROUBLESHOOTING_GUIDE.md**

---

*Fence Estimator Pro – Setup Guide | Fence Depot © 2026*
