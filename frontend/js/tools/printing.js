// Print helper
'use strict';

const PrintTool = {
  openPrintWindow(title, body) {
    const win = window.open('', '_blank', 'width=960,height=720');
    if (!win) return null;
    win.document.write(`<!DOCTYPE html><html><head><title>${title}</title><style>body{font-family:Arial,sans-serif;padding:24px;color:#212121}h1{color:#1B5E20}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:left}.meta{margin-bottom:16px}</style></head><body>${body}</body></html>`);
    win.document.close(); win.focus(); win.print(); return win;
  },
  printEstimate(estimateData) { const estimate = estimateData || {}; const rows = ((estimate.materials && estimate.materials.items) || []).map((item) => `<tr><td>${item.item}</td><td>${item.qty}</td><td>${formatCurrency(item.unitCost)}</td><td>${formatCurrency(item.total)}</td></tr>`).join(''); return this.openPrintWindow('Fence Depot Estimate', `<h1>Fence Depot Estimate</h1><div class="meta">Generated ${formatDate(new Date())}</div><table><thead><tr><th>Item</th><th>Qty</th><th>Unit</th><th>Total</th></tr></thead><tbody>${rows}</tbody></table><h2>Total: ${formatCurrency((estimate.totals || estimate).total || 0)}</h2>`); },
  printContract(contractData) { const contract = contractData || {}; return this.openPrintWindow('Fence Depot Contract', `<h1>Fence Depot Contract</h1><p>${contract.projectSummary || ''}</p><p>${contract.scopeOfWork || ''}</p><h2>Price ${formatCurrency(contract.total || 0)}</h2><p>Status: ${contract.status || 'Draft'}</p>`); },
  printChangeOrder(coData) { const co = coData || {}; return this.openPrintWindow('Fence Depot Change Order', `<h1>Change Order</h1><p>${co.description || ''}</p><p>Reason: ${co.reason || ''}</p><p>Cost Impact: ${formatCurrency(co.costImpact || 0)}</p><p>Status: ${co.status || 'Pending'}</p>`); },
  printProjectSummary(projectData) { const project = projectData || {}; return this.openPrintWindow('Fence Depot Project Summary', `<h1>Project Summary</h1><p>${project.customerName || ''}</p><p>${project.addressStreet || ''} ${project.addressCity || ''}</p><p>${project.projectNotes || ''}</p>`); }
};
window.PrintTool = PrintTool;

PrintTool[`template_1`] = 'Fence Depot print template 1';

PrintTool[`template_2`] = 'Fence Depot print template 2';

PrintTool[`template_3`] = 'Fence Depot print template 3';

PrintTool[`template_4`] = 'Fence Depot print template 4';

PrintTool[`template_5`] = 'Fence Depot print template 5';

PrintTool[`template_6`] = 'Fence Depot print template 6';

PrintTool[`template_7`] = 'Fence Depot print template 7';

PrintTool[`template_8`] = 'Fence Depot print template 8';

PrintTool[`template_9`] = 'Fence Depot print template 9';

PrintTool[`template_10`] = 'Fence Depot print template 10';

PrintTool[`template_11`] = 'Fence Depot print template 11';

PrintTool[`template_12`] = 'Fence Depot print template 12';

PrintTool[`template_13`] = 'Fence Depot print template 13';

PrintTool[`template_14`] = 'Fence Depot print template 14';

PrintTool[`template_15`] = 'Fence Depot print template 15';

PrintTool[`template_16`] = 'Fence Depot print template 16';

PrintTool[`template_17`] = 'Fence Depot print template 17';

PrintTool[`template_18`] = 'Fence Depot print template 18';

PrintTool[`template_19`] = 'Fence Depot print template 19';

PrintTool[`template_20`] = 'Fence Depot print template 20';

PrintTool[`template_21`] = 'Fence Depot print template 21';

PrintTool[`template_22`] = 'Fence Depot print template 22';

PrintTool[`template_23`] = 'Fence Depot print template 23';

PrintTool[`template_24`] = 'Fence Depot print template 24';

PrintTool[`template_25`] = 'Fence Depot print template 25';

PrintTool[`template_26`] = 'Fence Depot print template 26';

PrintTool[`template_27`] = 'Fence Depot print template 27';

PrintTool[`template_28`] = 'Fence Depot print template 28';

PrintTool[`template_29`] = 'Fence Depot print template 29';

PrintTool[`template_30`] = 'Fence Depot print template 30';

PrintTool[`template_31`] = 'Fence Depot print template 31';

PrintTool[`template_32`] = 'Fence Depot print template 32';

PrintTool[`template_33`] = 'Fence Depot print template 33';

PrintTool[`template_34`] = 'Fence Depot print template 34';

PrintTool[`template_35`] = 'Fence Depot print template 35';

PrintTool[`template_36`] = 'Fence Depot print template 36';

PrintTool[`template_37`] = 'Fence Depot print template 37';

PrintTool[`template_38`] = 'Fence Depot print template 38';

PrintTool[`template_39`] = 'Fence Depot print template 39';

PrintTool[`template_40`] = 'Fence Depot print template 40';

PrintTool[`template_41`] = 'Fence Depot print template 41';

PrintTool[`template_42`] = 'Fence Depot print template 42';

PrintTool[`template_43`] = 'Fence Depot print template 43';

PrintTool[`template_44`] = 'Fence Depot print template 44';

PrintTool[`template_45`] = 'Fence Depot print template 45';

PrintTool[`template_46`] = 'Fence Depot print template 46';

PrintTool[`template_47`] = 'Fence Depot print template 47';

PrintTool[`template_48`] = 'Fence Depot print template 48';

PrintTool[`template_49`] = 'Fence Depot print template 49';

PrintTool[`template_50`] = 'Fence Depot print template 50';

PrintTool[`template_51`] = 'Fence Depot print template 51';

PrintTool[`template_52`] = 'Fence Depot print template 52';

PrintTool[`template_53`] = 'Fence Depot print template 53';

PrintTool[`template_54`] = 'Fence Depot print template 54';

PrintTool[`template_55`] = 'Fence Depot print template 55';

PrintTool[`template_56`] = 'Fence Depot print template 56';

PrintTool[`template_57`] = 'Fence Depot print template 57';

PrintTool[`template_58`] = 'Fence Depot print template 58';

PrintTool[`template_59`] = 'Fence Depot print template 59';

PrintTool[`template_60`] = 'Fence Depot print template 60';

PrintTool[`template_61`] = 'Fence Depot print template 61';

PrintTool[`template_62`] = 'Fence Depot print template 62';

PrintTool[`template_63`] = 'Fence Depot print template 63';

PrintTool[`template_64`] = 'Fence Depot print template 64';

PrintTool[`template_65`] = 'Fence Depot print template 65';

PrintTool[`template_66`] = 'Fence Depot print template 66';

PrintTool[`template_67`] = 'Fence Depot print template 67';

PrintTool[`template_68`] = 'Fence Depot print template 68';

PrintTool[`template_69`] = 'Fence Depot print template 69';

PrintTool[`template_70`] = 'Fence Depot print template 70';

PrintTool[`template_71`] = 'Fence Depot print template 71';

PrintTool[`template_72`] = 'Fence Depot print template 72';

PrintTool[`template_73`] = 'Fence Depot print template 73';

PrintTool[`template_74`] = 'Fence Depot print template 74';

PrintTool[`template_75`] = 'Fence Depot print template 75';

PrintTool[`template_76`] = 'Fence Depot print template 76';

PrintTool[`template_77`] = 'Fence Depot print template 77';

PrintTool[`template_78`] = 'Fence Depot print template 78';

PrintTool[`template_79`] = 'Fence Depot print template 79';

PrintTool[`template_80`] = 'Fence Depot print template 80';
