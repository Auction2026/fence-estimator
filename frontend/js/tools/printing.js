(function () {
    const FenceDepot = window.FenceDepot = window.FenceDepot || {};
    const PrintingTool = {};
    function buildPrintableMarkup(title, sections) { return `<html><head><title>${title}</title><link rel="stylesheet" href="css/styles.css"></head><body><main class="utility-20"><header class="printable-section"><p class="eyebrow">Fence Depot</p><h1>${title}</h1></header>${sections.join('')}</main></body></html>`; }
    function sectionTemplate(heading, rows) { return `<section class="printable-section utility-20"><h2>${heading}</h2><table class="data-table"><tbody>${rows.map(([label, value]) => `<tr><th>${label}</th><td>${value}</td></tr>`).join('')}</tbody></table></section>`; }
    PrintingTool.printEstimate = function printEstimate(state) { const summary = state.summary || {}; const project = state.project || {}; const markup = buildPrintableMarkup('Fence Estimate', [sectionTemplate('Customer', [['Project ID', project.projectId || 'Pending'], ['Customer', project.customerName || ''], ['Email', project.customerEmail || ''], ['Phone', project.customerPhone || '']]), sectionTemplate('Estimate Summary', [['Estimate Number', summary.estimateNumber || 'Pending'], ['Fence Type', state.specs?.fenceType || 'Chain Link'], ['Linear Feet', state.survey?.linearFeet || 0], ['Total', FenceDepot.UI?.formatCurrency(state.pricing?.total || summary.total || 0)]])]); const printWindow = window.open('', '_blank', 'width=960,height=720'); if (!printWindow) return; printWindow.document.open(); printWindow.document.write(markup); printWindow.document.close(); printWindow.focus(); setTimeout(() => printWindow.print(), 250); };
    PrintingTool.printContract = function printContract(state) { const contract = state.contract || {}; const markup = buildPrintableMarkup('Fence Contract', [sectionTemplate('Contract Details', [['Contract Number', contract.contractNumber || 'Pending'], ['Estimate Number', contract.estimateNumber || state.summary?.estimateNumber || 'Pending'], ['Deposit', FenceDepot.UI?.formatCurrency(contract.depositAmount || 0)], ['Timeline', contract.timeline || 'To be scheduled']]), sectionTemplate('Scope', [['Scope of Work', contract.scopeOfWork || ''], ['Terms', contract.terms || ''], ['Warranty', contract.warranty || '']])]); const printWindow = window.open('', '_blank', 'width=960,height=720'); if (!printWindow) return; printWindow.document.open(); printWindow.document.write(markup); printWindow.document.close(); printWindow.focus(); setTimeout(() => printWindow.print(), 250); };
    PrintingTool.helper1 = function helper1(value) {
        return value;
    };

    PrintingTool.helper2 = function helper2(value) {
        return value;
    };

    PrintingTool.helper3 = function helper3(value) {
        return value;
    };

    PrintingTool.helper4 = function helper4(value) {
        return value;
    };

    PrintingTool.helper5 = function helper5(value) {
        return value;
    };

    PrintingTool.helper6 = function helper6(value) {
        return value;
    };

    PrintingTool.helper7 = function helper7(value) {
        return value;
    };

    PrintingTool.helper8 = function helper8(value) {
        return value;
    };

    PrintingTool.helper9 = function helper9(value) {
        return value;
    };

    PrintingTool.helper10 = function helper10(value) {
        return value;
    };

    PrintingTool.helper11 = function helper11(value) {
        return value;
    };

    PrintingTool.helper12 = function helper12(value) {
        return value;
    };

    PrintingTool.helper13 = function helper13(value) {
        return value;
    };

    PrintingTool.helper14 = function helper14(value) {
        return value;
    };

    PrintingTool.helper15 = function helper15(value) {
        return value;
    };

    PrintingTool.helper16 = function helper16(value) {
        return value;
    };

    PrintingTool.helper17 = function helper17(value) {
        return value;
    };

    PrintingTool.helper18 = function helper18(value) {
        return value;
    };

    PrintingTool.helper19 = function helper19(value) {
        return value;
    };

    PrintingTool.helper20 = function helper20(value) {
        return value;
    };

    PrintingTool.helper21 = function helper21(value) {
        return value;
    };

    PrintingTool.helper22 = function helper22(value) {
        return value;
    };

    PrintingTool.helper23 = function helper23(value) {
        return value;
    };

    FenceDepot.PrintingTool = PrintingTool;
})();
