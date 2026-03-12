// ══════════════════════════════════════════
// app.js — Init & render orchestrator
// ══════════════════════════════════════════

// ── Render everything from State ──────────
function renderAll() {
  // Scores
  const homeEl = document.getElementById('score-home');
  const awayEl = document.getElementById('score-away');
  if (document.activeElement !== homeEl) homeEl.value = State.scoreHome;
  if (document.activeElement !== awayEl) awayEl.value = State.scoreAway;

  // Quarter buttons
  document.querySelectorAll('.quarter-btn').forEach(btn => {
    const q = isNaN(btn.dataset.q) ? btn.dataset.q : parseInt(btn.dataset.q);
    btn.classList.toggle('active', q === State.quarter);
  });

  // Situation chip
  updateSituationChip();

  // Counters
  renderAllCounters();

  // Play type toggle
  document.getElementById('btn-run').classList.toggle('active', State.playType === 'run');
  document.getElementById('btn-pass').classList.toggle('active', State.playType === 'pass');

  // Strength
  document.querySelectorAll('.strength-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.strength === State.strength);
  });

  // Selectors
  renderFormationList();
  renderPlayList();
  MotionChip.render();

  // Play bar
  const badge = document.getElementById('play-badge');
  const nameEl = document.getElementById('play-name');
  badge.textContent = State.playType.toUpperCase();
  badge.className = `play-type-badge ${State.playType}`;
  nameEl.textContent = State.getFullPlayName();

  // Field
  updateBallMarker();

  // Defense lists
  renderDefenseLists();

  // Drive chip
  renderDriveChip();

  // Auto-save
  GameManager.autosave();
}

// ── Wire up events ────────────────────────
function initEvents() {
  // Run / Pass toggle
  document.getElementById('btn-run').addEventListener('click', () => {
    State.playType = 'run';
    renderAll();
  });
  document.getElementById('btn-pass').addEventListener('click', () => {
    State.playType = 'pass';
    renderAll();
  });

  // Strength
  document.querySelectorAll('.strength-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      State.strength = btn.dataset.strength;
      renderAll();
    });
  });

  // Flip direction
  document.getElementById('btn-flip').addEventListener('click', () => {
    State.flipped = !State.flipped;
    updateBallMarker();
  });

  // Player # — sync input to State on every keystroke
  document.getElementById('val-player').addEventListener('input', function () {
    State.playerNumber = parseInt(this.value, 10) || 0;
  });

  // Next Play — delegate entirely to PlayLogic
  document.getElementById('btn-next-play').addEventListener('click', () => {
    PlayLogic.commit();
  });

  // Penalty toggle
  document.getElementById('btn-penalty-toggle').addEventListener('click', () => {
    const btn = document.getElementById('btn-penalty-toggle');
    const detail = document.getElementById('penalty-detail');
    const isActive = btn.dataset.active === 'true';
    btn.dataset.active = String(!isActive);
    detail.style.display = isActive ? 'none' : 'flex';
  });

  // Result selection
  document.querySelectorAll('.result-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.result-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      State.selectedResult = btn.dataset.result;
    });
  });

  // Score inputs — sync to State on change
  document.getElementById('score-home').addEventListener('input', function () {
    State.scoreHome = parseInt(this.value, 10) || 0;
  });
  document.getElementById('score-away').addEventListener('input', function () {
    State.scoreAway = parseInt(this.value, 10) || 0;
  });

  const homeNameEl = document.getElementById('team-home-name');
  const awayNameEl = document.getElementById('team-away-name');
  if (document.activeElement !== homeNameEl) homeNameEl.value = State.teamHome;
  if (document.activeElement !== awayNameEl) awayNameEl.value = State.teamAway;

  document.getElementById('team-home-name').addEventListener('input', function () {
    State.teamHome = this.value || 'HOME';
  });
  document.getElementById('team-away-name').addEventListener('input', function () {
    State.teamAway = this.value || 'AWAY';
  });

  // Quarter selector
  document.querySelectorAll('.quarter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      State.quarter = isNaN(btn.dataset.q) ? btn.dataset.q : parseInt(btn.dataset.q);
      document.querySelectorAll('.quarter-btn').forEach(b =>
        b.classList.toggle('active', b === btn)
      );
    });
  });

  // Menu → Game selection screen
  document.getElementById('btn-menu').addEventListener('click', () => {
    GameManager.showScreen();
  });

  // Playbook Editor button
  document.getElementById('btn-playbook-editor').addEventListener('click', () => {
    PlaybookEditor.open();
  });

  // End Drive
  document.getElementById('btn-end-drive').addEventListener('click', () => {
    endDrive();
    State.down    = 1;
    State.toFirst = 10;
    renderAll();
  });

}

// ── Boot ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  PlaybookEditor.init();   // first — loads localStorage before everything else
  PlayEditor.init();
  HistoryOverlay.init();
  initField();
  initCounters();
  initExport();
  MotionChip.init();
  initEvents();
  renderAll();
  renderHistory();
  renderDriveChip();
  GameManager.init(); // last — shows game selection screen
});
