// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Theme toggle (remembers choice)
const root = document.documentElement;
document.querySelector('.theme-toggle').addEventListener('click', () => {
  const isDark = root.dataset.theme
    ? root.dataset.theme === 'dark'
    : matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = isDark ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
});

// Mobile menu
const menuBtn = document.querySelector('.menu-toggle');
const links = document.querySelector('.nav-links');
menuBtn.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

// Typing effect
const typed = document.querySelector('.typed');
const words = typed.dataset.words.split(',');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduceMotion) {
  typed.textContent = words[0];
} else {
  let w = 0, i = 0, deleting = false;
  (function tick() {
    const word = words[w];
    i += deleting ? -1 : 1;
    typed.textContent = word.slice(0, i);
    let delay = deleting ? 45 : 90;
    if (!deleting && i === word.length) { deleting = true; delay = 1600; }
    else if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; delay = 300; }
    setTimeout(tick, delay);
  })();
}

// Count-up numbers
function countUp(el) {
  const target = +el.dataset.count;
  const start = performance.now();
  const dur = 1200;
  (function step(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  })(start);
}

// Reveal sections on scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');
    e.target.querySelectorAll('[data-count]').forEach(countUp);
    io.unobserve(e.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Contact form: opens the visitor's email app with the message filled in
document.querySelector('.contact-form').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  const data = new FormData(f);
  const subject = `Website message from ${data.get('name')}`;
  const body = `${data.get('message')}\n\n— ${data.get('name')} (${data.get('email')})`;
  location.href = `mailto:${f.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
