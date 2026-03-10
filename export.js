// ══════════════════════════════════════════
// export.js — CSV export
// ══════════════════════════════════════════

function exportCSV() {
  if (State.history.length === 0) {
    alert('No hay jugadas registradas para exportar.');
    return;
  }

  const headers = [
    '#', 'Timestamp', 'Down', 'To First', 'Yard Line',
    'Formation', 'Play', 'Type', 'Motion', 'Strength',
    'Score Home', 'Score Away',
  ];

  const rows = State.history.map((p, i) => [
    i + 1,
    p.timestamp,
    p.down,
    p.toFirst,
    p.oppYardLine,
    `"${p.formationName}"`,
    `"${p.playName}"`,
    p.type,
    `"${p.motionName}"`,
    p.strength,
    p.scoreHome,
    p.scoreAway,
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `playsync_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function initExport() {
  const btn = document.getElementById('btn-export');
  if (btn) btn.addEventListener('click', exportCSV);
}
