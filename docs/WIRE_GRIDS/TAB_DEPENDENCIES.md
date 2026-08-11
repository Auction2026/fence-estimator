# TAB DEPENDENCIES
## Fence Depot Fence Estimator - Which Tabs Require Data from Other Tabs

```
═══════════════════════════════════════════════════════════════════════════
                      TAB DEPENDENCIES DIAGRAM v1.0
═══════════════════════════════════════════════════════════════════════════

LEGEND:
  ──────► REQUIRED: Tab X must be completed before Tab Y works fully
  - - - ► OPTIONAL: Tab X data improves Tab Y but is not required
  ═══════► FEEDS DATA: Tab X automatically populates Tab Y

                    ┌────────────────────────────────┐
                    │    TAB 1: PROJECT INFORMATION   │
                    │  ★ MUST COMPLETE FIRST ★        │
                    │  Creates Project ID             │
                    └────────────┬───────────────────┘
                                 │ Project ID required by ALL other tabs
                    ┌────────────▼──────────────────────────────────────┐
                    │           ALL OTHER TABS (2-17)                   │
                    │    Need active project to save data               │
                    └───────────────────────────────────────────────────┘

Tab Dependency Tree:

TAB 1: Project Info
│
├──────────────────► TAB 2: Site Survey
│                   (standalone - no deps on other tabs)
│
├──────────────────► TAB 3: Fence Specifications
│                   (standalone - enter fence details)
│                            │
│                            │ Specs feed into ▼
│                            ▼
├──────────────────► TAB 4: Materials
│                   REQUIRES: Tab 3 specs to calculate quantities
│                   REQUIRES: Tab 16 inventory prices to calculate costs
│                   READS: fence type, height, gauge, linear feet, gates
│                            │
│                            │ Materials total feeds into ▼
│                            ▼
├──────────────────► TAB 5: Labor
│                   READS: linear feet from Tab 3 (for estimate)
│                   Crew hours × rate = labor total
│                            │
│                            ▼
├──────────────────► TAB 6: Equipment
│                   (standalone - manual entry)
│                            │
│                            ▼
├──────────────────► TAB 7: Pricing
│                   REQUIRES: Tab 4 materials total
│                   REQUIRES: Tab 5 labor total
│                   REQUIRES: Tab 6 equipment total
│                   Calculates: markup, overhead, tax
│                            │
│                            │ All pricing feeds into ▼
│                            ▼
├──────────────────► TAB 8: Estimate Summary
│                   REQUIRES: Tabs 4, 5, 6, 7 data
│                   Shows complete estimate breakdown
│                   Allows save/print/email
│                            │
│                            │ Approved estimate feeds into ▼
│                            ▼
├──────────────────► TAB 9: Contract
│                   REQUIRES: Tab 8 approved estimate
│                   Auto-populates from project + estimate data
│                            │
│                            ▼
├──────────────────► TAB 10: Change Orders
│                   REQUIRES: Tab 9 signed contract
│                   Each CO references parent contract
│                            │
│                            ▼
├──────────────────► TAB 11: Sign-Off
│                   REQUIRES: All work complete
│                   READS: Contract data from Tab 9
│                   READS: Change orders from Tab 10
│                            │
│                            ▼
│                   PROJECT COMPLETE ✅
│
├──────────────────► TAB 12: Notes
│                   (available any time after Tab 1)
│
├──────────────────► TAB 13: Photos
│                   (available any time after Tab 1)
│
├──────────────────► TAB 14: Schedule
│                   (available any time after Tab 1)
│
├──────────────────► TAB 15: Reports
│                   READS data from: all tabs 1-11
│                   (view-only, no data entry)
│
├──────────────────► TAB 16: Inventory
│                   (standalone - manage product catalog)
│                   FEEDS DATA ══════════════════► Tab 4 Materials
│
└──────────────────► TAB 17: Map
                    (standalone - view/mark site location)
                    READS: address from Tab 1

═══════════════════════════════════════════════════════════════════════════
                    REQUIRED TAB SEQUENCE (Minimum Path)
═══════════════════════════════════════════════════════════════════════════

  For a complete estimate you MUST do these in order:

  ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐   ┌──────┐
  │ Tab 1│──►│ Tab 3│──►│ Tab 4│──►│ Tab 5│──►│ Tab 7│──►│ Tab 8│
  │Proj  │   │Specs │   │Mats  │   │Labor │   │Price │   │Summ  │
  └──────┘   └──────┘   └──────┘   └──────┘   └──────┘   └──────┘

  For a complete job lifecycle you then do:

  ┌──────┐   ┌───────┐   ┌────────┐   ┌────────┐
  │ Tab 8│──►│ Tab 9 │──►│ Tab 11 │──►│Complete│
  │Estim │   │Contr  │   │Sign-off│   │   ✅   │
  └──────┘   └───────┘   └────────┘   └────────┘

═══════════════════════════════════════════════════════════════════════════
                    DATA SHARED BETWEEN TABS
═══════════════════════════════════════════════════════════════════════════

  SHARED PROJECT DATA (stored in MongoDB, read by all tabs):
  ┌────────────────────────────────────────────────────────────────┐
  │  projectId      - Unique identifier for this job               │
  │  customerId     - Links to customer record                     │
  │  projectStatus  - Current lifecycle status                     │
  └────────────────────────────────────────────────────────────────┘

  LOCAL STATE (stored in browser localStorage, lost on close):
  ┌────────────────────────────────────────────────────────────────┐
  │  activeProjectId   - Which project is currently open           │
  │  activeTab         - Which tab the user is on                  │
  │  formDraft         - Unsaved form data (auto-save)             │
  │  authToken         - Login token                               │
  └────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════
```
