/**
 * TAB 2 - Fence Specifications
 * frontend/js/tabs/tab2-specs.js
 */

'use strict';

var Tab2Specs = (function () {

  var FORM_ID = 'form-specs';

  var FENCE_TYPES = [
    { value: 'chain_link',   label: 'Chain Link' },
    { value: 'wood_privacy', label: 'Wood Privacy' },
    { value: 'wood_split',   label: 'Wood Split Rail' },
    { value: 'vinyl',        label: 'Vinyl / PVC' },
    { value: 'aluminum',     label: 'Aluminum' },
    { value: 'wrought_iron', label: 'Wrought Iron' },
    { value: 'split_rail',   label: 'Split Rail' },
    { value: 'farm',         label: 'Farm / Field Fence' },
  ];

  var HEIGHT_OPTIONS = [3, 3.5, 4, 5, 6, 7, 8, 10, 12];
  var COLORS         = ['Black', 'Brown', 'White', 'Gray', 'Green', 'Beige', 'Natural', 'Custom'];

  function init() {
    populateSelects();
    loadSavedData();
    attachEvents();
  }

  function populateSelects() {
    // Fence type dropdown
    var typeSelect = document.getElementById('fence_type');
    if (typeSelect) {
      typeSelect.innerHTML = '<option value="">-- Select Type --</option>' +
        FENCE_TYPES.map(function (t) {
          return '<option value="' + t.value + '">' + t.label + '</option>';
        }).join('');
    }

    // Height dropdown
    var htSelect = document.getElementById('fence_height');
    if (htSelect) {
      htSelect.innerHTML = '<option value="">-- Select Height --</option>' +
        HEIGHT_OPTIONS.map(function (h) {
          return '<option value="' + h + '">' + h + ' ft</option>';
        }).join('');
    }

    // Color dropdown
    var colorSelect = document.getElementById('material_color');
    if (colorSelect) {
      colorSelect.innerHTML = COLORS.map(function (c) {
        return '<option value="' + c.toLowerCase() + '">' + c + '</option>';
      }).join('');
    }
  }

  function loadSavedData() {
    var specs = FenceApp.project.specs || {};
    UI.populateForm(FORM_ID, {
      fence_type:       specs.fenceType    || '',
      fence_height:     specs.height       || '',
      linear_feet:      specs.linearFeet   || '',
      material_color:   specs.color        || '',
      gates:            specs.gates        || 0,
      corners:          specs.corners      || 0,
      remove_existing:  specs.removeExisting || false,
      demolition:       specs.demolition   || false,
      grade:            specs.grade        || 'residential',
      notes:            specs.notes        || '',
    });
  }

  function attachEvents() {
    var form = document.getElementById(FORM_ID);
    if (!form) return;

    var typeEl = form.querySelector('[name="fence_type"]');
    if (typeEl) typeEl.addEventListener('change', updatePreview);

    var ftEl   = form.querySelector('[name="linear_feet"]');
    if (ftEl)  ftEl.addEventListener('input', updatePreview);

    var btn = document.getElementById('btn-save-tab2');
    if (btn) btn.addEventListener('click', save);
  }

  function updatePreview() {
    var data = UI.getFormData(FORM_ID);
    var linFt = parseFloat(data.linear_feet) || 0;
    var est   = linFt > 0 ? Calculations.calculateFullEstimate({ specs: { ...data, fenceType: data.fence_type, linearFeet: data.linear_feet }, extras: [], changeOrders: [] }) : null;
    if (est) {
      UI.setCurrency('spec-preview-total', est.grandTotal);
    }
  }

  function save() {
    if (!Validation.validateSpecsTab()) {
      UI.showToast('Please fix errors before saving', 'error');
      return;
    }
    var data = UI.getFormData(FORM_ID);
    FenceApp.project.specs = {
      fenceType:      data.fence_type,
      height:         parseFloat(data.fence_height),
      linearFeet:     parseFloat(data.linear_feet),
      color:          data.material_color,
      gates:          parseInt(data.gates, 10) || 0,
      corners:        parseInt(data.corners, 10) || 0,
      removeExisting: data.remove_existing,
      demolition:     data.demolition,
      grade:          data.grade,
      notes:          data.notes,
    };
    Storage.saveProject(FenceApp.project);
    UI.showToast('Specifications saved ✓', 'success');
  }

  function getData() { return FenceApp.project.specs || {}; }

  return { init, save, getData, FENCE_TYPES };

})();

window.Tab2Specs = Tab2Specs;
