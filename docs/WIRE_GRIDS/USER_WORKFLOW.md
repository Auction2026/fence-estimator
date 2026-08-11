# DIAGRAM 3: USER WORKFLOW
## Fence Depot Fence Estimator — Complete User Journey

```
═══════════════════════════════════════════════════════════════════════
                      USER WORKFLOW DIAGRAM
                  From First Contact to Project Complete
═══════════════════════════════════════════════════════════════════════

PHASE 1: INITIAL CONTACT
────────────────────────
  Customer calls / walks in
          │
          ▼
  Estimator opens Fence Estimator App
          │
          ├──► Login (if not already logged in)
          │
          ▼
  Dashboard loads
  ┌──────────────────────────────────────┐
  │  Today's Stats:                      │
  │  • Estimates this week               │
  │  • Open projects                     │
  │  • Revenue pipeline                  │
  │  • Pending approvals                 │
  └──────────────────────────────────────┘

PHASE 2: SITE ASSESSMENT
─────────────────────────
  Estimator visits job site
          │
          ▼
  Records measurements:
  • Linear footage (walk perimeter)
  • Number of gate openings
  • Fence height needed
  • Terrain type (flat/slope/rocky)
  • Special requirements (barbed wire, privacy slats)

PHASE 3: ESTIMATE CREATION
───────────────────────────
  Back at office — open "New Estimate" tab
          │
          ▼
  ┌────────────────────────────────────┐
  │  Step 1: Customer Information      │
  │  ┌──────────────────────────────┐  │
  │  │ First Name   │ Last Name     │  │
  │  │ Phone        │ Email         │  │
  │  │ Street Address               │  │
  │  │ City, Province, Postal Code  │  │
  │  └──────────────────────────────┘  │
  │  [Next →]                          │
  └────────────────────────────────────┘
          │
          ▼
  ┌────────────────────────────────────┐
  │  Step 2: Fence Type                │
  │  ○ Chain Link   ○ Wood             │
  │  ○ Vinyl        ○ Aluminum         │
  │  ○ Ornamental   ○ Composite        │
  │                                    │
  │  Height: [4ft] [5ft] [6ft] [8ft]  │
  │  Color:  [Galv] [Black] [Green]   │
  │  Type:   [Residential] [Comm.]    │
  │  [← Back] [Next →]                 │
  └────────────────────────────────────┘
          │
          ▼
  ┌────────────────────────────────────┐
  │  Step 3: Measurements              │
  │                                    │
  │  Linear Footage:  [______] ft      │
  │  Number of Gates: [______]         │
  │  Gate Size:       [__] ft wide     │
  │  Barbed Wire:     [Yes] [No]       │
  │  Remove Old Fence: [Yes] [No]      │
  │  Notes: [_________________________]│
  │  [← Back] [Next →]                 │
  └────────────────────────────────────┘
          │
          ▼
  ┌────────────────────────────────────┐
  │  Step 4: Materials (Auto-Calc)     │
  │                                    │
  │  Qty  │ Description      │ Total   │
  │  ─────┼──────────────────┼──────── │
  │   2   │ Chain Link Fabric│ $172.00 │
  │  14   │ Line Posts 1-5/8"│ $196.00 │
  │   2   │ Terminal Posts   │  $58.00 │
  │   7   │ Top Rail 1-3/8"  │ $126.00 │
  │  ...  │ ...              │ ...     │
  │       │                  │ ─────── │
  │       │ Materials Total  │$XXXX.00 │
  │       │ Labor            │$XXXX.00 │
  │       │ Markup (20%)     │$XXXX.00 │
  │       │ GST (5%)         │$ XXX.00 │
  │       │ TOTAL            │$XXXX.00 │
  │  [← Back] [Next →]                 │
  └────────────────────────────────────┘
          │
          ▼
  ┌────────────────────────────────────┐
  │  Step 5: Review & Generate         │
  │                                    │
  │  Estimate #: EST-2024-001          │
  │  Customer:   John Smith            │
  │  Date:       2024-08-11            │
  │  Valid Until: 2024-09-11           │
  │                                    │
  │  [📧 Email to Customer]            │
  │  [📄 Print PDF]                    │
  │  [💾 Save to Projects]             │
  │  [← Back]                          │
  └────────────────────────────────────┘

PHASE 4: APPROVAL PROCESS
──────────────────────────
  Estimate emailed/printed and given to customer
          │
          ├──► Customer says NO → Mark as Declined
          │
          └──► Customer says YES ──────────────────────────┐
                                                           │
PHASE 5: PROJECT ACTIVATION                               │
───────────────────────────                               │
                                                          ▼
  Open "Projects" tab                           ┌──────────────────┐
          │                                     │ Estimate Approved │
          ▼                                     │ Status: APPROVED  │
  Create Project from Estimate                  └────────┬─────────┘
          │                                              │
          ▼                                              ▼
  Assign crew / schedule start date             Collect Deposit
          │                                     Issue Contract
          ▼
  Project Status: IN PROGRESS
          │
          ▼
  Installation completed
          │
          ▼
  Project Status: COMPLETED
          │
          ▼
  Final invoice sent
          │
          ▼
  Payment received ✅

PHASE 6: CHANGE ORDERS (if needed)
────────────────────────────────────
  During installation, scope changes
          │
          ▼
  Open "Change Orders" tab
          │
          ▼
  Document change:
  • What changed
  • Reason
  • Additional cost / credit
          │
          ▼
  Customer approves change order
          │
          ▼
  Project total updated

═══════════════════════════════════════════════════════════════════════
STATUS PROGRESSION:
  draft → estimate → approved → in_progress → completed
                      └──────────────────────────► cancelled (anytime)
═══════════════════════════════════════════════════════════════════════
```
