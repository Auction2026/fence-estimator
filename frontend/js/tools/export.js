/**
 * export.js - PDF and Print Export Tool
 * Fence Depot Estimator
 */

const ExportTool = {
    /**
     * Print current estimate to PDF via browser print
     */
    printEstimate(estimate) {
        const win = window.open('', '_blank');
        win.document.write(this.buildPrintHTML(estimate));
        win.document.close();
        win.print();
    },

    /**
     * Build printable HTML for estimate
     */
    buildPrintHTML(estimate) {
        const date = new Date().toLocaleDateString('en-CA');
        const items = (estimate.materials || []).map(m => `
            <tr>
                <td>${m.description}</td>
                <td>${m.qty}</td>
                <td>${m.unit}</td>
                <td>$${(m.unitPrice || 0).toFixed(2)}</td>
                <td>$${(m.total || 0).toFixed(2)}</td>
            </tr>
        `).join('');

        return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Fence Estimate - ${estimate.estimateNumber || ''}</title>
<style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
    h1 { color: #0FA89F; }
    .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
    .logo { font-size: 24px; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { background: #0FA89F; color: white; padding: 10px; text-align: left; }
    td { padding: 8px; border-bottom: 1px solid #eee; }
    .totals { margin-top: 20px; text-align: right; }
    .total-line { font-size: 18px; font-weight: bold; color: #0FA89F; }
    @media print { button { display: none; } }
</style>
</head>
<body>
<div class="header">
    <div class="logo">🏗️ Fence Depot</div>
    <div>
        <div><strong>Estimate #:</strong> ${estimate.estimateNumber || 'N/A'}</div>
        <div><strong>Date:</strong> ${date}</div>
    </div>
</div>

<h1>Fence Installation Estimate</h1>

<div style="margin-bottom: 20px;">
    <div><strong>Customer:</strong> ${estimate.customer?.name || ''}</div>
    <div><strong>Address:</strong> ${estimate.customer?.address || ''}</div>
    <div><strong>Phone:</strong> ${estimate.customer?.phone || ''}</div>
    <div><strong>Email:</strong> ${estimate.customer?.email || ''}</div>
</div>

<div style="margin-bottom: 20px;">
    <div><strong>Fence Type:</strong> ${estimate.fenceType || ''}</div>
    <div><strong>Height:</strong> ${estimate.height || ''}</div>
    <div><strong>Linear Footage:</strong> ${estimate.footage || ''} ft</div>
</div>

<table>
    <thead>
        <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Unit Price</th>
            <th>Total</th>
        </tr>
    </thead>
    <tbody>
        ${items}
    </tbody>
</table>

<div class="totals">
    <div>Subtotal: $${(estimate.subtotal || 0).toFixed(2)}</div>
    <div>Labour: $${(estimate.labour || 0).toFixed(2)}</div>
    <div>Tax (${estimate.taxRate || 13}%): $${(estimate.tax || 0).toFixed(2)}</div>
    <div class="total-line">TOTAL: $${(estimate.total || 0).toFixed(2)}</div>
</div>

<div style="margin-top: 40px; font-size: 12px; color: #999;">
    This estimate is valid for 30 days. Prices subject to change. Installation by licensed contractor.
</div>
</body>
</html>`;
    },

    /**
     * Export estimate as CSV
     */
    exportCSV(estimate) {
        const rows = [
            ['Description', 'Qty', 'Unit', 'Unit Price', 'Total'],
            ...(estimate.materials || []).map(m => [
                m.description, m.qty, m.unit,
                (m.unitPrice || 0).toFixed(2),
                (m.total || 0).toFixed(2)
            ])
        ];
        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `estimate-${estimate.estimateNumber || 'export'}.csv`;
        a.click();
    }
};
