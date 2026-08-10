import { createFormTab } from './tab-factory.js';

    export default createFormTab({
  "id": "extras",
  "title": "10. Extras",
  "description": "Accessories, demolition, hauling, and optional add-ons.",
  "fields": [
    {
      "name": "tearOutFeet",
      "label": "Tear-out Feet",
      "type": "number"
    },
    {
      "name": "haulAway",
      "label": "Haul Away Included",
      "type": "select",
      "options": [
        {
          "value": "yes",
          "label": "Yes"
        },
        {
          "value": "no",
          "label": "No"
        }
      ]
    },
    {
      "name": "privacySlats",
      "label": "Privacy Slats",
      "type": "select",
      "options": [
        {
          "value": "none",
          "label": "None"
        },
        {
          "value": "standard",
          "label": "Standard"
        },
        {
          "value": "premium",
          "label": "Premium"
        }
      ]
    },
    {
      "name": "extrasNotes",
      "label": "Extras Notes",
      "type": "textarea"
    }
  ]
});
