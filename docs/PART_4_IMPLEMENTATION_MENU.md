
# Part 4 Implementation Menu

## Step 1 — Review the package structure
- Confirm the `frontend/`, `database/`, and `docs/` folders are present.
- Review `frontend/index.html` for the 17-tab layout.

## Step 2 — Prepare the frontend
- Change into `/home/runner/work/fence-estimator/fence-estimator/frontend`.
- Run `npm install` when dependency access is available.
- Start the static server with `npm run start`.

## Step 3 — Load the database package
- Apply `database/schema.sql`.
- Apply `database/seed.sql` for the product catalog.
- Track incremental rollouts through `database/migrations/`.

## Step 4 — Connect backend APIs
- Point the backend service at `http://localhost:3000/api`.
- Confirm authentication, project, estimate, contract, and product routes.

## Step 5 — Validate operational workflows
- Enter project info and fence specifications.
- Calculate an estimate.
- Review contract, change order, notes, and mapping tabs.

## Step 6 — Hand off the deliverables
- Share the frontend folder with the implementation team.
- Provide the docs folder for setup and troubleshooting.
- Archive the schema, seed, and procedure scripts with the deployment package.
