# DATA FLOW DIAGRAM
## Fence Depot Estimator — How Data Moves Through the System

```
═══════════════════════════════════════════════════════════════
                    ESTIMATE CREATION DATA FLOW
═══════════════════════════════════════════════════════════════

  USER INPUT                  PROCESSING              OUTPUT
  ─────────                   ──────────              ──────

  [Customer Info]
  First/Last Name    ────────► customers table ──────► Customer Record (UUID)
  Phone/Email                  (INSERT)
  Address

       │
       ▼

  [Project Setup]
  Project Name       ────────► projects table  ──────► Project #
  Site Address                 (INSERT)                FE-2026-00001
  Notes

       │
       ▼

  [Fence Specs]
  Fence Type         ────────► fence_specs     ──────► Spec Record
  Height (ft)                  (INSERT)
  Linear Footage
  Gate Count

       │
       ▼

  [Material Calculator]
  Linear Footage     ────────► INVENTORY_DB    ──────► Line Items
  Fence Type                   (lookup)                • Fabric rolls
  Height                       ↓                       • Posts (qty)
  Options                 calculateMaterials()          • Rails (qty)
                               ↓                       • Concrete (bags)
                          priceLineItems()              • Hardware
                               ↓                       • Labor

       │
       ▼

  [Estimate Build]
  Line Items         ────────► estimates table ──────► Estimate #
  Quantities                   (INSERT)                FE-EST-2026-001
  Prices             ────────► estimate_line_items     Subtotal
  Tax Rate                     (INSERT × N)            Tax
  Markup %                                             Total

       │
       ▼

  [Output Options]

  ┌──────────────────────────────────────────────────────────┐
  │  PRINT / PDF  ─────────────────────► PDF file           │
  │  EMAIL        ─────────────────────► Customer inbox     │
  │  LOCK PRICE   ─────────────────────► price_locked=true  │
  │  CONVERT      ─────────────────────► Contract created   │
  └──────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════
                    AUTHENTICATION DATA FLOW
═══════════════════════════════════════════════════════════════

  Browser                     Server                  Database
  ───────                     ──────                  ────────

  [Login Form]
  email + password ─── POST /api/auth/login ──────► users table
                                                     WHERE email=?
                                                     ↓
                                               bcrypt.compare()
                                                     ↓
                                              ┌──────────────┐
                                              │  VALID?      │
                                              │  YES → JWT   │
                                              │  NO  → 401   │
                                              └──────────────┘
                                                     ↓
  [Token stored] ◄── JWT token (1hr expiry) ─────────┘
  in httpOnly cookie

  [API Request]
  Authorization:      ─── Middleware ──────────────► Verify JWT
  ******           validates                  ↓
                           token                 req.user = decoded
                                                     ↓
                                              Route handler runs


═══════════════════════════════════════════════════════════════
                    INVENTORY LOOKUP DATA FLOW
═══════════════════════════════════════════════════════════════

  User selects:               Calculation Engine       Result
  ─────────────               ──────────────────       ──────

  Fence Type: Chain Link
  Height: 6ft             ───► findFabric(type, ht) ──► Fabric roll(s)
  Linear Ft: 200ft             ↓
                          ───► calcPosts(ft, spacing)──► Post qty + size
                               ↓
                          ───► calcRail(ft) ──────────► Top rail qty
                               ↓
                          ───► calcConcrete(posts) ───► Bags needed
                               ↓
                          ───► calcHardware(ft) ────►  Fittings qty
                               ↓
                          ───► calcLabor(ft, type) ──► Labor hours/LF
                               ↓
                          ───► applyMarkup(cost) ───►  Customer price
                               ↓
                          ───► buildLineItems() ────►  Estimate table
```
