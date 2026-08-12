/**
 * @module calculations
 * @description Fence estimator calculation engine for materials, labor, markup, tax, and unit conversion.
 */
(function calculationsModule(global) {
    'use strict';

    // Core constants and price catalogs
    var FEET_PER_YARD = 3;
    var INCHES_PER_FOOT = 12;
    var METERS_PER_FOOT = 0.3048;
    var DEFAULT_TAX_RATE = 0.0825;
    var DEFAULT_MARKUP_RATE = 0.22;
    var DEFAULT_POST_SPACING = 8;
    var DEFAULT_WASTE_FACTOR = 0.08;
    var FENCE_TYPES = {
        "chain-link": true,
        "wood": true,
        "vinyl": true,
        "aluminum": true,
        "wrought-iron": true,
    };
    var MATERIAL_CATALOG = {
        "chain-link": {
            laborMultiplier: 1.0,
            wasteFactor: 0.05,
            heights: {
                "4": {
                    mesh: 7.25,
                    linePost: 28.50,
                    terminalPost: 38.95,
                    topRail: 12.40,
                    tensionWire: 0.48,
                },
                "5": {
                    mesh: 8.75,
                    linePost: 30.50,
                    terminalPost: 41.25,
                    topRail: 12.95,
                    tensionWire: 0.52,
                },
                "6": {
                    mesh: 10.45,
                    linePost: 33.95,
                    terminalPost: 45.75,
                    topRail: 13.80,
                    tensionWire: 0.58,
                },
            },
            gates: {
                "walk-4": 215.00,
                "walk-5": 248.00,
                "walk-6": 285.00,
                "drive-double-12": 895.00,
                "cantilever-20": 3450.00,
            },
            hardware: {
                braceBand: 1.55,
                tensionBand: 1.20,
                tensionBar: 18.95,
                hogRingBag: 7.85,
                topRailEnd: 3.25,
                loopCap: 2.15,
                lineCap: 1.18,
                tieWireBag: 13.75,
            }
        },
        "wood": {
            laborMultiplier: 1.18,
            wasteFactor: 0.12,
            heights: {
                "4": {
                    picket: 3.85,
                    rail: 8.95,
                    post: 34.50,
                    kickBoard: 13.95,
                },
                "6": {
                    picket: 4.65,
                    rail: 9.65,
                    post: 38.95,
                    kickBoard: 15.45,
                },
                "8": {
                    picket: 6.85,
                    rail: 12.25,
                    post: 44.95,
                    kickBoard: 18.25,
                },
            },
            gates: {
                "walk-4": 325.00,
                "walk-5": 375.00,
                "double-10": 895.00,
                "double-12": 995.00,
            },
            hardware: {
                screwBox: 46.95,
                hingeSet: 32.95,
                latchSet: 24.85,
                postMixBag: 6.75,
                postCap: 3.10,
            }
        },
        "vinyl": {
            laborMultiplier: 1.22,
            wasteFactor: 0.07,
            heights: {
                "4": {
                    panel: 128.00,
                    post: 54.00,
                    rail: 0.00,
                    cap: 5.45,
                },
                "5": {
                    panel: 142.00,
                    post: 58.00,
                    rail: 0.00,
                    cap: 5.85,
                },
                "6": {
                    panel: 156.00,
                    post: 62.00,
                    rail: 0.00,
                    cap: 6.25,
                },
            },
            gates: {
                "walk-4": 525.00,
                "walk-5": 580.00,
                "double-10": 1325.00,
            },
            hardware: {
                bracketSet: 18.50,
                hingeSet: 48.95,
                latchSet: 42.25,
                cementBag: 7.15,
            }
        },
        "aluminum": {
            laborMultiplier: 1.14,
            wasteFactor: 0.06,
            heights: {
                "4": {
                    panel: 158.00,
                    post: 49.50,
                    rackBracket: 12.50,
                },
                "5": {
                    panel: 179.00,
                    post: 56.00,
                    rackBracket: 13.85,
                },
                "6": {
                    panel: 214.00,
                    post: 64.25,
                    rackBracket: 15.25,
                },
            },
            gates: {
                "walk-4": 645.00,
                "walk-5": 725.00,
                "double-10": 1750.00,
                "double-12": 1895.00,
            },
            hardware: {
                bracketSet: 20.95,
                selfTapScrewBox: 21.50,
                hingeSet: 84.00,
                latchSet: 59.95,
            }
        },
        "wrought-iron": {
            laborMultiplier: 1.32,
            wasteFactor: 0.09,
            heights: {
                "4": {
                    panel: 212.00,
                    post: 72.50,
                    finialUpgrade: 22.00,
                },
                "5": {
                    panel: 245.00,
                    post: 78.95,
                    finialUpgrade: 24.50,
                },
                "6": {
                    panel: 292.00,
                    post: 86.00,
                    finialUpgrade: 28.75,
                },
            },
            gates: {
                "walk-4": 895.00,
                "walk-5": 985.00,
                "double-10": 2650.00,
                "double-12": 2995.00,
            },
            hardware: {
                weldTab: 4.85,
                touchUpKit: 28.00,
                hingeSet: 115.00,
                latchSet: 74.50,
            }
        },
    };
    var LABOR_RATES = {
        standardCrewHourly: 68.00,
        foremanHourly: 92.00,
        equipmentDaily: 185.00,
        concretePerHole: 7.85,
        layoutHourly: 55.00,
        tearOutPerFoot: 4.50,
        demoGateRemoval: 85.00,
    };
    var UNIT_CONVERSIONS = {
        ft_to_m: 0.3048,
        m_to_ft: 3.28084,
        ft_to_in: 12,
        in_to_ft: 0.08333333333333333,
        ft_to_yd: 0.3333333333333333,
        yd_to_ft: 3,
    };
    // Generic helpers
    function toNumber(value, fallback) {
        var numeric = Number(value);
        return Number.isFinite(numeric) ? numeric : (typeof fallback === 'number' ? fallback : 0);
    }
    function roundToCents(value) {
        return Math.round((toNumber(value, 0) + Number.EPSILON) * 100) / 100;
    }
    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    function ceilToWhole(value) {
        return Math.ceil(toNumber(value, 0));
    }
    function normalizeFenceType(fenceType) {
        var normalized = String(fenceType || '').trim().toLowerCase();
        if (!FENCE_TYPES[normalized]) {
            throw new Error('Unsupported fence type: ' + fenceType);
        }
        return normalized;
    }
    function normalizeHeight(height) {
        var numeric = String(toNumber(height, 6));
        return numeric.indexOf('.') === -1 ? numeric : String(Math.round(toNumber(height, 6)));
    }
    function getCatalog(type, height) {
        var normalizedType = normalizeFenceType(type);
        var normalizedHeight = normalizeHeight(height);
        var catalog = MATERIAL_CATALOG[normalizedType];
        var heightCatalog = catalog.heights[normalizedHeight] || catalog.heights['6'];
        return {
            type: normalizedType,
            height: normalizedHeight,
            catalog: catalog,
            heightCatalog: heightCatalog
        };
    }
    function normalizeSegments(segments) {
        if (!Array.isArray(segments)) {
            return [];
        }
        return segments
            .map(function mapSegment(segment) {
                return {
                    length: toNumber(segment && segment.length, 0),
                    unit: segment && segment.unit ? String(segment.unit) : 'ft',
                    quantity: Math.max(1, toNumber(segment && segment.quantity, 1)),
                    slope: toNumber(segment && segment.slope, 0),
                    elevation: toNumber(segment && segment.elevation, 0)
                };
            })
            .filter(function filterSegment(segment) {
                return segment.length > 0;
            });
    }
    function unitToFeet(length, unit) {
        var normalizedUnit = String(unit || 'ft').toLowerCase();
        if (normalizedUnit === 'ft' || normalizedUnit === 'feet') {
            return toNumber(length, 0);
        }
        if (normalizedUnit === 'm' || normalizedUnit === 'meter' || normalizedUnit === 'meters') {
            return toNumber(length, 0) * UNIT_CONVERSIONS.m_to_ft;
        }
        if (normalizedUnit === 'in' || normalizedUnit === 'inch' || normalizedUnit === 'inches') {
            return toNumber(length, 0) * UNIT_CONVERSIONS.in_to_ft;
        }
        if (normalizedUnit === 'yd' || normalizedUnit === 'yard' || normalizedUnit === 'yards') {
            return toNumber(length, 0) * UNIT_CONVERSIONS.yd_to_ft;
        }
        return toNumber(length, 0);
    }
    function applySlopeAdjustment(lengthFeet, slopePercent) {
        if (!slopePercent) {
            return lengthFeet;
        }
        var riseMultiplier = Math.sqrt(1 + Math.pow(slopePercent / 100, 2));
        return lengthFeet * riseMultiplier;
    }
    function calculateWasteAdjustedQuantity(quantity, wasteFactor) {
        return quantity * (1 + toNumber(wasteFactor, DEFAULT_WASTE_FACTOR));
    }
    function getPostSpacing(options) {
        return clamp(toNumber(options && options.postSpacing, DEFAULT_POST_SPACING), 4, 12);
    }
    function getCornerCount(options) {
        return Math.max(0, ceilToWhole(options && options.cornerPosts));
    }
    function getEndCount(options) {
        return Math.max(2, ceilToWhole(options && options.endPosts));
    }
    function getGateCount(options) {
        return Array.isArray(options && options.gates) ? options.gates.length : Math.max(0, ceilToWhole(options && options.gateCount));
    }

    function getLinePostCount(totalFeet, spacing) {
        return Math.max(0, Math.ceil(totalFeet / spacing) - 1);
    }

    function getPanelCount(totalFeet, panelWidth) {
        return Math.max(1, Math.ceil(totalFeet / panelWidth));
    }

    function sumValues(items, selector) {
        return (items || []).reduce(function reducer(total, item) {
            return total + toNumber(selector(item), 0);
        }, 0);
    }

    function buildLineItem(code, description, quantity, unit, unitPrice) {
        var qty = roundToCents(quantity);
        var price = roundToCents(unitPrice);
        return {
            code: code,
            description: description,
            quantity: qty,
            unit: unit,
            unitPrice: price,
            total: roundToCents(qty * price)
        };
    }

    function normalizeGateList(gates) {
        if (!Array.isArray(gates)) {
            return [];
        }
        return gates.map(function mapGate(gate) {
            return {
                width: toNumber(gate && gate.width, 4),
                height: toNumber(gate && gate.height, 4),
                type: String((gate && gate.type) || 'walk').toLowerCase(),
                quantity: Math.max(1, ceilToWhole(gate && gate.quantity)),
                automation: Boolean(gate && gate.automation),
                hardwareUpgrade: Boolean(gate && gate.hardwareUpgrade)
            };
        });
    }
    // Public calculation functions
    function calculateLinearFeet(input) {
        var options = input || {};
        var segmentTotal = sumValues(normalizeSegments(options.segments), function each(segment) {
            var lengthFeet = unitToFeet(segment.length, segment.unit) * segment.quantity;
            return applySlopeAdjustment(lengthFeet, segment.slope);
        });
        if (segmentTotal > 0) {
            return roundToCents(segmentTotal);
        }
        if (options.perimeter) {
            return roundToCents(unitToFeet(options.perimeter, options.unit));
        }
        if (options.length && options.width) {
            var lengthFeet = unitToFeet(options.length, options.unit);
            var widthFeet = unitToFeet(options.width, options.unit);
            return roundToCents((lengthFeet * 2) + (widthFeet * 2));
        }
        return roundToCents(toNumber(options.linearFeet, 0));
    }

    function calculatePosts(input) {
        var options = input || {};
        var fenceType = normalizeFenceType(options.fenceType || 'wood');
        var height = options.height || 6;
        var totalFeet = calculateLinearFeet(options);
        var spacing = getPostSpacing(options);
        var cornerPosts = getCornerCount(options);
        var endPosts = getEndCount(options);
        var gatePosts = getGateCount(options) * 2;
        var linePosts = getLinePostCount(totalFeet, spacing);
        var totalPosts = linePosts + cornerPosts + endPosts + gatePosts;
        var catalogInfo = getCatalog(fenceType, height);
        var postUnitPrice = catalogInfo.heightCatalog.post || catalogInfo.heightCatalog.linePost || 0;
        var terminalUnitPrice = catalogInfo.heightCatalog.terminalPost || postUnitPrice;
        return {
            fenceType: fenceType,
            totalFeet: totalFeet,
            spacing: spacing,
            linePosts: linePosts,
            cornerPosts: cornerPosts,
            endPosts: endPosts,
            gatePosts: gatePosts,
            totalPosts: totalPosts,
            linePostCost: buildLineItem('line-post', 'Line posts', linePosts, 'ea', postUnitPrice),
            terminalPostCost: buildLineItem('terminal-post', 'Terminal and corner posts', cornerPosts + endPosts + gatePosts, 'ea', terminalUnitPrice)
        };
    }

    function calculateRails(input) {
        var options = input || {};
        var fenceType = normalizeFenceType(options.fenceType || 'wood');
        var height = options.height || 6;
        var totalFeet = calculateLinearFeet(options);
        var catalogInfo = getCatalog(fenceType, height);
        var railsPerSection = fenceType === 'wood' ? (toNumber(height, 6) >= 8 ? 4 : 3) : (fenceType === 'chain-link' ? 1 : 0);
        var railLength = 8;
        var totalRails = railsPerSection > 0 ? Math.ceil((totalFeet / railLength) * railsPerSection) : 0;
        var unitPrice = catalogInfo.heightCatalog.rail || catalogInfo.heightCatalog.topRail || 0;
        return {
            railsPerSection: railsPerSection,
            totalRails: totalRails,
            unitPrice: roundToCents(unitPrice),
            lineItem: buildLineItem('rail', 'Rails / top rail', totalRails, 'ea', unitPrice)
        };
    }

    function calculateMesh(input) {
        var options = input || {};
        var fenceType = normalizeFenceType(options.fenceType || 'chain-link');
        var height = options.height || 6;
        var totalFeet = calculateLinearFeet(options);
        var catalogInfo = getCatalog(fenceType, height);
        if (fenceType === 'chain-link') {
            var rolls = Math.ceil(totalFeet / 50);
            return {
                coverageFeet: totalFeet,
                rolls: rolls,
                unitPrice: roundToCents(catalogInfo.heightCatalog.mesh * 50),
                lineItem: buildLineItem('mesh-roll', 'Chain-link mesh roll', rolls, 'roll', catalogInfo.heightCatalog.mesh * 50)
            };
        }
        if (fenceType === 'wood') {
            var picketWidthFeet = toNumber(options.picketWidthInches, 5.5) / INCHES_PER_FOOT;
            var picketGapFeet = toNumber(options.picketGapInches, 0.25) / INCHES_PER_FOOT;
            var picketCount = Math.ceil(totalFeet / (picketWidthFeet + picketGapFeet));
            return {
                coverageFeet: totalFeet,
                picketCount: picketCount,
                unitPrice: roundToCents(catalogInfo.heightCatalog.picket),
                lineItem: buildLineItem('picket', 'Wood pickets', picketCount, 'ea', catalogInfo.heightCatalog.picket)
            };
        }
        var panelWidth = toNumber(options.panelWidth, 8);
        var panelCount = getPanelCount(totalFeet, panelWidth);
        return {
            coverageFeet: totalFeet,
            panelCount: panelCount,
            unitPrice: roundToCents(catalogInfo.heightCatalog.panel || 0),
            lineItem: buildLineItem('panel', 'Fence panel', panelCount, 'ea', catalogInfo.heightCatalog.panel || 0)
        };
    }

    function calculateGates(input) {
        var options = input || {};
        var fenceType = normalizeFenceType(options.fenceType || 'wood');
        var gateList = normalizeGateList(options.gates);
        var catalogInfo = getCatalog(fenceType, options.height || 6);
        var items = gateList.map(function mapGate(gate, index) {
            var sizeKey = gate.type.indexOf('double') !== -1
                ? gate.type + '-' + Math.round(gate.width)
                : 'walk-' + Math.round(gate.height || gate.width || 4);
            var basePrice = catalogInfo.catalog.gates[sizeKey] || catalogInfo.catalog.gates['walk-4'] || 0;
            var automationCharge = gate.automation ? 1450 : 0;
            var hardwareUpgrade = gate.hardwareUpgrade ? 125 : 0;
            return buildLineItem(
                'gate-' + (index + 1),
                gate.type + ' gate ' + gate.width + 'ft',
                gate.quantity,
                'ea',
                basePrice + automationCharge + hardwareUpgrade
            );
        });
        return {
            count: sumValues(gateList, function each(gate) { return gate.quantity; }),
            items: items,
            total: roundToCents(sumValues(items, function each(item) { return item.total; }))
        };
    }

    function calculateHardware(input) {
        var options = input || {};
        var fenceType = normalizeFenceType(options.fenceType || 'wood');
        var height = options.height || 6;
        var totalFeet = calculateLinearFeet(options);
        var posts = calculatePosts(options);
        var gates = calculateGates(options);
        var catalogInfo = getCatalog(fenceType, height);
        var hardware = [];
        if (fenceType === 'chain-link') {
            hardware.push(buildLineItem('brace-band', 'Brace bands', posts.cornerPosts + posts.endPosts + posts.gatePosts, 'ea', catalogInfo.catalog.hardware.braceBand));
            hardware.push(buildLineItem('tension-band', 'Tension bands', (posts.cornerPosts + posts.endPosts + posts.gatePosts) * 4, 'ea', catalogInfo.catalog.hardware.tensionBand));
            hardware.push(buildLineItem('top-rail-end', 'Top rail ends', posts.cornerPosts + posts.endPosts + posts.gatePosts, 'ea', catalogInfo.catalog.hardware.topRailEnd));
            hardware.push(buildLineItem('line-cap', 'Line post caps', posts.linePosts, 'ea', catalogInfo.catalog.hardware.lineCap));
            hardware.push(buildLineItem('tie-wire', 'Tie wire bags', Math.ceil(totalFeet / 100), 'bag', catalogInfo.catalog.hardware.tieWireBag));
        } else if (fenceType === 'wood') {
            hardware.push(buildLineItem('screw-box', 'Exterior screw boxes', Math.ceil(totalFeet / 75), 'box', catalogInfo.catalog.hardware.screwBox));
            hardware.push(buildLineItem('post-mix', 'Concrete mix bags', posts.totalPosts * 2, 'bag', catalogInfo.catalog.hardware.postMixBag));
            hardware.push(buildLineItem('post-cap', 'Wood post caps', posts.totalPosts, 'ea', catalogInfo.catalog.hardware.postCap));
        } else {
            hardware.push(buildLineItem('bracket-set', 'Mounting bracket sets', Math.ceil(totalFeet / 8), 'set', catalogInfo.catalog.hardware.bracketSet || 0));
            hardware.push(buildLineItem('hinge-set', 'Gate hinge sets', Math.max(1, gates.count), 'set', catalogInfo.catalog.hardware.hingeSet || 0));
            hardware.push(buildLineItem('latch-set', 'Gate latch sets', Math.max(1, gates.count), 'set', catalogInfo.catalog.hardware.latchSet || 0));
        }
        return {
            items: hardware,
            total: roundToCents(sumValues(hardware, function each(item) { return item.total; }))
        };
    }

    function calculateLabor(input) {
        var options = input || {};
        var fenceType = normalizeFenceType(options.fenceType || 'wood');
        var totalFeet = calculateLinearFeet(options);
        var height = toNumber(options.height, 6);
        var catalogInfo = getCatalog(fenceType, height);
        var crewSize = clamp(toNumber(options.crewSize, 2), 1, 8);
        var productionFeetPerDay = {
            'chain-link': 140,
            'wood': 110,
            'vinyl': 95,
            'aluminum': 125,
            'wrought-iron': 90
        }[fenceType];
        var slopeFactor = 1 + clamp(toNumber(options.averageSlopePercent, 0) / 100, 0, 0.5);
        var tearOutFeet = toNumber(options.tearOutFeet, 0);
        var installDays = (totalFeet / productionFeetPerDay) * catalogInfo.catalog.laborMultiplier * slopeFactor;
        var installHours = installDays * 8 * crewSize;
        var foremanHours = installDays * 4;
        var layoutHours = Math.max(2, totalFeet / 75);
        var tearOutCost = tearOutFeet * LABOR_RATES.tearOutPerFoot;
        var equipmentDays = Math.max(1, Math.ceil(installDays));
        var laborItems = [
            buildLineItem('crew-labor', 'Installation crew labor', installHours, 'hr', LABOR_RATES.standardCrewHourly),
            buildLineItem('foreman-labor', 'Foreman labor', foremanHours, 'hr', LABOR_RATES.foremanHourly),
            buildLineItem('layout-labor', 'Layout and planning', layoutHours, 'hr', LABOR_RATES.layoutHourly),
            buildLineItem('equipment', 'Equipment and auger', equipmentDays, 'day', LABOR_RATES.equipmentDaily),
            buildLineItem('tear-out', 'Existing fence removal', tearOutFeet, 'ft', LABOR_RATES.tearOutPerFoot)
        ];
        return {
            crewSize: crewSize,
            installDays: roundToCents(installDays),
            installHours: roundToCents(installHours),
            items: laborItems,
            total: roundToCents(sumValues(laborItems, function each(item) { return item.total; }) + tearOutCost)
        };
    }

    function calculateMaterials(input) {
        var options = input || {};
        var fenceType = normalizeFenceType(options.fenceType || 'wood');
        var height = options.height || 6;
        var posts = calculatePosts(options);
        var rails = calculateRails(options);
        var infill = calculateMesh(options);
        var gates = calculateGates(options);
        var hardware = calculateHardware(options);
        var catalogInfo = getCatalog(fenceType, height);
        var items = [posts.linePostCost, posts.terminalPostCost, rails.lineItem, infill.lineItem]
            .concat(gates.items)
            .concat(hardware.items)
            .filter(Boolean);
        var subtotal = sumValues(items, function each(item) { return item.total; });
        var wasteFactor = typeof options.wasteFactor !== 'undefined' ? toNumber(options.wasteFactor, DEFAULT_WASTE_FACTOR) : catalogInfo.catalog.wasteFactor;
        var wasteCost = subtotal * wasteFactor;
        items.push(buildLineItem('waste', 'Material waste allowance', 1, 'allowance', wasteCost));
        return {
            items: items,
            subtotal: roundToCents(subtotal),
            wasteFactor: wasteFactor,
            wasteCost: roundToCents(wasteCost),
            total: roundToCents(subtotal + wasteCost)
        };
    }

    function applyMarkup(amount, markupRate) {
        var rate = typeof markupRate === 'number' ? markupRate : DEFAULT_MARKUP_RATE;
        return roundToCents(toNumber(amount, 0) * (1 + rate));
    }

    function calculateTax(amount, taxRate) {
        var rate = typeof taxRate === 'number' ? taxRate : DEFAULT_TAX_RATE;
        return roundToCents(toNumber(amount, 0) * rate);
    }

    function calculateTotalCost(input) {
        var options = input || {};
        var materialResult = calculateMaterials(options);
        var laborResult = calculateLabor(options);
        var permits = roundToCents(toNumber(options.permits, 0));
        var disposal = roundToCents(toNumber(options.disposal, 0));
        var subcontract = roundToCents(toNumber(options.subcontract, 0));
        var rawSubtotal = roundToCents(materialResult.total + laborResult.total + permits + disposal + subcontract);
        var markedUpSubtotal = applyMarkup(rawSubtotal, typeof options.markupRate === 'number' ? options.markupRate : DEFAULT_MARKUP_RATE);
        var tax = calculateTax(markedUpSubtotal, typeof options.taxRate === 'number' ? options.taxRate : DEFAULT_TAX_RATE);
        return {
            materials: materialResult,
            labor: laborResult,
            permits: permits,
            disposal: disposal,
            subcontract: subcontract,
            subtotal: rawSubtotal,
            markedUpSubtotal: markedUpSubtotal,
            tax: tax,
            total: roundToCents(markedUpSubtotal + tax)
        };
    }

    function convertUnits(value, fromUnit, toUnit) {
        var from = String(fromUnit || 'ft').toLowerCase();
        var to = String(toUnit || 'ft').toLowerCase();
        var feet = unitToFeet(value, from);
        if (to === 'ft' || to === 'feet') {
            return roundToCents(feet);
        }
        if (to === 'm' || to === 'meter' || to === 'meters') {
            return roundToCents(feet * UNIT_CONVERSIONS.ft_to_m);
        }
        if (to === 'in' || to === 'inch' || to === 'inches') {
            return roundToCents(feet * UNIT_CONVERSIONS.ft_to_in);
        }
        if (to === 'yd' || to === 'yard' || to === 'yards') {
            return roundToCents(feet * UNIT_CONVERSIONS.ft_to_yd);
        }
        throw new Error('Unsupported unit conversion: ' + fromUnit + ' to ' + toUnit);
    }

    // Additional analytics and exported helpers
    function calculateConcreteBags(input) {
        var posts = calculatePosts(input);
        var bagsPerPost = Math.max(1, ceilToWhole((toNumber(input && input.postHoleDiameter, 10) / 10)));
        return buildLineItem("concrete", "Concrete mix", posts.totalPosts * bagsPerPost, "bag", LABOR_RATES.concretePerHole);
    }

    function calculateJobSummary(input) {
        var totals = calculateTotalCost(input);
        return {
            totalFeet: calculateLinearFeet(input),
            totalPosts: calculatePosts(input).totalPosts,
            totalGates: calculateGates(input).count,
            materialsTotal: totals.materials.total,
            laborTotal: totals.labor.total,
            grandTotal: totals.total
        };
    }

    function getMaterialCatalog() {
        return JSON.parse(JSON.stringify(MATERIAL_CATALOG));
    }

    function estimateByFenceType(samples) {
        var list = Array.isArray(samples) ? samples : [];
        return list.reduce(function reducer(result, item) {
            var type = normalizeFenceType(item.fenceType);
            if (!result[type]) {
                result[type] = [];
            }
            result[type].push(calculateJobSummary(item));
            return result;
        }, {});
    }

    var exported = {
        MATERIAL_CATALOG: MATERIAL_CATALOG,
        LABOR_RATES: LABOR_RATES,
        calculateLinearFeet: calculateLinearFeet,
        calculatePosts: calculatePosts,
        calculateRails: calculateRails,
        calculateMesh: calculateMesh,
        calculateGates: calculateGates,
        calculateHardware: calculateHardware,
        calculateLabor: calculateLabor,
        calculateTotalCost: calculateTotalCost,
        calculateMaterials: calculateMaterials,
        applyMarkup: applyMarkup,
        calculateTax: calculateTax,
        roundToCents: roundToCents,
        convertUnits: convertUnits,
        calculateConcreteBags: calculateConcreteBags,
        calculateJobSummary: calculateJobSummary,
        estimateByFenceType: estimateByFenceType,
        getMaterialCatalog: getMaterialCatalog,
    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = exported;
    }

    global.FenceEstimatorCalculations = exported;
}(typeof window !== "undefined" ? window : globalThis));
