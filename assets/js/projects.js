/* Carpenter — built-in project catalog.
   Every project is parametric: `parts(p)` is recalculated whenever the
   builder changes a dimension, so the cut list is always true to the size
   actually being built. All internal units are millimetres.
   stock: "board" (solid lumber) | "panel" (sheet goods) | "dowel" (round). */

window.CATEGORIES = [
  { id: "shelving", name: "Shelves & wall storage", blurb: "The first thing most people build, and the thing every home runs out of." },
  { id: "storage", name: "Cabinets, chests & drawers", blurb: "Boxes with ambitions. Carcass work, drawers, doors." },
  { id: "tables", name: "Tables & desks", blurb: "Flat, stable, and asked to survive decades of elbows." },
  { id: "toys", name: "Wooden toys", blurb: "Small stock, sharp detail, no finish that a child shouldn't chew." },
  { id: "outdoor", name: "Garden & outdoor", blurb: "Built to get wet. Different wood, different fasteners." },
  { id: "shop", name: "Workshop & jigs", blurb: "Build these first — they make everything after them easier." }
];

window.SUBCATS = [
  { id: "animals", name: "Animals", cat: "toys" },
  { id: "cars", name: "Cars & trucks", cat: "toys" },
  { id: "planes", name: "Planes & flight", cat: "toys" },
  { id: "montessori", name: "Montessori", cat: "toys" },
  { id: "puzzles", name: "Puzzles & thinking", cat: "toys" }
];

/* helper: round to nearest mm */
function r(n) { return Math.round(n); }

window.PROJECTS = [
/* ─────────────────────────── SHELVING ─────────────────────────── */
{
  id: "floating-shelf", title: "Floating wall shelf", cat: "shelving", level: 1, hours: "3–4 h",
  blurb: "A solid shelf that hangs on a hidden French cleat. No visible brackets, no visible screws.",
  wood: "Oak, ash or pine, 25 mm",
  paramDefs: [
    { k: "L", label: "Shelf length", def: 900, min: 400, max: 2000, step: 10 },
    { k: "D", label: "Shelf depth", def: 220, min: 120, max: 350, step: 10 },
    { k: "T", label: "Board thickness", def: 25, min: 18, max: 40, step: 1 }
  ],
  parts: p => [
    { name: "Shelf board", qty: 1, t: p.T, w: p.D, l: p.L, stock: "board" },
    { name: "Wall cleat (45° bevel)", qty: 1, t: 25, w: 70, l: p.L - 60, stock: "board" },
    { name: "Shelf cleat (45° bevel)", qty: 1, t: 25, w: 70, l: p.L - 60, stock: "board" },
    { name: "Back spacer", qty: 2, t: 25, w: 40, l: p.D - 90, stock: "board" }
  ],
  hardware: p => [
    { name: "Wall plugs + 60 mm screws", qty: Math.max(3, Math.ceil(p.L / 400)) },
    { name: "40 mm screws (cleat to shelf)", qty: Math.max(4, Math.ceil(p.L / 300)) }
  ],
  tools: { req: ["tape", "square", "circular-saw", "drill", "sanding-block", "clamps", "glue", "safety-glasses"],
           nice: ["track-saw", "router", "orbital", "block-plane"] },
  steps: [
    "Rip the cleat stock in half at 45° — one cut gives you both halves of the cleat.",
    "Glue and screw the shelf cleat and spacers to the underside of the shelf, flush at the back.",
    "Find the studs, mark a level line, and screw the wall cleat on with the bevel pointing up and back.",
    "Sand to 180 grit, easing the front edge so it feels soft to the hand.",
    "Drop the shelf onto the cleat. It should sit tight against the wall with no gap."
  ],
  finish: "Hardwax oil, two coats, sanded lightly with 320 between them.",
  safety: "A hidden cleat is only as strong as its fixings — always land at least two screws in studs.",
  source: { label: "Free plan library — Ana White", url: "https://www.ana-white.com/" }
},
{
  id: "bookcase", title: "Adjustable bookcase", cat: "shelving", level: 2, hours: "1–2 days",
  blurb: "A plywood carcass with shelf-pin holes so the spacing can change as the books do.",
  wood: "18 mm birch plywood + solid edging",
  paramDefs: [
    { k: "W", label: "Width", def: 800, min: 400, max: 1200, step: 10 },
    { k: "H", label: "Height", def: 1800, min: 800, max: 2400, step: 10 },
    { k: "D", label: "Depth", def: 280, min: 200, max: 400, step: 10 },
    { k: "N", label: "Adjustable shelves", def: 4, min: 1, max: 8, step: 1 }
  ],
  parts: p => [
    { name: "Side panel", qty: 2, t: 18, w: p.D, l: p.H, stock: "panel" },
    { name: "Top & bottom", qty: 2, t: 18, w: p.D, l: p.W - 36, stock: "panel" },
    { name: "Adjustable shelf", qty: p.N, t: 18, w: p.D - 12, l: p.W - 40, stock: "panel" },
    { name: "Back panel", qty: 1, t: 6, w: p.W, l: p.H, stock: "panel" },
    { name: "Front edging", qty: 2 + p.N, t: 6, w: 18, l: p.W, stock: "board" },
    { name: "Plinth rail", qty: 1, t: 18, w: 80, l: p.W - 36, stock: "panel" }
  ],
  hardware: p => [
    { name: "5 mm shelf pins", qty: p.N * 4 + 4 },
    { name: "40 mm screws", qty: 16 },
    { name: "20 mm panel pins (back)", qty: r(p.H / 60) },
    { name: "Anti-tip wall strap", qty: 1 }
  ],
  tools: { req: ["tape", "square", "straightedge", "circular-saw", "drill", "clamps", "glue", "orbital", "safety-glasses", "dust-mask"],
           nice: ["track-saw", "table-saw", "dowel-jig", "pocket-jig", "brad-nailer"] },
  steps: [
    "Break the sheet down into the two sides first — they must be identical, so cut them together.",
    "Drill the shelf-pin holes with a strip of pegboard as a template, both sides from the same reference end.",
    "Join top and bottom to the sides with dowels or screws, checking diagonals as you clamp.",
    "Glue the solid edging onto every visible plywood edge and plane it flush.",
    "Fit the back panel — it is what keeps the case square forever, so don't skip it.",
    "Strap the finished case to the wall before a single book goes in."
  ],
  finish: "Water-based clear matte lacquer, three thin coats.",
  safety: "Tall cases tip. The wall strap is not optional in a house with children.",
  source: { label: "Sheet-goods layout tips — Woodworking for Mere Mortals", url: "https://woodworkingformeremortals.com/" }
},
{
  id: "picture-ledge", title: "Picture ledge", cat: "shelving", level: 1, hours: "2 h",
  blurb: "A shallow lip that lets you lean and re-arrange art instead of drilling a hole per frame.",
  wood: "Pine or poplar, 18 mm",
  paramDefs: [
    { k: "L", label: "Length", def: 1200, min: 400, max: 2400, step: 10 },
    { k: "D", label: "Ledge depth", def: 90, min: 60, max: 140, step: 5 }
  ],
  parts: p => [
    { name: "Ledge base", qty: 1, t: 18, w: p.D, l: p.L, stock: "board" },
    { name: "Back rail", qty: 1, t: 18, w: 70, l: p.L, stock: "board" },
    { name: "Front lip", qty: 1, t: 18, w: 35, l: p.L, stock: "board" }
  ],
  hardware: p => [{ name: "60 mm screws + plugs", qty: Math.max(2, Math.ceil(p.L / 500)) }, { name: "30 mm brads", qty: r(p.L / 120) }],
  tools: { req: ["tape", "square", "handsaw", "drill", "glue", "sanding-block", "safety-glasses"], nice: ["miter-saw", "brad-nailer", "clamps"] },
  steps: [
    "Cut all three lengths at once so the ends line up perfectly.",
    "Glue and pin the front lip to the base, flush at the bottom.",
    "Glue the back rail behind the base, keeping the assembly square.",
    "Drill and countersink through the back rail on your stud spacing.",
    "Sand, finish, then screw to the wall on a level line."
  ],
  finish: "Paint the ledge the wall colour and it disappears; the art floats.",
  safety: "Check for cables before drilling into plasterboard.",
  source: { label: "Ledge variations — Shanty 2 Chic", url: "https://www.shanty-2-chic.com/" }
},
{
  id: "corner-shelf", title: "Corner shelf tower", cat: "shelving", level: 2, hours: "5–6 h",
  blurb: "Five triangular shelves that turn a dead corner into storage.",
  wood: "18 mm plywood or glued pine panel",
  paramDefs: [
    { k: "S", label: "Shelf side", def: 320, min: 200, max: 500, step: 10 },
    { k: "H", label: "Total height", def: 1400, min: 600, max: 2000, step: 10 },
    { k: "N", label: "Shelves", def: 5, min: 3, max: 8, step: 1 }
  ],
  parts: p => [
    { name: "Triangular shelf", qty: p.N, t: 18, w: p.S, l: p.S, stock: "panel" },
    { name: "Corner post (rear)", qty: 1, t: 40, w: 40, l: p.H, stock: "board" },
    { name: "Front post", qty: 2, t: 30, w: 30, l: p.H, stock: "board" }
  ],
  hardware: p => [{ name: "50 mm screws", qty: p.N * 6 }, { name: "Wall bracket", qty: 1 }],
  tools: { req: ["tape", "square", "bevel", "jigsaw", "drill", "clamps", "glue", "sanding-block", "safety-glasses"], nice: ["circular-saw", "orbital", "pocket-jig"] },
  steps: [
    "Mark one shelf, cut it, then use it as the template for the rest.",
    "Lay out the shelf heights on all three posts at the same time, side by side.",
    "Screw the shelves to the rear post first, then pull the front posts in.",
    "Check the whole tower against the actual corner — walls are rarely 90°; trim the back edges to suit.",
    "Fix a small bracket at the top to stop it walking out of the corner."
  ],
  finish: "Oil or leave raw if it's going in a utility corner.",
  safety: "Support the offcut when jigsawing triangles — they like to drop and snap.",
  source: { label: "Corner unit inspiration — Instructables Woodworking", url: "https://www.instructables.com/woodworking/" }
},
{
  id: "spice-rack", title: "Spice rack", cat: "shelving", level: 1, hours: "2 h",
  blurb: "A two-tier rack sized to your jars, not to a catalogue.",
  wood: "Pine, 15 mm",
  paramDefs: [
    { k: "W", label: "Width", def: 450, min: 250, max: 900, step: 10 },
    { k: "JH", label: "Jar height", def: 110, min: 70, max: 180, step: 5 },
    { k: "JD", label: "Jar diameter", def: 55, min: 35, max: 90, step: 5 }
  ],
  parts: p => [
    { name: "Side", qty: 2, t: 15, w: p.JD + 25, l: p.JH * 2 + 60, stock: "board" },
    { name: "Shelf", qty: 2, t: 15, w: p.JD + 25, l: p.W - 30, stock: "board" },
    { name: "Retaining rail", qty: 2, t: 8, w: 20, l: p.W - 30, stock: "board" },
    { name: "Back slat", qty: 2, t: 8, w: 60, l: p.W, stock: "board" }
  ],
  hardware: () => [{ name: "30 mm screws", qty: 8 }, { name: "Keyhole hangers", qty: 2 }],
  tools: { req: ["tape", "square", "handsaw", "drill", "glue", "clamps", "sanding-block", "safety-glasses"], nice: ["miter-saw", "brad-nailer"] },
  steps: [
    "Measure your tallest jar and add 20 mm — that number drives the whole rack.",
    "Cut the sides as a matched pair and mark the shelf positions across both at once.",
    "Glue and screw the shelves between the sides, then add the back slats to square it up.",
    "Pin the retaining rails 30 mm above each shelf so jars can't walk off.",
    "Sand everything, finish, and hang on two keyhole plates."
  ],
  finish: "Wipe-on poly — it survives a steamy kitchen.",
  safety: "Pre-drill near the ends of 15 mm pine or it will split.",
  source: { label: "Kitchen storage builds — Woodworkers Guild of America", url: "https://www.wwgoa.com/" }
},

/* ─────────────────────────── STORAGE ─────────────────────────── */
{
  id: "nightstand", title: "Nightstand with drawer", cat: "storage", level: 3, hours: "2 days",
  blurb: "A small carcass with one real drawer — the cheapest way to learn drawer-making.",
  wood: "18 mm ply carcass, solid legs, 12 mm drawer sides",
  paramDefs: [
    { k: "W", label: "Width", def: 450, min: 350, max: 600, step: 10 },
    { k: "H", label: "Height", def: 550, min: 400, max: 700, step: 10 },
    { k: "D", label: "Depth", def: 400, min: 300, max: 500, step: 10 }
  ],
  parts: p => [
    { name: "Leg", qty: 4, t: 40, w: 40, l: p.H, stock: "board" },
    { name: "Side panel", qty: 2, t: 18, w: p.D - 40, l: p.H - 180, stock: "panel" },
    { name: "Back panel", qty: 1, t: 18, w: p.W - 80, l: p.H - 180, stock: "panel" },
    { name: "Top", qty: 1, t: 20, w: p.D + 20, l: p.W + 20, stock: "board" },
    { name: "Shelf / drawer runner support", qty: 2, t: 18, w: 60, l: p.D - 60, stock: "panel" },
    { name: "Drawer front", qty: 1, t: 18, w: 150, l: p.W - 60, stock: "board" },
    { name: "Drawer side", qty: 2, t: 12, w: 140, l: p.D - 80, stock: "board" },
    { name: "Drawer back", qty: 1, t: 12, w: 140, l: p.W - 90, stock: "board" },
    { name: "Drawer bottom", qty: 1, t: 6, w: p.D - 90, l: p.W - 90, stock: "panel" }
  ],
  hardware: () => [
    { name: "350 mm drawer runners (pair)", qty: 1 },
    { name: "40 mm screws", qty: 24 },
    { name: "Knob or pull", qty: 1 }
  ],
  tools: { req: ["tape", "square", "circular-saw", "drill", "clamps", "glue", "orbital", "chisels", "safety-glasses"],
           nice: ["table-saw", "router", "pocket-jig", "dowel-jig", "block-plane"] },
  steps: [
    "Cut the four legs together and mark the rail positions on all of them at once.",
    "Assemble the two side frames first, then join them with the back panel.",
    "Fit the runner supports dead level — a drawer will report every error you make here.",
    "Build the drawer box 26 mm narrower than the opening for side-mount runners (check your runners).",
    "Hang the drawer, then attach the drawer front last with double-sided tape, adjust, and screw from inside.",
    "Glue the top on with buttons or slotted screws so solid wood can move."
  ],
  finish: "Danish oil on the solid parts, matte lacquer inside the drawer.",
  safety: "Test-fit the drawer before glue-up. Dry runs cost minutes; wet mistakes cost the piece.",
  source: { label: "Drawer construction basics — The Wood Whisperer", url: "https://thewoodwhisperer.com/" }
},
{
  id: "dresser-3", title: "Three-drawer dresser", cat: "storage", level: 4, hours: "3–4 days",
  blurb: "The nightstand, scaled up and repeated. Same joints, three times the drawer practice.",
  wood: "18 mm birch ply carcass, 12 mm drawer boxes",
  paramDefs: [
    { k: "W", label: "Width", def: 900, min: 600, max: 1400, step: 10 },
    { k: "H", label: "Height", def: 800, min: 600, max: 1100, step: 10 },
    { k: "D", label: "Depth", def: 450, min: 350, max: 550, step: 10 },
    { k: "N", label: "Drawers", def: 3, min: 2, max: 5, step: 1 }
  ],
  parts: p => {
    const dh = Math.floor((p.H - 120 - (p.N + 1) * 12) / p.N);
    return [
      { name: "Side panel", qty: 2, t: 18, w: p.D, l: p.H - 100, stock: "panel" },
      { name: "Top & bottom", qty: 2, t: 18, w: p.D, l: p.W - 36, stock: "panel" },
      { name: "Back panel", qty: 1, t: 6, w: p.W, l: p.H - 100, stock: "panel" },
      { name: "Drawer divider rail", qty: p.N - 1, t: 18, w: 70, l: p.W - 36, stock: "panel" },
      { name: "Plinth side", qty: 2, t: 18, w: 100, l: p.D - 40, stock: "panel" },
      { name: "Plinth front & back", qty: 2, t: 18, w: 100, l: p.W, stock: "panel" },
      { name: "Drawer front", qty: p.N, t: 18, w: dh, l: p.W - 8, stock: "panel" },
      { name: "Drawer side", qty: p.N * 2, t: 12, w: dh - 25, l: p.D - 40, stock: "board" },
      { name: "Drawer front/back (box)", qty: p.N * 2, t: 12, w: dh - 25, l: p.W - 90, stock: "board" },
      { name: "Drawer bottom", qty: p.N, t: 6, w: p.D - 60, l: p.W - 90, stock: "panel" }
    ];
  },
  hardware: p => [
    { name: "Drawer runner pairs", qty: p.N },
    { name: "40 mm screws", qty: 40 },
    { name: "Handles", qty: p.N },
    { name: "Anti-tip strap", qty: 1 }
  ],
  tools: { req: ["tape", "square", "straightedge", "circular-saw", "drill", "clamps", "glue", "orbital", "safety-glasses", "dust-mask"],
           nice: ["track-saw", "table-saw", "router", "pocket-jig", "brad-nailer", "shop-vac"] },
  steps: [
    "Cut every panel from a full-sheet layout before assembling anything — offcuts get expensive.",
    "Build the carcass on the flattest surface you own and clamp diagonals until the glue grabs.",
    "Install runners with a spacer block so every drawer sits at exactly the same setback.",
    "Make all drawer boxes to one story stick, not to individual measurements.",
    "Level the plinth on the floor first, then set the carcass on it.",
    "Fit fronts with a 3 mm gap all round using coins or playing cards as spacers."
  ],
  finish: "Spray or roll water-based lacquer; oil the drawer runners' wooden bearing surfaces only.",
  safety: "A loaded dresser with open drawers tips forwards. Strap it to the wall.",
  source: { label: "Casework guides — Fine Woodworking (free articles)", url: "https://www.finewoodworking.com/" }
},
{
  id: "toy-chest", title: "Toy chest with soft-close lid", cat: "storage", level: 2, hours: "1 day",
  blurb: "A big box that swallows the living-room floor. The lid stay is the safety feature.",
  wood: "18 mm plywood or pine boards",
  paramDefs: [
    { k: "W", label: "Width", def: 800, min: 500, max: 1200, step: 10 },
    { k: "H", label: "Height", def: 450, min: 300, max: 600, step: 10 },
    { k: "D", label: "Depth", def: 450, min: 300, max: 600, step: 10 }
  ],
  parts: p => [
    { name: "Front & back", qty: 2, t: 18, w: p.H - 18, l: p.W, stock: "panel" },
    { name: "Side", qty: 2, t: 18, w: p.H - 18, l: p.D - 36, stock: "panel" },
    { name: "Bottom", qty: 1, t: 18, w: p.D - 36, l: p.W - 36, stock: "panel" },
    { name: "Lid", qty: 1, t: 18, w: p.D, l: p.W, stock: "panel" },
    { name: "Lid edging", qty: 2, t: 18, w: 30, l: p.W, stock: "board" },
    { name: "Corner cleat", qty: 4, t: 30, w: 30, l: p.H - 40, stock: "board" }
  ],
  hardware: () => [
    { name: "Soft-close lid stay", qty: 1 },
    { name: "Piano hinge or 2 butt hinges", qty: 1 },
    { name: "40 mm screws", qty: 24 },
    { name: "Castors (optional)", qty: 4 }
  ],
  tools: { req: ["tape", "square", "circular-saw", "drill", "clamps", "glue", "orbital", "chisels", "safety-glasses"], nice: ["router", "brad-nailer", "track-saw"] },
  steps: [
    "Glue and screw the four sides around the corner cleats — fast, strong, no fancy joints.",
    "Drop the bottom in on cleats rather than screwing through the sides.",
    "Round over every edge generously. This box lives at toddler head height.",
    "Mortise the hinges into the back edge with a chisel, or use a piano hinge screwed on top.",
    "Fit the soft-close stay before anyone plays with the lid.",
    "Drill two 25 mm finger holes near the top of each side for ventilation and lifting."
  ],
  finish: "Child-safe water-based paint or a toy-rated oil.",
  safety: "A chest lid must never fall freely. Lid stay first, toys second.",
  source: { label: "Child-safe chest guidance — CPSC", url: "https://www.cpsc.gov/" }
},
{
  id: "shoe-bench", title: "Entryway shoe bench", cat: "storage", level: 2, hours: "6–8 h",
  blurb: "Sit down to put your boots on, and the boots have somewhere to live.",
  wood: "Pine or 18 mm ply, solid top",
  paramDefs: [
    { k: "W", label: "Width", def: 900, min: 600, max: 1400, step: 10 },
    { k: "H", label: "Seat height", def: 450, min: 380, max: 520, step: 5 },
    { k: "D", label: "Depth", def: 350, min: 280, max: 450, step: 10 }
  ],
  parts: p => [
    { name: "Seat top", qty: 1, t: 25, w: p.D, l: p.W, stock: "board" },
    { name: "Leg", qty: 4, t: 45, w: 45, l: p.H - 25, stock: "board" },
    { name: "Long rail", qty: 2, t: 20, w: 80, l: p.W - 130, stock: "board" },
    { name: "Short rail", qty: 2, t: 20, w: 80, l: p.D - 130, stock: "board" },
    { name: "Shelf slat", qty: 4, t: 18, w: 70, l: p.W - 130, stock: "board" }
  ],
  hardware: () => [{ name: "60 mm screws", qty: 16 }, { name: "Felt floor pads", qty: 4 }],
  tools: { req: ["tape", "square", "handsaw", "drill", "clamps", "glue", "orbital", "safety-glasses"], nice: ["miter-saw", "pocket-jig", "dowel-jig", "router"] },
  steps: [
    "Make the two short end frames first: two legs and two short rails each.",
    "Join the ends with the long rails, measuring both diagonals before the glue sets.",
    "Space the shelf slats with an offcut so the gaps are identical.",
    "Screw the top on from underneath through slotted holes.",
    "Break every edge with sandpaper — bare shins will find any sharp corner."
  ],
  finish: "Hardwearing satin varnish; entryways are wet places.",
  safety: "Sit on it hard before you trust it. Racking failures show up under load.",
  source: { label: "Bench plans — Ana White", url: "https://www.ana-white.com/" }
},
{
  id: "wall-cabinet", title: "Small wall cabinet", cat: "storage", level: 3, hours: "1 day",
  blurb: "A shallow cabinet with a frame-and-panel door — a whole furniture education in one small box.",
  wood: "18 mm ply carcass, solid door frame",
  paramDefs: [
    { k: "W", label: "Width", def: 500, min: 300, max: 800, step: 10 },
    { k: "H", label: "Height", def: 600, min: 350, max: 900, step: 10 },
    { k: "D", label: "Depth", def: 180, min: 120, max: 300, step: 10 }
  ],
  parts: p => [
    { name: "Side", qty: 2, t: 18, w: p.D, l: p.H, stock: "panel" },
    { name: "Top & bottom", qty: 2, t: 18, w: p.D, l: p.W - 36, stock: "panel" },
    { name: "Shelf", qty: 1, t: 18, w: p.D - 20, l: p.W - 38, stock: "panel" },
    { name: "Back", qty: 1, t: 6, w: p.W, l: p.H, stock: "panel" },
    { name: "Door stile", qty: 2, t: 20, w: 55, l: p.H - 6, stock: "board" },
    { name: "Door rail", qty: 2, t: 20, w: 55, l: p.W - 116, stock: "board" },
    { name: "Door panel", qty: 1, t: 6, w: p.H - 110, l: p.W - 116, stock: "panel" }
  ],
  hardware: () => [{ name: "Concealed hinges", qty: 2 }, { name: "Knob", qty: 1 }, { name: "Magnetic catch", qty: 1 }, { name: "40 mm screws", qty: 12 }],
  tools: { req: ["tape", "square", "circular-saw", "drill", "chisels", "clamps", "glue", "orbital", "safety-glasses"], nice: ["router", "table-saw", "forstner", "dowel-jig"] },
  steps: [
    "Build the carcass square — the door will expose every millimetre of error.",
    "Groove the door stiles and rails 6 mm wide, 10 mm deep, for the panel.",
    "Cut stub tenons on the rails to fit the same groove, then dry-fit the whole door.",
    "Glue the frame only — the panel floats free so it can expand.",
    "Bore 35 mm hinge cups with a Forstner bit, or use simple butt hinges instead.",
    "Hang the door with a 2 mm gap, adjust, then fit the catch."
  ],
  finish: "Paint the carcass, oil the door frame — the contrast makes a small piece look intentional.",
  safety: "Clamp small door parts; never rout a piece you are holding by hand.",
  source: { label: "Frame-and-panel doors — Popular Woodworking", url: "https://www.popularwoodworking.com/" }
},

/* ─────────────────────────── TABLES ─────────────────────────── */
{
  id: "dining-table", title: "Farmhouse dining table", cat: "tables", level: 3, hours: "2–3 days",
  blurb: "A glued-up solid top on a trestle base, built so the top can move with the seasons.",
  wood: "Solid pine, oak or ash",
  paramDefs: [
    { k: "L", label: "Table length", def: 1800, min: 1200, max: 2600, step: 20 },
    { k: "W", label: "Table width", def: 900, min: 700, max: 1100, step: 10 },
    { k: "H", label: "Table height", def: 750, min: 700, max: 800, step: 5 },
    { k: "TB", label: "Top thickness", def: 32, min: 25, max: 45, step: 1 }
  ],
  parts: p => [
    { name: "Top board (glue-up)", qty: Math.ceil(p.W / 190), t: p.TB, w: 190, l: p.L, stock: "board" },
    { name: "Breadboard end (optional)", qty: 2, t: p.TB, w: 90, l: p.W, stock: "board" },
    { name: "Leg", qty: 4, t: 90, w: 90, l: p.H - p.TB - 20, stock: "board" },
    { name: "Long apron", qty: 2, t: 30, w: 120, l: p.L - 340, stock: "board" },
    { name: "End apron", qty: 2, t: 30, w: 120, l: p.W - 340, stock: "board" },
    { name: "Centre stretcher", qty: 1, t: 40, w: 90, l: p.L - 500, stock: "board" }
  ],
  hardware: p => [
    { name: "Table-top fasteners (buttons)", qty: 10 },
    { name: "100 mm structural screws", qty: 16 },
    { name: "Levelling feet", qty: 4 }
  ],
  tools: { req: ["tape", "square", "straightedge", "circular-saw", "drill", "clamps", "glue", "orbital", "hand-plane", "safety-glasses", "dust-mask"],
           nice: ["track-saw", "router", "dowel-jig", "biscuit", "card-scraper", "block-plane"] },
  steps: [
    "Arrange the top boards for grain and alternate the growth rings before gluing.",
    "Glue the top up in pairs — two boards at a time is far easier to keep flat than six.",
    "Flatten the top with a plane or a router sled, then work through the grits to 180.",
    "Build the base as two end frames joined by the stretcher, checked for square and wind.",
    "Attach the top with buttons or figure-8 fasteners so it can expand across its width.",
    "Finish the underside too — an unfinished face absorbs moisture and cups the top."
  ],
  finish: "Hardwax oil for repairability, or polyurethane if children eat here daily.",
  safety: "A 1.8 m top is heavy and awkward. Move it with two people, always.",
  source: { label: "Wood movement explained — Wood Database", url: "https://www.wood-database.com/" }
},
{
  id: "coffee-table", title: "Coffee table with shelf", cat: "tables", level: 2, hours: "1 day",
  blurb: "Low, simple, and the ideal first table: real joinery at a forgiving scale.",
  wood: "Oak, ash or pine",
  paramDefs: [
    { k: "L", label: "Length", def: 1100, min: 700, max: 1500, step: 10 },
    { k: "W", label: "Width", def: 550, min: 400, max: 700, step: 10 },
    { k: "H", label: "Height", def: 420, min: 350, max: 500, step: 5 }
  ],
  parts: p => [
    { name: "Top board", qty: Math.ceil(p.W / 190), t: 25, w: 190, l: p.L, stock: "board" },
    { name: "Leg", qty: 4, t: 60, w: 60, l: p.H - 25, stock: "board" },
    { name: "Long apron", qty: 2, t: 22, w: 90, l: p.L - 200, stock: "board" },
    { name: "End apron", qty: 2, t: 22, w: 90, l: p.W - 200, stock: "board" },
    { name: "Shelf slat", qty: 5, t: 18, w: 90, l: p.L - 220, stock: "board" },
    { name: "Shelf bearer", qty: 2, t: 22, w: 45, l: p.W - 200, stock: "board" }
  ],
  hardware: () => [{ name: "Table-top buttons", qty: 8 }, { name: "60 mm screws", qty: 16 }],
  tools: { req: ["tape", "square", "circular-saw", "drill", "clamps", "glue", "orbital", "safety-glasses"], nice: ["miter-saw", "router", "dowel-jig", "pocket-jig", "block-plane"] },
  steps: [
    "Glue up the top first so it can rest while you build the base.",
    "Cut all four legs to identical length — stand them on a flat surface and check.",
    "Assemble end frames, then long aprons, keeping everything on one flat reference face.",
    "Set the shelf bearers 120 mm up from the floor and space the slats evenly.",
    "Ease all edges, finish, and attach the top from below."
  ],
  finish: "Two coats of oil, then wax. Coffee rings wipe off wax.",
  safety: "Legs at 60 mm square are heavy to crosscut by hand — support both ends.",
  source: { label: "Beginner table builds — Steve Ramsey / WWMM", url: "https://woodworkingformeremortals.com/" }
},
{
  id: "side-table", title: "Tapered-leg side table", cat: "tables", level: 2, hours: "6 h",
  blurb: "Four tapered legs and a small top. It teaches taper cuts and looks far harder than it is.",
  wood: "Hardwood, 45 mm legs",
  paramDefs: [
    { k: "S", label: "Top size (square)", def: 450, min: 300, max: 600, step: 10 },
    { k: "H", label: "Height", def: 550, min: 400, max: 700, step: 10 }
  ],
  parts: p => [
    { name: "Top", qty: 1, t: 22, w: p.S, l: p.S, stock: "board" },
    { name: "Leg (tapered to 22 mm)", qty: 4, t: 45, w: 45, l: p.H - 22, stock: "board" },
    { name: "Apron", qty: 4, t: 20, w: 75, l: p.S - 130, stock: "board" }
  ],
  hardware: () => [{ name: "Table-top buttons", qty: 4 }, { name: "50 mm screws", qty: 8 }],
  tools: { req: ["tape", "square", "handsaw", "drill", "clamps", "glue", "hand-plane", "sanding-block", "safety-glasses"], nice: ["table-saw", "bandsaw", "jigsaw", "dowel-jig", "block-plane"] },
  steps: [
    "Mark the taper on two inside faces of each leg, starting 150 mm down from the top.",
    "Saw just outside the line and plane down to it — a tapering jig works too.",
    "Cut the aprons all to one length using a stop block.",
    "Dry-assemble on a flat surface and check for rock before any glue.",
    "Glue the base up in one go, measuring the diagonals from the leg tops."
  ],
  finish: "Oil the base, wax the top.",
  safety: "Tapered legs sit awkwardly in clamps — use cauls cut to the same angle.",
  source: { label: "Tapering techniques — Fine Woodworking", url: "https://www.finewoodworking.com/" }
},
{
  id: "desk", title: "Writing desk with cable tray", cat: "tables", level: 3, hours: "1–2 days",
  blurb: "A desk that hides its own cables — the tray is the whole point.",
  wood: "18 mm ply or solid top, solid legs",
  paramDefs: [
    { k: "L", label: "Desk width", def: 1400, min: 1000, max: 2000, step: 10 },
    { k: "D", label: "Desk depth", def: 700, min: 550, max: 850, step: 10 },
    { k: "H", label: "Height", def: 740, min: 700, max: 780, step: 5 }
  ],
  parts: p => [
    { name: "Desk top", qty: 1, t: 25, w: p.D, l: p.L, stock: "board" },
    { name: "Leg", qty: 4, t: 60, w: 60, l: p.H - 25, stock: "board" },
    { name: "Back apron", qty: 1, t: 22, w: 120, l: p.L - 200, stock: "board" },
    { name: "Side apron", qty: 2, t: 22, w: 120, l: p.D - 200, stock: "board" },
    { name: "Cable tray back", qty: 1, t: 12, w: 90, l: p.L - 260, stock: "panel" },
    { name: "Cable tray bottom", qty: 1, t: 12, w: 110, l: p.L - 260, stock: "panel" },
    { name: "Modesty panel (optional)", qty: 1, t: 12, w: 250, l: p.L - 220, stock: "panel" }
  ],
  hardware: () => [{ name: "Table-top buttons", qty: 8 }, { name: "60 mm screws", qty: 16 }, { name: "80 mm cable grommet", qty: 1 }, { name: "Levelling feet", qty: 4 }],
  tools: { req: ["tape", "square", "circular-saw", "drill", "hole-saw", "clamps", "glue", "orbital", "safety-glasses"], nice: ["track-saw", "router", "forstner", "pocket-jig"] },
  steps: [
    "Build the leg-and-apron base first and check it against your chair height.",
    "Screw the L-shaped cable tray to the inside of the back apron before fitting the top.",
    "Bore the grommet hole with a hole saw, backing the cut to avoid tear-out.",
    "Fit the top with buttons; slotted holes if you used solid wood.",
    "Route or file a shallow notch at the back edge so cables exit without pinching."
  ],
  finish: "Matte lacquer resists forearm wear better than oil.",
  safety: "Never drill the grommet hole freehand on a finished top — clamp a guide.",
  source: { label: "Desk ergonomics reference — Wirecutter guides", url: "https://www.nytimes.com/wirecutter/" }
},
{
  id: "kids-table", title: "Kids' play table", cat: "tables", level: 1, hours: "5 h",
  blurb: "Toddler height, rounded everywhere, and light enough for them to move it themselves.",
  wood: "Birch ply and pine",
  paramDefs: [
    { k: "L", label: "Length", def: 700, min: 500, max: 1000, step: 10 },
    { k: "W", label: "Width", def: 500, min: 400, max: 700, step: 10 },
    { k: "H", label: "Height", def: 460, min: 350, max: 560, step: 10 }
  ],
  parts: p => [
    { name: "Table top", qty: 1, t: 18, w: p.W, l: p.L, stock: "panel" },
    { name: "Leg", qty: 4, t: 45, w: 45, l: p.H - 18, stock: "board" },
    { name: "Long apron", qty: 2, t: 18, w: 70, l: p.L - 160, stock: "board" },
    { name: "Short apron", qty: 2, t: 18, w: 70, l: p.W - 160, stock: "board" }
  ],
  hardware: () => [{ name: "50 mm screws", qty: 16 }, { name: "Felt pads", qty: 4 }],
  tools: { req: ["tape", "square", "handsaw", "drill", "clamps", "glue", "sanding-block", "safety-glasses"], nice: ["miter-saw", "router", "orbital", "pocket-jig"] },
  steps: [
    "Match the height to the child: seated, their elbows should rest level with the top.",
    "Round the top corners with a jar as a template and cut with a jigsaw or coping saw.",
    "Screw the aprons to the legs, then the top down from underneath.",
    "Round every edge and corner heavily — 6 mm radius minimum.",
    "Finish with something you would be happy to see chewed."
  ],
  finish: "Child-safe water-based varnish or plain walnut oil.",
  safety: "No exposed screw heads on the top surface, ever.",
  source: { label: "Kids' furniture plans — Ana White", url: "https://www.ana-white.com/" }
},

/* ─────────────────────────── TOYS ─────────────────────────── */
{
  id: "push-racer", title: "Push-along racer", cat: "toys", sub: "cars", level: 1, hours: "3 h",
  blurb: "One block of hardwood, four wheels, and a cockpit scooped out with a Forstner bit.",
  wood: "Beech, maple or birch — no splintery softwood",
  paramDefs: [
    { k: "L", label: "Body length", def: 150, min: 90, max: 260, step: 5 },
    { k: "W", label: "Body width", def: 55, min: 40, max: 80, step: 5 },
    { k: "WD", label: "Wheel diameter", def: 45, min: 30, max: 70, step: 5 }
  ],
  parts: p => [
    { name: "Car body", qty: 1, t: 45, w: p.W, l: p.L, stock: "board" },
    { name: "Wheel blank", qty: 4, t: 14, w: p.WD, l: p.WD, stock: "board" },
    { name: "Axle dowel", qty: 2, d: 8, l: p.W + 24, stock: "dowel" }
  ],
  hardware: () => [{ name: "8 mm axle pegs (optional)", qty: 4 }],
  tools: { req: ["tape", "square", "handsaw", "drill", "forstner", "rasp", "sanding-block", "clamps", "safety-glasses"],
           nice: ["bandsaw", "coping-saw", "hole-saw", "drill-press", "orbital", "spokeshave"] },
  steps: [
    "Draw the profile on the side of the blank and cut it with a coping saw or band saw.",
    "Bore the cockpit with a 30 mm Forstner bit before shaping — flat stock is easier to clamp.",
    "Drill the axle holes 9 mm (1 mm oversize) straight through, using a guide block for square.",
    "Cut the wheels with a hole saw, or buy ready-made ones and skip this step.",
    "Round everything until it feels good in a closed fist. Then round it more.",
    "Fit axles with a spot of glue on the wheel only — the axle must spin freely in the body."
  ],
  finish: "Food-safe oil or beeswax paste. Nothing with solvents.",
  safety: "Under-3s: nothing smaller than 32 mm may come loose. Test every part in a choke tube.",
  source: { label: "Toy safety sizing — EN 71 / ASTM F963 summary", url: "https://www.cpsc.gov/Business--Manufacturing/Business-Education/Toy-Safety" }
},
{
  id: "truck-trailer", title: "Truck with tipping trailer", cat: "toys", sub: "cars", level: 2, hours: "6 h",
  blurb: "A cab, a trailer that actually tips, and a dowel hitch that lets them come apart.",
  wood: "Beech or birch ply",
  paramDefs: [
    { k: "CL", label: "Cab length", def: 120, min: 80, max: 180, step: 5 },
    { k: "TL", label: "Trailer length", def: 200, min: 120, max: 320, step: 10 },
    { k: "W", label: "Width", def: 80, min: 55, max: 110, step: 5 },
    { k: "WD", label: "Wheel diameter", def: 50, min: 35, max: 70, step: 5 }
  ],
  parts: p => [
    { name: "Cab body", qty: 1, t: 45, w: p.W, l: p.CL, stock: "board" },
    { name: "Trailer base", qty: 1, t: 18, w: p.W, l: p.TL, stock: "board" },
    { name: "Trailer side", qty: 2, t: 10, w: 45, l: p.TL - 20, stock: "board" },
    { name: "Trailer end", qty: 2, t: 10, w: 45, l: p.W - 20, stock: "board" },
    { name: "Wheel blank", qty: 6, t: 14, w: p.WD, l: p.WD, stock: "board" },
    { name: "Axle dowel", qty: 3, d: 8, l: p.W + 24, stock: "dowel" },
    { name: "Hitch pin", qty: 1, d: 10, l: 40, stock: "dowel" }
  ],
  hardware: () => [{ name: "Small brass pivot screw", qty: 2 }],
  tools: { req: ["tape", "square", "handsaw", "drill", "forstner", "clamps", "glue", "sanding-block", "safety-glasses"], nice: ["bandsaw", "scroll-saw", "drill-press", "orbital"] },
  steps: [
    "Shape the cab first: cut the windscreen rake and bore the driver's seat recess.",
    "Build the trailer as a shallow open box, glued and pinned at the corners.",
    "Pivot the trailer box on two screws near its rear axle so it tips backwards.",
    "Drill the hitch socket in the cab's tail and glue the pin into the trailer tongue.",
    "Sand every edge round, then check nothing pinches a small finger at the pivot."
  ],
  finish: "Beeswax paste, or milk paint on the cab with a clear oil over it.",
  safety: "Pivoting parts create pinch points. Leave at least 12 mm clearance or 3 mm — never 5–10 mm.",
  source: { label: "Wooden toy plans — Instructables Toys", url: "https://www.instructables.com/craft/toys/" }
},
{
  id: "biplane", title: "Biplane with spinning propeller", cat: "toys", sub: "planes", level: 2, hours: "4 h",
  blurb: "Two stacked wings, four struts, and a prop on a brass washer so it really spins.",
  wood: "Beech body, birch ply wings",
  paramDefs: [
    { k: "FL", label: "Fuselage length", def: 200, min: 120, max: 300, step: 10 },
    { k: "WS", label: "Wingspan", def: 240, min: 150, max: 360, step: 10 },
    { k: "WC", label: "Wing chord", def: 60, min: 40, max: 90, step: 5 }
  ],
  parts: p => [
    { name: "Fuselage", qty: 1, t: 40, w: 45, l: p.FL, stock: "board" },
    { name: "Wing", qty: 2, t: 10, w: p.WC, l: p.WS, stock: "board" },
    { name: "Wing strut", qty: 4, d: 10, l: 55, stock: "dowel" },
    { name: "Tailplane", qty: 1, t: 8, w: 45, l: p.WS * 0.4, stock: "board" },
    { name: "Tail fin", qty: 1, t: 8, w: 45, l: 55, stock: "board" },
    { name: "Propeller", qty: 1, t: 10, w: 25, l: p.WS * 0.3, stock: "board" },
    { name: "Wheel blank", qty: 2, t: 12, w: 40, l: 40, stock: "board" },
    { name: "Axle dowel", qty: 1, d: 8, l: 90, stock: "dowel" }
  ],
  hardware: () => [{ name: "Brass washer", qty: 2 }, { name: "30 mm round-head screw", qty: 1 }],
  tools: { req: ["tape", "square", "coping-saw", "drill", "rasp", "clamps", "glue", "sanding-block", "safety-glasses"], nice: ["bandsaw", "scroll-saw", "drill-press", "spokeshave", "orbital"] },
  steps: [
    "Shape the fuselage: round the top, leave the bottom flat until the wheels are on.",
    "Cut both wings together so they match, then round the leading edges.",
    "Glue the lower wing into a shallow notch in the fuselage; dry-fit the struts before gluing.",
    "Twist the propeller blades slightly with a rasp — a real pitch makes it look alive.",
    "Mount the prop with a washer behind it so it spins without binding.",
    "Sand to 240 and check the whole plane for splinters with bare hands."
  ],
  finish: "Clear beeswax; paint roundels with child-safe acrylic if you like.",
  safety: "The propeller screw must be countersunk or domed — never a sharp protruding head.",
  source: { label: "Toy plane patterns — Toys and Joys style plans", url: "https://www.toysandjoys.com/" }
},
{
  id: "glider", title: "Chuck glider", cat: "toys", sub: "planes", level: 1, hours: "1 h",
  blurb: "Balsa-thin ply, one slot, one nose weight. Throw it and it actually flies.",
  wood: "3 mm birch ply or balsa",
  paramDefs: [
    { k: "FL", label: "Fuselage length", def: 300, min: 180, max: 420, step: 10 },
    { k: "WS", label: "Wingspan", def: 320, min: 200, max: 450, step: 10 }
  ],
  parts: p => [
    { name: "Fuselage", qty: 1, t: 6, w: 40, l: p.FL, stock: "board" },
    { name: "Wing", qty: 1, t: 3, w: 55, l: p.WS, stock: "board" },
    { name: "Tailplane", qty: 1, t: 3, w: 40, l: p.WS * 0.35, stock: "board" },
    { name: "Fin", qty: 1, t: 3, w: 40, l: 60, stock: "board" }
  ],
  hardware: () => [{ name: "Coin or nail for nose weight", qty: 1 }],
  tools: { req: ["tape", "square", "coping-saw", "sanding-block", "glue", "safety-glasses"], nice: ["scroll-saw", "jigsaw", "spring-clamps"] },
  steps: [
    "Cut the fuselage and saw two slots across it for the wing and tailplane.",
    "Sand the wing to a rounded leading edge and a thin trailing edge.",
    "Glue the wing in with a slight upward angle at the tips (about 15 mm of dihedral each side).",
    "Balance the finished glider on two fingers a third of the way back from the wing's leading edge.",
    "Add nose weight until it balances there, then test-glide over grass and trim."
  ],
  finish: "Leave it bare — every gram counts.",
  safety: "Blunt the nose. Round it, or glue a felt pad on the tip.",
  source: { label: "Free-flight glider basics — AMA (Academy of Model Aeronautics)", url: "https://www.modelaircraft.org/" }
},
{
  id: "stacking-animal", title: "Stacking elephant puzzle", cat: "toys", sub: "animals", level: 2, hours: "3 h",
  blurb: "One silhouette sliced into interlocking layers that stack back into an elephant.",
  wood: "18 mm beech or birch ply",
  paramDefs: [
    { k: "H", label: "Figure height", def: 180, min: 100, max: 280, step: 10 },
    { k: "T", label: "Slice thickness", def: 18, min: 12, max: 25, step: 1 },
    { k: "N", label: "Number of pieces", def: 5, min: 3, max: 8, step: 1 }
  ],
  parts: p => [
    { name: "Puzzle blank", qty: 1, t: p.T, w: p.H, l: p.H * 1.2, stock: "board" },
    { name: "Base plate", qty: 1, t: p.T, w: 70, l: p.H, stock: "board" },
    { name: "Locating dowel", qty: p.N - 1, d: 6, l: 20, stock: "dowel" }
  ],
  hardware: () => [],
  tools: { req: ["tape", "compass", "coping-saw", "drill", "rasp", "sanding-block", "glue", "safety-glasses"], nice: ["scroll-saw", "bandsaw", "orbital", "spring-clamps"] },
  steps: [
    "Draw the elephant outline full size on paper and spray-glue it to the blank.",
    "Cut the outside profile first, keeping the saw dead vertical.",
    "Slice the interior into gently curved pieces — wavy lines lock, straight lines slide apart.",
    "Sand every cut face; a scroll-saw kerf leaves fuzz that makes pieces stick.",
    "Test the stack. Anything that jams gets one more pass with sandpaper, not a saw.",
    "Round all outer edges so the pieces are pleasant to hold."
  ],
  finish: "Non-toxic oil; colour-code the layers with food-grade wood stains if you like.",
  safety: "Pieces under 32 mm are a choking hazard for under-3s. Keep every slice larger.",
  source: { label: "Scroll saw patterns — Scroll Saw Woodworking archive", url: "https://scrollsawer.com/" }
},
{
  id: "animal-set", title: "Animal silhouette set", cat: "toys", sub: "animals", level: 1, hours: "4 h",
  blurb: "A herd cut from one board — flat animals that stand up and travel well.",
  wood: "20 mm beech, lime or maple",
  paramDefs: [
    { k: "H", label: "Tallest animal", def: 120, min: 60, max: 200, step: 10 },
    { k: "N", label: "Number of animals", def: 8, min: 3, max: 16, step: 1 },
    { k: "T", label: "Thickness", def: 20, min: 12, max: 30, step: 1 }
  ],
  parts: p => [
    { name: "Animal blank board", qty: 1, t: p.T, w: p.H + 20, l: (p.H + 30) * Math.ceil(p.N / 2), stock: "board" }
  ],
  hardware: () => [],
  tools: { req: ["compass", "coping-saw", "rasp", "sanding-block", "clamps", "safety-glasses"], nice: ["scroll-saw", "bandsaw", "spokeshave", "orbital", "drill"] },
  steps: [
    "Sketch simple, chunky silhouettes — thin legs snap, so keep every limb at least 15 mm wide.",
    "Give every animal a flat belly line so it can stand unaided.",
    "Cut the outlines, then round the faces with a rasp so they read as solid bodies.",
    "Sand progressively to 240; these get handled and mouthed constantly.",
    "Burn or carve an eye rather than gluing anything on."
  ],
  finish: "Beeswax and oil only. No paint that can chip off.",
  safety: "No glued-on parts of any kind for under-3s.",
  source: { label: "Waldorf-style toy inspiration — Etsy pattern makers", url: "https://www.etsy.com/search?q=wooden%20animal%20pattern" }
},
{
  id: "object-permanence", title: "Object permanence box", cat: "toys", sub: "montessori", level: 1, hours: "2 h",
  blurb: "A ball goes in the top, disappears, then reappears in the tray. The first great lesson in cause and effect.",
  wood: "12 mm birch ply",
  paramDefs: [
    { k: "S", label: "Box size", def: 140, min: 110, max: 200, step: 10 },
    { k: "BD", label: "Ball diameter", def: 50, min: 35, max: 70, step: 5 }
  ],
  parts: p => [
    { name: "Box side", qty: 2, t: 12, w: p.S, l: p.S, stock: "panel" },
    { name: "Box top", qty: 1, t: 12, w: p.S, l: p.S - 24, stock: "panel" },
    { name: "Box back", qty: 1, t: 12, w: p.S - 24, l: p.S - 24, stock: "panel" },
    { name: "Base / tray", qty: 1, t: 12, w: p.S + 90, l: p.S, stock: "panel" },
    { name: "Tray lip", qty: 3, t: 12, w: 25, l: p.S, stock: "panel" },
    { name: "Ball (or buy one)", qty: 1, d: p.BD, l: p.BD, stock: "dowel" }
  ],
  hardware: () => [],
  tools: { req: ["tape", "square", "handsaw", "drill", "hole-saw", "glue", "clamps", "sanding-block", "safety-glasses"], nice: ["forstner", "jigsaw", "orbital", "brad-nailer"] },
  steps: [
    "Bore the entry hole 6 mm larger than the ball, centred in the top panel.",
    "Cut the front opening so the ball rolls out onto the tray without a lip to climb.",
    "Slope the box floor about 8° towards the opening — that slope is what makes it work.",
    "Glue the box up, then glue the box onto the tray base.",
    "Sand the entry hole smooth so small hands don't catch on it."
  ],
  finish: "Bare wood or a single coat of walnut oil.",
  safety: "The ball must be at least 45 mm across for under-3s.",
  source: { label: "Montessori materials guide — Montessori Album", url: "https://www.montessorialbum.com/" }
},
{
  id: "peg-box", title: "Imbucare peg board", cat: "toys", sub: "montessori", level: 1, hours: "2 h",
  blurb: "Three pegs, three holes, one skill: matching size to opening.",
  wood: "18 mm beech, hardwood dowel",
  paramDefs: [
    { k: "W", label: "Board width", def: 300, min: 200, max: 450, step: 10 },
    { k: "D", label: "Board depth", def: 120, min: 90, max: 180, step: 10 },
    { k: "N", label: "Number of pegs", def: 3, min: 2, max: 6, step: 1 }
  ],
  parts: p => [
    { name: "Base board", qty: 1, t: 18, w: p.D, l: p.W, stock: "board" },
    { name: "Peg (large)", qty: Math.ceil(p.N / 3), d: 40, l: 70, stock: "dowel" },
    { name: "Peg (medium)", qty: Math.ceil(p.N / 3), d: 32, l: 70, stock: "dowel" },
    { name: "Peg (small)", qty: p.N - 2 * Math.ceil(p.N / 3), d: 25, l: 70, stock: "dowel" }
  ],
  hardware: () => [],
  tools: { req: ["tape", "square", "drill", "forstner", "sanding-block", "clamps", "safety-glasses"], nice: ["drill-press", "lathe", "orbital", "hole-saw"] },
  steps: [
    "Bore each socket 1.5 mm larger than its peg so the fit is satisfying, not frustrating.",
    "Drill 4 mm deeper than half the peg length; the peg should stand proud enough to grip.",
    "Chamfer the top of every socket slightly — it guides the peg in.",
    "Round the peg tops fully. A flat-topped dowel looks unfinished and feels it.",
    "Sand the board's edges to a 5 mm radius."
  ],
  finish: "Nothing, or a rub of walnut oil.",
  safety: "Pegs must be too big to swallow: 32 mm diameter minimum, 50 mm long minimum.",
  source: { label: "Practical life materials — Montessori Album", url: "https://www.montessorialbum.com/" }
},
{
  id: "pikler", title: "Climbing triangle", cat: "toys", sub: "montessori", level: 3, hours: "1 day",
  blurb: "A folding climbing frame for toddlers. The hinge and the rung spacing are the safety-critical parts.",
  wood: "Clear pine or beech, no knots",
  paramDefs: [
    { k: "H", label: "Height (open)", def: 700, min: 500, max: 900, step: 10 },
    { k: "W", label: "Width", def: 600, min: 450, max: 800, step: 10 },
    { k: "N", label: "Rungs per side", def: 8, min: 5, max: 12, step: 1 }
  ],
  parts: p => [
    { name: "Side rail", qty: 4, t: 30, w: 70, l: p.H * 1.15, stock: "board" },
    { name: "Rung", qty: p.N * 2, d: 28, l: p.W, stock: "dowel" },
    { name: "Hinge block", qty: 2, t: 30, w: 70, l: 120, stock: "board" }
  ],
  hardware: () => [
    { name: "Long steel rod or bolt hinge (10 mm)", qty: 2 },
    { name: "Locking nuts + washers", qty: 8 },
    { name: "Wood glue", qty: 1 }
  ],
  tools: { req: ["tape", "square", "handsaw", "drill", "forstner", "clamps", "glue", "orbital", "safety-glasses"], nice: ["drill-press", "miter-saw", "router", "bandsaw"] },
  steps: [
    "Choose knot-free stock. A knot in a side rail is a break waiting to happen.",
    "Lay both rails of a side together and mark all rung centres at once — spacing must be identical.",
    "Bore 28 mm sockets 12 mm deep. A drill press or guide block keeps them square.",
    "Glue the rungs in and clamp each side flat; check for twist on a flat floor.",
    "Fit the hinge so the two sides open to a stable angle and cannot over-open.",
    "Round every edge to a 6 mm radius and sand to 240 grit — no splinters anywhere."
  ],
  finish: "Water-based child-safe varnish so it wipes clean.",
  safety: "Rung gaps must not trap a head or limb: keep clear spacing under 90 mm or over 230 mm. Always supervise. Never place it on a hard floor without a mat.",
  source: { label: "Playground spacing standards — ASTM F1148 overview / CPSC", url: "https://www.cpsc.gov/" }
},
{
  id: "rainbow-stacker", title: "Rainbow arch stacker", cat: "toys", sub: "montessori", level: 3, hours: "6 h",
  blurb: "Nested arches cut from one thick blank — a bridge, a tunnel, a puzzle, all at once.",
  wood: "One 45 mm block of lime, beech or poplar",
  paramDefs: [
    { k: "R", label: "Outer radius", def: 160, min: 90, max: 240, step: 10 },
    { k: "N", label: "Number of arches", def: 6, min: 3, max: 9, step: 1 },
    { k: "T", label: "Blank thickness", def: 45, min: 25, max: 60, step: 5 }
  ],
  parts: p => [
    { name: "Arch blank", qty: 1, t: p.T, w: p.R + 20, l: p.R * 2 + 40, stock: "board" }
  ],
  hardware: () => [],
  tools: { req: ["compass", "coping-saw", "rasp", "sanding-block", "clamps", "safety-glasses"], nice: ["bandsaw", "scroll-saw", "spokeshave", "orbital", "jigsaw"] },
  steps: [
    "Set the compass and draw all the arcs from one centre point on the blank.",
    "Space the arcs by the width of an arch plus one saw kerf plus 1 mm of sanding.",
    "Cut from the outside inwards; each cut frees one arch.",
    "Sand every face — nested pieces are unforgiving about fuzz.",
    "Test the nest. Sand only the inner faces of anything tight.",
    "Round all edges heavily; these get carried in one hand."
  ],
  finish: "Diluted child-safe stains, or leave the natural colour and just wax.",
  safety: "Cut slowly on a band saw — the workpiece wants to roll as the arc closes.",
  source: { label: "Grimm's-style stacker techniques — woodworking forums", url: "https://www.lumberjocks.com/" }
},
{
  id: "burr-puzzle", title: "Six-piece burr puzzle", cat: "toys", sub: "puzzles", level: 4, hours: "5 h",
  blurb: "Six notched sticks that lock into a knot. It stands or falls on your accuracy.",
  wood: "Hard maple or beech, straight-grained",
  paramDefs: [
    { k: "S", label: "Stick section", def: 20, min: 15, max: 30, step: 1 },
    { k: "L", label: "Stick length", def: 60, min: 45, max: 90, step: 5 }
  ],
  parts: p => [
    { name: "Puzzle stick", qty: 6, t: p.S, w: p.S, l: p.L, stock: "board" },
    { name: "Spare stick (you will need it)", qty: 2, t: p.S, w: p.S, l: p.L, stock: "board" }
  ],
  hardware: () => [],
  tools: { req: ["tape", "square", "marking-gauge", "pullsaw", "chisels", "mallet", "clamps", "sanding-block", "safety-glasses"], nice: ["table-saw", "router", "bench-vise", "block-plane"] },
  steps: [
    "Mill all six sticks to exactly the same section. Everything depends on this.",
    "Mark every notch from the same reference face and reference end.",
    "Saw the notch walls first, then pare the waste out with a chisel.",
    "Aim for a fit that slides with light hand pressure — no hammering.",
    "Chamfer every edge lightly; a burr with crisp arrises is painful to solve.",
    "Assemble in the correct order: it goes together as three pairs, then closes with the key piece."
  ],
  finish: "Wax only. Any film finish adds thickness and jams the puzzle.",
  safety: "Small parts and sharp chisels — clamp the work, never hold it.",
  source: { label: "Burr puzzle theory — Rob's Puzzle Page", url: "https://www.robspuzzlepage.com/interlocking.htm" }
},
{
  id: "marble-run", title: "Marble run tower", cat: "toys", sub: "puzzles", level: 3, hours: "1 day",
  blurb: "A tower of angled ramps. Getting the marble to make every turn is the real project.",
  wood: "12 mm birch ply, 18 mm base",
  paramDefs: [
    { k: "H", label: "Tower height", def: 600, min: 300, max: 900, step: 20 },
    { k: "W", label: "Tower width", def: 220, min: 150, max: 350, step: 10 },
    { k: "N", label: "Number of ramps", def: 6, min: 3, max: 12, step: 1 }
  ],
  parts: p => [
    { name: "Tower side", qty: 2, t: 12, w: 150, l: p.H, stock: "panel" },
    { name: "Ramp", qty: p.N, t: 12, w: 90, l: p.W - 24, stock: "panel" },
    { name: "Ramp rail", qty: p.N * 2, t: 8, w: 12, l: p.W - 24, stock: "board" },
    { name: "Base", qty: 1, t: 18, w: 200, l: p.W + 80, stock: "panel" },
    { name: "Catch tray", qty: 1, t: 12, w: 90, l: p.W, stock: "panel" }
  ],
  hardware: () => [{ name: "16 mm marbles", qty: 10 }, { name: "30 mm screws", qty: 12 }],
  tools: { req: ["tape", "square", "bevel", "jigsaw", "drill", "glue", "clamps", "sanding-block", "safety-glasses"], nice: ["table-saw", "miter-saw", "router", "brad-nailer", "orbital"] },
  steps: [
    "Mark ramp positions on both sides at once, alternating the slope direction down the tower.",
    "A 7–10° slope is the sweet spot: steeper and the marble jumps the rail, shallower and it stalls.",
    "Glue the guide rails to each ramp before assembly — impossible afterwards.",
    "Dry-assemble with clamps and test with a real marble before any glue.",
    "Cut a drop notch at the low end of each ramp, offset so the marble lands mid-ramp below.",
    "Screw the tower to a wide base so it cannot topple."
  ],
  finish: "Clear varnish inside the ramps — smooth ramps run faster.",
  safety: "Marbles are a choking hazard. This is a 4+ toy, and store the marbles separately.",
  source: { label: "Marble machine builds — Instructables", url: "https://www.instructables.com/howto/marble+run/" }
},
{
  id: "tangram", title: "Tangram set with tray", cat: "toys", sub: "puzzles", level: 1, hours: "2 h",
  blurb: "Seven pieces from one square. The oldest thinking toy there is, and the fastest to build.",
  wood: "12 mm hardwood or ply",
  paramDefs: [
    { k: "S", label: "Square size", def: 200, min: 120, max: 320, step: 10 },
    { k: "T", label: "Thickness", def: 12, min: 8, max: 20, step: 1 }
  ],
  parts: p => [
    { name: "Tangram blank (cut into 7)", qty: 1, t: p.T, w: p.S, l: p.S, stock: "board" },
    { name: "Tray base", qty: 1, t: 6, w: p.S + 24, l: p.S + 24, stock: "panel" },
    { name: "Tray side", qty: 4, t: p.T, w: 20, l: p.S + 24, stock: "board" }
  ],
  hardware: () => [],
  tools: { req: ["tape", "square", "bevel", "handsaw", "sanding-block", "glue", "clamps", "safety-glasses"], nice: ["miter-saw", "table-saw", "bandsaw", "orbital"] },
  steps: [
    "Draw the classic seven-piece layout on the square: two large triangles, one medium, two small, a square and a rhomboid.",
    "Cut the long diagonals first while the blank is still big and easy to hold.",
    "Sand each piece to the line — the set only works if the angles are true.",
    "Build the tray 2 mm oversize so the pieces drop in without fighting.",
    "Optionally stain each piece a different tone; it makes solutions easier to see."
  ],
  finish: "Oil, or leave bare so they can be pencilled on.",
  safety: "Sharp points on the small triangles — round the tips very slightly.",
  source: { label: "Tangram history and puzzles — Wikipedia", url: "https://en.wikipedia.org/wiki/Tangram" }
},
{
  id: "tilt-maze", title: "Tilting ball maze", cat: "toys", sub: "puzzles", level: 2, hours: "5 h",
  blurb: "A tray on two axes, a ball, and holes to avoid. The classic patience machine.",
  wood: "9 mm ply tray, hardwood frame",
  paramDefs: [
    { k: "S", label: "Maze size", def: 250, min: 160, max: 350, step: 10 },
    { k: "BD", label: "Ball diameter", def: 16, min: 10, max: 25, step: 1 }
  ],
  parts: p => [
    { name: "Maze floor", qty: 1, t: 9, w: p.S, l: p.S, stock: "panel" },
    { name: "Maze wall stock", qty: 1, t: 9, w: 18, l: p.S * 6, stock: "panel" },
    { name: "Outer frame side", qty: 4, t: 18, w: 40, l: p.S + 80, stock: "board" },
    { name: "Gimbal ring side", qty: 4, t: 12, w: 30, l: p.S + 40, stock: "board" }
  ],
  hardware: p => [
    { name: "M4 pivot bolts", qty: 4 },
    { name: "Steel ball " + p.BD + " mm", qty: 2 },
    { name: "Small knobs", qty: 2 }
  ],
  tools: { req: ["tape", "square", "handsaw", "drill", "forstner", "glue", "clamps", "sanding-block", "safety-glasses"], nice: ["scroll-saw", "drill-press", "miter-saw", "brad-nailer"] },
  steps: [
    "Design the maze on paper at full size, then transfer it to the floor panel.",
    "Bore the trap holes 3 mm larger than the ball before gluing any walls down.",
    "Glue the wall strips on edge; masking tape makes an excellent clamp here.",
    "Build the outer frame and the inner gimbal ring, pivoting each on two bolts at 90° to the other.",
    "Balance the tray so it returns roughly level when you let go."
  ],
  finish: "Varnish the floor before fitting walls — a slick floor rolls better.",
  safety: "Steel balls are a choking hazard for small children.",
  source: { label: "Labyrinth build guides — Instructables", url: "https://www.instructables.com/howto/labyrinth/" }
},

/* ─────────────────────────── OUTDOOR ─────────────────────────── */
{
  id: "planter", title: "Tapered planter box", cat: "outdoor", level: 1, hours: "4 h",
  blurb: "Four sloped sides, a drained bottom, and battens that keep the wood off wet ground.",
  wood: "Cedar, larch or treated pine",
  paramDefs: [
    { k: "TW", label: "Top width", def: 500, min: 250, max: 900, step: 10 },
    { k: "H", label: "Height", def: 400, min: 200, max: 700, step: 10 },
    { k: "BW", label: "Bottom width", def: 380, min: 200, max: 800, step: 10 }
  ],
  parts: p => [
    { name: "Side board", qty: 8, t: 20, w: r(p.H / 2), l: p.TW, stock: "board" },
    { name: "Corner post", qty: 4, t: 45, w: 45, l: p.H, stock: "board" },
    { name: "Bottom slat", qty: 4, t: 20, w: r(p.BW / 4) - 5, l: p.BW, stock: "board" },
    { name: "Ground batten", qty: 2, t: 30, w: 45, l: p.BW, stock: "board" },
    { name: "Top cap", qty: 4, t: 20, w: 60, l: p.TW + 60, stock: "board" }
  ],
  hardware: () => [{ name: "Stainless 50 mm screws", qty: 40 }, { name: "Landscape fabric", qty: 1 }],
  tools: { req: ["tape", "square", "bevel", "handsaw", "drill", "sanding-block", "safety-glasses"], nice: ["miter-saw", "circular-saw", "orbital"] },
  steps: [
    "Set the bevel to the taper angle and cut every side board's edges to match.",
    "Screw the side boards to the corner posts, working around the box.",
    "Space the bottom slats 8 mm apart — drainage matters more than looks here.",
    "Mitre the top cap for a finished edge, or butt-joint it and stop worrying.",
    "Line the inside with landscape fabric, not plastic. Wood needs to breathe."
  ],
  finish: "Leave cedar bare to silver, or use an exterior oil once a year.",
  safety: "Stainless or hot-dip screws only. Plain steel bleeds black stains within a month.",
  source: { label: "Outdoor wood durability — Wood Database", url: "https://www.wood-database.com/" }
},
{
  id: "garden-bench", title: "Garden bench", cat: "outdoor", level: 2, hours: "1 day",
  blurb: "Slatted seat, splayed back, built entirely from square-section stock.",
  wood: "Cedar, oak or treated softwood",
  paramDefs: [
    { k: "L", label: "Bench length", def: 1400, min: 900, max: 2000, step: 10 },
    { k: "SH", label: "Seat height", def: 440, min: 380, max: 500, step: 5 },
    { k: "D", label: "Seat depth", def: 450, min: 380, max: 550, step: 10 }
  ],
  parts: p => [
    { name: "Front leg", qty: 2, t: 45, w: 70, l: p.SH, stock: "board" },
    { name: "Back leg (angled)", qty: 2, t: 45, w: 90, l: p.SH + 450, stock: "board" },
    { name: "Side rail", qty: 2, t: 30, w: 70, l: p.D, stock: "board" },
    { name: "Front & back rail", qty: 2, t: 30, w: 70, l: p.L - 140, stock: "board" },
    { name: "Seat slat", qty: 5, t: 22, w: 80, l: p.L, stock: "board" },
    { name: "Back slat", qty: 3, t: 22, w: 80, l: p.L - 140, stock: "board" },
    { name: "Armrest", qty: 2, t: 30, w: 90, l: p.D + 40, stock: "board" }
  ],
  hardware: () => [{ name: "Stainless 70 mm screws", qty: 40 }, { name: "Stainless 50 mm screws", qty: 30 }],
  tools: { req: ["tape", "square", "bevel", "handsaw", "drill", "clamps", "orbital", "safety-glasses"], nice: ["miter-saw", "circular-saw", "router", "pocket-jig"] },
  steps: [
    "Cut the back legs with a 12° kick — that angle is what makes it comfortable.",
    "Build the two end frames first, then join them front and back.",
    "Space the seat slats 8 mm apart with an offcut as a gauge.",
    "Pre-drill everything: outdoor stock splits, and the bench lives or dies on its fasteners.",
    "Round the front seat edge well — it's what the back of your knees will feel."
  ],
  finish: "Exterior oil, or leave hardwood to weather.",
  safety: "Sit-test before finishing; a bench that racks needs a diagonal brace under the seat.",
  source: { label: "Outdoor furniture plans — Ana White", url: "https://www.ana-white.com/" }
},
{
  id: "birdhouse", title: "Birdhouse", cat: "outdoor", level: 1, hours: "2 h",
  blurb: "One board, six cuts, and an entry hole sized for the bird you actually want.",
  wood: "Untreated cedar or pine, 18 mm",
  paramDefs: [
    { k: "FW", label: "Floor width", def: 120, min: 90, max: 180, step: 10 },
    { k: "H", label: "Front height", def: 200, min: 150, max: 300, step: 10 },
    { k: "HD", label: "Entry hole diameter", def: 32, min: 25, max: 45, step: 1 }
  ],
  parts: p => [
    { name: "Front", qty: 1, t: 18, w: p.FW, l: p.H, stock: "board" },
    { name: "Back (extended for mounting)", qty: 1, t: 18, w: p.FW, l: p.H + 150, stock: "board" },
    { name: "Side (sloped)", qty: 2, t: 18, w: p.FW, l: p.H + 40, stock: "board" },
    { name: "Floor", qty: 1, t: 18, w: p.FW - 36, l: p.FW - 36, stock: "board" },
    { name: "Roof", qty: 1, t: 18, w: p.FW + 60, l: p.FW + 40, stock: "board" }
  ],
  hardware: () => [{ name: "Stainless 40 mm screws", qty: 12 }, { name: "Brass pivot screw (cleaning door)", qty: 2 }],
  tools: { req: ["tape", "square", "handsaw", "drill", "hole-saw", "safety-glasses"], nice: ["forstner", "miter-saw", "jigsaw", "orbital"] },
  steps: [
    "Look up the right hole diameter for your local species before you drill — it excludes predators.",
    "Cut the side pieces with a slope so the roof sheds water forwards.",
    "Drill four 6 mm drain holes in the floor and two ventilation holes high on each side.",
    "Screw one side on a single pivot screw so it swings open for cleaning.",
    "Do not add a perch. It only helps predators.",
    "Leave the inside rough, or saw shallow grooves below the hole so chicks can climb out."
  ],
  finish: "Nothing inside. Outside can take a plain exterior oil.",
  safety: "Never use treated timber for a nest box.",
  source: { label: "Nest box dimensions by species — RSPB / NestWatch", url: "https://nestwatch.org/learn/all-about-birdhouses/" }
},

/* ─────────────────────────── SHOP ─────────────────────────── */
{
  id: "bench-hook", title: "Bench hook", cat: "shop", level: 1, hours: "45 min",
  blurb: "The first thing to build with a hand saw. It makes every crosscut after it easier.",
  wood: "18 mm ply and hardwood scrap",
  paramDefs: [
    { k: "L", label: "Length", def: 300, min: 200, max: 450, step: 10 },
    { k: "W", label: "Width", def: 200, min: 150, max: 300, step: 10 }
  ],
  parts: p => [
    { name: "Base", qty: 1, t: 18, w: p.W, l: p.L, stock: "panel" },
    { name: "Top stop", qty: 1, t: 20, w: 40, l: p.W - 40, stock: "board" },
    { name: "Bench hook (underside)", qty: 1, t: 20, w: 40, l: p.W - 40, stock: "board" }
  ],
  hardware: () => [{ name: "40 mm screws", qty: 6 }],
  tools: { req: ["tape", "square", "handsaw", "drill", "glue", "clamps", "safety-glasses"], nice: ["miter-saw", "orbital"] },
  steps: [
    "Cut the base square — it will be your reference for years.",
    "Glue and screw the top stop flush with one end, the under-hook flush with the other.",
    "Keep the screws out of the saw path near the stop.",
    "Saw a 90° kerf into the stop as your first cut, then a 45° kerf beside it.",
    "Hook it over your bench edge and stop clamping small crosscuts forever."
  ],
  finish: "None. Shop jigs stay bare.",
  safety: "Countersink the screws deeply — a saw tooth meeting a screw head is a bad day.",
  source: { label: "Hand tool basics — Paul Sellers (free videos)", url: "https://paulsellers.com/" }
},
{
  id: "sawhorse", title: "Stacking sawhorse pair", cat: "shop", level: 1, hours: "3 h",
  blurb: "Two horses that nest for storage and take a full sheet across them.",
  wood: "Construction pine",
  paramDefs: [
    { k: "H", label: "Height", def: 700, min: 500, max: 900, step: 10 },
    { k: "L", label: "Beam length", def: 900, min: 600, max: 1200, step: 10 }
  ],
  parts: p => [
    { name: "Top beam", qty: 2, t: 45, w: 90, l: p.L, stock: "board" },
    { name: "Leg", qty: 8, t: 45, w: 70, l: p.H, stock: "board" },
    { name: "Leg gusset", qty: 4, t: 18, w: 200, l: 300, stock: "panel" },
    { name: "Side rail", qty: 4, t: 20, w: 90, l: p.L - 200, stock: "board" }
  ],
  hardware: () => [{ name: "60 mm screws", qty: 48 }],
  tools: { req: ["tape", "square", "bevel", "handsaw", "drill", "safety-glasses"], nice: ["miter-saw", "circular-saw", "clamps"] },
  steps: [
    "Splay the legs about 15° in both directions — that's what makes a horse stable.",
    "Cut the leg tops to a compound angle, or simply screw them to the beam sides and gusset them.",
    "Make the second horse 30 mm narrower so the pair nests when stacked.",
    "Screw the side rails on to stop racking; they double as a shelf.",
    "Cut the leg bottoms in place: stand it on flat ground and scribe."
  ],
  finish: "None. These are meant to get chewed by saw blades.",
  safety: "Test with your full weight before trusting a horse with a sheet of ply.",
  source: { label: "Sawhorse designs — Family Handyman", url: "https://www.familyhandyman.com/" }
}
];

window.PROJECT_BY_ID = {};
window.PROJECTS.forEach(function (p) { window.PROJECT_BY_ID[p.id] = p; });
