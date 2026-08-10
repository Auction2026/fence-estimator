import { createFormTab } from './tab-factory.js';

    export default createFormTab({
  "id": "project",
  "title": "1. Project",
  "description": "Project setup, customer record, and jobsite identification.",
  "fields": [
    {
      "name": "name",
      "label": "Project Name",
      "required": true
    },
    {
      "name": "customerName",
      "label": "Customer Name",
      "required": true
    },
    {
      "name": "address",
      "label": "Site Address",
      "required": true
    },
    {
      "name": "city",
      "label": "City"
    },
    {
      "name": "province",
      "label": "Province"
    },
    {
      "name": "postalCode",
      "label": "Postal Code"
    },
    {
      "name": "status",
      "label": "Status",
      "type": "select",
      "options": [
        {
          "value": "draft",
          "label": "Draft"
        },
        {
          "value": "quoted",
          "label": "Quoted"
        },
        {
          "value": "sold",
          "label": "Sold"
        }
      ]
    },
    {
      "name": "notes",
      "label": "Project Notes",
      "type": "textarea"
    }
  ]
});
