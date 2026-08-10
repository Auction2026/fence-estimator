# WIRE GRID 5 – TAB DEPENDENCY MAP
## Which Tabs Must Be Completed Before Others

---

```
╔══════════════════════════════════════════════════════════════════╗
║           FENCE ESTIMATOR – TAB DEPENDENCY MAP                  ║
╚══════════════════════════════════════════════════════════════════╝

LEGEND:
  ──►  Must complete before next tab works correctly
  ···►  Optional / Can be done any time
  🔒   Locks downstream tabs


TAB DEPENDENCY CHAIN:
════════════════════

  TAB 1        TAB 2        TAB 3        TAB 4
  Project  ──► Fence    ──► Layout   ──► Materials
  Info         Specs        Footage      Calculate

  (Customer     (Fence        (Total        (Uses data
  name &        type &        linear        from Tabs
  address)      height)       footage)      2 & 3 to
                                            calculate)
     │
     │ TAB 5 & 6 can be filled independently
     ▼
  TAB 5        TAB 6
  Labor    ──► Equipment
  (crew,        (rentals)
  hours,
  rate)

     │
     │ All three cost tabs must be done before Tab 7
     ▼
  TAB 4 ──┐
  TAB 5 ──┼──► TAB 7: Estimate Summary (combines all costs)
  TAB 6 ──┘

     │
     ▼
  TAB 7 ──► TAB 8: Contract Lock 🔒 ──► TAB 9: Change Orders
              (must build            (requires locked
               estimate first)        contract)

     │
     ▼
  TAB 8 ──► TAB 10: Invoicing  (needs contract price)
  TAB 8 ──► TAB 11: Scheduling (needs project dates)
  TAB 8 ──► TAB 12: Crew       (needs scheduled dates)
  TAB 8 ──► TAB 13: Supplier   (needs materials list)

     │
     ▼
  TAB 14: Tracking (can be updated throughout project)

     │
     ▼
  TAB 14 ──► TAB 15: Sign-Off (needs progress = 100%)

     │
     ▼
  TAB 15 ──► TAB 16: Reports  (final reports)
  TAB 1-3 ──► TAB 17: Mapping (needs address)


══════════════════════════════════════════════════════════════════
                   TAB DEPENDENCY TABLE
══════════════════════════════════════════════════════════════════

  Tab  │ Name              │ Requires These Tabs First
  ─────┼───────────────────┼────────────────────────────────────
   1   │ Project Info      │ Nothing (START HERE)
   2   │ Fence Specs       │ Tab 1 (customer info)
   3   │ Layout            │ Tab 1, Tab 2
   4   │ Materials         │ Tab 2 (fence type), Tab 3 (footage)
   5   │ Labor             │ Nothing required (but Tab 1 helpful)
   6   │ Equipment         │ Nothing required
   7   │ Estimate Summary  │ Tab 4, Tab 5, Tab 6
   8   │ Contract          │ Tab 7 (must build estimate first)
   9   │ Change Orders     │ Tab 8 (must lock contract first)
  10   │ Invoicing         │ Tab 7 (needs total price)
  11   │ Scheduling        │ Tab 8 (needs contract dates)
  12   │ Crew Mgmt         │ Tab 11 (needs schedule)
  13   │ Supplier Orders   │ Tab 4 (needs materials list)
  14   │ Project Tracking  │ Tab 8 (project must be active)
  15   │ Sign-Off          │ Tab 14 (project must be in progress)
  16   │ Reports           │ Any tab (reports available any time)
  17   │ Mapping           │ Tab 1 (needs address)


══════════════════════════════════════════════════════════════════
         PARALLEL TRACKS (Can Be Done Simultaneously)
══════════════════════════════════════════════════════════════════

  TRACK A: ESTIMATION
  Tab 1 → Tab 2 → Tab 3 → Tab 4 → Tab 5 → Tab 6 → Tab 7 → Tab 8

  TRACK B: OPERATIONS (After contract locked)
  Tab 11 (Schedule) ─┬─► Tab 12 (Crew)
                     └─► Tab 13 (Supplier PO)

  TRACK C: FINANCIAL
  Tab 8 (Contract) → Tab 10 (Invoices) → Tab 15 (Final payment)

  TRACK D: FIELD
  Tab 14 (Daily tracking) → Tab 15 (Sign-off)

  TRACK E: REFERENCE (Any time)
  Tab 16 (Reports)
  Tab 17 (Mapping)
```

---

## 📖 QUICK START ORDER (Fastest Path to a Complete Estimate)

```
For a quick estimate (no backend):
  1 → 2 → 3 → 4 (click Calculate) → 5 → 7 (click Build Estimate)
  → Print → Done in 5 minutes

For a full project with contract:
  1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 (lock) → 9 if needed
  → 10 → 11 → 12 → 13 → 14 → 15 → 16
  Complete project lifecycle
```
