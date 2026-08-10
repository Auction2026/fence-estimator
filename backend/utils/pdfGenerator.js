const PDFDocument = require('pdfkit');

function streamPdf(res, title, rows) {
  const doc = new PDFDocument({ margin: 40 });
  res.setHeader('Content-Type', 'application/pdf');
  doc.pipe(res);
  doc.fontSize(18).text(title, { underline: true });
  doc.moveDown();
  rows.forEach((line) => doc.fontSize(12).text(line));
  doc.end();
}

function generateEstimatePdf(res, estimate) {
  return streamPdf(res, 'Fence Estimate', [
    `Project: ${estimate.projectId}`,
    `Status: ${estimate.status}`,
    `Total: $${Number(estimate.total || 0).toFixed(2)}`
  ]);
}

function generateContractPdf(res, contract) {
  return streamPdf(res, 'Fence Contract', [
    `Project: ${contract.projectId}`,
    `Locked: ${contract.priceLocked ? 'Yes' : 'No'}`,
    `Amount: $${Number(contract.totalAmount || 0).toFixed(2)}`
  ]);
}

module.exports = { generateEstimatePdf, generateContractPdf };
