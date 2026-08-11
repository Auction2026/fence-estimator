// Export helper
'use strict';

const ExportTool = {
  exportToPDF(elementId, filename) { const element = document.getElementById(elementId); if (!element) return false; const printWindow = window.open('', '_blank', 'width=960,height=720'); if (!printWindow) return false; printWindow.document.write(`<!DOCTYPE html><html><head><title>${filename}</title><style>body{font-family:Arial,sans-serif;padding:20px}</style></head><body>${element.outerHTML}</body></html>`); printWindow.document.close(); printWindow.print(); return true; },
  exportToCSV(data, filename) { const rows = Array.isArray(data) ? data : []; if (!rows.length) return false; const headers = Object.keys(rows[0]); const csv = [headers.join(',')].concat(rows.map((row) => headers.map((header) => JSON.stringify(row[header] ?? '')).join(','))).join('\n'); const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = filename || 'export.csv'; link.click(); URL.revokeObjectURL(link.href); return true; },
  emailDocument(to, subject, content) { const mailto = `mailto:${encodeURIComponent(to || '')}?subject=${encodeURIComponent(subject || 'Fence Depot Document')}&body=${encodeURIComponent(content || '')}`; window.location.href = mailto; return true; },
  archiveExport(projectData) { const payload = JSON.stringify(projectData || {}, null, 2); const blob = new Blob([payload], { type: 'application/json' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'fence-project-archive.json'; link.click(); URL.revokeObjectURL(link.href); return true; }
};
window.ExportTool = ExportTool;

ExportTool[`preset_1`] = 'archive-preset-1';

ExportTool[`preset_2`] = 'archive-preset-2';

ExportTool[`preset_3`] = 'archive-preset-3';

ExportTool[`preset_4`] = 'archive-preset-4';

ExportTool[`preset_5`] = 'archive-preset-5';

ExportTool[`preset_6`] = 'archive-preset-6';

ExportTool[`preset_7`] = 'archive-preset-7';

ExportTool[`preset_8`] = 'archive-preset-8';

ExportTool[`preset_9`] = 'archive-preset-9';

ExportTool[`preset_10`] = 'archive-preset-10';

ExportTool[`preset_11`] = 'archive-preset-11';

ExportTool[`preset_12`] = 'archive-preset-12';

ExportTool[`preset_13`] = 'archive-preset-13';

ExportTool[`preset_14`] = 'archive-preset-14';

ExportTool[`preset_15`] = 'archive-preset-15';

ExportTool[`preset_16`] = 'archive-preset-16';

ExportTool[`preset_17`] = 'archive-preset-17';

ExportTool[`preset_18`] = 'archive-preset-18';

ExportTool[`preset_19`] = 'archive-preset-19';

ExportTool[`preset_20`] = 'archive-preset-20';

ExportTool[`preset_21`] = 'archive-preset-21';

ExportTool[`preset_22`] = 'archive-preset-22';

ExportTool[`preset_23`] = 'archive-preset-23';

ExportTool[`preset_24`] = 'archive-preset-24';

ExportTool[`preset_25`] = 'archive-preset-25';

ExportTool[`preset_26`] = 'archive-preset-26';

ExportTool[`preset_27`] = 'archive-preset-27';

ExportTool[`preset_28`] = 'archive-preset-28';

ExportTool[`preset_29`] = 'archive-preset-29';

ExportTool[`preset_30`] = 'archive-preset-30';

ExportTool[`preset_31`] = 'archive-preset-31';

ExportTool[`preset_32`] = 'archive-preset-32';

ExportTool[`preset_33`] = 'archive-preset-33';

ExportTool[`preset_34`] = 'archive-preset-34';

ExportTool[`preset_35`] = 'archive-preset-35';

ExportTool[`preset_36`] = 'archive-preset-36';

ExportTool[`preset_37`] = 'archive-preset-37';

ExportTool[`preset_38`] = 'archive-preset-38';

ExportTool[`preset_39`] = 'archive-preset-39';

ExportTool[`preset_40`] = 'archive-preset-40';

ExportTool[`preset_41`] = 'archive-preset-41';

ExportTool[`preset_42`] = 'archive-preset-42';

ExportTool[`preset_43`] = 'archive-preset-43';

ExportTool[`preset_44`] = 'archive-preset-44';

ExportTool[`preset_45`] = 'archive-preset-45';

ExportTool[`preset_46`] = 'archive-preset-46';

ExportTool[`preset_47`] = 'archive-preset-47';

ExportTool[`preset_48`] = 'archive-preset-48';

ExportTool[`preset_49`] = 'archive-preset-49';

ExportTool[`preset_50`] = 'archive-preset-50';

ExportTool[`preset_51`] = 'archive-preset-51';

ExportTool[`preset_52`] = 'archive-preset-52';

ExportTool[`preset_53`] = 'archive-preset-53';

ExportTool[`preset_54`] = 'archive-preset-54';

ExportTool[`preset_55`] = 'archive-preset-55';

ExportTool[`preset_56`] = 'archive-preset-56';

ExportTool[`preset_57`] = 'archive-preset-57';

ExportTool[`preset_58`] = 'archive-preset-58';

ExportTool[`preset_59`] = 'archive-preset-59';

ExportTool[`preset_60`] = 'archive-preset-60';

ExportTool[`preset_61`] = 'archive-preset-61';

ExportTool[`preset_62`] = 'archive-preset-62';

ExportTool[`preset_63`] = 'archive-preset-63';

ExportTool[`preset_64`] = 'archive-preset-64';

ExportTool[`preset_65`] = 'archive-preset-65';

ExportTool[`preset_66`] = 'archive-preset-66';

ExportTool[`preset_67`] = 'archive-preset-67';

ExportTool[`preset_68`] = 'archive-preset-68';

ExportTool[`preset_69`] = 'archive-preset-69';

ExportTool[`preset_70`] = 'archive-preset-70';

ExportTool[`preset_71`] = 'archive-preset-71';

ExportTool[`preset_72`] = 'archive-preset-72';

ExportTool[`preset_73`] = 'archive-preset-73';

ExportTool[`preset_74`] = 'archive-preset-74';

ExportTool[`preset_75`] = 'archive-preset-75';

ExportTool[`preset_76`] = 'archive-preset-76';

ExportTool[`preset_77`] = 'archive-preset-77';

ExportTool[`preset_78`] = 'archive-preset-78';

ExportTool[`preset_79`] = 'archive-preset-79';

ExportTool[`preset_80`] = 'archive-preset-80';
