import { createFormTab } from './tab-factory.js';

    export default createFormTab({
  "id": "permits",
  "title": "6. Permits",
  "description": "Permit tracking, municipality contact, and submission status.",
  "fields": [
    {
      "name": "municipality",
      "label": "Municipality"
    },
    {
      "name": "permitType",
      "label": "Permit Type"
    },
    {
      "name": "applicationNumber",
      "label": "Application Number"
    },
    {
      "name": "permitStatus",
      "label": "Permit Status",
      "type": "select",
      "options": [
        {
          "value": "not-required",
          "label": "Not Required"
        },
        {
          "value": "pending",
          "label": "Pending"
        },
        {
          "value": "submitted",
          "label": "Submitted"
        },
        {
          "value": "approved",
          "label": "Approved"
        }
      ]
    },
    {
      "name": "permitNotes",
      "label": "Permit Notes",
      "type": "textarea"
    }
  ]
});
