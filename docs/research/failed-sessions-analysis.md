# Failed Sessions Analysis: `fix-long-request-denied-error`

**Date:** July 16, 2026  
**Branch:** `copilot/fix-long-request-denied-error`  
**Sessions affected:** 5+ sessions (8bd9af45, cece8801, f267e6de, 65897e10, 491d8103, 8f0a5b1a)

---

## Root Cause

Every session **correctly identified and implemented the fix**, but the work was never merged. The cycle broke at the final step every time.

### Why it looped:

1. Each new Copilot session clones the **default branch** (`main`), not the fix branch.
2. The fix branch `copilot/fix-long-request-denied-error` existed remotely with the correct changes, but was never merged to `main`.
3. Because `main` still had the unfixed code, the next session would detect the bug, do the same work again, and stop before creating a PR.
4. `runtime-tools-create_pull_request` was **never called** in any of the fix sessions — each session ended by committing and pushing to the branch, but never opened the actual PR for merge.

### Secondary symptom observed:
- One session encountered `MCP server 'playwright': TimeoutError: The operation was aborted due to timeout` — a browser testing timeout that may have caused the session to stop early.
- Sessions completed all checklist items (maxlength added, counters added, secrets scanned) but the final create-PR step was missing from the plan.

---

## The Actual Bug

`index-professional.html` contains **18 unbounded `<textarea>` elements** — no `maxlength` attribute. When a user types a long note and the form is saved/submitted, the payload exceeds a safe HTTP request size, triggering a server-side "Request Denied" (413 / 400) error.

### Affected textareas:
| ID | Description |
|----|-------------|
| `installNotes` | Installation site notes |
| `permitNotes` | Permit conditions |
| `locateNotes` | Utility locate notes |
| `specialNotes` | Special scope items |
| `contractNotes` | Contract terms |
| `siteLayout` | Site layout description |
| `shopDrawingNotes` | Shop drawing notes |
| `installerSiteLayout` | Installer site layout |
| `dailyProgress` | Daily progress log |
| `dailyIssues` | Daily issues log |
| `installerSpecialNotes` | Installer special notes (readonly) |
| `installerUtilitiesFound` | Utilities found on site |
| `changeOrder` | Change order description |
| `customerFeedback` | Customer feedback |
| `customerNotes` | Customer special instructions |

---

## The Fix (Now Applied)

- Added `maxlength="2000"` to all unbounded textareas in `index-professional.html`
- Added a live `<span>` character counter below each textarea showing `X / 2000`
- The counter turns **orange at 1800** (90%) and **red at 2000** (at the limit) to warn users before and at the hard cap
- A shared `TEXTAREA_MAX` constant (value: `2000`) and `TEXTAREA_WARN` constant (value: `1800`) are defined in the JS block for easy future adjustment

---

## How to Prevent This in Future Sessions

1. **Always end a fix session with `runtime-tools-create_pull_request`** — committing to the branch is not enough; an actual PR must be opened and merged.
2. **Verify the fix is in `main`** before closing a session — run `git log origin/main --oneline | head -5` to confirm the merged commit appears.
3. When a branch already exists for a fix, **start the session on that branch** by specifying the branch name in the task prompt.

---

## Related Files

- `index-professional.html` — primary app file (fix applied here)
- `index.html` — deprecated; see redirect notice in file header
- `docs/research/` — all session findings should be written here going forward

---

## Docs/Research Convention

**Going forward, every research or analysis session must write findings to `docs/research/<topic>.md`** before closing. This prevents re-doing the same research in future sessions.

Naming convention: `docs/research/<kebab-case-topic>.md`  
Examples:
- `docs/research/master-halco-catalog.md`
- `docs/research/canadian-fence-standards.md`
- `docs/research/chamberlain-gate-parts.md`
- `docs/research/failed-sessions-analysis.md` ← this file
