function buildContractNumber(projectId) {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `FD-${stamp}-${projectId}`;
}

module.exports = { buildContractNumber };
