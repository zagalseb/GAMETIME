// ══════════════════════════════════════════
// playbookEditor.js — Playbook editor
// ══════════════════════════════════════════

const PlaybookEditor = (() => {

  // ── Helpers ───────────────────────────
  function _slug(str) {
    return str.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function _save() {
    localStorage.setItem('playsync_playbook', JSON.stringify({
      formations: PLAYBOOK.formations,
      plays:      PLAYBOOK.plays,
      motions:    PLAYBOOK.motions,
    }));
  }

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem('playsync_playbook');
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.formations) PLAYBOOK.formations = saved.formations;
      if (saved.plays)      PLAYBOOK.plays      = saved.plays;
      if (saved.motions)    PLAYBOOK.motions     = saved.motions;
    } catch (e) {
      console.warn('PlaybookEditor: failed to load from storage', e);
    }
  }

  function _saveDefense() {
    localStorage.setItem('playsync_defense', JSON.stringify({
      fronts:    DEFENSE_DATA.fronts,
      blitzes:   DEFENSE_DATA.blitzes,
      coverages: DEFENSE_DATA.coverages,
    }));
  }

  function loadDefenseFromStorage() {
    try {
      const raw = localStorage.getItem('playsync_defense');
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.fronts)    DEFENSE_DATA.fronts    = saved.fronts;
      if (saved.blitzes)   DEFENSE_DATA.blitzes   = saved.blitzes;
      if (saved.coverages) DEFENSE_DATA.coverages = saved.coverages;
    } catch (e) {
      console.warn('PlaybookEditor: failed to load defense from storage', e);
    }
  }

  // ── State ─────────────────────────────
  let _selectedFormationId = null;
  let _editorTab = 'offense';       // 'offense' | 'defense'
  let _defList   = 'fronts';        // 'fronts' | 'blitzes' | 'coverages'

  // ── Open / Close ──────────────────────
  function open() {
    document.getElementById('playbook-editor-overlay').style.display = 'flex';
    _editorTab = 'offense';
    _selectedFormationId = PLAYBOOK.formations[0]?.id || null;
    _syncEditorTab();
    _renderFormationList();
    _renderPlayList();
  }

  function close() {
    document.getElementById('playbook-editor-overlay').style.display = 'none';
    // Refresh main app selectors
    renderFormationList();
    renderPlayList();
    MotionChip.render();
  }

  // ── Tab sync ──────────────────────────
  function _syncEditorTab() {
    document.querySelectorAll('.editor-tab-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.tab === _editorTab)
    );
    document.getElementById('editor-offense-body').style.display =
      _editorTab === 'offense' ? 'grid' : 'none';
    document.getElementById('editor-defense-body').style.display =
      _editorTab === 'defense' ? 'grid' : 'none';
  }

  // ── Formation list (left panel) ───────
  function _renderFormationList() {
    const list = document.getElementById('editor-formation-list');
    list.innerHTML = '';

    PLAYBOOK.formations.forEach((f, fi) => {
      const row = document.createElement('div');
      row.className = 'editor-formation-row' + (f.id === _selectedFormationId ? ' selected' : '');

      row.innerHTML = `
        <div class="editor-row-drag" data-fi="${fi}">⠿</div>
        <span class="editor-row-name">${f.name}</span>
        <div class="editor-row-actions">
          <button class="editor-action-btn editor-rename-btn" data-fi="${fi}" title="Rename">✎</button>
          <button class="editor-action-btn editor-delete-btn editor-delete-formation" data-fi="${fi}" title="Delete">✕</button>
        </div>
      `;

      row.addEventListener('click', (e) => {
        if (e.target.closest('.editor-row-actions')) return;
        _selectedFormationId = f.id;
        _renderFormationList();
        _renderPlayList();
      });

      // Rename
      row.querySelector('.editor-rename-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const newName = prompt('Formation name:', f.name);
        if (newName && newName.trim()) {
          PLAYBOOK.formations[fi].name = newName.trim();
          _save();
          _renderFormationList();
        }
      });

      // Delete
      row.querySelector('.editor-delete-formation').addEventListener('click', (e) => {
        e.stopPropagation();
        if (!confirm(`Delete "${f.name}" and all its plays?`)) return;
        delete PLAYBOOK.plays[f.id];
        PLAYBOOK.formations.splice(fi, 1);
        _selectedFormationId = PLAYBOOK.formations[0]?.id || null;
        _save();
        _renderFormationList();
        _renderPlayList();
      });

      list.appendChild(row);
    });

    // Drag to reorder
    _initDragFormations(list);
  }

  function _initDragFormations(list) {
    let dragIdx = null;

    list.querySelectorAll('.editor-formation-row').forEach((row, i) => {
      row.setAttribute('draggable', true);
      row.addEventListener('dragstart', () => { dragIdx = i; row.classList.add('dragging'); });
      row.addEventListener('dragend',   () => row.classList.remove('dragging'));
      row.addEventListener('dragover',  (e) => { e.preventDefault(); });
      row.addEventListener('drop', () => {
        if (dragIdx === null || dragIdx === i) return;
        const moved = PLAYBOOK.formations.splice(dragIdx, 1)[0];
        PLAYBOOK.formations.splice(i, 0, moved);
        dragIdx = null;
        _save();
        _renderFormationList();
      });
    });
  }

  // ── Play list (right panel) ────────────
  function _renderPlayList() {
    const title = document.getElementById('editor-play-panel-title');

    if (!_selectedFormationId) {
      document.getElementById('editor-play-list').innerHTML =
        '<div class="editor-empty">Select a formation</div>';
      return;
    }

    const formation = PLAYBOOK.formations.find(f => f.id === _selectedFormationId);
    title.textContent = formation?.name || '';

    const plays = PLAYBOOK.plays[_selectedFormationId] || [];
    const list  = document.getElementById('editor-play-list');
    list.innerHTML = '';

    plays.forEach((p, pi) => {
      const row = document.createElement('div');
      row.className = 'editor-play-row';
      row.innerHTML = `
        <div class="editor-row-drag">⠿</div>
        <span class="play-badge ${p.type}">${p.type.toUpperCase()}</span>
        <span class="editor-row-name">${p.name}</span>
        <div class="editor-row-actions">
          <button class="editor-type-btn" data-pi="${pi}" title="Toggle run/pass">
            ${p.type === 'run' ? 'RUN' : 'PASS'}
          </button>
          <button class="editor-action-btn editor-rename-btn editor-rename-play" data-pi="${pi}" title="Rename">✎</button>
          <button class="editor-action-btn editor-delete-btn editor-delete-play" data-pi="${pi}" title="Delete">✕</button>
        </div>
      `;

      // Toggle run/pass
      row.querySelector('.editor-type-btn').addEventListener('click', () => {
        plays[pi].type = plays[pi].type === 'run' ? 'pass' : 'run';
        _save();
        _renderPlayList();
      });

      // Rename
      row.querySelector('.editor-rename-play').addEventListener('click', () => {
        const newName = prompt('Play name:', p.name);
        if (newName && newName.trim()) {
          plays[pi].name = newName.trim();
          _save();
          _renderPlayList();
        }
      });

      // Delete
      row.querySelector('.editor-delete-play').addEventListener('click', () => {
        if (!confirm(`Delete "${p.name}"?`)) return;
        plays.splice(pi, 1);
        PLAYBOOK.plays[_selectedFormationId] = plays;
        _save();
        _renderPlayList();
      });

      list.appendChild(row);
    });

    // Drag to reorder plays
    _initDragPlays(list, plays);
  }

  function _initDragPlays(list, plays) {
    let dragIdx = null;

    list.querySelectorAll('.editor-play-row').forEach((row, i) => {
      row.setAttribute('draggable', true);
      row.addEventListener('dragstart', () => { dragIdx = i; row.classList.add('dragging'); });
      row.addEventListener('dragend',   () => row.classList.remove('dragging'));
      row.addEventListener('dragover',  (e) => e.preventDefault());
      row.addEventListener('drop', () => {
        if (dragIdx === null || dragIdx === i) return;
        const moved = plays.splice(dragIdx, 1)[0];
        plays.splice(i, 0, moved);
        PLAYBOOK.plays[_selectedFormationId] = plays;
        dragIdx = null;
        _save();
        _renderPlayList();
      });
    });
  }

  // ── Defense panel ─────────────────────
  function _renderDefPanel() {
    // Sync sub-list tabs
    document.querySelectorAll('.editor-def-tab').forEach(b =>
      b.classList.toggle('active', b.dataset.list === _defList)
    );

    const data = DEFENSE_DATA[_defList]; // fronts | blitzes | coverages
    const list = document.getElementById('editor-def-list');
    list.innerHTML = '';

    data.forEach((item, i) => {
      const row = document.createElement('div');
      row.className = 'editor-play-row';
      row.innerHTML = `
        <div class="editor-row-drag">⠿</div>
        <span class="editor-row-name">${item.name}</span>
        <div class="editor-row-actions">
          <button class="editor-action-btn editor-rename-def" data-i="${i}" title="Rename">✎</button>
          <button class="editor-action-btn editor-delete-btn editor-delete-def" data-i="${i}" title="Delete">✕</button>
        </div>
      `;

      row.querySelector('.editor-rename-def').addEventListener('click', () => {
        const newName = prompt('Rename:', item.name);
        if (newName && newName.trim()) {
          data[i].name = newName.trim();
          _saveDefense();
          _renderDefPanel();
          renderDefenseLists();
        }
      });

      row.querySelector('.editor-delete-def').addEventListener('click', () => {
        if (!confirm(`Delete "${item.name}"?`)) return;
        data.splice(i, 1);
        _saveDefense();
        _renderDefPanel();
        renderDefenseLists();
      });

      list.appendChild(row);
    });

    // Drag to reorder
    let dragIdx = null;
    list.querySelectorAll('.editor-play-row').forEach((row, i) => {
      row.setAttribute('draggable', true);
      row.addEventListener('dragstart', () => { dragIdx = i; row.classList.add('dragging'); });
      row.addEventListener('dragend',   () => row.classList.remove('dragging'));
      row.addEventListener('dragover',  (e) => e.preventDefault());
      row.addEventListener('drop', () => {
        if (dragIdx === null || dragIdx === i) return;
        const moved = data.splice(dragIdx, 1)[0];
        data.splice(i, 0, moved);
        dragIdx = null;
        _saveDefense();
        _renderDefPanel();
      });
    });
  }

  // ── Add formation ─────────────────────
  function _addFormation() {
    const name = prompt('New formation name:');
    if (!name || !name.trim()) return;
    const trimmed = name.trim();
    const id = _slug(trimmed) + '-' + Date.now();
    const group = trimmed[0].toUpperCase();
    PLAYBOOK.formations.push({ id, name: trimmed, group });
    PLAYBOOK.plays[id] = [];
    _selectedFormationId = id;
    _save();
    _renderFormationList();
    _renderPlayList();
  }

  // ── Add play ──────────────────────────
  function _addPlay() {
    if (!_selectedFormationId) return;
    const name = prompt('New play name:');
    if (!name || !name.trim()) return;
    const trimmed = name.trim();
    const id = _slug(trimmed) + '-' + Date.now();
    if (!PLAYBOOK.plays[_selectedFormationId]) {
      PLAYBOOK.plays[_selectedFormationId] = [];
    }
    PLAYBOOK.plays[_selectedFormationId].push({ id, name: trimmed, type: 'pass' });
    _save();
    _renderPlayList();
  }

  // ── Add defense item ──────────────────
  function _addDefItem() {
    const label = { fronts: 'Front', blitzes: 'Blitz', coverages: 'Coverage' }[_defList];
    const name = prompt(`New ${label} name:`);
    if (!name || !name.trim()) return;
    const trimmed = name.trim();
    const id = _slug(trimmed) + '-' + Date.now();
    DEFENSE_DATA[_defList].push({ id, name: trimmed });
    _saveDefense();
    _renderDefPanel();
    renderDefenseLists();
  }

  // ── Reset to defaults ─────────────────
  function _resetToDefaults() {
    if (!confirm('Reset playbook to defaults? All custom data will be lost.')) return;
    localStorage.removeItem('playsync_playbook');
    localStorage.removeItem('playsync_defense');
    location.reload();
  }

  // ── Build DOM ─────────────────────────
  function _buildDOM() {
    if (document.getElementById('playbook-editor-overlay')) return;

    const el = document.createElement('div');
    el.id = 'playbook-editor-overlay';
    el.style.display = 'none';
    el.innerHTML = `
      <div id="playbook-editor">

        <div class="editor-header">
          <div class="editor-tabs">
            <button class="editor-tab-btn active" data-tab="offense">Offense</button>
            <button class="editor-tab-btn" data-tab="defense">Defense</button>
          </div>
          <span class="editor-title">Playbook Editor</span>
          <div class="editor-header-actions">
            <button class="editor-reset-btn" id="editor-btn-reset">Reset to defaults</button>
            <button class="icon-btn" id="editor-btn-close">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- OFFENSE body -->
        <div class="editor-body" id="editor-offense-body">
          <div class="editor-panel" id="editor-formations-panel">
            <div class="editor-panel-header">
              <span class="editor-panel-title">Formations</span>
              <button class="editor-add-btn" id="editor-btn-add-formation">+ Add</button>
            </div>
            <div class="editor-list" id="editor-formation-list"></div>
          </div>
          <div class="editor-panel" id="editor-plays-panel">
            <div class="editor-panel-header">
              <span class="editor-panel-title" id="editor-play-panel-title">Select a formation</span>
              <button class="editor-add-btn" id="editor-btn-add-play">+ Add Play</button>
            </div>
            <div class="editor-list" id="editor-play-list"></div>
          </div>
        </div>

        <!-- DEFENSE body -->
        <div class="editor-body" id="editor-defense-body" style="display:none">
          <div class="editor-panel" style="border-right:none; grid-column: 1 / -1;">
            <div class="editor-panel-header">
              <div class="editor-def-tabs">
                <button class="editor-def-tab active" data-list="fronts">Fronts</button>
                <button class="editor-def-tab" data-list="blitzes">Blitzes</button>
                <button class="editor-def-tab" data-list="coverages">Coverages</button>
              </div>
              <button class="editor-add-btn" id="editor-btn-add-def">+ Add</button>
            </div>
            <div class="editor-list" id="editor-def-list"></div>
          </div>
        </div>

      </div>
    `;

    document.body.appendChild(el);

    document.getElementById('editor-btn-close').addEventListener('click', close);
    document.getElementById('editor-btn-add-formation').addEventListener('click', _addFormation);
    document.getElementById('editor-btn-add-play').addEventListener('click', _addPlay);
    document.getElementById('editor-btn-reset').addEventListener('click', _resetToDefaults);

    // Close on backdrop click
    el.addEventListener('click', (e) => {
      if (e.target === el) close();
    });

    // Editor OFF/DEF tabs
    document.querySelectorAll('.editor-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        _editorTab = btn.dataset.tab;
        _syncEditorTab();
        if (_editorTab === 'defense') _renderDefPanel();
      });
    });

    // Defense sub-tabs
    document.getElementById('editor-defense-body').querySelectorAll('.editor-def-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        _defList = btn.dataset.list;
        _renderDefPanel();
      });
    });

    // Add defense item
    document.getElementById('editor-btn-add-def').addEventListener('click', _addDefItem);
  }

  function init() {
    loadFromStorage();
    loadDefenseFromStorage();
    _buildDOM();
  }

  return { init, open, close, loadFromStorage, loadDefenseFromStorage };
})();
