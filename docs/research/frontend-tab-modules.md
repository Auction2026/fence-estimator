# Frontend Tab Modules Analysis

We analyzed the `frontend/index.html` and extracted the following remaining tab logic into their respective module files:

1. **Permits (Tab 6):** Handles capturing permit numbers and status.
2. **Utilities (Tab 7):** Handles selecting utility locates (hydro, gas, etc.).
3. **Estimate (Tab 8):** Triggers PDF generation and price locking mechanisms.
4. **Contract (Tab 9):** Provides a canvas signature interface and displays contract totals.
5. **Extras (Tab 10):** Allows adding arbitrary extra costs to the estimate state.
6. **Crew (Tab 11):** Associates workers with roles for the project.
7. **Change Orders (Tab 12):** Logs change requests post-contract.
8. **Sign-Off (Tab 13):** Logs completion date and inspection checkboxes.
9. **Notes (Tab 14):** Arbitrary note capturing per project.
10. **Admin (Tab 15):** Displays dashboard metrics (mocked random values for now).
11. **Catalog (Tab 16):** Basic client-side searching of mock SKUs.
12. **Mapping (Tab 17):** Placeholder for future Map integration.

All handlers were exposed to `window` globally to support inline HTML `onclick` and `onsubmit` bindings present in `index.html`. 
Scripts were properly injected into the root `frontend/index.html` at the end of the `body` tag in the correct dependency order.
