
# Database Relationships

```text
users (1) ------------------------< (N) projects
projects (1) --------------------- (1) fence_specs
projects (1) ---------------------< (N) estimates
estimates (1) --------------------< (N) estimate_line_items
estimate_line_items (N) >--------- (1) inventory
projects (1) ---------------------< (N) contracts
projects (1) ---------------------< (N) change_orders
projects (1) ---------------------< (N) notes
projects (1) ---------------------< (N) sign_offs
```

## Relationship notes
- A **user** can own many projects.
- Each **project** has one current fence specification profile.
- A **project** can produce multiple estimates over time.
- Each **estimate** expands into many line items.
- **Line items** reference catalog/inventory records for pricing traceability.
- A **project** can produce one or more contracts, change orders, notes, and sign-off records over its life.
