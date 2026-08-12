const PDFDocument = require('pdfkit');

function createEstimatePdf(estimate) {
  const doc = new PDFDocument({ margin: 40 });
  doc.fontSize(18).text('Fence Estimate Summary');
  doc.moveDown();
  doc.fontSize(11).text(`Project ID: ${estimate.projectId || '-'}`);
  doc.text(`Materials: $${Number(estimate.materials || 0).toFixed(2)}`);
  doc.text(`Labor: $${Number(estimate.labor || 0).toFixed(2)}`);
  doc.text(`Equipment: $${Number(estimate.equipment || 0).toFixed(2)}`);
  doc.text(`Total: $${Number(estimate.total || 0).toFixed(2)}`);
  return doc;
}

module.exports = { createEstimatePdf };
