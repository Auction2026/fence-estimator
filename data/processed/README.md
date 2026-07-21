# 📂 Processed Data

This folder contains the cleaned, validated JSON data files that are ready for use by the Fence Depot estimator.

## Files in this folder

| Filename | Contents |
|----------|----------|
| `inventory-data-YYYY-MM-DD.json` | Materials, costs, sell prices, stock levels |
| `installation-data-YYYY-MM-DD.json` | Installation tasks and labour time estimates |
| `suppliers-data-YYYY-MM-DD.json` | Supplier contact and ordering information |

## How files get here

1. Drop a raw file (CSV, Excel, JSON) into `data/imports/`
2. Run the Import Tool (`tools/import-tool.html`) **or** run `node scripts/import-inventory.js`
3. The processed file appears here

## Using the data in the estimator

The main `index.html` estimator automatically reads JSON files from this folder.
The most recent file matching each type (inventory, installation, suppliers) is loaded on startup.

## Validating files

```bash
node scripts/validate-data.js
```

This checks all JSON files here against the schemas in `data/schema/` and reports any issues.
