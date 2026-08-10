const BASE_CATALOG = [
  { sku: 'CL-MESH-048', name: 'Chain Link Mesh 48"', category: 'Chain Link', unit: 'roll', price: 148.5 },
  { sku: 'CL-MESH-060', name: 'Chain Link Mesh 60"', category: 'Chain Link', unit: 'roll', price: 182.75 },
  { sku: 'CL-POST-LN-2-3-8', name: 'Line Post 2 3/8"', category: 'Posts', unit: 'ea', price: 36.2 },
  { sku: 'CL-POST-TER-2-7-8', name: 'Terminal Post 2 7/8"', category: 'Posts', unit: 'ea', price: 51.4 },
  { sku: 'CL-TOP-RAIL-21', name: 'Top Rail 21 ft', category: 'Rails', unit: 'ea', price: 29.95 },
  { sku: 'CL-TENSION-WIRE', name: 'Tension Wire', category: 'Hardware', unit: 'roll', price: 64.9 },
  { sku: 'CL-BRACE-BAND', name: 'Brace Band', category: 'Hardware', unit: 'ea', price: 3.85 },
  { sku: 'CL-TENSION-BAR', name: 'Tension Bar', category: 'Hardware', unit: 'ea', price: 18.75 },
  { sku: 'WOOD-POST-4X4X10', name: 'Pressure Treated 4x4x10', category: 'Wood', unit: 'ea', price: 32.4 },
  { sku: 'WOOD-BOARD-1X6X6', name: 'Pressure Treated Board 1x6x6', category: 'Wood', unit: 'ea', price: 8.75 },
  { sku: 'VINYL-PANEL-6X8', name: 'Vinyl Privacy Panel 6x8', category: 'Vinyl', unit: 'ea', price: 214.0 },
  { sku: 'VINYL-POST-5X5X108', name: 'Vinyl Routed Post 5x5x108', category: 'Vinyl', unit: 'ea', price: 98.0 },
  { sku: 'ORN-PANEL-6X8', name: 'Ornamental Panel 6x8', category: 'Ornamental', unit: 'ea', price: 265.0 },
  { sku: 'CONC-30KG', name: 'Concrete Mix 30kg', category: 'Concrete', unit: 'bag', price: 8.25 },
  { sku: 'GATE-SINGLE-4', name: 'Single Gate 4 ft', category: 'Gates', unit: 'ea', price: 345.0 },
  { sku: 'GATE-DOUBLE-12', name: 'Double Gate 12 ft', category: 'Gates', unit: 'ea', price: 1145.0 },
  { sku: 'CAP-DOME-2-3-8', name: 'Dome Post Cap', category: 'Accessories', unit: 'ea', price: 4.55 },
  { sku: 'FAST-SELFTAP-100', name: 'Self Tapping Screws Box', category: 'Accessories', unit: 'box', price: 18.95 }
];

function createCatalogSeed() {
  return BASE_CATALOG.map((product, index) => ({
    id: index + 1,
    ...product,
    taxable: true,
    active: true
  }));
}

module.exports = { BASE_CATALOG, createCatalogSeed };
