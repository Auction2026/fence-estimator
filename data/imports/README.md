# 📥 Inventory Import Folder

**Drop your inventory files right here!**

---

## ✅ What to do — Step by Step

1. **Download or export your inventory** from wherever it is stored (QuickBooks, Excel, Google Sheets, your old program, etc.)

2. **Save the file into this folder** (`data/imports/`)
   - Accepted formats: `.csv`, `.xlsx`, `.xls`, `.json`

3. **Open the Import Tool** — open `tools/import-tool.html` in your browser

4. **Upload the file** using the Import Tool — it will read your data, show you a preview, and let you save it into the system

5. **That's it!** Your data will be saved to `data/processed/` and automatically picked up by the estimator

---

## 📄 Accepted File Formats

| Format | Extension | Notes |
|--------|-----------|-------|
| Excel  | `.xlsx` or `.xls` | Works with any Excel file |
| CSV    | `.csv` | Works with Google Sheets exports |
| JSON   | `.json` | For advanced users |

---

## 📋 What Columns Should Be in Your File?

Your file can have any columns — the Import Tool will help you match them up.
But if possible, include:

| Column | What it means |
|--------|---------------|
| Item Name / Description | Name of the product |
| SKU / Part Number | Your internal code (optional) |
| Cost Price | What **you pay** the supplier |
| Sell Price | What **you charge** the customer |
| Unit | Each, LF, Roll, Bag, etc. |
| Category | Chain Link, Wood, Vinyl, etc. |
| Stock Qty | How many you have on hand |
| Supplier | Who you buy it from |

---

## 💡 Don't have a file yet?

Use one of the pre-made templates in `data/templates/`:
- `inventory-template.csv` — fill in your materials, costs and prices
- `installation-template.csv` — fill in labour/installation times
- `suppliers-template.csv` — fill in your supplier contacts

---

## ❓ Need Help?

Open `tools/import-tool.html` — it has step-by-step instructions built in.
