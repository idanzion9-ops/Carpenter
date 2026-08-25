/* Carpenter — app shell, router and views. Plain ES5-ish JS, no build step. */
(function () {
  var app = document.getElementById('app');
  var S = function () { return Store.state.settings; };

  /* ---------------- helpers ---------------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function L(mm) { return Calc.len(mm, S().unit); }
  function money(n) { return S().currency + (Math.round(n * 100) / 100).toFixed(2); }
  function toast(msg) {
    var t = document.createElement('div');
    t.className = 'toast'; t.textContent = msg; document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2400);
  }
  function levelDots(n) {
    var out = '<span class="level" title="Difficulty ' + n + ' of 5">';
    for (var i = 1; i <= 5; i++) out += '<i class="' + (i <= n ? 'on' : '') + '"></i>';
    return out + '</span>';
  }
  function isCount(label) { return /number|shelves|drawers|rungs|pieces|pegs|animals|arches|ramps/i.test(label); }
  function catName(id) {
    var c = CATEGORIES.filter(function (x) { return x.id === id; })[0];
    return c ? c.name : id;
  }

  /* A personal or imported project is stored as plain data; wrap it so the
     rest of the app can treat it exactly like a built-in project. */
  function normalize(p) {
    if (typeof p.parts === 'function') return p;
    var partList = p.partList || [];
    var copy = Object.assign({}, p);
    copy.paramDefs = p.paramDefs || [];
    copy.parts = function () { return partList; };
    copy.hardware = function () { return p.hardwareList || []; };
    copy.tools = p.tools || { req: [], nice: [] };
    copy.steps = p.steps || [];
    return copy;
  }

  function allProjects() {
    var mine = (Store.state.mine || []).map(normalize);
    var imported = (Store.state.imported || []).map(normalize);
    return PROJECTS.concat(mine, imported);
  }
  function findProject(id) {
    var hit = allProjects().filter(function (p) { return p.id === id; })[0];
    return hit || null;
  }

  function toolMatch(project) {
    var req = (project.tools && project.tools.req) || [];
    var missing = req.filter(function (t) { return !Store.owns(t); });
    return { req: req, missing: missing, ready: missing.length === 0 };
  }

  /* ---------------- cut list ticket ---------------- */
  function ticketHTML(project, params, compact) {
    var res = Calc.cutList(project, params, S());
    var rows = res.parts.map(function (p) {
      var size = p.stock === 'dowel'
        ? '⌀' + L(p.d) + ' × ' + L(p.l)
        : L(p.t) + ' × ' + L(p.w) + ' × ' + L(p.l);
      return '<tr><td>' + esc(p.name) + '</td><td class="num qty">' + p.qty + '</td><td class="num">' + size + '</td></tr>';
    }).join('');

    var stockRows = '';
    res.boards.forEach(function (b) {
      stockRows += '<tr><td>Solid ' + L(b.t) + ' × ' + L(b.w) + '</td><td class="num qty">' + b.rawSticks + '</td>' +
        '<td class="num">' + (b.rawSticks) + ' × ' + L(S().stockLength) + ' lengths</td></tr>';
    });
    res.panels.forEach(function (p) {
      stockRows += '<tr><td>Sheet ' + L(p.t) + '</td><td class="num qty">' + p.sheetsUp + '</td>' +
        '<td class="num">' + p.m2.toFixed(2) + ' m² needed</td></tr>';
    });
    res.dowels.forEach(function (d) {
      stockRows += '<tr><td>Dowel ⌀' + L(d.d) + '</td><td class="num qty">' + d.sticks + '</td>' +
        '<td class="num">' + L(d.total) + ' total</td></tr>';
    });

    var hw = (project.hardware ? project.hardware(params) : []).map(function (h) {
      return '<tr><td>' + esc(h.name) + '</td><td class="num qty">' + h.qty + '</td><td class="num">—</td></tr>';
    }).join('');

    var html =
      '<div class="ticket">' +
      '<div class="ticket-head"><span>Cut list</span><b>' + esc(project.title) + '</b></div>' +
      '<table><thead><tr><th>Part</th><th class="num">Qty</th><th class="num">' +
      (S().unit === 'imperial' ? 'T × W × L (in)' : 'T × W × L (mm)') + '</th></tr></thead><tbody>' +
      rows + '</tbody></table>';

    if (!compact) {
      html += '<table><thead><tr><th>Buy this</th><th class="num">Qty</th><th class="num">Notes</th></tr></thead><tbody>' +
        stockRows + (hw ? hw : '') + '</tbody></table>';

      html += '<div class="totals" style="padding:14px 16px 0">' +
        '<div><span>Pieces</span><b>' + res.totals.pieces + '</b></div>' +
        (res.totals.boardFeet > 0 ? '<div><span>Board feet</span><b>' + res.totals.boardFeet.toFixed(1) + '</b></div>' : '') +
        (res.totals.m3 > 0 ? '<div><span>Solid volume</span><b>' + (res.totals.m3 * 1000).toFixed(1) + ' L</b></div>' : '') +
        (res.totals.sheets > 0 ? '<div><span>Sheets</span><b>' + res.totals.sheets + '</b></div>' : '') +
        (res.totals.cost > 0 ? '<div><span>Est. material</span><b>' + money(res.totals.cost) + '</b></div>' : '') +
        '<div><span>Rough weight</span><b>' + res.totals.weightKg.toFixed(1) + ' kg</b></div>' +
        '</div>';

      if (res.oversize.length) {
        html += '<div style="padding:14px 16px 0"><div class="note-strip">Longer than your stock: ' +
          esc(res.oversize.join(', ')) + '. Either buy longer stock or join these parts.</div></div>';
      }
      html += '<div style="padding:12px 16px 0;font-family:var(--f-mono);font-size:.66rem;color:var(--ink-3)">' +
        'Includes ' + S().waste + '% waste · ' + L(S().kerf) + ' kerf · stock ' + L(S().stockLength) + '</div>';
    }
    return html + '</div>';
  }

  /* ---------------- views ---------------- */
  function viewHome() {
    var featured = PROJECT_BY_ID['floating-shelf'];
    var beginner = allProjects().filter(function (p) { return p.level === 1; }).slice(0, 4);
    var ready = allProjects().filter(function (p) { return toolMatch(p).ready; }).length;

    return '' +
      '<section class="hero"><div class="wrap hero-grid">' +
        '<div>' +
          '<span class="eyebrow">Plan · Measure · Cut · Assemble</span>' +
          '<h1>Every project, costed down to the last board.</h1>' +
          '<p class="lead">Pick a project, set the size you actually want, and Carpenter rewrites the cut list, the stock to buy and the tools you need. Mark what is already on your pegboard and it will tell you what to do about the rest.</p>' +
          '<div class="hero-actions">' +
            '<a class="btn" href="#/browse">Browse projects</a>' +
            '<a class="btn ghost" href="#/workshop">Set up my workshop</a>' +
          '</div>' +
          '<p style="margin-top:22px;font-family:var(--f-mono);font-size:.74rem;color:var(--ink-3)">' +
            allProjects().length + ' projects · ' + TOOLS.length + ' tools · ' + ready + ' buildable with the tools you own</p>' +
        '</div>' +
        '<div>' + ticketHTML(featured, Store.params(featured), true) +
          '<p style="margin-top:26px;font-family:var(--f-mono);font-size:.7rem;color:var(--ink-3)">Live example: ' +
          esc(featured.title) + ' at ' + L(Store.params(featured).L) + '. Change any dimension and this list rewrites itself.</p>' +
        '</div>' +
      '</div></section>' +

      '<section class="section"><div class="wrap">' +
        '<div class="sec-head"><div><span class="kicker">Workshop</span><h2>What are you building?</h2></div></div>' +
        '<div class="grid">' + CATEGORIES.map(function (c) {
          var n = allProjects().filter(function (p) { return p.cat === c.id; }).length;
          return '<a class="card" href="#/browse?cat=' + c.id + '">' +
            '<span class="cat">' + n + ' projects</span><h3>' + esc(c.name) + '</h3>' +
            '<p>' + esc(c.blurb) + '</p></a>';
        }).join('') + '</div>' +
      '</div></section>' +

      '<section class="section"><div class="wrap">' +
        '<div class="sec-head"><div><span class="kicker">Toys</span><h2>The toy shelf</h2>' +
        '<p>Small stock, tight tolerances and finishes a child can chew on. Sorted by what the toy teaches.</p></div>' +
        '<a class="btn ghost small" href="#/browse?cat=toys">See all toys</a></div>' +
        '<div class="filters">' + SUBCATS.map(function (s) {
          return '<a class="chip" href="#/browse?cat=toys&sub=' + s.id + '">' + esc(s.name) + '</a>';
        }).join('') + '</div>' +
        '<div class="grid">' + allProjects().filter(function (p) { return p.cat === 'toys'; }).slice(0, 4).map(cardHTML).join('') + '</div>' +
      '</div></section>' +

      '<section class="section"><div class="wrap">' +
        '<div class="sec-head"><div><span class="kicker">Start here</span><h2>One evening, one tool kit</h2>' +
        '<p>Level one projects. Hand tools only, no jointer, no table saw.</p></div></div>' +
        '<div class="grid">' + beginner.map(cardHTML).join('') + '</div>' +
      '</div></section>';
  }

  function cardHTML(p) {
    var m = toolMatch(p);
    var status = Store.statusOf(p.id);
    return '<a class="card" href="#/project/' + p.id + '">' +
      '<span class="figure">' + projectArt(p, Store.params(p)) + '</span>' +
      '<span class="cat">' + esc(catName(p.cat)) + (p.sub ? ' · ' + esc(p.sub) : '') + '</span>' +
      '<h3>' + esc(p.title) + '</h3>' +
      '<p>' + esc(p.blurb || '') + '</p>' +
      '<div class="meta">' + levelDots(p.level || 1) + '<span>' + esc(p.hours || '') + '</span>' +
      (p.mine ? '<span class="pill mine">Mine</span>' : '') +
      (p.feed ? '<span class="pill">Feed</span>' : '') +
      (status ? '<span class="pill">' + esc(status) + '</span>' : '') +
      (m.req.length ? (m.ready ? '<span class="pill ok">Tools ready</span>'
        : '<span class="pill warn">' + m.missing.length + ' tool' + (m.missing.length > 1 ? 's' : '') + ' short</span>') : '') +
      '</div></a>';
  }

  function viewBrowse(query) {
    var cat = query.cat || '', sub = query.sub || '', q = (query.q || '').toLowerCase();
    var onlyReady = query.ready === '1';
    var list = allProjects().filter(function (p) {
      if (cat && p.cat !== cat) return false;
      if (sub && p.sub !== sub) return false;
      if (onlyReady && !toolMatch(p).ready) return false;
      if (q && (p.title + ' ' + (p.blurb || '') + ' ' + (p.wood || '')).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });

    function chip(label, params) {
      var on = (params.cat || '') === cat && (params.sub || '') === sub;
      var href = '#/browse?' + serialize(Object.assign({ q: query.q, ready: query.ready }, params));
      return '<a class="chip ' + (on ? 'on' : '') + '" href="' + href + '">' + esc(label) + '</a>';
    }

    return '<section class="section"><div class="wrap">' +
      '<div class="sec-head"><div><span class="kicker">Catalogue</span><h2>' +
      (cat ? esc(catName(cat)) : 'All projects') + '</h2>' +
      '<p>' + list.length + ' projects. Set a size on any of them and the cut list follows.</p></div>' +
      '<a class="btn ghost small" href="#/mine/new">Add my own project</a></div>' +

      '<div class="filters">' + chip('Everything', {}) +
        CATEGORIES.map(function (c) { return chip(c.name, { cat: c.id }); }).join('') +
      '</div>' +
      (cat === 'toys' ? '<div class="filters">' +
        SUBCATS.map(function (s) { return chip(s.name, { cat: 'toys', sub: s.id }); }).join('') + '</div>' : '') +

      '<div class="filters">' +
        '<input type="text" id="search" placeholder="Search projects" value="' + esc(query.q || '') + '" style="max-width:260px">' +
        '<a class="chip ' + (onlyReady ? 'on' : '') + '" href="#/browse?' +
          serialize({ cat: cat, sub: sub, q: query.q, ready: onlyReady ? '' : '1' }) + '">Only what I can build today</a>' +
      '</div>' +

      (list.length ? '<div class="grid">' + list.map(cardHTML).join('') + '</div>'
        : '<div class="empty"><h3>Nothing matches that yet</h3><p>Clear a filter, or add the project yourself.</p>' +
          '<a class="btn" href="#/mine/new">Add a project</a></div>') +
      '</div></section>';
  }

  function viewProject(id) {
    var project = findProject(id);
    if (!project) return '<section class="section"><div class="wrap"><div class="empty"><h3>That project isn\'t here</h3>' +
      '<a class="btn" href="#/browse">Back to the catalogue</a></div></div></section>';

    var params = Store.params(project);
    var m = toolMatch(project);
    var status = Store.statusOf(project.id);

    var dims = (project.paramDefs || []).map(function (d) {
      return '<div class="dimrow"><label for="p_' + d.k + '">' + esc(d.label) + '</label>' +
        '<output id="o_' + d.k + '">' + (isCount(d.label) ? params[d.k] : L(params[d.k])) + '</output>' +
        '<input type="range" id="p_' + d.k + '" data-param="' + d.k + '" min="' + d.min + '" max="' + d.max + '" step="' + d.step + '" value="' + params[d.k] + '">' +
        '</div>';
    }).join('');

    var toolsHTML = m.req.map(function (tid) {
      var t = TOOL_BY_ID[tid];
      if (!t) return '';
      var have = Store.owns(tid);
      var block = '<div class="toolrow ' + (have ? '' : 'missing') + '">' + toolArt(tid) +
        '<span class="name">' + esc(t.name) + '</span>' +
        '<span class="grab">' + (have
          ? '<span class="pill ok">On my board</span>'
          : '<button class="btn ghost small" data-action="own" data-tool="' + tid + '">I have this</button>') + '</span></div>';
      if (!have) {
        block += t.alt && t.alt.length
          ? '<ul class="alts">' + t.alt.map(function (a) {
              return '<li><b>' + esc(a.t) + '</b> — ' + esc(a.n) + '</li>';
            }).join('') + '</ul>'
          : '<ul class="alts"><li>No good substitute for this one. Borrow it, hire it, or pick a different project.</li></ul>';
      }
      return block;
    }).join('');

    var niceHTML = ((project.tools && project.tools.nice) || []).map(function (tid) {
      var t = TOOL_BY_ID[tid]; if (!t) return '';
      return '<div class="toolrow">' + toolArt(tid) + '<span class="name">' + esc(t.name) + '</span>' +
        '<span class="grab pill">' + (Store.owns(tid) ? 'Owned' : 'Speeds things up') + '</span></div>';
    }).join('');

    return '<section class="section"><div class="wrap">' +
      '<div class="crumbs"><a href="#/browse">Catalogue</a> / <a href="#/browse?cat=' + project.cat + '">' + esc(catName(project.cat)) + '</a></div>' +
      '<div class="sec-head"><div>' +
        '<h1 style="margin-bottom:8px">' + esc(project.title) + '</h1>' +
        '<p style="max-width:62ch">' + esc(project.blurb || '') + '</p>' +
        '<div class="meta" style="display:flex;gap:14px;align-items:center;flex-wrap:wrap;font-family:var(--f-mono);font-size:.72rem;color:var(--ink-3)">' +
          levelDots(project.level || 1) + '<span>' + esc(project.hours || '') + '</span>' +
          (project.wood ? '<span>' + esc(project.wood) + '</span>' : '') +
          (project.mine ? '<span class="pill mine">My project</span>' : '') +
        '</div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
        ['planned', 'building', 'built'].map(function (st) {
          return '<button class="chip ' + (status === st ? 'on' : '') + '" data-action="status" data-status="' + st + '">' + st + '</button>';
        }).join('') +
        '<button class="btn ghost small" data-action="print">Print</button>' +
        (project.mine ? '<button class="btn danger small" data-action="delete-mine" data-id="' + project.id + '">Delete</button>' : '') +
      '</div></div>' +

      '<div class="detail-grid">' +
        '<div>' +
          '<div class="hero-figure" id="hero-art">' + projectArt(project, params) + '</div>' +
          '<span class="figure-note">' + (project.photo ? 'Your photo' :
            'Illustration — drawn from the dimensions below') + '</span>' +
          (project.paramDefs && project.paramDefs.length ? '<div class="panel" style="margin-top:18px"><h3>Size it for your room</h3>' +
            dims + '<button class="btn ghost small" data-action="reset-params">Back to standard size</button></div>' : '') +
          '<div class="panel" id="cutlist" style="padding:0;border:0;background:none">' + ticketHTML(project, params) + '</div>' +
        '</div>' +

        '<div>' +
          '<div class="panel"><h3>Tools for this build</h3>' +
            (m.ready
              ? '<div class="note-strip brass" style="margin-bottom:14px">Everything this needs is already on your pegboard.</div>'
              : '<div class="note-strip" style="margin-bottom:14px">You are ' + m.missing.length + ' tool' + (m.missing.length > 1 ? 's' : '') +
                ' short. Each one below has a way around it.</div>') +
            toolsHTML +
            (niceHTML ? '<h3 style="margin-top:18px">Nice to have</h3>' + niceHTML : '') +
            '<p style="margin-top:16px"><a class="btn ghost small" href="#/workshop">Edit my tools</a></p>' +
          '</div>' +

          (project.steps && project.steps.length ? '<div class="panel"><h3>How it goes together</h3>' +
            '<p class="step-hint">Tap a number for a diagram of the technique</p>' +
            '<ol class="steps">' + project.steps.map(function (text, i) {
              var art = stepArt(text);
              var n = (i + 1) < 10 ? '0' + (i + 1) : String(i + 1);
              return '<li>' +
                '<button class="step-no" data-action="step-art" data-i="' + i + '" ' +
                  'aria-expanded="false" aria-label="Show a diagram for step ' + (i + 1) + '">' + n + '</button>' +
                '<div class="step-body"><p>' + esc(text) + '</p>' +
                  '<figure class="step-fig" id="fig-' + i + '" hidden>' + art.svg +
                  '<figcaption>' + esc(art.title) + '</figcaption></figure></div></li>';
            }).join('') + '</ol></div>' : '') +

          (project.finish || project.safety ? '<div class="panel">' +
            (project.finish ? '<h3>Finish</h3><p>' + esc(project.finish) + '</p>' : '') +
            (project.safety ? '<h3>Watch out for</h3><div class="note-strip">' + esc(project.safety) + '</div>' : '') +
            (project.source ? '<p style="margin-top:14px;font-size:.85rem">Further reading: <a href="' + esc(project.source.url) +
              '" target="_blank" rel="noopener">' + esc(project.source.label) + '</a></p>' : '') +
            '</div>' : '') +

          '<div class="panel"><h3>My notes</h3>' +
            '<textarea id="note" placeholder="Timber yard prices, mistakes to avoid next time, the finish you actually used…">' +
            esc(Store.noteOf(project.id)) + '</textarea>' +
            '<button class="btn small" data-action="save-note" style="margin-top:10px">Save note</button></div>' +
        '</div>' +
      '</div></div></section>';
  }

  function viewWorkshop() {
    var owned = Store.ownedCount();
    var buildable = allProjects().filter(function (p) { return toolMatch(p).ready; }).length;

    var groups = TOOL_GROUPS.map(function (g) {
      var tools = TOOLS.filter(function (t) { return t.group === g.id; });
      return '<div class="peg-group"><h3>' + esc(g.name) + '</h3><div class="pegs">' +
        tools.map(function (t) {
          var on = Store.owns(t.id);
          return '<div class="peg-wrap ' + (on ? 'on' : '') + '">' +
            '<button class="peg ' + (on ? 'on' : '') + '" data-action="toggle-tool" data-tool="' + t.id + '" ' +
            'aria-pressed="' + on + '">' + toolArt(t.id) + '<span>' + esc(t.name) + '</span></button>' +
            '<span class="tick">✓</span></div>';
        }).join('') + '</div></div>';
    }).join('');

    return '<section class="section"><div class="wrap">' +
      '<div class="sec-head"><div><span class="kicker">My workshop</span><h2>What is on your pegboard?</h2>' +
      '<p>Tap a tool to hang it up. Projects then tell you what you are missing and what to reach for instead.</p></div></div>' +
      '<div class="shop-summary">' +
        '<span><b>' + owned + '</b> / ' + TOOLS.length + ' tools owned</span>' +
        '<span><b>' + buildable + '</b> projects you can start today</span>' +
        '<span style="margin-left:auto;display:flex;gap:8px">' +
          '<button class="btn ghost small" data-action="basics">Tick the basic kit</button>' +
          '<button class="btn ghost small" data-action="clear-tools">Clear all</button>' +
        '</span>' +
      '</div>' +
      '<div class="pegboard">' + groups + '</div>' +
      '</div></section>';
  }

  function viewMine() {
    var mine = Store.state.mine || [];
    return '<section class="section"><div class="wrap">' +
      '<div class="sec-head"><div><span class="kicker">My bench</span><h2>My projects</h2>' +
      '<p>Your own builds, with the same cut-list maths as the catalogue.</p></div>' +
      '<a class="btn" href="#/mine/new">Add a project</a></div>' +
      (mine.length
        ? '<div class="grid">' + mine.map(normalize).map(cardHTML).join('') + '</div>'
        : '<div class="empty"><h3>Nothing on the bench yet</h3>' +
          '<p>Add a build with its own parts list and Carpenter will cost it out like the rest.</p>' +
          '<a class="btn" href="#/mine/new">Add my first project</a></div>') +
      '</div></section>';
  }

  function partRow(i, p) {
    p = p || {};
    return '<div class="row4" data-part-row="' + i + '">' +
      '<label class="field" style="margin:0"><span>Part name</span><input type="text" data-f="name" value="' + esc(p.name || '') + '"></label>' +
      '<label class="field" style="margin:0"><span>Qty</span><input type="number" data-f="qty" min="1" value="' + (p.qty || 1) + '"></label>' +
      '<label class="field" style="margin:0"><span>Thick</span><input type="number" data-f="t" value="' + (p.t || 18) + '"></label>' +
      '<label class="field" style="margin:0"><span>Width</span><input type="number" data-f="w" value="' + (p.w || 100) + '"></label>' +
      '<label class="field" style="margin:0"><span>Length</span><input type="number" data-f="l" value="' + (p.l || 500) + '"></label>' +
      '<label class="field" style="margin:0"><span>Stock</span><select data-f="stock">' +
        ['board', 'panel', 'dowel'].map(function (s) {
          return '<option value="' + s + '"' + (p.stock === s ? ' selected' : '') + '>' + s + '</option>';
        }).join('') + '</select></label>' +
      '<button class="btn ghost small" data-action="drop-row">Remove</button>' +
      '</div>';
  }

  function viewNewProject() {
    return '<section class="section"><div class="wrap" style="max-width:820px">' +
      '<div class="crumbs"><a href="#/mine">My projects</a> / New</div>' +
      '<h2>Add a project</h2>' +
      '<p>Everything is saved in this browser only. Export it from Settings if you want a copy.</p>' +
      '<div class="panel">' +
        '<label class="field"><span>Project name</span><input type="text" id="f-title" placeholder="Workshop stool"></label>' +
        '<div class="row2">' +
          '<label class="field"><span>Category</span><select id="f-cat">' +
            CATEGORIES.map(function (c) { return '<option value="' + c.id + '">' + esc(c.name) + '</option>'; }).join('') +
          '</select></label>' +
          '<label class="field"><span>Toy type (only for toys)</span><select id="f-sub"><option value="">—</option>' +
            SUBCATS.map(function (s) { return '<option value="' + s.id + '">' + esc(s.name) + '</option>'; }).join('') +
          '</select></label>' +
        '</div>' +
        '<div class="row2">' +
          '<label class="field"><span>Difficulty 1–5</span><input type="number" id="f-level" min="1" max="5" value="2"></label>' +
          '<label class="field"><span>Rough time</span><input type="text" id="f-hours" placeholder="6 h"></label>' +
        '</div>' +
        '<label class="field"><span>Wood</span><input type="text" id="f-wood" placeholder="Pine, 18 mm"></label>' +
        '<label class="field"><span>Description</span><textarea id="f-blurb" placeholder="What it is and why you built it"></textarea></label>' +
        '<label class="field"><span>Photo (kept on this device)</span><input type="file" id="f-photo" accept="image/*"></label>' +
        '<div id="photo-preview"></div>' +
      '</div>' +

      '<div class="panel"><h3>Parts list</h3>' +
        '<p style="font-size:.88rem;color:var(--ink-2)">Sizes in millimetres. For dowels, put the diameter in the Thick box.</p>' +
        '<div id="parts">' + partRow(0) + partRow(1) + '</div>' +
        '<button class="btn ghost small" data-action="add-row">Add a part</button>' +
      '</div>' +

      '<div class="panel"><h3>Tools this needs</h3>' +
        '<div class="filters" id="tool-picker">' + TOOLS.map(function (t) {
          return '<button type="button" class="chip" data-pick-tool="' + t.id + '">' + esc(t.name) + '</button>';
        }).join('') + '</div>' +
      '</div>' +

      '<div class="panel"><h3>Steps</h3>' +
        '<label class="field"><span>One step per line</span><textarea id="f-steps" style="min-height:140px"></textarea></label>' +
        '<label class="field"><span>Finish</span><input type="text" id="f-finish"></label>' +
        '<label class="field"><span>Watch out for</span><input type="text" id="f-safety"></label>' +
      '</div>' +

      '<div style="display:flex;gap:10px"><button class="btn" data-action="save-project">Save project</button>' +
      '<a class="btn ghost" href="#/mine">Cancel</a></div>' +
      '</div></section>';
  }

  function nativeVersionLine() {
    var nb = nativeBridge();
    if (!nb) return '';
    try { return ' · app shell <b>' + esc(nb.appVersion()) + '</b>'; } catch (e) { return ''; }
  }

  function viewSettings() {
    var s = S();
    var feeds = (Store.state.feeds || []).map(function (f, i) {
      return '<div class="toolrow"><span class="name" style="font-family:var(--f-mono);font-size:.8rem;word-break:break-all">' +
        esc(f) + '</span><span class="grab"><button class="btn ghost small" data-action="drop-feed" data-i="' + i + '">Remove</button></span></div>';
    }).join('');

    return '<section class="section"><div class="wrap" style="max-width:820px">' +
      '<h2>Settings</h2>' +

      '<div class="panel"><h3>Units and stock</h3>' +
        '<div class="row2">' +
          '<label class="field"><span>Units</span><select data-set="unit">' +
            '<option value="metric"' + (s.unit === 'metric' ? ' selected' : '') + '>Millimetres</option>' +
            '<option value="imperial"' + (s.unit === 'imperial' ? ' selected' : '') + '>Inches</option>' +
          '</select></label>' +
          '<label class="field"><span>Waste allowance %</span><input type="number" data-set="waste" value="' + s.waste + '"></label>' +
          '<label class="field"><span>Saw kerf (mm)</span><input type="number" data-set="kerf" value="' + s.kerf + '"></label>' +
          '<label class="field"><span>Board length sold (mm)</span><input type="number" data-set="stockLength" value="' + s.stockLength + '"></label>' +
          '<label class="field"><span>Sheet width (mm)</span><input type="number" data-set="sheetW" value="' + s.sheetW + '"></label>' +
          '<label class="field"><span>Sheet length (mm)</span><input type="number" data-set="sheetL" value="' + s.sheetL + '"></label>' +
        '</div>' +
      '</div>' +

      '<div class="panel"><h3>Prices, for the estimate</h3>' +
        '<div class="row2">' +
          '<label class="field"><span>Currency symbol</span><input type="text" data-set="currency" value="' + esc(s.currency) + '"></label>' +
          '<label class="field"><span>Per board foot</span><input type="number" step="0.01" data-set="price.boardFoot" value="' + s.price.boardFoot + '"></label>' +
          '<label class="field"><span>Per sheet</span><input type="number" step="0.01" data-set="price.sheet" value="' + s.price.sheet + '"></label>' +
          '<label class="field"><span>Per dowel length</span><input type="number" step="0.01" data-set="price.dowel" value="' + s.price.dowel + '"></label>' +
        '</div>' +
      '</div>' +

      '<div class="panel"><h3>Project feeds</h3>' +
        '<p style="font-size:.9rem;color:var(--ink-2)">Carpenter loads extra projects from any JSON file you point it at — your own repo, a friend\'s, or a shared list. Files must allow cross-origin reads.</p>' +
        feeds +
        '<label class="field" style="margin-top:12px"><span>Add a feed URL</span><input type="url" id="feed-url" placeholder="https://example.com/projects.json"></label>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
          '<button class="btn small" data-action="add-feed">Add feed</button>' +
          '<button class="btn ghost small" data-action="sync-feeds">Fetch projects now</button>' +
        '</div>' +
        '<p style="margin-top:10px;font-family:var(--f-mono);font-size:.72rem;color:var(--ink-3)">' +
          (Store.state.imported || []).length + ' projects currently loaded from feeds</p>' +
      '</div>' +

      '<div class="panel"><h3>App version</h3>' +
        '<p style="font-family:var(--f-mono);font-size:.82rem;margin-bottom:6px">Content: <b>' +
          esc(window.APP_VERSION || 'unknown') + '</b>' + nativeVersionLine() + '</p>' +
        '<p style="font-size:.9rem;color:var(--ink-2)">' + (nativeBridge()
          ? 'The Android app checks the repository on every launch, downloads any new version of the app itself and swaps it in. ' +
            'You never reinstall, and your tools, dimensions, notes and projects are untouched.'
          : 'Carpenter updates itself. When a new version is pushed to the repository, the app picks it up the next time you open it ' +
            'and offers to switch over — there is no need to uninstall anything, and nothing you have saved is lost.') + '</p>' +
        '<button class="btn small" data-action="check-update">Check for updates</button>' +
      '</div>' +

      '<div class="panel"><h3>My data</h3>' +
        '<p style="font-size:.9rem;color:var(--ink-2)">Tools, sizes, notes and projects live in this browser. Export before you clear it.</p>' +
        '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
          '<button class="btn small" data-action="export">Export a backup</button>' +
          '<label class="btn ghost small" style="cursor:pointer">Import a backup<input type="file" id="import-file" accept="application/json" hidden></label>' +
          '<button class="btn danger small" data-action="reset">Erase everything</button>' +
        '</div>' +
      '</div>' +
      '</div></section>';
  }

  /* ---------------- routing ---------------- */
  function parseHash() {
    var h = location.hash.replace(/^#/, '') || '/';
    var qi = h.indexOf('?');
    var path = qi > -1 ? h.slice(0, qi) : h;
    var query = {};
    if (qi > -1) h.slice(qi + 1).split('&').forEach(function (kv) {
      var b = kv.split('=');
      if (b[0]) query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
    });
    return { path: path, query: query };
  }
  function serialize(o) {
    return Object.keys(o).filter(function (k) { return o[k]; })
      .map(function (k) { return encodeURIComponent(k) + '=' + encodeURIComponent(o[k]); }).join('&');
  }

  var pickedTools = [];

  function render() {
    var r = parseHash(), html;
    if (r.path === '/' || r.path === '') html = viewHome();
    else if (r.path === '/browse') html = viewBrowse(r.query);
    else if (r.path.indexOf('/project/') === 0) html = viewProject(r.path.slice(9));
    else if (r.path === '/workshop') html = viewWorkshop();
    else if (r.path === '/mine') html = viewMine();
    else if (r.path === '/mine/new') { pickedTools = []; html = viewNewProject(); }
    else if (r.path === '/settings') html = viewSettings();
    else html = '<section class="section"><div class="wrap"><div class="empty"><h3>Nothing here</h3>' +
      '<a class="btn" href="#/">Back to the workshop</a></div></div></section>';

    app.innerHTML = html;
    document.querySelectorAll('.nav a').forEach(function (a) {
      var href = a.getAttribute('href');
      a.classList.toggle('on', href === location.hash || href === '#' + r.path);
    });
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  /* ---------------- events ---------------- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-action]');
    var pick = e.target.closest('[data-pick-tool]');
    var r = parseHash();

    if (pick) {
      var tid = pick.getAttribute('data-pick-tool');
      var at = pickedTools.indexOf(tid);
      if (at > -1) pickedTools.splice(at, 1); else pickedTools.push(tid);
      pick.classList.toggle('on');
      return;
    }
    if (!btn) return;
    var action = btn.getAttribute('data-action');

    if (action === 'toggle-tool') {
      Store.toggleTool(btn.getAttribute('data-tool'));
      render();
    }
    else if (action === 'own') {
      Store.toggleTool(btn.getAttribute('data-tool'));
      toast('Added to your pegboard');
      render();
    }
    else if (action === 'basics') {
      Store.setAllTools(TOOLS.filter(function (t) { return t.basic; }).map(function (t) { return t.id; }), true);
      render();
    }
    else if (action === 'clear-tools') {
      Store.setAllTools(TOOLS.map(function (t) { return t.id; }), false);
      render();
    }
    else if (action === 'status') {
      Store.setStatus(r.path.slice(9), btn.getAttribute('data-status'));
      render();
    }
    else if (action === 'reset-params') { Store.resetParams(r.path.slice(9)); render(); }
    else if (action === 'save-note') {
      Store.setNote(r.path.slice(9), document.getElementById('note').value);
      toast('Note saved');
    }
    else if (action === 'step-art') {
      var fig = document.getElementById('fig-' + btn.getAttribute('data-i'));
      if (fig) {
        var open = fig.hasAttribute('hidden');
        if (open) fig.removeAttribute('hidden'); else fig.setAttribute('hidden', '');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
    }
    else if (action === 'print') window.print();
    else if (action === 'delete-mine') {
      if (confirm('Delete this project? This cannot be undone.')) {
        Store.removeMine(btn.getAttribute('data-id'));
        location.hash = '#/mine';
      }
    }
    else if (action === 'add-row') {
      var host = document.getElementById('parts');
      host.insertAdjacentHTML('beforeend', partRow(host.children.length));
    }
    else if (action === 'drop-row') btn.closest('[data-part-row]').remove();
    else if (action === 'save-project') saveProject();
    else if (action === 'add-feed') {
      var url = document.getElementById('feed-url').value.trim();
      if (url) { Store.state.feeds.push(url); Store.save(); render(); toast('Feed added'); }
    }
    else if (action === 'drop-feed') {
      Store.state.feeds.splice(+btn.getAttribute('data-i'), 1); Store.save(); render();
    }
    else if (action === 'sync-feeds') syncFeeds();
    else if (action === 'apply-update') applyUpdate();
    else if (action === 'dismiss-update') { var b = document.querySelector('.updatebar'); if (b) b.remove(); }
    else if (action === 'check-update') checkForUpdates();
    else if (action === 'export') {
      var blob = new Blob([Store.exportJSON()], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'carpenter-backup.json';
      a.click();
    }
    else if (action === 'reset') {
      if (confirm('Erase all tools, sizes, notes and projects?')) { Store.reset(); render(); toast('Everything cleared'); }
    }
  });

  /* live dimension sliders */
  document.addEventListener('input', function (e) {
    var t = e.target;
    if (t.dataset && t.dataset.param) {
      var r = parseHash();
      var id = r.path.slice(9);
      var project = findProject(id);
      Store.setParam(id, t.dataset.param, +t.value);
      var params = Store.params(project);
      var out = document.getElementById('o_' + t.dataset.param);
      var def = project.paramDefs.filter(function (d) { return d.k === t.dataset.param; })[0];
      if (out) out.textContent = isCount(def.label) ? params[t.dataset.param] : L(params[t.dataset.param]);
      document.getElementById('cutlist').innerHTML = ticketHTML(project, params);
      var hero = document.getElementById('hero-art');
      if (hero && !project.photo) hero.innerHTML = projectArt(project, params);
    }
    if (t.id === 'search') {
      var q = t.value;
      clearTimeout(window._st);
      window._st = setTimeout(function () {
        var cur = parseHash();
        location.hash = '#/browse?' + serialize(Object.assign({}, cur.query, { q: q }));
        setTimeout(function () {
          var el = document.getElementById('search');
          if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
        }, 0);
      }, 350);
    }
  });

  /* settings fields */
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.dataset && t.dataset.set) {
      var v = t.type === 'number' ? +t.value : t.value;
      Store.setSetting(t.dataset.set, v);
      toast('Saved');
    }
    if (t.id === 'import-file' && t.files[0]) {
      var fr = new FileReader();
      fr.onload = function () {
        try { Store.importJSON(fr.result); render(); toast('Backup restored'); }
        catch (err) { alert('That file could not be read as a Carpenter backup.'); }
      };
      fr.readAsText(t.files[0]);
    }
    if (t.id === 'f-photo' && t.files[0]) shrinkImage(t.files[0], function (dataUrl) {
      window._photo = dataUrl;
      document.getElementById('photo-preview').innerHTML =
        '<img src="' + dataUrl + '" alt="" style="max-width:220px;border:1px solid var(--rule)">';
    });
  });

  /* ---------------- personal projects ---------------- */
  function shrinkImage(file, cb) {
    var fr = new FileReader();
    fr.onload = function () {
      var img = new Image();
      img.onload = function () {
        var max = 900, sc = Math.min(1, max / Math.max(img.width, img.height));
        var c = document.createElement('canvas');
        c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        cb(c.toDataURL('image/jpeg', 0.78));
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  }

  function saveProject() {
    var title = document.getElementById('f-title').value.trim();
    if (!title) { alert('Give the project a name first.'); return; }

    var partList = [];
    document.querySelectorAll('[data-part-row]').forEach(function (row) {
      function f(n) { return row.querySelector('[data-f="' + n + '"]'); }
      var name = f('name').value.trim();
      if (!name) return;
      var stock = f('stock').value;
      var part = { name: name, qty: +f('qty').value || 1, l: +f('l').value || 0, stock: stock };
      if (stock === 'dowel') { part.d = +f('t').value || 8; }
      else { part.t = +f('t').value || 18; part.w = +f('w').value || 100; }
      partList.push(part);
    });

    var p = {
      title: title,
      cat: document.getElementById('f-cat').value,
      sub: document.getElementById('f-sub').value || undefined,
      level: +document.getElementById('f-level').value || 2,
      hours: document.getElementById('f-hours').value.trim(),
      wood: document.getElementById('f-wood').value.trim(),
      blurb: document.getElementById('f-blurb').value.trim(),
      photo: window._photo || '',
      partList: partList,
      tools: { req: pickedTools.slice(), nice: [] },
      steps: document.getElementById('f-steps').value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean),
      finish: document.getElementById('f-finish').value.trim(),
      safety: document.getElementById('f-safety').value.trim()
    };
    var saved = Store.addMine(p);
    window._photo = null;
    location.hash = '#/project/' + saved.id;
    toast('Project saved to your bench');
  }

  /* ---------------- feeds ---------------- */
  function hashCode(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) { h = ((h << 5) - h + str.charCodeAt(i)) | 0; }
    return h;
  }
  function syncFeeds() {
    var feeds = Store.state.feeds || [];
    if (typeof fetch !== 'function') { toast('This browser cannot fetch feeds'); return; }
    if (!feeds.length) { toast('No feeds to fetch'); return; }
    toast('Fetching ' + feeds.length + ' feed' + (feeds.length > 1 ? 's' : '') + '…');
    Promise.all(feeds.map(function (url) {
      return fetch(url, { cache: 'no-store' })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (data) {
          var list = Array.isArray(data) ? data : (data.projects || []);
          return list.map(function (item, i) {
            item.id = item.id || 'feed-' + Math.abs(hashCode(url)).toString(36) + '-' + i;
            item.feed = url;
            return item;
          });
        })
        .catch(function (err) { console.warn('Feed failed:', url, err); return []; });
    })).then(function (results) {
      var merged = [];
      results.forEach(function (r) { merged = merged.concat(r); });
      Store.state.imported = merged;
      Store.save();
      render();
      toast(merged.length ? 'Loaded ' + merged.length + ' projects' : 'No projects came back — check the URLs and CORS');
    });
  }

  /* ---------------- staying up to date ----------------
     The app updates itself in place: new files are fetched from the network,
     and a bar offers to switch over. Your tools, sizes, notes and projects
     live in localStorage and are never touched by an update. */
  var swReg = null, waitingWorker = null, reloading = false;

  /* Inside the Android app there is a native bridge that handles updates:
     it downloads the new web files and swaps them in without reinstalling. */
  function nativeBridge() {
    try {
      return (window.Carpenter && typeof window.Carpenter.checkForUpdate === 'function') ? window.Carpenter : null;
    } catch (e) { return null; }
  }

  function initUpdates() {
    if (nativeBridge()) return;              // the app shell already checks on every launch
    if (!('serviceWorker' in navigator)) return;
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') return;

    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (reloading) return;
      reloading = true;
      location.reload();
    });

    navigator.serviceWorker.register('sw.js').then(function (reg) {
      swReg = reg;
      if (reg.waiting && navigator.serviceWorker.controller) showUpdateBar(reg.waiting);
      reg.addEventListener('updatefound', function () {
        var nw = reg.installing;
        if (!nw) return;
        nw.addEventListener('statechange', function () {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) showUpdateBar(nw);
        });
      });
      reg.update();
      // Check again whenever the app comes back to the foreground, and hourly.
      document.addEventListener('visibilitychange', function () {
        if (!document.hidden) reg.update();
      });
      setInterval(function () { reg.update(); }, 60 * 60 * 1000);
    }).catch(function () { /* no service worker: the app still runs normally */ });
  }

  function showUpdateBar(worker) {
    waitingWorker = worker;
    if (document.querySelector('.updatebar')) return;
    var bar = document.createElement('div');
    bar.className = 'updatebar';
    bar.innerHTML = '<span>A new version of Carpenter is ready. Your projects and tools stay as they are.</span>' +
      '<button class="btn brass small" data-action="apply-update">Update now</button>' +
      '<button class="btn ghost small" data-action="dismiss-update">Later</button>';
    document.body.appendChild(bar);
  }

  function applyUpdate() {
    if (!waitingWorker) { location.reload(); return; }
    waitingWorker.postMessage('skip-waiting');
    setTimeout(function () { if (!reloading) { reloading = true; location.reload(); } }, 1500);
  }

  function checkForUpdates() {
    var nb = nativeBridge();
    if (nb) { nb.checkForUpdate(); return; }
    toast('Checking for a new version…');
    if (swReg) swReg.update();
    if (typeof fetch !== 'function') return;
    fetch('version.json?t=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data) { toast('Could not reach the server'); return; }
        if (data.version && data.version !== window.APP_VERSION) {
          toast('Version ' + data.version + ' found — updating');
          setTimeout(function () { if (!reloading) { reloading = true; location.reload(); } }, 1200);
        } else if (!document.querySelector('.updatebar')) {
          toast('You are on the latest version');
        }
      })
      .catch(function () { toast('Could not reach the server'); });
  }

  /* ---------------- boot ---------------- */
  window.addEventListener('hashchange', render);
  render();
  initUpdates();
  // Load the bundled community file once on first run so the app never looks empty.
  if (!(Store.state.imported || []).length && location.protocol !== 'file:' && typeof fetch === 'function') syncFeedsQuietly();
  function syncFeedsQuietly() {
    fetch('data/community-projects.json', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data) return;
        var list = Array.isArray(data) ? data : (data.projects || []);
        Store.state.imported = list.map(function (item, i) {
          item.id = item.id || 'feed-local-' + i; item.feed = 'data/community-projects.json'; return item;
        });
        Store.save();
        if (parseHash().path === '/') render();
      })
      .catch(function () { /* offline or file:// — the built-in catalogue is enough */ });
  }
})();
