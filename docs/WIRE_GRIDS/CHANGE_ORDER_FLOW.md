# CHANGE ORDER FLOW
## Fence Depot Fence Estimator - How Change Orders Work

```
═══════════════════════════════════════════════════════════════════════════
                    CHANGE ORDER FLOW DIAGRAM v1.0
═══════════════════════════════════════════════════════════════════════════

PURPOSE:
  Change Orders document any modifications to the original contract scope
  or price. Every change to a signed contract MUST go through a Change
  Order - this protects both the company and the customer.

═══════════════════════════════════════════════════════════════════════════

TRIGGERS: WHEN TO CREATE A CHANGE ORDER
────────────────────────────────────────

  ┌─────────────────────────────────────────────────────────────────────┐
  │  Create a Change Order when ANY of these happen:                    │
  │                                                                     │
  │  ✦ Customer requests additional fence (more linear feet)            │
  │  ✦ Customer wants to upgrade materials (e.g., heavier gauge)        │
  │  ✦ Customer adds or removes gates                                   │
  │  ✦ Unexpected site conditions (rock, utilities, slope)              │
  │  ✦ Material costs increased after contract signed                   │
  │  ✦ Scope of work was different than originally planned              │
  │  ✦ Customer asks to reduce scope (partial credit)                   │
  │  ✦ Weather delays requiring change to schedule/costs                │
  └─────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════

STEP-BY-STEP CHANGE ORDER PROCESS
───────────────────────────────────

STEP 1: IDENTIFY THE CHANGE
┌─────────────────────────────────────────────────────────────────────────┐
│  • Something has changed from original contract scope                  │
│  • Note what changed and why                                            │
│  • Estimate cost of the change (add or subtract from contract)          │
└─────────────────────────────────────────┬───────────────────────────────┘
                                          │
                                          ▼
STEP 2: CREATE CHANGE ORDER IN TAB 10
┌─────────────────────────────────────────────────────────────────────────┐
│  Click [+ NEW CHANGE ORDER] button                                      │
│                                                                         │
│  Auto-populated fields:                                                 │
│  • CO Number: CO-001 (auto-sequential)                                  │
│  • Project Name and Number                                              │
│  • Original Contract Number                                             │
│  • Original Contract Total: $XX,XXX.XX                                  │
│                                                                         │
│  Estimator fills in:                                                    │
│  • Description of Change: ______________________________________        │
│  • Reason for Change:     ______________________________________        │
│  • Change Type:           [Additional Work ▼] / [Credit ▼]             │
│                                                                         │
│  Line items for the change:                                             │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ DESCRIPTION          QTY   UNIT   UNIT COST   TOTAL            │   │
│  │ Add 25 LF fence       1    LS     $850.00     $850.00          │   │
│  │ 1 additional gate     1    Each   $350.00     $350.00          │   │
│  │ Extra concrete (10)  10    Bag    $  8.00     $ 80.00          │   │
│  │                                  CO TOTAL:   $1,280.00        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
STEP 3: PRESENT TO CUSTOMER
┌─────────────────────────────────────────────────────────────────────────┐
│  Print Change Order PDF showing:                                        │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  FENCE DEPOT - CHANGE ORDER                                     │   │
│  │  CO Number: CO-001                    Date: __________          │   │
│  │  Project: John Smith Residence        Contract: C-2026-0015     │   │
│  │                                                                 │   │
│  │  Description: Add 25 LF fence along east property line          │   │
│  │               including 1 additional gate                       │   │
│  │                                                                 │   │
│  │  Line Items:                                                    │   │
│  │  • Additional fence and materials.............. $850.00         │   │
│  │  • New gate and hardware...................... $350.00           │   │
│  │  • Additional concrete........................  $80.00           │   │
│  │                                                                 │   │
│  │  CHANGE ORDER TOTAL:          +$1,280.00                        │   │
│  │                                                                 │   │
│  │  Original Contract Total:     $6,158.46                         │   │
│  │  This Change Order:           +$1,280.00                        │   │
│  │  NEW CONTRACT TOTAL:          $7,438.46                         │   │
│  │                                                                 │   │
│  │  Customer Signature: _______________  Date: _________           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                          │
                         ┌────────────────┴────────────────┐
                         │                                 │
                  Customer APPROVES                  Customer DECLINES
                         │                                 │
                         ▼                                 ▼
STEP 4A: APPROVED                            STEP 4B: DECLINED
┌───────────────────────────────┐            ┌──────────────────────────────┐
│  • Mark CO status: APPROVED   │            │  • Mark CO status: DECLINED  │
│  • Enter approval date        │            │  • Note reason               │
│  • Capture customer signature │            │  • Archive the CO            │
│  • Project total auto-updates │            │  • Continue with original    │
│  • New contract total shown   │            │    contract scope            │
└───────────────────────────────┘            └──────────────────────────────┘
         │
         ▼
STEP 5: EXECUTE THE CHANGE
┌─────────────────────────────────────────────────────────────────────────┐
│  • Complete the additional work                                         │
│  • Add notes in Tab 12 about change order work progress                 │
│  • Add photos in Tab 13 of additional work                              │
│  • Mark CO status: COMPLETE when done                                   │
└─────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════
                    CHANGE ORDER STATUS FLOW
═══════════════════════════════════════════════════════════════════════════

  DRAFT ──► PENDING ──► APPROVED ──► COMPLETE
                    └──► DECLINED

  DRAFT:    Being created, not yet presented to customer
  PENDING:  Presented to customer, awaiting decision
  APPROVED: Customer signed, work authorized to proceed
  COMPLETE: Additional work finished
  DECLINED: Customer rejected, no work done

═══════════════════════════════════════════════════════════════════════════
                    FINANCIAL IMPACT
═══════════════════════════════════════════════════════════════════════════

  Original Contract:    $6,158.46
  CO-001 (approved):   +$1,280.00
  CO-002 (approved):   -$  150.00  (credit - item removed)
  CO-003 (pending):    +$  450.00  (not yet approved - not counted)
                       ──────────
  Current Total:        $7,288.46
  Pending (if approved): $7,738.46

  NOTE: Only APPROVED change orders affect the contract total.
        PENDING change orders show separately until approved.

═══════════════════════════════════════════════════════════════════════════
```
