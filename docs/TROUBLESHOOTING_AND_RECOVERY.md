# Troubleshooting & Recovery Guide

## Overview

This guide explains what to do if the code generation process freezes, hits an error, or skips a section.

---

## Issue 1 — Code Creator FREEZES

**Symptom:** No new files added to GitHub for 30+ minutes.

**Solution:**
1. Refresh or restart the generation session.
2. Send a new message: `"Continue generation, create next part"`
3. The system will check GitHub, determine what is already done, and resume from that point.
4. No data is lost — all files already committed to GitHub are permanent.

---

## Issue 2 — Code Creator HITS A SNAG (Error)

**Symptom:** An error message appears in the chat.

**Common errors and fixes:**

| Error | Fix |
|---|---|
| Database connection error | Update the `.env` file with correct credentials |
| File already exists | Delete the old file, then retry |
| Missing dependency | Run `npm install` in the backend directory |
| API rate limit reached | Wait 5 minutes, then retry the request |

**After fixing the error:**  
Send: `"Retry [SPECIFIC PART]"` — for example, `"Retry PART 2 Frontend Code"`

---

## Issue 3 — Code Creator FORGETS (Skips a Section)

**Symptom:** A file or section you expected is not present in GitHub.

**Solution:**
1. Request the specific missing part again.
2. Example messages:
   - `"Create PART 2 Frontend Code"`
   - `"Create Wire Grids"`
   - `"Create database/schema.sql"`
3. The system will create only the missing parts; already-complete files will not be overwritten.

---

## Issue 4 — Network / Connection Problem

**Symptom:** Generation stops and there are no new GitHub commits.

**Solution:**
1. Check your internet connection.
2. Refresh the chat window.
3. Send: `"Check status and verify all parts"`
4. Files already pushed to GitHub are safe and do not need to be regenerated.

---

## Monitoring Process

1. Open GitHub: <https://github.com/Auction2026/fence-estimator>
2. Check for new files or commits every 30–60 minutes.
3. If there is no new commit after 1 hour, use one of the refresh options below.

---

## Refresh Options

### Option 1 — Simple Continue
```
"Continue generation, create next part"
```
The system checks GitHub and resumes from the current point.

### Option 2 — Restart a Specific Part
```
"Create PART 2 Frontend Code again"
```
The system regenerates only that specific part.

### Option 3 — Full Status Check
```
"Check status and verify all parts"
```
The system reports what is complete, what is missing, and what needs to be retried.

---

## Quick Reference — What to Say

| Situation | Message to send |
|---|---|
| Resume after freeze | `"Continue"` or `"Keep going"` |
| Regenerate one part | `"Create [SPECIFIC PART]"` |
| Check what is done | `"Check status"` or `"What's the status?"` |
| Full refresh | `"Refresh generation"` |

---

## What Happens When You Send a Refresh

1. System checks GitHub for all current files.
2. Determines what is complete.
3. Determines what is missing.
4. Continues or restarts as needed.
5. Reports progress in the chat.

---

## Data Safety

- All files already pushed to GitHub are **permanent and safe**.
- Refreshing or restarting **never deletes** existing work.
- Generation always continues **from the last completed file**.
- No work is ever lost.

---

## Does the Chat Window Need to Stay Open?

**No.** Once a generation request is confirmed:
- You can close the chat window.
- Files will continue to be created and pushed to GitHub.
- Check GitHub directly to monitor progress.
- Re-open the chat only if you need to send a refresh or ask for a status update.
