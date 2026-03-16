// ══════════════════════════════════════════
// gameManager.js — Multi-game management
// ══════════════════════════════════════════

const GameManager = (() => {

  const GAMES_KEY      = 'playsync_games';
  const CURRENT_ID_KEY = 'playsync_current_game_id';

  let _ready = false;

  // ── Storage helpers ───────────────────
  function _loadGames() {
    try {
      return JSON.parse(localStorage.getItem(GAMES_KEY) || '[]');
    } catch { return []; }
  }

  function _saveGames(games) {
    localStorage.setItem(GAMES_KEY, JSON.stringify(games));
  }

  function _getCurrentId() {
    return localStorage.getItem(CURRENT_ID_KEY);
  }

  function _setCurrentId(id) {
    localStorage.setItem(CURRENT_ID_KEY, id);
  }

  // ── Serialize current State ───────────
  function _serializeState() {
    return {
      scoreHome:         State.scoreHome,
      scoreAway:         State.scoreAway,
      teamHome:          State.teamHome,
      teamAway:          State.teamAway,
      quarter:           State.quarter,
      down:              State.down,
      toFirst:           State.toFirst,
      oppYardLine:       State.oppYardLine,
      flipped:           State.flipped,
      playType:          State.playType,
      strength:          State.strength,
      hash:              State.hash,
      selectedFormation: State.selectedFormation,
      selectedPlay:      State.selectedPlay,
      selectedMotion:    State.selectedMotion,
      history:           State.history,
      currentDrive:      State.currentDrive,
      currentDriveStart: State.currentDriveStart,
      drives:            State.drives,
      opponentPlays:     State.opponentPlays,
      possessionMode:    State.possessionMode,
    };
  }

  // ── Restore State from saved data ─────
  function _restoreState(saved) {
    Object.assign(State, saved);
  }

  // ── Auto-save current game ────────────
  function autosave() {
    if (!_ready) return;
    const id = _getCurrentId();
    if (!id) return;

    const games = _loadGames();
    const idx   = games.findIndex(g => g.id === id);
    if (idx === -1) return;

    games[idx].scoreHome = State.scoreHome;
    games[idx].scoreAway = State.scoreAway;
    games[idx].teamHome  = State.teamHome;
    games[idx].teamAway  = State.teamAway;
    games[idx].plays     = State.history.length;
    games[idx].state     = _serializeState();

    _saveGames(games);
  }

  // ── Create new game ───────────────────
  function createGame(teamHome = 'HOME', teamAway = 'AWAY', week = '1') {
    const id = 'game_' + Date.now();
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-MX', {
      year: 'numeric', month: 'short', day: 'numeric'
    });

    const game = {
      id,
      teamHome:  teamHome,
      teamAway:  teamAway,
      scoreHome: 0,
      scoreAway: 0,
      date:      dateStr,
      week:      week,
      plays:     0,
      state:     null,
    };

    const games = _loadGames();
    games.unshift(game); // newest first
    _saveGames(games);
    _setCurrentId(id);

    // Reset State to defaults
    Object.assign(State, {
      scoreHome:         0,
      scoreAway:         0,
      teamHome:          teamHome,
      teamAway:          teamAway,
      quarter:           1,
      down:              1,
      toFirst:           10,
      oppYardLine:       75,
      flipped:           false,
      playType:          'pass',
      strength:          'L',
      selectedFormation: 'max',
      selectedPlay:      '',
      selectedMotion:    'none',
      yardsGained:       0,
      playerNumber:      0,
      selectedResult:    '',
      history:           [],
      currentDrive:      1,
      currentDriveStart: 0,
      drives:            [],
      opponentPlays:     [],
      possessionMode:    'own',
      historyFilter:     'all',
    });

    closeScreen();
    renderAll();
    renderHistory();
    renderDriveChip();
  }

  // ── Load existing game ────────────────
  function loadGame(id) {
    const games  = _loadGames();
    const game   = games.find(g => g.id === id);
    if (!game || !game.state) return;

    _setCurrentId(id);
    _restoreState(game.state);

    closeScreen();
    renderAll();
    renderHistory();
    renderDriveChip();
  }

  // ── Delete game ───────────────────────
  function deleteGame(id) {
    if (!confirm('Delete this game? This cannot be undone.')) return;

    let games = _loadGames();
    games = games.filter(g => g.id !== id);
    _saveGames(games);

    // If deleted current game, clear it
    if (_getCurrentId() === id) {
      localStorage.removeItem(CURRENT_ID_KEY);
    }

    _renderGameList();
  }

  // ── Show / hide screen ────────────────
  function showScreen() {
    _renderGameList();
    document.getElementById('game-select-screen').style.display = 'flex';
  }

  function closeScreen() {
    document.getElementById('game-select-screen').style.display = 'none';
  }

  // ── Render game list ──────────────────
  function _renderGameList() {
    const list  = document.getElementById('game-list');
    const games = _loadGames();
    const currentId = _getCurrentId();

    if (games.length === 0) {
      list.innerHTML = `
        <div class="game-list-empty">
          No games yet. Create your first game to get started.
        </div>
      `;
      return;
    }

    list.innerHTML = games.map(g => `
      <div class="game-card ${g.id === currentId ? 'current' : ''}"
           data-id="${g.id}">
        <div class="game-card-main">
          <div class="game-card-teams">
            <span class="game-card-home">${g.teamHome}</span>
            <span class="game-card-score">${g.scoreHome} — ${g.scoreAway}</span>
            <span class="game-card-away">${g.teamAway}</span>
          </div>
          <div class="game-card-meta">
            <span class="game-card-date">${g.week ? _weekLabel(g.week) : g.date}</span>
            <span class="game-card-plays">${g.plays} plays</span>
            ${g.id === currentId ? '<span class="game-card-current-badge">ACTIVE</span>' : ''}
          </div>
        </div>
        <div class="game-card-actions">
          <button class="game-card-delete" data-id="${g.id}">✕</button>
        </div>
      </div>
    `).join('');

    // Load game on tap
    list.querySelectorAll('.game-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.game-card-delete')) return;
        loadGame(card.dataset.id);
      });
    });

    // Delete buttons
    list.querySelectorAll('.game-card-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteGame(btn.dataset.id);
      });
    });
  }

  // ── Init — called on DOMContentLoaded ─
  function init() {
    _buildDOM();
    _ready = true;
    window.addEventListener('pagehide', autosave);

    const currentId = _getCurrentId();
    const games     = _loadGames();

    if (currentId && games.find(g => g.id === currentId)) {
      // Resume last active game
      loadGame(currentId);
    } else {
      // Show selection screen
      showScreen();
    }
  }

  // ── Build DOM ─────────────────────────
  function _buildDOM() {
    if (document.getElementById('game-select-screen')) return;

    const el = document.createElement('div');
    el.id = 'game-select-screen';
    el.innerHTML = `
      <div id="game-select-panel">

        <div class="game-select-header">
          <div class="logo">
            <div class="logo-icon">G</div>
            <span class="logo-text">PlaySync</span>
          </div>
          <button class="btn-primary" id="gs-btn-new">
            + New Game
          </button>
        </div>

        <div class="game-select-title">Select a Game</div>

        <div class="game-list" id="game-list">
          <!-- populated by _renderGameList() -->
        </div>

      </div>
    `;

    document.body.appendChild(el);

    document.getElementById('gs-btn-new').addEventListener('click', _showNewGameForm);
  }

  // ── Week label helper ─────────────────
  const WEEK_OPTIONS = ['Preseason','1','2','3','4','5','6','7','8','9','10','QF','SF','Final'];

  function _weekLabel(w) {
    if (['QF','SF','Final','Preseason'].includes(w)) return w;
    return `Semana ${w}`;
  }

  // ── New-game inline form ──────────────
  function _showNewGameForm() {
    if (document.getElementById('gs-new-game-form')) return;

    const btnNew = document.getElementById('gs-btn-new');
    btnNew.disabled = true;
    btnNew.style.opacity = '0.4';

    const form = document.createElement('div');
    form.id = 'gs-new-game-form';
    form.style.cssText = `
      background: var(--bg-card, #1e293b);
      border: 1px solid var(--border-light, #334155);
      border-radius: 10px;
      padding: 14px 16px;
      margin-bottom: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `;
    const weekOpts = WEEK_OPTIONS.map(w =>
      `<option value="${w}">${_weekLabel(w)}</option>`
    ).join('');

    form.innerHTML = `
      <div style="display:flex; gap:8px; align-items:center;">
        <input id="gs-input-home" class="modal-text-input" type="text"
               placeholder="Local" maxlength="10" autocomplete="off" style="flex:1;" />
        <span style="color:var(--text-muted,#64748b); font-size:12px; font-weight:700;">vs</span>
        <input id="gs-input-away" class="modal-text-input" type="text"
               placeholder="Visitante" maxlength="10" autocomplete="off" style="flex:1;" />
      </div>
      <div style="display:flex; gap:8px; align-items:center;">
        <label style="font-size:11px; font-weight:700; letter-spacing:.08em; color:var(--text-muted,#64748b); text-transform:uppercase; white-space:nowrap;">Semana</label>
        <select id="gs-input-week" class="modal-text-input" style="flex:1;">
          ${weekOpts}
        </select>
      </div>
      <div style="display:flex; gap:8px; justify-content:flex-end;">
        <button id="gs-btn-cancel-new" class="btn-secondary" style="height:34px; padding:0 12px;">✕</button>
        <button id="gs-btn-confirm-new" class="btn-primary" style="height:34px; padding:0 14px;">Crear juego</button>
      </div>
    `;

    const list = document.getElementById('game-list');
    list.parentNode.insertBefore(form, list);

    document.getElementById('gs-input-home').focus();

    document.getElementById('gs-btn-confirm-new').addEventListener('click', _confirmNewGame);
    document.getElementById('gs-btn-cancel-new').addEventListener('click', _hideNewGameForm);

    form.addEventListener('keydown', (e) => {
      if (e.key === 'Enter')  { e.preventDefault(); _confirmNewGame(); }
      if (e.key === 'Escape') { e.preventDefault(); _hideNewGameForm(); }
    });
  }

  function _confirmNewGame() {
    const homeRaw = (document.getElementById('gs-input-home').value || '').trim();
    const awayRaw = (document.getElementById('gs-input-away').value || '').trim();
    const week    = document.getElementById('gs-input-week').value || '1';
    _hideNewGameForm();
    createGame(homeRaw || 'HOME', awayRaw || 'AWAY', week);
  }

  function _hideNewGameForm() {
    const form = document.getElementById('gs-new-game-form');
    if (form) form.remove();
    const btnNew = document.getElementById('gs-btn-new');
    if (btnNew) { btnNew.disabled = false; btnNew.style.opacity = ''; }
  }

  return { init, autosave, showScreen, createGame };
})();
