export function validateTabData(fields, payload) {
  const issues = [];
  for (const field of fields) {
    if (field.required && !String(payload[field.name] || '').trim()) {
      issues.push(`${field.label} is required.`);
    }
  }
  return issues;
}

export function validateEstimateInput(payload) {
  const issues = [];
  for (const key of ['linearFeet', 'heightFeet', 'gates']) {
    const value = Number(payload[key] || 0);
    if (Number.isNaN(value) || value < 0) {
      issues.push(`${key} must be a valid positive number.`);
    }
  }
  return issues;
}
