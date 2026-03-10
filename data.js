// ══════════════════════════════════════════
// data.js — Mock data for PlaySync
// Replace with real data / API calls later
// ══════════════════════════════════════════

const PLAYBOOK = {
  formations: [
    // A
    { id: 'ace-slot-left',    name: 'Ace Slot Left',          group: 'A' },
    // E
    { id: 'empty-bunch-left', name: 'Empty Bunch Left',       group: 'E' },
    { id: 'empty-flex',       name: 'Empty Flex',             group: 'E' },
    // G
    { id: 'gun-bunch-strong', name: 'Gun Bunch Strong Nasty Left', group: 'G' },
    { id: 'gun-deuce-close',  name: 'Gun Deuce Close Left',   group: 'G' },
    { id: 'gun-flex-y-off',   name: 'Gun Flex Y Off Close Left', group: 'G' },
    { id: 'gun-wing-stack',   name: 'Gun Wing Stack Weak Left', group: 'G' },
    { id: 'gun-tight-slots',  name: 'Gun Tight Slots',        group: 'G' },
    // I
    { id: 'i-form-pro',       name: 'I-Form Pro',             group: 'I' },
    { id: 'i-form-twins',     name: 'I-Form Twins',           group: 'I' },
    // S
    { id: 'singleback-ace',   name: 'Singleback Ace',         group: 'S' },
    { id: 'singleback-bunch', name: 'Singleback Bunch',       group: 'S' },
  ],

  // plays keyed by formation id
  plays: {
    'gun-flex-y-off': [
      { id: 'counter-y',      name: 'Counter Y',        type: 'run' },
      { id: 'curl-ohio',      name: 'Curl Ohio',         type: 'pass' },
      { id: 'escape',         name: 'Escape',            type: 'pass' },
      { id: 'flood',          name: 'Flood',             type: 'pass' },
      { id: 'hb-circle',      name: 'HB Circle',         type: 'pass' },
      { id: 'hb-slip-screen', name: 'HB Slip Screen',    type: 'pass' },
      { id: 'pa-deep-cross',  name: 'PA Deep Cross',     type: 'pass' },
      { id: 'te-wheel',       name: 'TE Wheel',          type: 'pass' },
      { id: 'verticals',      name: 'Verticals',         type: 'pass' },
    ],
    'gun-bunch-strong': [
      { id: 'drive',          name: 'Drive',             type: 'pass' },
      { id: 'mesh',           name: 'Mesh',              type: 'pass' },
      { id: 'power-o',        name: 'Power O',           type: 'run' },
      { id: 'rpo-peek',       name: 'RPO Peek',          type: 'run' },
      { id: 'screen-left',    name: 'Screen Left',       type: 'pass' },
    ],
    'i-form-pro': [
      { id: 'hb-dive',        name: 'HB Dive',           type: 'run' },
      { id: 'off-tackle',     name: 'Off Tackle',        type: 'run' },
      { id: 'power',          name: 'Power',             type: 'run' },
      { id: 'pa-corner',      name: 'PA Corner',         type: 'pass' },
      { id: 'iso',            name: 'ISO',               type: 'run' },
    ],
    'empty-bunch-left': [
      { id: 'four-verticals', name: 'Four Verticals',    type: 'pass' },
      { id: 'slants',         name: 'Slants',            type: 'pass' },
      { id: 'shallow-cross',  name: 'Shallow Cross',     type: 'pass' },
      { id: 'hail-mary',      name: 'Hail Mary',         type: 'pass' },
    ],
    'default': [
      { id: 'hb-dive',        name: 'HB Dive',           type: 'run' },
      { id: 'sweep',          name: 'Sweep',             type: 'run' },
      { id: 'out-route',      name: 'Out Route',         type: 'pass' },
      { id: 'curl',           name: 'Curl',              type: 'pass' },
      { id: 'slant',          name: 'Slant',             type: 'pass' },
    ],
  },

  motions: [
    { id: 'none',             name: 'No Motion' },
    { id: 'jet-sweep',        name: 'Jet Sweep' },
    { id: 'orbit',            name: 'Orbit' },
    { id: 'fly-motion',       name: 'Fly Motion' },
    { id: 'hb-motion-left',   name: 'HB Motion Left' },
    { id: 'hb-motion-right',  name: 'HB Motion Right' },
    { id: 'slot-motion',      name: 'Slot Motion' },
    { id: 'bunch-motion',     name: 'Bunch Motion' },
    { id: 'shift-tight',      name: 'Shift Tight' },
  ],
};

// Helper: get plays for a formation (fallback to default)
function getPlaysForFormation(formationId) {
  return PLAYBOOK.plays[formationId] || PLAYBOOK.plays['default'];
}
