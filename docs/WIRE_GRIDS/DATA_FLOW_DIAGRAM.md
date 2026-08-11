# DATA FLOW DIAGRAM
## Fence Depot Fence Estimator - How Data Moves Through the System

```
═══════════════════════════════════════════════════════════════════════════
                         DATA FLOW DIAGRAM v1.0
═══════════════════════════════════════════════════════════════════════════

USER ACTION                 FRONTEND                 BACKEND               DATABASE
───────────                 ────────                 ───────               ────────

1. USER FILLS FORM
   ┌──────────────┐
   │ Enter data   │
   │ in form      │──► Auto-save to
   │ fields       │    localStorage
   └──────────────┘
         │
         ▼ Click Save/Submit
   ┌──────────────────────────────────────────────────────────────────┐
   │  VALIDATION                                                       │
   │  validation.js checks:                                            │
   │  ✓ Required fields filled    ✓ Email format correct               │
   │  ✓ Phone format correct      ✓ Numbers are valid                  │
   └──────────────────────────────────────────────────────────────────┘
         │ Validation passes
         ▼
   ┌──────────────────────────────────────────────────────────────────┐
   │  API CALL (api.js)                                                │
   │  fetch('http://localhost:3000/api/projects', {                    │
   │    method: 'POST',                                                │
   │    headers: { 'Authorization': '******',               │
   │               'Content-Type': 'application/json' },              │
   │    body: JSON.stringify(formData)                                 │
   │  })                                                               │
   └──────────────────────────────────────────────────────────────────┘
         │ HTTP POST request
         ▼
   ┌──────────────────────────────────────────────────────────────────┐
   │  SERVER MIDDLEWARE (server.js)                                    │
   │  1. CORS check                                                    │
   │  2. Body parser - reads JSON body                                 │
   │  3. Auth middleware - verifies JWT token                          │
   │  4. Route to handler function                                     │
   └──────────────────────────────────────────────────────────────────┘
         │ Middleware passes
         ▼
   ┌──────────────────────────────────────────────────────────────────┐
   │  ROUTE HANDLER (server.js)                                        │
   │  POST /api/projects                                               │
   │  - Validates request body                                         │
   │  - Creates MongoDB document                                       │
   │  - Saves to database                                              │
   └──────────────────────────────────────────────────────────────────┘
         │ mongoose.save()
         ▼
   ┌──────────────────────────────────────────────────────────────────┐
   │  MONGODB                                                          │
   │  Stores document in 'projects' collection                         │
   │  Returns: { _id: "507f1f77bcf86cd799439011", ...projectData }    │
   └──────────────────────────────────────────────────────────────────┘
         │ Response flows back up
         ▼
   ┌──────────────────────────────────────────────────────────────────┐
   │  SERVER RESPONSE                                                  │
   │  HTTP 201 Created                                                 │
   │  { success: true, project: { _id, name, customer... } }          │
   └──────────────────────────────────────────────────────────────────┘
         │
         ▼
   ┌──────────────────────────────────────────────────────────────────┐
   │  FRONTEND HANDLES RESPONSE (api.js → tab1-project.js → ui.js)   │
   │  - Show success notification                                      │
   │  - Update page with new project ID                                │
   │  - Enable next tab                                                │
   │  - Save project ID to localStorage                                │
   └──────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════
                    ESTIMATE CALCULATION DATA FLOW
═══════════════════════════════════════════════════════════════════════════

   INPUT DATA                CALCULATIONS              OUTPUT
   ──────────                ────────────              ──────

   ┌────────────────┐
   │ Fence Specs    │
   │ - Type: CL     │        calculations.js
   │ - Height: 6ft  │──────► calculateMaterials()
   │ - Footage: 200 │        - Posts needed: footage/10
   │ - Gates: 2     │        - Fabric rolls: footage/50
   └────────────────┘        - Hardware qty
                             - Concrete bags
   ┌────────────────┐              │
   │ Labor Hours    │              ▼
   │ - Install: 16h │──────► calculateLabor()        ┌──────────────────┐
   │ - Rate: $45/hr │        - Crew hours × rate      │ ESTIMATE TOTAL   │
   └────────────────┘              │                  │                  │
                                   ▼                  │ Materials: $XXX  │
   ┌────────────────┐        calculateEquipment()     │ Labor:     $XXX  │
   │ Equipment      │──────► - Equipment rental       │ Equipment: $XXX  │
   │ - Digger rental│              │                  │ Subtotal:  $XXX  │
   │ - Truck days   │              ▼                  │ Tax (X%):  $XXX  │
   └────────────────┘        calculateTax()           │ TOTAL:     $XXX  │
                             - Subtotal × tax rate    └──────────────────┘
   ┌────────────────┐              │
   │ Tax Rate       │──────►       ▼
   │ - 8.5%         │        calculateTotal()
   └────────────────┘        - Sum all parts

═══════════════════════════════════════════════════════════════════════════
                    AUTHENTICATION DATA FLOW
═══════════════════════════════════════════════════════════════════════════

   LOGIN REQUEST              SERVER                  RESPONSE
   ─────────────              ──────                  ────────

   User enters:
   email + password
        │
        ▼
   api.login()          POST /api/auth/login
   sends credentials ──────────────────────►  Find user in DB
                                              Check password
                                              bcrypt.compare()
                                                   │
                                              If match:
                                              jwt.sign(userId)
                                                   │
                        ◄─────────────────────────┘
   Store token in          { token: "eyJhbGc..." }
   localStorage                    │
        │                          │
        ▼                          ▼
   All future API calls    Token expires in 7 days
   include header:         User must login again
   Authorization: ******

═══════════════════════════════════════════════════════════════════════════
```
