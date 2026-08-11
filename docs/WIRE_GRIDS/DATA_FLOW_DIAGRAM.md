
# Data Flow Diagram

```text
User enters data
   |
   v
Frontend form state (vanilla JS)
   |
   | validate required fields
   v
Build request payload
   |
   | fetch('/api/...', { headers, body })
   v
Express route handler
   |
   | auth middleware -> validation -> business logic
   v
Service / controller logic
   |
   | SQL SELECT / INSERT / UPDATE
   v
PostgreSQL tables
   |
   | rows returned / transaction committed
   v
Backend response formatter
   |
   | 200/201 success or 4xx/5xx error
   v
Frontend response handler
   |
   +--> success: update UI, totals, lock state, local cache
   |
   +--> error: show banner, field messages, retry option
```

## Error flow
```text
User action
   -> frontend validation fails -> show field errors, do not call API
   -> API validation fails -> display server message next to form
   -> DB error occurs -> backend logs error -> safe JSON error returned
   -> network error occurs -> frontend shows retry / offline message
```
