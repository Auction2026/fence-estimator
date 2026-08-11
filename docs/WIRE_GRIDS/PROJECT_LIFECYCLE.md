
# Project Lifecycle

```text
Draft
  |  project created
  v
Active
  |  enough customer + site data collected
  v
Estimated
  |  estimate generated and saved
  v
Contracted
  |  estimate approved + price locked + contract issued
  v
In Progress
  |  crew scheduled / field work starts
  v
Completed

Optional side states:
Active -------> On Hold
Estimated ----> Cancelled
Contracted ---> On Hold
In Progress --> On Hold
On Hold ------> Active / In Progress
Any pre-completion state --> Cancelled
```

## Transition triggers
- **Draft → Active:** project information and basic job scope are complete.
- **Active → Estimated:** estimate tab successfully calculates and saves pricing.
- **Estimated → Contracted:** manager approves pricing and the contract is generated.
- **Contracted → In Progress:** crew, schedule, and material commitments are assigned.
- **In Progress → Completed:** sign-off, final notes, and closeout items are finished.
- **Any open state → On Hold:** customer, permit, weather, or supply delays pause the job.
- **Any non-complete state → Cancelled:** the customer withdraws or management terminates the project.
