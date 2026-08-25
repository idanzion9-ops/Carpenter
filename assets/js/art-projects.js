/* Carpenter — project illustrations.
   Every drawing is generated, not photographed: an elevation of the piece in
   the same warm palette as the rest of the app. Where the project has
   dimensions, the drawing follows them — change the number of shelves and a
   shelf appears in the picture. It is a thinking aid, not a photo of a
   finished piece: enough to judge whether the shape is what you had in mind. */

(function () {
  var W = 200, H = 140;
  var c = {
    sky: '#F3E8D2', floor: '#DCC8A2', line: '#8A6E45',
    lt: '#E8C393', md: '#CE9C5E', dk: '#A9743A', edge: '#8A5C2B', deep: '#6E4622',
    ink: '#3A2A1B', steel: '#B9C0C6', green: '#3E6B54', red: '#B4523A',
    blue: '#4A7292', cream: '#F8F2E4', brass: '#C8952E'
  };

  function r(x, y, w, h, f, s) {
    return '<rect x="' + x + '" y="' + y + '" width="' + Math.max(0, w) + '" height="' + Math.max(0, h) +
      '" fill="' + f + '"' + (s ? ' stroke="' + s + '" stroke-width="1"' : '') + '/>';
  }
  function bg() {
    return r(0, 0, W, H, c.sky) + r(0, H - 18, W, 18, c.floor) +
      '<path d="M0 ' + (H - 18) + 'h' + W + '" stroke="' + c.line + '" stroke-width="1" opacity=".45"/>';
  }
  function grain(x, y, w, h) {
    var o = '';
    for (var i = 1; i < 4; i++) {
      var yy = y + h * i / 4;
      o += '<path d="M' + (x + 2) + ' ' + yy + 'q' + (w / 3) + ' -2 ' + (w - 4) + ' 0" stroke="' + c.edge +
        '" fill="none" opacity=".22"/>';
    }
    return o;
  }

  /* ---------------- archetypes ---------------- */
  var art = {

    shelf: function (p) {
      var L = 150, T = 10;
      return bg() + r(20, 20, 160, 60, '#EADCC0') +
        '<path d="M25 82h150" stroke="' + c.line + '" opacity=".3" stroke-dasharray="4 4"/>' +
        r(25, 62, L, T, c.md, c.edge) + grain(25, 62, L, T) +
        r(25, 72, L, 4, c.dk) +
        // a couple of books and a pot to give it scale
        r(45, 40, 8, 22, c.green) + r(55, 36, 7, 26, c.red) + r(64, 42, 9, 20, c.blue) +
        '<path d="M140 62v-12h18v12z" fill="' + c.dk + '"/><circle cx="149" cy="44" r="8" fill="' + c.green + '"/>';
    },

    ledge: function () {
      return bg() + r(20, 18, 160, 66, '#EADCC0') +
        r(30, 70, 140, 8, c.md, c.edge) + r(30, 78, 140, 5, c.dk) +
        r(28, 66, 144, 5, c.lt, c.edge) +
        // leaning frames
        '<g transform="rotate(-3 70 50)">' + r(48, 30, 44, 40, c.cream, c.edge) + r(53, 35, 34, 30, c.blue) + '</g>' +
        '<g transform="rotate(2 120 52)">' + r(100, 38, 36, 32, c.cream, c.edge) + r(105, 43, 26, 22, c.green) + '</g>';
    },

    spiceRack: function () {
      var o = bg() + r(35, 24, 130, 12, c.md, c.edge) + r(35, 24, 12, 74, c.dk) + r(153, 24, 12, 74, c.dk) +
        r(35, 60, 130, 8, c.md, c.edge) + r(35, 90, 130, 8, c.md, c.edge);
      for (var i = 0; i < 4; i++) {
        var x = 54 + i * 26;
        o += r(x, 38, 18, 22, c.cream, c.edge) + r(x + 2, 34, 14, 5, c.brass) +
          r(x, 68, 18, 22, '#E7D3B0', c.edge) + r(x + 2, 64, 14, 5, c.brass);
      }
      return o;
    },

    bookcase: function (p) {
      var n = (p && p.N) || 4, x = 40, y = 14, w = 120, h = 108;
      var o = bg() + r(x, y, w, h, c.lt, c.edge) + r(x, y, 10, h, c.dk) + r(x + w - 10, y, 10, h, c.dk) +
        r(x, y, w, 9, c.md, c.edge) + r(x, y + h - 9, w, 9, c.md, c.edge);
      for (var i = 1; i <= n; i++) {
        var sy = y + (h - 9) * i / (n + 1);
        o += r(x + 10, sy, w - 20, 6, c.md, c.edge);
        for (var b = 0; b < 5; b++) {
          o += r(x + 16 + b * 9, sy - 20, 7, 20, [c.green, c.red, c.blue, c.brass, c.deep][b % 5]);
        }
      }
      return o;
    },

    corner: function (p) {
      var n = (p && p.N) || 5, o = bg();
      o += '<path d="M96 10v112" stroke="' + c.deep + '" stroke-width="7"/>';
      for (var i = 0; i < n; i++) {
        var y = 26 + i * (86 / n), w = 62 - i * 3;
        o += '<path d="M96 ' + y + 'l' + w + ' 12v7l-' + w + ' -12z" fill="' + c.dk + '"/>' +
             '<path d="M96 ' + y + 'l-' + w + ' 12v7l' + w + ' -12z" fill="' + c.md + '"/>' +
             '<path d="M' + (96 - w) + ' ' + (y + 12) + 'h' + (w * 2) + '" stroke="' + c.edge + '" opacity=".4"/>';
      }
      o += '<circle cx="72" cy="44" r="7" fill="' + c.green + '"/>' +
           '<rect x="112" y="66" width="10" height="16" fill="' + c.red + '"/>';
      return o;
    },

    cabinet: function () {
      return bg() + r(45, 16, 110, 100, c.lt, c.edge) +
        r(45, 16, 110, 8, c.md) + r(45, 108, 110, 8, c.md) +
        r(52, 24, 96, 84, c.md, c.edge) + r(62, 34, 76, 64, c.lt, c.edge) + grain(62, 34, 76, 64) +
        '<circle cx="140" cy="66" r="4" fill="' + c.brass + '"/>';
    },

    drawers: function (p) {
      var n = (p && p.N) || 3, x = 34, y = 20, w = 132, h = 96;
      var o = bg() + r(x, y, w, h, c.dk, c.edge) + r(x, y, w, 8, c.md);
      var dh = (h - 16) / n;
      for (var i = 0; i < n; i++) {
        var dy = y + 10 + i * dh;
        o += r(x + 6, dy, w - 12, dh - 4, c.lt, c.edge) + grain(x + 6, dy, w - 12, dh - 4) +
          r(x + w / 2 - 14, dy + (dh - 4) / 2 - 2, 28, 4, c.brass);
      }
      o += r(x, y + h, 10, 10, c.deep) + r(x + w - 10, y + h, 10, 10, c.deep);
      return o;
    },

    chest: function () {
      return bg() + r(34, 54, 132, 62, c.md, c.edge) + grain(34, 54, 132, 62) +
        '<g transform="rotate(-14 40 54)">' + r(30, 40, 140, 14, c.lt, c.edge) + '</g>' +
        r(34, 108, 132, 8, c.dk) +
        '<circle cx="100" cy="86" r="5" fill="' + c.brass + '"/>' +
        // toys peeking out
        '<circle cx="70" cy="66" r="7" fill="' + c.red + '" opacity=".9"/><rect x="112" y="60" width="14" height="12" fill="' + c.blue + '"/>';
    },

    bench: function () {
      return bg() + r(26, 58, 148, 12, c.md, c.edge) + grain(26, 58, 148, 12) +
        r(34, 70, 12, 52, c.dk) + r(154, 70, 12, 52, c.dk) +
        r(34, 92, 132, 7, c.dk) +
        // back rest
        r(30, 20, 10, 40, c.dk) + r(160, 20, 10, 40, c.dk) +
        r(30, 24, 140, 9, c.md, c.edge) + r(30, 42, 140, 9, c.md, c.edge);
    },

    shoeBench: function () {
      var o = bg() + r(26, 44, 148, 12, c.md, c.edge) + grain(26, 44, 148, 12) +
        r(32, 56, 10, 66, c.dk) + r(158, 56, 10, 66, c.dk);
      for (var i = 0; i < 3; i++) o += r(42, 84 + i * 12, 116, 6, c.md, c.edge);
      o += '<path d="M60 78c8-6 18-4 22 2h-24z" fill="' + c.red + '"/><path d="M104 78c8-6 18-4 22 2h-24z" fill="' + c.blue + '"/>';
      return o;
    },

    table: function () {
      return bg() + r(20, 44, 160, 12, c.md, c.edge) + grain(20, 44, 160, 12) +
        r(20, 56, 160, 5, c.dk) +
        r(32, 61, 12, 61, c.dk) + r(156, 61, 12, 61, c.dk) +
        r(44, 61, 112, 8, c.md) +
        '<ellipse cx="100" cy="42" rx="22" ry="5" fill="' + c.cream + '" stroke="' + c.edge + '"/>';
    },

    desk: function () {
      return bg() + r(16, 46, 168, 11, c.md, c.edge) + grain(16, 46, 168, 11) +
        r(26, 57, 12, 65, c.dk) + r(162, 57, 12, 65, c.dk) +
        r(38, 57, 124, 7, c.dk) +
        r(46, 70, 108, 10, c.deep) +   // cable tray
        '<path d="M70 80c10 10 40 10 50 0" stroke="' + c.ink + '" fill="none" opacity=".5"/>' +
        r(74, 20, 52, 26, c.ink) + r(78, 24, 44, 18, c.blue) + r(94, 46, 12, 4, c.ink);
    },

    kidsTable: function () {
      return bg() + '<rect x="34" y="52" width="132" height="12" rx="6" fill="' + c.md + '" stroke="' + c.edge + '"/>' +
        r(46, 64, 10, 44, c.dk) + r(144, 64, 10, 44, c.dk) +
        '<circle cx="76" cy="42" r="9" fill="' + c.red + '"/><rect x="94" y="34" width="16" height="16" fill="' + c.blue + '"/>' +
        '<path d="M124 50l10-16 10 16z" fill="' + c.green + '"/>';
    },

    car: function () {
      return bg() + '<path d="M36 84c0-10 8-16 20-18 8-12 20-16 34-16s24 6 30 16c14 2 24 8 24 18z" fill="' + c.md + '" stroke="' + c.edge + '"/>' +
        '<path d="M78 58c6-8 20-8 26 0z" fill="' + c.deep + '" opacity=".55"/>' +
        grain(40, 68, 100, 14) +
        '<circle cx="62" cy="90" r="16" fill="' + c.deep + '"/><circle cx="62" cy="90" r="6" fill="' + c.lt + '"/>' +
        '<circle cx="140" cy="90" r="16" fill="' + c.deep + '"/><circle cx="140" cy="90" r="6" fill="' + c.lt + '"/>';
    },

    truck: function () {
      return bg() + '<path d="M20 62h48v28H20z" fill="' + c.md + '" stroke="' + c.edge + '"/>' +
        '<path d="M28 62c2-12 8-18 18-18h14v18z" fill="' + c.dk + '"/>' +
        r(78, 52, 100, 38, c.lt, c.edge) + grain(78, 52, 100, 38) +
        r(72, 78, 10, 8, c.deep) +
        '<circle cx="42" cy="96" r="13" fill="' + c.deep + '"/><circle cx="42" cy="96" r="5" fill="' + c.lt + '"/>' +
        '<circle cx="108" cy="96" r="13" fill="' + c.deep + '"/><circle cx="108" cy="96" r="5" fill="' + c.lt + '"/>' +
        '<circle cx="152" cy="96" r="13" fill="' + c.deep + '"/><circle cx="152" cy="96" r="5" fill="' + c.lt + '"/>';
    },

    plane: function () {
      return bg() +
        '<path d="M40 70h110l24 8-24 8H40z" fill="' + c.md + '" stroke="' + c.edge + '"/>' +
        r(58, 46, 96, 8, c.lt, c.edge) + r(58, 88, 96, 8, c.lt, c.edge) +
        r(74, 54, 6, 34, c.dk) + r(132, 54, 6, 34, c.dk) +
        r(150, 50, 8, 22, c.lt, c.edge) +
        '<path d="M40 60v36" stroke="' + c.deep + '" stroke-width="6" stroke-linecap="round"/>' +
        '<circle cx="40" cy="78" r="5" fill="' + c.brass + '"/>' +
        '<circle cx="112" cy="112" r="9" fill="' + c.deep + '"/><circle cx="80" cy="112" r="9" fill="' + c.deep + '"/>';
    },

    glider: function () {
      return bg() +
        '<path d="M26 76h124l16 5-16 5H26z" fill="' + c.md + '" stroke="' + c.edge + '"/>' +
        '<path d="M56 78 88 34h10L74 78z" fill="' + c.lt + '" stroke="' + c.edge + '"/>' +
        '<path d="M56 84 88 122h10L74 84z" fill="' + c.lt + '" stroke="' + c.edge + '" opacity=".9"/>' +
        '<path d="M134 76 148 52h7l-8 24z" fill="' + c.dk + '" stroke="' + c.edge + '"/>' +
        '<path d="M136 86h22l-8 12h-16z" fill="' + c.dk + '" stroke="' + c.edge + '" opacity=".85"/>' +
        '<circle cx="30" cy="81" r="6" fill="' + c.deep + '"/>';
    },

    animalStack: function (p) {
      var n = (p && p.N) || 5, o = bg();
      o += '<path d="M52 112V90c-6-8-8-18-8-26 0-18 16-30 38-30s38 12 38 30v48h-10V96h-10v16h-10V96H72v16z" ' +
        'fill="' + c.md + '" stroke="' + c.edge + '"/>';
      o += '<path d="M44 66c-10 4-14 16-8 26 4 8 12 10 14 2" fill="' + c.dk + '" stroke="' + c.edge + '"/>';
      o += '<path d="M78 62c-8 6-8 20-2 30 4 6 12 4 12-4" fill="' + c.lt + '" stroke="' + c.edge + '" opacity=".9"/>';
      for (var i = 1; i < n; i++) {
        var y = 50 + i * (56 / n);
        o += '<path d="M50 ' + y + 'q34 -7 70 0" stroke="' + c.cream + '" stroke-width="2.2" fill="none" opacity=".95"/>';
      }
      o += '<circle cx="62" cy="60" r="3" fill="' + c.ink + '"/>' + r(40, 112, 96, 8, c.dk);
      return o;
    },

    animalSet: function () {
      var horse = '<path d="M28 108V86h6v14h6V86h10v22h6V80c0-6-4-10-10-10H36l-6-12-6 4 4 10c-4 2-6 6-6 10v26z" ' +
        'fill="' + c.md + '" stroke="' + c.edge + '"/>';
      var bear = '<g transform="translate(66 0)">' +
        '<path d="M18 108V92c-8-3-12-9-12-16 0-11 9-18 20-18s20 7 20 18c0 7-4 13-12 16v16h-6V96h-4v12z" ' +
        'fill="' + c.dk + '" stroke="' + c.edge + '"/>' +
        '<circle cx="14" cy="58" r="5" fill="' + c.dk + '" stroke="' + c.edge + '"/>' +
        '<circle cx="38" cy="58" r="5" fill="' + c.dk + '" stroke="' + c.edge + '"/></g>';
      var bird = '<g transform="translate(130 0)">' +
        '<path d="M6 100c0-16 8-26 22-26 10 0 16 4 20 10l10-6-4 12c2 10-6 18-18 20l-4 8h-6l2-8c-12 0-22-4-22-10z" ' +
        'fill="' + c.lt + '" stroke="' + c.edge + '"/>' +
        '<circle cx="40" cy="86" r="2" fill="' + c.ink + '"/></g>';
      return bg() + horse + bear + bird;
    },

    permanence: function () {
      return bg() + r(46, 40, 78, 62, c.lt, c.edge) + grain(46, 40, 78, 62) +
        '<ellipse cx="85" cy="46" rx="15" ry="6" fill="' + c.deep + '"/>' +
        '<path d="M124 76h34v26h-34z" fill="' + c.md + '" stroke="' + c.edge + '"/>' +
        r(46, 96, 112, 8, c.dk) +
        '<circle cx="140" cy="88" r="10" fill="' + c.red + '"/>' +
        '<path d="M54 74h18v20H54z" fill="' + c.sky + '" opacity=".6"/>';
    },

    pegBox: function (p) {
      var n = (p && p.N) || 3, o = bg() + r(30, 86, 140, 18, c.md, c.edge) + grain(30, 86, 140, 18);
      var cols = [c.red, c.green, c.blue, c.brass, '#7A5A8C', c.deep];
      for (var i = 0; i < n; i++) {
        var x = 30 + (140 / (n + 1)) * (i + 1), rad = 15 - i * (8 / Math.max(1, n)), h = 44 - i * 5;
        o += '<rect x="' + (x - rad) + '" y="' + (94 - h) + '" width="' + (rad * 2) + '" height="' + h +
          '" rx="' + rad + '" fill="' + cols[i % cols.length] + '"/>';
        o += '<ellipse cx="' + x + '" cy="94" rx="' + rad + '" ry="3" fill="' + c.edge + '" opacity=".35"/>';
      }
      return o;
    },

    triangle: function (p) {
      var n = (p && p.N) || 8, o = bg();
      o += '<path d="M40 118 96 26l4 0 56 92" stroke="' + c.dk + '" stroke-width="8" fill="none" stroke-linejoin="round"/>';
      for (var i = 1; i <= n; i++) {
        var t = i / (n + 1), y = 26 + t * 92, half = t * 56;
        o += '<rect x="' + (98 - half) + '" y="' + (y - 3) + '" width="' + (half * 2) + '" height="6" rx="3" fill="' + c.md + '"/>';
      }
      return o;
    },

    arches: function (p) {
      var n = (p && p.N) || 6, o = bg();
      var cols = ['#B4523A', '#C8952E', '#7E8F3F', '#3E6B54', '#4A7292', '#7A5A8C', '#A9743A'];
      for (var i = 0; i < n; i++) {
        var R = 84 - i * (70 / n), t = (70 / n) * 0.72;
        o += '<path d="M' + (100 - R) + ' 116a' + R + ' ' + R + ' 0 0 1 ' + (R * 2) + ' 0h-' + t +
          'a' + (R - t) + ' ' + (R - t) + ' 0 0 0 -' + ((R - t) * 2) + ' 0z" fill="' + cols[i % cols.length] + '"/>';
      }
      return o;
    },

    burr: function () {
      return bg() +
        r(46, 62, 108, 16, c.md, c.edge) + r(46, 62, 108, 16, 'none', c.edge) +
        r(92, 26, 16, 88, c.lt, c.edge) +
        '<g transform="rotate(-28 100 70)">' + r(52, 64, 96, 14, c.dk, c.edge) + '</g>' +
        '<g transform="rotate(28 100 70)">' + r(52, 64, 96, 14, c.md, c.edge) + '</g>' +
        r(92, 56, 16, 28, c.lt, c.edge);
    },

    marbleRun: function (p) {
      var n = (p && p.N) || 6, o = bg() + r(52, 14, 96, 104, '#EADCC0', c.edge);
      for (var i = 0; i < n; i++) {
        var y = 24 + i * (86 / n), left = i % 2 === 0;
        o += '<path d="M' + (left ? 56 : 144) + ' ' + y + 'L' + (left ? 144 : 56) + ' ' + (y + 86 / n - 6) +
          '" stroke="' + c.md + '" stroke-width="7" stroke-linecap="round"/>';
      }
      o += '<circle cx="70" cy="30" r="6" fill="' + c.blue + '"/>' + r(44, 118, 112, 8, c.dk);
      return o;
    },

    tangram: function () {
      var cols = ['#B4523A', '#C8952E', '#3E6B54', '#4A7292', '#A9743A', '#7A5A8C', '#7E8F3F'];
      return bg() + r(56, 14, 96, 96, c.cream, c.edge) +
        '<path d="M56 14h96L104 62z" fill="' + cols[0] + '"/>' +
        '<path d="M56 14v96l48-48z" fill="' + cols[1] + '"/>' +
        '<path d="M56 110h48l-24-24z" fill="' + cols[2] + '"/>' +
        '<path d="M104 62l24 24-24 24h-24z" fill="' + cols[3] + '" opacity=".95"/>' +
        '<path d="M152 14v48l-24-24z" fill="' + cols[4] + '"/>' +
        '<path d="M152 62v48h-24z" fill="' + cols[5] + '"/>' +
        '<path d="M128 38l24 24-24 0z" fill="' + cols[6] + '"/>';
    },

    maze: function () {
      var o = bg() + r(40, 16, 120, 106, c.lt, c.edge) + r(46, 22, 108, 94, c.cream, c.edge);
      o += r(46, 44, 74, 5, c.dk) + r(80, 66, 74, 5, c.dk) + r(46, 88, 60, 5, c.dk);
      o += '<circle cx="128" cy="34" r="8" fill="' + c.ink + '" opacity=".25"/>' +
        '<circle cx="64" cy="78" r="8" fill="' + c.ink + '" opacity=".25"/>' +
        '<circle cx="60" cy="34" r="6" fill="' + c.steel + '" stroke="' + c.ink + '"/>';
      return o;
    },

    planter: function () {
      return bg() + '<path d="M46 60h108l-14 58H60z" fill="' + c.md + '" stroke="' + c.edge + '"/>' +
        grain(56, 70, 88, 40) +
        r(42, 52, 116, 10, c.lt, c.edge) +
        '<path d="M100 52c0-16 12-26 24-28-2 16-10 26-24 28z" fill="' + c.green + '"/>' +
        '<path d="M100 52c0-14-10-24-22-26 2 14 8 24 22 26z" fill="#4E7F62"/>' +
        r(56, 118, 88, 6, c.deep);
    },

    birdhouse: function () {
      return bg() + '<path d="M100 20l58 34H42z" fill="' + c.dk + '" stroke="' + c.edge + '"/>' +
        r(56, 54, 88, 62, c.md, c.edge) + grain(56, 54, 88, 62) +
        '<circle cx="100" cy="76" r="12" fill="' + c.deep + '"/>' +
        '<circle cx="100" cy="76" r="12" fill="none" stroke="' + c.edge + '"/>' +
        r(52, 112, 96, 6, c.dk);
    },

    sawhorse: function () {
      return bg() + r(30, 44, 140, 12, c.md, c.edge) + grain(30, 44, 140, 12) +
        '<path d="M46 56 30 118M64 56l14 62M136 56l16 62M154 56l-14 62" stroke="' + c.dk + '" stroke-width="8" stroke-linecap="round"/>' +
        r(48, 86, 104, 7, c.dk);
    },

    benchHook: function () {
      return bg() + r(34, 62, 132, 14, c.lt, c.edge) + grain(34, 62, 132, 14) +
        r(34, 50, 108, 12, c.md, c.edge) + r(120, 76, 46, 12, c.md, c.edge) +
        '<path d="M96 30v34" stroke="' + c.steel + '" stroke-width="5"/>' +
        '<path d="M92 30h8v10h-8z" fill="' + c.dk + '"/>';
    },

    blocks: function () {
      return bg() + r(46, 78, 34, 34, c.md, c.edge) + r(84, 78, 34, 34, c.dk, c.edge) +
        r(122, 78, 34, 34, c.lt, c.edge) + r(64, 44, 34, 34, c.brass, c.edge) +
        '<circle cx="120" cy="60" r="17" fill="' + c.green + '"/>';
    },

    workbench: function () {
      return bg() + r(24, 52, 152, 14, c.md, c.edge) + grain(24, 52, 152, 14) +
        r(34, 66, 12, 56, c.dk) + r(154, 66, 12, 56, c.dk) + r(46, 96, 108, 8, c.dk) +
        '<path d="M60 40h40v12H60z" fill="' + c.steel + '"/><path d="m96 34 26 18" stroke="' + c.dk + '" stroke-width="6" stroke-linecap="round"/>';
    }
  };

  /* which drawing belongs to which project */
  var BY_ID = {
    'floating-shelf': 'shelf', 'picture-ledge': 'ledge', 'spice-rack': 'spiceRack',
    'bookcase': 'bookcase', 'corner-shelf': 'corner', 'wall-cabinet': 'cabinet',
    'nightstand': 'drawers', 'dresser-3': 'drawers', 'toy-chest': 'chest', 'shoe-bench': 'shoeBench',
    'dining-table': 'table', 'coffee-table': 'table', 'side-table': 'table',
    'desk': 'desk', 'kids-table': 'kidsTable',
    'push-racer': 'car', 'truck-trailer': 'truck', 'biplane': 'plane', 'glider': 'glider',
    'stacking-animal': 'animalStack', 'animal-set': 'animalSet',
    'object-permanence': 'permanence', 'peg-box': 'pegBox', 'pikler': 'triangle',
    'rainbow-stacker': 'arches', 'burr-puzzle': 'burr', 'marble-run': 'marbleRun',
    'tangram': 'tangram', 'tilt-maze': 'maze',
    'planter': 'planter', 'garden-bench': 'bench', 'birdhouse': 'birdhouse',
    'bench-hook': 'benchHook', 'sawhorse': 'sawhorse',
    'feed-step-stool': 'workbench', 'feed-domino-set': 'blocks'
  };
  var BY_CAT = {
    shelving: 'shelf', storage: 'drawers', tables: 'table',
    toys: 'blocks', outdoor: 'planter', shop: 'workbench'
  };

  window.projectArt = function (project, params, cls) {
    if (project.photo) {
      return '<img class="art-photo ' + (cls || '') + '" src="' + project.photo + '" alt="">';
    }
    var key = BY_ID[project.id] || BY_CAT[project.cat] || 'workbench';
    var draw = art[key] || art.workbench;
    return '<svg class="art-figure ' + (cls || '') + '" viewBox="0 0 ' + W + ' ' + H + '" ' +
      'preserveAspectRatio="xMidYMid slice" role="img" aria-label="Illustration of ' +
      (project.title || 'the project').replace(/"/g, '') + '">' + draw(params || {}) + '</svg>';
  };
})();
