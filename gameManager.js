// ══════════════════════════════════════════
// gameManager.js — Multi-game management
// ══════════════════════════════════════════

const GameManager = (() => {

  const GAMES_KEY      = 'playsync_games';
  const CURRENT_ID_KEY = 'playsync_current_game_id';

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
      selectedFormation: State.selectedFormation,
      selectedPlay:      State.selectedPlay,
      selectedMotion:    State.selectedMotion,
      history:           State.history,
      currentDrive:      State.currentDrive,
      currentDriveStart: State.currentDriveStart,
      drives:            State.drives,
    };
  }

  // ── Restore State from saved data ─────
  function _restoreState(saved) {
    Object.assign(State, saved);
  }

  // ── Auto-save current game ────────────
  function autosave() {
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
  function createGame() {
    const id = 'game_' + Date.now();
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-MX', {
      year: 'numeric', month: 'short', day: 'numeric'
    });

    const game = {
      id,
      teamHome:  'HOME',
      teamAway:  'AWAY',
      scoreHome: 0,
      scoreAway: 0,
      date:      dateStr,
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
      teamHome:          'HOME',
      teamAway:          'AWAY',
      quarter:           1,
      down:              1,
      toFirst:           10,
      oppYardLine:       75,
      flipped:           false,
      playType:          'pass',
      strength:          'L',
      selectedFormation: 'gun-flex-y-off',
      selectedPlay:      'te-wheel',
      selectedMotion:    'none',
      yardsGained:       0,
      playerNumber:      0,
      selectedResult:    '',
      history:           [],
      currentDrive:      1,
      currentDriveStart: 0,
      drives:            [],
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
            <span class="game-card-date">${g.date}</span>
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

    document.getElementById('gs-btn-new').addEventListener('click', createGame);
  }

  return { init, autosave, showScreen, createGame };
})();
