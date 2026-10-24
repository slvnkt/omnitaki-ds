// Builds W3C DTCG tokens + CSS custom properties from the Figma export in tokens-src/.
// Levels: Primitives (raw) → Semantic (Light/Dark, aliases to Primitives) → Component (aliases to Semantic).
// Run: npm run tokens
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(root, 'tokens-src');
const OUT = join(root, 'src/tokens');
const MODES = ['Light', 'Dark'];

// ── Parse Figma export: name|C|F|S|value(s, comma per mode)|description ──
function parseVars(file, collection) {
  return readFileSync(join(SRC, file), 'utf8').trim().split('\n').map(line => {
    const [name, kind, values, ...desc] = line.split('|');
    return { name, kind, values: values.split(','), description: desc.join('|'), collection };
  });
}
const primitives = parseVars('primitives.txt', 'Primitives');
const semantic = parseVars('semantic.txt', 'Semantic');
const component = parseVars('component.txt', 'Component');
const [textPart, effectPart] = readFileSync(join(SRC, 'styles.txt'), 'utf8').trim().split('\n---\n');

const all = [...primitives, ...semantic, ...component];
const byName = new Map(all.map(t => [t.name, t]));

// ── Helpers ──
const isRef = v => v.startsWith('{');
const refName = v => v.slice(1, -1);
const dtcgRef = name => `{${name.split('/').join('.')}}`;
const cssVar = name => `--ot-${name.replace(/\//g, '-')}`;
const round = n => Math.round(n * 10000) / 10000;

function typeOf(t) {
  if (t.kind === 'C') return 'color';
  if (t.kind === 'S') return 'fontFamily';
  if (/(^font\/weight\/|\/font-weight$)/.test(t.name)) return 'fontWeight';
  if (/^opacity\//.test(t.name)) return 'number';
  return 'dimension';
}

function dtcgValue(t, raw) {
  if (isRef(raw)) return dtcgRef(refName(raw));
  switch (typeOf(t)) {
    case 'color': {
      const hex = raw.slice(1);
      const c = [0, 2, 4].map(i => round(parseInt(hex.slice(i, i + 2), 16) / 255));
      const alpha = hex.length === 8 ? round(parseInt(hex.slice(6, 8), 16) / 255) : 1;
      return { colorSpace: 'srgb', components: c, alpha, hex: '#' + hex.slice(0, 6) };
    }
    case 'dimension': return { value: Number(raw), unit: 'px' };
    case 'fontWeight': return Number(raw);
    case 'number': return round(Number(raw));
    case 'fontFamily': return raw;
  }
}

function cssValue(t, raw) {
  if (isRef(raw)) return `var(${cssVar(refName(raw))})`;
  switch (typeOf(t)) {
    case 'color': return raw;
    case 'dimension': return `${Number(raw)}px`;
    case 'number': return String(round(Number(raw)));
    case 'fontFamily': return `"${raw}"`;
    default: return raw;
  }
}

// ── Validation: refs resolve and point exactly one level down ──
const LOWER = { Semantic: 'Primitives', Component: 'Semantic' };
const errors = [];
for (const t of all) {
  if (t.collection === 'Semantic' && t.values.length !== MODES.length) errors.push(`${t.name}: expected Light,Dark`);
  for (const v of t.values) {
    if (!isRef(v)) {
      if (t.collection !== 'Primitives') errors.push(`${t.name}: raw value in ${t.collection}`);
      continue;
    }
    const target = byName.get(refName(v));
    if (!target) errors.push(`${t.name}: unresolved ${v}`);
    else if (target.collection !== LOWER[t.collection]) errors.push(`${t.name} → ${target.name}: ${t.collection} must alias ${LOWER[t.collection]}`);
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }

// ── DTCG tree building ──
function setPath(tree, name, token) {
  const parts = name.split('/');
  let node = tree;
  for (const p of parts.slice(0, -1)) node = node[p] ??= {};
  node[parts.at(-1)] = token;
}

function token(t, mode, withModes) {
  const idx = t.collection === 'Semantic' ? MODES.indexOf(mode) : 0;
  const out = { $type: typeOf(t), $value: dtcgValue(t, t.values[idx]) };
  if (t.description) out.$description = t.description;
  const ext = { collection: t.collection, codeSyntax: { WEB: `var(${cssVar(t.name)})` } };
  if (withModes && t.collection === 'Semantic') ext.modes = Object.fromEntries(MODES.map((m, i) => [m, dtcgValue(t, t.values[i])]));
  out.$extensions = { 'com.figma': ext };
  return out;
}

// Move $type up to the highest group whose tokens all share it.
function hoistTypes(node, isRoot = true) {
  if ('$value' in node) return node.$type;
  const kids = Object.entries(node).filter(([k]) => !k.startsWith('$'));
  const types = kids.map(([, child]) => hoistTypes(child, false));
  const common = types.every(x => x && x === types[0]) ? types[0] : null;
  if (common && !isRoot) {
    kids.forEach(([, child]) => delete child.$type);
    node.$type = common;
  }
  return common;
}

// Reorder so $type/$description come first inside groups (readability).
function tidy(node) {
  if ('$value' in node) return node;
  const meta = Object.entries(node).filter(([k]) => k.startsWith('$'));
  const kids = Object.entries(node).filter(([k]) => !k.startsWith('$')).map(([k, v]) => [k, tidy(v)]);
  return Object.fromEntries([...meta, ...kids]);
}

function buildTree(tokens, mode, withModes) {
  const tree = {};
  for (const t of tokens) setPath(tree, t.name, token(t, mode, withModes));
  hoistTypes(tree);
  return tidy(tree);
}

// ── Styles: text (typography) and elevation (shadow) ──
const kebab = s => s.toLowerCase().replace(/\s+/g, '-');
const textStyles = textPart.split('\n').map(line => {
  const [name, family, size, lineHeight, weight, , description] = line.split('|');
  const [group, label] = name.split('/');
  return { name, path: `${kebab(group)}/${kebab(label)}`, family, size, lineHeight, weight, description };
});
const shadowStyles = effectPart.split('\n').map(line => {
  const [name, layers, description] = line.split('|');
  return {
    name, level: name.split('/')[1], description,
    layers: layers.split(';').map(l => {
      const [, color, y, blur, x, , , spread] = l.split(',');
      return { color, y, blur, x: Number(x), spread: Number(spread) };
    }),
  };
});
for (const s of textStyles) for (const r of [s.family, s.size, s.lineHeight, s.weight]) if (!byName.has(r)) errors.push(`${s.name}: unresolved ${r}`);
for (const s of shadowStyles) for (const l of s.layers) for (const r of [l.color, l.y, l.blur]) if (!byName.has(r)) errors.push(`${s.name}: unresolved ${r}`);
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }

const px = n => ({ value: n, unit: 'px' });
function stylesTree() {
  const tree = { text: { $type: 'typography' }, shadow: { $type: 'shadow' } };
  for (const s of textStyles) setPath(tree.text, s.path, {
    $value: {
      fontFamily: dtcgRef(s.family), fontSize: dtcgRef(s.size), fontWeight: dtcgRef(s.weight),
      lineHeight: dtcgRef(s.lineHeight), letterSpacing: px(0),
    },
    $description: s.description,
    $extensions: { 'com.figma': { style: s.name, codeSyntax: { WEB: `.ot-text-${s.path.replace('/', '-')}` } } },
  });
  for (const s of shadowStyles) tree.shadow[s.level] = {
    $value: s.layers.map(l => ({ color: dtcgRef(l.color), offsetX: px(l.x), offsetY: dtcgRef(l.y), blur: dtcgRef(l.blur), spread: px(l.spread) })),
    $description: s.description,
    $extensions: { 'com.figma': { style: s.name, codeSyntax: { WEB: `var(--ot-shadow-${s.level})` } } },
  };
  return tree;
}

// ── Write JSON ──
mkdirSync(join(OUT, 'dtcg'), { recursive: true });
const json = obj => JSON.stringify(obj, null, 2) + '\n';
const SCHEMA = 'https://www.designtokens.org/schemas/2025.10/format.json';

// Levels share top-level groups (opacity/38 vs opacity/disabled), so merge deeply.
function deepMerge(a, b) {
  for (const [k, v] of Object.entries(b)) {
    if (a[k] && typeof a[k] === 'object' && !('$value' in a[k]) && !('$value' in v)) deepMerge(a[k], v);
    else if (k in a && !k.startsWith('$')) throw new Error(`Token path collision: ${k}`);
    else a[k] = v;
  }
  return a;
}

// Combined file: Semantic $value = Light, both modes in $extensions.com.figma.modes.
const combined = [
  buildTree(primitives, null, true),
  buildTree(semantic, 'Light', true),
  buildTree(component, null, true),
  stylesTree(),
].reduce(deepMerge, {
  $schema: SCHEMA,
  $description: 'Omnitaki DS tokens (Figma 1AGw3pl5kRF2TU29bS6Egb). Primitives → Semantic (Light/Dark) → Component. Semantic $value = Light; all modes in $extensions["com.figma"].modes.',
});
writeFileSync(join(OUT, 'tokens.json'), json(combined));

// Per-mode files (identical paths across semantic.light / semantic.dark) for Style Dictionary & co.
const files = {
  'primitives.tokens.json': buildTree(primitives),
  'semantic.light.tokens.json': buildTree(semantic, 'Light'),
  'semantic.dark.tokens.json': buildTree(semantic, 'Dark'),
  'component.tokens.json': buildTree(component),
  'styles.tokens.json': stylesTree(),
};
for (const [f, tree] of Object.entries(files)) writeFileSync(join(OUT, 'dtcg', f), json({ $schema: SCHEMA, ...tree }));

// ── Write CSS ──
const decl = (t, i = 0) => `  ${cssVar(t.name)}: ${cssValue(t, t.values[i])};`;
const shadowDecls = shadowStyles.map(s => `  --ot-shadow-${s.level}: ${s.layers
  .map(l => `${l.x}px var(${cssVar(l.y)}) var(${cssVar(l.blur)}) ${l.spread}px var(${cssVar(l.color)})`).join(', ')};`);
const darkOverrides = semantic.filter(t => t.values[0] !== t.values[1]);

const css = `/* Omnitaki DS tokens — generated by scripts/build-tokens.mjs from Figma. Do not edit by hand. */

/* ── 1. Primitives ── */
:root {
${primitives.map(t => decl(t)).join('\n')}
}

/* ── 2. Semantic · Light (default) ── */
:root,
[data-theme="light"] {
  color-scheme: light;
${semantic.map(t => decl(t, 0)).join('\n')}

  /* Elevation (re-declared per theme so shadow colors follow the theme) */
${shadowDecls.join('\n')}
}

/* ── 2. Semantic · Dark (only values that differ from Light) ── */
[data-theme="dark"] {
  color-scheme: dark;
${darkOverrides.map(t => decl(t, 1)).join('\n')}

${shadowDecls.join('\n')}
}

/* ── 3. Component (sizes only) ── */
:root {
${component.map(t => decl(t)).join('\n')}
}

/* ── Text styles ── */
${textStyles.map(s => `/* ${s.name} */
.ot-text-${s.path.replace('/', '-')} {
  font-family: var(${cssVar(s.family)}), system-ui, sans-serif;
  font-size: var(${cssVar(s.size)});
  line-height: var(${cssVar(s.lineHeight)});
  font-weight: var(${cssVar(s.weight)});
  letter-spacing: 0;
}`).join('\n\n')}
`;
writeFileSync(join(OUT, 'tokens.css'), css);

console.log(`Primitives ${primitives.length}, Semantic ${semantic.length} (dark overrides ${darkOverrides.length}), Component ${component.length}, text styles ${textStyles.length}, shadows ${shadowStyles.length}`);
