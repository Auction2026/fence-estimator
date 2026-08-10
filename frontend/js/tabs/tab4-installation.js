import { createFormTab } from './tab-factory.js';

    export default createFormTab({
  "id": "installation",
  "title": "4. Installation",
  "description": "Installation schedule, crew timing, and sequencing requirements.",
  "fields": [
    {
      "name": "targetStart",
      "label": "Target Start Date",
      "type": "date"
    },
    {
      "name": "targetFinish",
      "label": "Target Finish Date",
      "type": "date"
    },
    {
      "name": "crewSize",
      "label": "Crew Size",
      "type": "number"
    },
    {
      "name": "equipment",
      "label": "Equipment Needed"
    },
    {
      "name": "stagingNotes",
      "label": "Staging Notes",
      "type": "textarea"
    }
  ]
});
