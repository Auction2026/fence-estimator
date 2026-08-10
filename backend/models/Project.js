class Project {
  static normalize(payload = {}) {
    return {
      name: String(payload.name || 'Untitled Project').trim(),
      customerName: String(payload.customerName || '').trim(),
      address: String(payload.address || '').trim(),
      city: String(payload.city || '').trim(),
      province: String(payload.province || '').trim(),
      postalCode: String(payload.postalCode || '').trim(),
      fenceType: String(payload.fenceType || 'chain-link').trim(),
      status: String(payload.status || 'draft').trim(),
      linearFeet: Number(payload.linearFeet || 0),
      notes: String(payload.notes || '').trim()
    };
  }

  static validate(payload = {}) {
    const project = Project.normalize(payload);
    const errors = [];

    if (!project.name) errors.push('Project name is required.');
    if (!project.customerName) errors.push('Customer name is required.');
    if (Number.isNaN(project.linearFeet) || project.linearFeet < 0) {
      errors.push('Linear feet must be a valid positive number.');
    }

    return { value: project, errors };
  }
}

module.exports = Project;
