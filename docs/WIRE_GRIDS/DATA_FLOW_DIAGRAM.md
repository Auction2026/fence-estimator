# DIAGRAM 2: DATA FLOW
## Fence Depot Fence Estimator — Complete Data Flow

```
═══════════════════════════════════════════════════════════════════════
                    DATA FLOW DIAGRAM
          From Customer Request to Approved Estimate
═══════════════════════════════════════════════════════════════════════

  [ESTIMATOR]
       │
       │  1. Opens App / Logs In
       ▼
  ┌──────────────┐
  │  index.html  │ ◄─── localStorage: session token, estimate sequence
  │  Dashboard   │
  └──────┬───────┘
         │
         │  2. Click "New Estimate" Tab
         ▼
  ┌──────────────────────────────────────────────────────┐
  │              ESTIMATE WIZARD (5 Steps)               │
  │                                                      │
  │  Step 1: Customer Info                               │
  │  ┌────────────────────────────┐                      │
  │  │ Name, Phone, Address, City │ ──► estimateState    │
  │  └────────────────────────────┘                      │
  │                                                      │
  │  Step 2: Fence Type Selection                        │
  │  ┌────────────────────────────┐                      │
  │  │ Chain Link / Wood / Vinyl  │ ──► estimateState    │
  │  │ Height / Color / Options   │                      │
  │  └────────────────────────────┘                      │
  │                                                      │
  │  Step 3: Measurements                                │
  │  ┌────────────────────────────┐                      │
  │  │ Linear Footage             │ ──► estimateState    │
  │  │ Number of Gates            │                      │
  │  │ Special Requirements       │                      │
  │  └────────────────────────────┘                      │
  │                                                      │
  │  Step 4: Materials Calculation ◄── INVENTORY_DB      │
  │  ┌────────────────────────────────────────────────┐  │
  │  │ calculateAndRenderMaterials()                  │  │
  │  │ ┌──────────────────────────────────────────┐  │  │
  │  │ │ findMesh(height) → fabric roll qty        │  │  │
  │  │ │ findTensionWire(lf) → wire roll qty       │  │  │
  │  │ │ findBraceBand(postDiam) → band qty        │  │  │
  │  │ │ invByPlu(plu) → product price lookup     │  │  │
  │  │ │ Post count: ceil(lf/spacing) + 1         │  │  │
  │  │ │ Labor hours: lf/10 (chain link)           │  │  │
  │  │ └──────────────────────────────────────────┘  │  │
  │  │ ► Renders material list table                  │  │
  │  │ ► Calculates subtotal, markup, tax, total      │  │
  │  └────────────────────────────────────────────────┘  │
  │                                                      │
  │  Step 5: Review & Generate                           │
  │  ┌────────────────────────────┐                      │
  │  │ Review all materials       │                      │
  │  │ Confirm pricing            │                      │
  │  │ [Generate Estimate]        │                      │
  │  └────────────────────────────┘                      │
  └──────────────────────────────────────────────────────┘
         │
         │  3. Generate Estimate
         ▼
  ┌─────────────────────┐
  │  Estimate Created   │
  │  estimateNumber:    │
  │  EST-2024-001       │
  └──────┬──────────────┘
         │
         ├────────────────────────────────────┐
         │                                    │
         ▼                                    ▼
  ┌─────────────────┐               ┌─────────────────────┐
  │ localStorage    │               │  Backend API         │
  │ (immediate)     │               │  POST /api/estimates │
  │                 │               │  (when online)       │
  │ • Customer data │               │                      │
  │ • Estimate #    │               │  ► MongoDB: save     │
  │ • Line items    │               │  ► MySQL: save       │
  └─────────────────┘               │  ► Audit log entry   │
                                    └──────────┬──────────┘
                                               │
                                               ▼
                                    ┌─────────────────────┐
                                    │  Email to Customer   │
                                    │  POST /api/email     │
                                    │  (nodemailer SMTP)   │
                                    └──────────┬──────────┘
                                               │
                                               ▼
                                    ┌─────────────────────┐
                                    │  PDF Generated       │
                                    │  GET /api/pdf/:id    │
                                    │  (PDFKit)            │
                                    └─────────────────────┘

═══════════════════════════════════════════════════════════════════════
DATA STATE OBJECT (estimateState):
{
  customerName, customerPhone, customerEmail, address,
  fenceType, height, color, linearFeet, numberGates,
  installationType, specialNotes,
  materials: [...line items],
  laborHours, laborRate, laborCost,
  materialCost, markup, tax, totalAmount
}
═══════════════════════════════════════════════════════════════════════
```
