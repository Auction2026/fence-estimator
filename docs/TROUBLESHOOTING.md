# Troubleshooting Guide

## Server does not start
- Verify Node.js 18+ is installed.
- Confirm port `3000` is free or set `PORT` before running `npm start`.

## Browser shows local fallback mode
- The frontend automatically switches to browser storage when the backend is unreachable.
- Start `npm start` and refresh the page to reconnect to the API.

## Estimate totals look wrong
- Check the Estimate tab values for `linearFeet`, `heightFeet`, `gates`, `overheadRate`, and `profitRate`.
- Compare frontend and backend results; both share the same calculation assumptions.

## Project saves but does not persist after restart
- The delivered server uses an in-memory repository to keep the PR scope minimal.
- Apply the SQL files and connect a persistent adapter for long-term storage.

## Map preview is blank
- Confirm the browser can load OpenStreetMap embeds.
- Enter valid latitude and longitude values in the Mapping tab.
