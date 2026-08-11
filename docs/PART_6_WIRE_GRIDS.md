# PART 6: WIRE GRIDS — SYSTEM ARCHITECTURE & FLOW DIAGRAMS
## Fence Depot Estimator — 10 Complete Diagrams

> All diagrams use Mermaid syntax. Render with any Mermaid-compatible viewer,
> GitHub (renders natively), VS Code Mermaid Preview extension, or https://mermaid.live

---

## DIAGRAM 1 — SYSTEM ARCHITECTURE OVERVIEW

```mermaid
graph TB
    subgraph CLIENT["🖥️ CLIENT BROWSER"]
        UI["index.html\nSingle Page App (SPA)"]
    end

    subgraph NGINX["⚙️ NGINX REVERSE PROXY\n(SSL Termination + Static Files)"]
        NG["Nginx :443\nSSL + Load Balancer"]
    end

    subgraph BACKEND["🔧 BACKEND (Node.js / Express)"]
        API["Express API Server\nPort 5000"]
        AUTH["Auth Middleware\n(JWT)"]
        PDF["PDF Generator\n(PDFKit)"]
        EMAIL["Email Service\n(Nodemailer)"]
        MAP["Maps Integration\n(Google Maps API)"]
    end

    subgraph DATABASE["🗄️ DATABASE (PostgreSQL 15)"]
        PG["PostgreSQL\nPort 5432"]
        subgraph TABLES["Tables (9)"]
            T1["users"]
            T2["projects"]
            T3["fence_specifications"]
            T4["product_categories"]
            T5["products (950+)"]
            T6["estimates"]
            T7["estimate_line_items"]
            T8["change_orders"]
            T9["audit_log"]
        end
    end

    subgraph EXTERNAL["🌐 EXTERNAL SERVICES"]
        GMAIL["Gmail SMTP\nEmail Delivery"]
        GMAPS["Google Maps API\nGeocoding + Satellite"]
        STRIPE["Stripe API\nPayments (optional)"]
    end

    UI -->|"HTTPS :443"| NG
    NG -->|"Static files"| UI
    NG -->|"API Proxy /api/"| API
    API --> AUTH
    AUTH --> PG
    API --> PDF
    API --> EMAIL
    API --> MAP
    PDF -->|"Estimate PDF"| UI
    EMAIL --> GMAIL
    MAP --> GMAPS
    API --> STRIPE
    PG --- TABLES
```

---

## DIAGRAM 2 — DATA FLOW OVERVIEW

```mermaid
flowchart LR
    A["👤 User Opens App"] --> B["Landing Page"]
    B --> C["Login Screen"]
    C -->|"Username + Password"| D["POST /api/auth/login"]
    D -->|"JWT Token"| E["Dashboard"]

    E --> F1["📋 New Estimate Tab"]
    E --> F2["📂 Projects Tab"]
    E --> F3["📦 Inventory Tab"]
    E --> F4["💰 Materials & Costs Tab"]
    E --> F5["🏭 Suppliers Tab"]
    E --> F6["📊 Analytics Tab"]
    E --> F7["⚙️ Settings Tab"]

    F1 -->|"5-Step Wizard"| G["Create Estimate"]
    G -->|"POST /api/estimates"| H[("PostgreSQL\nestimate record")]

    H -->|"Generate PDF"| I["📄 PDF Estimate"]
    H -->|"Send Email"| J["📧 Customer Email"]
    H -->|"Lock Estimate"| K["🔒 Locked Estimate"]

    F2 -->|"GET /api/projects"| L["Projects List"]
    F3 -->|"GET /api/products"| M["950+ Products"]
    F6 -->|"GET /api/analytics"| N["Revenue Reports"]
```

---

## DIAGRAM 3 — USER WORKFLOW (FULL ESTIMATE LIFECYCLE)

```mermaid
stateDiagram-v2
    [*] --> Landing : Open App
    Landing --> Login : Click Login
    Login --> Dashboard : Auth Success

    Dashboard --> NewProject : + New Project
    NewProject --> CustomerInfo : Fill Customer Details
    CustomerInfo --> SiteDetails : Step 1 Complete
    SiteDetails --> FenceSpecs : Step 2 Complete
    FenceSpecs --> MaterialCalc : Step 3 Complete
    MaterialCalc --> PriceReview : Step 4 Complete
    PriceReview --> EstimateDraft : Step 5 - Generate

    EstimateDraft --> EstimateSent : Send to Customer
    EstimateSent --> EstimateApproved : Customer Approves
    EstimateSent --> EstimateRejected : Customer Rejects
    EstimateApproved --> ContractSigned : Contract Created
    ContractSigned --> ProjectActive : Work Begins
    ProjectActive --> ChangeOrder : Change Requested
    ChangeOrder --> ProjectActive : CO Approved
    ProjectActive --> ProjectCompleted : Work Done
    ProjectCompleted --> [*]

    EstimateRejected --> EstimateDraft : Revise Estimate
    EstimateApproved --> LockedEstimate : Lock Prices
```

---

## DIAGRAM 4 — PROJECT LIFECYCLE

```mermaid
flowchart TD
    A[("🆕 Project Created\nStatus: DRAFT")] --> B["Fill Customer Details\n- Name, Phone, Email\n- Address, Province, Postal"]
    B --> C["Add Fence Specifications\n- Type, Height, Color\n- Linear Feet, Gates\n- Installation Type"]
    C --> D["Calculate Materials\n- Auto: posts, fabric, rail\n- Manual: adjust quantities\n- Apply 10-15% waste"]
    D --> E["Set Pricing\n- Material cost\n- Labour hours × rate\n- Tax 13% HST\n- Profit margin 35%"]
    E --> F[("📄 Estimate Generated\nStatus: ESTIMATE\nest_number: EST-YYYY-#####")]

    F -->|"Email to customer"| G["📧 Sent to Customer\nStatus: SENT"]
    G -->|"Customer says YES"| H[("✅ Approved\nStatus: APPROVED")]
    G -->|"Customer says NO"| I["❌ Rejected\nRevise or close"]
    G -->|"30 days pass"| J["⏰ Expired\nMust reissue"]

    H -->|"Lock prices"| K["🔒 Estimate Locked\nis_locked = TRUE"]
    K --> L[("📑 Contract Active\nStatus: CONTRACT")]
    L -->|"Work starts"| M[("🔨 Project Active\nStatus: ACTIVE")]
    M -->|"Change requested"| N["Change Order\nCO-YYYY-#####\nStatus: PENDING"]
    N -->|"Approved"| O["CO Status: APPROVED\nEstimate Total Updated"]
    O --> M
    N -->|"Rejected"| M
    M -->|"Work complete"| P[("✅ Project Completed\nStatus: COMPLETED")]
    I --> Q["Archive or Restart"]
```

---

## DIAGRAM 5 — TAB DEPENDENCIES & NAVIGATION

```mermaid
graph LR
    subgraph TABS["App Tabs (index.html)"]
        T1["🏠 Dashboard\n- Live stats\n- Recent activity\n- Quick actions"]
        T2["📋 New Estimate\n- 5-step wizard\n- Customer info\n- Fence specs\n- Materials calc\n- Price review"]
        T3["📂 Projects\n- All projects list\n- Search/filter\n- Project details\n- Status update"]
        T4["📦 Inventory\n- 950+ products\n- Filter by type\n- Price lookup\n- Stock status"]
        T5["💰 Materials & Costs\n- Material breakdown\n- Labour rates\n- Margin calc\n- CSA compliance"]
        T6["🏭 Suppliers\n- Master Halco\n- Homeland Vinyl\n- Cloutier Direct\n- Canadian Fence"]
        T7["📊 Analytics\n- Revenue reports\n- Job type breakdown\n- Monthly trends\n- Top customers"]
        T8["⚙️ Settings\n- Labour rates\n- Tax rates\n- User management\n- Company info"]
    end

    T1 -->|"+ New"| T2
    T2 -->|"Save"| T3
    T4 -->|"Add to estimate"| T2
    T5 -->|"Rate lookup"| T2
    T6 -->|"Supplier pricing"| T4
    T3 -->|"View estimate"| T2
    T7 -->|"Filter by project"| T3
    T8 -->|"Rate update"| T5
```

---

## DIAGRAM 6 — CALCULATION FLOW (ESTIMATE ENGINE)

```mermaid
flowchart TD
    START["🚀 User Starts Estimate Wizard"] --> S1

    subgraph S1["STEP 1: Customer Information"]
        C1["Customer Name"]
        C2["Phone + Email"]
        C3["Property Address"]
        C4["Province Selection\n(determines frost depth & tax)"]
    end

    S1 --> S2

    subgraph S2["STEP 2: Site Details"]
        SD1["Property Size\n(helps verify scope)"]
        SD2["Installation Type\nResidential / Commercial / Industrial"]
        SD3["Site Access Notes"]
        SD4["Photos Upload (optional)"]
    end

    S2 --> S3

    subgraph S3["STEP 3: Fence Specifications"]
        FS1["Fence Type\nChain Link / Vinyl / Wood\nWrought Iron / Guide Rail"]
        FS2["Height\n3ft / 4ft / 5ft / 6ft / 8ft / 10ft"]
        FS3["Color\nGalvanized / Green / Black / Brown\nWhite / Tan / Natural"]
        FS4["Linear Feet"]
        FS5["Number of Gates"]
        FS6["Barbed Wire? Y/N\n(Commercial only)"]
        FS7["Gate Type\nSwing / Sliding / Double / Cantilever"]
    end

    S3 --> S4

    subgraph S4["STEP 4: Material Calculation"]
        MC1["Auto-Calculate Posts\n÷ 10ft spacing + terminal posts"]
        MC2["Auto-Calculate Fabric\n= Linear Feet + 10% waste"]
        MC3["Auto-Calculate Rail\n= Linear Feet ÷ 21ft sections"]
        MC4["Auto-Calculate Hardware\nBands, bars, tie wire, caps"]
        MC5["Auto-Calculate Concrete\n= Total Posts × CY per post"]
        MC6["Auto-Calculate Gates\n= Gate qty × gate assembly"]
        MC7["Manual Overrides\n(estimator can adjust)"]
    end

    S4 --> S5

    subgraph S5["STEP 5: Pricing & Review"]
        P1["Material Total\n= SUM all line items"]
        P2["Labour Hours\n= Linear Feet ÷ 100 × hours/100LF"]
        P3["Labour Cost\n= Hours × Rate × Markup"]
        P4["Subtotal\n= Materials + Labour"]
        P5["Tax (HST)\n= Subtotal × 13%"]
        P6["Total\n= Subtotal + Tax"]
        P7["Profit Check\n= (Total - Cost) ÷ Total × 100%"]
    end

    S5 --> GEN["📄 Generate Estimate\nEST-YYYY-#####"]
    GEN --> LOCK["🔒 Lock Option\n(after customer approval)"]
    LOCK --> PDF["📄 Generate PDF"]
    PDF --> EMAIL["📧 Email to Customer"]
```

---

## DIAGRAM 7 — AUTHENTICATION FLOW

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant F as 🖥️ Frontend
    participant N as ⚙️ Nginx
    participant B as 🔧 Backend
    participant DB as 🗄️ PostgreSQL

    U->>F: Opens https://yourdomain.com
    F->>N: GET /
    N-->>F: index.html (static)
    F-->>U: Shows Landing Page

    U->>F: Clicks Login
    F-->>U: Shows Login Form

    U->>F: Enters username + password
    F->>N: POST /api/auth/login
    N->>B: Forwards to :5000
    B->>DB: SELECT * FROM users WHERE username = ?
    DB-->>B: Returns user record
    B->>B: bcrypt.compare(password, hash)

    alt Invalid Credentials
        B-->>N: 401 Unauthorized
        N-->>F: 401 Unauthorized
        F-->>U: "Invalid username or password"
    else Valid Credentials
        B->>B: jwt.sign({userId, role}, JWT_SECRET)
        B-->>N: 200 OK + JWT Token
        N-->>F: JWT Token
        F->>F: localStorage.setItem('token', jwt)
        F-->>U: Shows Dashboard

        U->>F: Requests protected data
        F->>N: GET /api/projects\nAuthorization: ******
        N->>B: Forwards request
        B->>B: jwt.verify(token, JWT_SECRET)
        B->>DB: SELECT projects WHERE estimator_id = userId
        DB-->>B: Project data
        B-->>N: 200 OK + Data
        N-->>F: Project data
        F-->>U: Shows Projects
    end
```

---

## DIAGRAM 8 — DATABASE RELATIONSHIPS (ERD)

```mermaid
erDiagram
    users {
        int id PK
        varchar username UK
        varchar email UK
        varchar password_hash
        varchar role
        varchar company
        boolean is_active
        timestamp created_at
    }

    projects {
        int id PK
        varchar project_id UK
        varchar customer_name
        varchar customer_email
        varchar customer_phone
        varchar address
        varchar city
        char province
        int estimator_id FK
        varchar status
        timestamp created_at
    }

    fence_specifications {
        int id PK
        varchar project_id FK
        varchar fence_type
        decimal height_ft
        varchar color
        varchar installation_type
        decimal linear_feet
        int number_posts
        int number_gates
    }

    product_categories {
        int id PK
        varchar code UK
        varchar name
        int parent_id FK
        int sort_order
    }

    products {
        int id PK
        varchar plu UK
        int category_id FK
        varchar name
        varchar unit
        decimal unit_cost
        decimal markup_pct
        decimal sell_price
        varchar fence_type
        varchar canadian_std
        boolean in_stock
    }

    estimates {
        int id PK
        varchar estimate_number UK
        varchar project_id FK
        varchar customer_name
        varchar fence_type
        decimal linear_feet
        decimal material_cost
        decimal labor_cost
        decimal subtotal
        decimal tax_amount
        decimal total
        boolean is_locked
        varchar status
        int created_by FK
    }

    estimate_line_items {
        int id PK
        varchar estimate_number FK
        varchar product_plu FK
        varchar description
        decimal quantity
        decimal unit_cost
        decimal markup_pct
        decimal line_total
    }

    change_orders {
        int id PK
        varchar co_number UK
        varchar estimate_number FK
        varchar project_id FK
        decimal cost_delta
        varchar status
        int requested_by FK
        int approved_by FK
    }

    audit_log {
        int id PK
        varchar table_name
        varchar record_id
        varchar action
        jsonb old_values
        jsonb new_values
        int user_id FK
        timestamp created_at
    }

    users ||--o{ projects : "estimator_id"
    users ||--o{ estimates : "created_by"
    users ||--o{ change_orders : "requested_by"
    users ||--o{ audit_log : "user_id"
    projects ||--o{ fence_specifications : "project_id"
    projects ||--o{ estimates : "project_id"
    projects ||--o{ change_orders : "project_id"
    product_categories ||--o{ products : "category_id"
    product_categories ||--o{ product_categories : "parent_id"
    estimates ||--o{ estimate_line_items : "estimate_number"
    estimates ||--o{ change_orders : "estimate_number"
    products ||--o{ estimate_line_items : "product_plu"
```

---

## DIAGRAM 9 — PRICING LOCK FLOW

```mermaid
flowchart TD
    A["Estimate Created\nStatus: DRAFT\nis_locked = FALSE"] --> B["Prices can be edited\n✅ Add/remove line items\n✅ Adjust quantities\n✅ Change labour rate\n✅ Apply discounts"]

    B --> C["Estimate Sent to Customer\nStatus: SENT"]
    C --> D{"Customer Response?"}

    D -->|"❌ Rejected"| E["Estimate Revised\n(return to DRAFT)"]
    E --> B

    D -->|"⏰ Expired (30 days)"| F["Estimate Expired\nStatus: EXPIRED\nMust reissue with current prices"]

    D -->|"✅ Approved"| G["Estimator Locks Estimate\nCALL sp_lock_estimate()"]

    G --> H["is_locked = TRUE\nlocked_at = NOW()\nlocked_by = user_id\nAudit log entry created"]

    H --> I{"Try to Edit Locked Estimate?"}
    I -->|"Yes - Regular Estimator"| J["❌ BLOCKED\n403 Forbidden\n'Estimate is locked'"]
    I -->|"Yes - Admin User"| K["⚠️ Admin Override\nWith full audit trail"]
    I -->|"Yes - Change Order"| L["✅ Allowed via Change Order\nCO-YYYY-#####\nRequires approval workflow"]

    K --> M["Edit logged in audit_log\nOld values + new values\nUser ID + timestamp"]
    L --> N["Change Order Workflow\n(see Diagram 10)"]

    H --> O["Contract Generated\nPDF with locked prices\nSent to customer for signature"]
```

---

## DIAGRAM 10 — CHANGE ORDER FLOW

```mermaid
flowchart TD
    START["🔒 Active Locked Estimate\nStatus: CONTRACT or ACTIVE"]

    START --> REQ["👤 Change Requested\nCustomer or Site Condition"]
    REQ --> FORM["Estimator Creates Change Order\n- Description\n- Reason\n- Cost delta (+/-)\n- Labour delta (+/-)"]
    FORM --> CO[("💾 Change Order Created\nco_number: CO-YYYY-#####\nStatus: PENDING\nLinked to estimate_number")]

    CO --> REVIEW{"Who Reviews?"}

    REVIEW -->|"Small CO (< $500)"| EST["Estimator Reviews\n+ Customer Approval"]
    REVIEW -->|"Large CO (> $500)"| ADMIN["Admin Review Required\n+ Customer Approval"]

    EST --> CUST_DEC1{"Customer Decision?"}
    ADMIN --> CUST_DEC2{"Customer Decision?"}

    CUST_DEC1 -->|"✅ Approved"| APPROVE["CO Status: APPROVED\napproved_by = user_id\napproved_at = NOW()"]
    CUST_DEC2 -->|"✅ Approved"| APPROVE
    CUST_DEC1 -->|"❌ Rejected"| REJECT["CO Status: REJECTED"]
    CUST_DEC2 -->|"❌ Rejected"| REJECT

    APPROVE --> UPDATE["Update Estimate Totals\nmaterial_cost += cost_delta\nlabor_cost += labor_delta\ntotal recalculated\nHST recalculated"]
    UPDATE --> AUDIT["Audit Log Entry\n- Old total vs new total\n- CO reference\n- Timestamp"]
    AUDIT --> NEWPDF["📄 Revised Estimate PDF\nShows original + CO amounts"]
    NEWPDF --> SIGN["Customer Re-Signs\nFor CO approval"]
    SIGN --> ACTIVE["🔨 Project Continues\nWith updated scope"]

    REJECT --> NOTE["CO filed as rejected\nOriginal estimate unchanged\nWork proceeds as original"]
    NOTE --> ACTIVE2["🔨 Project Continues\nWith original scope"]
```

---

## 📐 DIAGRAM RENDERING INSTRUCTIONS

### Option 1: GitHub (Automatic)
GitHub renders Mermaid diagrams natively in Markdown files. View this file at:
```
https://github.com/Auction2026/fence-estimator/blob/main/docs/PART_6_WIRE_GRIDS.md
```

### Option 2: VS Code
1. Install extension: "Mermaid Preview" by Arjun Sinh Dabhoya
2. Open this file in VS Code
3. Press `Ctrl+Shift+P` → "Preview Mermaid Diagram"

### Option 3: Mermaid Live Editor (Online)
1. Go to: https://mermaid.live
2. Paste any diagram code block content (without the triple backticks)
3. View and export as PNG, SVG, or PDF

### Option 4: Export as Images
```bash
# Install mermaid-cli
npm install -g @mermaid-js/mermaid-cli

# Export all diagrams as PNG
mmdc -i docs/PART_6_WIRE_GRIDS.md -o /tmp/diagram.png
```

---

## 📊 DIAGRAM SUMMARY

| # | Diagram Name | Type | Key Information |
|---|-------------|------|-----------------|
| 1 | System Architecture | Graph TB | Full stack: Browser → Nginx → Express → PostgreSQL |
| 2 | Data Flow | Flowchart LR | User actions → API calls → Data responses |
| 3 | User Workflow | State Diagram | Estimate lifecycle states from DRAFT to COMPLETED |
| 4 | Project Lifecycle | Flowchart TD | Project from creation to completion with all statuses |
| 5 | Tab Dependencies | Graph LR | How 8 app tabs interact and share data |
| 6 | Calculation Flow | Flowchart TD | 5-step wizard material and pricing calculation engine |
| 7 | Authentication | Sequence Diagram | Login → JWT → Protected API call sequence |
| 8 | Database ERD | Entity Relationship | All 9 tables with primary keys, foreign keys, data types |
| 9 | Pricing Lock Flow | Flowchart TD | When/how estimates are locked and what can change |
| 10 | Change Order Flow | Flowchart TD | Change order creation → approval → estimate update |

---

*Fence Depot Estimator — Wire Grids & Architecture Diagrams*
*10 Complete Diagrams | Canadian Standards Compliant*
*August 2026*
