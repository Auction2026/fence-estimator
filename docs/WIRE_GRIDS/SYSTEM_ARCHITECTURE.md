
# System Architecture

```text
+------------------------------+
|         User Browser         |
|  Chrome / Edge / Firefox     |
+--------------+---------------+
               |
               | HTTPS / HTTP
               v
+------------------------------+
|        Frontend Layer        |
|  HTML + CSS + Vanilla JS     |
|  Tabs, forms, calculators,   |
|  localStorage, fetch()       |
+--------------+---------------+
               |
               | JSON API calls
               v
+------------------------------+
|        Backend API           |
|    Node.js + Express         |
|  Auth, validation, pricing,  |
|  PDF/email, business rules   |
+--------------+---------------+
               |
               | SQL queries / transactions
               v
+------------------------------+
|      PostgreSQL Database     |
| users, projects, estimates,  |
| inventory, contracts, notes  |
+------------------------------+
```

## Key connections
- Browser → Frontend: renders the 17-tab estimating workflow.
- Frontend → Backend: sends authenticated REST requests with JWT headers.
- Backend → PostgreSQL: reads and writes project, pricing, contract, and audit data.
- Backend → Frontend: returns JSON responses, validation errors, and locked-price state.
