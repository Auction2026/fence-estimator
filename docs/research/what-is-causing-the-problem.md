# What Is Causing the Problem

**Date:** August 13, 2026

## The Short Answer

**MongoDB (the database) is not running on your computer.**

The backend server needs MongoDB to work. When MongoDB is not installed or not started, the server cannot connect to it and stops with this error:

```
❌ Database connection failed: connect ECONNREFUSED 127.0.0.1:27017
Failed to start server: connect ECONNREFUSED 127.0.0.1:27017
```

This was verified by running `node backend/server.js` on a machine without MongoDB — the exact error above appears.

## What Happened Before vs. Now

1. **Before PR #54:** When MongoDB was missing, the server kept running anyway. Every request from the frontend got stuck waiting forever (Mongoose "buffered" the queries). That is why the program looked **frozen**.
2. **After PR #54 (merged):** The server now stops right away with a clear error message instead of freezing. This is the correct behavior — but the server still **will not start** until MongoDB is running.

## Where This Happens in the Code

- `backend/server.js`, `connectDB()` (around line 43): tries to connect to `mongodb://localhost:27017/fence-estimator` (or the `MONGO_URI` environment variable if set).
- `backend/server.js`, `startServer()` (around line 1216): if the database connection fails, it prints "Failed to start server" and exits.

## How to Fix It (Step by Step)

Install and start MongoDB on your computer:

1. Go to https://www.mongodb.com/try/download/community
2. Download **MongoDB Community Server** for your operating system (Windows or Mac).
3. Run the installer and accept the default options. On Windows, make sure the box **"Install MongoDB as a Service"** is checked — this makes it start automatically.
4. Restart your computer.
5. Start the backend again: open a terminal in the `backend` folder and run `npm start`.
6. You should now see: `✅ MongoDB Connected: localhost`

## Note About the Standalone Page

The single-file `index.html` in the project root works **without** the backend — it saves data in the browser (localStorage). Only the `backend/` API server needs MongoDB.
