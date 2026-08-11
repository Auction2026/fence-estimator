# DATABASE RELATIONSHIPS DIAGRAM
**Fence Estimator Pro** – Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────┐
│                    ENTITY RELATIONSHIPS                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐           ┌───────────────────┐
│    users     │           │     projects       │
│──────────────│           │───────────────────│
│ id (PK)      │◄──────────│ estimator_id (FK) │
│ username     │  1      * │ id (PK)           │
│ email        │           │ project_id (UK)   │
│ password_hash│           │ customer_name     │
│ role         │           │ customer_email    │
│ company      │           │ customer_phone    │
│ phone        │           │ address           │
└──────────────┘           │ city/province     │
                           │ status            │
                           └────────┬──────────┘
                                    │ 1
                    ┌───────────────┼───────────────┐
                    │               │               │
                    │ 1             │ *             │ *
                    ▼               ▼               ▼
           ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
           │  fence_specs │ │   estimates  │ │  contracts   │
           │──────────────│ │──────────────│ │──────────────│
           │ id (PK)      │ │ id (PK)      │ │ id (PK)      │
           │ project_id   │ │ estimate_num │ │ contract_num │
           │ fence_type   │ │ project_id   │ │ project_id   │
           │ height       │ │ fence_type   │ │ total_price  │
           │ linear_feet  │ │ linear_feet  │ │ price_locked │
           │ number_posts │ │ material_cost│ │ status       │
           │ number_gates │ │ labour_cost  │ │ cust_sig     │
           │ gate_type    │ │ total        │ │ co_sig       │
           │ barbed_wire  │ │ status       │ └──────┬───────┘
           └──────────────┘ └──────────────┘        │
                                                     │ 1
                                           ┌─────────┴────────┐
                                           │                  │
                                           │ *                │ *
                                           ▼                  ▼
                                  ┌─────────────┐   ┌──────────────┐
                                  │change_orders│   │  sign_offs   │
                                  │─────────────│   │──────────────│
                                  │ id (PK)     │   │ id (PK)      │
                                  │ co_number   │   │ signoff_num  │
                                  │ contract_num│   │ project_id   │
                                  │ project_id  │   │ contract_num │
                                  │ description │   │ completion   │
                                  │ mat_change  │   │ inspection   │
                                  │ lab_change  │   │ walkthrough  │
                                  │ new_total   │   │ warranty     │
                                  │ status      │   │ status       │
                                  └─────────────┘   └──────────────┘

┌──────────────┐    ┌──────────────┐    ┌───────────────────┐
│    notes     │    │  inventory   │    │    audit_log      │
│──────────────│    │──────────────│    │───────────────────│
│ id (PK)      │    │ id (PK)      │    │ id (PK)           │
│ title        │    │ sku (UK)     │    │ user_id           │
│ category     │    │ name         │    │ action            │
│ content      │    │ category     │    │ table_name        │
│ created_by   │    │ unit_cost    │    │ record_id         │
│ usage_count  │    │ retail_price │    │ old_data (JSON)   │
└──────────────┘    │ quantity     │    │ new_data (JSON)   │
                    │ supplier     │    └───────────────────┘
                    └──────────────┘

RELATIONSHIP SUMMARY:
users        ──< projects       (1 estimator : many projects)
projects     ──  fence_specs    (1 project : 1 fence spec)
projects     ──< estimates      (1 project : many estimates)
projects     ──< contracts      (1 project : many contracts)
contracts    ──< change_orders  (1 contract : many COs)
projects     ──  sign_offs      (1 project : 1 sign-off)
users        ──< notes          (1 user : many notes)
```
