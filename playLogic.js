// ══════════════════════════════════════════
// playLogic.js — Play commit & down/distance
// ══════════════════════════════════════════

const PlayLogic = {

  // ── Main entry point ───────────────────
  commit() {
    // 1. Read penalty from DOM
    const penaltyActive = document.getElementById('btn-penalty-toggle')?.dataset.active === 'true';
    const penaltyTeam   = document.getElementById('penalty-team')?.value || '';
    const penaltyYards  = parseInt(document.getElementById('penalty-yards')?.value, 10) || 0;
    const notes         = document.getElementById('play-notes')?.value.trim() || '';

    // 2. Capture player # from DOM (in case it wasn't synced on last keystroke)
    State.playerNumber = parseInt(document.getElementById('val-player')?.value, 10) || 0;

    // 3. Save to history with all fields
    logPlay({ penaltyActive, penaltyTeam, penaltyYards, notes });

    // 4. Apply down & distance logic
    this._applyResult(penaltyActive, penaltyTeam, penaltyYards);

    // 5. Move ball marker
    this._moveBall();

    // 6. Reset play fields
    this._resetPlayFields();

    // 7. Render
    renderAll();
    renderHistory();
  },

  // ── Down & distance ────────────────────
  _applyResult(penaltyActive, penaltyTeam, penaltyYards) {
    const result = State.selectedResult;
    const yards  = State.yardsGained;

    // Apply penalty to toFirst BEFORE result logic
    if (penaltyActive && penaltyYards > 0) {
      if (penaltyTeam === 'OFF') {
        State.toFirst = State.toFirst + penaltyYards;
      } else {
        State.toFirst = Math.max(1, State.toFirst - penaltyYards);
      }
    }

    switch (result) {
      case 'TD':
        State.down       = 1;
        State.toFirst    = 10;
        State.oppYardLine = 35; // kickoff position
        return;

      case '1st Down':
        State.down    = 1;
        State.toFirst = 10;
        return;

      case 'Incomplete':
        if (State.down >= 4) {
          State.down    = 1;
          State.toFirst = 10;
        } else {
          State.down += 1;
          // toFirst unchanged on incomplete
        }
        return;

      case 'Turnover':
        State.down    = 1;
        State.toFirst = 10;
        return;

      case 'Sack':
        State.toFirst = State.toFirst + Math.abs(yards); // yards lost
        if (State.down >= 4) {
          State.down    = 1;
          State.toFirst = 10;
        } else {
          State.down += 1;
        }
        return;

      case 'Punt':
        State.down    = 1;
        State.toFirst = 10;
        return;

      case 'FG':
        State.down       = 1;
        State.toFirst    = 10;
        State.oppYardLine = 35;
        return;

      case 'Safety':
        State.down    = 1;
        State.toFirst = 10;
        return;

      default:
        // 'Scramble', '' or anything else — apply yardsGained normally
        const newToFirst = State.toFirst - yards;
        if (newToFirst <= 0) {
          // Automatic 1st down by yardage
          State.down    = 1;
          State.toFirst = 10;
        } else if (State.down >= 4) {
          // Turnover on downs
          State.down    = 1;
          State.toFirst = 10;
        } else {
          State.down   += 1;
          State.toFirst = newToFirst;
        }
    }
  },

  // ── Move ball on field ─────────────────
  _moveBall() {
    const result = State.selectedResult;
    // Position already set by _applyResult for these outcomes
    if (result === 'TD' || result === 'FG' || result === 'Punt' || result === 'Safety') {
      updateBallMarker();
      return;
    }
    const direction = State.flipped ? -1 : 1;
    State.oppYardLine = Math.max(1, Math.min(99,
      State.oppYardLine - (State.yardsGained * direction)
    ));
    updateBallMarker();
  },

  // ── Reset inline play fields ───────────
  _resetPlayFields() {
    State.yardsGained    = 0;
    State.playerNumber   = 0;
    State.selectedResult = '';

    const playerEl = document.getElementById('val-player');
    if (playerEl) playerEl.value = '';

    const notesEl = document.getElementById('play-notes');
    if (notesEl) notesEl.value = '';

    const penaltyToggle = document.getElementById('btn-penalty-toggle');
    if (penaltyToggle) penaltyToggle.dataset.active = 'false';

    const penaltyDetail = document.getElementById('penalty-detail');
    if (penaltyDetail) penaltyDetail.style.display = 'none';

    const penaltyYardsEl = document.getElementById('penalty-yards');
    if (penaltyYardsEl) penaltyYardsEl.value = '';

    document.querySelectorAll('.result-btn').forEach(b => b.classList.remove('selected'));

    renderCounterValue('yards');

    // Reset defense selections
    State.selectedFront    = '';
    State.selectedBlitz    = 'none';
    State.selectedCoverage = '';
    renderDefenseLists();

    // Reset motion chip
    MotionChip.reset();
  },
};
