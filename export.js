// ══════════════════════════════════════════
// export.js — CSV export
// ══════════════════════════════════════════

function exportCSV() {
  if (State.history.length === 0) {
    alert('No hay jugadas registradas para exportar.');
    return;
  }

  const headers = [
    '#', 'Timestamp', 'Drive',
    'Down', 'To First', 'Yard Line', 'Yard Display',
    `"${State.teamHome}"`, `"${State.teamAway}"`, 'Quarter',
    'Formation', 'Play', 'Type', 'Motion', 'Strength',
    'Yards Gained', 'Result',
    'Player #', 'Penalty Team', 'Penalty Yards',
    'Front', 'Blitz', 'Coverage',
    'Notes',
  ];

  const rows = State.history.map((p, i) => {
    // Find which drive this play belongs to
    let driveNum = State.currentDrive;
    let cumulative = 0;
    for (const drive of State.drives) {
      cumulative += drive.playEntries.length;
      if (i < cumulative) { driveNum = drive.driveNum; break; }
    }

    return [
      i + 1,
      p.timestamp,
      driveNum,
      p.down,
      p.toFirst,
      p.oppYardLine,
      p.yardDisplay,
      p.scoreHome,
      p.scoreAway,
      p.quarter || '',
      `"${p.formationName || ''}"`,
      `"${p.playName || ''}"`,
      p.type || '',
      `"${p.motionName || ''}"`,
      p.strength || '',
      p.yardsGained !== undefined ? p.yardsGained : '',
      p.result || '',
      p.playerNumber || '',
      p.penalty ? p.penalty.team  : '',
      p.penalty ? p.penalty.yards : '',
      `"${p.selectedFront    || ''}"`,
      `"${p.selectedBlitz && p.selectedBlitz !== 'none' ? p.selectedBlitz : ''}"`,
      `"${p.selectedCoverage || ''}"`,
      `"${(p.notes || '').replace(/"/g, '""')}"`,
    ];
  });

  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `playsync_${State.teamHome}_vs_${State.teamAway}_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function initExport() {
  const btn = document.getElementById('btn-export');
  if (btn) btn.addEventListener('click', exportCSV);
}