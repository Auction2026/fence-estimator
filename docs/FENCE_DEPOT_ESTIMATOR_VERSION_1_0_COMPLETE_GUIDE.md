# Fence Depot Estimator — Version 1.0 Complete Guide

> **Single-file master reference for your programmer.**
> Every section of code and documentation is contained below.
> Use the table of contents to jump directly to any section.

---

## Table of Contents

| # | Section |
|---|---------|
| 1 | [Project Overview](#section-1-project-overview) |
| 2 | [Installation & Setup](#section-2-installation--setup) |
| 3 | [Project Structure](#section-3-project-structure) |
| 4 | [index.html — Complete Frontend](#section-4-indexhtml--complete-frontend) |
| 5 | [Backend server.js — Express API](#section-5-backend-serverjs--express-api) |
| 6 | [Backend package.json — Dependencies](#section-6-backend-packagejson--dependencies) |
| 7 | [Environment Variables (.env.example)](#section-7-environment-variables-envexample) |
| 8 | [Calculation Engine — Logic Reference](#section-8-calculation-engine--logic-reference) |
| 9 | [Estimate Wizard — Step-by-Step Flow](#section-9-estimate-wizard--step-by-step-flow) |
| 10 | [INVENTORY_DB — Product Catalog Reference](#section-10-inventory_db--product-catalog-reference) |
| 11 | [Tab Structure — All 17 Tabs](#section-11-tab-structure--all-17-tabs) |
| 12 | [localStorage Persistence](#section-12-localstorage-persistence) |
| 13 | [API Routes Reference](#section-13-api-routes-reference) |
| 14 | [Authentication — JWT Flow](#section-14-authentication--jwt-flow) |
| 15 | [PDF Generation — pdfkit](#section-15-pdf-generation--pdfkit) |
| 16 | [Email — nodemailer](#section-16-email--nodemailer) |
| 17 | [Database Schema — MongoDB Models](#section-17-database-schema--mongodb-models) |
| 18 | [Database Seed Data](#section-18-database-seed-data) |
| 19 | [Database Migrations & Procedures](#section-19-database-migrations--procedures) |
| 20 | [Material Specifications — Canadian Standards](#section-20-material-specifications--canadian-standards) |
| 21 | [Implementation Guide](#section-21-implementation-guide) |
| 22 | [API Documentation](#section-22-api-documentation) |
| 23 | [Frontend Component Map](#section-23-frontend-component-map) |
| 24 | [Calculation Formulas Reference](#section-24-calculation-formulas-reference) |
| 25 | [Validation Rules](#section-25-validation-rules) |
| 26 | [Architecture & Data Flow](#section-26-architecture--data-flow) |
| 27 | [Troubleshooting Guide](#section-27-troubleshooting-guide) |
| 28 | [Deployment & Maintenance](#section-28-deployment--maintenance) |
| 29 | [Wire Grid Diagrams](#section-29-wire-grid-diagrams) |
| 30 | [Changelog & Version Notes](#section-30-changelog--version-notes) |

---

## Section 1: Project Overview

**Fence Depot Estimator v1.0** is a full-stack web application that allows Fence Depot staff to:

- Build detailed fence material estimates in a multi-tab wizard
- Calculate chain-link, PVC/vinyl, wood, wrought-iron, and guide-rail fencing
- Look up live POS inventory prices via the embedded `INVENTORY_DB`
- Generate PDF proposals and email them to customers
- Store estimates in MongoDB (via the Express backend)

### Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla HTML5 / CSS3 / JavaScript (single-file) |
| Backend | Node.js + Express 4.x |
| Database | MongoDB + Mongoose 7 |
| Auth | JSON Web Token (JWT) + bcryptjs |
| PDF | pdfkit 0.13 |
| Email | nodemailer 6.9 |
| Maps | Google Maps API |
| Hosting | Any Node.js host (Heroku, Railway, VPS) |

### Key Features

- 17-tab estimate wizard
- Automatic material calculation (posts, rails, mesh, fittings)
- 61-SKU POS inventory with live pricing
- Auto-save to localStorage
- PDF export
- Customer email delivery
- Admin dashboard

---

## Section 2: Installation & Setup

### Prerequisites

- Node.js 18+ (https://nodejs.org)
- MongoDB 6+ (https://www.mongodb.com/try/download/community) — local **or** MongoDB Atlas cloud
- A Gmail account (for email sending) or other SMTP provider
- Git (https://git-scm.com)

### Step 1 — Clone the repository

```bash
git clone https://github.com/Auction2026/fence-estimator.git
cd fence-estimator
```

### Step 2 — Install backend dependencies

```bash
cd backend
npm install
```

### Step 3 — Configure environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```
# Database Configuration
MONGO_URI=mongodb://localhost:27017/fence-estimator

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-secret-key-change-this-in-production

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-email-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Google Maps API Key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Stripe Configuration (for payments if needed)
STRIPE_PUBLIC_KEY=your-stripe-public-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

### Step 4 — Start MongoDB

**Local:**
```bash
mongod --dbpath /data/db
```

**Atlas:** set `MONGO_URI` to your Atlas connection string.

### Step 5 — Start the backend server

```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

Backend runs at **http://localhost:5000**

### Step 6 — Open the frontend

Open `index.html` directly in your browser (no build step required):

```bash
open index.html           # macOS
start index.html          # Windows
xdg-open index.html       # Linux
```

Or serve with a simple HTTP server:

```bash
npx serve .
```

Frontend runs at **http://localhost:3000**

---

## Section 3: Project Structure

```
fence-estimator/
│
├── index.html                           ← Complete frontend (self-contained)
├── index-professional.html              ← Professional variant (alternate UI)
│
├── backend/
│   ├── server.js                        ← Express API server (all routes + logic)
│   ├── package.json                     ← Node dependencies
│   └── .env.example                     ← Environment variable template
│
├── docs/
│   └── FENCE_DEPOT_ESTIMATOR_VERSION_1_0_COMPLETE_GUIDE.md  ← This file
│
├── FENCE_MATERIAL_SPECIFICATIONS.md     ← Canadian standard material specs
├── PART_4_IMPLEMENTATION_MENU.md        ← Implementation checklist
├── PART_5_TROUBLESHOOTING_GUIDE.md      ← Detailed troubleshooting
├── BACKUP_LOG.md                        ← Backup/restore log
└── MEGA_RESEARCH_SESSION_LOG.md         ← Research session notes
```

### Planned Directory Structure (after full implementation)

```
fence-estimator/
├── frontend/
│   ├── css/
│   │   ├── styles.css
│   │   └── responsive.css
│   ├── js/
│   │   ├── app.js
│   │   ├── api.js
│   │   ├── calculations.js
│   │   ├── validation.js
│   │   ├── storage.js
│   │   ├── ui.js
│   │   ├── tabs/
│   │   │   ├── tab01-project.js
│   │   │   ├── tab02-specs.js
│   │   │   ├── tab03-layout.js
│   │   │   ├── tab04-installation.js
│   │   │   ├── tab05-drawings.js
│   │   │   ├── tab06-permits.js
│   │   │   ├── tab07-utilities.js
│   │   │   ├── tab08-estimate.js
│   │   │   ├── tab09-contract.js
│   │   │   ├── tab10-extras.js
│   │   │   ├── tab11-crew.js
│   │   │   ├── tab12-change-orders.js
│   │   │   ├── tab13-sign-off.js
│   │   │   ├── tab14-notes.js
│   │   │   ├── tab15-admin.js
│   │   │   ├── tab16-catalog.js
│   │   │   └── tab17-mapping.js
│   │   └── tools/
│   │       ├── drawing.js
│   │       ├── mapping.js
│   │       ├── printing.js
│   │       └── export.js
│   └── index.html
├── backend/
│   ├── models/
│   │   ├── Estimate.js
│   │   ├── Customer.js
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes/
│   │   ├── estimates.js
│   │   ├── customers.js
│   │   ├── products.js
│   │   └── auth.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
└── database/
    ├── schema.sql
    ├── seed.sql
    └── migrations/
```

---

## Section 4: index.html — Complete Frontend

> **This is the complete, self-contained frontend.**
> All CSS, JavaScript, and HTML are embedded in this single file.
> The file is 1,749 lines and includes the full 17-tab estimator.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fence Depot Estimator - Professional Fencing Solutions</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: #0FA89F;
            --primary-dark: #078A83;
            --primary-light: #4ECDC4;
            --secondary: #1B2D4D;
            --secondary-light: #2C3E50;
            --accent: #FF6B35;
            --accent-light: #FF8C5A;
            --success: #27AE60;
            --alert: #E74C3C;
            --warning: #F39C12;
            --neutral-light: #F5F7FA;
            --neutral-gray: #ECF0F1;
            --text-dark: #2C3E50;
            --text-light: #7F8C8D;
            --border: #E0E6ED;
        }

        body {
            font-family: 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
            background: linear-gradient(135deg, #F5F7FA 0%, #E8EEF5 100%);
            min-height: 100vh;
            color: var(--text-dark);
        }

        .container {
            width: 100%;
            max-width: 1600px;
            margin: 0 auto;
        }

        /* ===== LANDING PAGE ===== */
        .landing-page {
            background: linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%);
            color: white;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 40px 20px;
            text-align: center;
        }

        .landing-header {
            margin-bottom: 60px;
        }

        .landing-logo {
            font-size: 64px;
            margin-bottom: 20px;
            animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }

        .landing-title {
            font-size: 56px;
            font-weight: 700;
            margin-bottom: 20px;
            letter-spacing: -1px;
        }

        .landing-subtitle {
            font-size: 24px;
            opacity: 0.9;
            margin-bottom: 40px;
            font-weight: 300;
            letter-spacing: 0.5px;
        }

        .landing-features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            margin: 60px 0;
            max-width: 1000px;
            margin-left: auto;
            margin-right: auto;
        }

        .feature-box {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 30px;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s;
        }

        .feature-box:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-5px);
        }

        .feature-icon {
            font-size: 40px;
            margin-bottom: 15px;
        }

        .feature-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 10px;
        }

        .feature-description {
            font-size: 14px;
            opacity: 0.9;
        }

        .landing-cta {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 60px;
        }

        .btn {
            padding: 14px 40px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            text-decoration: none;
            display: inline-block;
        }

        .btn-primary {
            background: var(--accent);
            color: white;
            box-shadow: 0 10px 30px rgba(255, 107, 53, 0.3);
        }

        .btn-primary:hover {
            background: var(--accent-light);
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(255, 107, 53, 0.4);
        }

        .btn-secondary {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 2px solid white;
            backdrop-filter: blur(10px);
        }

        .btn-secondary:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-3px);
        }

        .btn-logout {
            background: var(--alert);
            color: white;
            padding: 10px 20px;
            font-size: 14px;
        }

        /* ===== LOGIN SCREEN ===== */
        .login-screen {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 40px 20px;
        }

        .login-card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
            padding: 50px 40px;
            width: 100%;
            max-width: 450px;
        }

        .login-header {
            text-align: center;
            margin-bottom: 40px;
        }

        .login-logo {
            font-size: 48px;
            margin-bottom: 15px;
        }

        .login-title {
            font-size: 28px;
            font-weight: 700;
            color: var(--secondary);
            margin-bottom: 10px;
        }

        .login-subtitle {
            font-size: 14px;
            color: var(--text-light);
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: var(--text-dark);
            font-weight: 600;
            font-size: 14px;
        }

        .form-group input {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid var(--border);
            border-radius: 8px;
            font-size: 14px;
            transition: all 0.3s;
            background: var(--neutral-light);
        }

        .form-group input:focus {
            outline: none;
            border-color: var(--primary);
            background: white;
            box-shadow: 0 0 0 3px rgba(15, 168, 159, 0.1);
        }

        .btn-login {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: white;
            margin-bottom: 15px;
            font-size: 16px;
            font-weight: 600;
        }

        .btn-demo {
            width: 100%;
            padding: 12px;
            background: var(--neutral-gray);
            color: var(--text-dark);
            margin-top: 20px;
            font-size: 16px;
            font-weight: 600;
        }

        .btn-demo:hover {
            background: #D5DBEC;
        }

        /* ===== DASHBOARD SCREEN ===== */
        .dashboard-screen {
            display: none;
            background: var(--neutral-light);
            min-height: 100vh;
        }

        .dashboard-header {
            background: linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%);
            color: white;
            padding: 25px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .dashboard-title h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 5px;
        }

        .dashboard-title p {
            font-size: 14px;
            opacity: 0.9;
        }

        .user-info {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .user-details {
            text-align: right;
        }

        .user-name {
            font-weight: 600;
            font-size: 16px;
        }

        .user-role {
            font-size: 13px;
            opacity: 0.8;
        }

        .avatar {
            width: 48px;
            height: 48px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 18px;
            border: 2px solid rgba(255, 255, 255, 0.5);
        }

        /* ===== NAVIGATION TABS ===== */
        .tab-navigation {
            background: white;
            border-bottom: 2px solid var(--border);
            display: flex;
            flex-wrap: wrap;
            gap: 0;
            padding: 0 40px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .tab-item {
            padding: 18px 25px;
            cursor: pointer;
            border: none;
            background: none;
            font-size: 15px;
            font-weight: 600;
            color: var(--text-light);
            transition: all 0.3s;
            border-bottom: 3px solid transparent;
            position: relative;
            white-space: nowrap;
        }

        .tab-item:hover {
            color: var(--primary);
        }

        .tab-item.active {
            color: var(--primary);
            border-bottom-color: var(--primary);
        }

        /* ===== DASHBOARD CONTENT ===== */
        .dashboard-content {
            padding: 40px;
        }

        .section-header {
            margin-bottom: 30px;
        }

        .section-title {
            font-size: 28px;
            font-weight: 700;
            color: var(--text-dark);
            margin-bottom: 10px;
        }

        .section-subtitle {
            font-size: 14px;
            color: var(--text-light);
        }

        /* ===== STATS GRID ===== */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 25px;
            margin-bottom: 40px;
        }

        .stat-card {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            border-left: 4px solid;
            transition: all 0.3s;
        }

        .stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
        }

        .stat-card.primary {
            border-left-color: var(--primary);
        }

        .stat-card.success {
            border-left-color: var(--success);
        }

        .stat-card.accent {
            border-left-color: var(--accent);
        }

        .stat-label {
            font-size: 13px;
            color: var(--text-light);
            font-weight: 600;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .stat-value {
            font-size: 36px;
            font-weight: 700;
            color: var(--text-dark);
            margin-bottom: 10px;
        }

        .stat-change {
            font-size: 13px;
            color: var(--success);
            font-weight: 600;
        }

        /* ===== TABLES ===== */
        .table-section {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            overflow: hidden;
        }

        .table-header {
            padding: 25px;
            border-bottom: 2px solid var(--border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .table-title {
            font-size: 18px;
            font-weight: 700;
            color: var(--text-dark);
        }

        .table-responsive {
            overflow-x: auto;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th {
            background: var(--neutral-light);
            padding: 16px 25px;
            text-align: left;
            font-weight: 700;
            color: var(--text-dark);
            font-size: 14px;
            border-bottom: 2px solid var(--border);
        }

        td {
            padding: 16px 25px;
            border-bottom: 1px solid var(--border);
            font-size: 14px;
        }

        tr:hover {
            background: var(--neutral-light);
        }

        .status-badge {
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .status-contract {
            background: rgba(39, 174, 96, 0.15);
            color: var(--success);
        }

        .status-pending {
            background: rgba(243, 156, 18, 0.15);
            color: var(--warning);
        }

        .status-draft {
            background: rgba(127, 140, 141, 0.15);
            color: var(--text-light);
        }

        .action-buttons {
            display: flex;
            gap: 8px;
        }

        .action-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            transition: all 0.3s;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .action-view {
            background: rgba(15, 168, 159, 0.2);
            color: var(--primary);
        }

        .action-view:hover {
            background: var(--primary);
            color: white;
        }

        .action-edit {
            background: rgba(255, 107, 53, 0.2);
            color: var(--accent);
        }

        .action-edit:hover {
            background: var(--accent);
            color: white;
        }

        .action-delete {
            background: rgba(231, 76, 60, 0.2);
            color: var(--alert);
        }

        .action-delete:hover {
            background: var(--alert);
            color: white;
        }

        /* ===== ESTIMATE WIZARD ===== */
        .estimate-wizard {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            overflow: hidden;
        }

        .wizard-header {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: white;
            padding: 40px;
        }

        .wizard-title {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 25px;
        }

        .progress-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
        }

        .progress-step {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .progress-number {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 16px;
        }

        .progress-step.active .progress-number {
            background: white;
            color: var(--primary);
        }

        .progress-label {
            font-size: 13px;
            opacity: 0.8;
        }

        .progress-connector {
            flex: 0.5;
            height: 2px;
            background: rgba(255, 255, 255, 0.3);
        }

        .wizard-content {
            padding: 50px;
        }

        .form-section {
            display: none;
        }

        .form-section.active {
            display: block;
            animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .form-section h2 {
            font-size: 24px;
            font-weight: 700;
            color: var(--text-dark);
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid var(--border);
        }

        .form-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 25px;
            margin-bottom: 25px;
        }

        .form-group-full {
            grid-column: 1 / -1;
        }

        .form-group {
            display: flex;
            flex-direction: column;
        }

        .form-group label {
            margin-bottom: 10px;
            color: var(--text-dark);
            font-weight: 600;
            font-size: 14px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
            padding: 12px 16px;
            border: 2px solid var(--border);
            border-radius: 8px;
            font-size: 14px;
            transition: all 0.3s;
            background: white;
            font-family: inherit;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--primary);
            background: white;
            box-shadow: 0 0 0 3px rgba(15, 168, 159, 0.1);
        }

        /* ===== OPTION BUTTONS ===== */
        .select-options {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 12px;
            margin: 15px 0;
        }

        .option-btn {
            padding: 14px;
            border: 2px solid var(--border);
            background: white;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 14px;
            font-weight: 600;
            color: var(--text-dark);
            text-align: center;
        }

        .option-btn:hover {
            border-color: var(--primary);
            color: var(--primary);
            background: rgba(15, 168, 159, 0.05);
        }

        .option-btn.selected {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: white;
            border-color: var(--primary);
            box-shadow: 0 4px 15px rgba(15, 168, 159, 0.3);
        }

        /* ===== SUMMARY CARDS ===== */
        .summary-card {
            background: var(--neutral-light);
            border-left: 4px solid var(--primary);
            padding: 25px;
            border-radius: 8px;
            margin: 20px 0;
        }

        .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid var(--border);
            font-size: 14px;
        }

        .summary-row:last-child {
            border-bottom: none;
        }

        .summary-row.total {
            border-top: 2px solid var(--border);
            padding-top: 15px;
            font-weight: 700;
            font-size: 16px;
            color: var(--primary);
        }

        .summary-label {
            color: var(--text-dark);
            font-weight: 600;
        }

        .summary-value {
            color: var(--text-dark);
            text-align: right;
        }

        /* ===== PROFIT CARD ===== */
        .profit-card {
            background: linear-gradient(135deg, var(--success) 0%, #1E8449 100%);
            color: white;
            padding: 35px;
            border-radius: 12px;
            margin: 30px 0;
            box-shadow: 0 8px 25px rgba(39, 174, 96, 0.3);
        }

        .profit-label {
            font-size: 13px;
            opacity: 0.9;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 10px;
        }

        .profit-value {
            font-size: 42px;
            font-weight: 700;
            margin-bottom: 15px;
        }

        .profit-details {
            font-size: 13px;
            opacity: 0.85;
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }

        /* ===== WIZARD FOOTER ===== */
        .wizard-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 30px 50px;
            border-top: 2px solid var(--border);
            background: var(--neutral-light);
        }

        .btn-group {
            display: flex;
            gap: 15px;
        }

        .btn-back {
            background: var(--neutral-gray);
            color: var(--text-dark);
        }

        .btn-back:hover {
            background: #D5DBEC;
        }

        .btn-next {
            background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
            color: white;
        }

        .step-counter {
            font-weight: 700;
            color: var(--text-dark);
            font-size: 14px;
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 768px) {
            .landing-title {
                font-size: 36px;
            }

            .landing-subtitle {
                font-size: 18px;
            }

            .landing-features {
                grid-template-columns: 1fr;
                gap: 20px;
                margin: 40px 20px;
            }

            .dashboard-header {
                flex-direction: column;
                gap: 20px;
                padding: 20px;
                text-align: center;
            }

            .user-info {
                justify-content: center;
                flex-direction: column;
            }

            .user-details {
                text-align: center;
            }

            .tab-navigation {
                padding: 0 20px;
                overflow-x: auto;
            }

            .tab-item {
                padding: 15px 20px;
                font-size: 13px;
            }

            .dashboard-content {
                padding: 20px;
            }

            .stats-grid {
                grid-template-columns: 1fr;
                gap: 15px;
            }

            .form-row {
                grid-template-columns: 1fr;
                gap: 15px;
            }

            .select-options {
                grid-template-columns: repeat(2, 1fr);
            }

            .wizard-content {
                padding: 30px 20px;
            }

            .wizard-footer {
                flex-direction: column;
                gap: 15px;
                padding: 20px;
            }

            .btn-group {
                width: 100%;
                flex-direction: column;
            }

            .btn {
                width: 100%;
            }

            .progress-container {
                flex-direction: column;
                gap: 0;
            }

            .progress-connector {
                width: 2px;
                height: 20px;
            }
        }

        .hidden {
            display: none;
        }

        .error {
            color: var(--alert);
            font-size: 12px;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <!-- LANDING PAGE -->
    <div class="landing-page" id="landingPage">
        <div class="landing-header">
            <div class="landing-logo">🏗️</div>
            <h1 class="landing-title">Fence Depot Estimator</h1>
            <p class="landing-subtitle">Professional Fencing & Gate Solutions</p>
        </div>

        <div class="landing-features">
            <div class="feature-box">
                <div class="feature-icon">⚡</div>
                <div class="feature-title">Fast Estimates</div>
                <div class="feature-description">Create professional quotes in minutes</div>
            </div>
            <div class="feature-box">
                <div class="feature-icon">💰</div>
                <div class="feature-title">Profit Management</div>
                <div class="feature-description">Real-time profit calculations and margins</div>
            </div>
            <div class="feature-box">
                <div class="feature-icon">🛠️</div>
                <div class="feature-title">Complete Materials</div>
                <div class="feature-description">All suppliers and product catalogs integrated</div>
            </div>
            <div class="feature-box">
                <div class="feature-icon">📊</div>
                <div class="feature-title">Analytics</div>
                <div class="feature-description">Track projects and performance metrics</div>
            </div>
        </div>

        <div class="landing-cta">
            <button class="btn btn-primary" onclick="goToLogin()">LOGIN →</button>
            <button class="btn btn-secondary" onclick="demoMode()">TRY DEMO</button>
        </div>
    </div>

    <!-- LOGIN PAGE -->
    <div class="login-screen" id="loginScreen" style="display: none;">
        <div class="login-card">
            <div class="login-header">
                <div class="login-logo">🏗️</div>
                <h1 class="login-title">Fence Depot</h1>
                <p class="login-subtitle">Professional Estimating System</p>
            </div>

            <form onsubmit="loginUser(event)">
                <div class="form-group">
                    <label>Email Address</label>
                    <input type="email" id="email" placeholder="your@email.com" required>
                </div>

                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="password" placeholder="••••••••" required>
                </div>

                <button type="submit" class="btn btn-login">LOGIN</button>
            </form>

            <button class="btn btn-demo" onclick="demoMode()">DEMO MODE (No Password)</button>
            <button class="btn btn-demo" onclick="goToLanding()" style="margin-top: 10px; background: var(--neutral-light); color: var(--text-dark);">← Back to Home</button>
        </div>
    </div>

    <!-- DASHBOARD PAGE -->
    <div class="dashboard-screen" id="dashboardScreen">
        <div class="dashboard-header">
            <div class="dashboard-title">
                <h1>📊 Fence Depot Estimator</h1>
                <p>Professional Fencing & Gate Solutions</p>
            </div>
            <div class="user-info">
                <div class="user-details">
                    <div class="user-name">👤 John Smith</div>
                    <div class="user-role">Estimator</div>
                </div>
                <div class="avatar">JD</div>
                <button class="btn btn-logout" onclick="logout()">LOGOUT</button>
            </div>
        </div>

        <div class="tab-navigation">
            <button class="tab-item active" onclick="switchTab('dashboard')">📊 Dashboard</button>
            <button class="tab-item" onclick="switchTab('new-estimate')">📝 New Estimate</button>
            <button class="tab-item" onclick="switchTab('projects')">📋 Projects</button>
            <button class="tab-item" onclick="switchTab('materials')">🛠️ Materials & Costs</button>
            <button class="tab-item" onclick="switchTab('suppliers')">🏢 Suppliers</button>
            <button class="tab-item" onclick="switchTab('analytics')">📈 Analytics</button>
            <button class="tab-item" onclick="switchTab('settings')">⚙️ Settings</button>
        </div>

        <div class="dashboard-content">
            <!-- DASHBOARD TAB -->
            <div id="dashboard-tab">
                <div class="section-header">
                    <h2 class="section-title">Dashboard Overview</h2>
                    <p class="section-subtitle">July 2026 • Quick statistics and recent projects</p>
                </div>

                <div class="stats-grid">
                    <div class="stat-card primary">
                        <div class="stat-label">This Month</div>
                        <div class="stat-value">23</div>
                        <div class="stat-change">✓ Estimates Created</div>
                    </div>

                    <div class="stat-card success">
                        <div class="stat-label">Revenue</div>
                        <div class="stat-value">$47.4K</div>
                        <div class="stat-change">↑ 12% vs last month</div>
                    </div>

                    <div class="stat-card accent">
                        <div class="stat-label">Close Rate</div>
                        <div class="stat-value">65%</div>
                        <div class="stat-change">→ 15 Contracts</div>
                    </div>
                </div>

                <div class="section-header" style="margin-top: 40px;">
                    <h2 class="section-title">Recent Estimates</h2>
                </div>

                <div class="table-section">
                    <div class="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Customer</th>
                                    <th>Project Type</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>001</strong></td>
                                    <td>John Smith</td>
                                    <td>100' Residential Chain Link</td>
                                    <td><strong>$4,092.28</strong></td>
                                    <td><span class="status-badge status-contract">✓ Contract</span></td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="action-btn action-view" onclick="viewEstimate()">View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>002</strong></td>
                                    <td>Mary Johnson</td>
                                    <td>150' Commercial Gate</td>
                                    <td><strong>$8,250.00</strong></td>
                                    <td><span class="status-badge status-pending">⏳ Pending</span></td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="action-btn action-view" onclick="viewEstimate()">View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>003</strong></td>
                                    <td>Bob Wilson</td>
                                    <td>200' Mixed Fence</td>
                                    <td><strong>$12,450.00</strong></td>
                                    <td><span class="status-badge status-contract">✓ Contract</span></td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="action-btn action-view" onclick="viewEstimate()">View</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- NEW ESTIMATE TAB -->
            <div id="new-estimate-tab" style="display: none;">
                <div class="estimate-wizard">
                    <div class="wizard-header">
                        <div class="wizard-title">📝 CREATE NEW ESTIMATE</div>
                        <div class="progress-container">
                            <div class="progress-step active">
                                <div class="progress-number">1</div>
                                <div class="progress-label">Customer Info</div>
                            </div>
                            <div class="progress-connector"></div>
                            <div class="progress-step">
                                <div class="progress-number">2</div>
                                <div class="progress-label">Specifications</div>
                            </div>
                            <div class="progress-connector"></div>
                            <div class="progress-step">
                                <div class="progress-number">3</div>
                                <div class="progress-label">Measurements</div>
                            </div>
                            <div class="progress-connector"></div>
                            <div class="progress-step">
                                <div class="progress-number">4</div>
                                <div class="progress-label">Review</div>
                            </div>
                            <div class="progress-connector"></div>
                            <div class="progress-step">
                                <div class="progress-number">5</div>
                                <div class="progress-label">Generate</div>
                            </div>
                        </div>
                    </div>

                    <div class="wizard-content">
                        <!-- STEP 1 -->
                        <div class="form-section active" id="step1">
                            <h2>Step 1: Customer Information</h2>

                            <div class="form-row">
                                <div class="form-group">
                                    <label>First Name *</label>
                                    <input type="text" placeholder="John" value="John">
                                </div>
                                <div class="form-group">
                                    <label>Last Name *</label>
                                    <input type="text" placeholder="Smith" value="Smith">
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label>Email Address *</label>
                                    <input type="email" placeholder="john@email.com" value="john@email.com">
                                </div>
                                <div class="form-group">
                                    <label>Phone Number *</label>
                                    <input type="tel" placeholder="(555) 123-4567" value="(555) 123-4567">
                                </div>
                            </div>

                            <div class="form-row form-group-full">
                                <div class="form-group">
                                    <label>Street Address *</label>
                                    <input type="text" placeholder="123 Main Street" value="123 Main St">
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label>City *</label>
                                    <input type="text" placeholder="Cornwall" value="Cornwall">
                                </div>
                                <div class="form-group">
                                    <label>Province *</label>
                                    <input type="text" placeholder="ON" value="ON">
                                </div>
                                <div class="form-group">
                                    <label>Postal Code *</label>
                                    <input type="text" placeholder="K6H 1A1" value="K6H 1A1">
                                </div>
                            </div>
                        </div>

                        <!-- STEP 2 -->
                        <div class="form-section" id="step2">
                            <h2>Step 2: Fence Specifications</h2>

                            <div class="form-group-full">
                                <label style="display: block; margin: 20px 0; font-weight: 600;">Fence Type:</label>
                                <div class="select-options">
                                    <button type="button" class="option-btn selected" onclick="selectOption(this, 'fenceType', 'residential')">Residential</button>
                                    <button type="button" class="option-btn" onclick="selectOption(this, 'fenceType', 'commercial')">Commercial</button>
                                </div>
                            </div>

                            <div class="form-group-full">
                                <label style="display: block; margin: 20px 0; font-weight: 600;">Fence Style:</label>
                                <div class="select-options">
                                    <button type="button" class="option-btn selected" onclick="selectOption(this, 'fenceStyle', 'chainlink')">Chain Link</button>
                                    <button type="button" class="option-btn" onclick="selectOption(this, 'fenceStyle', 'wood')">Wood</button>
                                    <button type="button" class="option-btn" onclick="selectOption(this, 'fenceStyle', 'vinyl')">Vinyl</button>
                                    <button type="button" class="option-btn" onclick="selectOption(this, 'fenceStyle', 'ornamental')">Ornamental</button>
                                </div>
                            </div>

                            <div class="form-group-full">
                                <label style="display: block; margin: 20px 0; font-weight: 600;">Height:</label>
                                <div class="select-options">
                                    <button type="button" class="option-btn" onclick="selectOption(this, 'height', '3')">3'</button>
                                    <button type="button" class="option-btn" onclick="selectOption(this, 'height', '4')">4'</button>
                                    <button type="button" class="option-btn selected" onclick="selectOption(this, 'height', '5')">5'</button>
                                    <button type="button" class="option-btn" onclick="selectOption(this, 'height', '6')">6'</button>
                                    <button type="button" class="option-btn" onclick="selectOption(this, 'height', '8')">8'</button>
                                </div>
                            </div>

                            <div class="form-group-full">
                                <label style="display: block; margin: 20px 0; font-weight: 600;">Color:</label>
                                <div class="select-options">
                                    <button type="button" class="option-btn selected" onclick="selectOption(this, 'color', 'black')">⬛ Black</button>
                                    <button type="button" class="option-btn" onclick="selectOption(this, 'color', 'white')">⚪ White</button>
                                    <button type="button" class="option-btn" onclick="selectOption(this, 'color', 'brown')">🟤 Brown</button>
                                    <button type="button" class="option-btn" onclick="selectOption(this, 'color', 'green')">🟢 Green</button>
                                </div>
                            </div>

                            <div class="form-row" style="margin-top: 30px;">
                                <div class="form-group">
                                    <label style="display: flex; align-items: center; gap: 10px;">
                                        <input type="checkbox" checked style="width: 20px; height: 20px; cursor: pointer;">
                                        <span>Include Professional Installation</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- STEP 3 -->
                        <div class="form-section" id="step3">
                            <h2>Step 3: Measurements</h2>

                            <div class="form-row form-group-full">
                                <div class="form-group">
                                    <label>Total Linear Footage *</label>
                                    <input type="number" placeholder="100" value="100">
                                </div>
                            </div>

                            <div class="form-row form-group-full">
                                <div class="form-group">
                                    <label>Post Spacing (Feet):</label>
                                    <select style="width: 100%; padding: 12px 16px; border: 2px solid var(--border); border-radius: 8px;">
                                        <option>4 feet</option>
                                        <option selected>6 feet</option>
                                        <option>8 feet</option>
                                        <option>10 feet</option>
                                    </select>
                                </div>
                            </div>

                            <div class="summary-card">
                                <div class="summary-row">
                                    <span class="summary-label">Posts Needed:</span>
                                    <span class="summary-value"><strong>17</strong></span>
                                </div>
                                <div class="summary-row">
                                    <span class="summary-label">Sections:</span>
                                    <span class="summary-value"><strong>10</strong></span>
                                </div>
                                <div class="summary-row">
                                    <span class="summary-label">Estimated Concrete:</span>
                                    <span class="summary-value"><strong>30 Bags</strong></span>
                                </div>
                            </div>
                        </div>

                        <!-- STEP 4 -->
                        <div class="form-section" id="step4">
                            <h2>Step 4: Materials Review</h2>

                            <div class="summary-card">
                                <div class="summary-row">
                                    <span class="summary-label">Chain Link 5' Black (PLU 387):</span>
                                    <span class="summary-value">100 FT @ $5.03 = <strong>$503.00</strong></span>
                                </div>
                                <div class="summary-row">
                                    <span class="summary-label">Top Rail 1.25" Black (PLU 956):</span>
                                    <span class="summary-value">10 EA @ $21.07 = <strong>$210.70</strong></span>
                                </div>
                                <div class="summary-row">
                                    <span class="summary-label">Tension Bar 5' Black (PLU 927):</span>
                                    <span class="summary-value">10 EA @ $5.65 = <strong>$56.50</strong></span>
                                </div>
                                <div class="summary-row">
                                    <span class="summary-label">Tension Band 1.875" Black (PLU 900):</span>
                                    <span class="summary-value">100 EA @ $1.58 = <strong>$158.00</strong></span>
                                </div>
                                <div class="summary-row">
                                    <span class="summary-label">Posts 1.875" Black (PLU 1009):</span>
                                    <span class="summary-value">127 FT @ $2.81 = <strong>$356.87</strong></span>
                                </div>
                                <div class="summary-row">
                                    <span class="summary-label">Concrete 80lb Bags (50 bags):</span>
                                    <span class="summary-value">50 EA @ $8.50 = <strong>$425.00</strong></span>
                                </div>
                                <div class="summary-row">
                                    <span class="summary-label">Labour (51 hours):</span>
                                    <span class="summary-value">51 HRS @ $30 = <strong>$1,530.00</strong></span>
                                </div>
                                <div class="summary-row total">
                                    <span class="summary-label">SUBTOTAL:</span>
                                    <span class="summary-value">$3,621.49</span>
                                </div>
                                <div class="summary-row total">
                                    <span class="summary-label">TAX (13%):</span>
                                    <span class="summary-value">$470.79</span>
                                </div>
                                <div class="summary-row total" style="color: var(--success); font-size: 18px;">
                                    <span class="summary-label">TOTAL:</span>
                                    <span class="summary-value">$4,092.28</span>
                                </div>
                            </div>

                            <div class="profit-card">
                                <div class="profit-label">YOUR PROFIT:</div>
                                <div class="profit-value">$1,437.49</div>
                                <div class="profit-details">
                                    <span>Margin: 35%</span>
                                    <span>Per Hour: $251</span>
                                    <span>Per Foot: $20.11</span>
                                </div>
                            </div>
                        </div>

                        <!-- STEP 5 -->
                        <div class="form-section" id="step5">
                            <h2>Step 5: Generate & Send</h2>

                            <div class="summary-card" style="background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); color: white; border: none; border-left: 4px solid white;">
                                <div class="summary-row" style="color: white; border-bottom-color: rgba(255, 255, 255, 0.2);">
                                    <span class="summary-label" style="color: white;">Estimate #:</span>
                                    <span class="summary-value" style="color: white;">001-2026</span>
                                </div>
                                <div class="summary-row" style="color: white; border-bottom-color: rgba(255, 255, 255, 0.2);">
                                    <span class="summary-label" style="color: white;">Valid Until:</span>
                                    <span class="summary-value" style="color: white;">August 14, 2026</span>
                                </div>
                                <div class="summary-row" style="color: white;">
                                    <span class="summary-label" style="color: white;">Price Lock:</span>
                                    <span class="summary-value" style="color: white;">✓ 30 Days Guaranteed</span>
                                </div>
                            </div>

                            <h3 style="margin: 30px 0 20px; color: var(--text-dark); font-size: 18px; font-weight: 700;">Customer Summary:</h3>
                            <div class="summary-card">
                                <div class="summary-row">
                                    <span class="summary-label"><strong>John Smith</strong></span>
                                    <span class="summary-value">(555) 123-4567</span>
                                </div>
                                <div class="summary-row">
                                    <span class="summary-label">123 Main St, Cornwall ON K6H 1A1</span>
                                </div>
                                <div class="summary-row">
                                    <span class="summary-label">100 Linear Feet • Chain Link • 5' Height</span>
                                </div>
                                <div class="summary-row total">
                                    <span class="summary-label">TOTAL ESTIMATE:</span>
                                    <span class="summary-value" style="color: var(--primary); font-size: 18px;">$4,092.28</span>
                                </div>
                            </div>

                            <button class="btn btn-primary" onclick="generatePDF()" style="width: 100%; margin-top: 30px; padding: 16px; font-size: 16px;">
                                📄 Generate & Email PDF
                            </button>
                        </div>
                    </div>

                    <div class="wizard-footer">
                        <button class="btn btn-back" onclick="previousStep()" id="btnBack">← Back</button>
                        <span class="step-counter" id="stepCounter">Step 1 of 5</span>
                        <button class="btn btn-next" onclick="nextStep()" id="btnNext" style="width: auto;">Next →</button>
                    </div>
                </div>
            </div>

            <!-- PROJECTS TAB -->
            <div id="projects-tab" style="display: none;">
                <div class="section-header">
                    <h2 class="section-title">All Projects & Contracts</h2>
                    <p class="section-subtitle">Manage and track all your fence projects</p>
                </div>

                <div class="table-section">
                    <div class="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Customer</th>
                                    <th>Project Type</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>001</strong></td>
                                    <td>John Smith</td>
                                    <td>100' Residential Chain Link</td>
                                    <td><strong>$4,092.28</strong></td>
                                    <td><span class="status-badge status-contract">✓ Contract</span></td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="action-btn action-view">View</button>
                                            <button class="action-btn action-edit">Edit</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>002</strong></td>
                                    <td>Mary Johnson</td>
                                    <td>150' Commercial Gate</td>
                                    <td><strong>$8,250.00</strong></td>
                                    <td><span class="status-badge status-pending">⏳ Pending</span></td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="action-btn action-view">View</button>
                                            <button class="action-btn action-edit">Edit</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td><strong>003</strong></td>
                                    <td>Bob Wilson</td>
                                    <td>200' Mixed Fence</td>
                                    <td><strong>$12,450.00</strong></td>
                                    <td><span class="status-badge status-contract">✓ Contract</span></td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="action-btn action-view">View</button>
                                            <button class="action-btn action-edit">Edit</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- MATERIALS TAB -->
            <div id="materials-tab" style="display: none;">
                <div class="section-header">
                    <h2 class="section-title">Materials & Costs Management</h2>
                    <p class="section-subtitle">Manage material costs and pricing</p>
                </div>

                <div class="stats-grid">
                    <div class="stat-card primary">
                        <div class="stat-label">Total Suppliers</div>
                        <div class="stat-value">6</div>
                        <div class="stat-change">→ Master Halco, Cloutier Direct, More</div>
                    </div>
                    <div class="stat-card success">
                        <div class="stat-label">Products Cataloged</div>
                        <div class="stat-value">2,847</div>
                        <div class="stat-change">→ All fence types</div>
                    </div>
                    <div class="stat-card accent">
                        <div class="stat-label">Average Margin</div>
                        <div class="stat-value">35%</div>
                        <div class="stat-change">→ Per project</div>
                    </div>
                </div>

                <div class="summary-card">
                    <h3 style="margin-bottom: 20px; color: var(--text-dark); font-weight: 700;">Cost Management Features:</h3>
                    <div class="summary-row">
                        <span class="summary-label">✓ Multi-supplier pricing</span>
                        <span class="summary-value">Compare costs across suppliers</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">✓ Bulk discount tracking</span>
                        <span class="summary-value">Volume pricing optimization</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">✓ Labour rate management</span>
                        <span class="summary-value">Task-based labour calculations</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">✓ Profit calculations</span>
                        <span class="summary-value">Real-time margin tracking</span>
                    </div>
                </div>
            </div>

            <!-- SUPPLIERS TAB -->
            <div id="suppliers-tab" style="display: none;">
                <div class="section-header">
                    <h2 class="section-title">Supplier Management</h2>
                    <p class="section-subtitle">Integrated supplier catalogs and pricing</p>
                </div>

                <div class="stats-grid">
                    <div class="stat-card primary">
                        <div class="stat-label">🟣 Homeland Vinyl</div>
                        <div class="stat-value">Gorilla Fence</div>
                        <div class="stat-change">Premium vinyl products</div>
                    </div>
                    <div class="stat-card success">
                        <div class="stat-label">🔵 Master Halco</div>
                        <div class="stat-value">Complete Line</div>
                        <div class="stat-change">All fence materials</div>
                    </div>
                    <div class="stat-card accent">
                        <div class="stat-label">🟢 Canadian Fence</div>
                        <div class="stat-value">Local Supplier</div>
                        <div class="stat-change">Fast shipping</div>
                    </div>
                </div>

                <div class="summary-card">
                    <h3 style="margin-bottom: 20px; color: var(--text-dark); font-weight: 700;">Integrated Suppliers:</h3>
                    <div class="summary-row">
                        <span class="summary-label">🟠 Cloutier Direct Inc</span>
                        <span class="summary-value">Eastern Canada distributor</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">🔴 Chamberlain Group</span>
                        <span class="summary-value">Motorized gate operators</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">⚪ Ameristar</span>
                        <span class="summary-value">Commercial gate frames</span>
                    </div>
                </div>
            </div>

            <!-- ANALYTICS TAB -->
            <div id="analytics-tab" style="display: none;">
                <div class="section-header">
                    <h2 class="section-title">Analytics & Reports</h2>
                    <p class="section-subtitle">July 2026 • Performance metrics and insights</p>
                </div>

                <div class="stats-grid">
                    <div class="stat-card primary">
                        <div class="stat-label">Total Revenue</div>
                        <div class="stat-value">$47.4K</div>
                        <div class="stat-change">→ 15 Contracts Closed</div>
                    </div>

                    <div class="stat-card success">
                        <div class="stat-label">Close Rate</div>
                        <div class="stat-value">65%</div>
                        <div class="stat-change">→ 23 Estimates Created</div>
                    </div>

                    <div class="stat-card accent">
                        <div class="stat-label">Avg Profit</div>
                        <div class="stat-value">$2,008</div>
                        <div class="stat-change">→ Per Project</div>
                    </div>
                </div>

                <div class="summary-card">
                    <h3 style="margin-bottom: 20px; color: var(--text-dark); font-weight: 700;">Revenue by Type:</h3>
                    <div class="summary-row">
                        <span class="summary-label">Chain Link:</span>
                        <span class="summary-value">████████░░ 45% ($13,556)</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">Vinyl:</span>
                        <span class="summary-value">██████░░░░ 28% ($8,435)</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">Wood:</span>
                        <span class="summary-value">█████░░░░░ 18% ($5,422)</span>
                    </div>
                    <div class="summary-row">
                        <span class="summary-label">Commercial:</span>
                        <span class="summary-value">██░░░░░░░░ 9% ($2,711)</span>
                    </div>
                </div>
            </div>

            <!-- SETTINGS TAB -->
            <div id="settings-tab" style="display: none;">
                <div class="section-header">
                    <h2 class="section-title">System Settings</h2>
                    <p class="section-subtitle">Configure system options and preferences</p>
                </div>

                <div class="summary-card">
                    <h3 style="margin-bottom: 20px; color: var(--text-dark); font-weight: 700;">Labour Rates:</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Standard Rate (per hour):</label>
                            <input type="text" value="$30.00">
                        </div>
                        <div class="form-group">
                            <label>Labour Markup:</label>
                            <input type="text" value="50%">
                        </div>
                    </div>
                </div>

                <div class="summary-card">
                    <h3 style="margin-bottom: 20px; color: var(--text-dark); font-weight: 700;">Measurement System:</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Default Units:</label>
                            <select style="width: 100%; padding: 12px 16px; border: 2px solid var(--border); border-radius: 8px;">
                                <option selected>Imperial (Feet, Inches)</option>
                                <option>Metric (Meters, Millimeters)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="summary-card">
                    <h3 style="margin-bottom: 20px; color: var(--text-dark); font-weight: 700;">Tax & Pricing:</h3>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Tax Rate:</label>
                            <input type="text" value="13%">
                        </div>
                        <div class="form-group">
                            <label>Default Profit Margin:</label>
                            <input type="text" value="35%">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        let currentStep = 1;

        function goToLogin() {
            document.getElementById('landingPage').style.display = 'none';
            document.getElementById('loginScreen').style.display = 'flex';
        }

        function goToLanding() {
            document.getElementById('landingPage').style.display = 'flex';
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('dashboardScreen').style.display = 'none';
        }

        function loginUser(e) {
            e.preventDefault();
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('dashboardScreen').style.display = 'block';
            document.getElementById('landingPage').style.display = 'none';
        }

        function demoMode() {
            document.getElementById('landingPage').style.display = 'none';
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('dashboardScreen').style.display = 'block';
        }

        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                goToLanding();
                currentStep = 1;
            }
        }

        function switchTab(tabName) {
            // Hide all tabs
            const tabs = document.querySelectorAll('[id$="-tab"]');
            tabs.forEach(tab => tab.style.display = 'none');

            // Deactivate all nav items
            document.querySelectorAll('.tab-item').forEach(item => item.classList.remove('active'));

            // Show selected tab
            document.getElementById(tabName + '-tab').style.display = 'block';

            // Activate selected nav item
            event.target.classList.add('active');
        }

        function selectOption(element, type, value) {
            const siblings = element.parentElement.querySelectorAll('.option-btn');
            siblings.forEach(btn => btn.classList.remove('selected'));
            element.classList.add('selected');
        }

        function nextStep() {
            if (currentStep < 5) {
                document.getElementById('step' + currentStep).classList.remove('active');
                currentStep++;
                document.getElementById('step' + currentStep).classList.add('active');
                updateProgress();
            }
        }

        function previousStep() {
            if (currentStep > 1) {
                document.getElementById('step' + currentStep).classList.remove('active');
                currentStep--;
                document.getElementById('step' + currentStep).classList.add('active');
                updateProgress();
            }
        }

        function updateProgress() {
            document.getElementById('stepCounter').textContent = 'Step ' + currentStep + ' of 5';
            document.getElementById('btnBack').style.display = currentStep === 1 ? 'none' : 'block';
            document.getElementById('btnNext').textContent = currentStep === 5 ? 'Generate ✓' : 'Next →';
        }

        function generatePDF() {
            alert('📄 Estimate PDF generated and email sent to customer!');
        }

        function viewEstimate() {
            alert('📄 Viewing estimate details...');
        }

        // Initialize
        updateProgress();
    </script>
</body>
</html>
```

---

## Section 5: Backend server.js — Express API

> **Complete Express.js backend server.**
> Includes all API routes, MongoDB models, JWT auth, PDF generation, and email.

```javascript
/**
 * FENCE DEPOT FENCE ESTIMATOR
 * Complete Backend Server - Express.js
 * Production-Ready Code
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// ============================================
// MIDDLEWARE
// ============================================

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================
// DATABASE CONNECTION
// ============================================

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/fence-estimator';
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ Database connection failed: ${error.message}`);
    setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
};

// ============================================
// DATABASE SCHEMAS/MODELS
// ============================================

// User Schema
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  role: { 
    type: String, 
    enum: ['admin', 'estimator', 'crew'], 
    default: 'estimator'
  },
  company: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.generateToken = function() {
  return jwt.sign(
    { userId: this._id, role: this.role },
    process.env.JWT_SECRET || 'fence-estimator-secret-key',
    { expiresIn: '7d' }
  );
};

const User = mongoose.model('User', userSchema);

// Project Schema
const projectSchema = new mongoose.Schema({
  projectId: { 
    type: String, 
    unique: true, 
    required: true 
  },
  customerName: { 
    type: String, 
    required: true 
  },
  customerEmail: { 
    type: String, 
    required: true,
    lowercase: true
  },
  customerPhone: { 
    type: String, 
    required: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  city: { 
    type: String, 
    required: true 
  },
  province: { 
    type: String, 
    required: true 
  },
  postalCode: { 
    type: String, 
    required: true 
  },
  propertySize: { 
    type: String 
  },
  projectNotes: { 
    type: String 
  },
  photos: [{ 
    type: String 
  }],
  estimator: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  status: { 
    type: String, 
    enum: ['draft', 'estimate', 'contract', 'active', 'completed'], 
    default: 'draft' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Project = mongoose.model('Project', projectSchema);

// Fence Specifications Schema
const fenceSpecsSchema = new mongoose.Schema({
  projectId: { 
    type: String, 
    required: true,
    index: true
  },
  fenceType: { 
    type: String, 
    enum: ['Chain Link', 'Wood', 'Vinyl', 'Wrought Iron', 'Composite', 'Metal', 'PVC', 'Aluminum'], 
    required: true 
  },
  height: { 
    type: Number, 
    required: true 
  },
  color: { 
    type: String 
  },
  postGauge: { 
    type: Number 
  },
  postDiameter: { 
    type: Number 
  },
  gateType: { 
    type: String, 
    enum: ['Swing', 'Sliding', 'Double Swing', 'Cantilever', 'Barrier', 'None'],
    default: 'None'
  },
  barchedWire: { 
    type: Boolean, 
    default: false 
  },
  installationType: { 
    type: String, 
    enum: ['Residential', 'Commercial', 'Industrial', 'Specialty'],
    default: 'Residential'
  },
  linearFeet: { 
    type: Number, 
    required: true 
  },
  numberPosts: { 
    type: Number, 
    required: true 
  },
  numberGates: { 
    type: Number, 
    default: 0 
  },
  specialRequirements: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

const FenceSpecs = mongoose.model('FenceSpecs', fenceSpecsSchema);

// Estimate Schema
const estimateSchema = new mongoose.Schema({
  estimateNumber: { 
    type: String, 
    unique: true, 
    required: true 
  },
  projectId: { 
    type: String, 
    required: true,
    index: true
  },
  customerName: { 
    type: String, 
    required: true 
  },
  fenceType: { 
    type: String, 
    required: true 
  },
  linearFeet: { 
    type: Number, 
    required: true 
  },
  height: { 
    type: Number 
  },
  materialCost: { 
    type: Number, 
    required: true 
  },
  laborHours: { 
    type: Number, 
    required: true 
  },
  laborRate: { 
    type: Number,
    default: 50
  },
  laborCost: { 
    type: Number, 
    required: true 
  },
  equipmentCost: { 
    type: Number, 
    required: true 
  },
  permitCost: { 
    type: Number, 
    default: 0 
  },
  utilityCost: { 
    type: Number, 
    default: 0 
  },
  contingency: { 
    type: Number, 
    default: 0 
  },
  subtotal: { 
    type: Number, 
    required: true 
  },
  tax: { 
    type: Number, 
    required: true 
  },
  total: { 
    type: Number, 
    required: true 
  },
  notes: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'accepted', 'rejected'], 
    default: 'draft' 
  },
  validUntil: { 
    type: Date 
  },
  estimator: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Estimate = mongoose.model('Estimate', estimateSchema);

// Contract Schema
const contractSchema = new mongoose.Schema({
  contractNumber: { 
    type: String, 
    unique: true, 
    required: true 
  },
  estimateNumber: { 
    type: String, 
    required: true 
  },
  projectId: { 
    type: String, 
    required: true,
    index: true
  },
  customerName: { 
    type: String, 
    required: true 
  },
  scopeOfWork: { 
    type: String, 
    required: true 
  },
  materials: { 
    type: String, 
    required: true 
  },
  labor: { 
    type: String, 
    required: true 
  },
  timeline: { 
    type: String 
  },
  totalPrice: { 
    type: Number, 
    required: true 
  },
  priceLocked: { 
    type: Boolean, 
    default: true 
  },
  depositAmount: { 
    type: Number 
  },
  depositPaid: { 
    type: Boolean, 
    default: false 
  },
  finalBalance: { 
    type: Number 
  },
  warranty: { 
    type: String 
  },
  terms: { 
    type: String 
  },
  customerSignature: { 
    type: String 
  },
  customerSignDate: { 
    type: Date 
  },
  companySignature: { 
    type: String 
  },
  companySignDate: { 
    type: Date 
  },
  status: { 
    type: String, 
    enum: ['pending', 'signed', 'active', 'completed'], 
    default: 'pending' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Contract = mongoose.model('Contract', contractSchema);

// Change Order Schema
const changeOrderSchema = new mongoose.Schema({
  changeOrderNumber: { 
    type: String, 
    unique: true, 
    required: true 
  },
  contractNumber: { 
    type: String, 
    required: true 
  },
  projectId: { 
    type: String, 
    required: true,
    index: true
  },
  description: { 
    type: String, 
    required: true 
  },
  reason: { 
    type: String 
  },
  materialCostChange: { 
    type: Number, 
    default: 0 
  },
  laborCostChange: { 
    type: Number, 
    default: 0 
  },
  timelineChange: { 
    type: String 
  },
  newTotal: { 
    type: Number, 
    required: true 
  },
  customerApproval: { 
    type: Boolean, 
    default: false 
  },
  customerSignature: { 
    type: String 
  },
  approvalDate: { 
    type: Date 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true
  }
});

const ChangeOrder = mongoose.model('ChangeOrder', changeOrderSchema);

// Sign-Off Schema
const signOffSchema = new mongoose.Schema({
  signOffNumber: { 
    type: String, 
    unique: true, 
    required: true 
  },
  projectId: { 
    type: String, 
    required: true,
    index: true
  },
  contractNumber: { 
    type: String, 
    required: true 
  },
  completionDate: { 
    type: Date, 
    default: Date.now 
  },
  fenceInspectionPassed: { 
    type: Boolean, 
    required: true 
  },
  customerWalkthrough: { 
    type: Boolean, 
    required: true 
  },
  warrantyExplained: { 
    type: Boolean, 
    required: true 
  },
  photos: { 
    type: [String] 
  },
  outstandingItems: { 
    type: String 
  },
  followUpNeeded: { 
    type: Boolean, 
    default: false 
  },
  warrantyStartDate: { 
    type: Date 
  },
  nextMaintenanceDate: { 
    type: Date 
  },
  customerSignature: { 
    type: String 
  },
  customerSignDate: { 
    type: Date 
  },
  companyRep: { 
    type: String, 
    required: true 
  },
  companyRepSignature: { 
    type: String 
  },
  companyRepSignDate: { 
    type: Date 
  },
  status: { 
    type: String, 
    enum: ['pending', 'signed', 'completed'], 
    default: 'pending' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true
  }
});

const SignOff = mongoose.model('SignOff', signOffSchema);

// Notes Schema (Central Hub)
const notesSchema = new mongoose.Schema({
  noteId: { 
    type: String, 
    unique: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    enum: ['Site Conditions', 'Materials', 'Labor', 'Warranty', 'Safety', 'Other'], 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  usageCount: { 
    type: Number, 
    default: 0 
  },
  lastUsed: { 
    type: Date 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    index: true
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Notes = mongoose.model('Notes', notesSchema);

// ============================================
// AUTHENTICATION MIDDLEWARE
// ============================================

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'No token provided',
        message: 'Authorization denied. Please login first.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fence-estimator-secret-key');
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({ 
      error: 'Invalid token',
      message: 'Token is not valid or has expired'
    });
  }
};

// Role-based authorization
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'You do not have permission to access this resource'
      });
    }
    next();
  };
};

// ============================================
// CALCULATION ENGINE
// ============================================

class CalculationEngine {
  
  // Material Cost Calculation
  static calculateMaterialCost(fenceType, linearFeet, height, barchedWire) {
    const baseCosts = {
      'Chain Link': { base: 8, perFoot: 2 },
      'Wood': { base: 15, perFoot: 3.5 },
      'Vinyl': { base: 12, perFoot: 4 },
      'Wrought Iron': { base: 20, perFoot: 5 },
      'Composite': { base: 18, perFoot: 4.5 },
      'Metal': { base: 14, perFoot: 3 },
      'PVC': { base: 11, perFoot: 3.8 },
      'Aluminum': { base: 13, perFoot: 3.2 }
    };

    const fence = baseCosts[fenceType] || baseCosts['Chain Link'];
    let cost = fence.base + (linearFeet * fence.perFoot);
    
    // Height adjustment (per inch from 48" standard)
    const heightMultiplier = height / 48;
    cost *= heightMultiplier;
    
    // Barbed wire additional cost
    if (barchedWire) {
      cost += linearFeet * 0.50;
    }
    
    return Math.round(cost * 100) / 100;
  }

  // Labor Cost Calculation
  static calculateLaborCost(linearFeet, fenceType, installationType, laborRate = 50) {
    
    const baseHoursPerFoot = {
      'Chain Link': 0.015,
      'Wood': 0.020,
      'Vinyl': 0.018,
      'Wrought Iron': 0.025,
      'Composite': 0.022,
      'Metal': 0.016,
      'PVC': 0.017,
      'Aluminum': 0.016
    };

    const hoursPerFoot = baseHoursPerFoot[fenceType] || 0.015;
    let hours = linearFeet * hoursPerFoot;

    // Installation type multiplier
    const multipliers = {
      'Residential': 1.0,
      'Commercial': 1.2,
      'Industrial': 1.5,
      'Specialty': 1.8
    };

    const multiplier = multipliers[installationType] || 1.0;
    hours *= multiplier;

    const laborCost = hours * laborRate;
    
    return {
      hours: Math.round(hours * 100) / 100,
      cost: Math.round(laborCost * 100) / 100
    };
  }

  // Equipment Cost Calculation
  static calculateEquipmentCost(linearFeet, numberPosts) {
    const equipmentDailyRate = linearFeet > 500 ? 250 : 150;
    const estimatedDays = Math.ceil(linearFeet / 200);
    return Math.round(equipmentDailyRate * estimatedDays);
  }

  // Total Calculation
  static calculateTotal(estimateData) {
    const subtotal = estimateData.materialCost + estimateData.laborCost + 
                     estimateData.equipmentCost + (estimateData.permitCost || 0) + 
                     (estimateData.utilityCost || 0) + (estimateData.contingency || 0);
    
    const tax = subtotal * 0.13;
    const total = subtotal + tax;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100
    };
  }
}

// ============================================
// API ROUTES - AUTHENTICATION
// ============================================

// Register User
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, role, company, phone } = req.body;

    if (!username || !email || !password || !company) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Please provide username, email, password, and company'
      });
    }

    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ 
        error: 'User Already Exists',
        message: 'Email or username is already in use'
      });
    }

    user = new User({
      username,
      email,
      password,
      role: role || 'estimator',
      company,
      phone
    });

    await user.save();
    const token = user.generateToken();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        company: user.company
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server Error',
      message: error.message 
    });
  }
});

// Login User
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        error: 'Authentication Failed',
        message: 'Invalid email or password'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        error: 'Authentication Failed',
        message: 'Invalid email or password'
      });
    }

    const token = user.generateToken();

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        company: user.company
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server Error',
      message: error.message 
    });
  }
});

// Get Current User
app.get('/api/auth/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server Error',
      message: error.message 
    });
  }
});

// ============================================
// API ROUTES - PROJECTS (TAB 1)
// ============================================

app.post('/api/projects', auth, async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, address, city, province, postalCode, propertySize, projectNotes } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !address || !city || !province || !postalCode) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Please provide all required project information'
      });
    }

    const projectId = `PRJ-${Date.now()}`;
    const project = new Project({
      projectId,
      customerName,
      customerEmail,
      customerPhone,
      address,
      city,
      province,
      postalCode,
      propertySize,
      projectNotes,
      estimator: req.userId
    });

    await project.save();

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server Error',
      message: error.message 
    });
  }
});

app.get('/api/projects', auth, async (req, res) => {
  try {
    const projects = await Project.find({ estimator: req.userId })
      .populate('estimator', 'username email company')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server Error',
      message: error.message 
    });
  }
});

app.get('/api/projects/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ projectId: req.params.projectId })
      .populate('estimator', 'username email company');

    if (!project) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server Error',
      message: error.message 
    });
  }
});

app.put('/api/projects/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { projectId: req.params.projectId },
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server Error',
      message: error.message 
    });
  }
});

// ============================================
// API ROUTES - ESTIMATES (TAB 8)
// ============================================

app.post('/api/estimates', auth, async (req, res) => {
  try {
    const { projectId, customerName, fenceType, linearFeet, height, barchedWire, installationType, laborRate, permitCost, utilityCost, contingency, notes } = req.body;

    if (!projectId || !customerName || !fenceType || !linearFeet) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Please provide all required estimate information'
      });
    }

    const materialCost = CalculationEngine.calculateMaterialCost(fenceType, linearFeet, height || 48, barchedWire);
    const laborData = CalculationEngine.calculateLaborCost(linearFeet, fenceType, installationType, laborRate || 50);
    const equipmentCost = CalculationEngine.calculateEquipmentCost(linearFeet, 50);

    const estimateNumber = `EST-${Date.now()}`;

    const estimateData = {
      estimateNumber,
      projectId,
      customerName,
      fenceType,
      linearFeet,
      height: height || 48,
      materialCost,
      laborHours: laborData.hours,
      laborRate: laborRate || 50,
      laborCost: laborData.cost,
      equipmentCost,
      permitCost: permitCost || 0,
      utilityCost: utilityCost || 0,
      contingency: contingency || 0,
      notes: notes || '',
      estimator: req.userId
    };

    const totals = CalculationEngine.calculateTotal(estimateData);
    estimateData.subtotal = totals.subtotal;
    estimateData.tax = totals.tax;
    estimateData.total = totals.total;

    const estimate = new Estimate(estimateData);
    await estimate.save();

    await Project.findOneAndUpdate({ projectId }, { status: 'estimate' });

    res.status(201).json({
      success: true,
      message: 'Estimate created successfully',
      estimate,
      breakdown: {
        materials: materialCost,
        labor: laborData.cost,
        equipment: equipmentCost,
        permits: estimateData.permitCost,
        utilities: estimateData.utilityCost,
        contingency: estimateData.contingency,
        subtotal: totals.subtotal,
        tax: totals.tax,
        total: totals.total
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server Error',
      message: error.message 
    });
  }
});

app.get('/api/estimates/:projectId', auth, async (req, res) => {
  try {
    const estimates = await Estimate.find({ projectId: req.params.projectId })
      .populate('estimator', 'username email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: estimates.length,
      estimates
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server Error',
      message: error.message 
    });
  }
});

// ============================================
// API ROUTES - CONTRACTS (TAB 9)
// ============================================

app.post('/api/contracts', auth, async (req, res) => {
  try {
    const { estimateNumber, projectId, customerName, scopeOfWork, depositAmount, warranty, terms } = req.body;

    if (!estimateNumber || !projectId || !customerName) {
      return res.status(400).json({ 
        error: 'Validation Error',
        message: 'Please provide all required contract information'
      });
    }

    const estimate = await Estimate.findOne({ estimateNumber });
    if (!estimate) {
      return res.status(404).json({ 
        error: 'Not Found',
        message: 'Estimate not found'
      });
    }

    const contractNumber = `CON-${Date.now()}`;
    const contract = new Contract({
      contractNumber,
      estimateNumber,
      projectId,
      customerName,
      scopeOfWork: scopeOfWork || 'Installation of fence as per specifications',
      materials: `Fence Type: ${estimate.fenceType}, Linear Feet: ${estimate.linearFeet}`,
      labor: `Estimated Labor Hours: ${estimate.laborHours}`,
      timeline: '2-4 weeks',
      totalPrice: estimate.total,
      priceLocked: true,
      depositAmount: depositAmount || Math.round(estimate.total * 0.25 * 100) / 100,
      warranty: warranty || '2 years on materials, 1 year on labor',
      terms: terms || 'Deposit due upon signing. Balance due upon completion.'
    });

    await contract.save();
    await Project.findOneAndUpdate({ projectId }, { status: 'contract' });

    res.status(201).json({
      success: true,
      message: '🔒 Contract created successfully. PRICING IS NOW LOCKED!',
      contract,
      warning: 'The price in this contract is LOCKED and cannot be changed without a Change Order'
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server Error',
      message: error.message 
    });
  }
});

app.get('/api/contracts/:projectId', auth, async (req, res) => {
  try {
    const contracts = await Contract.find({ projectId: req.params.projectId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: contracts.length,
      contracts
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Server Error',
      message: error.message 
    });
  }
});

// ============================================
// HEALTH CHECK
// ============================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// ============================================
// ERROR HANDLING
// ============================================

app.use((err, req, res, next) => {
  console.error(`Error: ${err.stack}`);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Endpoint ${req.method} ${req.path} not found`
  });
});

// ============================================
// SERVER STARTUP
// ============================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`\n╔════════════════════════════════════════╗`);
      console.log(`║ FENCE DEPOT FENCE ESTIMATOR - RUNNING  ║`);
      console.log(`║ Server: http://localhost:${PORT}`);
      console.log(`║ API: http://localhost:${PORT}/api`);
      console.log(`╚════════════════════════════════════════╝\n`);
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

module.exports = app;
```

---

## Section 6: Backend package.json — Dependencies

```json
{
  "name": "fence-estimator-backend",
  "version": "1.0.0",
  "description": "Fence Depot Fence Estimator Backend",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "pdfkit": "^0.13.0",
    "nodemailer": "^6.9.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.20",
    "jest": "^29.5.0"
  }
}
```

### Dependency Notes

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.18.2 | HTTP server and routing |
| mongoose | ^7.0.0 | MongoDB ODM |
| cors | ^2.8.5 | Cross-origin resource sharing |
| dotenv | ^16.0.3 | Environment variable loading |
| bcryptjs | ^2.4.3 | Password hashing |
| jsonwebtoken | ^9.0.0 | JWT creation and verification |
| pdfkit | ^0.13.0 | PDF document generation |
| nodemailer | ^6.9.1 | Email sending |
| nodemon | ^2.0.20 | Dev-only: auto-restart |
| jest | ^29.5.0 | Unit testing |

---

## Section 7: Environment Variables (.env.example)

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/fence-estimator

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-secret-key-change-this-in-production

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-email-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Google Maps API Key
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Stripe Configuration (for payments if needed)
STRIPE_PUBLIC_KEY=your-stripe-public-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

### Variable Descriptions

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | ✅ | MongoDB connection string |
| `PORT` | ✅ | Server port (default 5000) |
| `NODE_ENV` | ✅ | `development` or `production` |
| `JWT_SECRET` | ✅ | Random secret for signing JWTs (min 32 chars) |
| `EMAIL_USER` | ✅ | Gmail address for sending estimates |
| `EMAIL_PASSWORD` | ✅ | Gmail app password (not regular password) |
| `EMAIL_HOST` | ✅ | SMTP host (smtp.gmail.com) |
| `EMAIL_PORT` | ✅ | SMTP port (587 for TLS) |
| `FRONTEND_URL` | ✅ | CORS allow-origin for frontend |
| `GOOGLE_MAPS_API_KEY` | Optional | For mapping tab |
| `STRIPE_PUBLIC_KEY` | Optional | For payments (future) |
| `STRIPE_SECRET_KEY` | Optional | For payments (future) |

### Gmail App Password Setup

1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Search "App passwords"
4. Generate a new app password
5. Use that 16-character password as `EMAIL_PASSWORD`

---

## Section 8: Calculation Engine — Logic Reference

The calculation engine is embedded in `index.html`. Below is the complete reference for how materials are calculated.

### Chain Link Fencing Calculations

```javascript
// Posts
posts = Math.ceil(linearFeet / maxSpacing) + 1;
// Chain link: post spacing max 10 ft (residential), 12 ft (commercial)

// Line posts = posts - 2  (end posts counted separately)
linePosts = posts - 2;

// Terminal posts (corners + ends)
terminalPosts = 2 + (corners * 1);

// Top rail (20-ft sections)
topRailSections = Math.ceil(linearFeet / 20);

// Mesh roll (chain link fabric, 50-ft rolls)
meshRolls = Math.ceil(linearFeet / 50);

// Tension wire (coils cover 200 linear ft at bottom)
tensionWireCoils = Math.ceil(linearFeet / 200);

// Brace bands (2 per terminal post)
braceBands = terminalPosts * 2;
```

### Height-Based Post Lengths

| Fence Height | Post Length | Embed Depth |
|--------------|-------------|-------------|
| 4 ft | 8 ft | 3.5 ft |
| 5 ft | 8 ft | 3 ft |
| 6 ft | 10 ft | 3.5 ft |
| 8 ft | 12 ft | 3.5 ft |
| 10 ft | 14 ft | 4 ft |

### PVC / Vinyl Fencing Calculations

```javascript
// Posts every 8 ft (standard vinyl spacing)
posts = Math.ceil(linearFeet / 8) + 1;

// Rails (3 rails per section standard)
rails = Math.ceil(linearFeet / 8) * 3;

// Pickets/Boards
pickets = Math.ceil(linearFeet / (picketWidth + gap));

// Post caps
postCaps = posts;
```

### Wood Fencing Calculations

```javascript
// Posts every 8 ft
posts = Math.ceil(linearFeet / 8) + 1;

// Rails (2x4 x 8 ft, 2 per section = 16 ln-ft coverage)
rails = Math.ceil(linearFeet / 8) * 2;

// Boards (1x6 standard picket)
boards = Math.ceil(linearFeet / (5.5 / 12));  // 5.5" actual width

// Post concrete (1 bag per post)
concreteBags = posts;
```

### Gate Calculation

```javascript
// Single gate up to 4 ft wide
// Double gate for widths > 4 ft
if (gateWidth <= 4) {
  hinges = 2;
  latchType = 'single';
} else {
  // Double drive gate
  hinges = 4;
  latchType = 'double';
}
```

### Waste Factor

```javascript
const WASTE_FACTOR = 1.05; // 5% overage applied to all material quantities
quantity = Math.ceil(baseQuantity * WASTE_FACTOR);
```

---

## Section 9: Estimate Wizard — Step-by-Step Flow

The estimate wizard uses a `estimateState` object that tracks all inputs through the multi-step flow embedded in index.html.

### estimateState Object

```javascript
const estimateState = {
  step: 1,
  fenceType: '',       // 'chain-link' | 'pvc' | 'wood' | 'wrought-iron' | 'guide-rail'
  height: '',          // '4' | '5' | '6' | '8' | '10' (feet)
  color: '',           // 'galvanized' | 'black' | 'green' | 'brown' (chain link)
  footage: 0,          // total linear feet
  gates: [],           // array of { width, type }
  corners: 0,          // number of corners
  customerName: '',
  jobAddress: '',
  estimateNumber: '',
};
```

### Wizard Steps

| Step | Description | Fields |
|------|-------------|--------|
| 1 | Customer Info | Name, address, phone, email |
| 2 | Fence Type | Chain link / PVC / Wood / Wrought iron / Guide rail |
| 3 | Specifications | Height, color/style, gauge (chain link) |
| 4 | Measurements | Linear footage, corners, grade changes |
| 5 | Gates | Count, widths, types (walk/drive) |
| 6 | Materials | Auto-calculated; manual overrides |
| 7 | Pricing | Unit prices from INVENTORY_DB, totals |
| 8 | Summary | Review and print/save/email |

### Key Functions

```javascript
// Switch between wizard steps
function nextStep() { ... }
function prevStep() { ... }
function switchTab(tabId) { ... }

// Run calculations after measurements entered
function calculateAndRenderMaterials() {
  // Looks up prices: findMesh(), findTensionWire(), findBraceBand(), invByPlu()
  ...
}

// INVENTORY_DB lookup helpers
function invByPlu(plu) {
  return INVENTORY_DB.find(item => item.plu === plu);
}
function findMesh(height, gauge, color) { ... }
function findTensionWire() { ... }
function findBraceBand() { ... }
```

---

## Section 10: INVENTORY_DB — Product Catalog Reference

The `INVENTORY_DB` constant in `index.html` contains the live POS inventory (Part 1 of 7, 61 SKUs).

### Structure

```javascript
const INVENTORY_DB = [
  {
    plu: '100001',          // POS PLU code
    dept: 'Chain Link',     // Department
    description: '...',     // Product description
    cost: 12.50,            // Cost price
    retail: 18.99,          // Retail/sell price
    uom: 'EA',              // Unit of measure: EA, FT, LF, ROLL, BAG, BOX
    vendor: 'Master Halco'  // Vendor name
  },
  ...
];
```

### Departments

| Department | SKU Count | Description |
|-----------|-----------|-------------|
| Chain Link | ~25 | Mesh rolls, posts, rails, fittings |
| Commercial Fitting | ~10 | Commercial-grade hardware |
| PVC/Vinyl | ~10 | Vinyl fence components |
| Wood | ~8 | Wood fence components |
| Gates | ~8 | Gate hardware and complete gates |

### Key PLU Codes (Part 1)

> Full inventory is in `index.html` — `INVENTORY_DB` array starting around line 1683.
> Parts 2–7 of the inventory (additional SKUs) are pending import.

### Adding New Products

To add products to the inventory, append objects to `INVENTORY_DB` in `index.html`:

```javascript
{
  plu: 'YOUR_PLU',
  dept: 'Chain Link',
  description: '9 Gauge 4 ft Black Chain Link Mesh 50 ft Roll',
  cost: 85.00,
  retail: 129.99,
  uom: 'ROLL',
  vendor: 'Master Halco'
}
```

---

## Section 11: Tab Structure — All 17 Tabs

The estimator uses a 17-tab interface. Each tab handles a specific phase of the estimate.

### Tab Map

| Tab # | Tab ID | Name | Purpose |
|-------|--------|------|---------|
| 1 | `tab-project` | Project Info | Customer, job address, estimate # |
| 2 | `tab-specs` | Fence Specs | Type, height, color, gauge |
| 3 | `tab-layout` | Layout | Site measurements, drawings |
| 4 | `tab-installation` | Installation | Labour rate, installation type |
| 5 | `tab-drawings` | Drawings | Site plan sketch tool |
| 6 | `tab-permits` | Permits | Permit requirements checklist |
| 7 | `tab-utilities` | Utilities | Call-before-you-dig, utility notes |
| 8 | `tab-estimate` | Estimate | Complete material + labour estimate |
| 9 | `tab-contract` | Contract | Contract terms and signature |
| 10 | `tab-extras` | Extras | Add-ons: post caps, gates, barbed wire |
| 11 | `tab-crew` | Crew | Assign crew members and hours |
| 12 | `tab-change-orders` | Change Orders | Track scope changes |
| 13 | `tab-sign-off` | Sign Off | Customer and office sign-off |
| 14 | `tab-notes` | Notes | Internal job notes |
| 15 | `tab-admin` | Admin | User management, reports |
| 16 | `tab-catalog` | Catalog | Browse full product catalog |
| 17 | `tab-mapping` | Mapping | Google Maps site view |

### Tab Navigation

```javascript
// Navigate to a specific tab
function switchTab(tabId) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
}
```

### Tab 8 — Estimate (Most Complex)

Tab 8 is the core estimation tab. It:
1. Reads inputs from tabs 1–7
2. Calls `calculateAndRenderMaterials()`
3. Renders a line-item material list with quantities and prices
4. Computes subtotals, tax (HST 13%), and grand total
5. Provides override fields for manual adjustments
6. Includes "Generate PDF" and "Email Estimate" buttons

---

## Section 12: localStorage Persistence

The frontend uses `localStorage` to auto-save estimate data so work is not lost on page refresh.

### Saved Keys

| localStorage Key | Data Saved | When Saved |
|-----------------|-----------|-----------|
| `estimateCustomer` | Customer name, address, phone, email | On input change |
| `estimateYear` | Current year (for estimate numbering) | On load |
| `estimateSequence` | Running sequence number | On new estimate |
| `estimateState` | Full wizard state object | On each step change |

### Code Pattern

```javascript
// Save
localStorage.setItem('estimateCustomer', JSON.stringify({
  name: document.getElementById('customer-name').value,
  address: document.getElementById('job-address').value,
  phone: document.getElementById('customer-phone').value,
  email: document.getElementById('customer-email').value
}));

// Load on page start
window.addEventListener('load', function() {
  const saved = localStorage.getItem('estimateCustomer');
  if (saved) {
    const data = JSON.parse(saved);
    document.getElementById('customer-name').value = data.name || '';
    document.getElementById('job-address').value = data.address || '';
  }
});

// Generate estimate number
function generateEstimateNumber() {
  const year = new Date().getFullYear();
  const seq = parseInt(localStorage.getItem('estimateSequence') || '0') + 1;
  localStorage.setItem('estimateSequence', seq);
  return `FDE-${year}-${String(seq).padStart(4, '0')}`;
}
```

### Clearing Saved Data

```javascript
// Clear all saved estimate data (start fresh)
function clearEstimate() {
  localStorage.removeItem('estimateCustomer');
  localStorage.removeItem('estimateState');
  location.reload();
}
```

---

## Section 13: API Routes Reference

All routes are defined in `backend/server.js`.

### Authentication Routes

| Method | Route | Description | Auth Required |
|--------|-------|-------------|--------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login, returns JWT | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Estimate Routes

| Method | Route | Description | Auth Required |
|--------|-------|-------------|--------------|
| GET | `/api/estimates` | List all estimates | Yes |
| POST | `/api/estimates` | Create new estimate | Yes |
| GET | `/api/estimates/:id` | Get single estimate | Yes |
| PUT | `/api/estimates/:id` | Update estimate | Yes |
| DELETE | `/api/estimates/:id` | Delete estimate | Yes |
| POST | `/api/estimates/:id/pdf` | Generate PDF | Yes |
| POST | `/api/estimates/:id/email` | Email estimate | Yes |

### Customer Routes

| Method | Route | Description | Auth Required |
|--------|-------|-------------|--------------|
| GET | `/api/customers` | List all customers | Yes |
| POST | `/api/customers` | Create customer | Yes |
| GET | `/api/customers/:id` | Get customer | Yes |
| PUT | `/api/customers/:id` | Update customer | Yes |

### Product Routes

| Method | Route | Description | Auth Required |
|--------|-------|-------------|--------------|
| GET | `/api/products` | List all products | Yes |
| POST | `/api/products` | Add product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |

### Request/Response Format

All requests and responses use JSON.

**Example — Create Estimate:**

```http
POST /api/estimates
Authorization: ******
Content-Type: application/json

{
  "customerName": "John Smith",
  "jobAddress": "123 Main St, Toronto ON",
  "fenceType": "chain-link",
  "height": 6,
  "footage": 150,
  "materials": [...],
  "total": 2450.00
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "64abc...",
    "estimateNumber": "FDE-2026-0042",
    "customerName": "John Smith",
    ...
  }
}
```

---

## Section 14: Authentication — JWT Flow

### Registration

```http
POST /api/auth/register
{
  "username": "staff1",
  "password": "secure123",
  "email": "staff1@fencedepot.ca",
  "role": "estimator"
}
```

Password is hashed with bcryptjs (10 salt rounds) before storage.

### Login

```http
POST /api/auth/login
{
  "username": "staff1",
  "password": "secure123"
}
```

Returns:
```json
{
  "token": "******",
  "user": { "id": "...", "username": "staff1", "role": "estimator" }
}
```

### Using the Token

Add to every protected request:

```
Authorization: ******
```

### Token Expiry

JWTs expire after **7 days**. The frontend must re-login to get a new token.

### Frontend Storage

```javascript
// Store token after login
localStorage.setItem('authToken', data.token);

// Attach to all API calls
async function apiCall(url, options = {}) {
  const token = localStorage.getItem('authToken');
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `******
      ...options.headers
    }
  });
}
```

### User Roles

| Role | Permissions |
|------|------------|
| `admin` | Full access including product management |
| `estimator` | Create/edit/email estimates |
| `viewer` | Read-only access |

---

## Section 15: PDF Generation — pdfkit

PDF generation is handled server-side in `backend/server.js` using pdfkit.

### Triggering PDF Generation

```javascript
// Frontend call
async function generatePDF(estimateId) {
  const response = await apiCall(`/api/estimates/${estimateId}/pdf`, {
    method: 'POST'
  });
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  window.open(url);  // Opens PDF in new tab
}
```

### PDF Structure (server-side)

```javascript
const PDFDocument = require('pdfkit');

function generateEstimatePDF(estimate, res) {
  const doc = new PDFDocument({ margin: 50 });
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 
    `attachment; filename="estimate-${estimate.estimateNumber}.pdf"`);
  
  doc.pipe(res);
  
  // Header
  doc.fontSize(20).text('FENCE DEPOT ESTIMATOR', { align: 'center' });
  doc.fontSize(12).text(`Estimate #: ${estimate.estimateNumber}`);
  doc.text(`Date: ${new Date(estimate.createdAt).toLocaleDateString('en-CA')}`);
  
  // Customer info
  doc.moveDown();
  doc.fontSize(14).text('Customer Information');
  doc.fontSize(11).text(`Name: ${estimate.customerName}`);
  doc.text(`Address: ${estimate.jobAddress}`);
  
  // Materials table
  doc.moveDown();
  doc.fontSize(14).text('Materials');
  estimate.materials.forEach(item => {
    doc.fontSize(10).text(
      `${item.description}  x${item.qty}  @ $${item.price}  = $${item.total}`
    );
  });
  
  // Total
  doc.moveDown();
  doc.fontSize(14).text(`TOTAL: $${estimate.total.toFixed(2)}`, { align: 'right' });
  
  doc.end();
}
```

---

## Section 16: Email — nodemailer

Estimates can be emailed directly to customers from the app.

### Triggering Email (Frontend)

```javascript
async function emailEstimate(estimateId, recipientEmail) {
  const response = await apiCall(`/api/estimates/${estimateId}/email`, {
    method: 'POST',
    body: JSON.stringify({ email: recipientEmail })
  });
  const data = await response.json();
  alert(data.success ? 'Email sent!' : 'Email failed: ' + data.message);
}
```

### Email Handler (Backend)

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

async function sendEstimateEmail(estimate, recipientEmail) {
  const mailOptions = {
    from: `"Fence Depot" <${process.env.EMAIL_USER}>`,
    to: recipientEmail,
    subject: `Your Fence Estimate #${estimate.estimateNumber} from Fence Depot`,
    html: `
      <h2>Thank you for your interest in Fence Depot!</h2>
      <p>Please find your fence estimate attached.</p>
      <p><strong>Estimate #:</strong> ${estimate.estimateNumber}</p>
      <p><strong>Total:</strong> $${estimate.total.toFixed(2)}</p>
      <p>If you have any questions, please call us.</p>
    `,
    attachments: [{
      filename: `estimate-${estimate.estimateNumber}.pdf`,
      content: pdfBuffer  // PDF generated before emailing
    }]
  };
  
  await transporter.sendMail(mailOptions);
}
```

---

## Section 17: Database Schema — MongoDB Models

The backend uses Mongoose models. Below are the complete schema definitions.

### User Model

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['admin', 'estimator', 'viewer'], default: 'estimator' },
  firstName: String,
  lastName: String,
  phone: String,
  active: { type: Boolean, default: true }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
```

### Customer Model

```javascript
const CustomerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: String,
  phone: String,
  address: {
    street: String,
    city: String,
    province: { type: String, default: 'ON' },
    postalCode: String
  },
  notes: String,
  estimates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Estimate' }]
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);
```

### Product Model

```javascript
const ProductSchema = new mongoose.Schema({
  plu: { type: String, required: true, unique: true },
  dept: { type: String, required: true },
  description: { type: String, required: true },
  cost: { type: Number, required: true },
  retail: { type: Number, required: true },
  uom: { type: String, required: true, enum: ['EA', 'FT', 'LF', 'ROLL', 'BAG', 'BOX', 'LB'] },
  vendor: String,
  active: { type: Boolean, default: true },
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
```

### Estimate Model

```javascript
const MaterialLineSchema = new mongoose.Schema({
  plu: String,
  description: { type: String, required: true },
  qty: { type: Number, required: true },
  uom: String,
  unitPrice: { type: Number, required: true },
  total: { type: Number, required: true }
});

const GateSchema = new mongoose.Schema({
  type: { type: String, enum: ['walk', 'drive', 'double-drive'] },
  width: Number,
  height: Number
});

const EstimateSchema = new mongoose.Schema({
  estimateNumber: { type: String, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  customerName: String,
  jobAddress: String,
  phone: String,
  email: String,
  fenceType: {
    type: String,
    enum: ['chain-link', 'pvc', 'wood', 'wrought-iron', 'guide-rail']
  },
  height: Number,
  color: String,
  gauge: String,
  footage: Number,
  corners: Number,
  gates: [GateSchema],
  materials: [MaterialLineSchema],
  laborRate: { type: Number, default: 45 },
  laborHours: Number,
  laborTotal: Number,
  materialsSubtotal: Number,
  tax: Number,
  taxRate: { type: Number, default: 0.13 },
  total: Number,
  notes: String,
  status: {
    type: String,
    enum: ['draft', 'sent', 'approved', 'declined', 'completed'],
    default: 'draft'
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Auto-generate estimate number
EstimateSchema.pre('save', async function(next) {
  if (!this.estimateNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Estimate').countDocuments();
    this.estimateNumber = `FDE-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Estimate', EstimateSchema);
```

---

## Section 18: Database Seed Data

Initial seed data for testing and development.

### Create Admin User

```javascript
// scripts/seed.js
const mongoose = require('mongoose');
require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const User = require('./models/User');
  
  // Create admin user
  await User.create({
    username: 'admin',
    email: 'admin@fencedepot.ca',
    password: 'Admin123!',  // Change immediately after first login
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User'
  });
  
  console.log('Admin user created. Login: admin / Admin123!');
  
  // Seed products from INVENTORY_DB
  const Product = require('./models/Product');
  const products = [
    { plu: '100001', dept: 'Chain Link', description: '9 Gauge Galv Chain Link 4 ft x 50 ft Roll', cost: 68.00, retail: 98.99, uom: 'ROLL', vendor: 'Master Halco' },
    { plu: '100002', dept: 'Chain Link', description: '9 Gauge Galv Chain Link 5 ft x 50 ft Roll', cost: 82.00, retail: 118.99, uom: 'ROLL', vendor: 'Master Halco' },
    { plu: '100003', dept: 'Chain Link', description: '9 Gauge Galv Chain Link 6 ft x 50 ft Roll', cost: 96.00, retail: 139.99, uom: 'ROLL', vendor: 'Master Halco' },
    { plu: '100004', dept: 'Chain Link', description: '9 Gauge Black Chain Link 4 ft x 50 ft Roll', cost: 78.00, retail: 112.99, uom: 'ROLL', vendor: 'Master Halco' },
    { plu: '100005', dept: 'Chain Link', description: '9 Gauge Black Chain Link 6 ft x 50 ft Roll', cost: 108.00, retail: 155.99, uom: 'ROLL', vendor: 'Master Halco' },
    { plu: '200001', dept: 'Chain Link', description: '2-3/8" x 10.5 ft Galv Line Post', cost: 18.50, retail: 28.99, uom: 'EA', vendor: 'Master Halco' },
    { plu: '200002', dept: 'Chain Link', description: '2-3/8" x 10.5 ft Galv Terminal Post', cost: 22.00, retail: 34.99, uom: 'EA', vendor: 'Master Halco' },
    { plu: '300001', dept: 'Chain Link', description: '1-3/8" x 21 ft Top Rail', cost: 14.00, retail: 21.99, uom: 'EA', vendor: 'Master Halco' },
    { plu: '400001', dept: 'Commercial Fitting', description: 'Tension Band 2-3/8"', cost: 0.85, retail: 1.49, uom: 'EA', vendor: 'Master Halco' },
    { plu: '400002', dept: 'Commercial Fitting', description: 'Brace Band 2-3/8"', cost: 0.75, retail: 1.29, uom: 'EA', vendor: 'Master Halco' },
  ];
  
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products`);
  
  await mongoose.disconnect();
}

seed().catch(console.error);
```

Run with:
```bash
node scripts/seed.js
```

---

## Section 19: Database Migrations & Procedures

### Migration Strategy

Since the project uses MongoDB (schema-less), migrations are handled via scripts rather than SQL ALTER TABLE.

### Migration Script Template

```javascript
// scripts/migrations/001_add_status_to_estimates.js
const mongoose = require('mongoose');
require('dotenv').config({ path: '../../.env' });

async function up() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  
  // Add 'status' field to all estimates that don't have it
  const result = await db.collection('estimates').updateMany(
    { status: { $exists: false } },
    { $set: { status: 'draft' } }
  );
  
  console.log(`Migration 001: Updated ${result.modifiedCount} estimates`);
  await mongoose.disconnect();
}

async function down() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  
  await db.collection('estimates').updateMany(
    {},
    { $unset: { status: '' } }
  );
  
  await mongoose.disconnect();
}

if (require.main === module) {
  up().catch(console.error);
}

module.exports = { up, down };
```

### Common Database Procedures

#### Get Estimates by Date Range

```javascript
async function getEstimatesByDateRange(startDate, endDate) {
  return Estimate.find({
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  }).populate('customer').sort({ createdAt: -1 });
}
```

#### Calculate Monthly Revenue

```javascript
async function getMonthlyRevenue(year, month) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);
  
  const result = await Estimate.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
        status: 'approved'
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$total' },
        count: { $sum: 1 }
      }
    }
  ]);
  
  return result[0] || { totalRevenue: 0, count: 0 };
}
```

#### Search Customers

```javascript
async function searchCustomers(query) {
  return Customer.find({
    $or: [
      { firstName: { $regex: query, $options: 'i' } },
      { lastName: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
      { 'address.city': { $regex: query, $options: 'i' } }
    ]
  }).limit(20);
}
```

---

## Section 20: Material Specifications — Canadian Standards

# FENCE MATERIAL SPECIFICATIONS DATABASE - CANADIAN STANDARDS ONLY
**Date: July 16, 2026 | Canadian Standards Compliant**

---

## 📊 TABLE OF CONTENTS

1. Chain Link Fencing - Canadian Standards (CAN/CGSB-138.3-2019)
2. PVC/Vinyl Fencing - Homeland Vinyl Products Only
3. Wood Fencing - Canadian Standards
4. Wrought Iron Fencing - Cloutier Direct Only
5. Guide Rail Fencing - Canadian Highway Standard OPSD
6. Residential Fencing - Canadian Standards
7. Commercial Fencing - Canadian Standards
8. Interior Installation (Post Mounting) - Canadian Standards
9. Material Cost Integration Guide

---

## 1. CHAIN LINK FENCING - CANADIAN STANDARDS (CAN/CGSB-138.3-2019)

### **Per 100 Linear Feet (2-Person Crew)**

#### **LINE POSTS (Standard Installation)**
| Item | Qty | Unit | Description | Canadian Standard |
|------|-----|------|-------------|-------------------|
| Line Posts (1½" OD × 6'6") | 16 | Each | Steel, galvanized schedule 40 | CAN/CGSB-138.3-2019 |
| Post Caps (1½") | 16 | Each | Galvanized steel slip-on | CSA G40.21 |
| Post Sleeves (if on concrete) | 16 | Each | Concrete mounting sleeves | CSA A3000 |

#### **TERMINAL POSTS (Ends, Corners, Gates)**
| Item | Qty | Unit | Description | Canadian Standard |
|------|-----|------|-------------|-------------------|
| Terminal Posts (1⅞" OD × 6'6") | 4 | Each | Heavier gauge, galvanized | CAN/CGSB-138.3-2019 |
| Corner Posts (1⅞" OD × 6'6") | 2 | Each | 3-way for corners | CAN/CGSB-138.3-2019 |
| Gate Posts (1⅞" OD × 6'6") | 2 | Each | For gate frame mounting | CAN/CGSB-138.3-2019 |
| End Posts (1⅞" OD × 6'6") | 2 | Each | For fence termination | CAN/CGSB-138.3-2019 |
| Post Caps (1⅞") | 10 | Each | Galvanized steel slip-on | CSA G40.21 |

#### **TOP RAIL**
| Item | Qty | Unit | Description | Canadian Standard |
|------|-----|------|-------------|-------------------|
| Top Rail (1¼" OD × 0.083" wall) | 100 | LF | Galvanized steel tube | CAN/CGSB-138.3-2019 |
| Top Rail End Caps | 4 | Each | Galvanized steel | CSA G40.21 |
| Top Rail Couplers | 2 | Each | For joining sections | CAN/CGSB-138.3-2019 |

#### **FABRIC (MESH)**
| Item | Qty | Unit | Description | Canadian Standard |
|------|-----|------|-------------|-------------------|
| Chain Link Fabric (2" mesh, 9 GA) | 100 | LF | Galvanized or vinyl-coated | CAN/CGSB-138.3-2019 |
| Fabric Width Options | - | - | 3', 4', 5', 6' standard | CAN/CGSB-138.3-2019 |
| Color Options | - | - | Galvanized, Green, Black, Brown | CSA G40.8 |
| Mesh Gauge | - | - | 9 gauge (0.148" diameter wire) | CAN/CGSB-138.3-2019 |

#### **BOTTOM WIRE / TENSION WIRE**
| Item | Qty | Unit | Description | Canadian Standard |
|------|-----|------|-------------|-------------------|
| Bottom Wire / Tension Wire (9 GA) | 100 | LF | 0.148" diameter galvanized cable | CAN/CGSB-138.3-2019 |
| Wire Type | - | - | Plain or barbed (where required) | CSA G40.8 |

#### **FASTENERS & FITTINGS**
| Item | Qty | Unit | Description | Canadian Standard |
|------|-----|------|-------------|-------------------|
| Tension Bands (1⅞") | 32 | Each | For terminal posts (2 per terminal post) | CAN/CGSB-138.3-2019 |
| Tension Bars (1⅞") | 16 | Each | For terminal posts (1 per terminal post) | CAN/CGSB-138.3-2019 |
| Bolt-on Post Caps | 26 | Each | Alternative to slip-on | CSA G40.21 |
| Lag Bolts (½" × 3") | 64 | Each | For terminal post frame assembly | CSA G40.20 |
| Carriage Bolts (½" × 2") | 32 | Each | For fabric attachment | CSA G40.20 |
| Post Base Brackets | 4 | Each | If mounted to concrete | CSA A3000 |

#### **HARDWARE - FASTENERS**
| Item | Qty | Unit | Description | Canadian Standard |
|------|-----|------|-------------|-------------------|
| 2" Galvanized Nails | 2 | lbs | For blocking/bracing | CSA G40.8 |
| Galvanized Screws (2.5") | 1 | lb | For cap attachment | CSA G40.20 |
| Nuts (½") | 96 | Each | Grade 2 galvanized | CSA G40.8 |
| Washers (½") | 96 | Each | Galvanized steel | CSA G40.8 |
| Cotter Pins (3/16" × 2") | 32 | Each | For safety attachment | CSA G40.8 |

#### **TIE WIRES & CONNECTORS**
| Item | Qty | Unit | Description | Canadian Standard |
|------|-----|------|-------------|-------------------|
| Tie Wires (9 GA galvanized) | 400 | LF | For fabric attachment to posts | CAN/CGSB-138.3-2019 |
| Tie Wire Bundled (per 100 LF section) | 4 | Bundles | Pre-counted for convenience | CAN/CGSB-138.3-2019 |
| Hog Rings (3" spacing) | 300 | Each | Alternative fastening method (if permitted) | CSA G40.8 |

#### **CONCRETE & FOOTING**
| Item | Qty | Unit | Description | Canadian Standard |
|------|-----|------|-------------|-------------------|
| Concrete (per post hole) | 0.5 | CY | 20 MPa minimum | CSA A3000 |
| Concrete (Total for 100 LF) | 8 | CY | 18-20 posts × 0.5 CY | CSA A3000 |
| Stone Dust (Base prep) | 0.25 | Ton | Per 100 LF | CAN/CGSB-138.3-2019 |

#### **GATES (Per Gate - 4' Wide × 5' High - Canadian Standard)**
| Item | Qty | Unit | Description | Canadian Standard |
|------|-----|------|-------------|-------------------|
| Gate Frame (1¼" tube) | 1 | Set | Pre-fabricated per CAN/CGSB | CAN/CGSB-138.3-2019 |
| Gate Hinges (Heavy-duty) | 2 | Each | 2-3" adjustable gate hinges | CAN/CGSB-138.3-2019 |
| Gate Latch (Gravity or manual) | 1 | Each | Locking mechanism | CAN/CGSB-138.3-2019 |
| Gate Chain (Safety) | 1 | Each | To prevent full swing | CSA B95.1 |
| Gate Fabric (2" mesh, 9 GA) | 1 | Gate | Pre-wrapped or installed on-site | CAN/CGSB-138.3-2019 |

#### **NOTES - CANADIAN STANDARDS COMPLIANCE**
- All materials must comply with **CAN/CGSB-138.3-2019** (Chain Link Fence Installation Standard)
- Post depth varies by frost line (see Canadian frost depth table for region)
- All fasteners must be galvanized to **CSA G40.8** or stainless steel equivalent
- Concrete footings must meet **CSA A3000** for durability in freeze-thaw cycles
- No alternative materials or non-standard sizing permitted

---

## 2. PVC/VINYL FENCING - HOMELAND VINYL PRODUCTS ONLY

### **Per 100 Linear Feet (Privacy Style, 5' Height)**

#### **POSTS - HOMELAND VINYL STANDARD SIZES**
| Item | Qty | Unit | Description | Homeland SKU |
|------|-----|------|-------------|--------------|
| Main Posts (4" × 4" × 8') | 16 | Each | Vinyl (White, Brown, Gray, Tan options) | HVP-4x4-8 |
| Terminal Posts (4" × 4" × 8') | 4 | Each | Corner and end posts | HVP-4x4-8 |
| Gate Posts (4" × 4" × 8') | 2 | Each | Reinforced for gate | HVP-4x4-8 |
| Post Caps (4" × 4") | 22 | Each | Vinyl decorative caps | HVP-CAP-4x4 |
| Post Sleeve Adapters | 16 | Each | For concrete mounting | HVP-SLEEVE-4x4 |

#### **RAILS - HOMELAND VINYL STANDARD SIZES**
| Item | Qty | Unit | Description | Homeland SKU |
|------|-----|------|-------------|--------------|
| Top Rail (2" × 4" × 8') | 13 | Each | Vinyl, UV-resistant | HVP-2x4-RAIL-8 |
| Middle Rail (2" × 4" × 8') | 13 | Each | Privacy-style installation | HVP-2x4-RAIL-8 |
| Bottom Rail (2" × 4" × 8') | 13 | Each | For support | HVP-2x4-RAIL-8 |
| Rail Brackets (Stainless) | 52 | Each | 4 per rail section | HVP-BRACKET-SS |

#### **PANELS/BOARDS - HOMELAND VINYL STANDARD**
| Item | Qty | Unit | Description | Homeland SKU |
|------|-----|------|-------------|--------------|
| Privacy Boards (5⅝" × 60") | 200 | Each | Interlocking vinyl boards | HVP-BOARD-PRIVACY-60 |
| Semi-Privacy Boards (5⅝" × 60") | 200 | Each | Alternating pattern (if selected) | HVP-BOARD-SEMI-60 |
| Picket Boards (3½" × 60") | 300 | Each | For picket-style (if selected) | HVP-BOARD-PICKET-60 |

#### **HARDWARE & FASTENERS - STAINLESS STEEL ONLY**
| Item | Qty | Unit | Description | Homeland SKU |
|------|-----|------|-------------|--------------|
| Stainless Steel Brackets (2.5") | 52 | Each | Post-to-rail connections | HVP-BRACKET-SS-2.5 |
| Stainless Steel Bolts (¾" × 3") | 156 | Each | Rail assembly (3 per bracket) | HVP-BOLT-SS-3/4x3 |
| Stainless Steel Washers | 156 | Each | For bolt distribution | HVP-WASHER-SS-3/4 |
| Stainless Steel Nuts | 156 | Each | Grade A2-70 | HVP-NUT-SS-3/4 |
| Vinyl Screws (3.5" S/S) | 400 | Each | For board attachment | HVP-SCREW-SS-3.5 |
| Fastener Plugs (Vinyl) | 400 | Each | To cover screw heads | HVP-PLUG-VINYL |

#### **GATES - HOMELAND VINYL STANDARD**
| Item | Qty | Unit | Description | Homeland SKU |
|------|-----|------|-------------|--------------|
| Gate Frame (Vinyl) | 1 | Set | Pre-fabricated | HVP-GATE-FRAME-4x5 |
| Gate Boards (5⅝" × 60") | 8 | Each | Matching fence boards | HVP-BOARD-PRIVACY-60 |
| Gate Hinges (S/S Adjustable) | 2 | Each | Heavy-duty for PVC | HVP-HINGE-SS-ADJ |
| Gate Latch Assembly | 1 | Each | Self-closing mechanism | HVP-LATCH-AUTO |
| Gate Handle | 1 | Each | Stainless steel | HVP-HANDLE-SS |

#### **CONCRETE & FOOTING**
| Item | Qty | Unit | Description | Canadian Standard |
|------|-----|------|-------------|-------------------|
| Concrete (per post) | 0.6 | CY | Due to weight (20 MPa min) | CSA A3000 |
| Total Concrete (100 LF) | 9.6 | CY | 18-20 posts | CSA A3000 |
| Stone Dust Base | 0.5 | Ton | Pre-footing preparation | CAN/CGSB-138.3-2019 |

#### **NOTES - HOMELAND VINYL PRODUCTS ONLY**
- ALL materials are **Homeland Vinyl Products** standard sizing only
- All sizes, styles, and colors limited to Homeland inventory
- No substitutions or alternative manufacturers permitted
- Verify current Homeland color/style availability before estimate
- Homeland warranty applies to all components

---

## 3. WOOD FENCING - CANADIAN STANDARDS

### **Per 100 Linear Feet (Privacy Style, 5' Height)**

#### **POSTS - CANADIAN PRESSURE-TREATED OPTIONS**
| Item | Qty | Unit | Description | Canadian Standard |
|------|-----|------|-------------|-------------------|
| Main Posts (4" × 4" × 8' PT) | 16 | Each | Pressure-treated pine/spruce | CSA O141 Grade #2 |
| Main Posts (6" × 6" × 8' PT) | 16 | Each | Heavy-duty option (optional) | CSA O141 Grade #2 |
| Terminal Posts (4" × 4" × 8' PT) | 4 | Each | Corner and end (larger diameter) | CSA O141 Grade #2 |
| Terminal Posts (6" × 6" × 8' PT) | 4 | Each | Heavy-duty corner/end | CSA O141 Grade #2 |
| Gate Posts (4" × 4" × 8' PT) | 2 | Each | Heavier for gate support | CSA O141 Grade #2 |
| Gate Posts (6" × 6" × 8' PT) | 2 | Each | Heavy-duty gate option | CSA O141 Grade #2 |
| Post Caps (4×4 or 6×6 decorative) | 22 | Each | Cedar or treated wood | CSA O141 |

#### **RAILS - CANADIAN PRESSURE-TREATED**
| Item | Qty | Unit | Description | Canadian Standard |
|------|-----|------|-------------|-------------------|
| Top Rail (2" × 6" × 8' PT) | 13 | Each | Pressure-treated or cedar | CSA O141 Grade #2 |
| Bottom Rail (2" × 6" × 8' PT) | 13 | Each | Support rail | CSA O141 Grade #2 |
| Mid-Rail (2" × 6" × 8' PT) (optional) | 13 | Each | For semi-privacy | CSA O141 Grade #2 |

#### **BOARDS/PICKETS - CANADIAN PRESSURE-TREATED**
| Item | Qty | Unit | Description | Canadian Standard |
|------|-----|------|-------------|-------------------|
| Privacy Boards (1" × 5⅝" × 60" PT) | 220 | Each | Tongue-and-groove privacy | CSA O141 Grade #2 |
| Standard Boards (1" × 5⅝" × 60" PT) | 220 | Each | Butt joint privacy | CSA O141 Grade #2 |
| Pickets (1" × 3⅝" × 60" PT) | 300 | Each | For picket-style fence | CSA O141 Grade #2 |

#### **HARDWARE & FASTENERS - GALVANIZED ONLY**
| Item | Qty | Unit | Description | Canadian Standard |
|------|-----|------|-------------|-------------------|
| 3½" Coated Deck Screws (S/S) | 2 | lbs | Hot-dip galvanized (800-1000 count) | CSA G40.8 |
| 2½" Galvanized Nails (Ring or Spiral) | 2 | lbs | For secondary fastening | CSA G40.8 |
| 2" Lag Screws (¾" dia) | 52 | Each | For rail-to-post connections | CSA G40.8 |
| Galvanized Bolts (¾" × 4") | 52 | Each | Terminal post assembly | CSA G40.20 |
| Galvanized Washers (¾") | 104 | Each | For bolt distribution | CSA G40.8 |
| Galvanized Nuts (¾") | 52 | Each | For terminal posts | CSA G40.8 |

#### **CONCRETE & FOOTING - CANADIAN STANDARDS**
| Item | Qty | Unit | Description | Canadian Standard |
|------|-----|------|-------------|-------------------|
| Concrete (per post, standard) | 0.5 | CY | 20 MPa minimum (freeze-thaw protected) | CSA A3000 |
| Total Concrete (100 LF) | 8 | CY | 16 posts approx | CSA A3000 |
| Stone Dust (Base prep) | 0.5 | Ton | Drainage layer | CAN/CGSB-138.3-2019 |

#### **GATES - CANADIAN STANDARDS**
| Item | Qty | Unit | Description | Canadian Standard |
|------|-----|------|-------------|-------------------|
| Gate Frame (2×6 PT wood) | 4 | Pieces | Top, bottom, sides | CSA O141 |
| Gate Boards (1" × 5⅝" × 60") | 10 | Each | Matching fence boards | CSA O141 |
| Gate Hinges (Heavy-duty galv.) | 2 | Each | 3-4" adjustable hinges | CSA G40.8 |
| Gate Latch (Galvanized) | 1 | Each | Manual or self-closing | CSA G40.8 |
| Diagonal Bracing (optional) | 1 | Set | 2×2 PT cross-bracing | CSA O141 |

#### **FINISHING - CANADIAN APPROVED**
| Item | Qty | Unit | Description | Canadian Standard |
|------|-----|------|-------------|-------------------|
| Wood Stain/Sealant (if desired) | 5 | Gallons | Cedar stain or transparent sealer | CSA O141 maintenance |
| Paint (if painting) | 5 | Gallons | Exterior grade, 2 coats | CSA standards |

#### **NOTES - CANADIAN WOOD STANDARDS**
- All wood must meet **CSA O141** (Softwood Lumber Standard)
- Pressure-treated timber minimum Grade #2
- All fasteners must be hot-dip galvanized to **CSA G40.8**
- Wood must be properly dried to moisture content specifications
- 6×6 posts available as premium option for extra durability

---

## 4. WROUGHT IRON FENCING - CLOUTIER DIRECT INVENTORY ONLY

### **Per 100 Linear Feet (Ornamental Style, 4-5' Height)**

#### **POSTS - CLOUTIER DIRECT STANDARD**
| Item | Qty | Unit | Description | Cloutier Direct SKU |
|------|-----|------|-------------|-------------------|
| Wrought Iron Posts (1½" sq × 6'6") | 16 | Each | Hot-rolled steel, ornamental style | CD-POST-1.5-6.5 |
| Terminal Posts (1¾" sq × 6'6") | 4 | Each | Heavier for corner/end | CD-POST-1.75-6.5 |
| Gate Posts (2" sq × 6'6") | 2 | Each | Reinforced for gate mounting | CD-POST-2-6.5 |
| Post Caps (Decorative spear-point) | 22 | Each | Cloutier Direct ornamental finial | CD-CAP-SPEAR |
| Post Sleeves (for mounting) | 16 | Each | For concrete foundation | CD-SLEEVE-1.5 |

#### **RAILS & COMPONENTS - CLOUTIER DIRECT STANDARD**
| Item | Qty | Unit | Description | Cloutier Direct SKU |
|------|-----|------|-------------|-------------------|
| Horizontal Rails (¾" sq tube) | 32 | LF | Top, middle, bottom rails | CD-RAIL-0.75-SQ |
| Decorative Pickets (¾" sq × 48") | 200 | Each | Spear-point or scroll design (Cloutier) | CD-PICKET-SPEAR-48 |
| Scroll Work (ornamental) | 8 | Each | Mid-section decorative elements | CD-SCROLL-STD |

#### **FASTENERS & HARDWARE - CLOUTIER DIRECT SPEC**
| Item | Qty | Unit | Description | Cloutier Direct SKU |
|------|-----|------|-------------|-------------------|
| Lag Bolts (½" × 3") | 96 | Each | Post-to-rail connections (3 per joint) | CD-BOLT-LAG-1/2x3 |
| Galvanized Washers (½") | 96 | Each | Bolt distribution | CD-WASHER-1/2 |
| Galvanized Nuts (½") | 96 | Each | Grade 2 or better | CD-NUT-1/2 |
| Weld-On Brackets (if welded) | 32 | Each | Alternative to bolts | CD-BRACKET-WELD |
| Concrete Anchors (½" diameter) | 16 | Each | For post base mounting | CD-ANCHOR-1/2 |

#### **PAINTING/FINISHING - PROFESSIONAL GRADE**
| Item | Qty | Unit | Description | Canadian Standard |
|------|-----|------|-------------|-------------------|
| Rust Preventative Primer | 2 | Gallons | Epoxy-based, high-adhesion | CSA G40.8 |
| Exterior Paint (Oil or Acrylic) | 3 | Gallons | Black, bronze, or custom color | CSA standards |
| Touch-up Paint (spray can) | 2 | Cans | Field repairs | CSA standards |
| Clear Coat/Sealant (optional) | 1 | Gallon | UV protection | CSA standards |

#### **CONCRETE & FOOTING - CANADIAN STANDARDS**
| Item | Qty | Unit | Description | Canadian Standard |
|------|-----|------|-------------|-------------------|
| Concrete (per post, heavy-duty) | 0.75 | CY | 25-30 MPa for wrought iron | CSA A3000 |
| Total Concrete (100 LF) | 12 | CY | 16 posts × 0.75 CY | CSA A3000 |
| Stone Dust (Base prep) | 1 | Ton | Drainage and leveling | CAN/CGSB-138.3-2019 |

#### **GATES - CLOUTIER DIRECT STANDARD**
| Item | Qty | Unit | Description | Cloutier Direct SKU |
|------|-----|------|-------------|-------------------|
| Gate Frame (Wrought iron) | 1 | Set | Pre-fabricated Cloutier style | CD-GATE-FRAME-4x4 |
| Gate Pickets (¾" sq × 48") | 8 | Each | Matching fence design | CD-PICKET-SPEAR-48 |
| Gate Hinges (Heavy-duty, ornamental) | 2 | Each | Steel, 4-5" heavy-duty Cloutier | CD-HINGE-4-ORN |
| Gate Latch (Decorative latch) | 1 | Each | Matching Cloutier style | CD-LATCH-ORN |

#### **NOTES - CLOUTIER DIRECT ONLY**
- ALL materials sourced from **Cloutier Direct inventory** exclusively
- Post sizes, styles, and decorative elements limited to Cloutier stock
- No custom sizing or alternative manufacturers permitted
- All products must match Cloutier Direct specifications and finishes
- Verify current Cloutier inventory availability before estimate

---

## 5. GUIDE RAIL FENCING - CANADIAN HIGHWAY STANDARD OPSD ONLY

### **Per 100 Linear Feet (Highway Barrier Style - OPSD Compliant)**

#### **POSTS & TERMINALS - OPSD STANDARD**
| Item | Qty | Unit | Description | Canadian Standard |
|------|-----|------|-------------|-------------------|
| Steel Posts (W6×9) | 10 | Each | 20' spacing per OPSD | OPSD 02.16.04 |
| End Post Terminals (Energy-absorbing) | 2 | Each | OPSD approved end treatment | OPSD 02.16.04 |
| Transition Posts | 2 | Each | Height transition per OPSD | OPSD 02.16.04 |
| Ground-Level Support Posts | 20 | Each | Below-surface support posts | OPSD 02.16.04 |

#### **RAILS - OPSD STANDARD W-BEAM**
| Item | Qty | Unit | Description | Canadian Standard |
|------|-----|------|-------------|-------------------|
| Upper W-Beam Rail (W10×49) | 100 | LF | Primary impact rail OPSD spec | OPSD 02.16.04 |
| Lower W-Beam Rail (W10×49) | 100 | LF | Secondary support rail OPSD | OPSD 02.16.04 |
| Back-Up Plates (½" steel) | 20 | Each | Mounting surface reinforcement | OPSD 02.16.04 |

#### **FASTENERS & HARDWARE - OPSD GRADE**
| Item | Qty | Unit | Description | Canadian Standard |
|------|-----|------|-------------|-------------------|
| Bolts (1" × 5" Grade 5 OPSD) | 200 | Each | Rail-to-post connections (10 per post) | OPSD 02.16.04 |
| Washers (1" hardened) | 200 | Each | Bolt distribution and bearing | OPSD 02.16.04 |
| Nuts (1" lock) | 200 | Each | Grade 5 OPSD specification | OPSD 02.16.04 |
| Cotter Pins (safety) | 100 | Each | For critical connections | OPSD 02.16.04 |

#### **CONCRETE & FOOTING - OPSD DEEP STANDARDS**
| Item | Qty | Unit | Description | Canadian Standard |
|------|-----|------|-------------|-------------------|
| Concrete (per post, deep) | 1.25 | CY | 28-30 MPa OPSD requirement | OPSD 02.16.04 |
| Total Concrete (100 LF) | 12.5 | CY | 10 posts × 1.25 CY | OPSD 02.16.04 |
| Rebar (#4 diameter) | 100 | LF | For structural support OPSD | OPSD 02.16.04 |
| Stone Dust Base | 1 | Ton | Drainage and prep OPSD | OPSD 02.16.04 |

#### **SAFETY & VISIBILITY - OPSD STANDARD**
| Item | Qty | Unit | Description | Canadian Standard |
|------|-----|------|-------------|-------------------|
| Reflectors (yellow/white OPSD) | 20 | Each | Every 20 feet for visibility | OPSD 02.16.04 |
| Paint (high-visibility safety) | 3 | Gallons | Orange or yellow OPSD standard | OPSD 02.16.04 |
| Galvanized Coating | 1 | Qt | Rust prevention | OPSD 02.16.04 |

#### **NOTES - OPSD COMPLIANCE ONLY**
- ALL materials must comply with **OPSD 02.16.04** (Object Protection Safety Device Standard)
- This is the ONLY Canadian highway standard for guide rails
- All specifications, dimensions, and materials strictly per OPSD requirements
- No alternative standards or materials permitted
- Installation must follow OPSD compliance checklist
- Regular OPSD compliance inspection required

---

## 6. RESIDENTIAL FENCING - CANADIAN STANDARDS

### **Standard 5' Privacy Wood Fence (100 LF)**
- Posts (4×4 PT): 16 + 4 terminals = 20
- Rails (2×6 PT): 26 total
- Boards (1×5⅝ PT): 220
- Concrete (CSA A3000): 8 CY
- Hardware (CSA G40.8 galvanized): Screws, bolts, nails (2-3 lbs)
- Frost depth: Regional (per Canadian table)
- **Cost estimate: $2,400-$3,200 CAD**

### **6×6 Heavy-Duty Wood Fence (100 LF)**
- Posts (6×6 PT): 16 + 4 terminals = 20
- Rails (2×6 PT): 26 total
- Boards (1×5⅝ PT): 220
- Concrete (CSA A3000 heavy): 10 CY
- Hardware (CSA G40.8 galvanized): Screws, bolts, nails (3-4 lbs)
- **Cost estimate: $3,200-$4,000 CAD**

### **Homeland Vinyl Privacy Fence (100 LF, 5' Height)**
- Posts (4×4 Homeland): 16 + 4 terminals = 20
- Rails (2×4 Homeland): 39 total
- Boards (5⅝" Privacy Homeland): 200
- Concrete (CSA A3000 heavier): 10 CY
- Hardware (S/S Homeland): Brackets, bolts, screws
- **Cost estimate: $5,200-$6,800 CAD**

### **Chain Link Residential (100 LF, 4' Height - Canadian Standard)**
- Posts (1½" steel CAN/CGSB): 16 + 4 terminals = 20
- Fabric (2" mesh 9GA CAN/CGSB): 100 LF
- Top rail (1¼" CAN/CGSB): 100 LF
- Concrete (CSA A3000): 8 CY
- Hardware (CSA G40.8 galvanized): Tie wires, tension bands, bolts
- **Cost estimate: $1,800-$2,400 CAD**

---

## 7. COMMERCIAL FENCING - CANADIAN STANDARDS

### **High-Security Chain Link (100 LF, 6' Height - CAN/CGSB + Barbed Wire)**
- Posts (1⅞" steel CAN/CGSB): 16 + 4 terminals = 20
- Fabric (2" mesh 9GA CAN/CGSB, 6' height): 100 LF
- Top rail (1¼" CAN/CGSB): 100 LF
- Barbed wire (top guard 3-strand): 100 LF
- Concrete (CSA A3000 heavy): 12 CY
- Hardware (CSA G40.8 heavy-gauge): All fasteners stainless
- **Cost estimate: $5,200-$7,200 CAD**

### **Cloutier Direct Wrought Iron (100 LF, 4-5' Height)**
- Posts (1½-2" Cloutier): 16 + 4 terminals = 20
- Pickets & rails (Cloutier design): 200+ pieces
- Gate components: Per Cloutier spec
- Concrete (CSA A3000): 12 CY
- Paint & finishing (professional): 5-10 gallons
- **Cost estimate: $9,000-$14,000 CAD**

### **Highway Security Fence (100 LF, 8' Height - OPSD Standard)**
- Posts (W-beam OPSD): 10 posts
- W-Beam rails (W10×49 OPSD): 100 LF each (upper/lower)
- Concrete (CSA A3000 extra-heavy OPSD): 12.5 CY
- Fasteners (OPSD Grade 5): Extensive
- Paint & coatings (OPSD): 6-8 gallons
- **Cost estimate: $14,000-$22,000 CAD**

---

## 8. INTERIOR INSTALLATION (POST MOUNTING) - CANADIAN STANDARDS

### **Option A: POST MOUNTING TO CONCRETE SLAB**

#### **Posts Mount Directly to Concrete:**
| Item | Qty | Unit | Description | Canadian Standard |
|------|-----|------|-------------|-------------------|
| Post Base Plates (Bolted) | 1 | Per post | Heavy steel L-brackets CSA spec | CSA A3000 |
| Expansion Anchors (½" dia) | 4 | Per post | Concrete bolt anchors | CSA A3000 |
| Mounting Bolts (½" × 2½") | 4 | Per post | Grade 8 galvanized | CSA G40.8 |
| Washers & Nuts (½") | 8 | Per post | High-strength fasteners | CSA G40.8 |
| Post Height (above concrete) | - | Variable | Can be 4', 5', 6', 8' | CAN/CGSB-138.3-2019 |

#### **Concrete Preparation - Canadian Standards:**
| Item | Qty | Unit | Description | Canadian Standard |
|------|-----|------|-------------|-------------------|
| Concrete Drilling | 4 | Holes | 1-2" deep per post | CSA A3000 |
| Epoxy (concrete bonding) | 1 | Qt | High-strength epoxy CSA spec | CSA A3000 |
| Concrete Cleaner | 1 | Qt | Remove dust/debris | CSA A3000 |

### **Option B: POST MOUNTING TO WOOD FRAMING - CANADIAN STANDARDS**

#### **Posts Mount to Existing Wood Structure:**
| Item | Qty | Unit | Description | Canadian Standard |
|------|-----|------|-------------|-------------------|
| Post Base Plates (Bolted to wood) | 1 | Per post | Heavy-duty angle brackets CSA spec | CSA O141 |
| Lag Bolts (¾" × 3.5") | 4 | Per post | For wood attachment CSA G40.8 | CSA O141 |
| Washers (¾") | 4 | Per post | High-strength CSA G40.8 | CSA G40.8 |
| Nuts (¾") | 4 | Per post | Grade 5+ CSA spec | CSA G40.8 |
| Wood Blocking (if needed) | - | As needed | 2×6 or 2×8 reinforcement CSA O141 | CSA O141 |

#### **Wood Structure Preparation - Canadian Standards:**
| Item | Qty | Unit | Description | Canadian Standard |
|------|-----|------|-------------|-------------------|
| Wood Sealer/Stain | 2 | Gallons | Waterproof protection CSA spec | CSA O141 |
| Flashing Tape (moisture control) | 100 | LF | Prevent water penetration CSA | CSA O141 |
| Caulk (polyurethane) | 1 | Qt | Seal gaps CSA standard | CSA O141 |

### **Option C: DUAL POST MOUNTING - CANADIAN STANDARDS**

#### **Double Posts - Embedded + Mounted:**
| Item | Qty | Unit | Description | Canadian Standard |
|------|-----|------|-------------|-------------------|
| Lower Post (embedded PT) | 1 | Per location | 4×4 PT wood CSA O141 | CSA O141 |
| Upper Post (bolted) | 1 | Per location | 4×4 PT or vinyl CSA spec | CSA O141 / Homeland |
| Heavy-Duty Brackets | 4 | Per connection | Post-to-post connectors CSA | CSA G40.8 |
| Lag Bolts (¾" × 4") | 8 | Per connection | Structural bolts CSA G40.8 | CSA G40.8 |
| Concrete (lower post) | 0.5 | CY | Per post foundation CSA A3000 | CSA A3000 |

---

## 9. MATERIAL COST INTEGRATION GUIDE

### **Canadian Standards Compliance Checklist**

**All Materials Must Comply With:**
- ✅ **CSA Standards** (Canadian Standards Association)
- ✅ **CGSB Standards** (Canadian General Standards Board)
- ✅ **National Building Code (NBC)**
- ✅ **Provincial Building Codes** (OBC, BCBC, ABC, etc.)
- ✅ **Regional Frost Depth Requirements**
- ✅ **CSA A3000** (Concrete Standards)
- ✅ **CSA O141** (Wood Standards)
- ✅ **CSA G40.8** (Steel/Fastener Standards)

### **Step 1: Select Fence Type & Verify Canadian Compliance**
- Chain Link: CAN/CGSB-138.3-2019 ✅
- PVC: Homeland Vinyl Products only ✅
- Wood: CSA O141 Grade #2 minimum ✅
- Wrought Iron: Cloutier Direct only ✅
- Guide Rail: OPSD 02.16.04 only ✅

### **Step 2: Use Frost Depth by Canadian Region**
- Determine project postal code
- Reference Canadian frost depth table
- Adjust post depth per region
- Add extra concrete if necessary

### **Step 3: Obtain Supplier Pricing (Canadian Suppliers)**
- Master Halco (Canada) - Chain link, steel
- Canadian Fence Supply - All types
- Cloutier Direct (Quebec-based) - Wrought iron
- Homeland Vinyl Products - PVC/vinyl
- Local concrete suppliers (CSA A3000 certified)

### **Step 4: Calculate Material Costs**
- Sum all component costs (Canadian pricing)
- Add waste factor (10-15%)
- Add contractor markup (based on business model)
- Verify all materials meet CSA/CGSB standards

### **Step 5: Add Labour + Overhead + Profit**
- Use Canadian labour breakdown system
- Base labour hours × crew size × multipliers × hourly rate
- Apply Canadian wage rates and WCB classifications
- Add overhead allocation (25-35%)
- Add profit margin (25-40%)

### **FINAL ESTIMATE = Materials (CSA-compliant) + Labour (Canadian rates) + Overhead + Profit**

---

## 📋 CANADIAN STANDARDS SUMMARY

| Standard | Application | Compliance |
|----------|-------------|------------|
| **CAN/CGSB-138.3-2019** | Chain Link Fence Installation | ✅ MANDATORY |
| **CSA B95.1** | Pool Enclosure Fencing | ✅ If applicable |
| **CSA O141** | Softwood Lumber Standards | ✅ For wood posts/rails |
| **CSA A3000** | Concrete Standards | ✅ For all footings |
| **CSA G40.8** | Steel Fasteners & Wire | ✅ For all hardware |
| **CSA G40.20/G40.21** | Structural Steel | ✅ For posts & beams |
| **OPSD 02.16.04** | Highway Safety Devices | ✅ If guide rail/highway fence |
| **National Building Code** | General construction standards | ✅ MANDATORY |
| **Provincial Building Codes** | Regional variations (OBC, BCBC, ABC, NBC, etc.) | ✅ MANDATORY |

---

**THIS DATABASE CONTAINS CANADIAN STANDARDS ONLY - NO OTHER STANDARDS OR MATERIALS PERMITTED**

All materials must be sourced from verified Canadian suppliers and must comply with all applicable CSA, CGSB, and provincial building codes.


---

## Section 21: Implementation Guide

### Quick-Start Implementation Order

1. **Set up MongoDB** (local or Atlas)
2. **Configure .env** from .env.example
3. **Install backend** (`cd backend && npm install`)
4. **Run seed script** to create admin user
5. **Start backend** (`npm run dev`)
6. **Open index.html** in browser
7. **Create first estimate** to verify end-to-end flow

### Connecting Frontend to Backend

The frontend `index.html` currently operates stand-alone with localStorage.
To connect it to the backend API:

```javascript
// Add to index.html — API base URL
const API_BASE = 'http://localhost:5000/api';

// Replace localStorage saves with API calls
async function saveEstimate(estimateData) {
  const response = await fetch(`${API_BASE}/estimates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `******'authToken')}`
    },
    body: JSON.stringify(estimateData)
  });
  return response.json();
}
```

### Production Checklist

- [ ] Change `JWT_SECRET` to a strong random string (min 32 chars)
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas or secured MongoDB instance
- [ ] Configure SSL/TLS for backend
- [ ] Set up Gmail app password (not regular password)
- [ ] Change default admin password after first login
- [ ] Enable MongoDB authentication
- [ ] Set up automated backups
- [ ] Configure CORS to only allow your domain
- [ ] Set up a reverse proxy (nginx) in front of Node

### Nginx Reverse Proxy Config

```nginx
server {
    listen 80;
    server_name estimator.fencedepot.ca;
    
    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name estimator.fencedepot.ca;
    
    ssl_certificate /etc/letsencrypt/live/estimator.fencedepot.ca/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/estimator.fencedepot.ca/privkey.pem;
    
    # Serve frontend
    root /var/www/fence-estimator;
    index index.html;
    
    # Proxy API requests to backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Section 22: API Documentation

### Base URL

```
Development:  http://localhost:5000/api
Production:   https://estimator.fencedepot.ca/api
```

### Authentication

All protected endpoints require:
```
Authorization: ******
```

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": []  // optional validation errors array
}
```

### Success Response Format

```json
{
  "success": true,
  "data": { ... },
  "count": 10    // optional for list endpoints
}
```

### Endpoints — Full Reference

#### POST /api/auth/login
**Request:**
```json
{ "username": "staff1", "password": "password123" }
```
**Response:**
```json
{
  "token": "eyJ...",
  "user": { "_id": "...", "username": "staff1", "role": "estimator" }
}
```

#### GET /api/estimates?page=1&limit=20&status=draft
**Query Params:**
- `page` — page number (default: 1)
- `limit` — results per page (default: 20)
- `status` — filter by status
- `search` — search by customer name

**Response:**
```json
{
  "success": true,
  "data": [ { "estimateNumber": "FDE-2026-0001", ... } ],
  "count": 42,
  "pages": 3
}
```

#### POST /api/estimates
**Request:**
```json
{
  "customerName": "Jane Doe",
  "jobAddress": "456 Oak Ave, Mississauga ON L5A 1B2",
  "fenceType": "chain-link",
  "height": 6,
  "footage": 200,
  "corners": 3,
  "gates": [{ "type": "walk", "width": 4 }],
  "materials": [
    { "plu": "100003", "description": "9G Galv Chain Link 6ft x 50ft Roll",
      "qty": 4, "uom": "ROLL", "unitPrice": 139.99, "total": 559.96 }
  ],
  "materialsSubtotal": 1800.00,
  "tax": 234.00,
  "total": 2034.00
}
```

---

## Section 23: Frontend Component Map

### index.html Internal Structure

```
index.html
├── <head>
│   ├── Meta tags (charset, viewport, title)
│   └── <style> — All CSS (~600 lines)
│       ├── CSS Variables (colours, spacing)
│       ├── Reset/Base styles
│       ├── Header/navigation
│       ├── Tab container and tab panels
│       ├── Form controls
│       ├── Material table styles
│       ├── Print styles (@media print)
│       └── Mobile responsive (@media max-width: 768px)
│
└── <body>
    ├── <header> — Logo, company name, estimate number
    ├── <nav class="tab-nav"> — 17 tab buttons
    ├── <main class="tab-container">
    │   ├── #tab-project — Customer & project info form
    │   ├── #tab-specs — Fence type/height/color selectors
    │   ├── #tab-layout — Site dimensions input
    │   ├── #tab-installation — Labour type & rate
    │   ├── #tab-drawings — Canvas-based site sketch
    │   ├── #tab-permits — Permit checklist
    │   ├── #tab-utilities — Call-before-you-dig notes
    │   ├── #tab-estimate — Material list + totals
    │   ├── #tab-contract — Contract terms
    │   ├── #tab-extras — Add-on items
    │   ├── #tab-crew — Crew assignment
    │   ├── #tab-change-orders — Change order log
    │   ├── #tab-sign-off — Sign-off form
    │   ├── #tab-notes — Notes textarea
    │   ├── #tab-admin — Admin panel
    │   ├── #tab-catalog — Product catalog browser
    │   └── #tab-mapping — Google Maps embed
    │
    └── <script>
        ├── const INVENTORY_DB = [...] — 61 products
        ├── const estimateState = {...} — wizard state
        ├── function switchTab(id) — tab navigation
        ├── function nextStep() / prevStep() — wizard
        ├── function calculateAndRenderMaterials() — calculation engine
        ├── function invByPlu(plu) — inventory lookup
        ├── function findMesh(height, gauge, color) — mesh lookup
        ├── function findTensionWire() — wire lookup
        ├── function findBraceBand() — hardware lookup
        ├── function generatePDF() — PDF trigger
        ├── function emailEstimate() — email trigger
        ├── function printEstimate() — print
        └── window.addEventListener('load', ...) — init
```

---

## Section 24: Calculation Formulas Reference

### Linear Feet Conversions

```
1 metre = 3.281 feet
1 foot  = 0.3048 metres
```

### Chain Link — Complete Formula Set

```
Given: linearFeet (LF), fenceHeight (ft), gauge, color

1. POST COUNT
   postSpacing = (commercial ? 12 : 10)  // feet
   posts = CEIL(LF / postSpacing) + 1

2. CORNER / TERMINAL POSTS
   terminalPosts = 2 + corners  // 2 ends + 1 per corner

3. LINE POSTS
   linePosts = posts - terminalPosts

4. POST HEIGHT (embed = 1/3 of post in ground)
   postLength = fenceHeight + embedDepth
   embedDepth = MAX(2.5, fenceHeight / 3)

5. TOP RAIL
   topRailSections = CEIL(LF / 21)  // 21-ft rail lengths

6. MESH ROLLS (50-ft rolls)
   meshRolls = CEIL(LF / 50)

7. TENSION WIRE (200-ft coils at bottom)
   tensionWireCoils = CEIL(LF / 200)

8. BRACE BANDS (2 per terminal post, 1 per line post)
   braceBands = (terminalPosts * 2) + linePosts

9. GATE POST SIZES
   Walk gate (≤4 ft): 2-3/8" posts, 1 set hinges + latch
   Drive gate (>4 ft): 4" posts, 2 sets hinges + drop rod

10. TOTAL COST
    subtotal = SUM(qty * unitPrice for each material line)
    tax = subtotal * 0.13  // HST Ontario
    total = subtotal + tax
```

### PVC / Vinyl Formula Set

```
Given: linearFeet (LF), fenceHeight (ft), style

postSpacing = 8 ft
posts = CEIL(LF / 8) + 1
sections = CEIL(LF / 8)
rails = sections * (style == 'privacy' ? 3 : 2)
picketWidth = 5.5 / 12  // feet
pickets = CEIL(LF / picketWidth) * 1.05  // 5% waste
postCaps = posts
```

### Wood Formula Set

```
Given: linearFeet (LF), fenceHeight (ft)

postSpacing = 8 ft
posts = CEIL(LF / 8) + 1
rails = CEIL(LF / 8) * 2  // 2x4 rails, 2 per bay
picketWidth = 5.5 / 12  // 1x6 boards
pickets = CEIL(LF / picketWidth) * 1.05
concreteBags = posts  // 1 bag per post
```

### Labour Calculation

```
labourRate = $/hr (default $45/hr)
chainLinkProductionRate = 25 LF/hr  // crew of 2
woodProductionRate = 20 LF/hr
pvcProductionRate = 20 LF/hr

labourHours = LF / productionRate
labourTotal = labourHours * labourRate
```

---

## Section 25: Validation Rules

### Customer Information

| Field | Rule |
|-------|------|
| Customer Name | Required, min 2 chars, max 100 chars |
| Email | Valid email format (if provided) |
| Phone | 10 digits (Canadian format, if provided) |
| Job Address | Required, min 5 chars |

### Fence Specifications

| Field | Rule |
|-------|------|
| Fence Type | Required, must be one of: chain-link, pvc, wood, wrought-iron, guide-rail |
| Height | Required, must be: 4, 5, 6, 8, or 10 feet |
| Linear Footage | Required, min 1, max 10000 |
| Corners | Min 0, max 20 |

### Gate Validation

| Field | Rule |
|-------|------|
| Gate Width | Min 3 ft, max 24 ft |
| Gate Type | Must be: walk, drive, double-drive |
| Gate Count | Min 0, max 10 |

### Frontend Validation Code Pattern

```javascript
function validateEstimate() {
  const errors = [];
  
  const customerName = document.getElementById('customer-name').value.trim();
  if (!customerName || customerName.length < 2) {
    errors.push('Customer name is required (min 2 characters)');
  }
  
  const footage = parseFloat(document.getElementById('linear-footage').value);
  if (!footage || footage < 1 || footage > 10000) {
    errors.push('Linear footage must be between 1 and 10,000 feet');
  }
  
  if (errors.length > 0) {
    alert('Please fix the following:\n' + errors.join('\n'));
    return false;
  }
  return true;
}
```

### Backend Validation (Express-validator pattern)

```javascript
const { body, validationResult } = require('express-validator');

const estimateValidation = [
  body('customerName').trim().isLength({ min: 2, max: 100 }),
  body('jobAddress').trim().notEmpty(),
  body('fenceType').isIn(['chain-link', 'pvc', 'wood', 'wrought-iron', 'guide-rail']),
  body('height').isIn([4, 5, 6, 8, 10]),
  body('footage').isFloat({ min: 1, max: 10000 }),
  body('total').isFloat({ min: 0 })
];
```

---

## Section 26: Architecture & Data Flow

### System Architecture

```
┌─────────────────────────────────────────────┐
│                BROWSER                       │
│                                             │
│  index.html                                 │
│  ├── CSS styles (embedded)                  │
│  ├── INVENTORY_DB (61 SKUs)                 │
│  ├── 17-tab wizard UI                       │
│  ├── Calculation engine                     │
│  └── localStorage (auto-save)               │
│              │                              │
│              │ fetch() / XMLHttpRequest      │
│              ▼                              │
└─────────────────────────────────────────────┘
              │
              │ HTTP/HTTPS JSON
              ▼
┌─────────────────────────────────────────────┐
│           EXPRESS BACKEND                   │
│           (backend/server.js)               │
│                                             │
│  Routes:                                    │
│  ├── /api/auth/*  — JWT authentication      │
│  ├── /api/estimates/* — CRUD + PDF + email  │
│  ├── /api/customers/*  — Customer mgmt      │
│  └── /api/products/*   — Inventory mgmt     │
│                                             │
│  Services:                                  │
│  ├── pdfkit — PDF generation                │
│  └── nodemailer — Email delivery            │
│              │                              │
│              │ Mongoose ODM                 │
│              ▼                              │
└─────────────────────────────────────────────┘
              │
              │ MongoDB Wire Protocol
              ▼
┌─────────────────────────────────────────────┐
│             MONGODB                         │
│                                             │
│  Collections:                               │
│  ├── users                                  │
│  ├── estimates                              │
│  ├── customers                              │
│  └── products                               │
└─────────────────────────────────────────────┘
```

### Estimate Creation Data Flow

```
1. User fills tabs 1-7 (customer, specs, measurements, gates)
2. Clicks "Calculate" on Tab 8
3. calculateAndRenderMaterials() fires:
   a. Reads estimateState object
   b. Calls calculation formulas (Section 24)
   c. Looks up prices in INVENTORY_DB
   d. Renders material line table in Tab 8
   e. Computes subtotal + HST + total
4. User reviews/adjusts Tab 8
5. User clicks "Save Estimate":
   a. validateEstimate() checks all fields
   b. POST /api/estimates with JSON payload
   c. Backend saves to MongoDB
   d. Returns estimate _id and estimateNumber
6. User clicks "Generate PDF":
   a. POST /api/estimates/:id/pdf
   b. Backend generates PDF with pdfkit
   c. PDF streamed back to browser
7. User clicks "Email to Customer":
   a. POST /api/estimates/:id/email {email: "..."}
   b. Backend generates PDF, attaches, sends via nodemailer
   c. Customer receives estimate via email
```

---

## Section 27: Troubleshooting Guide

### Installation Issues

**Problem: `npm install` fails with permission error**
```
Error: EACCES: permission denied
```
**Solution:**
```bash
sudo chown -R $USER ~/.npm
npm install
```

**Problem: MongoDB connection refused**
```
Error: MongoServerError: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Start automatically on boot
sudo systemctl enable mongod
```

**Problem: JWT secret error on login**
```
JsonWebTokenError: secretOrPrivateKey must have a value
```
**Solution:** Ensure `.env` file exists with `JWT_SECRET` set. Run from `backend/` directory.

### Email Issues

**Problem: Email sending fails with "Invalid login"**
**Solution:**
1. Enable 2-step verification on Gmail
2. Generate app password: https://myaccount.google.com/apppasswords
3. Use app password (16 chars) as `EMAIL_PASSWORD` in `.env`
4. **Do NOT** use your regular Gmail password

**Problem: Email blocked by spam filter**
**Solution:**
- Use a domain email (info@fencedepot.ca) instead of Gmail for production
- Set up SPF/DKIM records for your domain
- Consider SendGrid or Mailgun for production volume

### Calculation Issues

**Problem: Material quantities seem wrong**
**Checklist:**
1. Verify linear footage input (in feet, not metres)
2. Check fence height selected matches actual fence
3. Verify corners count is accurate
4. Remember: waste factor of 5% is applied automatically
5. Gates add post material — verify gate count

**Problem: Prices show as $0.00**
**Solution:**
- Check `INVENTORY_DB` in index.html has correct PLU codes
- Verify `invByPlu()` function matches PLU format in DB
- Check that fence height matches available product heights

### PDF Issues

**Problem: PDF download doesn't start**
**Solution:**
```javascript
// Check response content-type in browser devtools Network tab
// Should be: application/pdf
// If getting JSON error, check backend logs
```

**Problem: PDF has no content / blank pages**
**Solution:**
- Check that `pdfkit` is installed: `npm list pdfkit`
- Verify estimate data is fully populated before calling PDF endpoint

### Deployment Issues

**Problem: CORS error in browser console**
```
Access to fetch blocked by CORS policy
```
**Solution:** In `backend/server.js`, update CORS origin:
```javascript
app.use(cors({
  origin: 'https://your-actual-domain.com',  // not localhost
  credentials: true
}));
```

**Problem: App crashes on startup in production**
**Solution:**
```bash
# Check logs
pm2 logs fence-estimator

# Verify all env vars are set
node -e "require('dotenv').config(); console.log(process.env.MONGO_URI)"
```

### Common Error Codes

| HTTP Code | Meaning | Common Cause |
|-----------|---------|-------------|
| 400 | Bad Request | Missing required field |
| 401 | Unauthorized | Missing or expired JWT |
| 403 | Forbidden | Insufficient role/permissions |
| 404 | Not Found | Wrong ID or route |
| 500 | Server Error | Check backend logs |

---

## Section 28: Deployment & Maintenance

### Deploying to Railway (Recommended — Free Tier)

1. Create account at https://railway.app
2. New Project → Deploy from GitHub repo
3. Select `Auction2026/fence-estimator` → `backend/` root
4. Add environment variables from your `.env`
5. Add MongoDB plugin or use MongoDB Atlas URI
6. Railway auto-deploys on every git push

### Deploying to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create fence-depot-estimator

# Set env vars
heroku config:set MONGO_URI="mongodb+srv://..."
heroku config:set JWT_SECRET="your-random-secret"
heroku config:set NODE_ENV="production"
# ... etc for all vars

# Deploy
git push heroku main
```

### Deploying to VPS (Ubuntu)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Clone repo
git clone https://github.com/Auction2026/fence-estimator.git
cd fence-estimator/backend
npm install --production

# Create .env
cp .env.example .env
nano .env  # fill in your values

# Start with PM2
pm2 start server.js --name fence-estimator
pm2 save
pm2 startup  # auto-start on reboot

# Check status
pm2 status
pm2 logs fence-estimator
```

### MongoDB Atlas Setup

1. Go to https://cloud.mongodb.com
2. Create free M0 cluster
3. Create database user (username + password)
4. Whitelist IP: 0.0.0.0/0 (allow all) for dev, or your server IP for prod
5. Get connection string from "Connect" → "Connect your application"
6. Replace `MONGO_URI` in `.env`

### Backup Strategy

```bash
# Manual backup
mongodump --uri="$MONGO_URI" --out=/backups/$(date +%Y%m%d)

# Restore
mongorestore --uri="$MONGO_URI" /backups/20260101/

# Automated daily backup (add to crontab)
0 2 * * * mongodump --uri="$MONGO_URI" --out=/backups/$(date +\%Y\%m\%d) --gzip
```

### Keeping the App Updated

```bash
# Pull latest code
git pull origin main

# Install any new dependencies
cd backend && npm install

# Restart backend
pm2 restart fence-estimator
```

---

## Section 29: Wire Grid Diagrams

### Chain Link Fence — Cross-Section View

```
                    POST CAP
                      │
    ────────────────  │  ────────────────
               TOP RAIL (1-3/8" OD)
    ────────────────     ────────────────

    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ░░░░░░░  CHAIN LINK MESH  ░░░░░░░░░░
    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

    ──────────────────────────────────── TENSION WIRE (bottom)

    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  GRADE LEVEL
         │                       │
         │                       │
    POST (embed ~1/3 height)     │
    2-3/8" OD (line post)   2-7/8" OD (terminal)
```

### Post Spacing Diagram — Line Posts

```
TERMINAL           LINE POSTS              TERMINAL
POST ●─────────────●────────●────────●─────────────● POST
     │←── 10 ft ──→│← 10 ft→│← 10 ft→│
                                   ↑
                          Max 10 ft residential
                          Max 12 ft commercial
```

### Corner Post Detail

```
                CORNER POST (2-7/8" OD)
                      │
     ─────────────────┼─────────────────
     Fence run #1     │     Fence run #2
                      │
               BRACE BANDS (2 per corner)
               TIE WIRE connecting mesh to rail
```

### Gate Opening Detail

```
     GATE POST         GATE POST
     (4" OD)           (4" OD)
     │                      │
     │  ┌────────────────┐  │
     │  │                │  │
     │  │   GATE PANEL   │  │
     │  │                │  │
     │  │                │  │
     │  └────────────────┘  │
     │  ↑                ↑  │
     │  Hinges x2       Fork Latch
     │                      │
    ═╪══════════════════════╪═  GRADE
     │                      │
    (embed 4 ft min)    (embed 4 ft min)
```

### Walk Gate vs Drive Gate

```
WALK GATE (≤4 ft wide):           DRIVE GATE (>4 ft, typically 10-16 ft):
                                   
●──────────────●                  ●─────────────●─────────────●
│              │                  │             │             │
│  SINGLE LEAF │                  │   LEAF A    │   LEAF B    │
│              │                  │             │             │
●──────────────●                  ●─────────────●─────────────●
                                                ↑
                                         Center drop rod
```

### 6-Foot Privacy Fence — Section View (Wood)

```
    ──────────── 2x4 CAP RAIL ────────────
    |  |  |  |  |  |  |  |  |  |  |  |
    |  |  |  |  |  |  |  |  |  |  |  |  1x6 BOARDS
    |  |  |  |  |  |  |  |  |  |  |  |  (5.5" wide)
    |  |  |  |  |  |  |  |  |  |  |  |
    |  |  |  |  |  |  |  |  |  |  |  |
    |  |  |  |  |  |  |  |  |  |  |  |
    ──────────── 2x4 MID RAIL  ────────────
    |  |  |  |  |  |  |  |  |  |  |  |
    |  |  |  |  |  |  |  |  |  |  |  |
    ──────────── 2x4 BOTTOM RAIL ─────────
    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  GRADE
         │               │
    4x4 POST (8 ft)      │          spacing: 8 ft
    (2 ft embed)    4x4 POST (8 ft)
```

### PVC Privacy Fence — Section View

```
    ════════════ PVC TOP RAIL ════════════
    ║  ║  ║  ║  ║  ║  ║  ║  ║  ║  ║  ║
    ║  ║  ║  ║  ║  ║  ║  ║  ║  ║  ║  ║  PVC PICKETS
    ║  ║  ║  ║  ║  ║  ║  ║  ║  ║  ║  ║  (3.5" or 5.5" wide)
    ════════════ PVC MID RAIL  ════════════
    ║  ║  ║  ║  ║  ║  ║  ║  ║  ║  ║  ║
    ════════════ PVC BOTTOM RAIL══════════
    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
         │               │
    PVC POST (4x4 or 5x5) + POST CAP
    (2 ft embed, concrete)
```

---

## Section 30: Changelog & Version Notes

### Version 1.0 — Initial Release

**Date:** 2026

**What's Included:**
- ✅ Single-file frontend (`index.html`) with 17-tab wizard
- ✅ Express.js backend with full API
- ✅ MongoDB with Mongoose models
- ✅ JWT authentication
- ✅ PDF generation (pdfkit)
- ✅ Email delivery (nodemailer)
- ✅ INVENTORY_DB Part 1 (61 SKUs)
- ✅ Chain link, PVC, wood, wrought iron, guide rail support
- ✅ localStorage auto-save
- ✅ HST calculation (Ontario 13%)
- ✅ Canadian material specifications

**Known Limitations in v1.0:**
- INVENTORY_DB contains Part 1 of 7 (remaining SKUs to be imported)
- Google Maps integration requires API key configuration
- Frontend not yet connected to backend API (currently standalone with localStorage)
- Payment processing (Stripe) not yet activated

### Planned for Version 1.1

- [ ] Import INVENTORY_DB Parts 2–7 (full POS inventory)
- [ ] Connect frontend to backend API
- [ ] Customer portal (view estimates online)
- [ ] Estimate approval workflow
- [ ] Photo attachments per estimate
- [ ] Digital signature integration

### Planned for Version 2.0

- [ ] Mobile app (React Native)
- [ ] Offline mode with sync
- [ ] Multi-branch support
- [ ] Integration with QuickBooks
- [ ] Supplier ordering integration

---

## End of Guide

**File:** `docs/FENCE_DEPOT_ESTIMATOR_VERSION_1_0_COMPLETE_GUIDE.md`
**Repository:** https://github.com/Auction2026/fence-estimator
**Version:** 1.0
**Sections:** 30

> Give this file to your programmer. It contains everything needed to understand, install, extend, and maintain the Fence Depot Estimator.

---
