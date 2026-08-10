import { createFormTab } from './tab-factory.js';

    export default createFormTab({
  "id": "notes",
  "title": "14. Notes",
  "description": "Centralized call notes, RFIs, site concerns, and reminders.",
  "fields": [
    {
      "name": "internalNotes",
      "label": "Internal Notes",
      "type": "textarea"
    },
    {
      "name": "customerNotes",
      "label": "Customer Notes",
      "type": "textarea"
    },
    {
      "name": "handoffNotes",
      "label": "Handoff Notes",
      "type": "textarea"
    }
  ]
});
