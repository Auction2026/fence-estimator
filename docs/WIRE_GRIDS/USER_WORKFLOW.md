# USER WORKFLOW
## Fence Depot Estimator — Complete User Journey Maps

```
═══════════════════════════════════════════════════════════════
                    ESTIMATOR WORKFLOW
═══════════════════════════════════════════════════════════════

  ┌─────────────┐
  │  Open App   │
  │ index.html  │
  └──────┬──────┘
         │
         ▼
  ┌─────────────────┐       ┌─────────────────────────────────┐
  │  Login Screen   │──────►│  Dashboard Tab                  │
  │  (or Demo Mode) │       │  • Recent estimates             │
  └─────────────────┘       │  • Open projects count          │
                            │  • Quick stats                  │
                            └────────────┬────────────────────┘
                                         │
              ┌──────────────────────────┼──────────────────────────┐
              │                          │                          │
              ▼                          ▼                          ▼
  ┌───────────────────┐    ┌─────────────────────┐    ┌────────────────────┐
  │  New Estimate Tab │    │  Projects Tab        │    │  Inventory Tab     │
  │                   │    │  • List all projects │    │  • Search 950+ SKU │
  │  STEP 1           │    │  • Filter by status  │    │  • View pricing    │
  │  Customer Info    │    │  • Click to open     │    │  • Check stock     │
  │  ─────────────    │    └─────────────────────┘    └────────────────────┘
  │  • First/Last     │
  │  • Phone/Email    │
  │  • Site address   │
  │                   │
  │  STEP 2           │
  │  Fence Type       │
  │  ─────────────    │
  │  • Chain Link     │
  │  • Wood           │
  │  • Vinyl          │
  │  • Aluminum       │
  │  • Wrought Iron   │
  │                   │
  │  STEP 3           │
  │  Specifications   │
  │  ─────────────    │
  │  • Height (ft)    │
  │  • Linear footage │
  │  • Gate count     │
  │  • Options        │
  │    (barbed wire,  │
  │     privacy slats,│
  │     top rail)     │
  │                   │
  │  STEP 4           │
  │  Auto-Calculate   │◄──── INVENTORY_DB lookup
  │  ─────────────    │      calculateMaterials()
  │  • Materials list │      priceLineItems()
  │  • Labor costs    │
  │  • Tax + markup   │
  │  • TOTAL          │
  │                   │
  │  STEP 5           │
  │  Review & Send    │
  │  ─────────────    │
  │  • Review lines   │──────► LOCK PRICE ──────► Contract
  │  • Edit if needed │
  │  • Generate PDF   │──────► Download PDF
  │  • Email customer │──────► SMTP → Inbox
  │  • Save draft     │──────► DB storage
  └───────────────────┘


═══════════════════════════════════════════════════════════════
                    CONTRACT → COMPLETION WORKFLOW
═══════════════════════════════════════════════════════════════

  [ESTIMATE ACCEPTED]
         │
         ▼
  ┌──────────────────────────────────────────────────────────┐
  │  CONTRACT TAB                                            │
  │  • Generate contract from locked estimate               │
  │  • Customer signs (digital signature)                   │
  │  • Collect deposit                                      │
  │  • Set start date                                       │
  └─────────────────────┬────────────────────────────────────┘
                        │
                        ▼
  ┌──────────────────────────────────────────────────────────┐
  │  PERMITS TAB                                             │
  │  • File permit application                              │
  │  • Track permit status                                  │
  │  • Call 811 (utility locates)                          │
  └─────────────────────┬────────────────────────────────────┘
                        │
                        ▼
  ┌──────────────────────────────────────────────────────────┐
  │  CREW TAB                                                │
  │  • Assign crew members                                  │
  │  • Set start date                                       │
  │  • Track hours                                          │
  └─────────────────────┬────────────────────────────────────┘
                        │
                        ▼
  ┌──────────────────────────────────────────────────────────┐
  │  CHANGE ORDERS (if needed)                               │
  │  • Customer requests changes                            │
  │  • Estimator prices change                              │
  │  • Customer approves new price                          │
  │  • Contract total updated                               │
  └─────────────────────┬────────────────────────────────────┘
                        │
                        ▼
  ┌──────────────────────────────────────────────────────────┐
  │  SIGN-OFF TAB                                            │
  │  • Job complete                                         │
  │  • Customer walks site                                  │
  │  • Final sign-off captured                              │
  │  • Photos uploaded                                      │
  │  • Project marked COMPLETE                              │
  └──────────────────────────────────────────────────────────┘
```
