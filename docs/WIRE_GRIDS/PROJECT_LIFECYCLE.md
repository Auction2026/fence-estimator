# PROJECT LIFECYCLE
## Fence Depot Fence Estimator - Project States and Transitions

```
═══════════════════════════════════════════════════════════════════════════
                     PROJECT LIFECYCLE DIAGRAM v1.0
═══════════════════════════════════════════════════════════════════════════

                              ┌─────────┐
                              │  START  │
                              │  (New   │
                              │  Lead)  │
                              └────┬────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────────┐
│  STATE: NEW                                                          │
│                                                                      │
│  What happens:                                                       │
│  • Customer calls or emails about fence quote                        │
│  • Create project in Tab 1 with customer info                        │
│  • Project assigned unique ID (e.g., PE-2026-0001)                   │
│  • Status set to "NEW"                                               │
│                                                                      │
│  Required data: Customer name, address, phone                        │
└─────────────────────────────┬────────────────────────────────────────┘
                              │ Site visit scheduled
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│  STATE: SURVEYED                                                     │
│                                                                      │
│  What happens:                                                       │
│  • Estimator visits job site                                         │
│  • Fills out Tab 2 (Site Survey) in the field                        │
│  • Takes photos with Tab 13                                          │
│  • Marks site on map with Tab 17                                     │
│  • Notes special conditions in Tab 12                                │
│                                                                      │
│  Required data: Terrain, dimensions, special conditions              │
└─────────────────────────────┬────────────────────────────────────────┘
                              │ Specs entered
                              ▼
┌──────────────────────────────────────────────────────────────────────┐
│  STATE: ESTIMATED                                                    │
│                                                                      │
│  What happens:                                                       │
│  • Enter fence specs in Tab 3                                        │
│  • System calculates materials in Tab 4                              │
│  • Enter labor hours in Tab 5                                        │
│  • Add equipment costs in Tab 6                                      │
│  • Review pricing in Tab 7                                           │
│  • Review full estimate in Tab 8                                     │
│  • Send estimate to customer (print or email)                        │
│                                                                      │
│  Required data: Specs, materials, labor, pricing                     │
└───────────┬────────────────────────┬─────────────────────────────────┘
            │                        │
    Customer │ accepts         Customer rejects
            │                        │
            ▼                        ▼
┌──────────────────────┐   ┌──────────────────────────────────────────┐
│  STATE: CONTRACTED   │   │  STATE: DECLINED                         │
│                      │   │                                          │
│  What happens:       │   │  • Note reason in Tab 12                 │
│  • Create contract   │   │  • Archive project                       │
│    in Tab 9          │   │  • Follow up later if appropriate        │
│  • Customer signs    │   │                                          │
│  • Deposit received  │   │  Can revise estimate and resubmit:       │
│  • Schedule job      │   │  NEW ESTIMATE → re-send → wait           │
│    in Tab 14         │   └──────────────────────────────────────────┘
└──────────┬───────────┘
           │ Work begins
           ▼
┌──────────────────────────────────────────────────────────────────────┐
│  STATE: IN PROGRESS                                                  │
│                                                                      │
│  What happens:                                                       │
│  • Daily progress notes in Tab 12                                    │
│  • Progress photos in Tab 13                                         │
│  • Track milestone dates in Tab 14                                   │
│  • If scope changes → create Change Order in Tab 10                  │
│    ↳ Change Order workflow: PENDING → customer approves → APPROVED   │
│  • Track materials delivered vs. needed                              │
└──────────┬───────────────────────────────────────────────────────────┘
           │ Work complete
           ▼
┌──────────────────────────────────────────────────────────────────────┐
│  STATE: AWAITING SIGN-OFF                                            │
│                                                                      │
│  What happens:                                                       │
│  • Inspect completed work                                            │
│  • Customer walkthrough                                              │
│  • Customer signs completion in Tab 11                               │
│  • Final invoice generated                                           │
│  • Any warranty info recorded                                        │
└──────────┬───────────────────────────────────────────────────────────┘
           │ Invoice paid
           ▼
┌──────────────────────────────────────────────────────────────────────┐
│  STATE: COMPLETE ✅                                                  │
│                                                                      │
│  What happens:                                                       │
│  • Mark project complete                                             │
│  • Final payment recorded                                            │
│  • Project appears in Reports (Tab 15)                               │
│  • Customer info saved for future jobs                               │
│  • Project archived (not deleted)                                    │
└──────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════
                    STATUS TRANSITION RULES
═══════════════════════════════════════════════════════════════════════════

  NEW ──────────────────────────────────────────► SURVEYED
  NEW ──────────────────────────────────────────► CANCELLED (no show)

  SURVEYED ─────────────────────────────────────► ESTIMATED
  SURVEYED ─────────────────────────────────────► CANCELLED

  ESTIMATED ────────────────────────────────────► CONTRACTED (accepted)
  ESTIMATED ────────────────────────────────────► DECLINED (rejected)
  ESTIMATED ────────────────────────────────────► ESTIMATED (revised)

  DECLINED ─────────────────────────────────────► ESTIMATED (new quote)

  CONTRACTED ───────────────────────────────────► IN_PROGRESS

  IN_PROGRESS ──────────────────────────────────► AWAITING_SIGNOFF
  IN_PROGRESS ──────────────────────────────────► ON_HOLD (issues)

  AWAITING_SIGNOFF ─────────────────────────────► COMPLETE
  AWAITING_SIGNOFF ─────────────────────────────► IN_PROGRESS (punch list)

  ON_HOLD ──────────────────────────────────────► IN_PROGRESS

═══════════════════════════════════════════════════════════════════════════
                    CHANGE ORDER LIFECYCLE
═══════════════════════════════════════════════════════════════════════════

  REQUESTED ────► PENDING CUSTOMER APPROVAL ────► APPROVED ────► COMPLETE
                                               └──► REJECTED

  Each change order:
  • Gets sequential number (CO-001, CO-002, etc.)
  • References parent contract
  • Has own line items and total
  • Requires customer signature when approved
  • Updates project total automatically

═══════════════════════════════════════════════════════════════════════════
```
