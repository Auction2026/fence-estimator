# TROUBLESHOOTING GUIDE

> Use this guide for frontend issues, API problems, database failures, PDF or email trouble, and performance or browser problems.

## 1. Quick triage checklist

1. Identify whether the failure is in the browser, API, database, or infrastructure layer.
2. Check `http://localhost:5000/api/health`.
3. Review browser console errors.
4. Review backend startup and request logs.
5. Compare active environment variables to expected values.

## 2. Common frontend errors and fixes

### Blank page on load
- Confirm `frontend/js/app.js` loads successfully.
- Confirm CSS and JS paths are correct when served by nginx or a local file server.
- Check for JavaScript syntax errors in the browser console.

### Tab buttons do not switch panels
- Verify the `onclick` handlers still point to existing functions.
- Check whether earlier JavaScript errors prevented initialization.
- Reload with cache disabled after editing frontend assets.

### Estimate totals remain zero
- Save fence specs before expecting totals to update.
- Make sure `linearFeet` is populated with a numeric value.
- Verify the browser is not holding stale localStorage data.

### Local data disappears
- Check whether private browsing mode blocks localStorage.
- Confirm `logout()` or a storage-clearing action was not triggered.
- Inspect the `fenceEstimatorState` item in developer tools.

### Layout or responsiveness looks broken
- Confirm both `styles.css` and `responsive.css` are loading.
- Test at multiple viewport widths.
- Watch for wide canvases or tables overflowing the container.

## 3. Backend connection issues

### Server does not start
- Run the backend from `/home/runner/work/fence-estimator/fence-estimator/backend`.
- Install dependencies with `npm install`.
- Check for port conflicts on `PORT`.

### MongoDB connection timeout
- Verify `MONGO_URI`.
- Check network access, credentials, and cluster allow lists.
- Confirm a local `mongod` process is running if using localhost.

### 401 Unauthorized on protected routes
- Send `Authorization: ******
- Re-authenticate if the token expired.
- Confirm all app instances share the same `JWT_SECRET`.

### 404 on known route
- Confirm the HTTP method as well as the path.
- Keep the `/api` prefix when calling the backend directly or through a proxy.
- Verify reverse proxy rules are not rewriting the route incorrectly.

### 500 errors
- Inspect backend logs for stack traces or validation details.
- Confirm referenced `projectId` or `estimateNumber` values exist.
- Check MongoDB availability and document constraints.

## 4. Database errors

### Duplicate key errors on user creation
- Username or email already exists.
- Query the `users` collection to confirm duplicates.
- Use a different identifier or create an admin merge workflow.

### Project not found
- Verify the exact `projectId`.
- Confirm the app points to the expected environment database.
- Make sure the project was not created in another environment.

### Estimate not found during contract creation
- Confirm the estimate number exists first.
- Query estimates by project before calling the contract endpoint.
- Check for stale data after test database resets.

### Slow queries or dashboards
- Add compound indexes for common filters.
- Introduce pagination before record counts grow too large.
- Review query patterns and database metrics.

### Restore appears incomplete
- Restore into staging first.
- Compare collection counts before and after restore.
- Confirm index rebuild completion.

## 5. PDF generation problems

### No PDF appears after generation
- Confirm the production workflow actually generates PDFs server-side or browser-side in your environment.
- Verify pdfkit is installed if the backend handles generation.
- Confirm output paths or stream destinations are valid.

### PDF content is missing sections
- Check the data binding inputs used to populate the document.
- Make sure estimate and contract data were saved before generation.
- Review long notes or descriptions for truncation logic.

### PDF works locally but not in a container
- Verify writable paths or direct streaming behavior.
- Include any fonts or templates in the image.
- Check runtime permissions on mounted volumes.

## 6. Email sending issues

### SMTP authentication failure
- Recheck `EMAIL_USER` and `EMAIL_PASSWORD`.
- Use app passwords when required by the provider.
- Confirm the sender account allows SMTP access.

### Connection refused to the SMTP host
- Verify `EMAIL_HOST` and `EMAIL_PORT`.
- Check outbound firewall or egress restrictions.
- Test from the deployment environment, not just your workstation.

### Messages land in spam
- Configure SPF, DKIM, and DMARC.
- Use a domain that matches the sending provider configuration.
- Prefer transactional email providers for production.

## 7. Performance problems

### Slow initial page load
- Reduce work executed immediately on `DOMContentLoaded`.
- Defer non-critical assets if you add more frontend code.
- Measure before optimizing.

### Repeated estimate recalculation feels slow
- Keep calculation logic centralized.
- Avoid recalculating all totals for every keystroke if you extend the UI.
- Cache catalog or inventory lookups if those integrations grow.

### API latency spikes
- Check MongoDB latency and connection health.
- Review logs for bursts, retries, or failing clients.
- Scale API instances only after confirming the database is not the bottleneck.

## 8. Browser compatibility

### Chrome works but Safari does not
- Test canvas, upload, and localStorage behavior in Safari.
- Watch for CSS layout differences.
- Check the browser console for blocked features.

### Corporate browser blocks scripts or storage
- Serve the app over HTTP/HTTPS rather than `file://` if policy requires it.
- Coordinate allow-listing with the IT team.
- Verify security products are not stripping scripts.

### Mobile keyboard breaks layout
- Avoid fixed-height containers that clip forms.
- Test on both iOS and Android.
- Recheck responsive rules around wide tables and canvases.

## 9. Useful diagnostic commands

### Backend health check
```bash
curl http://localhost:5000/api/health
```

### Show configured Mongo URI
```bash
cd /home/runner/work/fence-estimator/fence-estimator/backend
node -e "require('dotenv').config(); console.log(process.env.MONGO_URI)"
```

### Run unit tests
```bash
cd /home/runner/work/fence-estimator/fence-estimator/backend
npx jest ../tests/calculations.test.js ../tests/validation.test.js --runInBand
```

## 10. Escalation guidance

- If contracts or signed documents are affected, preserve evidence before retrying.
- If secrets may be wrong or exposed, rotate them.
- If data integrity is uncertain, pause write traffic before experimenting.
- If the problem spans environments, diff config, image versions, and database targets first.
## 11. Symptom-to-layer matrix

| Symptom | Most likely layer | First check |
| --- | --- | --- |
| Blank browser page | Frontend asset load | Browser console and network tab |
| 401 Unauthorized | Auth/API | Authorization header and JWT secret |
| Contract creation fails | API/data | Estimate lookup and database state |
| Slow project list | Database/query pattern | Indexes and query volume |
| Missing email | SMTP integration | EMAIL_* vars and provider logs |
| No map tiles | Third-party integration | Google Maps key and billing |

## 12. Recovery playbooks

### Recover from wrong environment variables
1. Stop the affected process or deployment.
2. Compare values with the expected environment sheet.
3. Correct the variables in the secret store or `.env`.
4. Restart the service.
5. Re-run health checks and a small smoke test.

### Recover from a bad restore
1. Stop write traffic.
2. Compare backup timestamps and record counts.
3. Restore into staging and validate.
4. Only then repeat the restore into production if needed.
5. Document impact and timeline.

### Recover from broken frontend deployment
1. Validate static files exist in the deployed artifact.
2. Confirm nginx or host routing rules.
3. Roll back to the previous static bundle if necessary.
4. Re-run a browser smoke test after rollback.

## 13. Preventive maintenance

- Review dependency versions quarterly.
- Test backups and restores on a schedule.
- Recheck rate limiting and auth policy before exposing the app broadly.
- Keep calculator and validation helper tests green.
- Reconfirm SMTP and map-provider credentials after account changes.

