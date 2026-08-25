/* Carpenter — step diagrams.
   Flat-pack style pictograms, matched to a step by what the step actually asks
   you to do. They illustrate the technique, not the individual part, which is
   what most assembly manuals are really doing anyway. */

(function () {
  var c = {
    paper: '#F8F2E4', wood: '#D9AE74', woodDk: '#A9743A', edge: '#7E5327',
    ink: '#2F241A', steel: '#B9C0C6', steelDk: '#7E868E',
    teal: '#12A19A', red: '#B4523A', brass: '#C8952E'
  };

  function frame(inner) {
    return '<svg class="step-figure" viewBox="0 0 160 100" role="img" aria-hidden="true">' +
      '<rect width="160" height="100" fill="' + c.paper + '"/>' + inner + '</svg>';
  }
  function board(x, y, w, h) {
    return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + c.wood +
      '" stroke="' + c.edge + '"/>';
  }
  var arrow = '<defs><marker id="ar" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">' +
    '<path d="M0 0l7 3.5L0 7z" fill="' + c.red + '"/></marker></defs>';

  var D = {
    measure: {
      title: 'Measure and mark',
      svg: board(16, 52, 128, 22) +
        '<rect x="24" y="34" width="96" height="12" rx="2" fill="' + c.brass + '" stroke="' + c.edge + '"/>' +
        '<path d="M40 34v12M64 34v8M88 34v12M112 34v8" stroke="' + c.edge + '"/>' +
        '<path d="M88 46v34" stroke="' + c.red + '" stroke-width="2" stroke-dasharray="4 3"/>'
    },
    mark: {
      title: 'Mark from one reference face',
      svg: board(20, 46, 120, 30) +
        '<path d="M40 30h10v46H40z" fill="' + c.steel + '" stroke="' + c.steelDk + '"/>' +
        '<path d="M50 40h70" stroke="' + c.red + '" stroke-width="2"/>' +
        '<path d="m118 30 14 10-14 6z" fill="' + c.ink + '"/>'
    },
    cutStraight: {
      title: 'Cut along a clamped guide',
      svg: board(12, 54, 136, 26) +
        '<rect x="12" y="42" width="136" height="8" fill="' + c.steel + '" stroke="' + c.steelDk + '"/>' +
        '<rect x="52" y="14" width="46" height="26" rx="3" fill="' + c.teal + '"/>' +
        '<circle cx="76" cy="52" r="16" fill="none" stroke="' + c.steelDk + '" stroke-width="2"/>' +
        arrow + '<path d="M110 30h28" stroke="' + c.red + '" stroke-width="2" marker-end="url(#ar)"/>'
    },
    crosscut: {
      title: 'Cut to length against a stop',
      svg: board(20, 50, 110, 24) +
        '<rect x="128" y="34" width="14" height="46" fill="' + c.woodDk + '"/>' +
        '<path d="M76 16v46" stroke="' + c.steelDk + '" stroke-width="4"/>' +
        '<path d="M68 16h16v10H68z" fill="' + c.ink + '"/>' +
        arrow + '<path d="M76 12v-2" stroke="' + c.red + '"/>' +
        '<path d="M100 88h30" stroke="' + c.red + '" stroke-width="2" marker-end="url(#ar)"/>'
    },
    cutCurve: {
      title: 'Cut the curve, sand to the line',
      svg: board(18, 40, 124, 44) +
        '<path d="M30 84c16-40 60-48 96-30" stroke="' + c.red + '" stroke-width="2" fill="none" stroke-dasharray="5 4"/>' +
        '<rect x="88" y="14" width="26" height="22" rx="3" fill="' + c.teal + '"/>' +
        '<path d="M101 36v16" stroke="' + c.steelDk + '" stroke-width="3"/>'
    },
    drill: {
      title: 'Drill a pilot hole',
      svg: board(16, 56, 128, 26) +
        '<rect x="56" y="12" width="40" height="20" rx="4" fill="' + c.teal + '"/>' +
        '<rect x="62" y="32" width="14" height="10" fill="' + c.ink + '"/>' +
        '<path d="M76 32v24" stroke="' + c.steelDk + '" stroke-width="3"/>' +
        arrow + '<path d="M120 34v22" stroke="' + c.red + '" stroke-width="2" marker-end="url(#ar)"/>' +
        '<circle cx="76" cy="68" r="4" fill="' + c.edge + '"/>'
    },
    bore: {
      title: 'Bore with scrap underneath',
      svg: board(16, 52, 128, 22) + '<rect x="16" y="74" width="128" height="10" fill="' + c.woodDk + '" opacity=".65"/>' +
        '<rect x="58" y="10" width="40" height="20" rx="4" fill="' + c.teal + '"/>' +
        '<path d="M70 30h16v14a8 8 0 0 1-16 0z" fill="' + c.steel + '" stroke="' + c.steelDk + '"/>' +
        '<ellipse cx="78" cy="58" rx="14" ry="5" fill="' + c.edge + '" opacity=".5"/>'
    },
    glueClamp: {
      title: 'Glue and clamp',
      svg: board(24, 30, 112, 18) + board(24, 52, 112, 18) +
        '<path d="M24 50h112" stroke="' + c.brass + '" stroke-width="3"/>' +
        '<rect x="10" y="20" width="10" height="60" fill="' + c.ink + '"/>' +
        '<rect x="140" y="20" width="10" height="60" fill="' + c.ink + '"/>' +
        arrow + '<path d="M34 86h20" stroke="' + c.red + '" stroke-width="2" marker-end="url(#ar)"/>' +
        '<path d="M126 86h-20" stroke="' + c.red + '" stroke-width="2" marker-end="url(#ar)"/>'
    },
    screw: {
      title: 'Pre-drill, then screw',
      svg: board(20, 34, 40, 52) + board(60, 50, 80, 22) +
        '<path d="M44 60h60" stroke="' + c.steelDk + '" stroke-width="4"/>' +
        '<path d="M36 54h10v12H36z" fill="' + c.ink + '"/>' +
        arrow + '<path d="M120 30v14" stroke="' + c.red + '" stroke-width="2" marker-end="url(#ar)"/>'
    },
    square: {
      title: 'Check both diagonals',
      svg: '<rect x="24" y="20" width="112" height="60" fill="none" stroke="' + c.edge + '" stroke-width="6"/>' +
        '<path d="M24 20l112 60M136 20 24 80" stroke="' + c.red + '" stroke-width="2" stroke-dasharray="5 4"/>' +
        '<text x="80" y="96" font-family="monospace" font-size="11" fill="' + c.ink + '" text-anchor="middle">A = B</text>'
    },
    dryFit: {
      title: 'Dry fit before any glue',
      svg: board(30, 24, 20, 60) + board(110, 24, 20, 60) +
        '<rect x="50" y="34" width="60" height="16" fill="none" stroke="' + c.edge + '" stroke-dasharray="5 4"/>' +
        '<rect x="50" y="60" width="60" height="16" fill="none" stroke="' + c.edge + '" stroke-dasharray="5 4"/>' +
        arrow + '<path d="M64 42h30" stroke="' + c.red + '" stroke-width="2" marker-end="url(#ar)"/>'
    },
    spacer: {
      title: 'Use an offcut as the gauge',
      svg: board(20, 24, 120, 14) + board(20, 62, 120, 14) +
        '<rect x="60" y="38" width="18" height="24" fill="' + c.brass + '" stroke="' + c.edge + '"/>' +
        '<path d="M96 38v24" stroke="' + c.red + '" stroke-width="2" marker-start="url(#ar)" marker-end="url(#ar)"/>' + arrow
    },
    sandRound: {
      title: 'Ease every edge',
      svg: '<path d="M20 44h100a20 20 0 0 1 20 20v20H20z" fill="' + c.wood + '" stroke="' + c.edge + '"/>' +
        '<path d="M108 44a32 32 0 0 1 32 32" stroke="' + c.red + '" stroke-width="2" fill="none" stroke-dasharray="4 3"/>' +
        '<rect x="86" y="12" width="40" height="16" rx="3" fill="' + c.teal + '"/>' + arrow +
        '<path d="M60 24h30" stroke="' + c.red + '" stroke-width="2" marker-end="url(#ar)"/>'
    },
    assembleBox: {
      title: 'Build the carcass',
      svg: '<path d="M30 22h100v56H30z" fill="none" stroke="' + c.edge + '" stroke-width="6"/>' +
        board(30, 22, 100, 10) + board(30, 68, 100, 10) +
        '<path d="M30 78 16 92M130 78l14 14" stroke="' + c.edge + '" stroke-width="4"/>' + arrow +
        '<path d="M80 40v20" stroke="' + c.red + '" stroke-width="2" marker-end="url(#ar)"/>'
    },
    wallFix: {
      title: 'Fix to the wall, on the level',
      svg: '<rect x="10" y="10" width="24" height="80" fill="' + c.steel + '" opacity=".45"/>' +
        board(34, 40, 106, 16) +
        '<path d="M34 48h106" stroke="' + c.red + '" stroke-width="2" stroke-dasharray="5 4"/>' +
        '<circle cx="52" cy="48" r="4" fill="' + c.ink + '"/><circle cx="120" cy="48" r="4" fill="' + c.ink + '"/>' +
        '<rect x="60" y="66" width="50" height="14" rx="3" fill="' + c.teal + '"/>' +
        '<ellipse cx="85" cy="73" rx="10" ry="4" fill="#9BD3A0" stroke="' + c.edge + '"/>'
    },
    hinge: {
      title: 'Hang and adjust',
      svg: board(20, 20, 44, 62) + board(74, 20, 66, 62) +
        '<rect x="64" y="30" width="10" height="16" fill="' + c.steel + '" stroke="' + c.steelDk + '"/>' +
        '<rect x="64" y="58" width="10" height="16" fill="' + c.steel + '" stroke="' + c.steelDk + '"/>' +
        '<circle cx="128" cy="52" r="4" fill="' + c.brass + '"/>' + arrow +
        '<path d="M100 90h20" stroke="' + c.red + '" stroke-width="2" marker-end="url(#ar)"/>'
    },
    drawerFit: {
      title: 'Set the gap with spacers',
      svg: '<rect x="20" y="16" width="120" height="68" fill="none" stroke="' + c.edge + '" stroke-width="6"/>' +
        board(30, 26, 100, 22) + board(30, 56, 100, 22) +
        '<path d="M30 52h100" stroke="' + c.red + '" stroke-width="2"/>' +
        '<rect x="70" y="49" width="20" height="6" fill="' + c.brass + '"/>'
    },
    finish: {
      title: 'Sand, then finish',
      svg: board(16, 46, 128, 30) +
        '<rect x="58" y="12" width="16" height="26" rx="2" fill="' + c.woodDk + '"/>' +
        '<path d="M56 38h20l-3 12H59z" fill="' + c.brass + '"/>' +
        '<path d="M40 60h80" stroke="' + c.brass + '" stroke-width="4" opacity=".6"/>' + arrow +
        '<path d="M94 24h30" stroke="' + c.red + '" stroke-width="2" marker-end="url(#ar)"/>'
    },
    test: {
      title: 'Load it before you trust it',
      svg: board(24, 44, 112, 14) +
        '<path d="M36 58v30M124 58v30" stroke="' + c.woodDk + '" stroke-width="8"/>' +
        arrow + '<path d="M80 12v26" stroke="' + c.red + '" stroke-width="3" marker-end="url(#ar)"/>' +
        '<circle cx="80" cy="8" r="6" fill="' + c.ink + '"/>'
    },
    safety: {
      title: 'Guard the child, guard yourself',
      svg: '<path d="M80 12l44 14v26c0 22-18 34-44 40-26-6-44-18-44-40V26z" fill="' + c.teal + '" opacity=".9"/>' +
        '<path d="M62 50l14 14 26-26" stroke="' + c.paper + '" stroke-width="7" fill="none" stroke-linecap="round"/>'
    },
    layout: {
      title: 'Lay the parts out together',
      svg: board(18, 22, 124, 12) + board(18, 42, 124, 12) + board(18, 62, 90, 12) +
        '<path d="M40 16v66M96 16v66" stroke="' + c.red + '" stroke-width="2" stroke-dasharray="4 3"/>'
    },
    shape: {
      title: 'Shape it, then check by eye',
      svg: board(14, 54, 132, 26) +
        '<rect x="52" y="26" width="56" height="20" rx="3" fill="' + c.ink + '"/>' +
        '<rect x="60" y="16" width="22" height="12" rx="2" fill="' + c.red + '"/>' +
        '<path d="M96 46l10-14" stroke="' + c.steelDk + '" stroke-width="4"/>' +
        '<path d="M112 54c8-6 16-2 22-10" stroke="' + c.woodDk + '" stroke-width="3" fill="none"/>' + arrow +
        '<path d="M40 36h-18" stroke="' + c.red + '" stroke-width="2" marker-end="url(#ar)"/>'
    },
    generic: {
      title: 'Work through it in order',
      svg: board(22, 40, 116, 34) + grainLines(22, 40, 116, 34) +
        '<circle cx="80" cy="24" r="10" fill="none" stroke="' + c.ink + '" stroke-width="2"/>' +
        '<path d="M80 18v8l5 4" stroke="' + c.ink + '" stroke-width="2" fill="none"/>'
    }
  };

  function grainLines(x, y, w, h) {
    var o = '';
    for (var i = 1; i < 4; i++) {
      o += '<path d="M' + (x + 4) + ' ' + (y + h * i / 4) + 'q' + (w / 3) + ' -3 ' + (w - 8) + ' 0" stroke="' +
        c.edge + '" fill="none" opacity=".3"/>';
    }
    return o;
  }

  /* Order matters: the first pattern that matches wins. */
  var RULES = [
    [/choking|choke|hazard|supervis|must not|no glued-on|splinter|swallow|come loose|under-?3|choke tube|treated timber|do not add a perch/i, 'safety'],
    [/diagonal|out of square|check(ing)? (for |it |the )?square|racking|keeps the case square/i, 'square'],
    [/dry.?fit|dry.?assemb|dry run|test.?fit|before any glue/i, 'dryFit'],
    [/spacer|offcut as|gauge|even(ly)? space|space the|gap all round|coins|playing card/i, 'spacer'],
    [/hinge|hang the door|pivot|lid stay|swing/i, 'hinge'],
    [/drawer|runner|setback|story stick/i, 'drawerFit'],
    [/wall|stud|level line|bracket|strap it|anti-tip|keyhole/i, 'wallFix'],
    [/glue (the|and|up|it)|clamp|glue-?up|tourniquet/i, 'glueClamp'],
    [/screw|pre-?drill|countersink|pocket hole|fasten/i, 'screw'],
    [/bore|forstner|hole saw|socket|recess|cockpit|entry hole|drain hole/i, 'bore'],
    [/drill/i, 'drill'],
    [/curve|profile|silhouette|jigsaw|coping saw|band saw|scroll|arc|outline/i, 'cutCurve'],
    [/crosscut|stop block|cut .*to length|identical|same length|same section|at once|miter|mitre|45°|bevel/i, 'crosscut'],
    [/rip|break (the )?sheet|straightedge|cut the|saw |kerf|slice/i, 'cutStraight'],
    [/sand|round(ing)? (over|every|all|the)|ease (all|every|the)|chamfer|smooth|240|180 grit/i, 'sandRound'],
    [/finish|oil|varnish|lacquer|wax|paint|stain/i, 'finish'],
    [/stand on|sit on|test with|full weight|load|balance/i, 'test'],
    [/assemb|carcass|join the|build the|four sides|end frames|glue the .* up/i, 'assembleBox'],
    [/lay .*out|mark .*at once|both .*together|template|transfer|draw the|design the/i, 'layout'],
    [/rout(e|ing)?|groove|rebate|mortise|plane (the|it|down)|flatten|rasp|shape the|carve|twist the|taper|round the top|slice the/i, 'shape'],
    [/pin (the|it)|panel pins|brad|nail|tack/i, 'screw'],
    [/grain|growth ring|arrange the/i, 'layout'],
    [/fit (the|a|axles|it)|attach|mount|install|slot|drop the|thread/i, 'assembleBox'],
    [/measure|dimension|add 20|height|width|matches/i, 'measure'],
    [/mark|scribe|reference (face|end)|pencil/i, 'mark']
  ];

  window.stepArt = function (text) {
    for (var i = 0; i < RULES.length; i++) {
      if (RULES[i][0].test(text)) {
        var d = D[RULES[i][1]];
        return { key: RULES[i][1], title: d.title, svg: frame(d.svg) };
      }
    }
    return { key: 'generic', title: D.generic.title, svg: frame(D.generic.svg) };
  };
})();
