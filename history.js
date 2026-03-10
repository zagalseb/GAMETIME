// ══════════════════════════════════════════
// history.js — Play history log
// ══════════════════════════════════════════

function renderHistory() {
  const list = document.getElementById('history-list');
  if (!list) return;

  if (State.history.length === 0) {
    list.innerHTML = '<div class="history-empty">No plays recorded yet</div>';
    return;
  }

  list.innerHTML = State.history.map((play, i) => `
    <div class="history-item">
      <div class="history-item-top">
        <span class="history-item-num">${i + 1}</span>
        <span class="play-badge ${play.type}" style="flex-shrink:0">${play.type.toUpperCase()}</span>
        <span class="history-item-play">${play.playName}</span>
      </div>
      <div class="history-item-meta">
        <span class="history-meta-tag">${play.down}&amp;${play.toFirst}</span>
        <span class="history-meta-tag">${play.yardDisplay > 0 ? 'OPP' : 'OWN'} ${Math.abs(play.yardDisplay)}</span>
        ${play.strength ? `<span class="history-meta-tag">${play.strength}</span>` : ''}
        ${play.motion && play.motion !== 'none' ? `<span class="history-meta-tag">${play.motionName}</span>` : ''}
        ${play.result ? `<span class="history-meta-tag result-${play.result.toLowerCase().replace(' ', '-')}">${play.result}</span>` : ''}
        ${play.yardsGained !== undefined ? `<span class="history-meta-tag">${play.yardsGained > 0 ? '+' : ''}${play.yardsGained} yds</span>` : ''}
        ${play.playerNumber ? `<span class="history-meta-tag">#${play.playerNumber}</span>` : ''}
        ${play.penalty ? `<span class="history-meta-tag penalty">⚑ ${play.penalty.team} ${play.penalty.yards}yds</span>` : ''}
        ${play.notes ? `<span class="history-meta-tag notes">${play.notes}</span>` : ''}
      </div>
    </div>
  `).reverse().join(''); // newest first

  // Auto-scroll to top (newest)
  list.scrollTop = 0;
}

function logPlay(extra = {}) {
  const plays = getPlaysForFormation(State.selectedFormation);
  const playObj = plays.find(p => p.id === State.selectedPlay);
  const motionObj = PLAYBOOK.motions.find(m => m.id === State.selectedMotion);

  if (!playObj) return;

  const entry = {
    timestamp:    new Date().toISOString(),
    formation:    State.selectedFormation,
    formationName:State.getSelectedFormationName(),
    play:         State.selectedPlay,
    playName:     State.getSelectedPlayName(),
    type:         State.playType,
    motion:       State.selectedMotion,
    motionName:   motionObj?.name || '',
    strength:     State.strength,
    down:         State.down,
    toFirst:      State.toFirst,
    oppYardLine:  State.oppYardLine,
    yardDisplay:  formatYardLine(State.oppYardLine),
    scoreHome:    State.scoreHome,
    scoreAway:    State.scoreAway,
    // Extended fields from PlayLogic
    yardsGained:  State.yardsGained,
    result:       State.selectedResult,
    playerNumber: State.playerNumber > 0 ? State.playerNumber : null,
    penalty:      extra.penaltyActive
                    ? { team: extra.penaltyTeam, yards: extra.penaltyYards }
                    : null,
    notes:        extra.notes || '',
  };

  State.history.push(entry);
  renderHistory();
}
