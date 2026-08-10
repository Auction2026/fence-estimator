import { createFormTab } from './tab-factory.js';

    export default createFormTab({
  "id": "admin",
  "title": "15. Admin",
  "description": "Taxes, margins, company defaults, and deployment settings.",
  "fields": [
    {
      "name": "salesRep",
      "label": "Sales Representative"
    },
    {
      "name": "taxRate",
      "label": "Tax Rate",
      "type": "number"
    },
    {
      "name": "overheadRate",
      "label": "Overhead Rate",
      "type": "number"
    },
    {
      "name": "profitRate",
      "label": "Profit Rate",
      "type": "number"
    },
    {
      "name": "adminNotes",
      "label": "Admin Notes",
      "type": "textarea"
    }
  ]
});
