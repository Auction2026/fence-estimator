# DIAGRAM 4: PROJECT LIFECYCLE
## Fence Depot Fence Estimator — Full Project Status Flow

```
═══════════════════════════════════════════════════════════════════════
                     PROJECT LIFECYCLE DIAGRAM
═══════════════════════════════════════════════════════════════════════

                          ┌─────────┐
                          │  START  │
                          │ (Lead)  │
                          └────┬────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    STATUS: DRAFT      │
                    │                      │
                    │  • Customer info      │
                    │  • Site visit notes   │
                    │  • Rough measurements │
                    │  • No pricing yet     │
                    └──────────┬───────────┘
                               │
                     Estimate Created
                               │
                               ▼
                    ┌──────────────────────┐
                    │   STATUS: ESTIMATE   │
                    │                      │
                    │  • Full materials     │
                    │  • Labor calculated   │
                    │  • PDF generated      │
                    │  • Sent to customer   │
                    │  • Valid 30 days      │
                    └──────────┬───────────┘
                               │
               ┌───────────────┼───────────────┐
               │               │               │
               ▼               ▼               ▼
        Customer        Customer          No Response
        Says YES        Says NO           After 30 days
               │               │               │
               ▼               ▼               ▼
     ┌────────────────┐  ┌──────────────┐  ┌────────────┐
     │ STATUS:        │  │ STATUS:      │  │ STATUS:    │
     │ APPROVED       │  │ DECLINED     │  │ EXPIRED    │
     │                │  │              │  │            │
     │ • Contract     │  │ • Record     │  │ • Archive  │
     │   signed       │  │   reason     │  │ • Can re-  │
     │ • Deposit      │  │ • Archive    │  │   activate │
     │   collected    │  │              │  │            │
     │ • Job          │  └──────────────┘  └────────────┘
     │   scheduled    │
     └───────┬────────┘
             │
     Job Scheduled
             │
             ▼
     ┌────────────────┐
     │ STATUS:        │
     │ IN_PROGRESS    │
     │                │
     │ • Crew         │
     │   assigned     │
     │ • Materials    │
     │   ordered      │
     │ • Start date   │
     │   confirmed    │
     │                │
     │  ┌──────────┐  │
     │  │ Change   │  │ ◄── Scope changes generate
     │  │ Orders   │  │     Change Order records
     │  │ (if any) │  │
     │  └──────────┘  │
     └───────┬────────┘
             │
     Work Complete
             │
             ▼
     ┌────────────────┐
     │ STATUS:        │
     │ COMPLETED      │
     │                │
     │ • Final photos │
     │ • Customer     │
     │   sign-off     │
     │ • Final        │
     │   invoice      │
     │ • Payment      │
     │   collected    │
     │ • Archive      │
     └───────┬────────┘
             │
             ▼
         ┌───────┐
         │  END  │
         └───────┘

═══════════════════════════════════════════════════════════════════════
CANCELLATION: Any status can transition to CANCELLED
  draft → cancelled (before estimate)
  estimate → cancelled (customer withdrew)
  approved → cancelled (with cancellation fee)
  in_progress → cancelled (emergency stop)

DATABASE FIELD: projects.status
ENUM: 'draft','estimate','approved','in_progress','completed','cancelled'
═══════════════════════════════════════════════════════════════════════

TIMELINE TRACKING:
┌────────────────┬──────────────────────────────────────────────────┐
│ Status         │ Typical Duration                                  │
├────────────────┼──────────────────────────────────────────────────┤
│ draft          │ Same day (site visit to office)                   │
│ estimate       │ 1–30 days (waiting for customer decision)         │
│ approved       │ 1–7 days (contract signing to scheduling)         │
│ in_progress    │ 1–5 days (for typical residential fence)          │
│ completed      │ Final day (after installation)                    │
└────────────────┴──────────────────────────────────────────────────┘
```
