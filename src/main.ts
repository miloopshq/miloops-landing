import { type ScoutState, mountScout } from '@teamtrail/scout-avatar/mount';
import { initCloudScene } from './cloudScene';
import { initCmdCycle } from './cmdCycle';
import { initCopy } from './copy';
import { $, $$ } from './dom';
import { mountHeroField } from './heroField';
import { initScramble } from './scramble';
import { initNav, initReveal } from './scroll';
import { initVideo } from './video';
import { initWaitlist } from './waitlist';

document.documentElement.classList.add('js');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

for (const canvas of $$<HTMLCanvasElement>('canvas[data-field]')) {
  mountHeroField(canvas, {
    clearCenter: canvas.dataset.field === 'hero',
    intensity: Number(canvas.dataset.intensity ?? 1),
  });
}

// Nav mark: the detailed Scout, blinking, with a short line every few seconds.
const navScout = $('[data-scout-nav]');
if (navScout) {
  const lines = ['Standing by', 'Agents on the line', 'Ready when you are'];
  let i = 0;
  const h = mountScout(navScout, { size: 1.25, state: 'idle', framed: false });
  const talk = () =>
    h.update({
      speaking: lines[i++ % lines.length],
      onSpeakEnd: () => {
        h.update({ speaking: undefined });
        setTimeout(talk, 7000);
      },
    });
  if (!reducedMotion) setTimeout(talk, 2500);
}

const scout = $('[data-scout]');
if (scout) mountScout(scout, { size: 'sm', state: 'idle', framed: false });
// Guides: Scout in each role's colour (CSS), each in its own state so the roster feels alive.
for (const el of $$('[data-spec]'))
  mountScout(el, { size: Number(el.dataset.size ?? 1.5), state: el.dataset.spec as ScoutState, framed: false });

initCloudScene(reducedMotion);
initNav();
initReveal(reducedMotion);
initScramble(reducedMotion);
initCopy();
initCmdCycle(reducedMotion);
initVideo(reducedMotion);
initWaitlist();
