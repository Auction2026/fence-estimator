# SYSTEM ARCHITECTURE DIAGRAM
**Fence Estimator Pro** – Overall System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FENCE ESTIMATOR PRO                          │
│                       System Architecture                           │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐     HTTPS/HTTP      ┌──────────────────────┐
│   CLIENT BROWSER     │◄──────────────────►│   WEB SERVER (Nginx)  │
│                      │                     │   Port 80/443         │
│  ┌────────────────┐  │                     └──────────┬───────────┘
│  │ index.html     │  │                                │
│  │ (17 Tabs SPA)  │  │                     ┌──────────▼───────────┐
│  └────────────────┘  │     REST API /api   │  EXPRESS.JS BACKEND  │
│  ┌────────────────┐  │◄──────────────────►│   Node.js v16+        │
│  │ CSS Styles     │  │   (JSON payloads)   │   Port 3000           │
│  └────────────────┘  │                     │                       │
│  ┌────────────────┐  │                     │  ┌─────────────────┐  │
│  │ JavaScript     │  │                     │  │ Auth Routes      │  │
│  │ Modules:       │  │                     │  │ Project Routes   │  │
│  │ - app.js       │  │                     │  │ Estimate Routes  │  │
│  │ - api.js       │  │                     │  │ Contract Routes  │  │
│  │ - calculations │  │                     │  │ Inventory Routes │  │
│  │ - storage.js   │  │                     │  │ Admin Routes     │  │
│  │ - validation   │  │                     │  └────────┬────────┘  │
│  │ - ui.js        │  │                     │           │           │
│  │ - 17 tab files │  │                     └───────────┼───────────┘
│  └────────────────┘  │                                 │
│                      │                     ┌───────────▼───────────┐
│  LOCAL STORAGE:      │                     │   MYSQL DATABASE      │
│  - Project data      │                     │   v8.0+               │
│  - Auto-save         │                     │                       │
│  - Settings          │                     │  Tables:              │
│  - Canvas drawing    │                     │  - users              │
│                      │                     │  - projects           │
└──────────────────────┘                     │  - fence_specs        │
                                             │  - estimates          │
┌──────────────────────┐                     │  - contracts          │
│  EXTERNAL SERVICES   │                     │  - change_orders      │
│                      │                     │  - sign_offs          │
│  Google Maps API ────┼─────────────────►  │  - notes              │
│  (Optional - Tab 17) │                     │  - inventory (950+)   │
│                      │                     │  - audit_log          │
│  Email (SMTP) ───────┼─────────────────►  │                       │
│  (Optional)          │                     └───────────────────────┘
└──────────────────────┘
```

## Component Descriptions

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Frontend SPA | HTML5/CSS3/Vanilla JS | 17-tab user interface |
| Web Server | Nginx | Serve static files, reverse proxy |
| Backend API | Node.js + Express.js | Business logic, authentication |
| Database | MySQL 8.0 | Data persistence |
| Auth | JWT Tokens | Session management |
| Local Storage | Browser API | Offline capability, auto-save |
