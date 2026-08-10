import { createFormTab } from './tab-factory.js';

    export default createFormTab({
  "id": "specs",
  "title": "2. Specs",
  "description": "Fence system, dimensions, colour, and code-driven constraints.",
  "fields": [
    {
      "name": "fenceType",
      "label": "Fence Type",
      "type": "select",
      "options": [
        {
          "value": "chain-link",
          "label": "Chain Link"
        },
        {
          "value": "wood",
          "label": "Wood"
        },
        {
          "value": "vinyl",
          "label": "Vinyl"
        },
        {
          "value": "ornamental",
          "label": "Ornamental"
        },
        {
          "value": "composite",
          "label": "Composite"
        }
      ]
    },
    {
      "name": "heightFeet",
      "label": "Height (ft)",
      "type": "number"
    },
    {
      "name": "linearFeet",
      "label": "Linear Feet",
      "type": "number"
    },
    {
      "name": "color",
      "label": "Colour / Finish"
    },
    {
      "name": "gateCount",
      "label": "Gate Count",
      "type": "number"
    },
    {
      "name": "complianceNotes",
      "label": "Compliance Notes",
      "type": "textarea"
    }
  ]
});
