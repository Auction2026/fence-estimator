import { createFormTab } from './tab-factory.js';

    export default createFormTab({
  "id": "crew-breakdown",
  "title": "11. Crew Breakdown",
  "description": "Labour assignments, safety coverage, and daily targets.",
  "fields": [
    {
      "name": "leadInstaller",
      "label": "Lead Installer"
    },
    {
      "name": "foremanHours",
      "label": "Foreman Hours",
      "type": "number"
    },
    {
      "name": "installerHours",
      "label": "Installer Hours",
      "type": "number"
    },
    {
      "name": "labourerHours",
      "label": "Labourer Hours",
      "type": "number"
    },
    {
      "name": "crewNotes",
      "label": "Crew Notes",
      "type": "textarea"
    }
  ]
});
