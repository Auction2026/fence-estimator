# WIRE GRID 03 — USER WORKFLOW
## Estimator Daily Workflow

```
╔══════════════════════════════════════════════════════════════════════════╗
║                     ESTIMATOR DAILY WORKFLOW                             ║
╚══════════════════════════════════════════════════════════════════════════╝

        ┌──────────────────────────────────────┐
        │            LOGIN TO SYSTEM            │
        │    username + password → JWT token    │
        └──────────────────┬───────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │              DASHBOARD                │
        │  • Open Estimates (count + value)     │
        │  • Projects in Progress               │
        │  • Low Stock Alerts                   │
        │  • Expiring Estimates (7 days)        │
        │  • Recent Activity                    │
        └────────┬────────────────┬────────────┘
                 │                │
        ┌────────▼──────┐  ┌──────▼────────────┐
        │  NEW ESTIMATE │  │  EXISTING PROJECT  │
        └────────┬──────┘  └──────┬─────────────┘
                 │                │
        ┌────────▼──────┐  ┌──────▼────────────┐
        │  5-Step       │  │  View Project      │
        │  Wizard       │  │  Details & Estimates│
        └────────┬──────┘  └──────┬─────────────┘
                 │                │
                 └──────┬─────────┘
                        │
                        ▼
        ┌──────────────────────────────────────┐
        │          ESTIMATE ACTIONS             │
        │                                       │
        │  [Print]  [Email]  [Lock Price]       │
        │  [Approve] [Reject] [New Version]     │
        └──────────────────┬───────────────────┘
                           │
                   ┌───────▼───────┐
                   │   APPROVED?   │
                   └───┬───────┬───┘
                      NO      YES
                       │       │
                       ▼       ▼
              ┌────────────┐  ┌─────────────────┐
              │  Revise    │  │  Create Project  │
              │  Estimate  │  │  Schedule Crew   │
              │  or Close  │  │  Order Materials │
              └────────────┘  └────────┬─────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │  PROJECT ACTIVE  │
                              │  Track Progress  │
                              │  Change Orders   │
                              └────────┬─────────┘
                                       │
                                       ▼
                              ┌─────────────────┐
                              │  COMPLETED       │
                              │  Invoice Customer│
                              │  Close Project   │
                              └─────────────────┘
```
