# DATABASE_SCHEMA_GUIDE

> Database model: MongoDB documents via Mongoose
> Source file: `/home/runner/work/fence-estimator/fence-estimator/backend/server.js`

## 1. Entity relationship description

1. A user owns projects as the estimator.
2. A project is the main customer and site record.
3. Fence specs store dimensional and product-related inputs for a project.
4. Estimates store pricing snapshots for a project.
5. Contracts lock pricing for an accepted estimate.
6. Change orders record authorized post-contract deltas.
7. Sign-offs close the loop at job completion.
8. Notes store reusable knowledge or standardized note blocks.

## 2. Relationship map

```text
User --< Project --< Estimate --< Contract --< ChangeOrder
  \            \                         \
   \            \--< FenceSpecs           \--< SignOff
    \--< Notes
```

## 3. Collection `users`

| Column / field | Type | Constraints | Description |
| --- | --- | --- | --- |
| `username` | String | required, unique, trim, minlength 3 | User-facing login name. |
| `email` | String | required, unique, lowercase, regex email check | Primary authentication email. |
| `password` | String | required, bcrypt-hashed in pre-save hook | Credential secret. |
| `role` | String | enum admin|estimator|crew, default estimator | Authorization role. |
| `company` | String | required | Company name. |
| `phone` | String | optional | Contact number. |
| `createdAt` | Date | default Date.now | Creation timestamp. |
| `updatedAt` | Date | default Date.now | Update timestamp. |

### Relationship notes
- Referenced by project ownership, note authorship, and estimate creation metadata.
- Passwords are hashed before save.

## 4. Collection `projects`

| Column / field | Type | Constraints | Description |
| --- | --- | --- | --- |
| `projectId` | String | required, unique | Project identifier used across records. |
| `customerName` | String | required | Customer full name. |
| `customerEmail` | String | required, lowercase | Customer email. |
| `customerPhone` | String | required | Customer phone. |
| `address` | String | required | Street address. |
| `city` | String | required | City. |
| `province` | String | required | Province or state. |
| `postalCode` | String | required | Postal or ZIP code. |
| `propertySize` | String | optional | Site size text. |
| `projectNotes` | String | optional | Estimator notes. |
| `photos` | [String] | optional | Photo references. |
| `estimator` | ObjectId | required, ref User | Owning estimator. |
| `status` | String | enum draft|estimate|contract|active|completed | Lifecycle stage. |
| `createdAt` | Date | default Date.now | Creation timestamp. |
| `updatedAt` | Date | default Date.now | Update timestamp. |

### Relationship notes
- Acts as the parent business record for quoting and delivery.
- Uses `projectId` as a stable cross-collection identifier.

## 5. Collection `fencespecs`

| Column / field | Type | Constraints | Description |
| --- | --- | --- | --- |
| `projectId` | String | required, indexed | Links specs to a project. |
| `fenceType` | String | required, enum | Fence material or style. |
| `height` | Number | required | Fence height. |
| `color` | String | optional | Fence color. |
| `postGauge` | Number | optional | Post wall gauge. |
| `postDiameter` | Number | optional | Post diameter. |
| `gateType` | String | enum, default None | Gate style. |
| `barchedWire` | Boolean | default false | Barbed wire option. |
| `installationType` | String | enum, default Residential | Install complexity. |
| `linearFeet` | Number | required | Fence length. |
| `numberPosts` | Number | required | Post count. |
| `numberGates` | Number | default 0 | Gate count. |
| `specialRequirements` | String | optional | Special notes. |
| `createdAt` | Date | default Date.now | Creation timestamp. |
| `updatedAt` | Date | default Date.now | Update timestamp. |

### Relationship notes
- Linked by `projectId` string.
- Prepared for future route exposure and deeper material workflows.

## 6. Collection `estimates`

| Column / field | Type | Constraints | Description |
| --- | --- | --- | --- |
| `estimateNumber` | String | required, unique | Estimate identifier. |
| `projectId` | String | required, indexed | Project link. |
| `customerName` | String | required | Customer snapshot. |
| `fenceType` | String | required | Fence type at quote time. |
| `linearFeet` | Number | required | Quoted footage. |
| `height` | Number | optional | Quoted height. |
| `materialCost` | Number | required | Material subtotal. |
| `laborHours` | Number | required | Labor hours. |
| `laborRate` | Number | default 50 | Hourly rate. |
| `laborCost` | Number | required | Labor subtotal. |
| `equipmentCost` | Number | required | Equipment subtotal. |
| `permitCost` | Number | default 0 | Permit fee. |
| `utilityCost` | Number | default 0 | Utility cost. |
| `contingency` | Number | default 0 | Contingency amount. |
| `subtotal` | Number | required | Pre-tax total. |
| `tax` | Number | required | Tax total. |
| `total` | Number | required | Grand total. |
| `notes` | String | optional | Estimator note. |
| `status` | String | enum draft|sent|accepted|rejected | Estimate state. |
| `validUntil` | Date | optional | Estimate expiry. |
| `estimator` | ObjectId | ref User | Creating user. |
| `createdAt` | Date | default Date.now, indexed | Creation timestamp. |
| `updatedAt` | Date | default Date.now | Update timestamp. |

### Relationship notes
- Created from quote inputs and calculator results.
- One project may have multiple estimate versions.

## 7. Collection `contracts`

| Column / field | Type | Constraints | Description |
| --- | --- | --- | --- |
| `contractNumber` | String | required, unique | Contract identifier. |
| `estimateNumber` | String | required | Source estimate link. |
| `projectId` | String | required, indexed | Project link. |
| `customerName` | String | required | Customer snapshot. |
| `scopeOfWork` | String | required | Scope narrative. |
| `materials` | String | required | Material summary. |
| `labor` | String | required | Labor summary. |
| `timeline` | String | optional | Schedule summary. |
| `totalPrice` | Number | required | Locked total. |
| `priceLocked` | Boolean | default true | Price lock flag. |
| `depositAmount` | Number | optional | Deposit due. |
| `depositPaid` | Boolean | default false | Deposit payment state. |
| `finalBalance` | Number | optional | Remaining balance. |
| `warranty` | String | optional | Warranty text. |
| `terms` | String | optional | Terms text. |
| `customerSignature` | String | optional | Customer signature payload. |
| `customerSignDate` | Date | optional | Customer sign date. |
| `companySignature` | String | optional | Company signature payload. |
| `companySignDate` | Date | optional | Company sign date. |
| `status` | String | enum pending|signed|active|completed | Contract state. |
| `createdAt` | Date | default Date.now, indexed | Creation timestamp. |
| `updatedAt` | Date | default Date.now | Update timestamp. |

### Relationship notes
- References an estimate by `estimateNumber`.
- Represents the price-lock moment in the workflow.

## 8. Collection `changeorders`

| Column / field | Type | Constraints | Description |
| --- | --- | --- | --- |
| `changeOrderNumber` | String | required, unique | Change order identifier. |
| `contractNumber` | String | required | Contract reference. |
| `projectId` | String | required, indexed | Project link. |
| `description` | String | required | Change summary. |
| `reason` | String | optional | Why the change exists. |
| `materialCostChange` | Number | default 0 | Material delta. |
| `laborCostChange` | Number | default 0 | Labor delta. |
| `timelineChange` | String | optional | Schedule impact. |
| `newTotal` | Number | required | New total after change. |
| `customerApproval` | Boolean | default false | Approval flag. |
| `customerSignature` | String | optional | Customer signature. |
| `approvalDate` | Date | optional | Approval date. |
| `status` | String | enum pending|approved|rejected | Change order state. |
| `createdAt` | Date | default Date.now, indexed | Creation timestamp. |

### Relationship notes
- Should only exist after a contract exists.
- Preserves an audit trail of approved changes.

## 9. Collection `signoffs`

| Column / field | Type | Constraints | Description |
| --- | --- | --- | --- |
| `signOffNumber` | String | required, unique | Sign-off identifier. |
| `projectId` | String | required, indexed | Project link. |
| `contractNumber` | String | required | Contract reference. |
| `completionDate` | Date | default Date.now | Completion date. |
| `fenceInspectionPassed` | Boolean | required | Inspection result. |
| `customerWalkthrough` | Boolean | required | Walkthrough completion. |
| `warrantyExplained` | Boolean | required | Warranty review state. |
| `photos` | [String] | optional | Closeout photos. |
| `outstandingItems` | String | optional | Punch-list text. |
| `followUpNeeded` | Boolean | default false | Follow-up flag. |
| `warrantyStartDate` | Date | optional | Warranty effective date. |
| `nextMaintenanceDate` | Date | optional | Maintenance reminder. |
| `customerSignature` | String | optional | Customer signature. |
| `customerSignDate` | Date | optional | Customer sign date. |
| `companyRep` | String | required | Company representative. |
| `companyRepSignature` | String | optional | Representative signature. |
| `companyRepSignDate` | Date | optional | Representative sign date. |
| `status` | String | enum pending|signed|completed | Sign-off state. |
| `createdAt` | Date | default Date.now, indexed | Creation timestamp. |

### Relationship notes
- Represents job closeout.
- Can capture outstanding items and follow-up need.

## 10. Collection `notes`

| Column / field | Type | Constraints | Description |
| --- | --- | --- | --- |
| `noteId` | String | unique, optional | Human-readable note ID. |
| `title` | String | required | Short title. |
| `category` | String | required, enum | Site Conditions, Materials, Labor, Warranty, Safety, Other. |
| `content` | String | required | Full note body. |
| `createdBy` | ObjectId | ref User | Authoring user. |
| `usageCount` | Number | default 0 | Reuse count. |
| `lastUsed` | Date | optional | Last reuse timestamp. |
| `createdAt` | Date | default Date.now, indexed | Creation timestamp. |
| `updatedAt` | Date | default Date.now | Update timestamp. |

### Relationship notes
- Stores reusable text and operational knowledge.
- Not yet tied directly to a single project in the current schema.

## 11. Indexing strategy

### Declared or implied indexes
- Unique: `users.username`, `users.email`, `projects.projectId`, `estimates.estimateNumber`, `contracts.contractNumber`, `changeorders.changeOrderNumber`, `signoffs.signOffNumber`, `notes.noteId`.
- Indexed: `fencespecs.projectId`, `estimates.projectId`, `contracts.projectId`, `changeorders.projectId`, `signoffs.projectId`, several `createdAt` fields.

### Recommended additional indexes
- `projects.estimator + createdAt`
- `projects.status + createdAt`
- `estimates.projectId + status`
- `contracts.status + createdAt`
- `notes.category + usageCount`

## 12. Example queries

### Mongo shell examples
```javascript
db.projects.find({ status: "draft" }).sort({ createdAt: -1 })
db.estimates.find({ projectId: "PRJ-1723420000000" }).sort({ createdAt: -1 })
db.contracts.find({ status: "pending" })
db.notes.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }])
```

### Mongoose examples
```javascript
const project = await Project.findOne({ projectId: "PRJ-1723420000000" }).populate("estimator", "username email company");
const estimates = await Estimate.find({ projectId: "PRJ-1723420000000" }).sort({ createdAt: -1 });
const contract = await Contract.findOne({ estimateNumber: "EST-1723420000000" });
```

## 13. Backup and restore procedures

### Backup with mongodump
```bash
mongodump --uri="$MONGO_URI" --out ./backups/$(date +%F)
```

### Compress archive
```bash
tar -czf fence-estimator-backup-$(date +%F).tgz ./backups/$(date +%F)
```

### Restore with mongorestore
```bash
mongorestore --uri="$MONGO_URI" ./backups/2026-08-12
```

### Restore guidance
- Restore to staging first.
- Confirm record counts and key workflows after restore.
- Recheck index state before resuming production writes.

## 14. Data dictionary

- **Estimator:** authenticated user responsible for a project or estimate.
- **Project status:** workflow stage on a project.
- **Estimate status:** quote state such as draft or accepted.
- **Contract status:** contract progression state.
- **Price lock:** the moment a contract is created and pricing should not be edited directly.
- **Change order:** a priced modification after contract signature.
- **Sign-off:** final customer/company acknowledgement that the job is complete.
- **Reusable note:** standardized text saved for future reuse.

## 15. Governance recommendations

- Split schemas into dedicated model files if the backend grows.
- Add migration or versioning strategy before making frequent schema changes.
- Add soft-delete strategy if legal retention or reversibility becomes a requirement.
- Audit personal data retention rules for customer contact fields.
- Keep price-lock history immutable once contracts are issued.

## 16. Sample documents

### Sample user document
```json
{
  "username": "estimator1",
  "email": "estimator@example.com",
  "role": "estimator",
  "company": "Fence Depot",
  "phone": "5551234567"
}
```

### Sample project document
```json
{
  "projectId": "PRJ-1723420000000",
  "customerName": "Jane Customer",
  "customerEmail": "jane@example.com",
  "customerPhone": "555-444-3322",
  "address": "123 Fence Lane",
  "city": "Toronto",
  "province": "ON",
  "postalCode": "M5V 2T6",
  "propertySize": "1200",
  "status": "draft"
}
```

### Sample estimate document
```json
{
  "estimateNumber": "EST-1723420000000",
  "projectId": "PRJ-1723420000000",
  "fenceType": "Wood",
  "linearFeet": 180,
  "materialCost": 645,
  "laborHours": 3.6,
  "laborRate": 55,
  "laborCost": 198,
  "equipmentCost": 150,
  "permitCost": 125,
  "utilityCost": 50,
  "contingency": 100,
  "subtotal": 1118,
  "tax": 145.34,
  "total": 1263.34
}
```

## 17. Common operation patterns

### Create a project and related estimate
1. Insert a project document.
2. Insert or update fence specs for the same `projectId`.
3. Run the calculator.
4. Insert an estimate document.
5. Update project status to `estimate`.

### Create a contract
1. Find the accepted estimate by `estimateNumber`.
2. Create the contract using the estimate snapshot.
3. Update the project status to `contract`.
4. Freeze price changes outside the change-order process.

### Close a project
1. Confirm production completion.
2. Collect sign-off inputs and signatures.
3. Insert a signoff document.
4. Update project status to `completed`.

## 18. Data integrity rules

- `projectId`, `estimateNumber`, `contractNumber`, `changeOrderNumber`, and `signOffNumber` should be immutable after creation.
- Customer-contact fields should be normalized before save.
- Contract totals should not be edited directly after price lock.
- Change orders should carry both the reason and the updated total.
- Sign-off records should only be created after a corresponding contract exists.
- Reusable notes should keep category values aligned to the enum.

## 19. Reporting examples

### Revenue by month
```javascript
db.contracts.aggregate([
  { $group: {
      _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
      revenue: { $sum: "$totalPrice" },
      contracts: { $sum: 1 }
  } },
  { $sort: { "_id.year": 1, "_id.month": 1 } }
])
```

### Projects by stage
```javascript
db.projects.aggregate([
  { $group: { _id: "$status", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])
```

### Notes usage leaderboard
```javascript
db.notes.find({}, { title: 1, category: 1, usageCount: 1 }).sort({ usageCount: -1 }).limit(20)
```

## 20. Backup runbook

1. Create a dated backup directory.
2. Run `mongodump` against the target environment.
3. Compress the archive.
4. Store a checksum alongside the archive.
5. Copy the archive to off-site storage.
6. Log the backup completion time and source environment.
7. Test restore regularly in staging.

## 21. Restore validation checklist

- [ ] Can users log in?
- [ ] Can projects be listed?
- [ ] Can an estimate be retrieved by project?
- [ ] Can a contract be opened?
- [ ] Are collection counts within expected range?
- [ ] Are unique identifiers intact?
- [ ] Are indexes present and healthy?

## 22. Governance recommendations

- Keep raw PII access limited to users who need it.
- Define retention rules for signed documents and closeout artifacts.
- Record who performs production restores.
- Add audit logging around admin-level user changes if those routes are implemented.
- Version any future schema migrations.

