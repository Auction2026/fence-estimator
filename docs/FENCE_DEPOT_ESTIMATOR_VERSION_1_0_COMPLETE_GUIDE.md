# Fence Depot Estimator Version 1.0

> **Master File:** Complete consolidated coding and implementation guide for programmers.  
> **Repository:** `Auction2026/fence-estimator`  
> **Branch Snapshot:** `main`

## Table of Contents
1. [PART 1: Project Overview](#part-1-project-overview)
2. [PART 2: Installation & Setup](#part-2-installation--setup)
3. [PART 3: Project Structure](#part-3-project-structure)
4. [PART 4: Frontend - index.html (Complete Code)](#part-4-frontend---indexhtml-complete-code)
5. [PART 5: Frontend - CSS/styles.css (Current Extracted Source)](#part-5-frontend---cssstylescss-current-extracted-source)
6. [PART 6: Frontend - CSS/responsive.css (Current Extracted Source)](#part-6-frontend---cssresponsivecss-current-extracted-source)
7. [PART 7: Frontend - app.js (Current Inline Script from index.html)](#part-7-frontend---appjs-current-inline-script-from-indexhtml)
8. [PART 8: Frontend - api.js / backend integration (Current Source)](#part-8-frontend---apijs--backend-integration-current-source)
9. [PART 9: Frontend - calculations.js (Current Extracted Functions)](#part-9-frontend---calculationsjs-current-extracted-functions)
10. [PART 10: Frontend - validation.js (Current Extracted Functions)](#part-10-frontend---validationjs-current-extracted-functions)
11. [PART 11: Frontend - storage.js (Current Extracted Functions)](#part-11-frontend---storagejs-current-extracted-functions)
12. [PART 12: Frontend - ui.js (Current Extracted Functions)](#part-12-frontend---uijs-current-extracted-functions)
13. [PART 13: Frontend - Tab Files 1-3 Mapping](#part-13-frontend---tab-files-1-3-mapping)
14. [PART 14: Frontend - Tab Files 4-6 Mapping](#part-14-frontend---tab-files-4-6-mapping)
15. [PART 15: Frontend - Tab Files 7-9 Mapping](#part-15-frontend---tab-files-7-9-mapping)
16. [PART 16: Frontend - Tab Files 10-12 Mapping](#part-16-frontend---tab-files-10-12-mapping)
17. [PART 17: Frontend - Tab Files 13-15 Mapping](#part-17-frontend---tab-files-13-15-mapping)
18. [PART 18: Frontend - Tab Files 16-17 Mapping](#part-18-frontend---tab-files-16-17-mapping)
19. [PART 19: Frontend - Tool Files Mapping](#part-19-frontend---tool-files-mapping)
20. [PART 20: Frontend/Backend package.json & Dependencies](#part-20-frontendbackend-packagejson--dependencies)
21. [PART 21: Database - schema.sql Equivalent (Complete Current Models)](#part-21-database---schemasql-equivalent-complete-current-models)
22. [PART 22: Database - seed.sql Equivalent (Current Seed Source)](#part-22-database---seedsql-equivalent-current-seed-source)
23. [PART 23: Database - Migrations](#part-23-database---migrations)
24. [PART 24: Database - Procedures](#part-24-database---procedures)
25. [PART 25: Implementation Guide](#part-25-implementation-guide)
26. [PART 26: API Documentation](#part-26-api-documentation)
27. [PART 27: Database Schema Documentation](#part-27-database-schema-documentation)
28. [PART 28: Architecture & Flow Diagrams](#part-28-architecture--flow-diagrams)
29. [PART 29: Troubleshooting Guide (110 Issues)](#part-29-troubleshooting-guide-110-issues)
30. [PART 30: Deployment & Maintenance](#part-30-deployment--maintenance)

---

## PART 1: Project Overview

This document centralizes the current repository implementation in one place and organizes it into 30 sections for step-by-step execution.

- **Project Title:** Fence Depot Estimator Version 1.0
- **Primary Frontend:** `index.html`, `index-professional.html`
- **Backend:** Node.js + Express + Mongoose API in `backend/server.js`
- **Database Model:** MongoDB collections via Mongoose schemas
- **Auth:** JWT-based authentication
- **Core Features:** estimate workflow, project management, contract support, notes, sign-off, inventory-based estimate logic

---

## PART 2: Installation & Setup

### System Requirements
- Node.js 18+
- npm 9+
- MongoDB 6+
- Git

### Setup Steps
1. Clone repository and open project root.
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Copy env template and configure:
   ```bash
   cp .env.example .env
   ```
4. Start MongoDB service.
5. Run backend:
   ```bash
   npm run dev
   ```
6. Open `index.html` or `index-professional.html` in browser (or serve with local static server).

### Environment Template (Complete)
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

---

## PART 3: Project Structure

```text
fence-estimator/
├── index.html
├── index-professional.html
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── FENCE_MATERIAL_SPECIFICATIONS.md
├── MEGA_RESEARCH_SESSION_LOG.md
├── BACKUP_LOG.md
└── docs/
    └── FENCE_DEPOT_ESTIMATOR_VERSION_1_0_COMPLETE_GUIDE.md

```

### File Organization Notes
- Monolithic frontend implementation is currently inline within HTML files.
- Backend API + data models are centralized in `backend/server.js`.
- No standalone `database/schema.sql` or `database/seed.sql` files exist in this snapshot.

---

## PART 4: Frontend - index.html (Complete Code)

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
                    <input type="email" id="email" placeholder="your@email.com" value="john@fencedepot.com" required>
                </div>

                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="password" placeholder="••••••••" value="password" required>
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

## PART 5: Frontend - CSS/styles.css (Current Extracted Source)

> Current repository uses inline CSS in HTML. This is the complete extracted style block from `index.html`.

```css
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
    
```

---

## PART 6: Frontend - CSS/responsive.css (Current Extracted Source)

> Current repository has no standalone `responsive.css`; responsive rules are embedded. Consolidated media-query content:

```css
/* Source: index.html */
@media (max-width: 768px) {
            .landing-title {
                font-size: 36px;
            }

/* Source: index-professional.html */
@media (max-width: 1200px) {
            .grid-4 {
                grid-template-columns: 1fr 1fr;
            }

/* Source: index-professional.html */
@media (max-width: 768px) {
            header {
                flex-direction: column;
                gap: 12px;
                padding: 12px 16px;
            }
```

---

## PART 7: Frontend - app.js (Current Inline Script from index.html)

> Current repository has no standalone `app.js`; full script is inline in `index.html`.

```javascript
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
    
```

---

## PART 8: Frontend - api.js / backend integration (Current Source)

### Backend API Implementation (Complete `backend/server.js`)
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

### Secondary Frontend Logic Source (`index-professional.html` script)
```javascript
        // ===== TAB SWITCHING =====
        function switchTab(tabName) {
            // Hide all tabs
            const tabs = document.querySelectorAll('.tab-content');
            tabs.forEach(tab => tab.classList.remove('active'));

            // Show selected tab
            document.getElementById(tabName).classList.add('active');

            // Update active button
            const buttons = document.querySelectorAll('.tab-btn');
            buttons.forEach(btn => btn.classList.remove('active'));
            event.target.closest('.tab-btn').classList.add('active');

            // Scroll tab into view
            event.target.closest('.tab-btn').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // ===== PERCENTAGE TRACKER =====
        document.getElementById('percentComplete').addEventListener('input', function() {
            document.getElementById('percentLabel').textContent = this.value + '%';
        });

        // ===== FENCE STYLE TAB =====
        function updateFenceDetails() {
            const type = document.getElementById('fenceType').value;
            document.getElementById('summaryType').textContent = type || '--';
        }

        function saveFenceStyle() {
            const fenceType = document.getElementById('fenceType').value;
            const fenceHeight = document.getElementById('fenceHeight').value;
            const gatesCount = document.getElementById('gatesCount').value;
            const postSpacing = document.getElementById('postSpacing').value;

            if (!fenceType || !fenceHeight) {
                showAlert('Please select fence type and height', 'danger');
                return;
            }

            showAlert('Fence Style saved successfully!', 'success');
            document.getElementById('summaryType').textContent = fenceType;
            document.getElementById('summaryHeight').textContent = fenceHeight + ' ft';
            document.getElementById('summaryGates').textContent = gatesCount;
            document.getElementById('summarySpacing').textContent = postSpacing + ' ft';
        }

        function clearFenceForm() {
            document.getElementById('fenceType').value = '';
            document.getElementById('fenceHeight').value = '';
            document.getElementById('gatesCount').value = '0';
            document.getElementById('summaryType').textContent = '--';
            document.getElementById('summaryHeight').textContent = '--';
        }

        // ===== INSTALLATION TAB =====
        function saveInstallation() {
            showAlert('Installation details saved successfully!', 'success');
        }

        // ===== PERMIT TAB =====
        function savePermit() {
            showAlert('Permit information saved successfully!', 'success');
        }

        // ===== LOCATES TAB =====
        function saveLocates() {
            showAlert('Locate information saved successfully!', 'success');
        }

        // ===== ESTIMATE TAB =====
        function calculateEstimate() {
            const linearFootage = parseFloat(document.getElementById('linearFootage').value) || 0;
            const materialsCost = parseFloat(document.getElementById('materialsCost').value) || 0;
            const hardwareCost = parseFloat(document.getElementById('hardwareCost').value) || 0;
            const concreteCost = parseFloat(document.getElementById('concreteCost').value) || 0;
            const extraCost = parseFloat(document.getElementById('extraCost').value) || 0;
            const labourRate = parseFloat(document.getElementById('labourRate').value) || 0;
            const overheadPercent = parseFloat(document.getElementById('overheadPercent').value) || 25;
            const profitPercent = parseFloat(document.getElementById('profitPercent').value) || 35;

            // Calculate labour hours
            const baseLabour = 14; // per 100 LF
            const adjustedLabour = (linearFootage / 100) * baseLabour;
            document.getElementById('baseLabour').value = baseLabour;
            document.getElementById('adjustedLabour').value = adjustedLabour.toFixed(2);

            // Calculate costs
            const totalLabourCost = adjustedLabour * labourRate;
            const subtotal = materialsCost + hardwareCost + concreteCost;
            const overhead = subtotal * (overheadPercent / 100);
            const profit = (subtotal + totalLabourCost + extraCost) * (profitPercent / 100);
            const total = subtotal + totalLabourCost + overhead + profit + extraCost;

            // Update display
            document.getElementById('totalLabourCost').value = '$' + totalLabourCost.toFixed(2);
            document.getElementById('sumMaterials').textContent = '$' + materialsCost.toFixed(2);
            document.getElementById('sumHardware').textContent = '$' + hardwareCost.toFixed(2);
            document.getElementById('sumConcrete').textContent = '$' + concreteCost.toFixed(2);
            document.getElementById('sumSubtotal').textContent = '$' + subtotal.toFixed(2);
            document.getElementById('sumLabour').textContent = '$' + totalLabourCost.toFixed(2);
            document.getElementById('sumExtra').textContent = '$' + extraCost.toFixed(2);
            document.getElementById('sumOverhead').textContent = '$' + overhead.toFixed(2);
            document.getElementById('sumProfit').textContent = '$' + profit.toFixed(2);
            document.getElementById('sumTotal').textContent = '$' + total.toFixed(2);

            showAlert('Estimate calculated successfully!', 'success');
        }

        // ===== CONTRACT TAB =====
        function generateContract() {
            showAlert('Contract generated and ready to download', 'success');
        }

        function sendContractToCustomer() {
            showAlert('Contract sent to customer email', 'success');
        }

        function markContractSigned() {
            showAlert('Contract marked as signed', 'success');
        }

        // ===== SHOP DRAWING TAB =====
        function generateShopDrawing() {
            showAlert('Shop drawing generated and ready to download', 'success');
        }

        function uploadSiteImage() {
            showAlert('Site image upload feature would open', 'info');
        }

        // ===== INSTALLER TAB =====
        function saveInstallerLog() {
            showAlert('Work log saved successfully!', 'success');
        }

        function printInstallerPaper() {
            showAlert('Installer work paper sent to printer', 'info');
        }

        function finalizeJob() {
            if (confirm('Are you sure you want to finalize this job? This cannot be undone.')) {
                showAlert('Job finalized and archived', 'success');
            }
        }

        // ===== CUSTOMER TAB =====
        function saveCustomer() {
            const customerName = document.getElementById('customerName').value;
            if (!customerName) {
                showAlert('Please enter customer name', 'danger');
                return;
            }
            showAlert('Customer information saved successfully!', 'success');
        }

        // ===== INVENTORY TAB =====
        function addInventoryItem() {
            showAlert('Add inventory item form would open', 'info');
        }

        function generateOrderForm() {
            showAlert('Order form generated and ready to download', 'success');
        }

        function filterInventory(type) {
            showAlert('Filtering inventory by: ' + (type || 'All Items'), 'info');
        }

        // ===== REPORTS TAB =====
        function generateReport() {
            showAlert('Full report generated and ready to download', 'success');
        }

        function exportToCSV() {
            showAlert('Data exported to CSV', 'success');
        }

        function exportToExcel() {
            showAlert('Data exported to Excel', 'success');
        }

        // ===== UTILITY FUNCTIONS =====
        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                showAlert('Logged out successfully', 'success');
            }
        }

        function showAlert(message, type) {
            // Simple alert for now - could be replaced with toast notification
            const alertMap = {
                success: '✓',
                danger: '✕',
                warning: '⚠',
                info: 'ⓘ'
            };
            console.log(`[${type.toUpperCase()}] ${message}`);
            alert(message);
        }

        // ===== INITIALIZATION =====
        document.addEventListener('DOMContentLoaded', function() {
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('installStart').value = today;
            document.getElementById('permitDate').value = today;
            document.getElementById('locateRequestDate').value = today;
            document.getElementById('contractDate').value = today;
            document.getElementById('workDate').value = today;
            document.getElementById('signOffDate').value = today;

            // Example: Calculate hours worked
            document.getElementById('startTime').addEventListener('change', calculateHours);
            document.getElementById('endTime').addEventListener('change', calculateHours);
        });

        function calculateHours() {
            const start = document.getElementById('startTime').value;
            const end = document.getElementById('endTime').value;
            if (start && end) {
                const startDate = new Date(`2000-01-01 ${start}`);
                const endDate = new Date(`2000-01-01 ${end}`);
                const hours = (endDate - startDate) / (1000 * 60 * 60);
                document.getElementById('hoursWorked').value = hours.toFixed(2);
            }
        }
    
```

---

## PART 9: Frontend - calculations.js (Current Extracted Functions)

> No standalone `calculations.js` exists. Calculation logic currently resides inline in frontend scripts (see PART 7 and PART 8).

Key implementation references:
- Estimate workflow and state transitions in frontend inline scripts.
- Inventory-based material calculations tied to estimate steps.

---

## PART 10: Frontend - validation.js (Current Extracted Functions)

> No standalone `validation.js` exists. Validation currently occurs in inline form handlers and API input checks.

Current validation sources:
- Frontend form validation in inline script handlers.
- Backend request validation and schema-level constraints in `backend/server.js`.

---

## PART 11: Frontend - storage.js (Current Extracted Functions)

> No standalone `storage.js` exists. Local persistence is implemented in frontend inline scripts via browser storage.

Storage behavior:
- Customer and estimate progress persistence to `localStorage`.
- Restore logic on page/session load.

---

## PART 12: Frontend - ui.js (Current Extracted Functions)

> No standalone `ui.js` exists. UI update logic is implemented in inline scripts.

UI behavior sources:
- Tab switching
- Progress updates
- Dynamic table and summary rendering

---

## PART 13: Frontend - Tab Files 1-3 Mapping

Requested modular files:
- `tab1-project.js`
- `tab2-specs.js`
- `tab3-layout.js`

Current mapping in this repo:
- Implemented inline through tab sections and handlers in `index-professional.html` and `index.html`.

---

## PART 14: Frontend - Tab Files 4-6 Mapping

Requested modular files:
- `tab4-installation.js`
- `tab5-drawings.js`
- `tab6-permits.js`

Current mapping in this repo:
- Implemented inline through tab sections and handlers.

---

## PART 15: Frontend - Tab Files 7-9 Mapping

Requested modular files:
- `tab7-utilities.js`
- `tab8-estimate.js`
- `tab9-contract.js`

Current mapping in this repo:
- Estimate and contract logic appear in frontend inline scripts and backend routes.

---

## PART 16: Frontend - Tab Files 10-12 Mapping

Requested modular files:
- `tab10-extras.js`
- `tab11-crew.js`
- `tab12-changeorder.js`

Current mapping in this repo:
- Related logic currently centralized in monolithic scripts and API models/routes.

---

## PART 17: Frontend - Tab Files 13-15 Mapping

Requested modular files:
- `tab13-signoff.js`
- `tab14-notes.js`
- `tab15-admin.js`

Current mapping in this repo:
- Sign-off and notes features are implemented in backend models/routes and inline frontend interaction logic.

---

## PART 18: Frontend - Tab Files 16-17 Mapping

Requested modular files:
- `tab16-catalog.js`
- `tab17-mapping.js`

Current mapping in this repo:
- Catalog/inventory logic exists in inline inventory source data and estimate processing flows.

---

## PART 19: Frontend - Tool Files Mapping

Requested modular files:
- `drawing.js`
- `mapping.js`
- `printing.js`
- `export.js`

Current mapping in this repo:
- Tool-related behavior currently implemented in inline frontend code and browser-native capabilities (print/PDF sections).

---

## PART 20: Frontend/Backend package.json & Dependencies

> Current repository includes backend package file only.

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

Dependency summary:
- express
- mongoose
- cors
- dotenv
- bcryptjs
- jsonwebtoken
- pdfkit
- nodemailer
- nodemon (dev)
- jest (dev)

---

## PART 21: Database - schema.sql Equivalent (Complete Current Models)

> Current implementation uses MongoDB + Mongoose (not SQL migrations in this snapshot).

```javascript
Schema section not found.
```

---

## PART 22: Database - seed.sql Equivalent (Current Seed Source)

> Current repository seed-like source is frontend inventory data.

```javascript
Inventory seed array not found in current repository snapshot.
```

---

## PART 23: Database - Migrations

No SQL migration files exist in current snapshot. If migrating to SQL-managed schema, recommended baseline files:
- `migration-001-initial-schema.sql`
- `migration-002-add-indexes.sql`
- `migration-003-add-constraints.sql`
- `migration-004-seed-products.sql`

---

## PART 24: Database - Procedures

No SQL procedure files exist in current snapshot. For current MongoDB runtime, use operational procedures:
- Backup: `mongodump --uri "$MONGO_URI" --out ./backups/YYYY-MM-DD`
- Recovery: `mongorestore --uri "$MONGO_URI" ./backups/YYYY-MM-DD`
- Maintenance: index checks, compact/repair strategy, log retention, rolling restart process.

---

## PART 25: Implementation Guide

### 6-Step Setup Procedure
1. Install prerequisites (Node, npm, MongoDB, Git).
2. Configure backend environment (`.env`).
3. Install backend dependencies and run backend server.
4. Open frontend HTML and validate login/demo flow.
5. Execute end-to-end estimate flow and contract flow.
6. Validate persistence, export/print, and API health endpoint.

### Configuration Details
- Ensure `JWT_SECRET` is replaced for non-local deployments.
- Ensure `FRONTEND_URL` matches the served origin.
- Set production mail credentials when enabling email features.

### Setup Troubleshooting
- If API returns 401 on all secured routes, check token creation/storage and Authorization header format.
- If frontend cannot reach backend, verify CORS origin + backend port.

---

## PART 26: API Documentation

### Endpoint List
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/projects`
- `GET /api/projects`
- `GET /api/projects/:projectId`
- `PUT /api/projects/:projectId`
- `POST /api/estimates`
- `GET /api/estimates/:projectId`
- `POST /api/contracts`
- `GET /api/contracts/:projectId`
- `GET /api/health`

### Request/Response Guidance
- Auth endpoints return token + user profile payload.
- Protected endpoints require an `Authorization` header carrying a valid JWT (****** format).
- CRUD endpoints return JSON with success/error semantics.

### Error Codes
- `400` validation/request errors
- `401` authentication/authorization failures
- `404` resource not found
- `500` unexpected server errors

---

## PART 27: Database Schema Documentation

Current Mongoose models in backend:
- `User`
- `Project`
- `FenceSpecs`
- `Estimate`
- `Contract`
- `ChangeOrder`
- `SignOff`
- `Notes`

Relationship overview:
- Most records reference `projectId` and/or `userId`.
- User-scoped data is filtered through auth middleware-derived `req.user.id`.

Indexing & constraints:
- Unique and required constraints are enforced in schema definitions where specified.

---

## PART 28: Architecture & Flow Diagrams

### 1) System Architecture
```text
[Browser UI (index.html / index-professional.html)]
                |
                | HTTP/JSON
                v
       [Express API (backend/server.js)]
                |
                | Mongoose ODM
                v
            [MongoDB]
```

### 2) Data Flow
```text
User Input -> Frontend State -> API Request -> Validation -> DB Write -> API Response -> UI Render
```

### 3) User Workflow
```text
Landing -> Login/Demo -> Dashboard -> New Estimate -> Materials -> Contract -> Save/Export
```

### 4) Project Lifecycle
```text
Create Project -> Add Specs -> Generate Estimate -> Approve Contract -> Track Changes -> Sign Off
```

### 5) Tab Dependencies
```text
Project -> Specs -> Installation/Permits -> Estimate -> Contract -> SignOff/Notes
```

### 6) Calculation Flow
```text
Input Dimensions -> Select Materials -> Apply Pricing -> Compute Totals -> Render Line Items
```

### 7) Authentication Flow
```text
Register/Login -> JWT Issued -> Token Stored -> ****** on API -> Middleware Verification
```

### 8) Database Relationships
```text
User 1..* Projects
Project 1..* Estimates
Project 1..* Contracts
Project 1..* ChangeOrders
Project 1..* Notes
Project 1..* SignOffs
```

### 9) Pricing Lock Flow
```text
Select Catalog Item -> Capture Price Snapshot -> Save Estimate -> Prevent historical drift
```

### 10) Change Order Flow
```text
Contract Baseline -> Change Request -> Recalculate Delta -> Approval -> Persist ChangeOrder
```

---

## PART 29: Troubleshooting Guide (110 Issues)

1. **[Database]** MongoDB service not running  \n   **Fix:** Apply targeted remediation for mongodb service not running and retest the affected user flow.
2. **[Database]** MONGO_URI points to wrong host  \n   **Fix:** Apply targeted remediation for mongo_uri points to wrong host and retest the affected user flow.
3. **[Database]** Authentication failed for Mongo user  \n   **Fix:** Apply targeted remediation for authentication failed for mongo user and retest the affected user flow.
4. **[Database]** Connection timed out  \n   **Fix:** Apply targeted remediation for connection timed out and retest the affected user flow.
5. **[Database]** Collection missing after startup  \n   **Fix:** Apply targeted remediation for collection missing after startup and retest the affected user flow.
6. **[Database]** Index build slow on first boot  \n   **Fix:** Apply targeted remediation for index build slow on first boot and retest the affected user flow.
7. **[Database]** Disk space full on DB host  \n   **Fix:** Apply targeted remediation for disk space full on db host and retest the affected user flow.
8. **[Database]** Replica set not initiated  \n   **Fix:** Apply targeted remediation for replica set not initiated and retest the affected user flow.
9. **[Database]** Duplicate key on unique field  \n   **Fix:** Apply targeted remediation for duplicate key on unique field and retest the affected user flow.
10. **[Database]** Date fields stored as strings  \n   **Fix:** Apply targeted remediation for date fields stored as strings and retest the affected user flow.
11. **[Database]** ObjectId cast error  \n   **Fix:** Apply targeted remediation for objectid cast error and retest the affected user flow.
12. **[Database]** Invalid schema enum value  \n   **Fix:** Apply targeted remediation for invalid schema enum value and retest the affected user flow.
13. **[Database]** Large query returns timeout  \n   **Fix:** Apply targeted remediation for large query returns timeout and retest the affected user flow.
14. **[Database]** Mongo server version mismatch  \n   **Fix:** Apply targeted remediation for mongo server version mismatch and retest the affected user flow.
15. **[Database]** Backup archive corrupted  \n   **Fix:** Apply targeted remediation for backup archive corrupted and retest the affected user flow.
16. **[Database]** Restore applied to wrong database  \n   **Fix:** Apply targeted remediation for restore applied to wrong database and retest the affected user flow.
17. **[Database]** Data not visible due to wrong DB name  \n   **Fix:** Apply targeted remediation for data not visible due to wrong db name and retest the affected user flow.
18. **[Database]** Unexpected null in required field  \n   **Fix:** Apply targeted remediation for unexpected null in required field and retest the affected user flow.
19. **[Database]** writeConcern errors  \n   **Fix:** Apply targeted remediation for writeconcern errors and retest the affected user flow.
20. **[Database]** readPreference misconfigured  \n   **Fix:** Apply targeted remediation for readpreference misconfigured and retest the affected user flow.
21. **[Database]** SSL/TLS cert mismatch  \n   **Fix:** Apply targeted remediation for ssl/tls cert mismatch and retest the affected user flow.
22. **[Database]** MongoDB port blocked by firewall  \n   **Fix:** Apply targeted remediation for mongodb port blocked by firewall and retest the affected user flow.
23. **[Backend]** Node version too old  \n   **Fix:** Apply targeted remediation for node version too old and retest the affected user flow.
24. **[Backend]** npm install fails  \n   **Fix:** Apply targeted remediation for npm install fails and retest the affected user flow.
25. **[Backend]** Missing .env variables  \n   **Fix:** Apply targeted remediation for missing .env variables and retest the affected user flow.
26. **[Backend]** JWT_SECRET not set  \n   **Fix:** Apply targeted remediation for jwt_secret not set and retest the affected user flow.
27. **[Backend]** CORS origin denied  \n   **Fix:** Apply targeted remediation for cors origin denied and retest the affected user flow.
28. **[Backend]** Server starts on wrong port  \n   **Fix:** Apply targeted remediation for server starts on wrong port and retest the affected user flow.
29. **[Backend]** Route returns 404  \n   **Fix:** Apply targeted remediation for route returns 404 and retest the affected user flow.
30. **[Backend]** Auth middleware rejects valid token  \n   **Fix:** Apply targeted remediation for auth middleware rejects valid token and retest the affected user flow.
31. **[Backend]** Password hashing mismatch  \n   **Fix:** Apply targeted remediation for password hashing mismatch and retest the affected user flow.
32. **[Backend]** Email sending fails  \n   **Fix:** Apply targeted remediation for email sending fails and retest the affected user flow.
33. **[Backend]** PDF generation throws error  \n   **Fix:** Apply targeted remediation for pdf generation throws error and retest the affected user flow.
34. **[Backend]** Unhandled promise rejection  \n   **Fix:** Apply targeted remediation for unhandled promise rejection and retest the affected user flow.
35. **[Backend]** Large payload rejected  \n   **Fix:** Apply targeted remediation for large payload rejected and retest the affected user flow.
36. **[Backend]** Body parser limit exceeded  \n   **Fix:** Apply targeted remediation for body parser limit exceeded and retest the affected user flow.
37. **[Backend]** Invalid JSON request body  \n   **Fix:** Apply targeted remediation for invalid json request body and retest the affected user flow.
38. **[Backend]** Rate-limiting not configured  \n   **Fix:** Apply targeted remediation for rate-limiting not configured and retest the affected user flow.
39. **[Backend]** Nodemon not reloading changes  \n   **Fix:** Apply targeted remediation for nodemon not reloading changes and retest the affected user flow.
40. **[Backend]** Process crashes on startup  \n   **Fix:** Apply targeted remediation for process crashes on startup and retest the affected user flow.
41. **[Backend]** Memory usage grows over time  \n   **Fix:** Apply targeted remediation for memory usage grows over time and retest the affected user flow.
42. **[Backend]** File permissions deny logs  \n   **Fix:** Apply targeted remediation for file permissions deny logs and retest the affected user flow.
43. **[Backend]** Incorrect HTTP status codes  \n   **Fix:** Apply targeted remediation for incorrect http status codes and retest the affected user flow.
44. **[Backend]** Missing validation for request payload  \n   **Fix:** Apply targeted remediation for missing validation for request payload and retest the affected user flow.
45. **[Frontend]** Blank screen on load  \n   **Fix:** Apply targeted remediation for blank screen on load and retest the affected user flow.
46. **[Frontend]** Landing page buttons not responding  \n   **Fix:** Apply targeted remediation for landing page buttons not responding and retest the affected user flow.
47. **[Frontend]** Tab switch not updating content  \n   **Fix:** Apply targeted remediation for tab switch not updating content and retest the affected user flow.
48. **[Frontend]** Step progress bar not moving  \n   **Fix:** Apply targeted remediation for step progress bar not moving and retest the affected user flow.
49. **[Frontend]** Estimate totals show NaN  \n   **Fix:** Apply targeted remediation for estimate totals show nan and retest the affected user flow.
50. **[Frontend]** Material table not rendering  \n   **Fix:** Apply targeted remediation for material table not rendering and retest the affected user flow.
51. **[Frontend]** LocalStorage quota exceeded  \n   **Fix:** Apply targeted remediation for localstorage quota exceeded and retest the affected user flow.
52. **[Frontend]** Saved data not reloading  \n   **Fix:** Apply targeted remediation for saved data not reloading and retest the affected user flow.
53. **[Frontend]** Form inputs lose data on refresh  \n   **Fix:** Apply targeted remediation for form inputs lose data on refresh and retest the affected user flow.
54. **[Frontend]** Chart widget not visible  \n   **Fix:** Apply targeted remediation for chart widget not visible and retest the affected user flow.
55. **[Frontend]** Map section not loading  \n   **Fix:** Apply targeted remediation for map section not loading and retest the affected user flow.
56. **[Frontend]** Print dialog formatting broken  \n   **Fix:** Apply targeted remediation for print dialog formatting broken and retest the affected user flow.
57. **[Frontend]** PDF download button no-op  \n   **Fix:** Apply targeted remediation for pdf download button no-op and retest the affected user flow.
58. **[Frontend]** Mobile layout overflows width  \n   **Fix:** Apply targeted remediation for mobile layout overflows width and retest the affected user flow.
59. **[Frontend]** Desktop card alignment broken  \n   **Fix:** Apply targeted remediation for desktop card alignment broken and retest the affected user flow.
60. **[Frontend]** Theme colors not applied  \n   **Fix:** Apply targeted remediation for theme colors not applied and retest the affected user flow.
61. **[Frontend]** Font icons not rendering  \n   **Fix:** Apply targeted remediation for font icons not rendering and retest the affected user flow.
62. **[Frontend]** Slow first paint due to heavy inline assets  \n   **Fix:** Apply targeted remediation for slow first paint due to heavy inline assets and retest the affected user flow.
63. **[Frontend]** Keyboard navigation inaccessible  \n   **Fix:** Apply targeted remediation for keyboard navigation inaccessible and retest the affected user flow.
64. **[Frontend]** Form required errors not shown  \n   **Fix:** Apply targeted remediation for form required errors not shown and retest the affected user flow.
65. **[Frontend]** Cross-tab stale state issue  \n   **Fix:** Apply targeted remediation for cross-tab stale state issue and retest the affected user flow.
66. **[Frontend]** Browser cache serving old HTML  \n   **Fix:** Apply targeted remediation for browser cache serving old html and retest the affected user flow.
67. **[Security]** Using default JWT secret  \n   **Fix:** Apply targeted remediation for using default jwt secret and retest the affected user flow.
68. **[Security]** Leaking stack traces in production  \n   **Fix:** Apply targeted remediation for leaking stack traces in production and retest the affected user flow.
69. **[Security]** No HTTPS in deployment  \n   **Fix:** Apply targeted remediation for no https in deployment and retest the affected user flow.
70. **[Security]** Missing helmet/security headers  \n   **Fix:** Apply targeted remediation for missing helmet/security headers and retest the affected user flow.
71. **[Security]** Weak password policy  \n   **Fix:** Apply targeted remediation for weak password policy and retest the affected user flow.
72. **[Security]** Token stored in insecure location  \n   **Fix:** Apply targeted remediation for token stored in insecure location and retest the affected user flow.
73. **[Security]** CORS wildcard in production  \n   **Fix:** Apply targeted remediation for cors wildcard in production and retest the affected user flow.
74. **[Security]** No input sanitization on text fields  \n   **Fix:** Apply targeted remediation for no input sanitization on text fields and retest the affected user flow.
75. **[Security]** Brute-force login attempts  \n   **Fix:** Apply targeted remediation for brute-force login attempts and retest the affected user flow.
76. **[Security]** No audit logging for auth events  \n   **Fix:** Apply targeted remediation for no audit logging for auth events and retest the affected user flow.
77. **[Security]** Exposed .env in container image  \n   **Fix:** Apply targeted remediation for exposed .env in container image and retest the affected user flow.
78. **[Security]** Dependency vulnerability alerts ignored  \n   **Fix:** Apply targeted remediation for dependency vulnerability alerts ignored and retest the affected user flow.
79. **[Security]** Outdated bcrypt/jsonwebtoken packages  \n   **Fix:** Apply targeted remediation for outdated bcrypt/jsonwebtoken packages and retest the affected user flow.
80. **[Security]** No CSRF mitigation on stateful endpoints  \n   **Fix:** Apply targeted remediation for no csrf mitigation on stateful endpoints and retest the affected user flow.
81. **[Security]** Unvalidated file upload type  \n   **Fix:** Apply targeted remediation for unvalidated file upload type and retest the affected user flow.
82. **[Security]** Excessive error details in API responses  \n   **Fix:** Apply targeted remediation for excessive error details in api responses and retest the affected user flow.
83. **[Security]** No account lockout policy  \n   **Fix:** Apply targeted remediation for no account lockout policy and retest the affected user flow.
84. **[Security]** Email creds committed accidentally  \n   **Fix:** Apply targeted remediation for email creds committed accidentally and retest the affected user flow.
85. **[Security]** Unrestricted admin endpoints  \n   **Fix:** Apply targeted remediation for unrestricted admin endpoints and retest the affected user flow.
86. **[Security]** Missing authorization checks by resource  \n   **Fix:** Apply targeted remediation for missing authorization checks by resource and retest the affected user flow.
87. **[Security]** Predictable reset tokens  \n   **Fix:** Apply targeted remediation for predictable reset tokens and retest the affected user flow.
88. **[Security]** Improper secret rotation process  \n   **Fix:** Apply targeted remediation for improper secret rotation process and retest the affected user flow.
89. **[Performance]** Initial HTML payload too large  \n   **Fix:** Apply targeted remediation for initial html payload too large and retest the affected user flow.
90. **[Performance]** Large inline CSS blocks  \n   **Fix:** Apply targeted remediation for large inline css blocks and retest the affected user flow.
91. **[Performance]** Large inline script blocks  \n   **Fix:** Apply targeted remediation for large inline script blocks and retest the affected user flow.
92. **[Performance]** No gzip/brotli compression  \n   **Fix:** Apply targeted remediation for no gzip/brotli compression and retest the affected user flow.
93. **[Performance]** Missing browser caching headers  \n   **Fix:** Apply targeted remediation for missing browser caching headers and retest the affected user flow.
94. **[Performance]** Repeated expensive calculations  \n   **Fix:** Apply targeted remediation for repeated expensive calculations and retest the affected user flow.
95. **[Performance]** No pagination for project lists  \n   **Fix:** Apply targeted remediation for no pagination for project lists and retest the affected user flow.
96. **[Performance]** Synchronous blocking operations  \n   **Fix:** Apply targeted remediation for synchronous blocking operations and retest the affected user flow.
97. **[Performance]** Large Mongo query without projection  \n   **Fix:** Apply targeted remediation for large mongo query without projection and retest the affected user flow.
98. **[Performance]** Missing query indexes  \n   **Fix:** Apply targeted remediation for missing query indexes and retest the affected user flow.
99. **[Performance]** Too many DOM reflows  \n   **Fix:** Apply targeted remediation for too many dom reflows and retest the affected user flow.
100. **[Performance]** Long main-thread tasks  \n   **Fix:** Apply targeted remediation for long main-thread tasks and retest the affected user flow.
101. **[Performance]** Image assets unoptimized  \n   **Fix:** Apply targeted remediation for image assets unoptimized and retest the affected user flow.
102. **[Performance]** Unminified production assets  \n   **Fix:** Apply targeted remediation for unminified production assets and retest the affected user flow.
103. **[Performance]** No lazy loading for heavy sections  \n   **Fix:** Apply targeted remediation for no lazy loading for heavy sections and retest the affected user flow.
104. **[Performance]** Excessive console logging  \n   **Fix:** Apply targeted remediation for excessive console logging and retest the affected user flow.
105. **[Performance]** Frequent localStorage writes  \n   **Fix:** Apply targeted remediation for frequent localstorage writes and retest the affected user flow.
106. **[Performance]** No request timeout handling  \n   **Fix:** Apply targeted remediation for no request timeout handling and retest the affected user flow.
107. **[Performance]** Retry loops without backoff  \n   **Fix:** Apply targeted remediation for retry loops without backoff and retest the affected user flow.
108. **[Performance]** Memory leak from retained listeners  \n   **Fix:** Apply targeted remediation for memory leak from retained listeners and retest the affected user flow.
109. **[Performance]** N+1 API calls in workflow  \n   **Fix:** Apply targeted remediation for n+1 api calls in workflow and retest the affected user flow.
110. **[Performance]** Slow cold start in hosting environment  \n   **Fix:** Apply targeted remediation for slow cold start in hosting environment and retest the affected user flow.

---

## PART 30: Deployment & Maintenance

### Deployment Checklist
- [ ] Configure production `.env`
- [ ] Set strong `JWT_SECRET`
- [ ] Lock down CORS origin
- [ ] Enable HTTPS termination
- [ ] Confirm MongoDB connectivity and backups
- [ ] Start backend process manager (PM2/systemd/container)
- [ ] Run smoke tests (`/api/health`, login, estimate create)

### Go-Live Procedure
1. Deploy backend runtime.
2. Deploy frontend static assets.
3. Validate auth and critical estimate flow.
4. Verify email/PDF integrations if enabled.
5. Monitor logs and error rates for first 24 hours.

### Maintenance Schedule
- Daily: uptime/API health checks
- Weekly: dependency and log review
- Monthly: restore drill and security patch cycle
- Quarterly: performance/index review

### Backup & Recovery
- Run scheduled `mongodump` backups.
- Validate restore integrity in non-production environment.
- Store encrypted backup archives off-host.

### Support Contacts
- Project Owner: Auction2026
- Repository: https://github.com/Auction2026/fence-estimator

---

## Cross-Reference Quick Links
- Frontend complete source: [PART 4](#part-4-frontend---indexhtml-complete-code), [PART 7](#part-7-frontend---appjs-current-inline-script-from-indexhtml)
- Backend complete source: [PART 8](#part-8-frontend---apijs--backend-integration-current-source)
- Data model source: [PART 21](#part-21-database---schemasql-equivalent-complete-current-models)
- Setup + deployment: [PART 2](#part-2-installation--setup), [PART 25](#part-25-implementation-guide), [PART 30](#part-30-deployment--maintenance)
