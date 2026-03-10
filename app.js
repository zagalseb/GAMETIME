// ══════════════════════════════════════════
// app.js — Init & render orchestrator
// ══════════════════════════════════════════

// ── Render everything from State ──────────
function renderAll() {
  // Scores
  document.getElementById('score-home').textContent = State.scoreHome;
  document.getElementById('score-away').textContent = State.scoreAway;

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
  renderMotionList();

  // Play bar
  const badge = document.getElementById('play-badge');
  const nameEl = document.getElementById('play-name');
  badge.textContent = State.playType.toUpperCase();
  badge.className = `play-type-badge ${State.playType}`;
  nameEl.textContent = State.getFullPlayName();

  // Field
  updateBallMarker();
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

  // End Drive
  document.getElementById('btn-end-drive').addEventListener('click', () => {
    if (State.history.length > 0) {
      const last = State.history[State.history.length - 1];
      // Reset down & distance after drive ends
      State.down = 1;
      State.toFirst = 10;
      renderAll();
    }
  });
}

// ── Boot ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initField();
  initCounters();
  initExport();
  initEvents();
  renderAll();
  renderHistory();
});
