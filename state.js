// ══════════════════════════════════════════
// state.js — Central app state
// ══════════════════════════════════════════

const State = {
  // Scores
  scoreHome: 0,
  scoreAway: 0,
  teamHome: 'HOME',
  teamAway: 'AWAY',
  quarter:   1,   // 1 | 2 | 3 | 4 | 'OT'

  // Down & Distance
  down: 1,          // 1-4
  toFirst: 10,       // yards to first
  oppYardLine: 75,  // opponent yard line
  oppRight: 21,     // right counter (opponent score mirror or custom)

  // Direction
  flipped: false,

  // Play type
  playType: 'pass', // 'run' | 'pass'

  // Strength
  strength: 'L',   // 'L' | 'R'

  // Selections
  selectedFormation: 'gun-flex-y-off',
  selectedPlay: 'te-wheel',
  selectedMotion: 'none',

  // Play result inputs
  yardsGained: 0,
  playerNumber: 0,
  selectedResult: '',

  // Play history
  history: [],

  // Defense selections
  selectedFront:    '',
  selectedBlitz:    'none',
  selectedCoverage: '',

  // Drive tracking
  currentDrive:      1,
  currentDriveStart: 0,
  drives:            [],

  // ── Derived ──────────────────────────────
  getSituationText() {
    const downs = ['', '1st', '2nd', '3rd', '4th'];
    const yard = formatYardLine(this.oppYardLine);
    const side = yard > 0 ? 'OPP' : 'OWN';
    return `${downs[this.down]} and ${this.toFirst} on ${side} ${Math.abs(yard)}`;
  },

  getSelectedFormationName() {
    const f = PLAYBOOK.formations.find(f => f.id === this.selectedFormation);
    return f ? f.name : '';
  },

  getSelectedPlayName() {
    const plays = getPlaysForFormation(this.selectedFormation);
    const p = plays.find(p => p.id === this.selectedPlay);
    return p ? p.name : '';
  },

  getFullPlayName() {
    const formation = this.getSelectedFormationName();
    const play = this.getSelectedPlayName();
    const motion = this.selectedMotion !== 'none'
      ? ` — ${PLAYBOOK.motions.find(m => m.id === this.selectedMotion)?.name || ''}`
      : '';
    if (!formation && !play) return 'Select a play';
    if (!play) return formation;
    return `${formation} — ${play}${motion}`;
  },
};
