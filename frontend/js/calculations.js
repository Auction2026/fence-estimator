(function attachCalculations(global) {
  const FE = global.FenceEstimator;
  const { toNumber } = FE.utils;
  const RATES = {
    'chain-link': { material: 24, post: 34, gate: 180, laborHoursPerFoot: 0.11 },
    wood: { material: 34, post: 42, gate: 240, laborHoursPerFoot: 0.16 },
    vinyl: { material: 41, post: 48, gate: 310, laborHoursPerFoot: 0.15 },
    ornamental: { material: 52, post: 61, gate: 425, laborHoursPerFoot: 0.17 },
    aluminum: { material: 44, post: 54, gate: 360, laborHoursPerFoot: 0.14 },
  };

  function getRate(specs) {
    return RATES[specs.fenceType] || RATES['chain-link'];
  }

  function buildScopeSummary(state) {
    return [
      `${state.specs.linearFeet || 0} lf ${state.specs.fenceType || 'fence'}`,
      `${state.specs.height || 0} ft height`,
      `${state.specs.gates || 0} gate(s)`,
      `Terrain: ${state.specs.terrain || 'Flat'}`,
      `Crew size: ${state.installation.crewSize || 0}`,
    ];
  }

  function calculateInstallationDays(linearFeet, crewSize) {
    const productionPerDay = Math.max(80, crewSize * 55);
    return Math.max(1, Math.ceil(toNumber(linearFeet) / productionPerDay));
  }

  FE.Calculations = {
    getRate,
    calculateEstimate(state) {
      const specs = state.specs;
      const installation = state.installation;
      const permits = state.permits;
      const extras = state.extras || [];
      const rate = getRate(specs);
      const linearFeet = toNumber(specs.linearFeet);
      const posts = toNumber(specs.posts);
      const gates = toNumber(specs.gates);
      const heightMultiplier = Math.max(1, toNumber(specs.height, 6) / 6);
      const terrainMultiplier = { Flat: 1, Sloped: 1.08, Rocky: 1.18, Mixed: 1.1 }[specs.terrain] || 1;
      const materialCost = linearFeet * rate.material * heightMultiplier;
      const postCost = posts * rate.post;
      const gateCost = gates * rate.gate * Math.max(1, toNumber(specs.gateWidth, 4) / 4);
      const laborHours = linearFeet * rate.laborHoursPerFoot * terrainMultiplier;
      const laborRate = toNumber(installation.laborRate, 65);
      const laborCost = laborHours * laborRate;
      const days = calculateInstallationDays(linearFeet, toNumber(installation.crewSize, 3));
      const equipmentCost = days * toNumber(installation.equipmentRate, 175);
      const permitCost = permits.required ? toNumber(permits.fee) : 0;
      const extrasCost = extras.reduce((sum, item) => sum + toNumber(item.cost), 0);
      const subtotal = materialCost + postCost + gateCost + laborCost + equipmentCost + permitCost + extrasCost;
      const tax = subtotal * 0.13;
      const total = subtotal + tax;
      return {
        materials: round(materialCost + postCost + gateCost),
        labor: round(laborCost),
        equipment: round(equipmentCost),
        permits: round(permitCost),
        extras: round(extrasCost),
        subtotal: round(subtotal),
        tax: round(tax),
        total: round(total),
        laborHours: round(laborHours),
        durationDays: days,
        scopeSummary: buildScopeSummary(state),
      };
    },
    createContractPreview(state) {
      const project = state.project;
      const estimate = state.estimate;
      const contract = state.contract;
      const deposit = round(estimate.total * toNumber(contract.depositRate, 0.25));
      return [
        `CUSTOMER: ${project.customerName || 'Pending customer'}`,
        `ADDRESS: ${project.address || 'Pending address'}`,
        `FENCE TYPE: ${state.specs.fenceType || 'Pending specs'}`,
        `LINEAR FEET: ${state.specs.linearFeet || 0}`,
        `TOTAL: ${FE.utils.formatCurrency(estimate.total)}`,
        `DEPOSIT: ${FE.utils.formatCurrency(deposit)}`,
        `WARRANTY: ${contract.warranty || 'Standard workmanship warranty'}`,
        `PAYMENT TERMS: ${contract.paymentTerms || 'Deposit on approval, balance on completion.'}`,
        `PRICE LOCKED: ${contract.priceLocked ? 'YES' : 'NO'}`,
        `CUSTOMER ACCEPTED: ${contract.customerAccepted ? 'YES' : 'NO'}`,
      ].join('\n');
    },
  };

  function round(value) {
    return Math.round(toNumber(value) * 100) / 100;
  }
})(window);
