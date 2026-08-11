# PROJECT LIFECYCLE
## Fence Depot Estimator — Project Status State Machine

```
═══════════════════════════════════════════════════════════════
                    PROJECT STATUS FLOW
═══════════════════════════════════════════════════════════════

                         [NEW PROJECT CREATED]
                                  │
                                  ▼
                          ┌───────────────┐
                          │     DRAFT     │ ◄──── Default on creation
                          │ status=draft  │       Estimate not yet sent
                          └───────┬───────┘
                                  │ Estimate generated & sent
                                  ▼
                          ┌───────────────┐
                          │   ESTIMATE    │ ◄──── Estimate sent to customer
                          │status=estimate│       Awaiting response
                          └───────┬───────┘
                                  │
              ┌───────────────────┼──────────────────────┐
              │                   │                      │
              ▼                   ▼                      ▼
    ┌──────────────────┐  ┌──────────────┐    ┌──────────────────┐
    │  ESTIMATE        │  │  CONTRACT    │    │   CANCELLED      │
    │  REJECTED        │  │  status=     │    │   status=        │
    │  (re-estimate    │  │  contract    │    │   cancelled      │
    │   or close)      │  └──────┬───────┘    └──────────────────┘
    └──────────────────┘         │
                                 │ Work begins
                                 ▼
                        ┌────────────────┐
                        │  IN PROGRESS   │ ◄──── Crew assigned
                        │ status=        │       Permit pulled
                        │ in_progress    │       Materials ordered
                        └────────┬───────┘
                                 │
                    ┌────────────┼──────────────┐
                    │            │              │
                    ▼            ▼              ▼
          ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
          │  CHANGE      │ │  ON HOLD     │ │  CANCELLED   │
          │  ORDER       │ │  (weather,   │ │  (mid-job)   │
          │  (approved,  │ │   permit     │ └──────────────┘
          │  continue)   │ │   delay)     │
          └──────┬───────┘ └──────┬───────┘
                 │                │
                 └────────┬───────┘
                          │ Work resumes / completes
                          ▼
                 ┌────────────────┐
                 │    COMPLETE    │ ◄──── Final sign-off captured
                 │ status=        │       All payments received
                 │ complete       │       Customer satisfied
                 └────────┬───────┘
                          │ After 2 years
                          ▼
                 ┌────────────────┐
                 │   ARCHIVED     │ ◄──── Moved to archive
                 │ status=        │       Still searchable
                 │ archived       │       Not in active list
                 └────────────────┘


═══════════════════════════════════════════════════════════════
                    ESTIMATE STATUS FLOW
═══════════════════════════════════════════════════════════════

  ┌─────────┐   sent    ┌──────────┐  accepted  ┌──────────────┐
  │  DRAFT  │ ────────► │   SENT   │ ─────────► │   ACCEPTED   │
  └─────────┘           └──────────┘            └──────────────┘
                               │ rejected              │ price lock
                               ▼                       ▼
                        ┌──────────┐            ┌──────────────┐
                        │ REJECTED │            │ PRICE LOCKED │
                        └──────────┘            └──────────────┘
                                                       │ to contract
                                                       ▼
                                                ┌──────────────┐
                                                │  → CONTRACT  │
                                                └──────────────┘

  Estimates also expire if not accepted within valid_until date:
  ┌──────────┐  date passed  ┌──────────┐
  │   SENT   │ ────────────► │ EXPIRED  │
  └──────────┘               └──────────┘
```
