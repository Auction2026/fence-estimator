/**
 * FENCE DEPOT ESTIMATOR - Calculation Engine
 * frontend/js/calculations.js
 */

'use strict';

var Calculations = (function () {

  // ---- PRICE TABLES ----
  var LABOR_RATES = {
    chain_link:   { perFoot: 8.50,  postSetting: 45, gatePer: 120 },
    wood_privacy: { perFoot: 14.00, postSetting: 55, gatePer: 180 },
    wood_split:   { perFoot: 10.00, postSetting: 50, gatePer: 150 },
    vinyl:        { perFoot: 16.00, postSetting: 60, gatePer: 200 },
    aluminum:     { perFoot: 18.00, postSetting: 65, gatePer: 220 },
    wrought_iron: { perFoot: 22.00, postSetting: 75, gatePer: 280 },
    split_rail:   { perFoot: 9.00,  postSetting: 40, gatePer: 130 },
    farm:         { perFoot: 6.00,  postSetting: 35, gatePer: 100 },
  };

  var TAX_RATES = {
    materials: 0.08,  // 8%
    labor:     0.00,  // labor not taxed by default
  };

  var MARKUP = 0.30;  // 30% markup on materials

  // ---- POST SPACING by fence type ----
  var POST_SPACING = {
    chain_link:   8,
    wood_privacy: 8,
    wood_split:   8,
    vinyl:        8,
    aluminum:     6,
    wrought_iron: 6,
    split_rail:   8,
    farm:         10,
  };

  // ---- MATERIAL COST CALCULATION ----
  function calculateMaterials(specs) {
    var linFt    = parseFloat(specs.linearFeet) || 0;
    var fenceType= specs.fenceType || 'chain_link';
    var height   = parseFloat(specs.height) || 4;
    var gates    = parseInt(specs.gates, 10) || 0;
    var corners  = parseInt(specs.corners, 10) || 0;

    var spacing  = POST_SPACING[fenceType] || 8;
    var postCount= Math.ceil(linFt / spacing) + 1 + (corners * 2);

    // Base material rates per linear foot (by type)
    var matRates = {
      chain_link:   4.50,
      wood_privacy: 8.00,
      wood_split:   5.00,
      vinyl:        10.00,
      aluminum:     12.00,
      wrought_iron: 16.00,
      split_rail:   4.00,
      farm:         2.50,
    };

    var baseMat  = (matRates[fenceType] || 4.50) * linFt * (height / 4);
    var postMat  = postCount * 18;  // avg $18/post base
    var gateMat  = gates * 85;      // avg $85/gate base
    var hardwareMat = linFt * 0.80; // hardware ~$0.80/ft
    var concreteMat = postCount * 4; // $4/post for concrete

    var rawTotal = baseMat + postMat + gateMat + hardwareMat + concreteMat;
    var withMarkup = rawTotal * (1 + MARKUP);
    var tax = withMarkup * TAX_RATES.materials;

    return {
      baseMaterial:  round(baseMat),
      posts:         round(postMat),
      gates:         round(gateMat),
      hardware:      round(hardwareMat),
      concrete:      round(concreteMat),
      subtotal:      round(rawTotal),
      withMarkup:    round(withMarkup),
      materialTax:   round(tax),
      postCount:     postCount,
      gateCount:     gates,
    };
  }

  // ---- LABOR COST CALCULATION ----
  function calculateLabor(specs) {
    var linFt    = parseFloat(specs.linearFeet) || 0;
    var fenceType= specs.fenceType || 'chain_link';
    var gates    = parseInt(specs.gates, 10) || 0;
    var removal  = specs.removeExisting ? (linFt * 2.50) : 0;
    var demo     = specs.demolition ? 350 : 0;

    var rates    = LABOR_RATES[fenceType] || LABOR_RATES.chain_link;
    var postCount= Math.ceil(linFt / (POST_SPACING[fenceType] || 8)) + 1;

    var linLabor = linFt * rates.perFoot;
    var postLabor= postCount * rates.postSetting;
    var gateLabor= gates * rates.gatePer;
    var cleanup  = linFt * 0.50;

    var subtotal = linLabor + postLabor + gateLabor + cleanup + removal + demo;

    return {
      linearFootLabor: round(linLabor),
      postSetting:     round(postLabor),
      gateInstall:     round(gateLabor),
      cleanup:         round(cleanup),
      removalDemo:     round(removal + demo),
      subtotal:        round(subtotal),
      laborTax:        0,  // labor not taxed
    };
  }

  // ---- EQUIPMENT CALCULATION ----
  function calculateEquipment(specs) {
    var linFt    = parseFloat(specs.linearFeet) || 0;
    var days     = Math.ceil(linFt / 200);  // est. 200 ft/day
    var diggerRental  = days * 150;
    var truckFuel     = days * 80;
    var misc          = 150;

    return {
      equipment: round(diggerRental),
      fuel:      round(truckFuel),
      misc:      round(misc),
      subtotal:  round(diggerRental + truckFuel + misc),
    };
  }

  // ---- EXTRAS CALCULATION ----
  function calculateExtras(extras) {
    if (!Array.isArray(extras)) return { subtotal: 0, items: [] };
    var total = extras.reduce(function (sum, item) {
      return sum + (parseFloat(item.rate) || 0) * (parseFloat(item.qty) || 0);
    }, 0);
    return { subtotal: round(total), items: extras };
  }

  // ---- CHANGE ORDER CALCULATION ----
  function calculateChangeOrders(changeOrders) {
    if (!Array.isArray(changeOrders)) return { subtotal: 0 };
    var total = changeOrders
      .filter(function (co) { return co.approved; })
      .reduce(function (sum, co) { return sum + (parseFloat(co.amount) || 0); }, 0);
    return { subtotal: round(total) };
  }

  // ---- FULL ESTIMATE ----
  function calculateFullEstimate(project) {
    var specs  = project.specs || {};
    var mat    = calculateMaterials(specs);
    var lab    = calculateLabor(specs);
    var equip  = calculateEquipment(specs);
    var extras = calculateExtras(project.extras);
    var cos    = calculateChangeOrders(project.changeOrders);

    var beforeTax = mat.withMarkup + lab.subtotal + equip.subtotal + extras.subtotal + cos.subtotal;
    var tax       = mat.materialTax;
    var grandTotal= beforeTax + tax;

    return {
      materials:    mat,
      labor:        lab,
      equipment:    equip,
      extras:       extras,
      changeOrders: cos,
      beforeTax:    round(beforeTax),
      tax:          round(tax),
      grandTotal:   round(grandTotal),
      perLinearFoot:round(grandTotal / (parseFloat(specs.linearFeet) || 1)),
    };
  }

  // ---- UTILITY ----
  function round(n) {
    return Math.round((n || 0) * 100) / 100;
  }

  // ---- Public ----
  return {
    calculateMaterials,
    calculateLabor,
    calculateEquipment,
    calculateExtras,
    calculateChangeOrders,
    calculateFullEstimate,
    round,
    LABOR_RATES,
    TAX_RATES,
    MARKUP,
  };

})();

window.Calculations = Calculations;
