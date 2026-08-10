class Estimate {
  static normalize(payload = {}) {
    return {
      projectId: Number(payload.projectId || 0),
      fenceType: String(payload.fenceType || 'chain-link').trim(),
      linearFeet: Number(payload.linearFeet || 0),
      heightFeet: Number(payload.heightFeet || 6),
      gates: Number(payload.gates || 0),
      tearOutFeet: Number(payload.tearOutFeet || 0),
      labourRate: Number(payload.labourRate || 78),
      overheadRate: Number(payload.overheadRate || 0.12),
      profitRate: Number(payload.profitRate || 0.18),
      notes: String(payload.notes || '').trim()
    };
  }

  static validate(payload = {}) {
    const estimate = Estimate.normalize(payload);
    const errors = [];

    if (Number.isNaN(estimate.projectId) || estimate.projectId < 0) errors.push('Valid projectId is required.');
    for (const field of ['linearFeet', 'heightFeet', 'gates', 'tearOutFeet', 'labourRate']) {
      if (Number.isNaN(estimate[field]) || estimate[field] < 0) {
        errors.push(`${field} must be a valid positive number.`);
      }
    }

    return { value: estimate, errors };
  }
}

module.exports = Estimate;
