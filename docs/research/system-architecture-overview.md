# Fence Depot Fence Estimator — System Architecture Overview

> **Plain-English Wire-Grid Guide**
> This document shows *exactly* how every part of the system connects.
> Think of it like an electrical diagram for the software.

---

## 1. The Big Picture — Three Layers

```
╔══════════════════════════════════════════════════════════════════╗
║                        USER'S BROWSER                           ║
║                     (The Frontend / UI)                         ║
║   17 Tabs — everything you see and click on screen              ║
╚══════════════════════╦═══════════════════════════════════════════╝
                       ║  HTTP requests (asks questions / sends data)
                       ▼
╔══════════════════════════════════════════════════════════════════╗
║                       API SERVER                                ║
║                    (The Backend / Brain)                        ║
║   Node.js + Express — does the math, enforces the rules         ║
╚══════════════════════╦═══════════════════════════════════════════╝
                       ║  SQL queries (reads / writes records)
                       ▼
╔══════════════════════════════════════════════════════════════════╗
║                      DATABASE                                   ║
║                 (PostgreSQL — the memory)                       ║
║   Stores projects, estimates, inventory, users, contracts       ║
╚══════════════════════════════════════════════════════════════════╝
```

**In plain English:**
- The **browser** is what the estimator looks at and types into.
- The **server** is invisible — it processes data and returns answers.
- The **database** is the filing cabinet — nothing is lost when you close the browser.

---

## 2. All 17 Tabs — What Each One Does & Who It Talks To

```
BROWSER TABS                          SERVER ENDPOINTS           DATABASE TABLES
─────────────────────────────────────────────────────────────────────────────────

Tab 1 │ Project Info          ───►  POST /api/projects        ──► projects
      │ (customer, address,         GET  /api/projects/:id    ──► customers
      │  job type, dates)

Tab 2 │ Fence Specifications   ───►  POST /api/specs           ──► fence_specs
      │ (70+ dropdowns:             GET  /api/specs/:id        ──► fence_types
      │  type, height, color,       GET  /api/inventory        ──► inventory
      │  gauge, coating)

Tab 3 │ Fence Layout Diagram   ───►  POST /api/diagrams        ──► diagrams
      │ (drawing canvas,            GET  /api/diagrams/:id     ──► (stores SVG
      │  sections, lengths)                                         blob)

Tab 4 │ Installation           ───►  POST /api/calc/install    ──► line_items
      │ Breakdown                   (server runs math)         ──► labor_rates
      │ (post spacing, panels,
      │  gates, concrete)

Tab 5 │ Shop Drawings          ───►  POST /api/drawings/gate   ──► drawings
      │ (CAD-style gate              GET  /api/drawings/:id
      │  fabrication diagrams)

Tab 6 │ Permits                ───►  POST /api/permits         ──► permits
      │ (permit numbers,             GET  /api/permits/:id
      │  municipality, status)

Tab 7 │ Locates Sheets         ───►  POST /api/locates         ──► locates
      │ (underground utilities,      GET  /api/locates/:id
      │  call-before-dig)

Tab 8 │ Estimate / Proposal    ───►  POST /api/estimates       ──► estimates
      │ (auto-built from             GET  /api/estimates/:id   ──► estimate_lines
      │  Tabs 2 + 4,                 GET  /api/estimates/:id   ──► pricing
      │  customer-facing PDF)              /pdf

Tab 9 │ Contract               ───►  POST /api/contracts       ──► contracts
      │ (pricing lock,               GET  /api/contracts/:id   ──► (locks prices
      │  signatures,                 PUT  /api/contracts/:id        at sign time)
      │  terms & conditions)              /lock

Tab 10│ Extras & Special       ───►  POST /api/extras          ──► extras
      │ (add-ons not in              GET  /api/extras/:id
      │  standard spec)

Tab 11│ Installation           ───►  GET  /api/calc/crew       ──► crew_tasks
      │ Breakdown (Crew)             POST /api/crew/:id        ──► employees
      │ (crew assignments,
      │  hours, roles)

Tab 12│ Change Order           ───►  POST /api/changeorders    ──► change_orders
      │ (post-contract               GET  /api/changeorders    ──► (linked to
      │  changes, cost delta)             /:id                     contracts)

Tab 13│ Sign-Off               ───►  POST /api/signoff         ──► sign_offs
      │ (job completion,             GET  /api/signoff/:id     ──► (photo blobs,
      │  photos, customer                                           timestamps)
      │  signature)

Tab 14│ Notes Database         ───►  POST /api/notes           ──► notes
      │ (project notes,              GET  /api/notes           ──► (searchable
      │  searchable log)             DELETE /api/notes/:id         text)

Tab 15│ Admin Backdoor         ───►  GET  /api/admin/*         ──► users
      │ (user management,       *** PROTECTED — admin role ***──► roles
      │  pricing master,             PUT  /api/admin/pricing   ──► pricing_master
      │  SKU editor)                 POST /api/admin/users

Tab 16│ Fence Parts Catalog    ───►  GET  /api/inventory       ──► inventory
      │ (browse 950+ SKUs,           POST /api/inventory       ──► (950+ rows,
      │  prices, images)             PUT  /api/inventory/:id       dept/PLU/price)

Tab 17│ Property Mapping       ───►  GET  /api/map/:project    ──► map_pins
      │ (Google Maps overlay,        POST /api/map/:project    ──► (lat/lng,
      │  property boundary,                                         fence lines)
      │  fence line drawing)
```

---

## 3. How a New Job Flows Through the System (Step by Step)

```
ESTIMATOR OPENS BROWSER
        │
        ▼
┌───────────────────┐
│  Tab 1: Fill in   │  ──saves──►  projects table
│  customer name,   │              customers table
│  address, job #   │
└────────┬──────────┘
         │ (project ID created)
         ▼
┌───────────────────┐
│  Tab 2: Choose    │  ──saves──►  fence_specs table
│  fence type,      │  ──reads──►  inventory table (prices)
│  height, gauge,   │
│  color, coatings  │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Tab 3: Draw the  │  ──saves──►  diagrams table
│  fence layout on  │              (total footage calculated
│  the canvas       │               automatically)
└────────┬──────────┘
         │ (footage known)
         ▼
┌───────────────────┐
│  Tab 4: System    │  Server runs calculations:
│  auto-calculates  │  ┌─────────────────────────────────┐
│  all materials &  │  │ footage ÷ post spacing = posts  │
│  labor            │  │ posts × concrete bags = bags    │
└────────┬──────────┘  │ footage × panel price = panels  │
         │             │ + gates, hardware, labor hrs    │
         │             └─────────────────────────────────┘
         ▼
┌───────────────────┐
│  Tab 8: Estimate  │  ──generates──►  PDF
│  auto-populated   │  ──emails──────►  customer
│  from above tabs  │  ──saves──────►  estimates table
└────────┬──────────┘
         │ (customer approves)
         ▼
┌───────────────────┐
│  Tab 9: Contract  │  ──LOCKS prices──►  contracts table
│  pricing locked,  │  ──sends──────────►  DocuSign / PDF
│  customer signs   │
└────────┬──────────┘
         │ (job starts)
         ▼
┌───────────────────┐
│  Tab 11: Crew     │  ──assigns──►  crew_tasks table
│  schedule, hours  │  ──reads──►   employees table
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Tab 12: Change   │  ──links to──►  contracts table
│  Orders (if any)  │  ──updates──►  change_orders table
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Tab 13: Sign-Off │  ──uploads──►  sign_offs table
│  Photos, customer │              (job marked COMPLETE)
│  final signature  │
└───────────────────┘
```

---

## 4. Database Tables — How They Link Together

```
                    ┌─────────────┐
                    │  customers  │
                    │  ─────────  │
                    │  id (PK)    │
                    │  name       │
                    │  address    │
                    │  phone      │
                    │  email      │
                    └──────┬──────┘
                           │ 1 customer → many projects
                           ▼
                    ┌─────────────┐
             ┌──────│  projects   │──────────────────────────────────┐
             │      │  ─────────  │                                  │
             │      │  id (PK)    │                                  │
             │      │  customer_id│ (FK → customers)                 │
             │      │  job_number │                                  │
             │      │  status     │                                  │
             │      └──────┬──────┘                                  │
             │             │ 1 project → 1 of each below             │
             │    ┌─────────────────────────────────────────┐        │
             │    │         │         │         │           │        │
             ▼    ▼         ▼         ▼         ▼           ▼        ▼
        ┌────────┐ ┌──────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
        │fence_  │ │diagrams  │ │permits │ │locates │ │notes   │ │sign_   │
        │specs   │ │          │ │        │ │        │ │        │ │offs    │
        └────────┘ └──────────┘ └────────┘ └────────┘ └────────┘ └────────┘

             │
             │ 1 project → 1 estimate
             ▼
        ┌──────────────┐
        │  estimates   │──────► estimate_lines (one row per material)
        │              │──────► inventory (price lookups)
        └──────┬───────┘
               │ estimate approved →
               ▼
        ┌──────────────┐
        │  contracts   │──────► change_orders (post-contract changes)
        │  (price lock)│
        └──────┬───────┘
               │ job awarded →
               ▼
        ┌──────────────┐
        │  crew_tasks  │──────► employees
        └──────────────┘

        ┌──────────────┐   (used by Tab 2, Tab 4, Tab 16)
        │  inventory   │
        │  (950+ SKUs) │
        │  PLU/price/  │
        │  dept/desc   │
        └──────────────┘

        ┌──────────────┐   (used by Tab 15 Admin only)
        │  users       │──────► roles  (admin / estimator / viewer)
        │  pricing_    │
        │  master      │
        └──────────────┘
```

---

## 5. Security — Who Can See What

```
╔══════════════════════════════════════════════════════╗
║                 LOGIN / AUTHENTICATION               ║
║                                                      ║
║  Username + Password  ──►  Server checks users table ║
║                       ──►  Returns a TOKEN (JWT)     ║
║                       ──►  Browser stores token      ║
╚══════════════════════════════════════════════════════╝
                    │
         Token sent with every request
                    │
         ┌──────────▼───────────┐
         │  Role Check (Server) │
         └──────────┬───────────┘
                    │
        ┌───────────┼───────────────┐
        ▼           ▼               ▼
 ┌────────────┐ ┌──────────┐ ┌──────────────┐
 │  VIEWER    │ │ESTIMATOR │ │    ADMIN     │
 │            │ │          │ │              │
 │ Read-only  │ │ All tabs  │ │ All tabs +   │
 │ Tabs 1-13  │ │ 1–14, 16 │ │ Tab 15       │
 │            │ │          │ │ (user mgmt,  │
 │            │ │          │ │  pricing)    │
 └────────────┘ └──────────┘ └──────────────┘
```

---

## 6. Documents & Communications — Output Flow

```
 ┌────────────────────────────────────────────────────┐
 │  Things the system can PRODUCE (output)            │
 └────────────────────────────────────────────────────┘

 Tab 8 Estimate  ──generates──►  ┌─────────────────────┐
                                 │  Estimate PDF        │
                                 │  (customer copy)     │──► Email to customer
                                 └─────────────────────┘──► Print
                                                          ──► Download

 Tab 9 Contract  ──generates──►  ┌─────────────────────┐
                                 │  Contract PDF        │──► Email
                                 │  (price locked)      │──► Print / Sign
                                 └─────────────────────┘

 Tab 5 Shop      ──generates──►  ┌─────────────────────┐
 Drawings                        │  Gate CAD Drawing    │──► Email to fabricator
                                 │  (dimensions, specs) │──► Print for crew
                                 └─────────────────────┘

 Tab 6 Permits   ──generates──►  ┌─────────────────────┐
                                 │  Permit Application  │──► Submit to city/county
                                 └─────────────────────┘

 Tab 7 Locates   ──generates──►  ┌─────────────────────┐
                                 │  811 Locate Sheet    │──► Submit / print
                                 └─────────────────────┘

 Tab 12 Change   ──generates──►  ┌─────────────────────┐
 Order                           │  Change Order PDF    │──► Email / sign
                                 └─────────────────────┘

 Tab 13 Sign-Off ──generates──►  ┌─────────────────────┐
                                 │  Completion Report   │──► Customer copy
                                 └─────────────────────┘
```

---

## 7. Auto-Calculation Engine (Tab 4 — How the Math Works)

```
 INPUTS (from Tab 2 & Tab 3)
 ─────────────────────────────────────────────────────
 Total footage  ──┐
 Post spacing   ──┤
 Fence height   ──┤
 Fence type     ──┤──► CALCULATION ENGINE (server-side)
 Gate count     ──┤         │
 Gate sizes     ──┤         │  1. posts = ceil(footage / spacing) + 1
 Terrain type   ──┘         │  2. concrete = posts × bags_per_post
                             │  3. panels = footage / panel_width
                             │  4. wire/mesh = footage × height
                             │  5. hardware = sum(post caps, ties, bands)
                             │  6. labor_hrs = posts × 0.5 + panels × 0.25
                             │  7. prices looked up from inventory table
                             │
 OUTPUTS (to Tab 4 & Tab 8)  ▼
 ─────────────────────────────────────────────────────
 Line item list (qty × unit price = extended price)
 Total material cost
 Total labor cost
 Grand total
 Margin calculation
```

---

## 8. Summary — The Connection Map at a Glance

```
 [Tab 1 Project Info]
        │ creates project record
        ▼
 [Tab 2 Fence Specs] ─────────────────────────────────► [Tab 16 Parts Catalog]
        │ specs feed calculations                              (read-only SKU browser)
        ▼
 [Tab 3 Layout Diagram]
        │ footage feeds calculations
        ▼
 [Tab 4 Install Breakdown] ──────────────────────────► [Tab 11 Crew Breakdown]
        │ materials list                                       (crew assignment)
        ▼
 [Tab 8 Estimate/Proposal] ──► PDF/Email ──► Customer
        │ customer approves
        ▼
 [Tab 9 Contract] ──► Price Lock ──► PDF/Email/Sign ──► [Tab 12 Change Orders]
        │ job awarded
        ▼
 [Tab 5 Shop Drawings] ──► Gate CAD PDF ──► Fabricator/Crew
 [Tab 6 Permits]       ──► Permit App   ──► Municipality
 [Tab 7 Locates]       ──► 811 Sheet    ──► Utility company
 [Tab 10 Extras]       ──► Add-on items ──► merged into estimate
        │ job complete
        ▼
 [Tab 13 Sign-Off] ──► Completion Report ──► Customer
        │
 [Tab 14 Notes]   ──► Searchable log throughout entire job
 [Tab 15 Admin]   ──► User mgmt, pricing master (admin only)
 [Tab 17 Map]     ──► Property boundary overlay, visual reference
```

---

*This document was generated as part of the Fence Depot Fence Estimator architecture research session.*
*Last updated: 2026-08-04*
