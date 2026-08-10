import { createFormTab } from './tab-factory.js';

    export default createFormTab({
  "id": "sign-off",
  "title": "13. Sign-off",
  "description": "Customer acceptance, internal review, and completion status.",
  "fields": [
    {
      "name": "customerApprovedBy",
      "label": "Customer Approved By"
    },
    {
      "name": "customerApprovedDate",
      "label": "Approval Date",
      "type": "date"
    },
    {
      "name": "salesApprovedBy",
      "label": "Sales Approved By"
    },
    {
      "name": "operationsApprovedBy",
      "label": "Operations Approved By"
    },
    {
      "name": "signoffNotes",
      "label": "Sign-off Notes",
      "type": "textarea"
    }
  ]
});
