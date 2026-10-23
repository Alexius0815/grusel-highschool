/* Grusel-Highschool – Web-Version (Matter.js-Physik, Canvas, WebAudio) */
(() => {
'use strict';
const { Engine, Bodies, Body, Composite, Constraint, Events, Query } = Matter;
const VERSION = 7;
const $ = id => document.getElementById(id);
const PI = Math.PI, rnd = (a, b) => a + Math.random() * (b - a), pick = a => a[Math.floor(Math.random() * a.length)];

// ---------------------------------------------------------------- Speicher
const load = k => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

// ---------------------------------------------------------------- Sprachen
const T = {
  title: { de: 'GRUSEL-HIGHSCHOOL', en: 'CREEPY CAMPUS', hu: 'SZELLEM-GIMI' },
  appears: { de: '%@ ist da!', en: '%@ is here!', hu: '%@ megérkezett!' },
  'grav.normal': { de: 'Normale Schwerkraft', en: 'Normal gravity', hu: 'Normál gravitáció' },
  'grav.moon': { de: 'Mond-Schwerkraft 🌙', en: 'Moon gravity 🌙', hu: 'Holdgravitáció 🌙' },
  'grav.zero': { de: 'Schwerelos ✨', en: 'Weightless ✨', hu: 'Súlytalanság ✨' },
  'grav.up': { de: 'Alles verkehrt herum! 🙃', en: 'Everything upside down! 🙃', hu: 'Minden fejjel lefelé! 🙃' },
  cleared: { de: 'Alles aufgeräumt! 🧹', en: 'All tidied up! 🧹', hu: 'Kitakarítva! 🧹' },
  'music.on': { de: 'Musik an 🎶', en: 'Music on 🎶', hu: 'Zene be 🎶' },
  'music.off': { de: 'Musik aus', en: 'Music off', hu: 'Zene ki' },
  oops: { de: 'Ups! ✂️', en: 'Oops! ✂️', hu: 'Hoppá! ✂️' },
  'btn.clear': { de: '🧹 Alles aufräumen', en: '🧹 Clear everything', hu: '🧹 Minden takarítása' },
  'btn.create': { de: 'Erstellen', en: 'Create', hu: 'Készítés' },
  hint: { de: 'Mit dem Finger ziehen und werfen – auch mit mehreren Fingern! Doppelt auf einen Patchwork-Zombie tippen: Die Nähte platzen!',
          en: 'Drag and throw with your fingers – several at once! Double-tap a patchwork zombie: the stitches pop!',
          hu: 'Húzd és dobd az ujjaddal – akár többel is! Koppints duplán a foltozott zombira: szétrepednek a varratok!' },
  go: { de: "Los geht's!", en: "Let's go!", hu: 'Kezdjük!' },
  'clear.q': { de: 'Alles vom Schulhof räumen?', en: 'Clear the whole schoolyard?', hu: 'Mindent letakarítasz az udvarról?' },
  lang: { de: 'Sprache', en: 'Language', hu: 'Nyelv' },
  scenes: { de: 'Ort', en: 'Place', hu: 'Helyszín' },
  'a11y.gravity': { de: 'Schwerkraft wechseln', en: 'Change gravity', hu: 'Gravitáció váltása' },
  'a11y.music': { de: 'Musik an oder aus', en: 'Music on or off', hu: 'Zene be vagy ki' },
  settings: { de: 'Einstellungen', en: 'Settings', hu: 'Beállítások' },
  'prop.pumpkin': { de: 'Kürbis', en: 'Pumpkin', hu: 'Tök' },
  'prop.coffin': { de: 'Sarg', en: 'Coffin', hu: 'Koporsó' },
  'prop.book': { de: 'Bücher', en: 'Books', hu: 'Könyvek' },
  'prop.locker': { de: 'Spind', en: 'Locker', hu: 'Szekrény' },
  'prop.skull': { de: 'Schädelball', en: 'Skull ball', hu: 'Koponyalabda' },
  'prop.bat': { de: 'Fledermaus', en: 'Bat', hu: 'Denevér' },
  'cr.create': { de: 'Monster erstellen', en: 'Create a monster', hu: 'Szörny készítése' },
  'cr.edit': { de: 'Monster bearbeiten', en: 'Edit monster', hu: 'Szörny szerkesztése' },
  'cr.namePH': { de: 'Wie heißt dein Monster?', en: 'What is your monster called?', hu: 'Mi a szörnyed neve?' },
  'cr.defaultName': { de: 'Neues Monster', en: 'New Monster', hu: 'Új szörny' },
  'cr.kind': { de: 'Monsterart', en: 'Monster type', hu: 'Szörnyfajta' },
  'kind.vampire': { de: 'Vampir', en: 'Vampire', hu: 'Vámpír' },
  'kind.wolf': { de: 'Werwolf', en: 'Werewolf', hu: 'Vérfarkas' },
  'kind.stitch': { de: 'Patchwork-Zombie', en: 'Patchwork zombie', hu: 'Foltozott zombi' },
  'kind.sea': { de: 'Meeresmonster', en: 'Sea monster', hu: 'Tengeri szörny' },
  'kind.ghost': { de: 'Geist', en: 'Ghost', hu: 'Szellem' },
  'kind.mummy': { de: 'Mumie', en: 'Mummy', hu: 'Múmia' },
  'cr.skin': { de: 'Hautfarbe', en: 'Skin', hu: 'Bőrszín' },
  'cr.hair': { de: 'Haarfarbe', en: 'Hair colour', hu: 'Hajszín' },
  'cr.streak': { de: 'Strähne', en: 'Streak', hu: 'Tincs' },
  'cr.eyes': { de: 'Augenfarbe', en: 'Eye colour', hu: 'Szemszín' },
  'cr.lips': { de: 'Lippen', en: 'Lips', hu: 'Ajak' },
  'cr.hairStyle': { de: 'Frisur', en: 'Hairstyle', hu: 'Frizura' },
  'hair.long': { de: 'Lang', en: 'Long', hu: 'Hosszú' },
  'hair.short': { de: 'Kurz', en: 'Short', hu: 'Rövid' },
  'hair.pigtails': { de: 'Zöpfe', en: 'Pigtails', hu: 'Copfok' },
  'cr.top': { de: 'Oberteil', en: 'Top', hu: 'Felső' },
  'top.dress': { de: 'Kleid', en: 'Dress', hu: 'Ruha' },
  'top.shirt': { de: 'Shirt', en: 'Shirt', hu: 'Póló' },
  'top.jacket': { de: 'Jacke', en: 'Jacket', hu: 'Dzseki' },
  'cr.topColor': { de: 'Farbe Oberteil', en: 'Top colour', hu: 'Felső színe' },
  'cr.bottom': { de: 'Unterteil', en: 'Bottom', hu: 'Alsó' },
  'bottom.skirt': { de: 'Rock', en: 'Skirt', hu: 'Szoknya' },
  'bottom.pants': { de: 'Hose', en: 'Trousers', hu: 'Nadrág' },
  'bottom.tutu': { de: 'Tutu', en: 'Tutu', hu: 'Tütü' },
  'cr.bottomColor': { de: 'Farbe Unterteil', en: 'Bottom colour', hu: 'Alsó színe' },
  'cr.shoes': { de: 'Schuhe', en: 'Shoes', hu: 'Cipő' },
  'shoes.platform': { de: 'Plateau', en: 'Platforms', hu: 'Platform' },
  'shoes.boots': { de: 'Stiefel', en: 'Boots', hu: 'Csizma' },
  'shoes.sneakers': { de: 'Sneaker', en: 'Sneakers', hu: 'Sportcipő' },
  'cr.accent': { de: 'Akzentfarbe', en: 'Accent colour', hu: 'Kiegészítő szín' },
  'cr.acc': { de: 'Accessoire', en: 'Accessory', hu: 'Kiegészítő' },
  'acc.none': { de: 'Keins', en: 'None', hu: 'Nincs' },
  'acc.bow': { de: 'Schleife', en: 'Bow', hu: 'Masni' },
  'acc.crown': { de: 'Krone', en: 'Crown', hu: 'Korona' },
  'acc.hat': { de: 'Hexenhut', en: 'Witch hat', hu: 'Boszorkánykalap' },
  'acc.glasses': { de: 'Brille', en: 'Glasses', hu: 'Szemüveg' },
  'cr.random': { de: '🎲 Zufall', en: '🎲 Random', hu: '🎲 Véletlen' },
  'cr.save': { de: 'Speichern', en: 'Save', hu: 'Mentés' },
  'cr.cancel': { de: 'Abbrechen', en: 'Cancel', hu: 'Mégse' },
  'cr.mine': { de: 'Meine Monster', en: 'My monsters', hu: 'Saját szörnyeim' },
  'cr.new': { de: 'Neues Monster', en: 'New monster', hu: 'Új szörny' },
  'cr.empty': { de: 'Noch keine eigenen Monster – erstelle dein erstes!', en: 'No monsters of your own yet – create your first one!', hu: 'Még nincs saját szörnyed – készítsd el az elsőt!' },
  'cr.delete': { de: 'Löschen', en: 'Delete', hu: 'Törlés' },
  'cr.editBtn': { de: 'Bearbeiten', en: 'Edit', hu: 'Szerkesztés' },
  'cr.deleteQ': { de: '„%@“ wirklich löschen?', en: 'Really delete “%@”?', hu: 'Biztosan törlöd: „%@”?' },
  'cr.deleteInfo': { de: 'Du kannst das Monster danach noch wiederherstellen.', en: 'You can still restore the monster afterwards.', hu: 'Utána még visszaállíthatod a szörnyet.' },
  'cr.deleted': { de: 'Gelöscht – wiederherstellen?', en: 'Deleted – restore?', hu: 'Törölve – visszaállítod?' },
  'cr.restore': { de: '↩︎ Wiederherstellen', en: '↩︎ Restore', hu: '↩︎ Visszaállítás' },
  'cr.done': { de: 'Fertig', en: 'Done', hu: 'Kész' },
  'cr.tab.monster': { de: 'Monster', en: 'Monster', hu: 'Szörny' },
  'cr.look': { de: 'Aussehen', en: 'Looks', hu: 'Kinézet' },
  'cr.clothes': { de: 'Kleidung', en: 'Clothes', hu: 'Ruházat' },
};
const LANGS = [['de', '🇩🇪 Deutsch'], ['en', '🇬🇧 English'], ['hu', '🇭🇺 Magyar']];
let lang = load('lang') || ((navigator.language || 'en').slice(0, 2).toLowerCase());
if (!T.title[lang]) lang = 'en';
const tr = (k, arg) => { const e = T[k]; let s = e ? (e[lang] || e.en) : k; return arg != null ? s.replace('%@', arg) : s; };

// ---------------------------------------------------------------- Ghoul-Modell
const KINDS = ['vampire', 'wolf', 'stitch', 'sea', 'ghost', 'mummy'];
const HAIRS = ['long', 'short', 'pigtails'], TOPS = ['dress', 'shirt', 'jacket'], BOTTOMS = ['skirt', 'pants', 'tutu'];
const SHOES = ['platform', 'boots', 'sneakers'], ACCS = ['none', 'bow', 'crown', 'hat', 'glasses'];
const EMOJI = { vampire: '🧛‍♀️', wolf: '🐺', stitch: '🧟‍♀️', sea: '🧜‍♀️', ghost: '👻', mummy: '🏺' };
const SKIN = ['#F6E4F0', '#F4F6FF', '#E9D9B0', '#FFD7B5', '#C9956B', '#8D5A3B', '#9FE3C8', '#7FD6E8', '#B9A6FF', '#FFB3D9', '#A8E06C', '#9E9E9E'];
const COLORS = ['#111111', '#FFFFFF', '#FF4FA3', '#E0207F', '#7B2CBF', '#9D7BFF', '#3B6FD8', '#38D1C1', '#2EC4B6', '#8CFF4F', '#FFE066', '#FF8A1F', '#FF3B3B', '#5A3420', '#D4AF37', '#1E8C8C'];
const LIPS = ['#C2185B', '#FF4FA3', '#7B2CBF', '#1565C0', '#8E3B2F', '#111111', '#2E7D6B', '#FF3B3B'];
const G = (id, name, kind, skin, hair, streak, eyes, lips, top, bottom, accent, hairStyle, topStyle, bottomStyle, shoes, accessory) =>
  ({ id, name, kind, skin, hair, streak, eyes, lips, top, bottom, accent, hairStyle, topStyle, bottomStyle, shoes, accessory });
const BUILTIN = [
  // Eigene Figuren – Farben & Merkmale bewusst unabhängig von bekannten Spielzeug-Reihen gewählt
  G('b1', 'Vela', 'vampire', '#DDE3F0', '#7A1030', '#D4AF37', '#38D1C1', '#7A1030', '#1E8C8C', '#111111', '#D4AF37', 'short', 'jacket', 'pants', 'sneakers', 'glasses'),
  G('b2', 'Lupa', 'wolf', '#E8C9A8', '#9E9E9E', '#3B6FD8', '#3B6FD8', '#C2185B', '#7B2CBF', '#9D7BFF', '#38D1C1', 'pigtails', 'dress', 'tutu', 'sneakers', 'none'),
  G('b3', 'Flicka', 'stitch', '#B9A6FF', '#FF8A1F', '#FFE066', '#8CFF4F', '#7B2CBF', '#8CFF4F', '#5A3420', '#FF3B3B', 'short', 'shirt', 'pants', 'boots', 'bow'),
  G('b4', 'Neris', 'sea', '#A8E06C', '#3B6FD8', '#FF4FA3', '#FF8A1F', '#1565C0', '#FF8A1F', '#FFE066', '#FF4FA3', 'pigtails', 'shirt', 'skirt', 'sneakers', 'none'),
  G('b5', 'Boo-Belle', 'ghost', '#F4F6FF', '#38D1C1', '#FFFFFF', '#2E86FF', '#FF4FA3', '#FF4FA3', '#FFFFFF', '#111111', 'long', 'dress', 'skirt', 'platform', 'hat'),
  G('b6', 'Mumi', 'mummy', '#E9D9B0', '#C9956B', '#FF4FA3', '#8CFF4F', '#C2185B', '#3B6FD8', '#FFFFFF', '#FF4FA3', 'short', 'shirt', 'tutu', 'boots', 'bow'),
];
let custom = load('customGhouls') || [];
let deleted = [];
const allGhouls = () => BUILTIN.concat(custom);
const uid = () => 'g' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const randomGhoul = (name, id) => G(id || uid(), name, pick(KINDS), pick(SKIN), pick(COLORS), pick(COLORS), pick(COLORS), pick(LIPS),
  pick(COLORS), pick(COLORS), pick(COLORS), pick(HAIRS), pick(TOPS), pick(BOTTOMS), pick(SHOES), pick(ACCS));
const saveCustom = () => save('customGhouls', custom);

// ---------------------------------------------------------------- Zeichen-Helfer (lokale Koordinaten, y nach unten)
const INK = '#141014';
function pathRR(c, x, y, w, h, r) {
  const l = x - w / 2, t = y - h / 2; r = Math.min(r, w / 2, h / 2);
  c.beginPath(); c.moveTo(l + r, t); c.arcTo(l + w, t, l + w, t + h, r); c.arcTo(l + w, t + h, l, t + h, r);
  c.arcTo(l, t + h, l, t, r); c.arcTo(l, t, l + w, t, r); c.closePath();
}
function paint(c, fill, stroke, lw) {
  if (fill) { c.fillStyle = fill; c.fill(); }
  if (stroke && lw) { c.strokeStyle = stroke; c.lineWidth = lw; c.stroke(); }
}
const rr = (c, x, y, w, h, r, fill, stroke = INK, lw = 2) => { pathRR(c, x, y, w, h, r); paint(c, fill, stroke, lw); };
const ell = (c, x, y, w, h, fill, stroke, lw, rot = 0) => { c.beginPath(); c.ellipse(x, y, w / 2, h / 2, rot, 0, 2 * PI); paint(c, fill, stroke, lw); };
const poly = (c, pts, fill, stroke = INK, lw = 2) => { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); paint(c, fill, stroke, lw); };
const segs = (c, list, color, lw = 2) => { c.beginPath(); list.forEach(s => { c.moveTo(s[0], s[1]); c.lineTo(s[2], s[3]); }); c.strokeStyle = color; c.lineWidth = lw; c.lineCap = 'round'; c.stroke(); };
const txt = (c, s, x, y, size, color, font = '900 ' + size + 'px Nunito, system-ui, sans-serif') => { c.font = font; c.fillStyle = color; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(s, x, y); };
const alpha = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };

// ---------------------------------------------------------------- Ghoul-Teile
function drawTorso(c, s) {
  rr(c, 0, 0, 34, 50, 10, s.top, INK, 2.5);
  if (s.topStyle === 'dress') rr(c, 0, 8, 34, 5, 2, s.accent, INK, 1);
  if (s.topStyle === 'shirt') segs(c, [[-16, -8, 16, -8], [-16, 0, 16, 0]], s.accent, 3);
  if (s.topStyle === 'jacket') {
    rr(c, 0, 0, 14, 46, 3, '#FFFFFF', null, 0);
    poly(c, [[-7, -23], [0, -10], [-12, -23]], s.accent, INK, 1);
    poly(c, [[7, -23], [0, -10], [12, -23]], s.accent, INK, 1);
    segs(c, [[-7, -22, -7, 24], [7, -22, 7, 24]], INK, 1.5);
  }
  const sym = { vampire: '♥', wolf: '☾', sea: '✦', ghost: '☁' }[s.kind] || '☠';
  txt(c, sym, 0, -5, 13, s.topStyle === 'jacket' ? INK : s.accent);
  if (s.bottomStyle === 'skirt') {
    poly(c, [[-17, 16], [17, 16], [27, 33], [-27, 33]], s.bottom, INK, 2.5);
    segs(c, [[-25, 30, 25, 30]], s.accent, 3);
  } else if (s.bottomStyle === 'tutu') {
    const pts = [[-17, 14], [17, 14]];
    for (let i = 0; i <= 8; i++) pts.push([32 - i * 8, i % 2 === 0 ? 32 : 26]);
    poly(c, pts, alpha(s.bottom, 0.85), INK, 2);
    poly(c, pts.map(p => [p[0] * 0.8, p[1] - 4]), alpha(s.accent, 0.5), null, 0);
  } else rr(c, 0, 20, 34, 12, 3, s.bottom, INK, 2);
  if (s.kind === 'mummy') segs(c, [[-17, -18, 17, -10], [-17, -2, 17, 4]], s.skin, 4);
  if (s.kind === 'stitch') segs(c, [[-12, -20, 12, 12], [-6, -10, 0, -14], [2, -3, 8, -7]], INK, 1.5);
}
function drawArm(c, s) {
  rr(c, 0, 0, 11, 40, 5, s.skin);
  const len = s.topStyle === 'jacket' ? 30 : 14;
  rr(c, 0, -(20 - len / 2), 13, len, 4, s.top, INK, 1.5);
  ell(c, 0, 10, 10, 4, s.accent);
  if (s.kind === 'wolf') segs(c, [[-4, 20, -5, 24], [0, 20, 0, 25], [4, 20, 5, 24]], '#FFFFFF', 2);
  if (s.kind === 'mummy') segs(c, [[-5, 0, 5, 4], [-5, 8, 5, 12]], '#FFFFFF', 2);
}
function drawLeg(c, s) {
  rr(c, 0, 0, 13, 46, 5, s.skin);
  if (s.bottomStyle === 'pants') rr(c, 0, -7, 15, 32, 4, s.bottom, INK, 1.5);
  if (s.kind !== 'ghost') {
    if (s.shoes === 'platform') { rr(c, 0, 14, 17, 20, 4, s.accent, INK, 2); rr(c, 0, 24, 19, 6, 2, INK, INK, 1); }
    else if (s.shoes === 'boots') { rr(c, 0, 10, 17, 28, 4, INK, s.accent, 2); segs(c, [[-6, 0, 6, 0]], s.accent, 2); }
    else { ell(c, 2, 21, 22, 11, '#FFFFFF', INK, 1.5); segs(c, [[-4, 20, 6, 20]], s.accent, 2.5); }
  }
  if (s.kind === 'mummy') segs(c, [[-6, -15, 6, -10], [-6, -5, 6, 0]], '#FFFFFF', 2);
  if (s.kind === 'sea') segs(c, [[-4, -12, 0, -8], [0, -8, 4, -12], [-4, -4, 0, 0], [0, 0, 4, -4]], '#1E8C8C', 1.5);
}
function drawHeadBack(c, s) {
  if (s.hairStyle === 'long') { rr(c, 0, 10, 66, 74, 26, s.hair, INK, 2); rr(c, 22, 4, 10, 60, 5, s.streak, null, 0); }
  else if (s.hairStyle === 'short') ell(c, 0, -6, 62, 52, s.hair, INK, 2);
  else for (const sd of [-1, 1]) {
    c.save(); c.translate(36 * sd, 2); c.rotate(-0.35 * sd);
    ell(c, 0, 0, 26, 40, s.hair, INK, 2); ell(c, 0, -17, 10, 7, s.accent, INK, 1);
    c.restore();
  }
  if (s.kind === 'sea') for (const sd of [-1, 1]) poly(c, [[24 * sd, -8], [38 * sd, -18], [36 * sd, 4], [24 * sd, 6]], s.streak, INK, 2);
}
function drawHeadFront(c, s) {
  c.beginPath(); c.arc(0, 0, 26, 0, 2 * PI); paint(c, s.skin, INK, 2.5);
  ell(c, 0, -17, 58, 26, s.hair, INK, 2);
  ell(c, -12, -18, 13, 22, s.streak);
  for (const x of [-10, 10]) {
    ell(c, x, 0, 13, 16, '#FFFFFF', INK, 1.5);
    ell(c, x, 1, 9, 9, s.eyes); ell(c, x, 1, 4, 4, INK); ell(c, x + 1.5, -1.5, 2.5, 2.5, '#FFFFFF');
    const d = x < 0 ? -1 : 1;
    segs(c, [[x + 5 * d, -6, x + 9 * d, -9], [x + 2 * d, -8, x + 4 * d, -12]], INK, 1.8);
  }
  ell(c, 0, 13, 11, 5, s.lips);
  if (s.kind === 'vampire') for (const x of [-3, 3]) poly(c, [[x - 1.8, 14], [x + 1.8, 14], [x, 19]], '#FFFFFF', INK, 0.8);
  if (s.kind === 'wolf') for (const sd of [-1, 1]) {
    poly(c, [[12 * sd, -20], [26 * sd, -22], [22 * sd, -42]], s.hair, INK, 2);
    poly(c, [[15 * sd, -23], [23 * sd, -24], [21 * sd, -35]], '#FF9EC4', null, 0);
  }
  if (s.kind === 'stitch') segs(c, [[13, 2, 19, 14], [13, 9, 18, 7], [15, 13, 20, 11], [-22, -6, -14, -14], [-21, -12, -17, -8]], INK, 1.5);
  if (s.kind === 'ghost') txt(c, '✦', -22, 14, 10, '#FFFFFF', '10px system-ui');
  if (s.kind === 'mummy') segs(c, [[-25, -4, 25, -10], [-25, 6, -8, 4]], '#FFFFFF', 3);
  if (s.accessory === 'bow') {
    c.save(); c.translate(17, -26);
    poly(c, [[0, 0], [-12, -8], [-12, 8]], s.accent, INK, 1.5); poly(c, [[0, 0], [12, -8], [12, 8]], s.accent, INK, 1.5);
    ell(c, 0, 0, 6, 6, s.accent, INK, 1.5); c.restore();
  } else if (s.accessory === 'crown') {
    poly(c, [[-14, -28], [14, -28], [16, -42], [7, -34], [0, -44], [-7, -34], [-16, -42]], '#FFD54F', INK, 1.5);
    ell(c, 0, -32, 5, 5, s.accent);
  } else if (s.accessory === 'hat') {
    ell(c, 0, -24, 80, 12, INK, s.accent, 1.5);
    poly(c, [[-22, -25], [22, -25], [10, -58], [24, -72]], INK, s.accent, 1.5);
    segs(c, [[-19, -31, 19, -31]], s.accent, 4);
  } else if (s.accessory === 'glasses') {
    for (const x of [-10, 10]) { c.beginPath(); c.arc(x, 0, 10, 0, 2 * PI); c.strokeStyle = s.accent === '#FFFFFF' ? INK : s.accent; c.lineWidth = 2.5; c.stroke(); }
    segs(c, [[-1, -1, 1, -1]], INK, 2);
  }
}
// Teile mit Versatz und Ebene (für Vorschau & Physik)
const PARTS = [
  { k: 'headBack', x: 0, y: -51, z: 0.5, fn: drawHeadBack },
  { k: 'legL', x: -9, y: 48, z: 0.8, fn: drawLeg }, { k: 'legR', x: 9, y: 48, z: 0.8, fn: drawLeg },
  { k: 'torso', x: 0, y: 0, z: 1, fn: drawTorso },
  { k: 'armL', x: -23, y: 2, z: 2, fn: drawArm }, { k: 'armR', x: 23, y: 2, z: 2, fn: drawArm },
  { k: 'head', x: 0, y: -51, z: 3, fn: drawHeadFront },
];
function drawGhoulStatic(c, s) {
  c.save(); if (s.kind === 'ghost') c.globalAlpha = 0.82;
  for (const p of PARTS) { c.save(); c.translate(p.x, p.y); p.fn(c, s); c.restore(); }
  c.restore();
}
function drawAvatar(cv, s) {
  const dpr = window.devicePixelRatio || 1, size = cv.clientWidth || 52;
  cv.width = size * dpr; cv.height = size * dpr;
  const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
  c.save(); c.beginPath(); c.arc(size / 2, size / 2, size / 2, 0, 2 * PI); c.clip();
  c.fillStyle = alpha(s.top === '#1C1C1C' ? '#FF4FA3' : s.top, 0.45); c.fillRect(0, 0, size, size);
  c.translate(size / 2, size / 2 + size * 0.1); c.scale(size / 66, size / 66);
  if (s.kind === 'ghost') c.globalAlpha = 0.85;
  drawHeadBack(c, s); drawHeadFront(c, s);
  c.restore();
  c.beginPath(); c.arc(size / 2, size / 2, size / 2 - 1, 0, 2 * PI); c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = 2; c.stroke();
}

// ---------------------------------------------------------------- Sound (synthetisiert)
const Sfx = (() => {
  let ac = null, master = null, musicGain = null, musicOn = load('musicOn') !== false, ready = false;
  const bufs = {}, last = {};
  function render(dur, f) {
    const sr = ac.sampleRate, n = Math.floor(dur * sr), b = ac.createBuffer(1, n, sr), d = b.getChannelData(0);
    for (let i = 0; i < n; i++) { const v = f(i / sr); d[i] = v > 1 ? 1 : v < -1 ? -1 : v; }
    return b;
  }
  function O() { let ph = 0; const sr = ac.sampleRate; return f => { ph += 2 * PI * f / sr; return Math.sin(ph); }; }
  const N = () => Math.random() * 2 - 1;
  function build() {
    let o, lp;
    o = O(); bufs.boing = render(0.45, t => o(140 + 420 * (1 - Math.exp(-t * 9)) + 40 * Math.sin(t * 2 * PI * 18)) * Math.exp(-t * 6) * 0.8);
    o = O(); bufs.blubb = render(0.6, t => { const k = (t * 9) % 1; return o(180 + 700 * k) * Math.exp(-k * 6) * Math.exp(-t * 2.5) * 0.7; });
    o = O(); bufs.pop = render(0.12, t => o(950 - 5500 * t) * Math.exp(-t * 30) * 0.7);
    lp = 0; bufs.rip = render(0.4, t => { const g = Math.sin(t * 2 * PI * 55) > 0 ? 1 : 0.25; lp += 0.35 * (N() - lp); return lp * g * Math.exp(-t * 5) * 1.2; });
    o = O(); lp = 0; bufs.thud = render(0.2, t => { lp += 0.15 * (N() - lp); return (o(95 - 250 * t) * 0.9 + lp * 0.6) * Math.exp(-t * 22); });
    o = O(); bufs.klonk = render(0.18, t => (o(320 - 300 * t) * 0.7 + Math.sin(t * 2 * PI * 830) * 0.3) * Math.exp(-t * 28));
    lp = 0; bufs.whoosh = render(0.35, t => { lp += (0.04 + 0.25 * t) * (N() - lp); return lp * Math.sin(PI * t / 0.35) * 1.6; });
    o = O(); bufs.squeak = render(0.1, t => o(2300 + 500 * Math.sin(t * 2 * PI * 60)) * Math.sin(PI * t / 0.1) * 0.35);
    const notes = [880, 1046.5, 1318.5, 1760];
    bufs.chime = render(0.7, t => { let v = 0; notes.forEach((f, i) => { const st = i * 0.07; if (t >= st) v += Math.sin(2 * PI * f * (t - st)) * Math.exp(-(t - st) * 6); }); return v * 0.22; });
    o = O(); bufs.ghost = render(1.0, t => o(420 - 160 * t + 25 * Math.sin(t * 2 * PI * 6)) * Math.sin(PI * t) * 0.45);
  }
  // ---- Musik: ein eigenes Stück pro Szene (alles synthetisiert) ----
  const hz = m => 440 * Math.pow(2, (m - 69) / 12);
  const INSTR = {
    harp: (f, ts) => { let v = 0; for (let h = 1; h <= 4; h++) v += Math.sin(2 * PI * f * h * ts) / (h * h); return v * Math.exp(-ts * 14) * 0.35; },
    flute: (f, ts) => (Math.sin(2 * PI * f * ts + 0.25 * Math.sin(2 * PI * 5.5 * ts)) + 0.15 * Math.sin(4 * PI * f * ts)) * (1 - Math.exp(-ts * 25)) * Math.exp(-ts * 2.2) * 0.22,
    box: (f, ts) => (Math.sin(2 * PI * f * ts) + 0.35 * Math.sin(2 * PI * f * 2 * ts) + 0.12 * Math.sin(2 * PI * f * 5.4 * ts)) * Math.exp(-ts * 7) * 0.26,
    bell: (f, ts) => (Math.sin(2 * PI * f * ts) + 0.5 * Math.sin(2 * PI * f * 2.76 * ts) + 0.25 * Math.sin(2 * PI * f * 5.4 * ts)) * Math.exp(-ts * 3.5) * 0.2,
  };
  const TRACKS = {
    // Schulflur: flottes Cembalo in a-Moll
    hall: { bpm: 112, steps: 16, lead: 'harp', oct: 12, pad: 0.05, bass: 'quarter',
      chords: [[57, 60, 64], [53, 57, 60], [48, 52, 55], [52, 56, 59], [57, 60, 64], [50, 53, 57], [52, 55, 59], [52, 56, 59]],
      pat: [0, 1, 2, 1, 0, 2, 1, 2, 0, 1, 2, 1, 2, 1, 0, 1] },
    // Gruselwald: langsame Flöte in d-Moll, Grillen
    forest: { bpm: 80, steps: 16, lead: 'flute', oct: 12, pad: 0.045, bass: 'half', crickets: true,
      chords: [[62, 65, 69], [58, 62, 65], [53, 57, 60], [60, 64, 67], [62, 65, 69], [55, 58, 62], [57, 61, 64], [57, 61, 64]],
      pat: [0, -1, 2, -1, 1, -1, 2, 1, 0, -1, 2, -1, 1, 2, 1, -1] },
    // Klassenzimmer: verspielte Spieluhr im Walzertakt
    class: { bpm: 150, steps: 12, lead: 'box', oct: 24, pad: 0.025, bass: 'waltz',
      chords: [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62], [60, 64, 67], [57, 60, 64], [50, 53, 57], [55, 59, 62]],
      pat: [0, -1, 1, 2, 1, -1, 2, -1, 1, 0, 1, 2] },
    // Friedhof: tiefe Orgel in e-Moll, Glocke zu jedem Takt
    grave: { bpm: 66, steps: 16, lead: 'bell', oct: 12, pad: 0.09, bass: 'whole', bellBar: true,
      chords: [[64, 67, 71], [60, 64, 67], [57, 60, 64], [59, 63, 66], [64, 67, 71], [62, 65, 69], [60, 64, 67], [59, 63, 66]],
      pat: [0, -1, -1, -1, 2, -1, -1, -1, 1, -1, -1, -1, 2, -1, 1, -1] },
  };
  function musicSampler(id) {
    const T = TRACKS[id] || TRACKS.hall, step = 60 / T.bpm / 4, bar = step * T.steps, total = bar * T.chords.length;
    const lead = INSTR[T.lead];
    return { total, f: t => {
      const bi = Math.min(Math.floor(t / bar), T.chords.length - 1), ch = T.chords[bi], tb = t - bi * bar;
      const si = Math.min(Math.floor(tb / step), T.steps - 1), ts = tb - si * step;
      let v = 0;
      // Melodie: bei Pausen (-1) klingt der vorige Ton weiter aus
      let k = si; while (k > 0 && T.pat[k] < 0) k--;
      if (T.pat[k] >= 0) v += lead(hz(ch[T.pat[k]] + T.oct), tb - k * step);
      const bf = hz(ch[0] - 24);
      if (T.bass === 'quarter') { const tq = tb % (step * 4); v += (Math.sin(2 * PI * bf * tq) + 0.3 * Math.sin(4 * PI * bf * tq)) * Math.exp(-tq * 3) * 0.45; }
      else if (T.bass === 'half') { const tq = tb % (step * 8); v += Math.sin(2 * PI * bf * tq) * Math.exp(-tq * 1.2) * 0.4; }
      else if (T.bass === 'whole') { v += (Math.sin(2 * PI * bf * tb) + 0.5 * Math.sin(2 * PI * bf * 2 * tb)) * Math.min(1, tb * 4) * Math.exp(-tb * 0.5) * 0.3; }
      else if (T.bass === 'waltz') {
        const beat = Math.floor(si / 4), tq = tb - beat * step * 4;
        if (beat === 0) v += Math.sin(2 * PI * bf * tq) * Math.exp(-tq * 4) * 0.45;
        else for (const n of ch) v += Math.sin(2 * PI * hz(n) * tq) * Math.exp(-tq * 9) * 0.09;
      }
      let pad = 0; for (const n of ch) pad += Math.sin(2 * PI * hz(n) * t) + 0.4 * Math.sin(4 * PI * hz(n) * t);
      v += pad * T.pad * (0.8 + 0.2 * Math.sin(2 * PI * 5 * t));
      if (T.bellBar) v += INSTR.bell(hz(ch[0] - 12), tb) * 0.8;
      if (T.crickets) { const c = t % 1.7; if (c < 0.12) v += Math.sin(2 * PI * 4300 * t) * (Math.sin(2 * PI * 55 * t) > 0 ? 1 : 0) * 0.035; }
      return v * Math.min(1, t / 0.05, (total - t) / 0.05);
    } };
  }
  // erzeugt Musik in kleinen Stücken, damit das Spiel dabei nicht ruckelt
  function buildMusicAsync(id, done) {
    const { total, f } = musicSampler(id), sr = ac.sampleRate, n = Math.floor(total * sr);
    const b = ac.createBuffer(1, n, sr), d = b.getChannelData(0);
    let i = 0;
    const step = () => {
      const end = Math.min(n, i + 20000);
      for (; i < end; i++) { const v = f(i / sr); d[i] = v > 1 ? 1 : v < -1 ? -1 : v; }
      if (i < n) setTimeout(step, 8); else done(b);
    };
    step();
  }
  const songs = {}; let track = (['hall', 'forest', 'class', 'grave'])[load('scene') || 0] || 'hall', current = null, building = {};
  function startTrack(id) {
    track = id;
    if (!ac) return;
    const go = buf => {
      if (track !== id) return;
      const now = ac.currentTime;
      if (current) { const old = current; old.g.gain.setTargetAtTime(0, now, 0.4); setTimeout(() => { try { old.src.stop(); } catch (e) {} }, 2500); }
      const g = ac.createGain(); g.gain.value = 0; g.connect(musicGain);
      const src = ac.createBufferSource(); src.buffer = buf; src.loop = true; src.connect(g); src.start();
      g.gain.setTargetAtTime(1, now, 0.5);
      current = { src, g };
    };
    if (songs[id]) return go(songs[id]);
    if (building[id]) return;
    building[id] = true;
    buildMusicAsync(id, buf => { songs[id] = buf; building[id] = false; go(buf); });
  }
  function unlock() {
    if (ac) { if (ac.state === 'suspended') ac.resume(); return; }
    try {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      master = ac.createGain(); master.connect(ac.destination);
      build();
      ready = true;
      musicGain = ac.createGain(); musicGain.gain.value = musicOn ? 0.22 : 0; musicGain.connect(master);
      // Musik erst nach dem Tipp erzeugen, damit das Greifen nicht ruckelt
      setTimeout(() => startTrack(track), 600);
    } catch (e) { ac = null; }
  }
  function play(name, vol = 1, gap = 0.04) {
    if (!ready) return;
    const now = performance.now() / 1000;
    if (last[name] && now - last[name] < gap) return;
    last[name] = now;
    const src = ac.createBufferSource(), g = ac.createGain();
    src.buffer = bufs[name]; g.gain.value = Math.max(0, Math.min(1, vol));
    src.connect(g); g.connect(master); src.start();
  }
  function toggleMusic() {
    musicOn = !musicOn; save('musicOn', musicOn);
    if (musicGain) musicGain.gain.value = musicOn ? 0.22 : 0;
    return musicOn;
  }
  return { unlock, play, toggleMusic, setTrack: startTrack, get musicOn() { return musicOn; } };
})();
const buzz = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) {} };

// ---------------------------------------------------------------- Physik-Welt
const canvas = $('game'), ctx = canvas.getContext('2d');
const engine = Engine.create(); const world = engine.world;
engine.gravity.y = 1;
const FLOOR = 40;
let W = 800, H = 600, dpr = 1;
// Welt-Maßstab: Auf kleinen Geräten wird die ganze Spielwelt (Figuren, Gegenstände, Kulisse)
// verkleinert, damit die Figuren genug Platz zum Toben haben. Die Physik rechnet in Welt-Einheiten.
let S = 1;
let statics = [], webBody = null, cauldron = null, webWobble = 0;
const particles = [], texts = [];
const bgCanvas = document.createElement('canvas');

function buildStatics() {
  Composite.remove(world, statics);
  const o = { isStatic: true, friction: 0.8, plugin: { kind: 'wall' } };
  statics = [
    Bodies.rectangle(W / 2, H - FLOOR + 100, W * 3, 200, o),
    Bodies.rectangle(-100, H / 2, 200, H * 4, o),
    Bodies.rectangle(W + 100, H / 2, 200, H * 4, o),
    Bodies.rectangle(W / 2, -100, W * 3, 200, o),
  ];
  const wx = W * 0.16, wy = H - FLOOR - 60;
  webBody = Bodies.rectangle(wx, wy, 160, 8, { isStatic: true, friction: 0.2, plugin: { kind: 'web' } });
  const cx = W * 0.84, cy = H - FLOOR;
  cauldron = { x: cx, y: cy };
  const wallL = Bodies.rectangle(cx - 52, cy - 55, 10, 92, { isStatic: true, angle: 0.12, plugin: { kind: 'wall' } });
  const wallR = Bodies.rectangle(cx + 52, cy - 55, 10, 92, { isStatic: true, angle: -0.12, plugin: { kind: 'wall' } });
  const sensor = Bodies.rectangle(cx, cy - 50, 86, 70, { isStatic: true, isSensor: true, plugin: { kind: 'cauldron' } });
  statics.push(webBody, wallL, wallR, sensor);
  Composite.add(world, statics);
}

// ---------------------------------------------------------------- Szenen
const SCENES = [
  { id: 'hall', emoji: '🏫', name: { de: 'Schulflur', en: 'Hallway', hu: 'Folyosó' } },
  { id: 'forest', emoji: '🌲', name: { de: 'Gruselwald', en: 'Spooky forest', hu: 'Kísértetes erdő' } },
  { id: 'class', emoji: '📚', name: { de: 'Klassenzimmer', en: 'Classroom', hu: 'Osztályterem' } },
  { id: 'grave', emoji: '🪦', name: { de: 'Friedhof', en: 'Graveyard', hu: 'Temető' } },
];
let sceneIdx = Math.min(SCENES.length - 1, Math.max(0, load('scene') || 0));
const scene = () => SCENES[sceneIdx].id;
const sceneName = sc => sc.name[lang] || sc.name.en;
function setScene(i) {
  sceneIdx = (i + SCENES.length) % SCENES.length; save('scene', sceneIdx);
  buildBackground(); Sfx.setTrack(scene()); renderTop(); renderMenu();
  toast(SCENES[sceneIdx].emoji + ' ' + sceneName(SCENES[sceneIdx]));
}

// Hilfen für die Kulissen (zufällig, aber pro Szene immer gleich)
function seeded(seed) { let x = seed; return () => { x = (x * 16807) % 2147483647; return (x - 1) / 2147483646; }; }
function sky(c, top, bottom) { const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, top); g.addColorStop(1, bottom); c.fillStyle = g; c.fillRect(0, 0, W, H); }
function moon(c, x, y, r, bg) { ell(c, x, y, r * 2, r * 2, '#FFF1B8'); if (bg) ell(c, x - r * 0.5, y - r * 0.25, r * 1.8, r * 1.8, bg); }
function stars(c, n, maxY, seed) { const R = seeded(seed); for (let i = 0; i < n; i++) ell(c, R() * W, R() * maxY, 2.5, 2.5, `rgba(255,240,200,${0.3 + R() * 0.6})`); }
function title(c, color) {
  c.font = `${Math.min(64, W / 14)}px Creepster, Chalkduster, fantasy`; c.fillStyle = color;
  c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(tr('title'), W / 2, 90);
}
const GY = () => H - FLOOR;   // Bodenhöhe

function drawHall(c) {
  sky(c, '#1B0B26', '#3A1650');
  const cols = ['#E0207F', '#141014', '#38D1C1', '#141014'], syms = ['☠', '♥', '🦇', '☾'];
  c.globalAlpha = 0.5;
  for (let x = 0, i = 0; x < W; x += 60, i++) {
    rr(c, x + 30, GY() - 115, 58, 230, 3, cols[i % 4], '#0A0A0A', 3);
    for (const y of [-90, -82, -74, -66]) segs(c, [[x + 14, GY() - 115 + y, x + 46, GY() - 115 + y]], 'rgba(255,255,255,.5)', 2);
    ell(c, x + 48, GY() - 115, 6, 6, '#FFFFFF');
    if (i % 3 === 0) txt(c, syms[i % 4], x + 30, GY() - 145, 20, '#FFFFFF', '20px system-ui');
  }
  c.globalAlpha = 1;
  moon(c, W - 130, 120, 45, '#1F0C2C');
  const web = [];
  for (let a = 0; a <= PI / 2 + 0.01; a += PI / 10) web.push([0, 0, Math.cos(a) * 170, Math.sin(a) * 170]);
  for (const r of [40, 80, 120, 160]) for (let a = 0; a < PI / 2 - 0.01; a += PI / 10)
    web.push([Math.cos(a) * r, Math.sin(a) * r, Math.cos(a + PI / 10) * r, Math.sin(a + PI / 10) * r]);
  segs(c, web, 'rgba(255,255,255,.3)', 1.2);
  title(c, 'rgba(255,79,163,.55)');
  for (let row = 0; row * 20 < FLOOR; row++) for (let x = 0, col = 0; x < W; x += 20, col++) {
    c.fillStyle = (row + col) % 2 ? '#FF4FA3' : '#141014'; c.fillRect(x, GY() + row * 20, 20, 20);
  }
}

function drawForest(c) {
  sky(c, '#07141A', '#17352B');
  stars(c, 60, H * 0.4, 7);
  moon(c, W * 0.78, 110, 50);
  const R = seeded(42);
  // drei Ebenen Tannen-Silhouetten, hinten heller
  const layers = [['#1C3B37', 0.55, 160], ['#14302A', 0.72, 210], ['#0C211C', 0.9, 260]];
  for (const [col, base, hgt] of layers) {
    for (let x = -40; x < W + 60; x += 46 + R() * 40) {
      const h = hgt * (0.7 + R() * 0.5), y = GY() - (1 - base) * 120;
      poly(c, [[x - h * 0.28, y], [x, y - h], [x + h * 0.28, y]], col, null, 0);
    }
  }
  // knorriger Baum mit leuchtenden Augen
  const tx = W * 0.5;
  poly(c, [[tx - 40, GY()], [tx - 22, GY() - 230], [tx - 70, GY() - 300], [tx - 14, GY() - 260], [tx + 4, GY() - 330], [tx + 18, GY() - 250], [tx + 70, GY() - 290], [tx + 26, GY() - 220], [tx + 42, GY()]], '#24130E', null, 0);
  ell(c, tx - 8, GY() - 170, 14, 9, '#FFE066'); ell(c, tx + 12, GY() - 170, 14, 9, '#FFE066');
  ell(c, tx - 8, GY() - 170, 4, 7, INK); ell(c, tx + 12, GY() - 170, 4, 7, INK);
  // Pilze und Büsche
  for (let i = 0; i < 9; i++) { const x = R() * W; ell(c, x, GY() - 6, 30 + R() * 40, 22, '#0F2A1F'); }
  for (let i = 0; i < 6; i++) { const x = 30 + R() * (W - 60); rr(c, x, GY() - 7, 5, 14, 2, '#E9D9B0', null, 0); ell(c, x, GY() - 15, 16, 9, i % 2 ? '#FF4FA3' : '#9D7BFF'); }
  title(c, 'rgba(140,255,79,.35)');
  // Waldboden
  c.fillStyle = '#2B1B12'; c.fillRect(0, GY(), W, FLOOR);
  c.fillStyle = '#2F5A2A'; c.fillRect(0, GY(), W, 8);
  const blades = []; for (let x = 0; x < W; x += 7) blades.push([x, GY() + 4, x + 3, GY() - 6 - R() * 6]);
  segs(c, blades, '#3E7A35', 2);
}

function drawClass(c) {
  sky(c, '#2A1B3D', '#3D2752');
  // Holzvertäfelung unten
  c.fillStyle = '#4A2E25'; c.fillRect(0, GY() - 120, W, 120);
  segs(c, [[0, GY() - 120, W, GY() - 120]], '#2B1A14', 4);
  for (let x = 40; x < W; x += 80) segs(c, [[x, GY() - 118, x, GY()]], 'rgba(0,0,0,.25)', 2);
  // Tafel mit Kreide-Titel
  const bw = Math.min(W * 0.55, 620), bx = W * 0.42, by = GY() - 300;
  rr(c, bx, by, bw + 24, 190, 6, '#7A4A2B', '#3A2214', 3);
  rr(c, bx, by, bw, 166, 4, '#1F3B2D', null, 0);
  c.font = `${Math.min(52, bw / 11)}px Creepster, Chalkduster, fantasy`; c.fillStyle = 'rgba(255,255,255,.85)';
  c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(tr('title'), bx, by - 30);
  txt(c, '1 + 1 = 👻    🕷 × 8 = ?', bx, by + 30, 22, 'rgba(255,255,255,.7)', '22px Chalkduster, "Comic Sans MS", cursive');
  rr(c, bx, by + 92, bw * 0.6, 8, 3, '#5A3A22', null, 0);
  ell(c, bx - bw * 0.2, by + 86, 20, 7, '#FFFFFF');
  // Fenster mit Mond
  const wx = W * 0.88;
  rr(c, wx, GY() - 300, 120, 160, 4, '#0E0820', '#7A4A2B', 6);
  moon(c, wx + 18, GY() - 330, 22, '#0E0820');
  segs(c, [[wx, GY() - 380, wx, GY() - 220], [wx - 60, GY() - 300, wx + 60, GY() - 300]], '#7A4A2B', 5);
  // Uhr
  ell(c, W * 0.08, 90, 60, 60, '#F6EAF8', INK, 4); segs(c, [[W * 0.08, 90, W * 0.08, 70], [W * 0.08, 90, W * 0.08 + 14, 96]], INK, 3);
  // Schultische im Hintergrund
  c.globalAlpha = 0.45;
  for (let x = 90; x < W; x += 210) { rr(c, x, GY() - 66, 120, 10, 3, '#8A5A3A', null, 0); segs(c, [[x - 50, GY() - 60, x - 50, GY()], [x + 50, GY() - 60, x + 50, GY()]], '#5A3A22', 6); }
  c.globalAlpha = 1;
  // Holzdielen
  c.fillStyle = '#6B4430'; c.fillRect(0, GY(), W, FLOOR);
  for (let y = GY(); y < H; y += 10) segs(c, [[0, y, W, y]], 'rgba(0,0,0,.25)', 1);
  for (let x = 0, r = 0; x < W; x += 70, r++) segs(c, [[x + (r % 2) * 35, GY(), x + (r % 2) * 35, H]], 'rgba(0,0,0,.2)', 1);
}

function drawGrave(c) {
  sky(c, '#160E26', '#3B2C4A');
  stars(c, 50, H * 0.35, 11);
  moon(c, W * 0.2, 120, 60);
  const R = seeded(5);
  // Hügel
  c.fillStyle = '#251B33'; c.beginPath(); c.moveTo(0, GY()); c.quadraticCurveTo(W * 0.3, GY() - 160, W * 0.6, GY() - 60); c.quadraticCurveTo(W * 0.8, GY() - 140, W, GY() - 40); c.lineTo(W, GY()); c.fill();
  // Zaun
  const fence = []; for (let x = 0; x < W; x += 22) fence.push([x, GY() - 30, x, GY() - 90]);
  fence.push([0, GY() - 75, W, GY() - 75], [0, GY() - 45, W, GY() - 45]);
  segs(c, fence, '#140C1E', 4);
  for (let x = 0; x < W; x += 22) poly(c, [[x - 5, GY() - 88], [x, GY() - 100], [x + 5, GY() - 88]], '#140C1E', null, 0);
  // kahler Baum
  const tx = W * 0.62;
  segs(c, [[tx, GY(), tx, GY() - 210], [tx, GY() - 150, tx - 70, GY() - 230], [tx, GY() - 180, tx + 60, GY() - 260], [tx - 40, GY() - 200, tx - 60, GY() - 260], [tx + 30, GY() - 220, tx + 80, GY() - 230]], '#140C1E', 10);
  // Grabsteine
  for (let i = 0; i < 7; i++) {
    const x = 60 + i * (W - 120) / 6 + (R() - 0.5) * 40, h = 60 + R() * 40;
    if (Math.abs(x - W * 0.16) < 110 || Math.abs(x - W * 0.84) < 90) continue;   // Platz für die Spielgeräte
    pathRR(c, x, GY() - h / 2, 46, h, 18); paint(c, '#6E6A80', '#2E2A3A', 3);
    txt(c, i % 2 ? 'RIP' : '✝', x, GY() - h + 26, 14, '#2E2A3A');
  }
  title(c, 'rgba(185,166,255,.4)');
  // Nebel
  for (let i = 0; i < 10; i++) ell(c, R() * W, GY() - 10 - R() * 30, 160 + R() * 120, 30, 'rgba(220,210,255,.07)');
  c.fillStyle = '#2A2018'; c.fillRect(0, GY(), W, FLOOR);
  c.fillStyle = '#3A4A2A'; c.fillRect(0, GY(), W, 6);
}

const SCENE_DRAW = { hall: drawHall, forest: drawForest, class: drawClass, grave: drawGrave };
function buildBackground() {
  bgCanvas.width = Math.round(W * S * dpr); bgCanvas.height = Math.round(H * S * dpr);
  const c = bgCanvas.getContext('2d'); c.setTransform(dpr * S, 0, 0, dpr * S, 0, 0);
  SCENE_DRAW[scene()](c);
}

// Spielgeräte: gleiche Physik, Aussehen je nach Szene
const FX = {
  hall: { bubble: '#8CFF4F' }, forest: { bubble: '#C6FF7A' }, class: { bubble: '#D9A6FF' }, grave: { bubble: '#9FD8FF' },
};
function drawFixtures(c) {
  const sc = scene();
  const wx = webBody.position.x, wy = webBody.position.y, wob = Math.sin(webWobble * 30) * webWobble * 40;
  if (sc === 'hall' || sc === 'grave') {
    if (sc === 'hall') for (const x of [-85, 85]) rr(c, wx + x, wy + 25, 8, 70, 3, INK, '#FF4FA3', 1.5);
    else for (const x of [-92, 92]) { pathRR(c, wx + x, wy + 20, 34, 84, 14); paint(c, '#7A7690', '#2E2A3A', 3); txt(c, '✝', wx + x, wy + 4, 14, '#2E2A3A'); }
    const s = [[wx - 80, wy, wx + 80, wy]];
    for (let x = -70; x <= 70; x += 20) s.push([wx + x, wy, wx + x * 0.6, wy + 14 + wob]);
    s.push([wx - 48, wy + 14 + wob, wx + 48, wy + 14 + wob]);
    segs(c, s, '#FFFFFF', 2);
    txt(c, '🕷', wx + 60, wy + 26 + wob, 18, '#FFF', '18px system-ui');
  } else if (sc === 'forest') {
    // Riesenpilz: Hut federt
    rr(c, wx, wy + 30, 38, 62, 12, '#E9D9B0', '#8A7A5A', 2);
    c.save(); c.translate(wx, wy + 2 + wob * 0.4); c.scale(1 + webWobble * 0.3, 1 - webWobble * 0.4);
    c.beginPath(); c.ellipse(0, 0, 86, 34, 0, PI, 2 * PI); c.closePath(); paint(c, '#C2185B', '#5A0A2A', 3);
    for (const [dx, dy, r] of [[-45, -14, 9], [-10, -24, 11], [30, -16, 8], [58, -6, 6], [-66, -4, 6]]) ell(c, dx, dy, r * 2, r * 1.6, '#FFF3D6');
    c.restore();
  } else {
    // Turnmatte mit Sprungfedern
    const sp = []; for (let x = -60; x <= 60; x += 30) { for (let k = 0; k < 4; k++) sp.push([wx + x - 6, wy + 10 + k * 11 + wob * 0.2, wx + x + 6, wy + 15 + k * 11 + wob * 0.2]); }
    segs(c, sp, '#B0B0B8', 3);
    rr(c, wx, wy + wob * 0.4, 170, 16, 6, '#3B6FD8', '#1A3A8A', 2.5);
    segs(c, [[wx - 70, wy + wob * 0.4, wx + 70, wy + wob * 0.4]], 'rgba(255,255,255,.5)', 2);
  }
  // Schleuder (Kessel / Baumstumpf / Becherglas / Brunnen)
  const { x, y } = cauldron;
  if (sc === 'hall') {
    poly(c, [[x - 55, y - 90], [x + 55, y - 90], [x + 48, y - 20], [x + 30, y], [x - 30, y], [x - 48, y - 20]], '#1A1A1A', '#8CFF4F', 3);
    ell(c, x, y - 88, 104, 20, '#8CFF4F', '#3FA81E', 2);
    rr(c, x, y - 92, 122, 12, 6, null, '#444444', 4);
    txt(c, 'BLUBB', x, y - 45, 12, '#8CFF4F');
  } else if (sc === 'forest') {
    poly(c, [[x - 58, y], [x - 52, y - 90], [x + 52, y - 90], [x + 58, y]], '#5A3A22', '#2B1A10', 3);
    segs(c, [[x - 30, y - 80, x - 34, y - 10], [x + 6, y - 84, x + 2, y - 8], [x + 34, y - 78, x + 38, y - 12]], '#3A2414', 3);
    ell(c, x, y - 90, 104, 22, '#8A5A3A', '#2B1A10', 3); ell(c, x, y - 90, 80, 14, '#C6FF7A');
  } else if (sc === 'class') {
    poly(c, [[x - 50, y - 96], [x + 50, y - 96], [x + 50, y - 6], [x + 42, y], [x - 42, y], [x - 50, y - 6]], 'rgba(220,240,255,.18)', '#DDE8F0', 3);
    poly(c, [[x - 48, y - 60], [x + 48, y - 60], [x + 48, y - 6], [x + 42, y - 2], [x - 42, y - 2], [x - 48, y - 6]], 'rgba(157,123,255,.75)', null, 0);
    for (const yy of [-80, -60, -40, -20]) segs(c, [[x + 36, y + yy, x + 48, y + yy]], '#DDE8F0', 2);
    txt(c, '🧪', x - 30, y - 110, 22, '#fff', '22px system-ui');
  } else {
    poly(c, [[x - 56, y], [x - 56, y - 70], [x + 56, y - 70], [x + 56, y]], '#5E5A70', '#2E2A3A', 3);
    for (let yy = -60; yy < 0; yy += 18) for (let xx = -48 + (yy % 36 ? 14 : 0); xx < 50; xx += 28) rr(c, x + xx, y + yy + 9, 24, 14, 2, null, '#2E2A3A', 1.5);
    ell(c, x, y - 70, 110, 20, '#9FD8FF', '#2E2A3A', 3);
    segs(c, [[x - 50, y - 70, x - 50, y - 130], [x + 50, y - 70, x + 50, y - 130], [x - 60, y - 130, x + 60, y - 130]], '#3A2A20', 6);
  }
  if (Math.random() < 0.08) particles.push({ x: x + rnd(-40, 40), y: y - 90, vx: 0, vy: -rnd(0.5, 1.2), life: 1, r: 5, color: FX[sc].bubble });
  // Stimmung: Glühwürmchen im Wald, Geister-Irrlichter auf dem Friedhof
  if (sc === 'forest' && Math.random() < 0.05) particles.push({ x: rnd(0, W), y: rnd(H * 0.3, GY() - 20), vx: rnd(-0.3, 0.3), vy: rnd(-0.3, 0.1), life: 1, r: 2.5, color: '#E8FF7A' });
  if (sc === 'grave' && Math.random() < 0.03) particles.push({ x: rnd(0, W), y: GY() - rnd(10, 60), vx: rnd(-0.4, 0.4), vy: -0.2, life: 1, r: 4, color: 'rgba(159,216,255,.8)' });
}

// ---------------------------------------------------------------- Figuren & Gegenstände
const ghoulRecords = [];
function spawnPoint() { return { x: W / 2 + rnd(-W * 0.2, W * 0.2), y: 150 }; }

function spawnGhoul(s, p = spawnPoint()) {
  const group = Body.nextGroup(true), ghost = s.kind === 'ghost';
  const opts = (extra) => Object.assign({
    collisionFilter: { group }, friction: 0.6, restitution: 0.25, frictionAir: ghost ? 0.06 : 0.01, density: 0.0015,
    plugin: { kind: 'ghoul', style: s, alpha: ghost ? 0.82 : 1, floaty: ghost, stitched: s.kind === 'stitch' },
  }, extra);
  const mk = (b, draws) => { b.plugin = Object.assign({}, b.plugin, { draws }); return b; };
  const torso = mk(Bodies.rectangle(p.x, p.y, 34, 50, opts({ chamfer: { radius: 8 } })), [{ z: 1, fn: drawTorso }]);
  const head = mk(Bodies.circle(p.x, p.y - 51, 26, opts()), [{ z: 0.5, fn: drawHeadBack }, { z: 3, fn: drawHeadFront }]);
  const arms = [-1, 1].map(sd => mk(Bodies.rectangle(p.x + 23 * sd, p.y - 2, 11, 40, opts({ chamfer: { radius: 4 } })), [{ z: 2, fn: drawArm }]));
  const legs = [-1, 1].map(sd => mk(Bodies.rectangle(p.x + 9 * sd, p.y + 48, 13, 46, opts({ chamfer: { radius: 4 } })), [{ z: 0.8, fn: drawLeg }]));
  const J = (a, pa, b, pb, stiffness = 0.9, length = 0) => Constraint.create({ bodyA: a, pointA: pa, bodyB: b, pointB: pb, stiffness, damping: 0.1, length });
  const cons = [
    J(torso, { x: 0, y: -25 }, head, { x: 0, y: 26 }),
    J(torso, { x: 0, y: -5 }, head, { x: 0, y: -10 }, 0.15, 56),   // hält den Kopf eher aufrecht
    ...arms.map((a, i) => J(torso, { x: (i ? 23 : -23), y: -20 }, a, { x: 0, y: -18 })),
    ...legs.map((l, i) => J(torso, { x: (i ? 9 : -9), y: 25 }, l, { x: 0, y: -23 })),
  ];
  Composite.add(world, [...legs, torso, ...arms, head, ...cons]);
  ghoulRecords.push({ bodies: [torso, head, ...arms, ...legs] });
  toast(tr('appears', `${EMOJI[s.kind]} ${s.name}`));
  Sfx.play(ghost ? 'ghost' : 'chime'); buzz(10);
}

const PROPS = [['pumpkin', '🎃'], ['coffin', '⚰️'], ['book', '📚'], ['locker', '🚪'], ['skull', '💀'], ['bat', '🦇']];
function spawnProp(kind, p = spawnPoint()) {
  let b, draw;
  const base = { friction: 0.6, restitution: 0.2, angle: rnd(-0.3, 0.3) };
  if (kind === 'pumpkin') {
    b = Bodies.circle(p.x, p.y, 26, Object.assign(base, { restitution: 0.35 }));
    draw = c => {
      ell(c, 0, 0, 60, 50, '#FF8A1F', '#8A3B00', 2.5); ell(c, 0, 0, 26, 48, null, '#C85A00', 2);
      rr(c, 0, -28, 7, 12, 2, '#3F7D20', INK, 1.5);
      poly(c, [[-16, -4], [-6, -4], [-11, -13]], INK, null, 0); poly(c, [[6, -4], [16, -4], [11, -13]], INK, null, 0);
      poly(c, [[-16, 6], [-8, 10], [0, 5], [8, 10], [16, 6], [8, 15], [-8, 15]], INK, null, 0);
    };
  } else if (kind === 'coffin') {
    b = Bodies.rectangle(p.x, p.y, 46, 90, Object.assign(base, { chamfer: { radius: 10 }, density: 0.0015 }));
    draw = c => {
      poly(c, [[-16, 45], [16, 45], [24, -20], [10, -45], [-10, -45], [-24, -20]], '#2B1B2F', '#FF4FA3', 3);
      segs(c, [[0, -28, 0, 18], [-11, -16, 11, -16]], '#FF4FA3', 4);
    };
  } else if (kind === 'book') {
    const col = pick(['#7B2CBF', '#E0207F', '#1E8C8C']);
    b = Bodies.rectangle(p.x, p.y, 50, 14, Object.assign(base, { friction: 0.9 }));
    draw = c => { rr(c, 0, 0, 50, 14, 2, col); rr(c, 2, -4, 46, 3, 1, '#FFF3D6', null, 0); txt(c, '☠', -12, 1, 10, '#FFF', '10px system-ui'); };
  } else if (kind === 'locker') {
    const pink = Math.random() < 0.5;
    b = Bodies.rectangle(p.x, p.y, 44, 110, Object.assign(base, { density: 0.003, friction: 0.7 }));
    draw = c => {
      rr(c, 0, 0, 44, 110, 3, pink ? '#E0207F' : INK, pink ? INK : '#FF4FA3', 3);
      segs(c, [[-12, -38, 12, -38], [-12, -32, 12, -32], [-12, -26, 12, -26]], 'rgba(255,255,255,.6)', 2);
      ell(c, 14, 0, 6, 6, '#FFF'); txt(c, '☠', 0, 25, 18, '#FFF', '18px system-ui');
    };
  } else if (kind === 'skull') {
    b = Bodies.circle(p.x, p.y, 16, Object.assign(base, { restitution: 0.9, density: 0.0008 }));
    draw = c => {
      ell(c, 0, 0, 32, 32, '#FFFFFF', INK, 2); ell(c, -6, -3, 8, 10, INK); ell(c, 6, -3, 8, 10, INK);
      segs(c, [[-5, 9, 5, 9], [-2, 7, -2, 11], [2, 7, 2, 11]], INK, 1.5); ell(c, 9, -9, 6, 3, '#FF4FA3');
    };
  } else {
    b = Bodies.circle(p.x, p.y, 10, { frictionAir: 0.03, inertia: Infinity, angle: 0 });
    b.plugin.bat = true; b.plugin.floaty = true;
    draw = c => {
      const f = 0.3 + 0.7 * Math.abs(Math.sin(performance.now() / 80));
      c.save(); c.scale(1, f);
      poly(c, [[-6, -2], [-26, -10], [-20, 0], [-24, 4], [-6, 3]], INK, '#FF4FA3', 1);
      poly(c, [[6, -2], [26, -10], [20, 0], [24, 4], [6, 3]], INK, '#FF4FA3', 1);
      c.restore();
      ell(c, 0, 0, 18, 14, INK, '#FF4FA3', 1); ell(c, -3, -2, 3, 3, '#FF4FA3'); ell(c, 3, -2, 3, 3, '#FF4FA3');
    };
  }
  b.plugin = Object.assign(b.plugin || {}, { kind: 'prop', wood: kind === 'coffin' || kind === 'locker', draws: [{ z: 1.5, fn: draw }] });
  Composite.add(world, b);
  Sfx.play(kind === 'bat' ? 'squeak' : 'pop', 1, 0.02);
}

function clearAll() {
  for (const [id, c] of drags) Composite.remove(world, c);
  drags.clear();
  for (const b of Composite.allBodies(world)) if (!b.isStatic) Composite.remove(world, b);
  for (const c of Composite.allConstraints(world)) Composite.remove(world, c);
  ghoulRecords.length = 0;
  toast(tr('cleared'));
}

// ---------------------------------------------------------------- Schwerkraft
const GRAV = [[1, 'grav.normal', '⬇️'], [0.25, 'grav.moon', '🌙'], [0, 'grav.zero', '✨'], [-0.4, 'grav.up', '⬆️']];
let gravMode = 0;
function cycleGravity() {
  gravMode = (gravMode + 1) % GRAV.length;
  engine.gravity.y = GRAV[gravMode][0];
  if (GRAV[gravMode][0] <= 0) for (const b of Composite.allBodies(world)) if (!b.isStatic)
    Body.setVelocity(b, { x: b.velocity.x + rnd(-2, 2), y: b.velocity.y - rnd(0, 3) });
  toast(tr(GRAV[gravMode][1])); renderTop();
}

// ---------------------------------------------------------------- Effekte
function sparkle(x, y, color, text) {
  for (let i = 0; i < 10; i++) particles.push({ x, y, vx: rnd(-2.4, 2.4), vy: rnd(-3, 0.6), life: 1, r: 3.5, color });
  if (text) texts.push({ x, y: y - 30, life: 1, text, color });
}
let toastTimer = 0;
function toast(s) {
  const el = $('toast'); el.textContent = s; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 1600);
}

// ---------------------------------------------------------------- Kontakte
let lastImpact = 0;
Events.on(engine, 'collisionStart', e => {
  for (const pair of e.pairs) {
    const a = pair.bodyA, b = pair.bodyB;
    for (const [fx, other] of [[a, b], [b, a]]) {
      if (other.isStatic || isDragged(other)) continue;
      const kind = fx.plugin && fx.plugin.kind;
      if (kind === 'web') {
        Body.setVelocity(other, { x: other.velocity.x, y: -rnd(13, 16) });
        webWobble = 0.5; Sfx.play('boing', 1, 0.12); buzz(15);
      } else if (kind === 'cauldron') {
        Body.setVelocity(other, { x: rnd(-4, 4), y: -rnd(18, 21) });
        Body.setAngularVelocity(other, rnd(-0.3, 0.3));
        sparkle(cauldron.x, cauldron.y - 100, '#8CFF4F', 'BLUBB!'); Sfx.play('blubb', 1, 0.25); buzz(30);
      }
    }
    if (a.isSensor || b.isSensor) continue;
    const dvx = a.velocity.x - b.velocity.x, dvy = a.velocity.y - b.velocity.y, sp = Math.hypot(dvx, dvy);
    const now = performance.now();
    if (sp > 5 && now - lastImpact > 70) {
      lastImpact = now;
      const wood = (a.plugin && a.plugin.wood) || (b.plugin && b.plugin.wood);
      Sfx.play(wood ? 'klonk' : 'thud', Math.min(1, sp / 20), 0.07);
    }
  }
});
Events.on(engine, 'beforeUpdate', () => {
  const gy = engine.gravity.y * engine.gravity.scale;
  for (const b of Composite.allBodies(world)) {
    if (!b.plugin || !b.plugin.floaty) continue;
    Body.applyForce(b, b.position, { x: 0, y: -gy * b.mass });
    if (b.plugin.bat && !isDragged(b)) {
      if (Math.random() < 0.03) { Body.setVelocity(b, { x: rnd(-3.5, 3.5), y: rnd(-3, 2.4) }); if (Math.random() < 0.25) Sfx.play('squeak', 0.5, 0.8); }
      if (b.position.y > H - FLOOR - 120) Body.setVelocity(b, { x: b.velocity.x, y: -Math.abs(b.velocity.y) - 0.5 });
    }
  }
});

// ---------------------------------------------------------------- Ziehen & Werfen (Multitouch)
const drags = new Map();
let lastTap = { t: 0, x: 0, y: 0 };
function pickBody(p) {
  const bodies = Composite.allBodies(world).filter(b => !b.isStatic);
  const exact = Query.point(bodies, p);
  if (exact.length) return exact[exact.length - 1];         // oberster Treffer
  const r = 36 / S;                                          // Fingertoleranz in Welt-Einheiten
  let best = null, bestD = Infinity;
  for (const b of bodies) {
    // Abstand zur Körperkontur (Mittelpunkt der nächsten Kante)
    const v = b.vertices; let d = Infinity;
    for (let i = 0; i < v.length; i++) {
      const a = v[i], c = v[(i + 1) % v.length], dx = c.x - a.x, dy = c.y - a.y;
      const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy || 1)));
      d = Math.min(d, Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy)));
    }
    if (d < r && d < bestD) { bestD = d; best = b; }
  }
  return best;
}
const isDragged = b => { for (const c of drags.values()) if (c.bodyB === b) return true; return false; };
function pos(e) { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) / S, y: (e.clientY - r.top) / S }; }
function rip(p) {
  const hit = pickBody(p);
  if (!hit || !hit.plugin.stitched) return false;
  for (const c of Composite.allConstraints(world)) if (c.bodyA === hit || c.bodyB === hit) Composite.remove(world, c);
  for (const [id, c] of drags) if (c.bodyB === hit) drags.delete(id);
  Body.setVelocity(hit, { x: rnd(-4, 4), y: -6 });
  sparkle(p.x, p.y, '#9FE3C8', tr('oops')); Sfx.play('rip'); buzz(40);
  return true;
}
canvas.addEventListener('pointerdown', e => {
  e.preventDefault();
  Sfx.unlock();
  const p = pos(e), now = performance.now();
  const dbl = now - lastTap.t < 320 && Math.hypot(p.x - lastTap.x, p.y - lastTap.y) < 40 / S;
  lastTap = { t: now, x: p.x, y: p.y };
  if ((dbl || e.button === 2) && rip(p)) return;
  const hit = pickBody(p);
  if (!hit) return;
  // greift am Berührungspunkt – oder (bei Toleranz-Treffer) am Rand nahe dem Finger
  const inside = Query.point([hit], p).length > 0;
  const gp = inside ? p : { x: hit.position.x + (p.x - hit.position.x) * 0.5, y: hit.position.y + (p.y - hit.position.y) * 0.5 };
  const c = Constraint.create({ pointA: { x: p.x, y: p.y }, bodyB: hit, pointB: { x: gp.x - hit.position.x, y: gp.y - hit.position.y }, stiffness: 0.9, damping: 0.25, length: 0 });
  Body.setVelocity(hit, { x: 0, y: 0 }); Body.setAngularVelocity(hit, hit.angularVelocity * 0.3);   // sofort „in der Hand“
  Composite.add(world, c); drags.set(e.pointerId, c);
  try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
});
canvas.addEventListener('pointermove', e => { e.preventDefault(); const c = drags.get(e.pointerId); if (c) { const p = pos(e); c.pointA.x = p.x; c.pointA.y = p.y; } });
const endDrag = e => {
  const c = drags.get(e.pointerId); if (!c) return;
  drags.delete(e.pointerId); Composite.remove(world, c);
  const sp = Math.hypot(c.bodyB.velocity.x, c.bodyB.velocity.y);
  if (sp > 12) Sfx.play('whoosh', Math.min(1, sp / 35));
};
canvas.addEventListener('pointerup', endDrag);
canvas.addEventListener('pointercancel', endDrag);
canvas.addEventListener('contextmenu', e => e.preventDefault());
canvas.addEventListener('touchstart', e => e.preventDefault(), { passive: false });
canvas.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

// ---------------------------------------------------------------- Spielschleife
let lastT = 0, acc = 0;
function frame(now) {
  const dt = lastT ? Math.min(now - lastT, 100) : 16.7; lastT = now; acc += dt;
  let steps = 0;
  while (acc >= 16.6 && steps < 4) { Engine.update(engine, 1000 / 60); acc -= 16.6; steps++; }
  if (steps === 4) acc = 0;
  webWobble = Math.max(0, webWobble - 0.02);
  ctx.setTransform(dpr * S, 0, 0, dpr * S, 0, 0);
  ctx.drawImage(bgCanvas, 0, 0, W, H);
  drawFixtures(ctx);
  // alle Körperteile nach Ebene sortiert zeichnen
  const ops = [];
  let i = 0;
  for (const b of Composite.allBodies(world)) {
    if (!b.plugin || !b.plugin.draws) continue;
    for (const d of b.plugin.draws) ops.push({ z: d.z, i: i++, b, fn: d.fn });
  }
  ops.sort((a, b) => a.z - b.z || a.i - b.i);
  for (const o of ops) {
    ctx.save(); ctx.translate(o.b.position.x, o.b.position.y); ctx.rotate(o.b.angle);
    ctx.globalAlpha = o.b.plugin.alpha || 1;
    o.fn(ctx, o.b.plugin.style);
    ctx.restore();
  }
  for (let k = particles.length - 1; k >= 0; k--) {
    const p = particles[k]; p.x += p.vx; p.y += p.vy; p.life -= 0.025;
    if (p.life <= 0) { particles.splice(k, 1); continue; }
    ctx.globalAlpha = p.life; ell(ctx, p.x, p.y, p.r * 2, p.r * 2, p.color);
  }
  for (let k = texts.length - 1; k >= 0; k--) {
    const t = texts[k]; t.y -= 1; t.life -= 0.02;
    if (t.life <= 0) { texts.splice(k, 1); continue; }
    ctx.globalAlpha = t.life; txt(ctx, t.text, t.x, t.y, 24, t.color, '28px Creepster, Chalkduster, fantasy');
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(frame);
}

function resize() {
  const r = $('stage').getBoundingClientRect();
  const cw = Math.max(280, r.width), ch = Math.max(200, r.height);
  // Referenz: ca. 1000 × 620 Spielfläche (iPad quer). Kleiner → Welt schrumpft, aber nie unter 50 %.
  S = Math.max(0.5, Math.min(1, cw / 1000, ch / 620));
  W = cw / S; H = ch / S; dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr);
  buildStatics(); buildBackground();
  for (const b of Composite.allBodies(world)) if (!b.isStatic) {
    const x = Math.min(Math.max(b.position.x, 30), W - 30), y = Math.min(b.position.y, H - FLOOR - 40);
    if (x !== b.position.x || y !== b.position.y) Body.setPosition(b, { x, y });
  }
}

// ---------------------------------------------------------------- Bedienelemente
function renderTop() {
  $('bScene').textContent = SCENES[sceneIdx].emoji; $('bScene').setAttribute('aria-label', sceneName(SCENES[sceneIdx]));
  $('bGrav').textContent = GRAV[gravMode][2]; $('bGrav').setAttribute('aria-label', tr('a11y.gravity'));
  $('bMusic').textContent = Sfx.musicOn ? '🔊' : '🔇'; $('bMusic').setAttribute('aria-label', tr('a11y.music'));
  $('bMenu').setAttribute('aria-label', tr('settings'));
}
function renderDock() {
  const ro = $('roster'); ro.innerHTML = '';
  const add = document.createElement('button'); add.className = 'tile';
  add.innerHTML = `<div class="plus">+</div><span>${tr('btn.create')}</span>`;
  add.onclick = () => openCreator(); ro.appendChild(add);
  for (const g of allGhouls()) {
    const t = document.createElement('button'); t.className = 'tile'; t.setAttribute('aria-label', g.name);
    const cv = document.createElement('canvas'); const sp = document.createElement('span'); sp.textContent = g.name;
    t.append(cv, sp); t.onclick = () => { Sfx.unlock(); spawnGhoul(g); };
    ro.appendChild(t); drawAvatar(cv, g);
  }
  const pr = $('props'); pr.innerHTML = '';
  for (const [k, em] of PROPS) {
    const b = document.createElement('button'); b.className = 'prop'; b.textContent = em; b.setAttribute('aria-label', tr('prop.' + k));
    b.onclick = () => { Sfx.unlock(); for (let n = 0; n < (k === 'book' ? 3 : 1); n++) { const p = spawnPoint(); p.y += n * 20; spawnProp(k, p); } };
    pr.appendChild(b);
  }
}
function renderMenu() {
  const m = $('menu');
  m.innerHTML = `<h4>${tr('scenes')}</h4>` + SCENES.map((sc, i) => `<button class="mitem${i === sceneIdx ? ' on' : ''}" data-scene="${i}">${sc.emoji} ${sceneName(sc)}</button>`).join('')
    + `<h4>${tr('lang')}</h4>` + LANGS.map(([k, l]) => `<button class="mitem${k === lang ? ' on' : ''}" data-lang="${k}">${l}</button>`).join('')
    + `<button class="mitem danger" id="mClear">${tr('btn.clear')}</button>`
    + `<h4 style="text-align:right;margin-top:4px">Version ${VERSION}</h4>`;
  m.querySelectorAll('[data-scene]').forEach(b => b.onclick = () => { Sfx.unlock(); setScene(+b.dataset.scene); m.hidden = true; });
  m.querySelectorAll('[data-lang]').forEach(b => b.onclick = () => { setLang(b.dataset.lang); m.hidden = true; });
  $('mClear').onclick = () => { m.hidden = true; confirmBox(tr('clear.q'), '', tr('btn.clear'), clearAll); };
}
function setLang(l) { lang = l; save('lang', l); document.documentElement.lang = l; renderAll(); buildBackground(); }
function renderAll() { renderTop(); renderDock(); renderMenu(); }

$('bGrav').onclick = () => { Sfx.unlock(); cycleGravity(); };
$('bScene').onclick = () => { Sfx.unlock(); setScene(sceneIdx + 1); };
$('bMusic').onclick = () => { Sfx.unlock(); toast(tr(Sfx.toggleMusic() ? 'music.on' : 'music.off')); renderTop(); };
$('bMenu').onclick = e => { e.stopPropagation(); renderMenu(); $('menu').hidden = !$('menu').hidden; };
document.addEventListener('pointerdown', e => { if (!$('menu').hidden && !$('menu').contains(e.target) && e.target !== $('bMenu')) $('menu').hidden = true; });

function confirmBox(title, info, okLabel, onOk) {
  const box = $('confirmBox');
  box.innerHTML = `<h3></h3>${info ? '<p></p>' : ''}<div class="row"><button class="btn" id="cNo">${tr('cr.cancel')}</button><button class="btn danger" id="cYes"></button></div>`;
  box.querySelector('h3').textContent = title; if (info) box.querySelector('p').textContent = info;
  $('cYes').textContent = okLabel;
  $('confirm').hidden = false;
  $('cNo').onclick = () => { $('confirm').hidden = true; };
  $('cYes').onclick = () => { $('confirm').hidden = true; onOk(); };
}

// ---------------------------------------------------------------- Erstellungsmenü
let draft = null, tab = 'monster', pvRaf = 0;
const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
function openCreator() { draft = null; $('creator').hidden = false; renderCreator(); }
function closeCreator() { $('creator').hidden = true; cancelAnimationFrame(pvRaf); renderDock(); }

function renderCreator() {
  cancelAnimationFrame(pvRaf);
  const root = $('cr');
  if (!draft) {
    root.innerHTML = `<div class="bar"><span class="l"></span><h2>${tr('cr.mine')}</h2><button class="btn primary r" id="crDone">${tr('cr.done')}</button></div>
      <div class="crbody"><div class="grid" id="crGrid"></div><div id="crExtra"></div></div>`;
    $('crDone').onclick = closeCreator;
    const grid = $('crGrid');
    const nw = document.createElement('button'); nw.className = 'card new';
    nw.innerHTML = `<div class="plus">+</div><b>${tr('cr.new')}</b>`;
    nw.onclick = () => { draft = randomGhoul(tr('cr.defaultName')); draft.isNew = true; tab = 'monster'; renderCreator(); };
    grid.appendChild(nw);
    for (const g of custom) {
      const card = document.createElement('div'); card.className = 'card';
      card.innerHTML = `<canvas></canvas><b></b><div class="acts"><button class="ibtn" aria-label="${tr('cr.editBtn')}">✏️</button><button class="ibtn del" aria-label="${tr('cr.delete')}">🗑️</button></div>`;
      card.querySelector('b').textContent = g.name;
      const [eb, db] = card.querySelectorAll('button');
      const edit = () => { draft = Object.assign({}, g); tab = 'monster'; renderCreator(); };
      eb.onclick = e => { e.stopPropagation(); edit(); };
      card.querySelector('canvas').onclick = edit;
      db.onclick = e => {
        e.stopPropagation();
        confirmBox(tr('cr.deleteQ', g.name), tr('cr.deleteInfo'), tr('cr.delete'), () => {
          custom = custom.filter(x => x.id !== g.id); deleted.unshift(g); saveCustom(); renderCreator();
        });
      };
      grid.appendChild(card); drawAvatar(card.querySelector('canvas'), g);
    }
    const ex = $('crExtra');
    if (!custom.length) ex.innerHTML = `<p class="empty">${tr('cr.empty')}</p>`;
    if (deleted.length) {
      const d = document.createElement('div'); d.className = 'deleted';
      d.innerHTML = `<h4>${tr('cr.deleted')}</h4>`;
      for (const g of deleted) {
        const row = document.createElement('div'); row.className = 'drow';
        row.innerHTML = `<canvas></canvas><s></s><button class="btn restore">${tr('cr.restore')}</button>`;
        row.querySelector('s').textContent = g.name;
        row.querySelector('button').onclick = () => { deleted = deleted.filter(x => x.id !== g.id); custom.push(g); saveCustom(); renderCreator(); };
        d.appendChild(row);
      }
      ex.appendChild(d);
      d.querySelectorAll('canvas').forEach((cv, i) => drawAvatar(cv, deleted[i]));
    }
    return;
  }
  // Editor
  root.innerHTML = `<div class="bar"><button class="btn ghost l" id="edCancel">${tr('cr.cancel')}</button>
      <h2>${tr(draft.isNew ? 'cr.create' : 'cr.edit')}</h2><button class="btn primary r" id="edSave">${tr('cr.save')}</button></div>
    <div class="editor">
      <div class="ed-left"><canvas id="pv"></canvas>
        <input id="name" maxlength="18" placeholder="${esc(tr('cr.namePH'))}" value="${esc(draft.name)}">
        <button class="btn" id="edRandom">${tr('cr.random')}</button></div>
      <div class="ed-right"><div class="seg" id="tabs">
        <button data-t="monster">${tr('cr.tab.monster')}</button><button data-t="look">${tr('cr.look')}</button><button data-t="clothes">${tr('cr.clothes')}</button>
      </div><div class="panel" id="panel"></div></div>
    </div>`;
  $('edCancel').onclick = () => { draft = null; renderCreator(); };
  $('edSave').onclick = () => {
    const g = Object.assign({}, draft); delete g.isNew;
    g.name = (g.name || '').trim() || tr('cr.defaultName');
    const i = custom.findIndex(x => x.id === g.id);
    if (i >= 0) custom[i] = g; else custom.push(g);
    saveCustom(); draft = null; renderCreator(); renderDock();
  };
  $('name').oninput = e => { draft.name = e.target.value; };
  $('edRandom').onclick = () => { const n = draft.name, id = draft.id, isNew = draft.isNew; draft = randomGhoul(n, id); draft.isNew = isNew; renderPanel(); };
  $('tabs').querySelectorAll('button').forEach(b => b.onclick = () => { tab = b.dataset.t; renderPanel(); });
  renderPanel();
  const pv = $('pv'), pdpr = window.devicePixelRatio || 1;
  const pw = pv.clientWidth || 250, ph = pv.clientHeight || 300, pk = pw / 250;
  pv.width = pw * pdpr; pv.height = ph * pdpr;
  const pc = pv.getContext('2d');
  const loop = () => {
    pc.setTransform(pdpr, 0, 0, pdpr, 0, 0); pc.clearRect(0, 0, pw, ph);
    pc.save(); pc.translate(pw / 2, ph * 0.56); pc.rotate(Math.sin(performance.now() / 600) * 0.05); pc.scale(1.3 * pk, 1.3 * pk);
    if (draft) drawGhoulStatic(pc, draft);
    pc.restore();
    pvRaf = requestAnimationFrame(loop);
  };
  loop();
}
function renderPanel() {
  $('tabs').querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.t === tab));
  const P = $('panel'); P.innerHTML = '';
  const chips = (title, key, opts, label) => {
    const g = document.createElement('div'); g.className = 'group';
    g.innerHTML = `<h5>${title}</h5><div class="chips"></div>`;
    for (const o of opts) {
      const b = document.createElement('button'); b.className = 'chip' + (draft[key] === o ? ' on' : ''); b.textContent = label(o);
      b.onclick = () => { draft[key] = o; renderPanel(); }; g.lastChild.appendChild(b);
    }
    P.appendChild(g);
  };
  const sw = (title, key, pal) => {
    const g = document.createElement('div'); g.className = 'group';
    g.innerHTML = `<h5>${title}</h5><div class="sw"></div>`;
    for (const col of pal) {
      const b = document.createElement('button'); b.style.background = col; b.setAttribute('aria-label', col);
      if (draft[key] === col) { b.className = 'on'; b.textContent = '✓'; b.style.color = ['#FFFFFF', '#FFE066', '#F4F6FF', '#F6E4F0', '#FFD7B5', '#E9D9B0'].includes(col) ? '#141014' : '#fff'; }
      b.onclick = () => { draft[key] = col; renderPanel(); }; g.lastChild.appendChild(b);
    }
    P.appendChild(g);
  };
  if (tab === 'monster') {
    chips(tr('cr.kind'), 'kind', KINDS, k => EMOJI[k] + ' ' + tr('kind.' + k));
    sw(tr('cr.skin'), 'skin', SKIN); sw(tr('cr.eyes'), 'eyes', COLORS); sw(tr('cr.lips'), 'lips', LIPS);
  } else if (tab === 'look') {
    chips(tr('cr.hairStyle'), 'hairStyle', HAIRS, k => tr('hair.' + k));
    sw(tr('cr.hair'), 'hair', COLORS); sw(tr('cr.streak'), 'streak', COLORS);
    chips(tr('cr.acc'), 'accessory', ACCS, k => tr('acc.' + k));
  } else {
    chips(tr('cr.top'), 'topStyle', TOPS, k => tr('top.' + k)); sw(tr('cr.topColor'), 'top', COLORS);
    chips(tr('cr.bottom'), 'bottomStyle', BOTTOMS, k => tr('bottom.' + k)); sw(tr('cr.bottomColor'), 'bottom', COLORS);
    chips(tr('cr.shoes'), 'shoes', SHOES, k => tr('shoes.' + k)); sw(tr('cr.accent'), 'accent', COLORS);
  }
}

// ---------------------------------------------------------------- Start
function showCoach() {
  if (load('coachSeen')) return;
  $('coachBox').innerHTML = `<div style="font-size:52px">👋</div><p>${tr('hint')}</p><button class="btn primary" id="coachGo">${tr('go')}</button>`;
  $('coach').hidden = false;
  $('coachGo').onclick = () => { Sfx.unlock(); $('coach').hidden = true; save('coachSeen', true); };
}
document.documentElement.lang = lang;
let rzT = 0;
// Spielfeld-Größe immer am echten Element messen (Leiste, Drehen, Tastatur …)
if (window.ResizeObserver) new ResizeObserver(() => resize()).observe($('stage'));
else window.addEventListener('resize', resize);
window.addEventListener('resize', () => { clearTimeout(rzT); rzT = setTimeout(renderDock, 150); });
renderAll(); resize();
const cast = allGhouls();
spawnGhoul(cast[0], { x: W * 0.4, y: H * 0.35 });
spawnGhoul(cast[1], { x: W * 0.55, y: H * 0.3 });
spawnProp('pumpkin', { x: W * 0.48, y: H * 0.5 });
showCoach();
if (document.fonts) document.fonts.ready.then(buildBackground);
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
requestAnimationFrame(frame);
})();
