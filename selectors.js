// ══════════════════════════════════════════
// selectors.js — Formation / Play / Motion
// ══════════════════════════════════════════

function renderFormationList() {
  const list = document.getElementById('formation-list');
  list.innerHTML = '';

  let currentGroup = null;

  PLAYBOOK.formations.forEach(f => {
    if (f.group !== currentGroup) {
      currentGroup = f.group;
      const groupEl = document.createElement('div');
      groupEl.className = 'group-label';
      groupEl.textContent = f.group;
      list.appendChild(groupEl);
    }

    const item = document.createElement('div');
    item.className = 'selector-item' + (f.id === State.selectedFormation ? ' selected' : '');
    item.dataset.id = f.id;
    item.textContent = f.name;

    item.addEventListener('click', () => {
      State.selectedFormation = f.id;
      // Reset play selection when formation changes
      const plays = getPlaysForFormation(f.id);
      State.selectedPlay = plays[0]?.id || '';
      State.selectedMotion = 'none';
      renderAll();
      MotionChip.render();
    });

    list.appendChild(item);
  });
}

function renderPlayList() {
  const list = document.getElementById('play-list');
  list.innerHTML = '';

  const plays = getPlaysForFormation(State.selectedFormation);

  plays.forEach(p => {
    const item = document.createElement('div');
    item.className = 'selector-item' + (p.id === State.selectedPlay ? ' selected' : '');
    item.dataset.id = p.id;

    const badge = document.createElement('span');
    badge.className = `play-badge ${p.type}`;
    badge.textContent = p.type.toUpperCase();

    const name = document.createElement('span');
    name.textContent = p.name;

    item.appendChild(badge);
    item.appendChild(name);

    item.addEventListener('click', () => {
      State.selectedPlay = p.id;
      // Sync play type to run/pass toggle
      State.playType = p.type;
      renderAll();
      MotionChip.render();
    });

    list.appendChild(item);
  });
}

// renderMotionList() removed — replaced by MotionChip in motionChip.js
