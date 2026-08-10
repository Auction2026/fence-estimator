import { createFormTab } from './tab-factory.js';

    export default createFormTab({
  "id": "utilities",
  "title": "7. Utilities",
  "description": "Locate requests, one-call references, and buried obstacle notes.",
  "fields": [
    {
      "name": "locateProvider",
      "label": "Locate Provider"
    },
    {
      "name": "ticketNumber",
      "label": "Ticket Number"
    },
    {
      "name": "expiryDate",
      "label": "Expiry Date",
      "type": "date"
    },
    {
      "name": "privateLocate",
      "label": "Private Locate Needed",
      "type": "select",
      "options": [
        {
          "value": "no",
          "label": "No"
        },
        {
          "value": "yes",
          "label": "Yes"
        }
      ]
    },
    {
      "name": "utilityNotes",
      "label": "Utility Notes",
      "type": "textarea"
    }
  ]
});
