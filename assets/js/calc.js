/* Carpenter — cut list and material maths. Everything arrives in millimetres. */
(function () {
  var MM_PER_IN = 25.4;

  function toIn(mm) { return mm / MM_PER_IN; }

  /* Nearest 1/16" as a readable fraction. */
  function frac(mm) {
    var inches = toIn(mm);
    var whole = Math.floor(inches);
    var sixteenths = Math.round((inches - whole) * 16);
    if (sixteenths === 16) { whole += 1; sixteenths = 0; }
    if (sixteenths === 0) return whole + '"';
    var n = sixteenths, d = 16;
    while (n % 2 === 0) { n /= 2; d /= 2; }
    return (whole ? whole + ' ' : '') + n + '/' + d + '"';
  }

  function len(mm, unit) {
    if (unit === 'imperial') return frac(mm);
    return Math.round(mm) + ' mm';
  }

  /* First-fit-decreasing packing: how many stock lengths do these pieces need? */
  function packLengths(pieces, stockLength, kerf) {
    var list = pieces.slice().sort(function (a, b) { return b - a; });
    var bins = [];
    list.forEach(function (piece) {
      if (piece > stockLength) { bins.push(stockLength); return; } // oversize: flag separately
      for (var i = 0; i < bins.length; i++) {
        if (bins[i] + piece + kerf <= stockLength) { bins[i] += piece + kerf; return; }
      }
      bins.push(piece);
    });
    return bins;
  }

  function cutList(project, params, settings) {
    var s = settings || {};
    var stockLength = s.stockLength || 2400;
    var sheetW = s.sheetW || 1220, sheetL = s.sheetL || 2440;
    var kerf = s.kerf || 3;
    var waste = 1 + (s.waste == null ? 15 : s.waste) / 100;

    var parts = project.parts(params).filter(function (x) { return x && x.qty > 0; });
    var boards = {}, panels = {}, dowels = {};
    var oversize = [];

    parts.forEach(function (p) {
      if (p.stock === 'dowel') {
        var dk = 'd' + p.d;
        dowels[dk] = dowels[dk] || { d: p.d, total: 0, pieces: [] };
        for (var i = 0; i < p.qty; i++) { dowels[dk].pieces.push(p.l); dowels[dk].total += p.l; }
      } else if (p.stock === 'panel') {
        var pk = 't' + p.t;
        panels[pk] = panels[pk] || { t: p.t, area: 0, parts: [] };
        panels[pk].area += p.qty * p.w * p.l;
        panels[pk].parts.push(p);
        if (p.l > sheetL || p.w > sheetW) oversize.push(p.name);
      } else {
        var bk = p.t + 'x' + p.w;
        boards[bk] = boards[bk] || { t: p.t, w: p.w, total: 0, pieces: [] };
        for (var j = 0; j < p.qty; j++) { boards[bk].pieces.push(p.l); boards[bk].total += p.l; }
        if (p.l > stockLength) oversize.push(p.name);
      }
    });

    var boardRows = Object.keys(boards).map(function (k) {
      var g = boards[k];
      var bins = packLengths(g.pieces, stockLength, kerf);
      var bf = g.pieces.reduce(function (a, l) { return a + toIn(g.t) * toIn(g.w) * toIn(l) / 144; }, 0);
      return {
        t: g.t, w: g.w, count: g.pieces.length, total: g.total,
        sticks: Math.max(1, Math.ceil(bins.length * (waste > 1.05 ? 1 : 1))),
        rawSticks: bins.length,
        boardFeet: bf * waste,
        m3: g.pieces.reduce(function (a, l) { return a + g.t * g.w * l; }, 0) / 1e9 * waste
      };
    }).sort(function (a, b) { return b.t - a.t || b.w - a.w; });

    var panelRows = Object.keys(panels).map(function (k) {
      var g = panels[k];
      var m2 = g.area / 1e6;
      var sheetArea = sheetW * sheetL / 1e6;
      return { t: g.t, m2: m2, sheets: Math.ceil(m2 * waste / sheetArea * 100) / 100, sheetsUp: Math.ceil(m2 * waste / sheetArea) };
    }).sort(function (a, b) { return b.t - a.t; });

    var dowelRows = Object.keys(dowels).map(function (k) {
      var g = dowels[k];
      var stickLen = s.dowelLength || 1000;
      return { d: g.d, count: g.pieces.length, total: g.total, sticks: packLengths(g.pieces, stickLen, kerf).length };
    }).sort(function (a, b) { return b.d - a.d; });

    var totals = {
      boardFeet: boardRows.reduce(function (a, r) { return a + r.boardFeet; }, 0),
      m3: boardRows.reduce(function (a, r) { return a + r.m3; }, 0),
      panelM2: panelRows.reduce(function (a, r) { return a + r.m2; }, 0),
      sheets: panelRows.reduce(function (a, r) { return a + r.sheetsUp; }, 0),
      pieces: parts.reduce(function (a, p) { return a + p.qty; }, 0)
    };

    var price = s.price || {};
    totals.cost =
      totals.boardFeet * (price.boardFoot || 0) +
      totals.sheets * (price.sheet || 0) +
      dowelRows.reduce(function (a, r) { return a + r.sticks * (price.dowel || 0); }, 0);

    /* Rough finished weight, using an average density per wood family. */
    var density = s.density || 600; // kg/m3
    totals.weightKg = (totals.m3 + totals.panelM2 * (panelRows[0] ? panelRows[0].t / 1000 : 0.018)) * density;

    return { parts: parts, boards: boardRows, panels: panelRows, dowels: dowelRows, totals: totals, oversize: oversize };
  }

  window.Calc = { cutList: cutList, len: len, toIn: toIn, frac: frac };
})();
