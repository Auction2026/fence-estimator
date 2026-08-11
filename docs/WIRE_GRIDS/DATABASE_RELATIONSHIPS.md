# Database Relationships

## Overview
This file summarizes foreign key paths and the main one-to-many relationships in the estimator schema.

## ASCII Diagram
```text
users 1 ────< projects 1 ────< fence_specs 1 ────< estimates 1 ────< contracts 1 ────< change_orders
  │               │                                   │                               │
  ├──────────────< notes                              └───────────────────────────────┘
  └──────────────< estimates.created_by
projects 1 ────< signoffs
inventory (standalone catalog referenced by application logic)
```

## Detailed Explanation
### Detail 1
- Database Relationships detail 1 explains one operational viewpoint for the Fence Depot Estimator workflow.
- Teams should review detail 1 when validating changes to data ownership, status transitions, or user expectations.
- If a workflow step changes, update this wire grid so architecture and training documents stay aligned.

### Detail 2
- Database Relationships detail 2 explains one operational viewpoint for the Fence Depot Estimator workflow.
- Teams should review detail 2 when validating changes to data ownership, status transitions, or user expectations.
- If a workflow step changes, update this wire grid so architecture and training documents stay aligned.

### Detail 3
- Database Relationships detail 3 explains one operational viewpoint for the Fence Depot Estimator workflow.
- Teams should review detail 3 when validating changes to data ownership, status transitions, or user expectations.
- If a workflow step changes, update this wire grid so architecture and training documents stay aligned.

### Detail 4
- Database Relationships detail 4 explains one operational viewpoint for the Fence Depot Estimator workflow.
- Teams should review detail 4 when validating changes to data ownership, status transitions, or user expectations.
- If a workflow step changes, update this wire grid so architecture and training documents stay aligned.

### Detail 5
- Database Relationships detail 5 explains one operational viewpoint for the Fence Depot Estimator workflow.
- Teams should review detail 5 when validating changes to data ownership, status transitions, or user expectations.
- If a workflow step changes, update this wire grid so architecture and training documents stay aligned.

### Detail 6
- Database Relationships detail 6 explains one operational viewpoint for the Fence Depot Estimator workflow.
- Teams should review detail 6 when validating changes to data ownership, status transitions, or user expectations.
- If a workflow step changes, update this wire grid so architecture and training documents stay aligned.

### Detail 7
- Database Relationships detail 7 explains one operational viewpoint for the Fence Depot Estimator workflow.
- Teams should review detail 7 when validating changes to data ownership, status transitions, or user expectations.
- If a workflow step changes, update this wire grid so architecture and training documents stay aligned.

### Detail 8
- Database Relationships detail 8 explains one operational viewpoint for the Fence Depot Estimator workflow.
- Teams should review detail 8 when validating changes to data ownership, status transitions, or user expectations.
- If a workflow step changes, update this wire grid so architecture and training documents stay aligned.

### Detail 9
- Database Relationships detail 9 explains one operational viewpoint for the Fence Depot Estimator workflow.
- Teams should review detail 9 when validating changes to data ownership, status transitions, or user expectations.
- If a workflow step changes, update this wire grid so architecture and training documents stay aligned.

### Detail 10
- Database Relationships detail 10 explains one operational viewpoint for the Fence Depot Estimator workflow.
- Teams should review detail 10 when validating changes to data ownership, status transitions, or user expectations.
- If a workflow step changes, update this wire grid so architecture and training documents stay aligned.

### Detail 11
- Database Relationships detail 11 explains one operational viewpoint for the Fence Depot Estimator workflow.
- Teams should review detail 11 when validating changes to data ownership, status transitions, or user expectations.
- If a workflow step changes, update this wire grid so architecture and training documents stay aligned.

### Detail 12
- Database Relationships detail 12 explains one operational viewpoint for the Fence Depot Estimator workflow.
- Teams should review detail 12 when validating changes to data ownership, status transitions, or user expectations.
- If a workflow step changes, update this wire grid so architecture and training documents stay aligned.

### Detail 13
- Database Relationships detail 13 explains one operational viewpoint for the Fence Depot Estimator workflow.
- Teams should review detail 13 when validating changes to data ownership, status transitions, or user expectations.
- If a workflow step changes, update this wire grid so architecture and training documents stay aligned.

### Detail 14
- Database Relationships detail 14 explains one operational viewpoint for the Fence Depot Estimator workflow.
- Teams should review detail 14 when validating changes to data ownership, status transitions, or user expectations.
- If a workflow step changes, update this wire grid so architecture and training documents stay aligned.

### Detail 15
- Database Relationships detail 15 explains one operational viewpoint for the Fence Depot Estimator workflow.
- Teams should review detail 15 when validating changes to data ownership, status transitions, or user expectations.
- If a workflow step changes, update this wire grid so architecture and training documents stay aligned.

## Role Considerations
- **Admin:** Review how admin access affects the database relationships flow and which actions should be read-only versus editable.
- **Estimator:** Review how estimator access affects the database relationships flow and which actions should be read-only versus editable.
- **Installer:** Review how installer access affects the database relationships flow and which actions should be read-only versus editable.
- **Viewer:** Review how viewer access affects the database relationships flow and which actions should be read-only versus editable.

## Validation Checklist
- [ ] Validate checkpoint 1 for the Database Relationships diagram during implementation or QA review.
- [ ] Validate checkpoint 2 for the Database Relationships diagram during implementation or QA review.
- [ ] Validate checkpoint 3 for the Database Relationships diagram during implementation or QA review.
- [ ] Validate checkpoint 4 for the Database Relationships diagram during implementation or QA review.
- [ ] Validate checkpoint 5 for the Database Relationships diagram during implementation or QA review.
- [ ] Validate checkpoint 6 for the Database Relationships diagram during implementation or QA review.
- [ ] Validate checkpoint 7 for the Database Relationships diagram during implementation or QA review.
- [ ] Validate checkpoint 8 for the Database Relationships diagram during implementation or QA review.
- [ ] Validate checkpoint 9 for the Database Relationships diagram during implementation or QA review.
- [ ] Validate checkpoint 10 for the Database Relationships diagram during implementation or QA review.
- [ ] Validate checkpoint 11 for the Database Relationships diagram during implementation or QA review.
- [ ] Validate checkpoint 12 for the Database Relationships diagram during implementation or QA review.
- [ ] Validate checkpoint 13 for the Database Relationships diagram during implementation or QA review.
- [ ] Validate checkpoint 14 for the Database Relationships diagram during implementation or QA review.
- [ ] Validate checkpoint 15 for the Database Relationships diagram during implementation or QA review.
- [ ] Validate checkpoint 16 for the Database Relationships diagram during implementation or QA review.
- [ ] Validate checkpoint 17 for the Database Relationships diagram during implementation or QA review.
- [ ] Validate checkpoint 18 for the Database Relationships diagram during implementation or QA review.
- [ ] Validate checkpoint 19 for the Database Relationships diagram during implementation or QA review.
- [ ] Validate checkpoint 20 for the Database Relationships diagram during implementation or QA review.

## Notes for Future Updates
1. Keep database relationships note 1 synchronized with the live application behavior, API responses, and database rules.
2. Keep database relationships note 2 synchronized with the live application behavior, API responses, and database rules.
3. Keep database relationships note 3 synchronized with the live application behavior, API responses, and database rules.
4. Keep database relationships note 4 synchronized with the live application behavior, API responses, and database rules.
5. Keep database relationships note 5 synchronized with the live application behavior, API responses, and database rules.
6. Keep database relationships note 6 synchronized with the live application behavior, API responses, and database rules.
7. Keep database relationships note 7 synchronized with the live application behavior, API responses, and database rules.
8. Keep database relationships note 8 synchronized with the live application behavior, API responses, and database rules.
9. Keep database relationships note 9 synchronized with the live application behavior, API responses, and database rules.
10. Keep database relationships note 10 synchronized with the live application behavior, API responses, and database rules.
11. Keep database relationships note 11 synchronized with the live application behavior, API responses, and database rules.
12. Keep database relationships note 12 synchronized with the live application behavior, API responses, and database rules.
13. Keep database relationships note 13 synchronized with the live application behavior, API responses, and database rules.
14. Keep database relationships note 14 synchronized with the live application behavior, API responses, and database rules.
15. Keep database relationships note 15 synchronized with the live application behavior, API responses, and database rules.
16. Keep database relationships note 16 synchronized with the live application behavior, API responses, and database rules.
17. Keep database relationships note 17 synchronized with the live application behavior, API responses, and database rules.
18. Keep database relationships note 18 synchronized with the live application behavior, API responses, and database rules.
19. Keep database relationships note 19 synchronized with the live application behavior, API responses, and database rules.
20. Keep database relationships note 20 synchronized with the live application behavior, API responses, and database rules.
21. Keep database relationships note 21 synchronized with the live application behavior, API responses, and database rules.
22. Keep database relationships note 22 synchronized with the live application behavior, API responses, and database rules.
23. Keep database relationships note 23 synchronized with the live application behavior, API responses, and database rules.
24. Keep database relationships note 24 synchronized with the live application behavior, API responses, and database rules.
25. Keep database relationships note 25 synchronized with the live application behavior, API responses, and database rules.
