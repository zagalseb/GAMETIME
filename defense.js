// ══════════════════════════════════════════
// defense.js — Defense side selectors
// ══════════════════════════════════════════

const DEFENSE_DATA = {
  fronts: [
    { id: '4-3',     name: '4-3 Base' },
    { id: '3-4',     name: '3-4 Base' },
    { id: '5-2',     name: '5-2' },
    { id: '4-4',     name: '4-4' },
    { id: '3-3-5',   name: '3-3-5 Stack' },
    { id: 'nickel',  name: 'Nickel (3-2-6)' },
    { id: 'dime',    name: 'Dime (2-3-6)' },
    { id: '46-bear', name: '46 Bear' },
  ],
  blitzes: [
    { id: 'none',      name: 'No Blitz' },
    { id: 'a-gap',     name: 'A-Gap Blitz' },
    { id: 'b-gap',     name: 'B-Gap Blitz' },
    { id: 'edge',      name: 'Edge Blitz' },
    { id: 'db-blitz',  name: 'DB Blitz' },
    { id: 'zero',      name: 'Zero Blitz' },
    { id: 'fire-zone', name: 'Fire Zone' },
    { id: 'overload',  name: 'Overload' },
  ],
  coverages: [
    { id: 'cover-0',  name: 'Cover 0' },
    { id: 'cover-1',  name: 'Cover 1' },
    { id: 'cover-2',  name: 'Cover 2' },
    { id: 'cover-2m', name: 'Cover 2 Man' },
    { id: 'cover-3',  name: 'Cover 3' },
    { id: 'cover-4',  name: 'Cover 4 (Quarters)' },
    { id: 'cover-6',  name: 'Cover 6' },
    { id: 'tampa-2',  name: 'Tampa 2' },
  ],
};

function renderDefenseLists() {
  _renderList('front-list',    DEFENSE_DATA.fronts,    State.selectedFront,    id => { State.selectedFront    = id; renderDefenseLists(); });
  _renderList('blitz-list',    DEFENSE_DATA.blitzes,   State.selectedBlitz,    id => { State.selectedBlitz    = id; renderDefenseLists(); });
  _renderList('coverage-list', DEFENSE_DATA.coverages, State.selectedCoverage, id => { State.selectedCoverage = id; renderDefenseLists(); });
}

function _renderList(elId, items, selectedId, onSelect) {
  const list = document.getElementById(elId);
  if (!list) return;
  list.innerHTML = '';
  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'selector-item' + (item.id === selectedId ? ' selected' : '');
    el.textContent = item.name;
    el.addEventListener('click', () => onSelect(item.id));
    list.appendChild(el);
  });
}
