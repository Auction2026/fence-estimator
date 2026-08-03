# Fence Depot Fence Estimator

**Status:** Final delivery package complete and ready for programmer handoff.

This repository now serves as the implementation blueprint for the production **Fence Depot Fence Estimator** system. The current HTML prototypes and research files remain available as references, while this document defines the build-phase scope, architecture, quality targets, and delivery expectations for the programmer who will implement the full system.

## Repository contents

- `/home/runner/work/fence-estimator/fence-estimator/index.html` - original single-file prototype
- `/home/runner/work/fence-estimator/fence-estimator/index-professional.html` - professional prototype layout
- `/home/runner/work/fence-estimator/fence-estimator/FENCE_MATERIAL_SPECIFICATIONS.md` - material and Canadian standards reference
- `/home/runner/work/fence-estimator/fence-estimator/MEGA_RESEARCH_SESSION_LOG.md` - market and labour research source
- `/home/runner/work/fence-estimator/fence-estimator/BACKUP_LOG.md` - prior design and backup notes

## Final delivery summary

The programmer handoff package must deliver:

1. Complete system specifications for all 17 tabs
2. Architecture, data model, API, and security blueprint
3. Implementation guidance for build, testing, and deployment
4. Full workflow requirements for estimating, fabrication, documents, and admin
5. QA requirements including 100+ tests, edge cases, and cross-platform checks
6. Documentation and training framework for admins, estimators, and crews

## Production scope

### Required system name

Use **Fence Depot Fence Estimator** everywhere:

- application title and branding
- login and dashboard screens
- browser title
- generated estimates, contracts, permits, and sign-off documents
- admin screens
- training and documentation

### Required tabs

The production system must contain these 17 tabs/modules:

1. Project Info
2. Fence Specifications
3. Fence Layout
4. Installation Breakdown
5. Shop Drawings / Gate Fabrication CAD
6. Permits
7. Locates Sheets
8. Estimate / Proposal
9. Contract
10. Extras & Special Items
11. Crew Installation Breakdown
12. Change Order
13. Completion Sign-Off
14. Notes & Special Items
15. Admin Control Panel
16. Fence Parts Catalog
17. Property Mapping

### Universal tutorial requirement

Every tab must include:

- a user-facing **Show Tutorials** toggle
- a saved per-user preference for tutorial visibility
- field-level tutorial dropdowns for every required input
- tutorial content covering:
  - what the field is
  - why it matters
  - what to enter
  - a valid example
  - common mistakes
  - pro tips

### Core business requirements

- 950+ SKU inventory/catalog integration
- full project-to-sign-off workflow support
- professional estimate, contract, permit, and completion documents
- gate fabrication drawing workflow with CAD-style output requirements
- admin-managed pricing, settings, templates, and permissions
- reusable notes, extras, and special-item handling
- training-ready UX for new estimators and fast mode for experienced estimators

## Architecture blueprint

### Recommended implementation

The build can be implemented with equivalent technologies, but the recommended baseline is:

- **Frontend:** TypeScript SPA
- **UI:** component-based tab workflow with responsive desktop/tablet/mobile layouts
- **Backend:** REST API service
- **Database:** PostgreSQL or equivalent relational database
- **File/PDF storage:** object storage for generated documents and attachments
- **Authentication:** role-based login for admin, estimator, office, and crew users

### High-level modules

- Authentication and user management
- Estimate/project workflow engine
- Inventory and pricing engine
- Drawing and fabrication data module
- Document generation module
- Admin configuration module
- Reporting and audit logging

### Suggested relational entities

Minimum database areas:

- users
- roles
- user_preferences
- customers
- projects
- project_sites
- project_tabs
- estimates
- estimate_line_items
- inventory_items
- suppliers
- gates
- gate_drawings
- permits
- locate_requests
- contracts
- change_orders
- completion_signoffs
- notes
- attachments
- audit_logs

### API surface

Minimum API groups:

- auth
- users/preferences
- customers/projects
- estimates/material calculations
- inventory/catalog search
- gate drawings/fabrication
- permits/locates
- contracts/change orders/sign-off
- reporting/admin settings

## Workflow expectations by module

- **Project Info:** customer, site, contact, scheduling, jurisdiction
- **Fence Specifications:** fence type, height, style, color, accessories, code requirements
- **Fence Layout:** measurements, corners, gates, terrain, drawing inputs
- **Installation Breakdown:** material, labour, equipment, concrete, waste, crew assumptions
- **Shop Drawings:** gate dimensions, hinges, latch, frame, hardware, fabrication output
- **Permits:** municipality requirements, forms, checklists, fees, approvals
- **Locates:** One Call/811 tracking, ticket numbers, validity windows, clearance status
- **Estimate / Proposal:** pricing, margins, options, taxes, alternate lines, customer-facing output
- **Contract:** legal terms, signatures, deposit rules, scope, exclusions
- **Extras / Special Items:** add-ons, exclusions, notes, allowances, contingencies
- **Crew Breakdown:** install instructions, crew notes, staging, equipment, safety items
- **Change Order:** scope changes, pricing changes, approvals, revision history
- **Completion Sign-Off:** punch list, acceptance, warranty acknowledgement, signatures
- **Notes & Special Items:** reusable templates, internal notes, customer notes
- **Admin Control Panel:** pricing locks, templates, permissions, catalog maintenance, branding
- **Fence Parts Catalog:** 950+ SKU lookup, supplier, cost, sell price, unit, status
- **Property Mapping:** parcel reference, imagery, measurements, geospatial notes

## Quality and security requirements

### Quality assurance

- document at least **100 test cases**
- cover happy path, validation, permissions, math accuracy, document output, and edge cases
- verify mobile responsiveness and modern browser compatibility
- verify calculation consistency across tab navigation and saved drafts

### Security

- role-based authorization on all sensitive actions
- server-side validation for all persisted inputs
- audit logging for pricing, approvals, and administrative edits
- secure handling of generated documents and attachments
- no hard-coded credentials, tokens, or private notification contacts in source control

### Performance

- responsive tab switching on standard office hardware
- inventory lookup fast enough for estimator workflows
- document generation suitable for same-session customer use

## Documentation and training package

The final build must ship with:

- System Architecture Guide
- Database Schema Documentation
- API Specification
- User Manual
- Admin Guide
- Estimator Guide
- Crew Guide
- six video tutorial outlines
- training materials and onboarding checklist

## Programmer handoff checklist

1. Review this README and the reference files in the repository
2. Confirm production technology choices
3. Build the system from the 17-tab scope above
4. Implement the universal tutorial system on every tab
5. Integrate the complete inventory catalog structure
6. Build document generation, admin controls, and workflow state handling
7. Execute and document 100+ tests
8. Prepare deployment, training, and handoff materials

## Notification handling

Project update emails were confirmed by the owner, but those addresses should be stored in deployment or project-management configuration, **not hard-coded in repository files**.

