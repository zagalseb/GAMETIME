// ══════════════════════════════════════════
// data.js — PlaySync Playbook
// ══════════════════════════════════════════

const PLAYBOOK = {
  formations: [
    { id: 'max',         name: 'Max',         group: 'M' },
    { id: 'trips',       name: 'Trips',       group: 'T' },
    { id: 'split',       name: 'Split',       group: 'S' },
    { id: 'empty',       name: 'Empty',       group: 'E' },
    { id: 'pistol',      name: 'Pistol',      group: 'P' },
    { id: 'undercenter', name: 'Undercenter', group: 'U' },
  ],

  plays: {
    // ── MAX — heavy run formation ──────────
    'max': [
    // ── Run game ──
    { id: 'max-power',        name: 'Power',            type: 'run'  },
    { id: 'max-counter',      name: 'Counter',          type: 'run'  },
    { id: 'max-inside-zone',  name: 'Inside Zone',      type: 'run'  },
    { id: 'max-outside-zone', name: 'Outside Zone',     type: 'run'  },
    { id: 'max-iso',          name: 'ISO',              type: 'run'  },
    { id: 'max-sweep',        name: 'Sweep',            type: 'run'  },
    { id: 'max-trap',         name: 'Trap',             type: 'run'  },
    { id: 'max-draw',         name: 'Draw',             type: 'run'  },
    { id: 'max-qb-sneak',     name: 'QB Draw',          type: 'run'  },
    // ── RPO ──
    { id: 'max-rpo-slant',    name: 'RPO Slant',        type: 'run'  },
    { id: 'max-rpo-bubble',   name: 'RPO Bubble',       type: 'run'  },
    { id: 'max-rpo-screen',   name: 'RPO Screen',       type: 'run'  },
    { id: 'max-rpo-peek',     name: 'RPO Peek',         type: 'run'  },
    // ── Play Action ──
    { id: 'max-pa-post',      name: 'PA Post',          type: 'pass' },
    { id: 'max-pa-corner',    name: 'PA Corner',        type: 'pass' },
    { id: 'max-pa-cross',     name: 'PA Cross',         type: 'pass' },
    { id: 'max-pa-seam',      name: 'PA Seam',          type: 'pass' },
    { id: 'max-pa-boot',      name: 'PA Bootleg',       type: 'pass' },
    { id: 'max-pa-wheel',     name: 'PA Wheel',         type: 'pass' },
    // ── Pass profundo ──
    { id: 'max-four-verts',   name: 'Four Verticals',   type: 'pass' },
    { id: 'max-post',         name: 'Post',             type: 'pass' },
    { id: 'max-corner',       name: 'Corner',           type: 'pass' },
    { id: 'max-go',           name: 'Go Route',         type: 'pass' },
    { id: 'max-post-corner',  name: 'Post Corner',      type: 'pass' },
    // ── Pass medio ──
    { id: 'max-mesh',         name: 'Mesh',             type: 'pass' },
    { id: 'max-cross',        name: 'Cross',            type: 'pass' },
    { id: 'max-dig',          name: 'Dig',              type: 'pass' },
    { id: 'max-drive',        name: 'Drive',            type: 'pass' },
    { id: 'max-levels',       name: 'Levels',           type: 'pass' },
    { id: 'max-shallow',      name: 'Shallow Cross',    type: 'pass' },
    { id: 'max-pivot',        name: 'Pivot',            type: 'pass' },
    // ── Pass corto ──
    { id: 'max-slant',        name: 'Slant',            type: 'pass' },
    { id: 'max-curl-flat',    name: 'Curl Flat',        type: 'pass' },
    { id: 'max-smash',        name: 'Smash',            type: 'pass' },
    { id: 'max-stick',        name: 'Stick',            type: 'pass' },
    { id: 'max-spacing',      name: 'Spacing',          type: 'pass' },
    { id: 'max-snag',         name: 'Snag',             type: 'pass' },
    { id: 'max-hitch',        name: 'Hitch',            type: 'pass' },
    { id: 'max-out',          name: 'Out Route',        type: 'pass' },
    { id: 'max-quick-slant',  name: 'Quick Slant',      type: 'pass' },
    // ── Screens ──
    { id: 'max-wr-screen',    name: 'WR Screen',        type: 'pass' },
    { id: 'max-hb-screen',    name: 'HB Screen',        type: 'pass' },
    { id: 'max-slip-screen',  name: 'Slip Screen',      type: 'pass' },
    { id: 'max-tunnel',       name: 'Tunnel Screen',    type: 'pass' },
  ],

    // ── TRIPS — 3 receivers one side ──────
    'trips': [
      { id: 'trips-mesh',      name: 'Mesh',            type: 'pass' },
      { id: 'trips-drive',     name: 'Drive',           type: 'pass' },
      { id: 'trips-stick',     name: 'Stick',           type: 'pass' },
      { id: 'trips-flood',     name: 'Flood',           type: 'pass' },
      { id: 'trips-verticals', name: 'Verticals',       type: 'pass' },
      { id: 'trips-corner',    name: 'Corner',          type: 'pass' },
      { id: 'trips-post',      name: 'Post',            type: 'pass' },
      { id: 'trips-screen',    name: 'WR Screen',       type: 'pass' },
      { id: 'trips-bubble',    name: 'Bubble Screen',   type: 'pass' },
      { id: 'trips-zone',      name: 'Outside Zone',    type: 'run'  },
      { id: 'trips-rpo',       name: 'RPO Peek',        type: 'run'  },
    ],

    // ── SPLIT — 2x2 balanced ──────────────
    'split': [
      { id: 'split-four-verts', name: 'Four Verticals',  type: 'pass' },
      { id: 'split-mesh',       name: 'Mesh',            type: 'pass' },
      { id: 'split-cross',      name: 'Cross',           type: 'pass' },
      { id: 'split-dig',        name: 'Dig',             type: 'pass' },
      { id: 'split-curl-flat',  name: 'Curl Flat',       type: 'pass' },
      { id: 'split-smash',      name: 'Smash',           type: 'pass' },
      { id: 'split-shallow',    name: 'Shallow Cross',   type: 'pass' },
      { id: 'split-slant',      name: 'Slant',           type: 'pass' },
      { id: 'split-zone',       name: 'Inside Zone',     type: 'run'  },
      { id: 'split-power',      name: 'Power',           type: 'run'  },
      { id: 'split-rpo-slant',  name: 'RPO Slant',       type: 'run'  },
    ],

    // ── EMPTY — 5 receivers ───────────────
    'empty': [
      { id: 'empty-four-verts', name: 'Four Verticals',  type: 'pass' },
      { id: 'empty-mesh',       name: 'Mesh',            type: 'pass' },
      { id: 'empty-shallow',    name: 'Shallow Cross',   type: 'pass' },
      { id: 'empty-stick',      name: 'Stick',           type: 'pass' },
      { id: 'empty-spacing',    name: 'Spacing',         type: 'pass' },
      { id: 'empty-snag',       name: 'Snag',            type: 'pass' },
      { id: 'empty-levels',     name: 'Levels',          type: 'pass' },
      { id: 'empty-screen',     name: 'WR Screen',       type: 'pass' },
      { id: 'empty-qb-draw',    name: 'QB Draw',         type: 'run'  },
    ],

    // ── PISTOL — hybrid run/pass ───────────
    'pistol': [
      { id: 'pistol-power',     name: 'Power',           type: 'run'  },
      { id: 'pistol-counter',   name: 'Counter',         type: 'run'  },
      { id: 'pistol-zone',      name: 'Inside Zone',     type: 'run'  },
      { id: 'pistol-sweep',     name: 'Sweep',           type: 'run'  },
      { id: 'pistol-rpo-slant', name: 'RPO Slant',       type: 'run'  },
      { id: 'pistol-rpo-screen',name: 'RPO Screen',      type: 'run'  },
      { id: 'pistol-pa-cross',  name: 'PA Cross',        type: 'pass' },
      { id: 'pistol-pa-post',   name: 'PA Post',         type: 'pass' },
      { id: 'pistol-mesh',      name: 'Mesh',            type: 'pass' },
      { id: 'pistol-verticals', name: 'Verticals',       type: 'pass' },
    ],

    // ── UNDERCENTER — traditional ──────────
    'undercenter': [
      { id: 'uc-power',         name: 'Power',           type: 'run'  },
      { id: 'uc-counter',       name: 'Counter',         type: 'run'  },
      { id: 'uc-iso',           name: 'ISO',             type: 'run'  },
      { id: 'uc-outside-zone',  name: 'Outside Zone',    type: 'run'  },
      { id: 'uc-sweep',         name: 'Sweep',           type: 'run'  },
      { id: 'uc-fb-dive',       name: 'FB Dive',         type: 'run'  },
      { id: 'uc-pa-boot',       name: 'PA Bootleg',      type: 'pass' },
      { id: 'uc-pa-cross',      name: 'PA Cross',        type: 'pass' },
      { id: 'uc-pa-corner',     name: 'PA Corner',       type: 'pass' },
      { id: 'uc-slant',         name: 'Slant',           type: 'pass' },
    ],
  },

  motions: [
    { id: 'none',            name: 'No Motion'       },
    { id: 'jet',             name: 'Jet'             },
    { id: 'orbit',           name: 'Orbit'           },
    { id: 'fly',             name: 'Fly'             },
    { id: 'hb-left',         name: 'HB Left'         },
    { id: 'hb-right',        name: 'HB Right'        },
    { id: 'slot-motion',     name: 'Slot Motion'     },
    { id: 'shift-trips',     name: 'Shift Trips'     },
    { id: 'shift-empty',     name: 'Shift Empty'     },
  ],
};

// Helper: get plays for a formation (fallback to default)
function getPlaysForFormation(formationId) {
  return PLAYBOOK.plays[formationId] || PLAYBOOK.plays['split'];
}
