/* ============================================================
   FENCE PARTS CATALOG - built 100% from the owner's research in
   FENCE_MATERIAL_SPECIFICATIONS.md (Canadian Standards, July 16 2026).
   Quantities are per 100 linear feet unless noted otherwise.
   ============================================================ */
const PARTS_CATALOG = {
  chainlink: {
    label: 'Chain Link — CAN/CGSB-138.3-2019',
    basis: 'Per 100 Linear Feet (2-Person Crew)',
    notes: [
      'All materials must comply with CAN/CGSB-138.3-2019 (Chain Link Fence Installation Standard)',
      'Post depth varies by frost line (see Canadian frost depth table for region)',
      'All fasteners must be galvanized to CSA G40.8 or stainless steel equivalent',
      'Concrete footings must meet CSA A3000 for durability in freeze-thaw cycles',
      'No alternative materials or non-standard sizing permitted'
    ],
    sections: [
      { name: 'Line Posts (Standard Installation)', parts: [
        { item: 'Line Posts (1\u00BD" OD \u00D7 6\u20326\u2033)', qty: 16, unit: 'Each', desc: 'Steel, galvanized schedule 40', std: 'CAN/CGSB-138.3-2019' },
        { item: 'Post Caps (1\u00BD")', qty: 16, unit: 'Each', desc: 'Galvanized steel slip-on', std: 'CSA G40.21' },
        { item: 'Post Sleeves (if on concrete)', qty: 16, unit: 'Each', desc: 'Concrete mounting sleeves', std: 'CSA A3000' }
      ]},
      { name: 'Terminal Posts (Ends, Corners, Gates)', parts: [
        { item: 'Terminal Posts (1\u215E" OD \u00D7 6\u20326\u2033)', qty: 4, unit: 'Each', desc: 'Heavier gauge, galvanized', std: 'CAN/CGSB-138.3-2019' },
        { item: 'Corner Posts (1\u215E" OD \u00D7 6\u20326\u2033)', qty: 2, unit: 'Each', desc: '3-way for corners', std: 'CAN/CGSB-138.3-2019' },
        { item: 'Gate Posts (1\u215E" OD \u00D7 6\u20326\u2033)', qty: 2, unit: 'Each', desc: 'For gate frame mounting', std: 'CAN/CGSB-138.3-2019' },
        { item: 'End Posts (1\u215E" OD \u00D7 6\u20326\u2033)', qty: 2, unit: 'Each', desc: 'For fence termination', std: 'CAN/CGSB-138.3-2019' },
        { item: 'Post Caps (1\u215E")', qty: 10, unit: 'Each', desc: 'Galvanized steel slip-on', std: 'CSA G40.21' }
      ]},
      { name: 'Top Rail', parts: [
        { item: 'Top Rail (1\u00BC" OD \u00D7 0.083" wall)', qty: 100, unit: 'LF', desc: 'Galvanized steel tube', std: 'CAN/CGSB-138.3-2019' },
        { item: 'Top Rail End Caps', qty: 4, unit: 'Each', desc: 'Galvanized steel', std: 'CSA G40.21' },
        { item: 'Top Rail Couplers', qty: 2, unit: 'Each', desc: 'For joining sections', std: 'CAN/CGSB-138.3-2019' }
      ]},
      { name: 'Fabric (Mesh)', parts: [
        { item: 'Chain Link Fabric (2" mesh, 9 GA)', qty: 100, unit: 'LF', desc: 'Galvanized or vinyl-coated', std: 'CAN/CGSB-138.3-2019' },
        { item: 'Fabric Width Options', qty: '-', unit: '-', desc: "3', 4', 5', 6' standard", std: 'CAN/CGSB-138.3-2019' },
        { item: 'Color Options', qty: '-', unit: '-', desc: 'Galvanized, Green, Black, Brown', std: 'CSA G40.8' },
        { item: 'Mesh Gauge', qty: '-', unit: '-', desc: '9 gauge (0.148" diameter wire)', std: 'CAN/CGSB-138.3-2019' }
      ]},
      { name: 'Bottom Wire / Tension Wire', parts: [
        { item: 'Bottom Wire / Tension Wire (9 GA)', qty: 100, unit: 'LF', desc: '0.148" diameter galvanized cable', std: 'CAN/CGSB-138.3-2019' },
        { item: 'Wire Type', qty: '-', unit: '-', desc: 'Plain or barbed (where required)', std: 'CSA G40.8' }
      ]},
      { name: 'Fasteners & Fittings', parts: [
        { item: 'Tension Bands (1\u215E")', qty: 32, unit: 'Each', desc: 'For terminal posts (2 per terminal post)', std: 'CAN/CGSB-138.3-2019' },
        { item: 'Tension Bars (1\u215E")', qty: 16, unit: 'Each', desc: 'For terminal posts (1 per terminal post)', std: 'CAN/CGSB-138.3-2019' },
        { item: 'Bolt-on Post Caps', qty: 26, unit: 'Each', desc: 'Alternative to slip-on', std: 'CSA G40.21' },
        { item: 'Lag Bolts (\u00BD" \u00D7 3")', qty: 64, unit: 'Each', desc: 'For terminal post frame assembly', std: 'CSA G40.20' },
        { item: 'Carriage Bolts (\u00BD" \u00D7 2")', qty: 32, unit: 'Each', desc: 'For fabric attachment', std: 'CSA G40.20' },
        { item: 'Post Base Brackets', qty: 4, unit: 'Each', desc: 'If mounted to concrete', std: 'CSA A3000' }
      ]},
      { name: 'Hardware — Fasteners', parts: [
        { item: '2" Galvanized Nails', qty: 2, unit: 'lbs', desc: 'For blocking/bracing', std: 'CSA G40.8' },
        { item: 'Galvanized Screws (2.5")', qty: 1, unit: 'lb', desc: 'For cap attachment', std: 'CSA G40.20' },
        { item: 'Nuts (\u00BD")', qty: 96, unit: 'Each', desc: 'Grade 2 galvanized', std: 'CSA G40.8' },
        { item: 'Washers (\u00BD")', qty: 96, unit: 'Each', desc: 'Galvanized steel', std: 'CSA G40.8' },
        { item: 'Cotter Pins (3/16" \u00D7 2")', qty: 32, unit: 'Each', desc: 'For safety attachment', std: 'CSA G40.8' }
      ]},
      { name: 'Tie Wires & Connectors', parts: [
        { item: 'Tie Wires (9 GA galvanized)', qty: 400, unit: 'LF', desc: 'For fabric attachment to posts', std: 'CAN/CGSB-138.3-2019' },
        { item: 'Tie Wire Bundled (per 100 LF section)', qty: 4, unit: 'Bundles', desc: 'Pre-counted for convenience', std: 'CAN/CGSB-138.3-2019' },
        { item: 'Hog Rings (3" spacing)', qty: 300, unit: 'Each', desc: 'Alternative fastening method (if permitted)', std: 'CSA G40.8' }
      ]},
      { name: 'Concrete & Footing', parts: [
        { item: 'Concrete (per post hole)', qty: 0.5, unit: 'CY', desc: '20 MPa minimum', std: 'CSA A3000' },
        { item: 'Concrete (Total for 100 LF)', qty: 8, unit: 'CY', desc: '18-20 posts \u00D7 0.5 CY', std: 'CSA A3000' },
        { item: 'Stone Dust (Base prep)', qty: 0.25, unit: 'Ton', desc: 'Per 100 LF', std: 'CAN/CGSB-138.3-2019' }
      ]},
      { name: 'Gates (Per Gate — 4\u2032 Wide \u00D7 5\u2032 High)', parts: [
        { item: 'Gate Frame (1\u00BC" tube)', qty: 1, unit: 'Set', desc: 'Pre-fabricated per CAN/CGSB', std: 'CAN/CGSB-138.3-2019' },
        { item: 'Gate Hinges (Heavy-duty)', qty: 2, unit: 'Each', desc: '2-3" adjustable gate hinges', std: 'CAN/CGSB-138.3-2019' },
        { item: 'Gate Latch (Gravity or manual)', qty: 1, unit: 'Each', desc: 'Locking mechanism', std: 'CAN/CGSB-138.3-2019' },
        { item: 'Gate Chain (Safety)', qty: 1, unit: 'Each', desc: 'To prevent full swing', std: 'CSA B95.1' },
        { item: 'Gate Fabric (2" mesh, 9 GA)', qty: 1, unit: 'Gate', desc: 'Pre-wrapped or installed on-site', std: 'CAN/CGSB-138.3-2019' }
      ]}
    ]
  },
  vinyl: {
    label: 'PVC / Vinyl — Homeland Vinyl Products Only',
    basis: 'Per 100 Linear Feet (Privacy Style, 5\u2032 Height)',
    notes: [
      'ALL materials are Homeland Vinyl Products standard sizing only',
      'All sizes, styles, and colors limited to Homeland inventory',
      'No substitutions or alternative manufacturers permitted',
      'Verify current Homeland color/style availability before estimate',
      'Homeland warranty applies to all components'
    ],
    sections: [
      { name: 'Posts — Homeland Standard Sizes', parts: [
        { item: 'Main Posts (4" \u00D7 4" \u00D7 8\u2032)', qty: 16, unit: 'Each', desc: 'Vinyl (White, Brown, Gray, Tan options)', std: 'HVP-4x4-8' },
        { item: 'Terminal Posts (4" \u00D7 4" \u00D7 8\u2032)', qty: 4, unit: 'Each', desc: 'Corner and end posts', std: 'HVP-4x4-8' },
        { item: 'Gate Posts (4" \u00D7 4" \u00D7 8\u2032)', qty: 2, unit: 'Each', desc: 'Reinforced for gate', std: 'HVP-4x4-8' },
        { item: 'Post Caps (4" \u00D7 4")', qty: 22, unit: 'Each', desc: 'Vinyl decorative caps', std: 'HVP-CAP-4x4' },
        { item: 'Post Sleeve Adapters', qty: 16, unit: 'Each', desc: 'For concrete mounting', std: 'HVP-SLEEVE-4x4' }
      ]},
      { name: 'Rails — Homeland Standard Sizes', parts: [
        { item: 'Top Rail (2" \u00D7 4" \u00D7 8\u2032)', qty: 13, unit: 'Each', desc: 'Vinyl, UV-resistant', std: 'HVP-2x4-RAIL-8' },
        { item: 'Middle Rail (2" \u00D7 4" \u00D7 8\u2032)', qty: 13, unit: 'Each', desc: 'Privacy-style installation', std: 'HVP-2x4-RAIL-8' },
        { item: 'Bottom Rail (2" \u00D7 4" \u00D7 8\u2032)', qty: 13, unit: 'Each', desc: 'For support', std: 'HVP-2x4-RAIL-8' },
        { item: 'Rail Brackets (Stainless)', qty: 52, unit: 'Each', desc: '4 per rail section', std: 'HVP-BRACKET-SS' }
      ]},
      { name: 'Panels / Boards — Homeland Standard', parts: [
        { item: 'Privacy Boards (5\u215D" \u00D7 60")', qty: 200, unit: 'Each', desc: 'Interlocking vinyl boards', std: 'HVP-BOARD-PRIVACY-60' },
        { item: 'Semi-Privacy Boards (5\u215D" \u00D7 60")', qty: 200, unit: 'Each', desc: 'Alternating pattern (if selected)', std: 'HVP-BOARD-SEMI-60' },
        { item: 'Picket Boards (3\u00BD" \u00D7 60")', qty: 300, unit: 'Each', desc: 'For picket-style (if selected)', std: 'HVP-BOARD-PICKET-60' }
      ]},
      { name: 'Hardware & Fasteners — Stainless Steel Only', parts: [
        { item: 'Stainless Steel Brackets (2.5")', qty: 52, unit: 'Each', desc: 'Post-to-rail connections', std: 'HVP-BRACKET-SS-2.5' },
        { item: 'Stainless Steel Bolts (\u00BE" \u00D7 3")', qty: 156, unit: 'Each', desc: 'Rail assembly (3 per bracket)', std: 'HVP-BOLT-SS-3/4x3' },
        { item: 'Stainless Steel Washers', qty: 156, unit: 'Each', desc: 'For bolt distribution', std: 'HVP-WASHER-SS-3/4' },
        { item: 'Stainless Steel Nuts', qty: 156, unit: 'Each', desc: 'Grade A2-70', std: 'HVP-NUT-SS-3/4' },
        { item: 'Vinyl Screws (3.5" S/S)', qty: 400, unit: 'Each', desc: 'For board attachment', std: 'HVP-SCREW-SS-3.5' },
        { item: 'Fastener Plugs (Vinyl)', qty: 400, unit: 'Each', desc: 'To cover screw heads', std: 'HVP-PLUG-VINYL' }
      ]},
      { name: 'Gates — Homeland Standard', parts: [
        { item: 'Gate Frame (Vinyl)', qty: 1, unit: 'Set', desc: 'Pre-fabricated', std: 'HVP-GATE-FRAME-4x5' },
        { item: 'Gate Boards (5\u215D" \u00D7 60")', qty: 8, unit: 'Each', desc: 'Matching fence boards', std: 'HVP-BOARD-PRIVACY-60' },
        { item: 'Gate Hinges (S/S Adjustable)', qty: 2, unit: 'Each', desc: 'Heavy-duty for PVC', std: 'HVP-HINGE-SS-ADJ' },
        { item: 'Gate Latch Assembly', qty: 1, unit: 'Each', desc: 'Self-closing mechanism', std: 'HVP-LATCH-AUTO' },
        { item: 'Gate Handle', qty: 1, unit: 'Each', desc: 'Stainless steel', std: 'HVP-HANDLE-SS' }
      ]},
      { name: 'Concrete & Footing', parts: [
        { item: 'Concrete (per post)', qty: 0.6, unit: 'CY', desc: 'Due to weight (20 MPa min)', std: 'CSA A3000' },
        { item: 'Total Concrete (100 LF)', qty: 9.6, unit: 'CY', desc: '18-20 posts', std: 'CSA A3000' },
        { item: 'Stone Dust Base', qty: 0.5, unit: 'Ton', desc: 'Pre-footing preparation', std: 'CAN/CGSB-138.3-2019' }
      ]}
    ]
  },
  wood: {
    label: 'Wood — Canadian Standards (CSA O141)',
    basis: 'Per 100 Linear Feet (Privacy Style, 5\u2032 Height)',
    notes: [
      'All wood must meet CSA O141 (Softwood Lumber Standard)',
      'Pressure-treated timber minimum Grade #2',
      'All fasteners must be hot-dip galvanized to CSA G40.8',
      'Wood must be properly dried to moisture content specifications',
      '6\u00D76 posts available as premium option for extra durability'
    ],
    sections: [
      { name: 'Posts — Canadian Pressure-Treated Options', parts: [
        { item: 'Main Posts (4" \u00D7 4" \u00D7 8\u2032 PT)', qty: 16, unit: 'Each', desc: 'Pressure-treated pine/spruce', std: 'CSA O141 Grade #2' },
        { item: 'Main Posts (6" \u00D7 6" \u00D7 8\u2032 PT)', qty: 16, unit: 'Each', desc: 'Heavy-duty option (optional)', std: 'CSA O141 Grade #2' },
        { item: 'Terminal Posts (4" \u00D7 4" \u00D7 8\u2032 PT)', qty: 4, unit: 'Each', desc: 'Corner and end (larger diameter)', std: 'CSA O141 Grade #2' },
        { item: 'Terminal Posts (6" \u00D7 6" \u00D7 8\u2032 PT)', qty: 4, unit: 'Each', desc: 'Heavy-duty corner/end', std: 'CSA O141 Grade #2' },
        { item: 'Gate Posts (4" \u00D7 4" \u00D7 8\u2032 PT)', qty: 2, unit: 'Each', desc: 'Heavier for gate support', std: 'CSA O141 Grade #2' },
        { item: 'Gate Posts (6" \u00D7 6" \u00D7 8\u2032 PT)', qty: 2, unit: 'Each', desc: 'Heavy-duty gate option', std: 'CSA O141 Grade #2' },
        { item: 'Post Caps (4\u00D74 or 6\u00D76 decorative)', qty: 22, unit: 'Each', desc: 'Cedar or treated wood', std: 'CSA O141' }
      ]},
      { name: 'Rails — Canadian Pressure-Treated', parts: [
        { item: 'Top Rail (2" \u00D7 6" \u00D7 8\u2032 PT)', qty: 13, unit: 'Each', desc: 'Pressure-treated or cedar', std: 'CSA O141 Grade #2' },
        { item: 'Bottom Rail (2" \u00D7 6" \u00D7 8\u2032 PT)', qty: 13, unit: 'Each', desc: 'Support rail', std: 'CSA O141 Grade #2' },
        { item: 'Mid-Rail (2" \u00D7 6" \u00D7 8\u2032 PT) (optional)', qty: 13, unit: 'Each', desc: 'For semi-privacy', std: 'CSA O141 Grade #2' }
      ]},
      { name: 'Boards / Pickets — Canadian Pressure-Treated', parts: [
        { item: 'Privacy Boards (1" \u00D7 5\u215D" \u00D7 60" PT)', qty: 220, unit: 'Each', desc: 'Tongue-and-groove privacy', std: 'CSA O141 Grade #2' },
        { item: 'Standard Boards (1" \u00D7 5\u215D" \u00D7 60" PT)', qty: 220, unit: 'Each', desc: 'Butt joint privacy', std: 'CSA O141 Grade #2' },
        { item: 'Pickets (1" \u00D7 3\u215D" \u00D7 60" PT)', qty: 300, unit: 'Each', desc: 'For picket-style fence', std: 'CSA O141 Grade #2' }
      ]},
      { name: 'Hardware & Fasteners — Galvanized Only', parts: [
        { item: '3\u00BD" Coated Deck Screws (S/S)', qty: 2, unit: 'lbs', desc: 'Hot-dip galvanized (800-1000 count)', std: 'CSA G40.8' },
        { item: '2\u00BD" Galvanized Nails (Ring or Spiral)', qty: 2, unit: 'lbs', desc: 'For secondary fastening', std: 'CSA G40.8' },
        { item: '2" Lag Screws (\u00BE" dia)', qty: 52, unit: 'Each', desc: 'For rail-to-post connections', std: 'CSA G40.8' },
        { item: 'Galvanized Bolts (\u00BE" \u00D7 4")', qty: 52, unit: 'Each', desc: 'Terminal post assembly', std: 'CSA G40.20' },
        { item: 'Galvanized Washers (\u00BE")', qty: 104, unit: 'Each', desc: 'For bolt distribution', std: 'CSA G40.8' },
        { item: 'Galvanized Nuts (\u00BE")', qty: 52, unit: 'Each', desc: 'For terminal posts', std: 'CSA G40.8' }
      ]},
      { name: 'Concrete & Footing — Canadian Standards', parts: [
        { item: 'Concrete (per post, standard)', qty: 0.5, unit: 'CY', desc: '20 MPa minimum (freeze-thaw protected)', std: 'CSA A3000' },
        { item: 'Total Concrete (100 LF)', qty: 8, unit: 'CY', desc: '16 posts approx', std: 'CSA A3000' },
        { item: 'Stone Dust (Base prep)', qty: 0.5, unit: 'Ton', desc: 'Drainage layer', std: 'CAN/CGSB-138.3-2019' }
      ]},
      { name: 'Gates — Canadian Standards', parts: [
        { item: 'Gate Frame (2\u00D76 PT wood)', qty: 4, unit: 'Pieces', desc: 'Top, bottom, sides', std: 'CSA O141' },
        { item: 'Gate Boards (1" \u00D7 5\u215D" \u00D7 60")', qty: 10, unit: 'Each', desc: 'Matching fence boards', std: 'CSA O141' },
        { item: 'Gate Hinges (Heavy-duty galv.)', qty: 2, unit: 'Each', desc: '3-4" adjustable hinges', std: 'CSA G40.8' },
        { item: 'Gate Latch (Galvanized)', qty: 1, unit: 'Each', desc: 'Manual or self-closing', std: 'CSA G40.8' },
        { item: 'Diagonal Bracing (optional)', qty: 1, unit: 'Set', desc: '2\u00D72 PT cross-bracing', std: 'CSA O141' }
      ]},
      { name: 'Finishing — Canadian Approved', parts: [
        { item: 'Wood Stain/Sealant (if desired)', qty: 5, unit: 'Gallons', desc: 'Cedar stain or transparent sealer', std: 'CSA O141 maintenance' },
        { item: 'Paint (if painting)', qty: 5, unit: 'Gallons', desc: 'Exterior grade, 2 coats', std: 'CSA standards' }
      ]}
    ]
  },
  wroughtiron: {
    label: 'Wrought Iron — Cloutier Direct Inventory Only',
    basis: 'Per 100 Linear Feet (Ornamental Style, 4-5\u2032 Height)',
    notes: [
      'ALL materials sourced from Cloutier Direct inventory exclusively',
      'Post sizes, styles, and decorative elements limited to Cloutier stock',
      'No custom sizing or alternative manufacturers permitted',
      'All products must match Cloutier Direct specifications and finishes',
      'Verify current Cloutier inventory availability before estimate'
    ],
    sections: [
      { name: 'Posts — Cloutier Direct Standard', parts: [
        { item: 'Wrought Iron Posts (1\u00BD" sq \u00D7 6\u20326\u2033)', qty: 16, unit: 'Each', desc: 'Hot-rolled steel, ornamental style', std: 'CD-POST-1.5-6.5' },
        { item: 'Terminal Posts (1\u00BE" sq \u00D7 6\u20326\u2033)', qty: 4, unit: 'Each', desc: 'Heavier for corner/end', std: 'CD-POST-1.75-6.5' },
        { item: 'Gate Posts (2" sq \u00D7 6\u20326\u2033)', qty: 2, unit: 'Each', desc: 'Reinforced for gate mounting', std: 'CD-POST-2-6.5' },
        { item: 'Post Caps (Decorative spear-point)', qty: 22, unit: 'Each', desc: 'Cloutier Direct ornamental finial', std: 'CD-CAP-SPEAR' },
        { item: 'Post Sleeves (for mounting)', qty: 16, unit: 'Each', desc: 'For concrete foundation', std: 'CD-SLEEVE-1.5' }
      ]},
      { name: 'Rails & Components — Cloutier Direct Standard', parts: [
        { item: 'Horizontal Rails (\u00BE" sq tube)', qty: 32, unit: 'LF', desc: 'Top, middle, bottom rails', std: 'CD-RAIL-0.75-SQ' },
        { item: 'Decorative Pickets (\u00BE" sq \u00D7 48")', qty: 200, unit: 'Each', desc: 'Spear-point or scroll design (Cloutier)', std: 'CD-PICKET-SPEAR-48' },
        { item: 'Scroll Work (ornamental)', qty: 8, unit: 'Each', desc: 'Mid-section decorative elements', std: 'CD-SCROLL-STD' }
      ]},
      { name: 'Fasteners & Hardware — Cloutier Direct Spec', parts: [
        { item: 'Lag Bolts (\u00BD" \u00D7 3")', qty: 96, unit: 'Each', desc: 'Post-to-rail connections (3 per joint)', std: 'CD-BOLT-LAG-1/2x3' },
        { item: 'Galvanized Washers (\u00BD")', qty: 96, unit: 'Each', desc: 'Bolt distribution', std: 'CD-WASHER-1/2' },
        { item: 'Galvanized Nuts (\u00BD")', qty: 96, unit: 'Each', desc: 'Grade 2 or better', std: 'CD-NUT-1/2' },
        { item: 'Weld-On Brackets (if welded)', qty: 32, unit: 'Each', desc: 'Alternative to bolts', std: 'CD-BRACKET-WELD' },
        { item: 'Concrete Anchors (\u00BD" diameter)', qty: 16, unit: 'Each', desc: 'For post base mounting', std: 'CD-ANCHOR-1/2' }
      ]},
      { name: 'Painting / Finishing — Professional Grade', parts: [
        { item: 'Rust Preventative Primer', qty: 2, unit: 'Gallons', desc: 'Epoxy-based, high-adhesion', std: 'CSA G40.8' },
        { item: 'Exterior Paint (Oil or Acrylic)', qty: 3, unit: 'Gallons', desc: 'Black, bronze, or custom color', std: 'CSA standards' },
        { item: 'Touch-up Paint (spray can)', qty: 2, unit: 'Cans', desc: 'Field repairs', std: 'CSA standards' },
        { item: 'Clear Coat/Sealant (optional)', qty: 1, unit: 'Gallon', desc: 'UV protection', std: 'CSA standards' }
      ]},
      { name: 'Concrete & Footing — Canadian Standards', parts: [
        { item: 'Concrete (per post, heavy-duty)', qty: 0.75, unit: 'CY', desc: '25-30 MPa for wrought iron', std: 'CSA A3000' },
        { item: 'Total Concrete (100 LF)', qty: 12, unit: 'CY', desc: '16 posts \u00D7 0.75 CY', std: 'CSA A3000' },
        { item: 'Stone Dust (Base prep)', qty: 1, unit: 'Ton', desc: 'Drainage and leveling', std: 'CAN/CGSB-138.3-2019' }
      ]},
      { name: 'Gates — Cloutier Direct Standard', parts: [
        { item: 'Gate Frame (Wrought iron)', qty: 1, unit: 'Set', desc: 'Pre-fabricated Cloutier style', std: 'CD-GATE-FRAME-4x4' },
        { item: 'Gate Pickets (\u00BE" sq \u00D7 48")', qty: 8, unit: 'Each', desc: 'Matching fence design', std: 'CD-PICKET-SPEAR-48' },
        { item: 'Gate Hinges (Heavy-duty, ornamental)', qty: 2, unit: 'Each', desc: 'Steel, 4-5" heavy-duty Cloutier', std: 'CD-HINGE-4-ORN' },
        { item: 'Gate Latch (Decorative latch)', qty: 1, unit: 'Each', desc: 'Matching Cloutier style', std: 'CD-LATCH-ORN' }
      ]}
    ]
  },
  guiderail: {
    label: 'Guide Rail — Canadian Highway Standard OPSD 02.16.04',
    basis: 'Per 100 Linear Feet (Highway Barrier Style — OPSD Compliant)',
    notes: [
      'ALL materials must comply with OPSD 02.16.04 (Object Protection Safety Device Standard)',
      'This is the ONLY Canadian highway standard for guide rails',
      'All specifications, dimensions, and materials strictly per OPSD requirements',
      'No alternative standards or materials permitted',
      'Installation must follow OPSD compliance checklist; regular OPSD compliance inspection required'
    ],
    sections: [
      { name: 'Posts & Terminals — OPSD Standard', parts: [
        { item: 'Steel Posts (W6\u00D79)', qty: 10, unit: 'Each', desc: '20\u2032 spacing per OPSD', std: 'OPSD 02.16.04' },
        { item: 'End Post Terminals (Energy-absorbing)', qty: 2, unit: 'Each', desc: 'OPSD approved end treatment', std: 'OPSD 02.16.04' },
        { item: 'Transition Posts', qty: 2, unit: 'Each', desc: 'Height transition per OPSD', std: 'OPSD 02.16.04' },
        { item: 'Ground-Level Support Posts', qty: 20, unit: 'Each', desc: 'Below-surface support posts', std: 'OPSD 02.16.04' }
      ]},
      { name: 'Rails — OPSD Standard W-Beam', parts: [
        { item: 'Upper W-Beam Rail (W10\u00D749)', qty: 100, unit: 'LF', desc: 'Primary impact rail OPSD spec', std: 'OPSD 02.16.04' },
        { item: 'Lower W-Beam Rail (W10\u00D749)', qty: 100, unit: 'LF', desc: 'Secondary support rail OPSD', std: 'OPSD 02.16.04' },
        { item: 'Back-Up Plates (\u00BD" steel)', qty: 20, unit: 'Each', desc: 'Mounting surface reinforcement', std: 'OPSD 02.16.04' }
      ]},
      { name: 'Fasteners & Hardware — OPSD Grade', parts: [
        { item: 'Bolts (1" \u00D7 5" Grade 5 OPSD)', qty: 200, unit: 'Each', desc: 'Rail-to-post connections (10 per post)', std: 'OPSD 02.16.04' },
        { item: 'Washers (1" hardened)', qty: 200, unit: 'Each', desc: 'Bolt distribution and bearing', std: 'OPSD 02.16.04' },
        { item: 'Nuts (1" lock)', qty: 200, unit: 'Each', desc: 'Grade 5 OPSD specification', std: 'OPSD 02.16.04' },
        { item: 'Cotter Pins (safety)', qty: 100, unit: 'Each', desc: 'For critical connections', std: 'OPSD 02.16.04' }
      ]},
      { name: 'Concrete & Footing — OPSD Deep Standards', parts: [
        { item: 'Concrete (per post, deep)', qty: 1.25, unit: 'CY', desc: '28-30 MPa OPSD requirement', std: 'OPSD 02.16.04' },
        { item: 'Total Concrete (100 LF)', qty: 12.5, unit: 'CY', desc: '10 posts \u00D7 1.25 CY', std: 'OPSD 02.16.04' },
        { item: 'Rebar (#4 diameter)', qty: 100, unit: 'LF', desc: 'For structural support OPSD', std: 'OPSD 02.16.04' },
        { item: 'Stone Dust Base', qty: 1, unit: 'Ton', desc: 'Drainage and prep OPSD', std: 'OPSD 02.16.04' }
      ]},
      { name: 'Safety & Visibility — OPSD Standard', parts: [
        { item: 'Reflectors (yellow/white OPSD)', qty: 20, unit: 'Each', desc: 'Every 20 feet for visibility', std: 'OPSD 02.16.04' },
        { item: 'Paint (high-visibility safety)', qty: 3, unit: 'Gallons', desc: 'Orange or yellow OPSD standard', std: 'OPSD 02.16.04' },
        { item: 'Galvanized Coating', qty: 1, unit: 'Qt', desc: 'Rust prevention', std: 'OPSD 02.16.04' }
      ]}
    ]
  },
  interiormount: {
    label: 'Interior Installation (Post Mounting) — Canadian Standards',
    basis: 'Quantities are per post / per location',
    notes: [
      'Option A: post mounting to concrete slab; Option B: to wood framing; Option C: dual post (embedded + mounted)',
      'All fasteners CSA G40.8; concrete work CSA A3000; wood CSA O141'
    ],
    sections: [
      { name: 'Option A: Post Mounting to Concrete Slab', parts: [
        { item: 'Post Base Plates (Bolted)', qty: 1, unit: 'Per post', desc: 'Heavy steel L-brackets CSA spec', std: 'CSA A3000' },
        { item: 'Expansion Anchors (\u00BD" dia)', qty: 4, unit: 'Per post', desc: 'Concrete bolt anchors', std: 'CSA A3000' },
        { item: 'Mounting Bolts (\u00BD" \u00D7 2\u00BD")', qty: 4, unit: 'Per post', desc: 'Grade 8 galvanized', std: 'CSA G40.8' },
        { item: 'Washers & Nuts (\u00BD")', qty: 8, unit: 'Per post', desc: 'High-strength fasteners', std: 'CSA G40.8' },
        { item: 'Post Height (above concrete)', qty: '-', unit: 'Variable', desc: "Can be 4', 5', 6', 8'", std: 'CAN/CGSB-138.3-2019' },
        { item: 'Concrete Drilling', qty: 4, unit: 'Holes', desc: '1-2" deep per post', std: 'CSA A3000' },
        { item: 'Epoxy (concrete bonding)', qty: 1, unit: 'Qt', desc: 'High-strength epoxy CSA spec', std: 'CSA A3000' },
        { item: 'Concrete Cleaner', qty: 1, unit: 'Qt', desc: 'Remove dust/debris', std: 'CSA A3000' }
      ]},
      { name: 'Option B: Post Mounting to Wood Framing', parts: [
        { item: 'Post Base Plates (Bolted to wood)', qty: 1, unit: 'Per post', desc: 'Heavy-duty angle brackets CSA spec', std: 'CSA O141' },
        { item: 'Lag Bolts (\u00BE" \u00D7 3.5")', qty: 4, unit: 'Per post', desc: 'For wood attachment CSA G40.8', std: 'CSA O141' },
        { item: 'Washers (\u00BE")', qty: 4, unit: 'Per post', desc: 'High-strength CSA G40.8', std: 'CSA G40.8' },
        { item: 'Nuts (\u00BE")', qty: 4, unit: 'Per post', desc: 'Grade 5+ CSA spec', std: 'CSA G40.8' },
        { item: 'Wood Blocking (if needed)', qty: '-', unit: 'As needed', desc: '2\u00D76 or 2\u00D78 reinforcement CSA O141', std: 'CSA O141' },
        { item: 'Wood Sealer/Stain', qty: 2, unit: 'Gallons', desc: 'Waterproof protection CSA spec', std: 'CSA O141' },
        { item: 'Flashing Tape (moisture control)', qty: 100, unit: 'LF', desc: 'Prevent water penetration CSA', std: 'CSA O141' },
        { item: 'Caulk (polyurethane)', qty: 1, unit: 'Qt', desc: 'Seal gaps CSA standard', std: 'CSA O141' }
      ]},
      { name: 'Option C: Dual Post Mounting (Embedded + Mounted)', parts: [
        { item: 'Lower Post (embedded PT)', qty: 1, unit: 'Per location', desc: '4\u00D74 PT wood CSA O141', std: 'CSA O141' },
        { item: 'Upper Post (bolted)', qty: 1, unit: 'Per location', desc: '4\u00D74 PT or vinyl CSA spec', std: 'CSA O141 / Homeland' },
        { item: 'Heavy-Duty Brackets', qty: 4, unit: 'Per connection', desc: 'Post-to-post connectors CSA', std: 'CSA G40.8' },
        { item: 'Lag Bolts (\u00BE" \u00D7 4")', qty: 8, unit: 'Per connection', desc: 'Structural bolts CSA G40.8', std: 'CSA G40.8' },
        { item: 'Concrete (lower post)', qty: 0.5, unit: 'CY', desc: 'Per post foundation CSA A3000', std: 'CSA A3000' }
      ]}
    ]
  }
};

/* Render the parts catalog for the selected fence type into Tab 16 */
function renderPartsCatalog() {
  const typeSel = document.getElementById('partsFenceType');
  const container = document.getElementById('partsCatalogContainer');
  if (!typeSel || !container) return;
  const data = PARTS_CATALOG[typeSel.value];
  container.innerHTML = '';
  if (!data) return;

  const title = document.createElement('h3');
  title.textContent = data.label;
  const basis = document.createElement('p');
  basis.innerHTML = '<em></em>';
  basis.firstChild.textContent = data.basis;
  container.appendChild(title);
  container.appendChild(basis);

  const filter = (document.getElementById('partsSearch') ? document.getElementById('partsSearch').value : '').toLowerCase();

  data.sections.forEach(section => {
    const parts = section.parts.filter(p => !filter ||
      p.item.toLowerCase().includes(filter) ||
      p.desc.toLowerCase().includes(filter) ||
      String(p.std).toLowerCase().includes(filter));
    if (!parts.length) return;
    const h4 = document.createElement('h4');
    h4.textContent = section.name;
    h4.style.cssText = 'margin:18px 0 6px;color:#1B2D4D;';
    container.appendChild(h4);
    const table = document.createElement('table');
    table.className = 'data-table';
    const thead = document.createElement('thead');
    const hr = document.createElement('tr');
    ['Item', 'Qty', 'Unit', 'Description', 'Standard / SKU'].forEach(t => {
      const th = document.createElement('th'); th.textContent = t; hr.appendChild(th);
    });
    thead.appendChild(hr); table.appendChild(thead);
    const tbody = document.createElement('tbody');
    parts.forEach(p => {
      const tr = document.createElement('tr');
      [p.item, p.qty, p.unit, p.desc, p.std].forEach(v => {
        const td = document.createElement('td'); td.textContent = v; tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    container.appendChild(table);
  });

  if (data.notes && data.notes.length) {
    const nh = document.createElement('h4');
    nh.textContent = 'Compliance Notes';
    nh.style.cssText = 'margin:18px 0 6px;color:#1B2D4D;';
    container.appendChild(nh);
    const ul = document.createElement('ul');
    data.notes.forEach(n => { const li = document.createElement('li'); li.textContent = n; ul.appendChild(li); });
    container.appendChild(ul);
  }
}

function printPartsCatalog() {
  const typeSel = document.getElementById('partsFenceType');
  const container = document.getElementById('partsCatalogContainer');
  if (!typeSel || !container || !PARTS_CATALOG[typeSel.value]) { alert('Pick a fence type first.'); return; }
  const win = window.open('', '_blank');
  if (!win) { alert('Please allow pop-ups to print the parts list.'); return; }
  win.document.write('<html><head><title>Fence Parts List</title><style>body{font-family:Arial;padding:30px}h1{color:#0FA89F}table{width:100%;border-collapse:collapse;margin:8px 0 16px}td,th{border:1px solid #999;padding:6px;text-align:left;font-size:12px}h4{margin:14px 0 4px}</style></head><body><h1>Fence Depot — Parts List</h1>' + container.innerHTML + '<p>Generated: ' + new Date().toLocaleDateString() + ' — Canadian Standards Compliant</p></body></html>');
  win.document.close();
  win.print();
}

document.addEventListener('DOMContentLoaded', function () {
  const typeSel = document.getElementById('partsFenceType');
  const search = document.getElementById('partsSearch');
  if (typeSel) typeSel.addEventListener('change', renderPartsCatalog);
  if (search) {
    let t;
    search.addEventListener('input', function () { clearTimeout(t); t = setTimeout(renderPartsCatalog, 150); });
  }
  renderPartsCatalog();
});
