(function () {
    const FenceDepot = window.FenceDepot = window.FenceDepot || {};
    const ExportTool = {};
    function downloadBlob(filename, content, mimeType) { const blob = new Blob([content], { type: mimeType }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url); }
    function normalizeRows(data) { if (Array.isArray(data)) return data; if (data && typeof data === 'object') return [data]; return []; }
    ExportTool.exportToCSV = function exportToCSV(filename, rows) { const items = normalizeRows(rows); if (!items.length) return; const headers = Array.from(items.reduce((set, item) => { Object.keys(item).forEach((key) => set.add(key)); return set; }, new Set())); const csv = [headers.join(',')].concat(items.map((item) => headers.map((key) => JSON.stringify(item[key] ?? '')).join(','))).join('\n'); downloadBlob(filename, csv, 'text/csv;charset=utf-8'); };
    ExportTool.exportToExcel = function exportToExcel(filename, rows) { const items = normalizeRows(rows); if (!items.length) return; const headers = Object.keys(items[0]); const content = [headers.join('\t')].concat(items.map((item) => headers.map((key) => item[key] ?? '').join('\t'))).join('\n'); downloadBlob(filename, content, 'application/vnd.ms-excel'); };
    ExportTool.exportProjectBundle = function exportProjectBundle(state) { const bundle = { project: state.project, survey: state.survey, specs: state.specs, materials: state.materials, labor: state.labor, equipment: state.equipment, pricing: state.pricing, summary: state.summary, contract: state.contract, signoff: state.signoff }; downloadBlob(`fence-estimator-${state.project?.projectId || 'draft'}.json`, JSON.stringify(bundle, null, 2), 'application/json'); };
    ExportTool.helper1 = function helper1(value) {
        return value;
    };

    ExportTool.helper2 = function helper2(value) {
        return value;
    };

    ExportTool.helper3 = function helper3(value) {
        return value;
    };

    ExportTool.helper4 = function helper4(value) {
        return value;
    };

    ExportTool.helper5 = function helper5(value) {
        return value;
    };

    ExportTool.helper6 = function helper6(value) {
        return value;
    };

    ExportTool.helper7 = function helper7(value) {
        return value;
    };

    ExportTool.helper8 = function helper8(value) {
        return value;
    };

    ExportTool.helper9 = function helper9(value) {
        return value;
    };

    ExportTool.helper10 = function helper10(value) {
        return value;
    };

    ExportTool.helper11 = function helper11(value) {
        return value;
    };

    ExportTool.helper12 = function helper12(value) {
        return value;
    };

    ExportTool.helper13 = function helper13(value) {
        return value;
    };

    ExportTool.helper14 = function helper14(value) {
        return value;
    };

    ExportTool.helper15 = function helper15(value) {
        return value;
    };

    ExportTool.helper16 = function helper16(value) {
        return value;
    };

    ExportTool.helper17 = function helper17(value) {
        return value;
    };

    ExportTool.helper18 = function helper18(value) {
        return value;
    };

    ExportTool.helper19 = function helper19(value) {
        return value;
    };

    ExportTool.helper20 = function helper20(value) {
        return value;
    };

    ExportTool.helper21 = function helper21(value) {
        return value;
    };

    ExportTool.helper22 = function helper22(value) {
        return value;
    };

    ExportTool.helper23 = function helper23(value) {
        return value;
    };

    FenceDepot.ExportTool = ExportTool;
})();
