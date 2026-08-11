# Repository Index

This index lists the application and documentation files in the repository, organized by directory. `.git/` internals are intentionally excluded because they are version-control metadata rather than project source or reference material.

## Repository root

- `BACKUP_LOG.md` - Historical backup notes for repository content and recovery activity.
- `FENCE_MATERIAL_SPECIFICATIONS.md` - Material reference document for fence components, options, and specification details.
- `MEGA_RESEARCH_SESSION_LOG.md` - Long-form research and discovery notes captured during prior project exploration.
- `index-professional.html` - Alternative polished prototype frontend showcasing the estimator UI.
- `index.html` - Root prototype frontend for the Fence Depot estimator in static HTML/CSS/JS.

## backend

- `backend/.env.example` - Example backend environment configuration template.
- `backend/package.json` - Backend package manifest with scripts and Node dependencies.
- `backend/server.js` - Express backend sample containing models, auth, routes, and calculation logic.

## docs

- `docs/API_DOCUMENTATION.md` - REST API reference for auth, projects, estimates, inventory, contracts, change orders, notes, and sign-offs.
- `docs/DATABASE_SCHEMA.md` - Target PostgreSQL schema, relationships, indexes, and common queries.
- `docs/INDEX.md` - Directory-by-directory index of repository files and their purpose.
- `docs/PART_4_IMPLEMENTATION_MENU.md` - Detailed implementation and deployment setup guide.
- `docs/PART_5_TROUBLESHOOTING_GUIDE.md` - Comprehensive troubleshooting catalog with 110+ issues and solutions.
- `docs/README.md` - Documentation overview, feature summary, and navigation entry point.
- `docs/SETUP_GUIDE.md` - Fast-start installation guide and environment reference.
- `docs/VIEWING_GUIDE.md` - Instructions for opening, navigating, and reviewing the repository and app locally.

## docs/WIRE_GRIDS

- `docs/WIRE_GRIDS/AUTHENTICATION_FLOW.md` - ASCII diagram of the login, token, and protected-route flow.
- `docs/WIRE_GRIDS/CALCULATION_FLOW.md` - ASCII diagram of estimate calculation inputs and outputs.
- `docs/WIRE_GRIDS/CHANGE_ORDER_FLOW.md` - ASCII diagram of the change-order approval workflow.
- `docs/WIRE_GRIDS/DATABASE_RELATIONSHIPS.md` - ASCII ERD summary of the core application tables.
- `docs/WIRE_GRIDS/DATA_FLOW_DIAGRAM.md` - ASCII diagram of data flow from browser input through database response.
- `docs/WIRE_GRIDS/PRICING_LOCK_FLOW.md` - ASCII diagram of estimate approval and price-lock behavior.
- `docs/WIRE_GRIDS/PROJECT_LIFECYCLE.md` - ASCII state model for project progression and hold/cancel branches.
- `docs/WIRE_GRIDS/SYSTEM_ARCHITECTURE.md` - ASCII architecture overview of browser, frontend, backend, and PostgreSQL layers.
- `docs/WIRE_GRIDS/TAB_DEPENDENCIES.md` - ASCII dependency map showing which workflow tabs feed others.
- `docs/WIRE_GRIDS/USER_WORKFLOW.md` - ASCII 17-tab workflow from intake through mapping and admin support.

## frontend

- `frontend/index.html` - Main 17-tab frontend application shell for the estimator workspace.
- `frontend/package.json` - Frontend package manifest with local serving and development scripts.

## frontend/css

- `frontend/css/responsive.css` - Responsive layout overrides for tablet and mobile viewports.
- `frontend/css/styles.css` - Primary desktop and shared visual styling for the frontend interface.

## frontend/js

- `frontend/js/api.js` - Client-side API wrapper for backend requests and authentication headers.
- `frontend/js/app.js` - Frontend bootstrap logic that initializes the application and shared state.
- `frontend/js/calculations.js` - Estimate and pricing calculation helpers used by the UI.
- `frontend/js/storage.js` - Local persistence helpers for draft or session data.
- `frontend/js/ui.js` - Shared UI behaviors such as navigation, status updates, and rendering helpers.
- `frontend/js/validation.js` - Client-side form validation utilities for estimator inputs.

## frontend/js/tabs

- `frontend/js/tabs/tab1-project.js` - Tab 1 logic for project information entry and persistence.
- `frontend/js/tabs/tab10-extras.js` - Tab 10 logic for optional extras and add-on items.
- `frontend/js/tabs/tab11-crew.js` - Tab 11 logic for crew planning and execution assignments.
- `frontend/js/tabs/tab12-changeorder.js` - Tab 12 logic for change-order creation and tracking.
- `frontend/js/tabs/tab13-signoff.js` - Tab 13 logic for closeout, signatures, and sign-off workflow.
- `frontend/js/tabs/tab14-notes.js` - Tab 14 logic for project notes and commentary.
- `frontend/js/tabs/tab15-admin.js` - Tab 15 logic for admin dashboard actions and privileged views.
- `frontend/js/tabs/tab16-catalog.js` - Tab 16 logic for product catalog browsing and editing.
- `frontend/js/tabs/tab17-mapping.js` - Tab 17 logic for mapping, geolocation, and site context tools.
- `frontend/js/tabs/tab2-specs.js` - Tab 2 logic for fence specification inputs.
- `frontend/js/tabs/tab3-layout.js` - Tab 3 logic for layout dimensions and segment management.
- `frontend/js/tabs/tab4-installation.js` - Tab 4 logic for installation details and labor inputs.
- `frontend/js/tabs/tab5-drawings.js` - Tab 5 logic for drawings and shop-sketch workflows.
- `frontend/js/tabs/tab6-permits.js` - Tab 6 logic for permit requirements and permit cost inputs.
- `frontend/js/tabs/tab7-utilities.js` - Tab 7 logic for utility locate and clearance tracking.
- `frontend/js/tabs/tab8-estimate.js` - Tab 8 logic for automatic estimate calculation and presentation.
- `frontend/js/tabs/tab9-contract.js` - Tab 9 logic for contract generation and price-lock actions.

## frontend/js/tools

- `frontend/js/tools/drawing.js` - Reusable drawing helper utilities for layout and sketch features.
- `frontend/js/tools/export.js` - Reusable export helpers for PDF, JSON, or other output formats.
- `frontend/js/tools/mapping.js` - Reusable mapping helper utilities for geographic display and lookups.
- `frontend/js/tools/printing.js` - Reusable print-format and print-trigger helper utilities.

## Recommended reading order

1. `docs/README.md`
2. `docs/SETUP_GUIDE.md`
3. `docs/PART_4_IMPLEMENTATION_MENU.md`
4. `docs/API_DOCUMENTATION.md`
5. `docs/DATABASE_SCHEMA.md`
6. `docs/WIRE_GRIDS/` diagrams
7. `docs/PART_5_TROUBLESHOOTING_GUIDE.md`
