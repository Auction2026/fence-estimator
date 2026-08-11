# WIRE GRID 04 — PROJECT LIFECYCLE
## Status Flow from New to Completed

```
╔══════════════════════════════════════════════════════════════════════════╗
║                      PROJECT LIFECYCLE STATUS FLOW                       ║
╚══════════════════════════════════════════════════════════════════════════╝

         ┌───────────────┐
         │      NEW      │ ← Customer inquiry received
         │   (status)    │   Lead entered in system
         └───────┬───────┘
                 │
                 ▼
         ┌───────────────┐
         │  ESTIMATING   │ ← Site visit scheduled
         │   (status)    │   Measurements taken
         └───────┬───────┘   Estimate wizard started
                 │
                 ▼
         ┌───────────────┐
         │ ESTIMATE_SENT │ ← Estimate emailed/printed
         │   (status)    │   Customer reviewing
         └───────┬───────┘
                 │
          ┌──────┴──────┐
          │             │
          ▼             ▼
  ┌──────────────┐  ┌──────────────┐
  │   APPROVED   │  │   REJECTED   │
  │  (status)    │  │  (status)    │
  │  Move to     │  │  Close or    │
  │  scheduling  │  │  re-estimate │
  └──────┬───────┘  └──────────────┘
         │
         ▼
  ┌──────────────┐
  │  SCHEDULED   │ ← Crew assigned
  │  (status)    │   Materials ordered
  └──────┬───────┘   Permit pulled (if req'd)
         │
         ▼
  ┌──────────────┐
  │ IN_PROGRESS  │ ← Work started on site
  │  (status)    │   Change orders if needed
  └──────┬───────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────────────┐  ┌──────────────┐
│  COMPLETED    │  │  CANCELLED   │
│  (status)     │  │  (status)    │
│  Invoice sent │  │  Document    │
│  Job closed   │  │  reason      │
└───────────────┘  └──────────────┘

══════════════════════════════════════════
STATUS TRANSITIONS TABLE
══════════════════════════════════════════
FROM             → TO              TRIGGER
─────────────────────────────────────────
new              → estimating      Site visit scheduled
estimating       → estimate_sent   Estimate finalized + sent
estimate_sent    → approved        Customer accepts
estimate_sent    → rejected        Customer declines
approved         → scheduled       Crew + date assigned
scheduled        → in_progress     Work begins
in_progress      → completed       Work inspected + done
any status       → cancelled       Customer or contractor cancels
══════════════════════════════════════════
```
