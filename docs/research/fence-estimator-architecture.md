# Fence Estimator Architecture

This app is a single-file HTML SPA with inline CSS and JavaScript. It persists a unified browser-side state object to `localStorage`, renders a 17-tab workflow UI, and uses an embedded `INVENTORY_DB` for material-driven estimate calculations.

Key layers:
- **Presentation:** landing page, login gate, responsive tabbed workspace, and print-friendly estimate/contract views.
- **State management:** one serialized `state` object for project, specs, estimate, contract, admin settings, drawings, notes, and mapping.
- **Calculation engine:** converts fence selections and footage into line items, labor, equipment, margin, tax, and proposal totals.
- **Workflow outputs:** estimate, contract with pricing lock snapshot, crew sheet, permit/locate records, change orders, and closeout.
- **Utilities:** canvas layout drawing, searchable parts catalog, form validation, auto-save, and optional Google Maps integration.
