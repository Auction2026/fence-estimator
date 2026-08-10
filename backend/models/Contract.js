class Contract {
  static normalize(payload = {}) {
    return {
      projectId: Number(payload.projectId || 0),
      estimateId: Number(payload.estimateId || 0),
      title: String(payload.title || 'Fence Installation Contract').trim(),
      customerName: String(payload.customerName || '').trim(),
      status: String(payload.status || 'draft').trim(),
      total: Number(payload.total || 0),
      paymentTerms: String(payload.paymentTerms || '50% deposit, balance due on completion').trim(),
      scope: String(payload.scope || '').trim(),
      notes: String(payload.notes || '').trim()
    };
  }

  static validate(payload = {}) {
    const contract = Contract.normalize(payload);
    const errors = [];

    if (Number.isNaN(contract.projectId) || contract.projectId < 0) errors.push('Valid projectId is required.');
    if (!contract.customerName) errors.push('Customer name is required.');
    if (Number.isNaN(contract.total) || contract.total < 0) errors.push('Total must be a valid positive number.');

    return { value: contract, errors };
  }
}

module.exports = Contract;
