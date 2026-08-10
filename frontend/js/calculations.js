window.FECalc = {
  estimate({ linearFeet = 0, height = 6, laborRate = 12 }) {
    const materials = linearFeet * height * 1.25;
    const labor = linearFeet * laborRate;
    const total = materials + labor;
    return { materials, labor, total };
  }
};
