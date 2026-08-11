(function initCalculations(global) {
  function estimateLinearMaterials(totalFeet, postSpacingFeet) {
    const sections = Math.max(1, Math.ceil(Number(totalFeet || 0) / Number(postSpacingFeet || 8)));
    return {
      sections,
      linePosts: Math.max(0, sections - 1),
      terminalPosts: 2,
    };
  }

  global.FenceCalculations = {
    estimateLinearMaterials,
  };
})(window);
