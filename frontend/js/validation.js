(function attachValidation(global) {
  const FE = global.FenceEstimator;
  const { toNumber } = FE.utils;

  FE.Validation = {
    project(data) {
      const errors = [];
      if (!data.customerName?.trim()) errors.push('Customer name is required.');
      if (!data.customerEmail?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.push('A valid email is required.');
      if (!data.customerPhone?.trim()) errors.push('Phone is required.');
      if (!data.address?.trim()) errors.push('Address is required.');
      return errors;
    },
    specs(data) {
      const errors = [];
      if (toNumber(data.linearFeet) <= 0) errors.push('Linear feet must be greater than zero.');
      if (toNumber(data.height) < 3) errors.push('Height must be at least 3 feet.');
      if (toNumber(data.posts) < 0 || toNumber(data.gates) < 0) errors.push('Post and gate counts cannot be negative.');
      return errors;
    },
    extra(data) {
      const errors = [];
      if (!data.description?.trim()) errors.push('Extra description is required.');
      if (toNumber(data.cost) < 0) errors.push('Extra cost cannot be negative.');
      return errors;
    },
    crew(data) {
      const errors = [];
      if (!data.name?.trim()) errors.push('Crew name is required.');
      if (toNumber(data.rate) < 0) errors.push('Crew rate cannot be negative.');
      return errors;
    },
    changeOrder(data) {
      const errors = [];
      if (!data.description?.trim()) errors.push('Change order description is required.');
      return errors;
    },
    note(data) {
      const errors = [];
      if (!data.title?.trim()) errors.push('Note title is required.');
      if (!data.content?.trim()) errors.push('Note content is required.');
      return errors;
    },
    signoff(data) {
      const errors = [];
      if (!data.companyRep?.trim()) errors.push('Company representative is required.');
      if (!data.completionDate) errors.push('Completion date is required.');
      return errors;
    },
  };
})(window);
