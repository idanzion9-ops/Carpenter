/* Carpenter — everything the app remembers lives in this browser, in localStorage.
   Nothing is uploaded anywhere. Export from Settings to move it between devices. */
(function () {
  var KEY = 'carpenter.v1';

  var DEFAULTS = {
    owned: {},                 // toolId -> true
    saved: {},                 // projectId -> params
    status: {},                // projectId -> 'planned' | 'building' | 'built'
    notes: {},                 // projectId -> string
    mine: [],                  // personal projects
    feeds: ['data/community-projects.json'],
    imported: [],              // projects pulled from feeds
    settings: {
      unit: 'metric',
      waste: 15,
      kerf: 3,
      stockLength: 2400,
      dowelLength: 1000,
      sheetW: 1220,
      sheetL: 2440,
      density: 600,
      currency: '$',
      price: { boardFoot: 0, sheet: 0, dowel: 0 }
    }
  };

  var state;

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      state = raw ? JSON.parse(raw) : null;
    } catch (e) { state = null; }
    if (!state) state = JSON.parse(JSON.stringify(DEFAULTS));
    // fill in anything a newer version added
    Object.keys(DEFAULTS).forEach(function (k) {
      if (state[k] === undefined) state[k] = JSON.parse(JSON.stringify(DEFAULTS[k]));
    });
    Object.keys(DEFAULTS.settings).forEach(function (k) {
      if (state.settings[k] === undefined) state.settings[k] = DEFAULTS.settings[k];
    });
    return state;
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { console.warn('Storage full or unavailable — changes are not being saved.', e); }
  }

  var Store = {
    get state() { return state || load(); },
    load: load,
    save: save,

    toggleTool: function (id) {
      var s = Store.state;
      if (s.owned[id]) delete s.owned[id]; else s.owned[id] = true;
      save();
      return !!s.owned[id];
    },
    owns: function (id) { return !!Store.state.owned[id]; },
    ownedCount: function () { return Object.keys(Store.state.owned).length; },
    setAllTools: function (ids, on) {
      var s = Store.state;
      ids.forEach(function (id) { if (on) s.owned[id] = true; else delete s.owned[id]; });
      save();
    },

    params: function (project) {
      var s = Store.state, saved = s.saved[project.id] || {};
      var out = {};
      (project.paramDefs || []).forEach(function (d) {
        out[d.k] = saved[d.k] != null ? saved[d.k] : d.def;
      });
      return out;
    },
    setParam: function (projectId, key, value) {
      var s = Store.state;
      s.saved[projectId] = s.saved[projectId] || {};
      s.saved[projectId][key] = value;
      save();
    },
    resetParams: function (projectId) { delete Store.state.saved[projectId]; save(); },

    setStatus: function (id, status) {
      var s = Store.state;
      if (!status || s.status[id] === status) delete s.status[id]; else s.status[id] = status;
      save();
      return s.status[id] || null;
    },
    statusOf: function (id) { return Store.state.status[id] || null; },

    setNote: function (id, text) { Store.state.notes[id] = text; save(); },
    noteOf: function (id) { return Store.state.notes[id] || ''; },

    addMine: function (project) {
      project.id = 'mine-' + Date.now().toString(36);
      project.mine = true;
      project.created = new Date().toISOString();
      Store.state.mine.unshift(project);
      save();
      return project;
    },
    updateMine: function (project) {
      var list = Store.state.mine;
      for (var i = 0; i < list.length; i++) if (list[i].id === project.id) { list[i] = project; break; }
      save();
    },
    removeMine: function (id) {
      Store.state.mine = Store.state.mine.filter(function (p) { return p.id !== id; });
      save();
    },

    setSetting: function (path, value) {
      var s = Store.state.settings;
      if (path.indexOf('.') > -1) {
        var bits = path.split('.');
        s[bits[0]][bits[1]] = value;
      } else s[path] = value;
      save();
    },

    exportJSON: function () { return JSON.stringify(Store.state, null, 2); },
    importJSON: function (text) {
      var data = JSON.parse(text);
      state = data;
      Object.keys(DEFAULTS).forEach(function (k) { if (state[k] === undefined) state[k] = DEFAULTS[k]; });
      save();
    },
    reset: function () { state = JSON.parse(JSON.stringify(DEFAULTS)); save(); }
  };

  load();
  window.Store = Store;
})();
