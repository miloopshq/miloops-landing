import { $, $$ } from './dom';

export function initNav() {
  const nav = $('#nav');
  if (!nav) return;
  const update = () => nav.classList.toggle('is-scrolled', window.scrollY > 8);
  update();
  window.addEventListener('scroll', update, { passive: true });
  markCurrent(nav);
  initNavMenus(nav);
}

/** Marks the link to the page you're on (and its menu button), so the nav shows where you are. */
function markCurrent(nav: HTMLElement) {
  const here = location.pathname.replace(/index\.html$/, '');
  for (const link of $$<HTMLAnchorElement>('.nav__links a', nav)) {
    const url = new URL(link.href);
    if (url.hash || url.pathname === '/') continue;
    if (here === url.pathname || here.startsWith(url.pathname)) {
      link.setAttribute('aria-current', 'page');
      link.closest('.nav__group')?.classList.add('is-current');
    }
  }
}

/** Submenus open on hover and keyboard focus (CSS); a tap or click toggles them too, for touch screens. */
function initNavMenus(nav: HTMLElement) {
  for (const button of $$<HTMLButtonElement>('.nav__group-btn', nav)) {
    const group = button.parentElement;
    if (!group) continue;
    const setOpen = (open: boolean) => {
      group.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', String(open));
    };
    button.addEventListener('click', () => setOpen(!group.classList.contains('is-open')));
    group.addEventListener('mouseleave', () => setOpen(false));
    group.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      button.focus();
    });
    document.addEventListener('click', (e) => {
      if (!group.contains(e.target as Node)) setOpen(false);
    });
  }
}

export function initReveal(reducedMotion: boolean) {
  const items = $$('.reveal');
  const siblingsIndex = new Map<Element, number>();
  for (const el of items) {
    const parent = el.parentElement;
    if (!parent) continue;
    const i = siblingsIndex.get(parent) ?? 0;
    (el as HTMLElement).style.setProperty('--i', String(Math.min(i, 6)));
    siblingsIndex.set(parent, i + 1);
  }
  const title = $('.hero__title');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-in'));
    title?.classList.add('is-in');
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  items.forEach((el) => io.observe(el));
  requestAnimationFrame(() => title?.classList.add('is-in'));
}
