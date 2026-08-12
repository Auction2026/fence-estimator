/**
 * FENCE DEPOT ESTIMATOR - Static Catalog Data
 * backend/controllers/catalogData.js
 */

'use strict';

const PRODUCTS = [
  { id: 'CL001', sku: 'CL-2IN-11GA-48', name: '2" Mesh 11ga Galvanized Fabric 48"',  department: 'Chain Link', unit: 'LF', price: 0.62 },
  { id: 'CL002', sku: 'CL-2IN-11GA-60', name: '2" Mesh 11ga Galvanized Fabric 60"',  department: 'Chain Link', unit: 'LF', price: 0.75 },
  { id: 'CL003', sku: 'CL-2IN-11GA-72', name: '2" Mesh 11ga Galvanized Fabric 72"',  department: 'Chain Link', unit: 'LF', price: 0.88 },
  { id: 'CL004', sku: 'CL-LP-2IN-60',   name: '2" Line Post 60" Galvanized',          department: 'Chain Link', unit: 'EA', price: 14.50 },
  { id: 'CL005', sku: 'CL-LP-2IN-84',   name: '2" Line Post 84" Galvanized',          department: 'Chain Link', unit: 'EA', price: 18.75 },
  { id: 'CL006', sku: 'CL-RAIL-1-5/8',  name: '1-5/8" Top Rail 21ft',                department: 'Chain Link', unit: 'EA', price: 22.00 },
  { id: 'CL007', sku: 'CL-WG-36X60',    name: '36"x60" Walk Gate Chain Link',        department: 'Chain Link', unit: 'EA', price: 135.00 },
  { id: 'CL008', sku: 'CL-DG-10FT-72',  name: '10ft Double Drive Gate',              department: 'Chain Link', unit: 'EA', price: 395.00 },
  { id: 'WD001', sku: 'WD-BOA-6X6-6',   name: '1x6 Dog-Ear Cedar Board 6ft',        department: 'Wood',       unit: 'EA', price: 3.45 },
  { id: 'WD002', sku: 'WD-POST-4X4-8',  name: '4x4 Cedar Post 8ft',                 department: 'Wood',       unit: 'EA', price: 18.50 },
  { id: 'VN001', sku: 'VN-PNL-PRIV-6',  name: 'Vinyl Privacy Panel 6ft White',      department: 'Vinyl',      unit: 'EA', price: 38.00 },
  { id: 'VN002', sku: 'VN-POST-5X5-72', name: '5x5 Vinyl Post 72"',                 department: 'Vinyl',      unit: 'EA', price: 45.00 },
  { id: 'AL001', sku: 'AL-PNL-FLAT-4',  name: 'Aluminum Flat Top Panel 4ft Black',  department: 'Aluminum',   unit: 'EA', price: 58.00 },
  { id: 'AL002', sku: 'AL-POST-2X2-84', name: '2x2 Aluminum Post 84" Black',        department: 'Aluminum',   unit: 'EA', price: 32.00 },
  { id: 'HW001', sku: 'HW-CONC-60',     name: 'Quikrete Fast-Set 60lb',              department: 'Hardware',   unit: 'BG', price: 8.50 },
  { id: 'HW002', sku: 'HW-HINGE-6IN',   name: '6" Heavy Duty Gate Hinge Galv (pr)', department: 'Hardware',   unit: 'PR', price: 22.00 },
  { id: 'GT001', sku: 'GT-OPENER-SS500',name: 'Mighty Mule Single Swing Opener',    department: 'Gate Openers',unit:'EA', price: 695.00 },
];

module.exports = { PRODUCTS };
