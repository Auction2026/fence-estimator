# Troubleshooting Guide

## Frontend shows blank content
- Confirm all files under `/home/runner/work/fence-estimator/fence-estimator/frontend/js/` are being served.
- Open the browser console and verify that `window.FenceEstimator` exists.

## Estimate totals stay at zero
- Save the project and specs tabs first.
- Ensure `linearFeet` is greater than zero.
- Use the **Recalculate** button on the Specs tab.

## Backend tests fail
- Run `cd backend && npm install` before `npm test`.
- Ensure your Node version matches the backend package requirements.

## Database scripts fail
- Create the database first.
- Apply `schema.sql` before indexes, procedures, and seed data.
- Verify `pgcrypto` is available for UUID generation.
