export function validateProject(project) {
  const errors = [];
  if (!project?.customerName) errors.push('Customer name is required.');
  if (!project?.address) errors.push('Project address is required.');
  if (project?.linearFeet !== undefined && Number(project.linearFeet) <= 0) {
    errors.push('Linear feet must be greater than zero.');
  }
  return errors;
}
