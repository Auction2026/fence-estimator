# Database Relationships

## Overview

This diagram shows all database tables and how they relate to each other.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  DATABASE TABLES & RELATIONSHIPS                                             │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐
│   users     │
│─────────────│
│ id (PK)     │
│ name        │
│ email       │
│ password    │
│ role        │
│ created_at  │
└──────┬──────┘
       │ created_by
       │
       ▼
┌─────────────────────┐
│      projects       │
│─────────────────────│
│ id (PK)             │◄──────────────────────────────────────────────┐
│ user_id (FK→users)  │                                               │
│ customer_name       │                                               │
│ customer_email      │                                               │
│ customer_phone      │                                               │
│ address             │                                               │
│ project_type        │                                               │
│ status              │                                               │
│ created_at          │                                               │
└──────┬──────────────┘                                               │
       │ one project has many...                                      │
       │                                                              │
       ├──────────────────────┐                                       │
       │                      │                                       │
       ▼                      ▼                                       │
┌──────────────┐   ┌──────────────────────┐                          │
│ fence_specs  │   │     estimates        │                          │
│──────────────│   │──────────────────────│                          │
│ id (PK)      │   │ id (PK)              │                          │
│ project_id   │   │ project_id           │                          │
│ fence_type   │   │ material_total       │                          │
│ height       │   │ labor_total          │                          │
│ color        │   │ equipment_total      │                          │
│ gauge        │   │ permit_total         │                          │
│ post_spacing │   │ markup_pct           │                          │
│ linear_feet  │   │ profit_pct           │                          │
│ gate_count   │   │ grand_total          │                          │
└──────────────┘   │ status               │                          │
                   │ created_at           │                          │
                   └──────────┬───────────┘                          │
                              │ one estimate has one...              │
                              ▼                                      │
                   ┌──────────────────────┐                          │
                   │      contracts       │                          │
                   │──────────────────────│                          │
                   │ id (PK)              │                          │
                   │ estimate_id (FK)     │                          │
                   │ project_id (FK)      ├──────────────────────────┘
                   │ signed_at            │
                   │ price_locked_at      │
                   │ total_locked         │
                   │ customer_signature   │
                   │ status               │
                   └──────────┬───────────┘
                              │ one contract has many...
                              │
                    ┌─────────┴──────────────┐
                    │                        │
                    ▼                        ▼
        ┌───────────────────┐   ┌──────────────────────┐
        │   change_orders   │   │      invoices        │
        │───────────────────│   │──────────────────────│
        │ id (PK)           │   │ id (PK)              │
        │ contract_id (FK)  │   │ contract_id (FK)     │
        │ description       │   │ amount               │
        │ amount_change     │   │ due_date             │
        │ approved_at       │   │ paid_at              │
        │ status            │   │ status               │
        └───────────────────┘   └──────────────────────┘

INVENTORY (standalone reference table)
┌─────────────────────┐
│      inventory      │
│─────────────────────│
│ id (PK)             │
│ plu                 │
│ description         │
│ department          │
│ unit                │
│ price               │
│ upc                 │
└─────────────────────┘
     Used by estimate engine to look up material prices.
     Not directly foreign-keyed — looked up by PLU code.

ESTIMATE ITEMS (line items for each estimate)
┌─────────────────────────┐
│     estimate_items      │
│─────────────────────────│
│ id (PK)                 │
│ estimate_id (FK)        │
│ inventory_plu           │
│ description             │
│ quantity                │
│ unit_price              │
│ line_total              │
└─────────────────────────┘

SIGN-OFFS
┌─────────────────────────┐
│       sign_offs         │
│─────────────────────────│
│ id (PK)                 │
│ project_id (FK)         │
│ signed_by_customer      │
│ signed_at               │
│ notes                   │
└─────────────────────────┘
```

---

## Relationship Summary

| Relationship | Type |
|---|---|
| users → projects | One-to-many |
| projects → fence_specs | One-to-one |
| projects → estimates | One-to-many |
| estimates → contracts | One-to-one |
| contracts → change_orders | One-to-many |
| contracts → invoices | One-to-many |
| estimates → estimate_items | One-to-many |
| projects → sign_offs | One-to-one |
| inventory | Standalone reference |
