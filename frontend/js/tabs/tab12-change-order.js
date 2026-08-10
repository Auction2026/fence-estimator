import { createFormTab } from './tab-factory.js';

    export default createFormTab({
  "id": "change-order",
  "title": "12. Change Order",
  "description": "Scope adjustments, pricing updates, and approval trail.",
  "fields": [
    {
      "name": "changeReason",
      "label": "Change Reason"
    },
    {
      "name": "requestedBy",
      "label": "Requested By"
    },
    {
      "name": "changeValue",
      "label": "Change Value",
      "type": "number"
    },
    {
      "name": "scheduleImpact",
      "label": "Schedule Impact"
    },
    {
      "name": "changeNotes",
      "label": "Change Notes",
      "type": "textarea"
    }
  ]
});
