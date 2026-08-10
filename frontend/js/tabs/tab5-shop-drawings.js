import { createFormTab } from './tab-factory.js';

    export default createFormTab({
  "id": "shop-drawings",
  "title": "5. Shop Drawings",
  "description": "Cut sheets, elevation notes, and fabrication details.",
  "fields": [
    {
      "name": "drawingRevision",
      "label": "Drawing Revision"
    },
    {
      "name": "fabricationLeadTime",
      "label": "Fabrication Lead Time"
    },
    {
      "name": "specialFabrication",
      "label": "Special Fabrication",
      "type": "textarea"
    },
    {
      "name": "approvals",
      "label": "Approvals Needed",
      "type": "textarea"
    }
  ]
});
