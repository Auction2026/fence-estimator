# System Architecture

## Overview
The Fence Depot Estimator uses a browser client, a Node.js/Express backend, and a PostgreSQL database. This document explains the layers, responsibilities, and coordination points.

## ASCII Diagram
```text
┌─────────────────────────────────────────────────────────┐
│                    CLIENT TIER                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Browser (HTML/CSS/JavaScript)          │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │  │
│  │  │  index  │  │   CSS   │  │  JavaScript      │ │  │
│  │  │  .html  │  │ Styles  │  │  (17 Tab Files) │ │  │
│  │  └─────────┘  └─────────┘  └─────────────────┘ │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
            │ HTTP/HTTPS (REST API calls)
            ▼
┌─────────────────────────────────────────────────────────┐
│                    SERVER TIER                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Node.js + Express.js Backend           │  │
│  │  ┌─────────┐  ┌─────────┐  ┌──────────────────┐ │  │
│  │  │  Auth   │  │  API    │  │   Business       │ │  │
│  │  │ (JWT)   │  │ Routes  │  │   Logic          │ │  │
│  │  └─────────┘  └─────────┘  └──────────────────┘ │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
            │ SQL Queries (pg library)
            ▼
┌─────────────────────────────────────────────────────────┐
│                  DATABASE TIER                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │              PostgreSQL Database                 │  │
│  │  ┌─────┐ ┌────────┐ ┌──────────┐ ┌──────────┐  │  │
│  │  │Users│ │Projects│ │Estimates │ │Inventory │  │  │
│  │  └─────┘ └────────┘ └──────────┘ └──────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Detailed Explanation
### Detail 1
- System Architecture detail 1 explains one operational viewpoint for the Fence Depot Estimator workflow.
- Teams should review detail 1 when validating changes to data ownership, status transitions, or user expectations.
- If a workflow step changes, update this wire grid so architecture and training documents stay aligned.

### Detail 2
- System Architecture detail 2 explains one operational viewpoint for the Fence Depot Estimator workflow.
- Teams should review detail 2 when validating changes to data ownership, status transitions, or user expectations.
- If a workflow step changes, update this wire grid so architecture and training documents stay aligned.

### Detail 3
- System Architecture detail 3 explains one operational viewpoint for the Fence Depot Estimator workflow.
- Teams should review detail 3 when validating changes to data ownership, status transitions, or user expectations.
- If a workflow step changes, update this wire grid so architecture and training documents stay aligned.

### Detail 4
- System Architecture detail 4 explains one operational viewpoint for the Fence Depot Estimator workflow.
- Teams should review detail 4 when validating changes to data ownership, status transitions, or user expectations.
- If a workflow step changes, update this wire grid so architecture and training documents stay aligned.

### Detail 5
- System Architecture detail 5 explains one operational viewpoint for the Fence Depot Estimator workflow.
- Teams should review detail 5 when validating changes to data ownership, status transitions, or user expectations.
- If a workflow step changes, update this wire grid so architecture and training documents stay aligned.

### Detail 6
- System Architecture detail 6 explains one operational viewpoint for the Fence Depot Estimator workflow.
- Teams should review detail 6 when validating changes to data ownership, status transitions, or user expectations.
- If a workflow step changes, update this wire grid so architecture and training documents stay aligned.

### Detail 7
- System Architecture detail 7 explains one operational viewpoint for the Fence Depot Estimator workflow.
- Teams should review detail 7 when validating changes to data ownership, status transitions, or user expectations.
- If a workflow step changes, update this wire grid so architecture and training documents stay aligned.

### Detail 8
- System Architecture detail 8 explains one operational viewpoint for the Fence Depot Estimator workflow.
- Teams should review detail 8 when validating changes to data ownership, status transitions, or user expectations.
- If a workflow step changes, update this wire grid so architecture and training documents stay aligned.

### Detail 9
- System Architecture detail 9 explains one operational viewpoint for the Fence Depot Estimator workflow.
- Teams should review detail 9 when validating changes to data ownership, status transitions, or user expectations.
- If a workflow step changes, update this wire grid so architecture and training documents stay aligned.

### Detail 10
- System Architecture detail 10 explains one operational viewpoint for the Fence Depot Estimator workflow.
- Teams should review detail 10 when validating changes to data ownership, status transitions, or user expectations.
- If a workflow step changes, update this wire grid so architecture and training documents stay aligned.

### Detail 11
- System Architecture detail 11 explains one operational viewpoint for the Fence Depot Estimator workflow.
- Teams should review detail 11 when validating changes to data ownership, status transitions, or user expectations.
- If a workflow step changes, update this wire grid so architecture and training documents stay aligned.

### Detail 12
- System Architecture detail 12 explains one operational viewpoint for the Fence Depot Estimator workflow.
- Teams should review detail 12 when validating changes to data ownership, status transitions, or user expectations.
- If a workflow step changes, update this wire grid so architecture and training documents stay aligned.

### Detail 13
- System Architecture detail 13 explains one operational viewpoint for the Fence Depot Estimator workflow.
- Teams should review detail 13 when validating changes to data ownership, status transitions, or user expectations.
- If a workflow step changes, update this wire grid so architecture and training documents stay aligned.

### Detail 14
- System Architecture detail 14 explains one operational viewpoint for the Fence Depot Estimator workflow.
- Teams should review detail 14 when validating changes to data ownership, status transitions, or user expectations.
- If a workflow step changes, update this wire grid so architecture and training documents stay aligned.

### Detail 15
- System Architecture detail 15 explains one operational viewpoint for the Fence Depot Estimator workflow.
- Teams should review detail 15 when validating changes to data ownership, status transitions, or user expectations.
- If a workflow step changes, update this wire grid so architecture and training documents stay aligned.

## Role Considerations
- **Admin:** Review how admin access affects the system architecture flow and which actions should be read-only versus editable.
- **Estimator:** Review how estimator access affects the system architecture flow and which actions should be read-only versus editable.
- **Installer:** Review how installer access affects the system architecture flow and which actions should be read-only versus editable.
- **Viewer:** Review how viewer access affects the system architecture flow and which actions should be read-only versus editable.

## Validation Checklist
- [ ] Validate checkpoint 1 for the System Architecture diagram during implementation or QA review.
- [ ] Validate checkpoint 2 for the System Architecture diagram during implementation or QA review.
- [ ] Validate checkpoint 3 for the System Architecture diagram during implementation or QA review.
- [ ] Validate checkpoint 4 for the System Architecture diagram during implementation or QA review.
- [ ] Validate checkpoint 5 for the System Architecture diagram during implementation or QA review.
- [ ] Validate checkpoint 6 for the System Architecture diagram during implementation or QA review.
- [ ] Validate checkpoint 7 for the System Architecture diagram during implementation or QA review.
- [ ] Validate checkpoint 8 for the System Architecture diagram during implementation or QA review.
- [ ] Validate checkpoint 9 for the System Architecture diagram during implementation or QA review.
- [ ] Validate checkpoint 10 for the System Architecture diagram during implementation or QA review.
- [ ] Validate checkpoint 11 for the System Architecture diagram during implementation or QA review.
- [ ] Validate checkpoint 12 for the System Architecture diagram during implementation or QA review.
- [ ] Validate checkpoint 13 for the System Architecture diagram during implementation or QA review.
- [ ] Validate checkpoint 14 for the System Architecture diagram during implementation or QA review.
- [ ] Validate checkpoint 15 for the System Architecture diagram during implementation or QA review.
- [ ] Validate checkpoint 16 for the System Architecture diagram during implementation or QA review.
- [ ] Validate checkpoint 17 for the System Architecture diagram during implementation or QA review.
- [ ] Validate checkpoint 18 for the System Architecture diagram during implementation or QA review.
- [ ] Validate checkpoint 19 for the System Architecture diagram during implementation or QA review.
- [ ] Validate checkpoint 20 for the System Architecture diagram during implementation or QA review.

## Notes for Future Updates
1. Keep system architecture note 1 synchronized with the live application behavior, API responses, and database rules.
2. Keep system architecture note 2 synchronized with the live application behavior, API responses, and database rules.
3. Keep system architecture note 3 synchronized with the live application behavior, API responses, and database rules.
4. Keep system architecture note 4 synchronized with the live application behavior, API responses, and database rules.
5. Keep system architecture note 5 synchronized with the live application behavior, API responses, and database rules.
6. Keep system architecture note 6 synchronized with the live application behavior, API responses, and database rules.
7. Keep system architecture note 7 synchronized with the live application behavior, API responses, and database rules.
8. Keep system architecture note 8 synchronized with the live application behavior, API responses, and database rules.
9. Keep system architecture note 9 synchronized with the live application behavior, API responses, and database rules.
10. Keep system architecture note 10 synchronized with the live application behavior, API responses, and database rules.
11. Keep system architecture note 11 synchronized with the live application behavior, API responses, and database rules.
12. Keep system architecture note 12 synchronized with the live application behavior, API responses, and database rules.
13. Keep system architecture note 13 synchronized with the live application behavior, API responses, and database rules.
14. Keep system architecture note 14 synchronized with the live application behavior, API responses, and database rules.
15. Keep system architecture note 15 synchronized with the live application behavior, API responses, and database rules.
16. Keep system architecture note 16 synchronized with the live application behavior, API responses, and database rules.
17. Keep system architecture note 17 synchronized with the live application behavior, API responses, and database rules.
18. Keep system architecture note 18 synchronized with the live application behavior, API responses, and database rules.
19. Keep system architecture note 19 synchronized with the live application behavior, API responses, and database rules.
20. Keep system architecture note 20 synchronized with the live application behavior, API responses, and database rules.
21. Keep system architecture note 21 synchronized with the live application behavior, API responses, and database rules.
22. Keep system architecture note 22 synchronized with the live application behavior, API responses, and database rules.
23. Keep system architecture note 23 synchronized with the live application behavior, API responses, and database rules.
24. Keep system architecture note 24 synchronized with the live application behavior, API responses, and database rules.
25. Keep system architecture note 25 synchronized with the live application behavior, API responses, and database rules.
