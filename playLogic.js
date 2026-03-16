// ══════════════════════════════════════════
// playLogic.js — Play commit & down/distance
// ══════════════════════════════════════════

const PlayLogic = {

  // ── Main entry point ───────────────────
  commit() {
    // 1. Read penalty from DOM
    const penaltyActive = document.getElementById('btn-penalty-toggle')?.dataset.active === 'true';
    const penaltyYards  = parseInt(document.getElementById('penalty-yards')?.value, 10) || 0;
    const penaltyFDA    = document.getElementById('pen-fda')?.checked || false;
    const penaltyType   = State.penaltyType || 'off-penalty';
    const noPlay        = penaltyActive && penaltyType === 'no-play';
    const notes         = document.getElementById('play-notes')?.value.trim() || '';

    // 3. Save to history with all fields
    logPlay({ penaltyActive, penaltyType, penaltyYards, penaltyFDA, noPlay, notes });

    // 4. Apply down & distance logic
    this._applyResult(penaltyActive, penaltyType, penaltyYards, penaltyFDA);

    // 5. Move ball marker
    this._moveBall();

    // 6. Reset play fields
    this._resetPlayFields();

    // 7. Render
    renderAll();
    renderHistory();
  },

  // ── Down & distance ────────────────────
  _applyResult(penaltyActive, penaltyType, penaltyYards, penaltyFDA) {
    const result = State.selectedResult;
    const yards  = State.yardsGained;

    // Penalty takes full priority — play result is nullified
    if (penaltyActive) {
      if (penaltyType === 'no-play') {
        return; // Repeat exact situation, nothing changes
      }
      if (penaltyType === 'off-penalty') {
        State.toFirst += penaltyYards; // More yards to gain, repeat down
        return;
      }
      if (penaltyType === 'def-penalty') {
        const newToFirst = State.toFirst - penaltyYards;
        if (penaltyFDA || newToFirst <= 0) {
          State.down    = 1;
          State.toFirst = 10;
        } else {
          State.toFirst = newToFirst; // Repeat down with fewer yards to go
        }
        return;
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

    document.getElementById('player-num-grid')
      ?.querySelector('.pnum-btn.active')
      ?.classList.remove('active');

    const notesEl = document.getElementById('play-notes');
    if (notesEl) notesEl.value = '';

    const penaltyToggle = document.getElementById('btn-penalty-toggle');
    if (penaltyToggle) penaltyToggle.dataset.active = 'false';

    const penaltyDetail = document.getElementById('penalty-detail');
    if (penaltyDetail) penaltyDetail.style.display = 'none';

    const penaltyYardsEl = document.getElementById('penalty-yards');
    if (penaltyYardsEl) penaltyYardsEl.value = '';

    // Reset penalty type to OFF and clear FDA
    State.penaltyType = 'off-penalty';
    State.penaltyFDA  = false;
    document.querySelectorAll('.pen-type-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
    const fdaChk = document.getElementById('pen-fda');
    if (fdaChk) fdaChk.checked = false;
    const fdaWrap = document.getElementById('pen-fda-wrap');
    if (fdaWrap) fdaWrap.style.display = 'none';
    const yardsRow = document.getElementById('penalty-yards-row');
    if (yardsRow) yardsRow.style.display = 'flex';

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
