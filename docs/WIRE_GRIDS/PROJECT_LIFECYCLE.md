# WIRE GRID 4: PROJECT LIFECYCLE

```
╔══════════════════════════════════════════════════════╗
║              PROJECT STATUS LIFECYCLE                ║
╚══════════════════════════════════════════════════════╝

                   ┌──────────────┐
   Customer calls  │   INQUIRY    │  No conversion
   ──────────────► │  (informal)  │ ─────────────────► END
                   └──────┬───────┘
                          │ Measurement / site visit
                          ▼
                   ┌──────────────┐
   Estimate wizard │    OPEN      │  Customer declines
   ──────────────► │  (estimate   │ ─────────────────► CANCELLED
                   │   created)   │
                   └──────┬───────┘
                          │ Customer reviews
                          ▼
                   ┌──────────────┐
   Send estimate   │   PENDING    │  Customer rejects
   ──────────────► │  (awaiting   │ ─────────────────► REJECTED
                   │  approval)   │    (revision loop)
                   └──────┬───────┘
                          │ Customer approves
                          ▼
                   ┌──────────────┐
   Contract signed │   SIGNED     │ ◄── Change Orders allowed
   ──────────────► │  (contract   │
                   │  executed)   │
                   └──────┬───────┘
                          │ Installation begins
                          ▼
                   ┌──────────────┐
   Work underway   │ IN PROGRESS  │ ◄── Daily notes
   ──────────────► │  (job site   │      Change orders
                   │   active)    │
                   └──────┬───────┘
                          │ Work finished
                          ▼
                   ┌──────────────┐
   Final walkthrough│  COMPLETE   │  Sign-off collected
   ──────────────►  │  (job done  │ ──────────────────► ARCHIVED
                   │  & signed)   │                    (2 years)
                   └──────────────┘

STATUS TRANSITIONS:
  open ──► pending ──► signed ──► in_progress ──► complete
  open ──► cancelled
  pending ──► cancelled
  signed ──► cancelled (with penalty clause)

DATABASE STATUS FIELD:
  projects.status: 'open' | 'pending' | 'signed' | 'in_progress' | 'complete' | 'cancelled'
  estimates.status: 'draft' | 'sent' | 'approved' | 'rejected' | 'expired'
  contracts.status: 'pending' | 'signed' | 'cancelled' | 'complete'
  change_orders.status: 'pending' | 'approved' | 'rejected' | 'complete'
```
