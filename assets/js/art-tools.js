/* Carpenter — illustrated tools.
   Original artwork, drawn in the visual language of modern site tools:
   teal composite bodies, black grips, steel blades, brass and beech.
   48 × 48 viewBox. Colour is what makes a pegboard readable at a glance. */

(function () {
  var C = {
    body: '#12A19A', bodyDk: '#0C7A75', bodyLt: '#3FBDB6',
    dark: '#2E2A26', grip: '#413B35',
    steel: '#C6CDD3', steelDk: '#939BA3', steelLt: '#E6EAED',
    wood: '#C68B4C', woodDk: '#9A6634', woodLt: '#E0B382',
    brass: '#C8952E', red: '#C24A2C', yellow: '#E9B32A',
    white: '#F6F1E6', blue: '#3E6E9E'
  };

  /* Each entry is the inner markup of a 48x48 SVG. */
  var A = {

    /* ---- measuring & marking ---- */
    tape: '<rect x="6" y="16" width="26" height="22" rx="6" fill="'+C.yellow+'"/><rect x="6" y="16" width="26" height="22" rx="6" fill="none" stroke="'+C.dark+'" stroke-width="1.5"/><circle cx="19" cy="27" r="7" fill="'+C.dark+'" opacity=".25"/><circle cx="19" cy="27" r="3" fill="'+C.dark+'"/><path d="M32 22h12v5H32z" fill="'+C.steelLt+'" stroke="'+C.steelDk+'" stroke-width="1"/><path d="M35 22v5M38 22v3M41 22v5" stroke="'+C.steelDk+'"/>',
    square: '<path d="M8 10h7v28h25v7H8z" fill="'+C.steel+'" stroke="'+C.steelDk+'" stroke-width="1.2"/><path d="M8 10h7v22H8z" fill="'+C.brass+'"/><path d="M20 38v7M26 38v7M32 38v7" stroke="'+C.steelDk+'"/>',
    straightedge: '<rect x="4" y="20" width="40" height="9" rx="1.5" fill="'+C.steel+'" stroke="'+C.steelDk+'" stroke-width="1.2"/><path d="M10 20v5M16 20v7M22 20v5M28 20v7M34 20v5M40 20v7" stroke="'+C.steelDk+'"/>',
    'marking-gauge': '<rect x="6" y="18" width="14" height="14" rx="2" fill="'+C.wood+'" stroke="'+C.woodDk+'" stroke-width="1.2"/><rect x="20" y="22" width="22" height="6" rx="1" fill="'+C.woodLt+'" stroke="'+C.woodDk+'" stroke-width="1.2"/><circle cx="41" cy="25" r="2.4" fill="'+C.steel+'" stroke="'+C.steelDk+'"/><path d="M13 14v4" stroke="'+C.brass+'" stroke-width="3"/>',
    bevel: '<path d="M6 36h30v6H6z" fill="'+C.wood+'" stroke="'+C.woodDk+'" stroke-width="1.2"/><path d="m12 36 24-22 4 4-20 18z" fill="'+C.steel+'" stroke="'+C.steelDk+'" stroke-width="1.2"/><circle cx="14" cy="37" r="2" fill="'+C.brass+'"/>',
    compass: '<path d="M24 8 14 40M24 8l10 32" stroke="'+C.steel+'" stroke-width="4" stroke-linecap="round"/><path d="M24 8 14 40M24 8l10 32" stroke="'+C.steelDk+'" stroke-width="1"/><circle cx="24" cy="8" r="4" fill="'+C.brass+'"/><path d="M17 30h14" stroke="'+C.steelDk+'" stroke-width="2"/>',

    /* ---- hand saws ---- */
    handsaw: '<path d="M6 12h24l12 12-12 8H6z" fill="'+C.steelLt+'" stroke="'+C.steelDk+'" stroke-width="1.2"/><path d="M6 32h26" stroke="'+C.steelDk+'"/><path d="m8 32 2 4 2-4 2 4 2-4 2 4 2-4 2 4 2-4 2 4 2-4 2 4 2-4" fill="'+C.steel+'" stroke="'+C.steelDk+'"/><path d="M2 10c6-2 8 0 8 6s-4 8-8 6z" fill="'+C.wood+'" stroke="'+C.woodDk+'" stroke-width="1.2"/>',
    pullsaw: '<rect x="4" y="22" width="18" height="6" rx="2" fill="'+C.wood+'" stroke="'+C.woodDk+'" stroke-width="1.2"/><path d="M8 23h12M8 26h12" stroke="'+C.woodDk+'" opacity=".6"/><path d="M22 22h22v5H22z" fill="'+C.steelLt+'" stroke="'+C.steelDk+'" stroke-width="1"/><path d="m24 27 1.5 3 1.5-3 1.5 3 1.5-3 1.5 3 1.5-3 1.5 3 1.5-3 1.5 3 1.5-3 1.5 3 1.5-3" stroke="'+C.steelDk+'" fill="none"/>',
    'coping-saw': '<path d="M12 8v32M12 8h22M12 40h22" stroke="'+C.steel+'" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M34 8v32" stroke="'+C.steelDk+'" stroke-width="1.5"/><path d="M34 24h10" stroke="'+C.steelDk+'" stroke-width="2"/><rect x="4" y="20" width="9" height="8" rx="3" fill="'+C.wood+'" stroke="'+C.woodDk+'" stroke-width="1.2"/>',
    'miter-box': '<path d="M6 20h36v18H6z" fill="'+C.wood+'" stroke="'+C.woodDk+'" stroke-width="1.4"/><path d="M6 20h36v5H6z" fill="'+C.woodLt+'"/><path d="M14 20 8 12M30 20l8-8M24 20v18" stroke="'+C.woodDk+'" stroke-width="1.6"/><path d="M12 12h4v12h-4z" fill="'+C.steel+'" opacity=".8"/>',

    /* ---- power saws ---- */
    'circular-saw': '<circle cx="20" cy="24" r="13" fill="'+C.steelLt+'" stroke="'+C.steelDk+'" stroke-width="1.2"/><circle cx="20" cy="24" r="4" fill="'+C.steelDk+'"/><path d="M20 11v26M7 24h26M11 15l18 18M29 15 11 33" stroke="'+C.steelDk+'" opacity=".5"/><path d="M14 6h20a4 4 0 0 1 4 4v16H20z" fill="'+C.body+'"/><path d="M30 10h10a3 3 0 0 1 0 6h-6" fill="'+C.dark+'"/><path d="M6 34h34v4H6z" fill="'+C.steel+'" stroke="'+C.steelDk+'" stroke-width="1"/>',
    'track-saw': '<circle cx="19" cy="22" r="10" fill="'+C.steelLt+'" stroke="'+C.steelDk+'"/><path d="M12 8h18a4 4 0 0 1 4 4v12H19z" fill="'+C.body+'"/><rect x="30" y="10" width="10" height="5" rx="2.5" fill="'+C.dark+'"/><rect x="4" y="32" width="40" height="5" rx="1" fill="'+C.steelDk+'"/><rect x="4" y="37" width="40" height="4" rx="1" fill="'+C.steel+'"/>',
    'table-saw': '<rect x="4" y="24" width="40" height="6" fill="'+C.steel+'" stroke="'+C.steelDk+'"/><rect x="8" y="30" width="32" height="12" fill="'+C.body+'"/><path d="M18 24a7 7 0 0 1 14 0z" fill="'+C.steelLt+'" stroke="'+C.steelDk+'"/><path d="M24 14v10" stroke="'+C.steelDk+'" stroke-width="1.5"/><rect x="6" y="18" width="36" height="4" rx="1" fill="'+C.yellow+'" stroke="'+C.dark+'" stroke-width=".8"/>',
    'miter-saw': '<rect x="4" y="36" width="40" height="6" rx="1" fill="'+C.steel+'" stroke="'+C.steelDk+'"/><rect x="10" y="30" width="28" height="6" fill="'+C.steelDk+'"/><circle cx="22" cy="20" r="10" fill="'+C.steelLt+'" stroke="'+C.steelDk+'"/><path d="M24 8h10a4 4 0 0 1 4 4v10H26z" fill="'+C.body+'"/><path d="m14 30 8-10" stroke="'+C.dark+'" stroke-width="2"/><rect x="34" y="10" width="9" height="5" rx="2.5" fill="'+C.dark+'"/>',
    jigsaw: '<path d="M10 8h20a6 6 0 0 1 6 6v10H10z" fill="'+C.body+'"/><path d="M30 10h10a3 3 0 0 1 0 6h-8" fill="'+C.dark+'"/><rect x="8" y="24" width="26" height="6" fill="'+C.bodyDk+'"/><rect x="6" y="30" width="30" height="4" rx="1" fill="'+C.steel+'" stroke="'+C.steelDk+'"/><path d="M18 34h3v10h-3z" fill="'+C.steelDk+'"/><path d="M18 36h3M18 39h3M18 42h3" stroke="'+C.steelLt+'"/>',
    bandsaw: '<path d="M6 6h14v36H6z" fill="'+C.blue+'"/><path d="M20 8h6v6h-6zM20 34h6v6h-6z" fill="'+C.blue+'"/><circle cx="15" cy="13" r="7" fill="'+C.steelLt+'" stroke="'+C.steelDk+'"/><circle cx="15" cy="35" r="7" fill="'+C.steelLt+'" stroke="'+C.steelDk+'"/><path d="M22 13v22" stroke="'+C.dark+'" stroke-width="2"/><rect x="18" y="22" width="26" height="4" rx="1" fill="'+C.steel+'" stroke="'+C.steelDk+'"/>',
    'scroll-saw': '<rect x="6" y="30" width="36" height="5" fill="'+C.steel+'" stroke="'+C.steelDk+'"/><path d="M8 35h30v7H8z" fill="'+C.body+'"/><path d="M14 30V14h22" stroke="'+C.bodyDk+'" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M36 14v10" stroke="'+C.dark+'" stroke-width="4"/><path d="M25 18v12" stroke="'+C.steelDk+'" stroke-width="1.5"/>',

    /* ---- shaping ---- */
    chisels: '<g><rect x="8" y="6" width="7" height="14" rx="3" fill="'+C.wood+'"/><path d="M8 20h7v10l-3.5 10L8 30z" fill="'+C.steelLt+'" stroke="'+C.steelDk+'"/></g><g><rect x="20" y="6" width="8" height="14" rx="3" fill="'+C.woodDk+'"/><path d="M20 20h8v10l-4 10-4-10z" fill="'+C.steel+'" stroke="'+C.steelDk+'"/></g><g><rect x="33" y="6" width="7" height="14" rx="3" fill="'+C.wood+'"/><path d="M33 20h7v10l-3.5 10L33 30z" fill="'+C.steelLt+'" stroke="'+C.steelDk+'"/></g>',
    mallet: '<rect x="6" y="10" width="20" height="14" rx="2" fill="'+C.wood+'" stroke="'+C.woodDk+'" stroke-width="1.4"/><path d="M10 10v14M16 10v14M22 10v14" stroke="'+C.woodDk+'" opacity=".4"/><path d="m24 20 16 18" stroke="'+C.woodLt+'" stroke-width="6" stroke-linecap="round"/><path d="m24 20 16 18" stroke="'+C.woodDk+'" stroke-width="1"/>',
    'hand-plane': '<path d="M6 26h34v10H6z" fill="'+C.dark+'"/><path d="M6 36h34v3H6z" fill="'+C.steel+'"/><path d="M12 26V16h12v10z" fill="'+C.red+'"/><path d="m20 26 8-14 4 2-6 12z" fill="'+C.steelLt+'" stroke="'+C.steelDk+'"/><path d="M28 14c4-4 8-2 8 2s-4 6-8 4z" fill="'+C.wood+'"/><circle cx="10" cy="22" r="4" fill="'+C.brass+'"/>',
    'block-plane': '<path d="M8 24h32v10H8z" fill="'+C.dark+'"/><path d="M8 34h32v3H8z" fill="'+C.steel+'"/><path d="m18 24 8-8 3 2-6 6z" fill="'+C.steelLt+'" stroke="'+C.steelDk+'"/><circle cx="32" cy="20" r="5" fill="'+C.brass+'"/>',
    spokeshave: '<rect x="14" y="20" width="20" height="9" rx="2" fill="'+C.steelDk+'"/><path d="M14 24H4v5h10zM34 24h10v5H34z" fill="'+C.wood+'" stroke="'+C.woodDk+'"/><path d="M16 29h16v3H16z" fill="'+C.steelLt+'"/>',
    rasp: '<path d="M8 34 30 12l6 6L14 40z" fill="'+C.steel+'" stroke="'+C.steelDk+'"/><path d="M14 28h10M18 24h10M12 32h8" stroke="'+C.steelDk+'" opacity=".7"/><path d="m30 12 4-4c2-2 6 2 4 4l-4 4z" fill="'+C.wood+'" stroke="'+C.woodDk+'"/>',
    'card-scraper': '<rect x="10" y="12" width="28" height="24" rx="1" fill="'+C.steelLt+'" stroke="'+C.steelDk+'" stroke-width="1.4"/><path d="M10 30h28" stroke="'+C.steelDk+'" opacity=".5"/><path d="M14 16c6 4 12 4 20 0" stroke="'+C.steelDk+'" opacity=".35" fill="none"/>',
    router: '<rect x="10" y="8" width="28" height="20" rx="3" fill="'+C.body+'"/><rect x="14" y="12" width="20" height="6" rx="2" fill="'+C.bodyDk+'"/><rect x="6" y="28" width="36" height="6" rx="2" fill="'+C.dark+'"/><circle cx="24" cy="31" r="7" fill="'+C.steelDk+'" opacity=".4"/><path d="M22 34h4v8h-4z" fill="'+C.steel+'"/><circle cx="10" cy="14" r="3" fill="'+C.dark+'"/><circle cx="38" cy="14" r="3" fill="'+C.dark+'"/>',
    lathe: '<rect x="4" y="30" width="40" height="6" fill="'+C.steelDk+'"/><rect x="4" y="18" width="10" height="12" fill="'+C.blue+'"/><rect x="34" y="20" width="10" height="10" fill="'+C.blue+'"/><path d="M14 24c4-6 8-8 12-8s8 2 12 8c-4 6-8 8-12 8s-8-2-12-8z" fill="'+C.wood+'" stroke="'+C.woodDk+'"/>',

    /* ---- drilling ---- */
    drill: '<path d="M8 12h20a5 5 0 0 1 5 5v9H8z" fill="'+C.body+'"/><path d="M8 26h14l-3 12H11z" fill="'+C.bodyDk+'"/><rect x="6" y="36" width="18" height="8" rx="2" fill="'+C.dark+'"/><rect x="33" y="16" width="6" height="8" rx="1" fill="'+C.steelDk+'"/><path d="M39 19h7v2h-7z" fill="'+C.steel+'"/><path d="M4 18h4v6H4z" fill="'+C.dark+'"/>',
    'drill-press': '<rect x="6" y="40" width="36" height="4" rx="1" fill="'+C.dark+'"/><rect x="30" y="6" width="6" height="36" fill="'+C.steelDk+'"/><rect x="14" y="8" width="20" height="10" rx="3" fill="'+C.blue+'"/><rect x="8" y="26" width="24" height="4" fill="'+C.steel+'"/><path d="M22 18v8" stroke="'+C.steelDk+'" stroke-width="3"/><path d="M36 12h6" stroke="'+C.dark+'" stroke-width="2"/>',
    forstner: '<path d="M14 8h10v18a5 5 0 0 1-10 0z" fill="'+C.steelLt+'" stroke="'+C.steelDk+'"/><path d="M19 26v14" stroke="'+C.steelDk+'" stroke-width="4"/><path d="M14 20h10" stroke="'+C.steelDk+'"/><path d="M28 14h6v12a3 3 0 0 1-6 0z" fill="'+C.steel+'" stroke="'+C.steelDk+'"/><path d="M31 26v12" stroke="'+C.steelDk+'" stroke-width="3"/>',
    'hole-saw': '<path d="M12 12h24v14a12 12 0 0 1-24 0z" fill="'+C.steelDk+'"/><path d="M12 16h24" stroke="'+C.steelLt+'" stroke-width="1.5"/><path d="m14 12 2 3 2-3 2 3 2-3 2 3 2-3 2 3 2-3 2 3 2-3" fill="'+C.steel+'"/><path d="M22 26v14h4V26z" fill="'+C.steel+'"/>',
    countersink: '<path d="M18 8h8v8l6 8H12l6-8z" fill="'+C.steelLt+'" stroke="'+C.steelDk+'"/><path d="M20 24h4v16h-4z" fill="'+C.steel+'"/><path d="M14 20h16" stroke="'+C.steelDk+'" opacity=".6"/>',
    'pocket-jig': '<rect x="6" y="18" width="36" height="14" rx="2" fill="'+C.blue+'"/><path d="m14 32 8-14M24 32l8-14" stroke="'+C.steelLt+'" stroke-width="4" stroke-linecap="round"/><rect x="6" y="32" width="36" height="4" fill="'+C.dark+'"/><path d="M18 8v10" stroke="'+C.steelDk+'" stroke-width="3"/>',
    'dowel-jig': '<rect x="8" y="16" width="32" height="14" rx="2" fill="'+C.steelDk+'"/><circle cx="18" cy="23" r="4" fill="'+C.steelLt+'"/><circle cx="30" cy="23" r="4" fill="'+C.steelLt+'"/><rect x="8" y="30" width="32" height="4" fill="'+C.wood+'"/>',
    biscuit: '<path d="M14 10h18a5 5 0 0 1 5 5v14H14z" fill="'+C.body+'"/><rect x="6" y="18" width="10" height="12" rx="2" fill="'+C.dark+'"/><path d="M14 29h23v6H14z" fill="'+C.bodyDk+'"/><ellipse cx="24" cy="38" rx="9" ry="3" fill="'+C.woodLt+'" stroke="'+C.woodDk+'"/>',

    /* ---- sanding & finishing ---- */
    orbital: '<rect x="8" y="12" width="24" height="14" rx="6" fill="'+C.body+'"/><rect x="6" y="26" width="28" height="7" rx="2" fill="'+C.dark+'"/><path d="M6 33h28v3H6z" fill="'+C.woodDk+'" opacity=".7"/><path d="M32 14h8a4 4 0 0 1 0 8h-8z" fill="'+C.bodyDk+'"/><circle cx="20" cy="19" r="3" fill="'+C.bodyLt+'"/>',
    'sanding-block': '<rect x="8" y="16" width="32" height="12" rx="3" fill="'+C.wood+'" stroke="'+C.woodDk+'"/><rect x="6" y="28" width="36" height="6" rx="1" fill="'+C.woodDk+'"/><path d="M8 31h32" stroke="'+C.steelDk+'" opacity=".4" stroke-dasharray="2 2"/>',
    'finish-brush': '<rect x="18" y="6" width="12" height="14" rx="2" fill="'+C.wood+'" stroke="'+C.woodDk+'"/><path d="M16 20h16v4H16z" fill="'+C.steel+'"/><path d="M16 24h16l-2 16H18z" fill="'+C.woodLt+'"/><path d="M20 26v12M24 26v12M28 26v12" stroke="'+C.woodDk+'" opacity=".5"/>',

    /* ---- holding & assembly ---- */
    clamps: '<rect x="4" y="20" width="40" height="5" rx="1" fill="'+C.steel+'" stroke="'+C.steelDk+'"/><path d="M10 10h6v22h-6z" fill="'+C.dark+'"/><path d="M30 14h6v18h-6z" fill="'+C.dark+'"/><rect x="8" y="8" width="10" height="4" rx="1" fill="'+C.red+'"/><path d="M36 22h8" stroke="'+C.steelDk+'" stroke-width="3"/><rect x="40" y="18" width="6" height="8" rx="2" fill="'+C.red+'"/>',
    'spring-clamps': '<path d="M6 16h16v6H6z" fill="'+C.red+'"/><path d="M6 26h16v6H6z" fill="'+C.red+'"/><path d="M22 12h8v24h-8z" fill="'+C.red+'"/><path d="M30 14c8 2 10 8 10 10s-2 8-10 10" fill="none" stroke="'+C.dark+'" stroke-width="4" stroke-linecap="round"/><circle cx="26" cy="24" r="3" fill="'+C.steel+'"/><path d="M6 22h16v4H6z" fill="'+C.woodLt+'"/>',
    'bench-vise': '<rect x="4" y="26" width="40" height="6" fill="'+C.wood+'" stroke="'+C.woodDk+'"/><rect x="8" y="14" width="10" height="12" fill="'+C.blue+'"/><rect x="22" y="14" width="10" height="12" fill="'+C.blue+'"/><path d="M18 18h4v6h-4z" fill="'+C.woodLt+'"/><path d="M32 20h10" stroke="'+C.steelDk+'" stroke-width="3"/><circle cx="43" cy="21" r="3" fill="'+C.steel+'"/>',
    hammer: '<path d="M10 10h16v10H10z" fill="'+C.steelDk+'"/><path d="M6 12c0-3 4-4 4 0v6c0 4-4 3-4 0z" fill="'+C.steelDk+'"/><path d="M26 10h4v10h-4z" fill="'+C.steel+'"/><path d="m22 20 8 20" stroke="'+C.wood+'" stroke-width="6" stroke-linecap="round"/><path d="m22 20 8 20" stroke="'+C.woodDk+'" stroke-width="1"/>',
    'brad-nailer': '<path d="M10 10h20a4 4 0 0 1 4 4v10H10z" fill="'+C.body+'"/><path d="M10 24h12v14H10z" fill="'+C.bodyDk+'"/><rect x="8" y="36" width="16" height="6" rx="2" fill="'+C.dark+'"/><path d="M30 24h4v12h-4z" fill="'+C.steelDk+'"/><path d="M34 14h8v6h-8z" fill="'+C.dark+'"/>',
    glue: '<path d="M18 14h12v26a2 2 0 0 1-2 2H20a2 2 0 0 1-2-2z" fill="'+C.yellow+'" stroke="'+C.woodDk+'" stroke-width="1.2"/><path d="M20 20h8v12h-8z" fill="'+C.white+'" opacity=".8"/><path d="M21 8h6v6h-6z" fill="'+C.red+'"/><path d="M22 4h4v4h-4z" fill="'+C.dark+'"/>',

    /* ---- safety & shop ---- */
    'safety-glasses': '<path d="M4 18h40v6a8 8 0 0 1-8 8h-4l-8-6-8 6h-4a8 8 0 0 1-8-8z" fill="'+C.bodyLt+'" opacity=".85" stroke="'+C.dark+'" stroke-width="1.2"/><path d="M4 18h40v4H4z" fill="'+C.dark+'"/>',
    'ear-muffs': '<path d="M10 24a14 14 0 0 1 28 0" fill="none" stroke="'+C.dark+'" stroke-width="4"/><rect x="4" y="22" width="10" height="18" rx="5" fill="'+C.red+'"/><rect x="34" y="22" width="10" height="18" rx="5" fill="'+C.red+'"/><rect x="6" y="26" width="6" height="10" rx="3" fill="'+C.dark+'" opacity=".4"/><rect x="36" y="26" width="6" height="10" rx="3" fill="'+C.dark+'" opacity=".4"/>',
    'dust-mask': '<path d="M8 16h32v8a12 12 0 0 1-12 10h-8A12 12 0 0 1 8 24z" fill="'+C.white+'" stroke="'+C.steelDk+'" stroke-width="1.2"/><path d="M8 22h32" stroke="'+C.steelDk+'" opacity=".5"/><path d="M8 18 2 12M40 18l6-6" stroke="'+C.dark+'" stroke-width="1.6"/><circle cx="24" cy="28" r="4" fill="'+C.steel+'"/>',
    'shop-vac': '<rect x="8" y="18" width="22" height="20" rx="3" fill="'+C.red+'"/><rect x="8" y="12" width="22" height="8" rx="3" fill="'+C.dark+'"/><circle cx="13" cy="40" r="3.5" fill="'+C.dark+'"/><circle cx="25" cy="40" r="3.5" fill="'+C.dark+'"/><path d="M30 20c10 0 12 6 12 12s-4 8-8 6" fill="none" stroke="'+C.dark+'" stroke-width="3.5" stroke-linecap="round"/><rect x="14" y="6" width="10" height="6" rx="2" fill="'+C.steelDk+'"/>'
  };

  var FALLBACK = '<rect x="8" y="18" width="32" height="12" rx="2" fill="'+C.wood+'" stroke="'+C.woodDk+'"/>';

  window.TOOL_ART = A;
  window.toolArt = function (id, cls) {
    return '<svg class="art ' + (cls || '') + '" viewBox="0 0 48 48" role="img" aria-hidden="true">' +
      (A[id] || FALLBACK) + '</svg>';
  };
})();
