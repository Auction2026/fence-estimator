# DATABASE RELATIONSHIPS
## Fence Depot Fence Estimator - How Database Tables Connect

```
═══════════════════════════════════════════════════════════════════════════
                  DATABASE RELATIONSHIPS DIAGRAM v1.0
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────┐
│  TABLE: users                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  _id (ObjectId) ◄── PRIMARY KEY                                  │  │
│  │  username: String (unique)                                        │  │
│  │  email: String (unique)                                           │  │
│  │  password: String (bcrypt hash)                                   │  │
│  │  role: String (admin/estimator/crew)                              │  │
│  │  company: String                                                  │  │
│  │  phone: String                                                    │  │
│  │  createdAt: Date                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────────────┘
                             │ 1 user creates many projects
                             │ (1 to MANY)
                             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  TABLE: projects                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  _id (ObjectId) ◄── PRIMARY KEY                                  │  │
│  │  userId: ObjectId ──────────────────────────────────────► users  │  │
│  │  projectNumber: String (e.g., PE-2026-0001)                       │  │
│  │  customerName: String                                             │  │
│  │  customerEmail: String                                            │  │
│  │  customerPhone: String                                            │  │
│  │  address: String                                                  │  │
│  │  city, state, zip: String                                         │  │
│  │  status: String (new/surveyed/estimated/contracted/complete)      │  │
│  │  createdAt, updatedAt: Date                                       │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└───────┬───────────────────────────────────────────────────────┬─────────┘
        │ 1 project has 1 fence spec                            │ 1 project has many estimates
        ▼                                                       ▼
┌───────────────────────────┐               ┌──────────────────────────────┐
│  TABLE: fence_specs       │               │  TABLE: estimates            │
│  ┌─────────────────────┐  │               │  ┌──────────────────────────┐│
│  │  _id ◄─ PRIMARY KEY │  │               │  │  _id ◄─ PRIMARY KEY      ││
│  │  projectId ─────────┼──┼────────────── │  │  projectId ──────────────┼┼──► projects
│  │  fenceType: String  │  │               │  │  estimateNumber: String  ││
│  │  height: Number     │  │               │  │  materialsTotal: Number  ││
│  │  gauge: String      │  │               │  │  laborTotal: Number      ││
│  │  linearFeet: Number │  │               │  │  equipmentTotal: Number  ││
│  │  gatesCount: Number │  │               │  │  subtotal: Number        ││
│  │  terrain: String    │  │               │  │  taxRate: Number         ││
│  └─────────────────────┘  │               │  │  taxAmount: Number       ││
└───────────────────────────┘               │  │  total: Number           ││
                                            │  │  status: String          ││
                                            │  │  lineItems: [Array]      ││
                                            │  └──────────────────────────┘│
                                            └──────────────┬───────────────┘
                                                           │ 1 estimate leads to 1 contract
                                                           ▼
                                            ┌──────────────────────────────┐
                                            │  TABLE: contracts            │
                                            │  ┌──────────────────────────┐│
                                            │  │  _id ◄─ PRIMARY KEY      ││
                                            │  │  projectId ──────────────┼┼──► projects
                                            │  │  estimateId ─────────────┼┼──► estimates
                                            │  │  contractNumber: String  ││
                                            │  │  terms: String           ││
                                            │  │  paymentSchedule: String ││
                                            │  │  startDate: Date         ││
                                            │  │  completionDate: Date    ││
                                            │  │  status: String          ││
                                            │  │  signedAt: Date          ││
                                            │  └──────────────────────────┘│
                                            └──────────────┬───────────────┘
                                                           │ 1 contract has many change orders
                                                           ▼
                                            ┌──────────────────────────────┐
                                            │  TABLE: change_orders        │
                                            │  ┌──────────────────────────┐│
                                            │  │  _id ◄─ PRIMARY KEY      ││
                                            │  │  projectId ──────────────┼┼──► projects
                                            │  │  contractId ─────────────┼┼──► contracts
                                            │  │  coNumber: String        ││
                                            │  │  description: String     ││
                                            │  │  total: Number           ││
                                            │  │  status: String          ││
                                            │  │  approvedAt: Date        ││
                                            │  └──────────────────────────┘│
                                            └──────────────────────────────┘

OTHER TABLES (all linked to projects):

┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│  TABLE: sign_offs    │  │  TABLE: notes        │  │  TABLE: products     │
│                      │  │                      │  │  (catalog - no FK)   │
│  _id                 │  │  _id                 │  │  _id                 │
│  projectId ─────────►│  │  projectId ─────────►│  │  sku                 │
│  type: String        │  │  userId ────────────►│  │  name                │
│  signatureData       │  │  category            │  │  category            │
│  signedBy            │  │  content             │  │  unit                │
│  signedAt            │  │  createdAt           │  │  cost                │
│  notes               │  │                      │  │  price               │
└──────────────────────┘  └──────────────────────┘  └──────────────────────┘

═══════════════════════════════════════════════════════════════════════════
                    RELATIONSHIP SUMMARY
═══════════════════════════════════════════════════════════════════════════

  users        ──(1:MANY)──► projects
  projects     ──(1:1)────► fence_specs
  projects     ──(1:MANY)──► estimates
  projects     ──(1:MANY)──► contracts
  projects     ──(1:MANY)──► change_orders
  projects     ──(1:MANY)──► sign_offs
  projects     ──(1:MANY)──► notes
  estimates    ──(1:1)────► contracts
  contracts    ──(1:MANY)──► change_orders
  users        ──(1:MANY)──► notes
  products     ──(standalone)── no foreign keys (catalog table)

═══════════════════════════════════════════════════════════════════════════
```
