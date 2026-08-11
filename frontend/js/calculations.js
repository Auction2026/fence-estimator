(function () {
  const MATERIAL_PRICING = {
    'chain-link': {
      linePost: 42,
      terminalPost: 58,
      meshPerFoot: 8.95,
      tensionWirePerFoot: 1.1,
      topRailPerFoot: 3.45,
      fittingsPerPost: 6.25,
      tiesPerFoot: 0.65,
      gateFramePerFoot: 22
    },
    wood: {
      post: 36,
      railPerFoot: 4.25,
      picketPerFoot: 9.6,
      hardware: 75
    },
    vinyl: {
      post: 58,
      panelPerFoot: 18.25,
      cap: 4.5,
      hardware: 95
    },
    ornamental: {
      post: 72,
      panelPerFoot: 21.75,
      finial: 3.95,
      hardware: 110
    }
  };

  function toNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function roundUp(value, increment) {
    const normalizedValue = toNumber(value);
    const normalizedIncrement = Math.max(toNumber(increment, 1), 0.01);
    return Math.ceil(normalizedValue / normalizedIncrement) * normalizedIncrement;
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(toNumber(amount));
  }

  function calculateGateMaterials(gateCount, gateWidth, fenceType = 'chain-link') {
    const count = Math.max(0, toNumber(gateCount));
    const width = Math.max(0, toNumber(gateWidth, 4));
    if (!count) {
      return [];
    }

    if (fenceType === 'chain-link') {
      const pricing = MATERIAL_PRICING['chain-link'];
      return [
        {
          item: 'Chain Link Gate Frames',
          quantity: count,
          unit: 'ea',
          unitCost: roundUp(width * pricing.gateFramePerFoot, 0.01),
          total: roundUp(count * width * pricing.gateFramePerFoot, 0.01)
        },
        {
          item: 'Gate Hinges & Latches',
          quantity: count,
          unit: 'set',
          unitCost: 68,
          total: roundUp(count * 68, 0.01)
        }
      ];
    }

    return [{
      item: 'Gate Hardware Package',
      quantity: count,
      unit: 'set',
      unitCost: 120,
      total: roundUp(count * 120, 0.01)
    }];
  }

  function calculateMaterials(specs = {}) {
    const type = specs.fenceType || 'chain-link';
    const footage = Math.max(0, toNumber(specs.totalFootage || specs.linearFeet));
    const gateCount = Math.max(0, toNumber(specs.gateCount));
    const gateWidth = Math.max(0, toNumber(specs.gateWidth, 4));
    const cornerPosts = Math.max(2, toNumber(specs.cornerPosts, 2));
    const height = Math.max(4, toNumber(specs.fenceHeight || specs.height, 6));

    if (!footage) {
      return [];
    }

    if (type === 'chain-link') {
      const pricing = MATERIAL_PRICING['chain-link'];
      const spanCount = Math.max(1, Math.ceil(footage / 10));
      const linePosts = Math.max(0, spanCount - 1);
      const terminalPosts = cornerPosts + (gateCount * 2);
      const meshFootage = roundUp(footage, 1);
      const topRail = roundUp(footage, 1);
      const tensionWire = roundUp(footage, 1);
      const tieCount = roundUp(footage * (height >= 6 ? 1.4 : 1.15), 1);
      const fittings = (linePosts + terminalPosts) * 2;

      return [
        { item: 'Line Posts', quantity: linePosts, unit: 'ea', unitCost: pricing.linePost, total: roundUp(linePosts * pricing.linePost, 0.01) },
        { item: 'Terminal / Corner Posts', quantity: terminalPosts, unit: 'ea', unitCost: pricing.terminalPost, total: roundUp(terminalPosts * pricing.terminalPost, 0.01) },
        { item: 'Chain Link Mesh', quantity: meshFootage, unit: 'lf', unitCost: pricing.meshPerFoot, total: roundUp(meshFootage * pricing.meshPerFoot, 0.01) },
        { item: 'Top Rail', quantity: topRail, unit: 'lf', unitCost: pricing.topRailPerFoot, total: roundUp(topRail * pricing.topRailPerFoot, 0.01) },
        { item: 'Tension Wire', quantity: tensionWire, unit: 'lf', unitCost: pricing.tensionWirePerFoot, total: roundUp(tensionWire * pricing.tensionWirePerFoot, 0.01) },
        { item: 'Ties / Fasteners', quantity: tieCount, unit: 'ea', unitCost: pricing.tiesPerFoot, total: roundUp(tieCount * pricing.tiesPerFoot, 0.01) },
        { item: 'Bands & Fittings', quantity: fittings, unit: 'ea', unitCost: pricing.fittingsPerPost, total: roundUp(fittings * pricing.fittingsPerPost, 0.01) },
        ...calculateGateMaterials(gateCount, gateWidth, type)
      ];
    }

    if (type === 'wood') {
      const pricing = MATERIAL_PRICING.wood;
      const posts = Math.ceil(footage / 8) + 1;
      return [
        { item: '4x4 Posts', quantity: posts, unit: 'ea', unitCost: pricing.post, total: roundUp(posts * pricing.post, 0.01) },
        { item: 'Rails', quantity: footage * 2, unit: 'lf', unitCost: pricing.railPerFoot, total: roundUp(footage * 2 * pricing.railPerFoot, 0.01) },
        { item: 'Pickets / Boards', quantity: footage, unit: 'lf', unitCost: pricing.picketPerFoot, total: roundUp(footage * pricing.picketPerFoot, 0.01) },
        { item: 'Hardware & Concrete', quantity: 1, unit: 'lot', unitCost: pricing.hardware, total: pricing.hardware },
        ...calculateGateMaterials(gateCount, gateWidth, type)
      ];
    }

    if (type === 'vinyl') {
      const pricing = MATERIAL_PRICING.vinyl;
      const posts = Math.ceil(footage / 8) + 1;
      return [
        { item: 'Vinyl Posts', quantity: posts, unit: 'ea', unitCost: pricing.post, total: roundUp(posts * pricing.post, 0.01) },
        { item: 'Vinyl Panels', quantity: footage, unit: 'lf', unitCost: pricing.panelPerFoot, total: roundUp(footage * pricing.panelPerFoot, 0.01) },
        { item: 'Post Caps', quantity: posts, unit: 'ea', unitCost: pricing.cap, total: roundUp(posts * pricing.cap, 0.01) },
        { item: 'Hardware & Adhesive', quantity: 1, unit: 'lot', unitCost: pricing.hardware, total: pricing.hardware },
        ...calculateGateMaterials(gateCount, gateWidth, type)
      ];
    }

    const pricing = MATERIAL_PRICING.ornamental;
    const posts = Math.ceil(footage / 8) + 1;
    return [
      { item: 'Ornamental Posts', quantity: posts, unit: 'ea', unitCost: pricing.post, total: roundUp(posts * pricing.post, 0.01) },
      { item: 'Ornamental Panels', quantity: footage, unit: 'lf', unitCost: pricing.panelPerFoot, total: roundUp(footage * pricing.panelPerFoot, 0.01) },
      { item: 'Finials / Trim', quantity: posts, unit: 'ea', unitCost: pricing.finial, total: roundUp(posts * pricing.finial, 0.01) },
      { item: 'Hardware', quantity: 1, unit: 'lot', unitCost: pricing.hardware, total: pricing.hardware },
      ...calculateGateMaterials(gateCount, gateWidth, type)
    ];
  }

  function calculateLaborCost(specs = {}, laborRate = 65) {
    const footage = Math.max(0, toNumber(specs.totalFootage || specs.linearFeet));
    const gateCount = Math.max(0, toNumber(specs.gateCount));
    const crewSize = Math.max(1, toNumber(specs.crewSize || specs.installCrewSize, 2));
    const type = specs.fenceType || 'chain-link';
    const height = Math.max(4, toNumber(specs.fenceHeight || specs.height, 6));

    const productivityByType = {
      'chain-link': 18,
      wood: 12,
      vinyl: 10,
      ornamental: 9
    };

    const baseFeetPerHour = productivityByType[type] || productivityByType['chain-link'];
    const heightMultiplier = height >= 8 ? 1.2 : height >= 6 ? 1.1 : 1;
    const gateHours = gateCount * (type === 'chain-link' ? 2.5 : 3.5);
    const hours = roundUp(((footage / baseFeetPerHour) * heightMultiplier) + gateHours, 0.5);
    const rate = toNumber(laborRate, 65);
    const cost = roundUp(hours * crewSize * rate, 0.01);

    return {
      hours,
      crewSize,
      rate,
      cost,
      productionRate: baseFeetPerHour
    };
  }

  function calculateTotal(materials = [], labor = { cost: 0 }, markup = 0, extras = 0) {
    const materialsTotal = materials.reduce((sum, item) => sum + toNumber(item.total), 0);
    const laborTotal = toNumber(labor.cost);
    const extrasTotal = toNumber(extras);
    const subtotal = roundUp(materialsTotal + laborTotal + extrasTotal, 0.01);
    const markupAmount = roundUp(subtotal * (toNumber(markup) / 100), 0.01);
    const total = roundUp(subtotal + markupAmount, 0.01);

    return {
      materialsTotal,
      laborTotal,
      extrasTotal,
      subtotal,
      markup: toNumber(markup),
      markupAmount,
      total
    };
  }

  window.Calculations = {
    calculateMaterials,
    calculateLaborCost,
    calculateTotal,
    calculateGateMaterials,
    formatCurrency,
    roundUp
  };
})();
