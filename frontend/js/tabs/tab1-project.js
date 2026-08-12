/**
 * TAB 1 - Project Information
 * frontend/js/tabs/tab1-project.js
 */

'use strict';

var Tab1Project = (function () {

  var FORM_ID = 'form-project';

  function init() {
    loadSavedData();
    attachValidation();
    attachSave();
  }

  function loadSavedData() {
    var cust = FenceApp.project.customer || {};
    UI.populateForm(FORM_ID, {
      customer_name:    cust.name    || '',
      customer_company: cust.company || '',
      customer_email:   cust.email   || '',
      customer_phone:   cust.phone   || '',
      customer_address: cust.address || '',
      customer_city:    cust.city    || '',
      customer_state:   cust.state   || '',
      customer_zip:     cust.zip     || '',
      property_type:    cust.propertyType || 'residential',
      job_description:  cust.jobDescription || '',
    });
  }

  function attachValidation() {
    var form = document.getElementById(FORM_ID);
    if (!form) return;
    [
      { id: 'customer_name',  rules: { required: true, minLen: 2 } },
      { id: 'customer_email', rules: { required: true, email: true } },
      { id: 'customer_phone', rules: { required: true, phone: true } },
      { id: 'customer_zip',   rules: { required: true, zip: true } },
    ].forEach(function (f) {
      var el = form.querySelector('[name="' + f.id + '"]');
      if (el) Validation.attachInlineValidation(el, f.rules);
    });
  }

  function attachSave() {
    var btn = document.getElementById('btn-save-tab1');
    if (btn) btn.addEventListener('click', save);
  }

  function save() {
    if (!Validation.validateProjectTab()) {
      UI.showToast('Please fix errors before saving', 'error');
      return;
    }
    var data = UI.getFormData(FORM_ID);
    FenceApp.project.customer = {
      name:           data.customer_name,
      company:        data.customer_company,
      email:          data.customer_email,
      phone:          data.customer_phone,
      address:        data.customer_address,
      city:           data.customer_city,
      state:          data.customer_state,
      zip:            data.customer_zip,
      propertyType:   data.property_type,
      jobDescription: data.job_description,
    };
    Storage.saveProject(FenceApp.project);
    UI.showToast('Project information saved ✓', 'success');
    updateHeaderProjectName();
  }

  function updateHeaderProjectName() {
    var el = document.getElementById('header-project-name');
    if (el && FenceApp.project.customer) {
      el.textContent = FenceApp.project.customer.name || 'New Project';
    }
  }

  function getData() {
    return FenceApp.project.customer || {};
  }

  return { init, save, getData };

})();

window.Tab1Project = Tab1Project;
