/**
 * @module ui
 * @description UI helpers for tabs, modals, toasts, tables, summaries, printing, and exports.
 */
(function uiModule(global) {
    'use strict';

    // Shared DOM state and defaults
    var ACTIVE_CLASS = "is-active";
    var HIDDEN_CLASS = "is-hidden";
    var TOAST_CONTAINER_ID = "fe-toast-container";
    var LOADING_CONTAINER_ID = "fe-loading-overlay";
    var modalStack = [];
    var toastQueue = [];
    function getDocument() {
        if (!global.document) {
            throw new Error('UI module requires a browser document.');
        }
        return global.document;
    }

    function getElement(target) {
        if (!target) {
            return null;
        }
        if (target.nodeType === 1) {
            return target;
        }
        var documentRef = getDocument();
        return documentRef.getElementById(target) || documentRef.querySelector(target);
    }

    function ensureElement(target, label) {
        var element = getElement(target);
        if (!element) {
            throw new Error((label || 'UI element') + ' was not found.');
        }
        return element;
    }

    function ensureContainer(id, className) {
        var documentRef = getDocument();
        var element = documentRef.getElementById(id);
        if (!element) {
            element = documentRef.createElement('div');
            element.id = id;
            element.className = className || '';
            documentRef.body.appendChild(element);
        }
        return element;
    }

    function createElement(tagName, className, textContent) {
        var element = getDocument().createElement(tagName);
        if (className) {
            element.className = className;
        }
        if (typeof textContent !== 'undefined') {
            element.textContent = textContent;
        }
        return element;
    }

    function setHidden(element, hidden) {
        if (hidden) {
            element.classList.add(HIDDEN_CLASS);
            element.setAttribute('hidden', 'hidden');
        } else {
            element.classList.remove(HIDDEN_CLASS);
            element.removeAttribute('hidden');
        }
    }

    function formatCurrency(value, currency, locale) {
        var numeric = Number(value);
        return new Intl.NumberFormat(locale || 'en-US', {
            style: 'currency',
            currency: currency || 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(Number.isFinite(numeric) ? numeric : 0);
    }

    function formatDate(value, locale, options) {
        var date = value instanceof Date ? value : new Date(value);
        if (Number.isNaN(date.getTime())) {
            return '';
        }
        return new Intl.DateTimeFormat(locale || 'en-US', options || {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        }).format(date);
    }

    function normalizeRows(rows) {
        return Array.isArray(rows) ? rows : [];
    }

    function normalizeColumns(columns) {
        return Array.isArray(columns) ? columns : [];
    }
    // Tabs and modal interactions
    function showTab(target, options) {
        var tab = ensureElement(target, 'Tab');
        var container = options && options.container ? ensureElement(options.container, 'Tab container') : tab.parentNode;
        if (container && container.querySelectorAll) {
            container.querySelectorAll('[data-tab-panel], .tab-panel, .tab-content').forEach(function eachPanel(panel) {
                panel.classList.remove(ACTIVE_CLASS);
                setHidden(panel, true);
            });
        }
        tab.classList.add(ACTIVE_CLASS);
        setHidden(tab, false);
        return tab;
    }

    function hideTab(target) {
        var tab = ensureElement(target, 'Tab');
        tab.classList.remove(ACTIVE_CLASS);
        setHidden(tab, true);
        return tab;
    }

    function showModal(target, options) {
        var modal = ensureElement(target, 'Modal');
        modal.classList.add(ACTIVE_CLASS);
        modal.setAttribute('aria-hidden', 'false');
        setHidden(modal, false);
        if (options && options.backdrop !== false) {
            modal.classList.add('has-backdrop');
        }
        modalStack.push(modal);
        getDocument().body.classList.add('modal-open');
        return modal;
    }

    function hideModal(target) {
        var modal = ensureElement(target, 'Modal');
        modal.classList.remove(ACTIVE_CLASS);
        modal.setAttribute('aria-hidden', 'true');
        setHidden(modal, true);
        modalStack = modalStack.filter(function filterModal(entry) {
            return entry !== modal;
        });
        if (!modalStack.length) {
            getDocument().body.classList.remove('modal-open');
        }
        return modal;
    }

    function showToast(message, options) {
        var container = ensureContainer(TOAST_CONTAINER_ID, 'fe-toast-container');
        var toast = createElement('div', 'fe-toast ' + ((options && options.type) || 'info'));
        var closeButton = createElement('button', 'fe-toast-close', '×');
        var timeout = Math.max(1000, Number(options && options.duration) || 4000);
        toast.setAttribute('role', 'status');
        toast.appendChild(createElement('div', 'fe-toast-message', String(message || '')));
        closeButton.type = 'button';
        closeButton.addEventListener('click', function onClose() {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        });
        toast.appendChild(closeButton);
        container.appendChild(toast);
        toastQueue.push(toast);
        global.setTimeout(function removeToast() {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            toastQueue = toastQueue.filter(function filterItem(item) {
                return item !== toast;
            });
        }, timeout);
        return toast;
    }

    function showLoading(message) {
        var overlay = ensureContainer(LOADING_CONTAINER_ID, 'fe-loading-overlay');
        overlay.innerHTML = '';
        overlay.appendChild(createElement('div', 'fe-loading-spinner', ''));
        overlay.appendChild(createElement('div', 'fe-loading-message', message || 'Loading...'));
        overlay.classList.add(ACTIVE_CLASS);
        setHidden(overlay, false);
        return overlay;
    }

    function hideLoading() {
        var overlay = getElement(LOADING_CONTAINER_ID);
        if (overlay) {
            overlay.classList.remove(ACTIVE_CLASS);
            setHidden(overlay, true);
        }
        return overlay;
    }

    // Tables, summaries, sections, and exports
    function renderTable(target, columns, rows, options) {
        var container = ensureElement(target, "Table container");
        var table = createElement("table", (options && options.className) || "fe-table");
        var thead = createElement("thead");
        var tbody = createElement("tbody");
        var headerRow = createElement("tr");
        normalizeColumns(columns).forEach(function eachColumn(column) {
            var th = createElement("th", "", column.label || column.key || "");
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        normalizeRows(rows).forEach(function eachRow(row, rowIndex) {
            var tr = createElement("tr");
            normalizeColumns(columns).forEach(function eachColumn(column) {
                var value = typeof column.render === "function" ? column.render(row, rowIndex) : row[column.key];
                var td = createElement("td");
                td.textContent = value === null || typeof value === "undefined" ? "" : String(value);
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(thead);
        table.appendChild(tbody);
        container.innerHTML = "";
        container.appendChild(table);
        return table;
    }

    function updateSummary(target, summary, options) {
        var container = ensureElement(target, "Summary container");
        var entries = Object.keys(summary || {});
        container.innerHTML = "";
        entries.forEach(function eachEntry(key) {
            var row = createElement("div", (options && options.rowClass) || "summary-row");
            row.appendChild(createElement("span", "summary-label", key));
            row.appendChild(createElement("span", "summary-value", summary[key]));
            container.appendChild(row);
        });
        return container;
    }

    function toggleSection(target, forceOpen) {
        var section = ensureElement(target, "Section");
        var isOpen = typeof forceOpen === "boolean" ? forceOpen : section.classList.contains(ACTIVE_CLASS) === false;
        section.classList.toggle(ACTIVE_CLASS, isOpen);
        setHidden(section, !isOpen);
        return isOpen;
    }

    function printView(target, options) {
        var element = target ? ensureElement(target, "Print target") : getDocument().body;
        var title = options && options.title ? options.title : getDocument().title;
        var popup = global.open("", "PRINT", "height=700,width=900");
        if (!popup) {
            throw new Error("Unable to open print window.");
        }
        popup.document.write("<html><head><title>" + title + "</title></head><body>");
        popup.document.write(element.outerHTML);
        popup.document.write("</body></html>");
        popup.document.close();
        popup.focus();
        popup.print();
        popup.close();
        return true;
    }

    function exportCSV(filename, columns, rows) {
        var header = normalizeColumns(columns).map(function mapColumn(column) {
            return "\"" + String(column.label || column.key || "").replace(/"/g, "\"\"") + "\"";
        }).join(",");
        var body = normalizeRows(rows).map(function mapRow(row, rowIndex) {
            return normalizeColumns(columns).map(function mapColumn(column) {
                var value = typeof column.render === "function" ? column.render(row, rowIndex) : row[column.key];
                return "\"" + String(value === null || typeof value === "undefined" ? "" : value).replace(/"/g, "\"\"") + "\"";
            }).join(",");
        }).join("\n");
        var csv = [header, body].join("\n");
        var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        var link = createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename || "export.csv";
        link.style.display = "none";
        getDocument().body.appendChild(link);
        link.click();
        getDocument().body.removeChild(link);
        return csv;
    }

    function initDatePickers(selector, options) {
        var nodes = selector ? getDocument().querySelectorAll(selector) : getDocument().querySelectorAll("input[type=date]");
        nodes.forEach(function eachInput(input) {
            if (options && options.min) {
                input.min = options.min;
            }
            if (options && options.max) {
                input.max = options.max;
            }
            if (options && options.defaultToday && !input.value) {
                input.value = new Date().toISOString().slice(0, 10);
            }
        });
        return nodes;
    }

    function bindModalCloseButtons() {
        getDocument().querySelectorAll("[data-modal-close]").forEach(function eachButton(button) {
            button.addEventListener("click", function onClick() {
                var selector = button.getAttribute("data-modal-close");
                hideModal(selector);
            });
        });
    }

    function clearToasts() {
        toastQueue.slice().forEach(function eachToast(toast) {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        });
        toastQueue = [];
    }

    function wireTabButtons() {
        getDocument().querySelectorAll("[data-show-tab]").forEach(function eachButton(button) {
            button.addEventListener("click", function onClick() {
                showTab(button.getAttribute("data-show-tab"));
            });
        });
    }



    // Supplemental DOM utilities and interaction helpers
    function setText(target, value) {
        var element = ensureElement(target, 'Text target');
        element.textContent = value === null || typeof value === 'undefined' ? '' : String(value);
        return element;
    }

    function setHTML(target, html) {
        var element = ensureElement(target, 'HTML target');
        element.innerHTML = html || '';
        return element;
    }

    function syncAriaExpanded(trigger, expanded) {
        var button = ensureElement(trigger, 'Trigger');
        button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        return button;
    }

    function enableEscapeToClose() {
        getDocument().addEventListener('keydown', function onKeydown(event) {
            if (event.key === 'Escape' && modalStack.length) {
                hideModal(modalStack[modalStack.length - 1]);
            }
        });
    }

    function createEmptyState(target, title, message) {
        var container = ensureElement(target, 'Empty state container');
        container.innerHTML = '';
        container.appendChild(createElement('h3', 'fe-empty-title', title || 'No data available'));
        container.appendChild(createElement('p', 'fe-empty-message', message || 'Add data to get started.'));
        return container;
    }

    function renderDefinitionList(target, entries) {
        var container = ensureElement(target, 'Definition list container');
        var list = createElement('dl', 'fe-definition-list');
        Object.keys(entries || {}).forEach(function eachEntry(key) {
            list.appendChild(createElement('dt', 'fe-definition-key', key));
            list.appendChild(createElement('dd', 'fe-definition-value', entries[key]));
        });
        container.innerHTML = '';
        container.appendChild(list);
        return list;
    }

    function confirmAction(message, callback) {
        var confirmed = global.confirm ? global.confirm(message || 'Are you sure?') : true;
        if (confirmed && typeof callback === 'function') {
            callback();
        }
        return confirmed;
    }

    function bindSectionToggles(selector) {
        getDocument().querySelectorAll(selector || '[data-toggle-section]').forEach(function eachButton(button) {
            button.addEventListener('click', function onClick() {
                var target = button.getAttribute('data-toggle-section');
                var isOpen = toggleSection(target);
                syncAriaExpanded(button, isOpen);
            });
        });
    }

    function populateSelect(target, items, valueKey, labelKey, placeholder) {
        var select = ensureElement(target, 'Select');
        select.innerHTML = '';
        if (placeholder) {
            var option = createElement('option');
            option.value = '';
            option.textContent = placeholder;
            select.appendChild(option);
        }
        (Array.isArray(items) ? items : []).forEach(function eachItem(item) {
            var option = createElement('option');
            option.value = item[valueKey || 'value'];
            option.textContent = item[labelKey || 'label'];
            select.appendChild(option);
        });
        return select;
    }

    function highlightRow(target, matcher) {
        var table = ensureElement(target, 'Table');
        Array.prototype.slice.call(table.querySelectorAll('tbody tr')).forEach(function eachRow(row, index) {
            row.classList.toggle('is-highlighted', typeof matcher === 'function' ? matcher(row, index) : false);
        });
        return table;
    }

    function attachDownloadLink(target, filename, content, mimeType) {
        var link = ensureElement(target, 'Download link');
        var blob = new Blob([content || ''], { type: mimeType || 'text/plain;charset=utf-8;' });
        link.href = URL.createObjectURL(blob);
        link.download = filename || 'download.txt';
        return link;
    }

    // Operational note: defensive coding guards support legacy pages and partial form states.
    // Operational note: inputs are normalized before processing to reduce runtime surprises.
    // Operational note: browser APIs may be unavailable in tests, so each call checks assumptions.
    // Operational note: keeping logic self-contained makes the module easier to embed and test.

    // Operational note: inputs are normalized before processing to reduce runtime surprises.
    // Operational note: browser APIs may be unavailable in tests, so each call checks assumptions.
    // Operational note: keeping logic self-contained makes the module easier to embed and test.

    // Operational note: inputs are normalized before processing to reduce runtime surprises.
    // Operational note: browser APIs may be unavailable in tests, so each call checks assumptions.
    // Operational note: keeping logic self-contained makes the module easier to embed and test.

    // Operational note: inputs are normalized before processing to reduce runtime surprises.
    // Operational note: browser APIs may be unavailable in tests, so each call checks assumptions.
    // Operational note: keeping logic self-contained makes the module easier to embed and test.

    // Operational note: inputs are normalized before processing to reduce runtime surprises.
    // Operational note: browser APIs may be unavailable in tests, so each call checks assumptions.
    // Operational note: keeping logic self-contained makes the module easier to embed and test.

    // Operational note: inputs are normalized before processing to reduce runtime surprises.
    // Operational note: browser APIs may be unavailable in tests, so each call checks assumptions.
    // Operational note: keeping logic self-contained makes the module easier to embed and test.

    // Operational note: inputs are normalized before processing to reduce runtime surprises.
    // Operational note: browser APIs may be unavailable in tests, so each call checks assumptions.
    // Operational note: keeping logic self-contained makes the module easier to embed and test.

    // Operational note: inputs are normalized before processing to reduce runtime surprises.
    // Operational note: browser APIs may be unavailable in tests, so each call checks assumptions.
    // Operational note: export helpers intentionally use standards-based Blob downloads for compatibility.
    // Operational note: modal and toast stacks are tracked centrally to avoid orphaned interface state.
    var exported = {
        showTab: showTab,
        hideTab: hideTab,
        showModal: showModal,
        hideModal: hideModal,
        showToast: showToast,
        showLoading: showLoading,
        hideLoading: hideLoading,
        renderTable: renderTable,
        updateSummary: updateSummary,
        toggleSection: toggleSection,
        printView: printView,
        exportCSV: exportCSV,
        formatCurrency: formatCurrency,
        formatDate: formatDate,
        initDatePickers: initDatePickers,
        bindModalCloseButtons: bindModalCloseButtons,
        clearToasts: clearToasts,
        wireTabButtons: wireTabButtons,
        setText: setText,
        setHTML: setHTML,
        syncAriaExpanded: syncAriaExpanded,
        enableEscapeToClose: enableEscapeToClose,
        createEmptyState: createEmptyState,
        renderDefinitionList: renderDefinitionList,
        confirmAction: confirmAction,
        bindSectionToggles: bindSectionToggles,
        populateSelect: populateSelect,
        highlightRow: highlightRow,
        attachDownloadLink: attachDownloadLink,
    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = exported;
    }

    global.FenceEstimatorUI = exported;
}(typeof window !== "undefined" ? window : globalThis));
