import { mountMilo } from '@miloops-hq/milo-avatar/mount';
import { $, $$ } from './dom';

/**
 * /cloud page art, in the same pixel style as MILO: clouds are drawn on a pixel grid from a few overlapping
 * circles (outline, fill, shade and a rim highlight), and the laptop and phone are small hand-drawn sprites.
 * Everything renders to crisp SVG rects; motion is CSS, off with reduced motion.
 */

type Palette = Record<string, string>;
const SVG = 'http://www.w3.org/2000/svg';

const CLOUD: Palette = { o: '#4d6b73', w: '#dfeaed', s: '#a9c0c6', h: '#ffffff' };
const DEVICE: Palette = { o: '#4d6b73', d: '#0d1a1e', b: '#16323a', a: '#84b6c2', k: '#2a454c' };

/** Pixel rows of a cloud `w`×`h`, from circles `[cx, cy, r]` in pixel units, on a flat base from `x0` to `x1`
 * covering the last `baseH` rows, so the bottom reads as one solid line. */
export function cloudRows(
  w: number,
  h: number,
  circles: [number, number, number][],
  [x0, x1, baseH]: [number, number, number],
): string[] {
  const inside = (x: number, y: number) =>
    x >= 0 &&
    y >= 0 &&
    x < w &&
    y < h &&
    (circles.some(([cx, cy, r]) => (x + 0.5 - cx) ** 2 + (y + 0.5 - cy) ** 2 <= r * r) ||
      (y >= h - baseH && x >= x0 && x < x1));
  const rows: string[] = [];
  for (let y = 0; y < h; y++) {
    let row = '';
    for (let x = 0; x < w; x++) {
      if (!inside(x, y)) row += '.';
      else if (!inside(x - 1, y) || !inside(x + 1, y) || !inside(x, y - 1) || !inside(x, y + 1)) row += 'o';
      else if (!inside(x, y - 2) || !inside(x - 2, y)) row += 'h';
      else row += y >= h * 0.62 ? 's' : 'w';
    }
    rows.push(row);
  }
  return rows;
}

/** Rows to an SVG of crisp rects (horizontal runs merged), `scale` screen px per pixel. */
export function pixelSvg(rows: string[], palette: Palette, scale: number): SVGSVGElement {
  const w = Math.max(...rows.map((r) => r.length));
  const svg = document.createElementNS(SVG, 'svg');
  svg.setAttribute('viewBox', `0 0 ${w} ${rows.length}`);
  svg.setAttribute('width', String(w * scale));
  svg.setAttribute('height', String(rows.length * scale));
  svg.setAttribute('shape-rendering', 'crispEdges');
  svg.setAttribute('aria-hidden', 'true');
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length;) {
      const c = row[x];
      let end = x + 1;
      while (end < row.length && row[end] === c) end++;
      if (palette[c]) {
        const r = document.createElementNS(SVG, 'rect');
        r.setAttribute('x', String(x));
        r.setAttribute('y', String(y));
        r.setAttribute('width', String(end - x));
        r.setAttribute('height', '1');
        r.setAttribute('fill', palette[c]);
        svg.appendChild(r);
      }
      x = end;
    }
  });
  return svg;
}

/** Cloud shapes: a big one for MILO to sit on, and small ones for the sky. */
const BIG = cloudRows(
  46,
  17,
  [
    [11, 11, 6],
    [19, 8, 7.5],
    [28, 7, 7],
    [36, 10.5, 6.5],
    [23, 12, 6],
  ],
  [7, 40, 6],
);
const SMALL = [
  cloudRows(
    18,
    8,
    [
      [5, 5, 3.4],
      [10, 3.8, 4],
      [14, 5.2, 3.2],
    ],
    [3, 16, 3],
  ),
  cloudRows(
    24,
    9,
    [
      [6, 6, 3.6],
      [12, 4, 4.4],
      [18, 5.6, 3.8],
    ],
    [4, 21, 3],
  ),
  cloudRows(
    14,
    7,
    [
      [4, 4.5, 2.8],
      [8.5, 3.4, 3.4],
      [11, 4.6, 2.6],
    ],
    [2, 12, 3],
  ),
];

const LAPTOP = [
  '..oooooooooooo..',
  '..oddddddddddo..',
  '..oddddddddddo..',
  '..oddddddddddo..',
  '..oddddddddddo..',
  '..oddddddddddo..',
  '..oooooooooooo..',
  'oooooooooooooooo',
  '.okkkkkkkkkkkko.',
  '..oooooooooooo..',
];
const PHONE = [
  '.ooooooo.',
  'obbbbbbbo',
  'obaaaabbo',
  'obbbbbbbo',
  'obaaaaabo',
  'obaaabbbo',
  'obbbbbbbo',
  'obbbbbbbo',
  'obbbbbbbo',
  'obbbbbbbo',
  'obbbkbbbo',
  '.ooooooo.',
];

const LINES = ['Agents are on it', "I'll ping your phone", 'Close the laptop', 'Only the calls that matter'];

/** MILO with a short line every few seconds, like the nav mark. */
function talkingMilo(host: HTMLElement, size: number, reducedMotion: boolean) {
  const h = mountMilo(host, { size, state: 'idle', framed: false });
  if (reducedMotion) return;
  let i = 0;
  const talk = () =>
    h.update({
      speaking: LINES[i++ % LINES.length],
      onSpeakEnd: () => {
        h.update({ speaking: undefined });
        setTimeout(talk, 5200);
      },
    });
  setTimeout(talk, 1800);
}

export function initCloudScene(reducedMotion: boolean) {
  // Hero: MILO on the big cloud.
  for (const stage of $$('[data-cloud-stage]')) {
    const cloud = $('[data-cloud-big]', stage);
    if (cloud) cloud.appendChild(pixelSvg(BIG, CLOUD, Number(cloud.dataset.scale ?? 7)));
    const milo = $('[data-cloud-milo]', stage);
    if (milo) talkingMilo(milo, Number(milo.dataset.size ?? 3), reducedMotion);
  }
  // Sky: small clouds drifting behind the copy; each element picks a shape and a pixel size.
  for (const el of $$('[data-cloud-small]')) {
    const shape = SMALL[Number(el.dataset.cloudSmall ?? 0) % SMALL.length];
    el.appendChild(pixelSvg(shape, CLOUD, Number(el.dataset.scale ?? 4)));
  }
  // Journey strip: sleeping laptop → MILO's cloud → phone.
  const laptop = $('[data-px-laptop]');
  if (laptop) laptop.appendChild(pixelSvg(LAPTOP, DEVICE, 6));
  const phone = $('[data-px-phone]');
  if (phone) phone.appendChild(pixelSvg(PHONE, DEVICE, 6));
  const mid = $('[data-cloud-mid]');
  if (mid) mid.appendChild(pixelSvg(SMALL[1], CLOUD, 5));
  const midMilo = $('[data-cloud-mid-milo]');
  if (midMilo) mountMilo(midMilo, { size: 1.5, state: reducedMotion ? 'idle' : 'thinking', framed: false });
}
