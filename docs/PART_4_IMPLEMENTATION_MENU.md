# PART 4: IMPLEMENTATION MENU
## Fence Depot Estimator — Complete 6-Step Setup Guide

---

## 📋 TABLE OF CONTENTS

1. [Step 1: Server & Environment Setup](#step-1-server--environment-setup)
2. [Step 2: Database Installation](#step-2-database-installation)
3. [Step 3: Backend Configuration & Launch](#step-3-backend-configuration--launch)
4. [Step 4: Frontend Deployment](#step-4-frontend-deployment)
5. [Step 5: First Login & System Configuration](#step-5-first-login--system-configuration)
6. [Step 6: Production Hardening](#step-6-production-hardening)

---

## STEP 1: SERVER & ENVIRONMENT SETUP

### System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **Operating System** | Ubuntu 20.04 LTS | Ubuntu 22.04 LTS |
| **RAM** | 2 GB | 8 GB |
| **Storage** | 20 GB SSD | 100 GB SSD |
| **CPU** | 2 cores | 4 cores |
| **Network** | 10 Mbps | 100 Mbps |
| **Node.js** | 16.x LTS | 18.x LTS |
| **PostgreSQL** | 13 | 15+ |
| **SSL Certificate** | Required for production | Let's Encrypt (free) |

---

### 1.1 Install Node.js (Ubuntu)

```bash
# Install NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell
source ~/.bashrc

# Install Node.js 18 LTS
nvm install 18
nvm use 18
nvm alias default 18

# Verify
node --version    # should show v18.x.x
npm --version     # should show 9.x.x or higher
```

---

### 1.2 Install PostgreSQL

```bash
# Update package list
sudo apt update

# Install PostgreSQL 15
sudo apt install -y postgresql-15 postgresql-contrib-15

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify PostgreSQL is running
sudo systemctl status postgresql
```

---

### 1.3 Install Required System Packages

```bash
# Install Git
sudo apt install -y git

# Install build tools (for native npm modules)
sudo apt install -y build-essential

# Install Nginx (for reverse proxy)
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx

# Install PM2 (Node.js process manager)
npm install -g pm2
```

---

## STEP 2: DATABASE INSTALLATION

### 2.1 Create PostgreSQL Database and User

```bash
# Log into PostgreSQL as postgres user
sudo -u postgres psql

# Inside psql prompt, run:
CREATE USER fence_user WITH PASSWORD 'your_secure_password_here';
CREATE DATABASE fence_estimator OWNER fence_user;
GRANT ALL PRIVILEGES ON DATABASE fence_estimator TO fence_user;

# Enable UUID extension (optional but recommended)
\c fence_estimator
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

# Exit psql
\q
```

---

### 2.2 Run Database Migrations

```bash
# Navigate to the database folder
cd /path/to/fence-estimator/database

# Run migrations in order
sudo -u postgres psql -d fence_estimator -f migrations/001_initial_schema.sql
sudo -u postgres psql -d fence_estimator -f migrations/002_seed_products.sql
sudo -u postgres psql -d fence_estimator -f migrations/003_pricing_views.sql
sudo -u postgres psql -d fence_estimator -f migrations/004_procedures_triggers.sql

# Verify product count (should be 950+)
sudo -u postgres psql -d fence_estimator -c "SELECT COUNT(*) FROM products;"

# Verify categories
sudo -u postgres psql -d fence_estimator -c "SELECT code, name FROM product_categories ORDER BY sort_order;"
```

---

### 2.3 Verify Database Setup

```bash
# Check all tables were created
sudo -u postgres psql -d fence_estimator -c "\dt"

# Expected tables:
# users
# projects
# fence_specifications
# product_categories
# products
# estimates
# estimate_line_items
# change_orders
# audit_log
# schema_migrations

# Check views were created
sudo -u postgres psql -d fence_estimator -c "\dv"

# Expected views:
# v_products_priced
# v_estimate_totals
# v_project_summary
```

---

### 2.4 Database Backup Setup (Recommended)

```bash
# Create backup directory
sudo mkdir -p /var/backups/fence-estimator
sudo chown -R fence_user:fence_user /var/backups/fence-estimator

# Create daily backup script
sudo nano /usr/local/bin/fence-db-backup.sh
```

**Contents of backup script:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/fence-estimator"
DB_NAME="fence_estimator"

pg_dump -U fence_user -h localhost $DB_NAME \
  | gzip > $BACKUP_DIR/fence_estimator_$DATE.sql.gz

# Keep only last 30 days of backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_DIR/fence_estimator_$DATE.sql.gz"
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/fence-db-backup.sh

# Schedule daily backup at 2am
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/fence-db-backup.sh >> /var/log/fence-backup.log 2>&1") | crontab -
```

---

## STEP 3: BACKEND CONFIGURATION & LAUNCH

### 3.1 Clone the Repository

```bash
# Navigate to your web root
cd /var/www

# Clone the repository
git clone https://github.com/Auction2026/fence-estimator.git
cd fence-estimator/backend

# Install Node.js dependencies
npm install
```

---

### 3.2 Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit the environment file
nano .env
```

**Fill in all values in `.env`:**
```
# Database
MONGO_URI=******localhost:5432/fence_estimator

# Server
PORT=5000
NODE_ENV=production

# JWT (generate a random 256-bit secret)
JWT_SECRET=your-very-long-random-secret-key-here-at-least-32-chars

# Email (Gmail example)
EMAIL_USER=your-business-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# Frontend URL
FRONTEND_URL=https://yourdomain.com

# Google Maps API Key (for site mapping)
GOOGLE_MAPS_API_KEY=your-google-maps-api-key-here

# Stripe (optional - for payments)
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

> **Important:** Never commit `.env` to Git. It is already in `.gitignore`.

---

### 3.3 Generate a Secure JWT Secret

```bash
# Generate a 64-character random secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and paste it as your `JWT_SECRET` value.

---

### 3.4 Launch Backend with PM2

```bash
# Navigate to backend
cd /var/www/fence-estimator/backend

# Start the backend with PM2
pm2 start server.js --name "fence-estimator-backend"

# Save PM2 process list (so it restarts on server reboot)
pm2 save

# Set PM2 to start on boot
pm2 startup
# Follow the instructions it prints

# Check the backend is running
pm2 status
pm2 logs fence-estimator-backend
```

---

### 3.5 Verify Backend is Running

```bash
# Test the health endpoint
curl http://localhost:5000/api/health

# Expected response:
# {"status":"ok","timestamp":"...","environment":"production"}
```

---

## STEP 4: FRONTEND DEPLOYMENT

### 4.1 Configure Nginx as Reverse Proxy

```bash
# Create Nginx site configuration
sudo nano /etc/nginx/sites-available/fence-estimator
```

**Contents of Nginx config:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com www.yourdomain.com;

    # SSL certificates (will be set by Certbot)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend files
    root /var/www/fence-estimator;
    index index.html;

    # Serve frontend (single-page app)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/fence-estimator /etc/nginx/sites-enabled/

# Test Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

### 4.2 Install SSL Certificate (Let's Encrypt - Free)

```bash
# Replace yourdomain.com with your actual domain
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is set up automatically
# Verify renewal will work
sudo certbot renew --dry-run
```

---

### 4.3 Set Correct File Permissions

```bash
# Set ownership
sudo chown -R www-data:www-data /var/www/fence-estimator

# Set directory permissions
sudo find /var/www/fence-estimator -type d -exec chmod 755 {} \;

# Set file permissions
sudo find /var/www/fence-estimator -type f -exec chmod 644 {} \;

# Backend must be executable
sudo chmod +x /var/www/fence-estimator/backend/server.js
```

---

## STEP 5: FIRST LOGIN & SYSTEM CONFIGURATION

### 5.1 Create Admin User

```bash
# Connect to database
sudo -u postgres psql -d fence_estimator

# The seed.sql created a placeholder admin — update the password now:
UPDATE users
SET password_hash = crypt('YourNewAdminPassword123!', gen_salt('bf', 10))
WHERE username = 'admin';

# Or use the backend API to create a new admin:
# POST http://localhost:5000/api/auth/register
# {
#   "username": "admin",
#   "email": "admin@yourcompany.ca",
#   "password": "YourNewAdminPassword123!",
#   "role": "admin",
#   "company": "Your Fence Company Inc."
# }
\q
```

---

### 5.2 First Login Steps

1. Open your browser and go to: `https://yourdomain.com`
2. Click **"Login"** on the landing page
3. Enter your admin credentials
4. You will be taken to the **Dashboard**

---

### 5.3 System Settings to Configure

After first login, go to **Settings** tab and configure:

| Setting | Value | Notes |
|---------|-------|-------|
| **Standard Labour Rate** | $30.00–$45.00/hr | Your crew's hourly rate |
| **Labour Markup** | 50% | Standard contractor markup |
| **Tax Rate** | 13% (Ontario HST) | Set your province's tax rate |
| **Default Profit Margin** | 35% | Adjust to your business model |
| **Default Units** | Imperial (Feet) | Canadian standard |
| **Company Name** | Your company name | Appears on estimates |
| **Company Address** | Your address | Appears on estimates |
| **Company Phone** | Your phone | Appears on estimates |
| **Email From Name** | Your company | For customer emails |
| **Valid Days (Estimates)** | 30 | How long estimates are valid |

---

### 5.4 Add Your Team Members

1. Go to **Settings → Users**
2. Click **"Add User"**
3. Fill in:
   - **Username** (e.g., `john.smith`)
   - **Email** (company email)
   - **Role** (`estimator` or `crew`)
   - **Temporary Password** (they change on first login)

**User Roles:**
| Role | Access Level |
|------|-------------|
| `admin` | Full access — all features, user management, price changes |
| `estimator` | Create/edit projects and estimates, view reports |
| `crew` | View assigned projects, update status only |
| `viewer` | Read-only access to approved estimates |

---

## STEP 6: PRODUCTION HARDENING

### 6.1 Firewall Configuration

```bash
# Install UFW
sudo apt install -y ufw

# Allow essential services
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Block everything else (important!)
sudo ufw --force enable

# Verify status
sudo ufw status verbose
```

---

### 6.2 Keep System Updated

```bash
# Set up automatic security updates
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

---

### 6.3 Monitor Backend with PM2

```bash
# View real-time logs
pm2 logs fence-estimator-backend

# Monitor CPU and memory
pm2 monit

# Restart if needed
pm2 restart fence-estimator-backend

# Reload without downtime
pm2 reload fence-estimator-backend
```

---

### 6.4 Database Connection Security

```bash
# Edit PostgreSQL connection settings
sudo nano /etc/postgresql/15/main/pg_hba.conf

# Ensure fence_user can only connect locally:
# host  fence_estimator  fence_user  127.0.0.1/32  scram-sha-256

# Restart PostgreSQL
sudo systemctl restart postgresql
```

---

### 6.5 Post-Installation Checklist

Before going live, verify:

- [ ] SSL certificate installed and working (green padlock in browser)
- [ ] Backend running (`pm2 status` shows "online")
- [ ] Database has 950+ products (`SELECT COUNT(*) FROM products;`)
- [ ] Admin login working
- [ ] Can create a test project
- [ ] Can create a test estimate
- [ ] PDF generation working (test with one estimate)
- [ ] Email notification working (send a test estimate)
- [ ] Firewall enabled (`sudo ufw status`)
- [ ] Automated database backup running (`ls /var/backups/fence-estimator/`)
- [ ] PM2 set to auto-start on reboot (`pm2 startup`)

---

## 📞 SUPPORT

If you encounter any issues during setup:

1. Check the logs: `pm2 logs fence-estimator-backend`
2. Check Nginx: `sudo nginx -t && sudo journalctl -u nginx`
3. Check database: `sudo -u postgres psql -d fence_estimator -c "SELECT version();"`
4. Refer to **PART 5: Troubleshooting Guide** for 110+ solutions

---

*Fence Depot Estimator — Canadian Standards Compliant*
*Implementation Guide v1.0 — August 2026*
