# USER WORKFLOW
## Fence Depot Fence Estimator - Complete User Journey

```
═══════════════════════════════════════════════════════════════════════════
                       USER WORKFLOW DIAGRAM v1.0
                    From First Visit to Signed Contract
═══════════════════════════════════════════════════════════════════════════

START
  │
  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         FIRST TIME SETUP                                │
│                                                                         │
│  1. Open browser → go to app URL                                        │
│  2. Click "Register" → create account (name, email, password, company)  │
│  3. Login with new credentials                                          │
│  4. Main dashboard appears with 17 tabs                                 │
└─────────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  TAB 1: PROJECT INFORMATION                          [REQUIRED FIRST]   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Customer Name: ____________________  Phone: ___________________ │   │
│  │ Email: ___________________________  Alt Phone: _______________ │   │
│  │ Project Address: _____________________________________________  │   │
│  │ City: ___________  State: ____  Zip: ______                    │   │
│  │ Project Name: ___________________  Date: ________________      │   │
│  │                                                                 │   │
│  │ [SAVE PROJECT]  ← Creates project record, assigns Project ID   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
  │ Project saved → Project ID assigned
  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  TAB 2: SITE SURVEY                                  [FIELD VISIT]      │
│                                                                         │
│  Record findings from the job site visit:                               │
│  - Property dimensions                                                  │
│  - Terrain type (flat/slope/rocky)                                      │
│  - Soil conditions                                                      │
│  - Access limitations                                                   │
│  - Existing fence to remove?                                            │
│  - Underground utilities marked?                                        │
└─────────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  TAB 3: FENCE SPECIFICATIONS                         [CORE DATA]        │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ Fence Type: [Chain Link ▼]   Height: [6 ft ▼]                  │   │
│  │ Gauge: [11.5 ▼]  Coating: [Galvanized ▼]  Color: [Silver ▼]   │   │
│  │ Linear Feet: ________                                           │   │
│  │ Number of Gates: ____  Gate Sizes: _______                      │   │
│  │ Terrain: [Flat ▼]  Special Notes: _______                      │   │
│  │                                                                 │   │
│  │ [SAVE SPECS] → Used for material calculations                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
  │ Specs saved
  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  TAB 4: MATERIALS                                    [AUTO-CALCULATED]  │
│                                                                         │
│  Click [CALCULATE MATERIALS] button:                                    │
│  - System pulls specs from Tab 3                                        │
│  - Pulls prices from inventory database                                 │
│  - Calculates exact quantities needed                                   │
│  - Builds materials list table                                          │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ ITEM              QTY   UNIT   UNIT COST   TOTAL               │   │
│  │ 6ft Chain Link    4     Roll   $85.00      $340.00             │   │
│  │ Line Post 6ft     21    Each   $18.50      $388.50             │   │
│  │ Terminal Post     6     Each   $28.00      $168.00             │   │
│  │ Top Rail 21ft     10    Each   $24.00      $240.00             │   │
│  │ ...               ...   ...    ...         ...                 │   │
│  │                              MATERIALS TOTAL: $X,XXX.XX       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  TAB 5: LABOR                                        [MANUAL ENTRY]     │
│                                                                         │
│  Enter crew information and hours:                                      │
│  - Number of crew members                                               │
│  - Hours to complete (estimated)                                        │
│  - Hourly rate per person                                               │
│  - Special labor items (demo, hauling, etc.)                            │
│  - LABOR TOTAL auto-calculated                                          │
└─────────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  TAB 6: EQUIPMENT                                    [OPTIONAL]         │
│                                                                         │
│  Add equipment costs if needed:                                         │
│  - Post hole digger rental                                              │
│  - Truck/trailer use                                                    │
│  - Special tools                                                        │
└─────────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  TAB 7: PRICING                                      [REVIEW & ADJUST]  │
│                                                                         │
│  Review and adjust pricing:                                             │
│  - Apply markup percentage                                              │
│  - Add overhead percentage                                              │
│  - Apply discounts if any                                               │
│  - Set tax rate for this job                                            │
│  - LOCK pricing when ready (prevents accidental changes)                │
└─────────────────────────────────────────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  TAB 8: ESTIMATE SUMMARY                             [REVIEW & SEND]    │
│                                                                         │
│  Full estimate breakdown:                                               │
│  Materials:  $X,XXX.XX                                                  │
│  Labor:      $X,XXX.XX                                                  │
│  Equipment:  $XXX.XX                                                    │
│  Subtotal:   $X,XXX.XX                                                  │
│  Tax (X%):   $XXX.XX                                                    │
│  ─────────────────────                                                  │
│  TOTAL:      $XX,XXX.XX                                                 │
│                                                                         │
│  [SAVE ESTIMATE]  [PRINT ESTIMATE]  [EMAIL TO CUSTOMER]                 │
└─────────────────────────────────────────────────────────────────────────┘
  │ Customer approves
  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  TAB 9: CONTRACT                                     [LEGAL DOCUMENT]   │
│                                                                         │
│  - Contract auto-populates from estimate data                           │
│  - Edit terms and payment schedule                                      │
│  - Set start date and completion date                                   │
│  - [GENERATE CONTRACT PDF]                                              │
│  - Print and get customer signature                                     │
└─────────────────────────────────────────────────────────────────────────┘
  │ Project begins
  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  DURING CONSTRUCTION                                                    │
│                                                                         │
│  TAB 10: CHANGE ORDERS - Add any changes to scope/price                 │
│  TAB 12: NOTES - Record daily notes, issues, communications             │
│  TAB 13: PHOTOS - Upload progress and completion photos                 │
│  TAB 14: SCHEDULE - Track milestones and completion dates               │
└─────────────────────────────────────────────────────────────────────────┘
  │ Work complete
  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  TAB 11: SIGN-OFF                                    [FINAL STEP]       │
│                                                                         │
│  - Customer reviews completed work                                      │
│  - Customer signs on screen (or prints and signs)                       │
│  - Record completion date                                               │
│  - Mark project COMPLETE                                                │
│  - Generate final invoice                                               │
└─────────────────────────────────────────────────────────────────────────┘
  │
  ▼
PROJECT COMPLETE ✅
  │
  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  TAB 15: REPORTS                                     [BUSINESS DATA]    │
│                                                                         │
│  - View all completed projects                                          │
│  - Revenue by month/year                                                │
│  - Materials used summary                                               │
│  - Export to Excel/CSV for accounting                                   │
└─────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════
                    WORKFLOW STATUS CODES
═══════════════════════════════════════════════════════════════════════════

Project Status:  NEW → SURVEYED → ESTIMATED → CONTRACTED → IN_PROGRESS → COMPLETE
Estimate Status: DRAFT → SENT → ACCEPTED → DECLINED
Contract Status: DRAFT → SENT → SIGNED → ACTIVE → COMPLETED
Change Order:    PENDING → APPROVED → REJECTED

═══════════════════════════════════════════════════════════════════════════
```
