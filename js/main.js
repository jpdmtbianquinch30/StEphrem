// ============================================================
// RÉGLAGES DU SITE (à modifier ici uniquement)
// ============================================================
// Inscriptions : true = ouvertes, false = fermées
const OUVERT = true;
// Numéro principal (WhatsApp / Wave / Orange Money), sans espaces ni +
const WHATSAPP = "221784340698";
// ============================================================

document.documentElement.classList.add('js');

// Bandeau d'état des inscriptions
const st = document.getElementById('statut');
if (st) {
  if (OUVERT) {
    st.innerHTML = 'Les inscriptions sont ouvertes. <a href="inscription.html">S\'inscrire maintenant →</a>';
  } else {
    st.textContent = 'Les inscriptions sont fermées pour le moment.';
    st.classList.add('ferme');
  }
}

// Menu mobile
const burger = document.getElementById('burger'), nav = document.getElementById('menu');
if (burger && nav) {
  burger.addEventListener('click', () => {
    const o = nav.classList.toggle('ouvert');
    burger.setAttribute('aria-expanded', o);
    burger.textContent = o ? '✕' : '☰';
  });
}

// Apparition au défilement
const rev = document.querySelectorAll('.rev');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('vu'); io.unobserve(e.target); }
  }), { threshold: .12 });
  rev.forEach(el => io.observe(el));
} else rev.forEach(el => el.classList.add('vu'));

// Halo du logo (accueil)
if (document.querySelector('.icone')) {
  addEventListener('scroll', () => document.documentElement.style.setProperty('--s', 1 + Math.min(scrollY, 900) / 1800), { passive: true });
}

// Boutons « Copier le numéro »
document.querySelectorAll('[data-copier]').forEach(b => b.addEventListener('click', async () => {
  const t = b.dataset.copier, ancien = b.textContent;
  try { await navigator.clipboard.writeText(t); b.textContent = 'Copié ✓'; }
  catch (_) { b.textContent = t; }
  setTimeout(() => b.textContent = ancien, 2000);
}));

// Menu mobile : se referme après un clic sur un lien
if (nav) nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('ouvert'); burger.setAttribute('aria-expanded', false); burger.textContent = '☰';
}));

// Menu mobile : bloque le défilement de la page, se ferme avec Échap
if (burger && nav) {
  const maj = () => document.body.classList.toggle('menu-ouvert', nav.classList.contains('ouvert'));
  burger.addEventListener('click', maj);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', maj));
  addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('ouvert')) { burger.click(); burger.focus(); } });
  addEventListener('resize', () => { if (innerWidth > 900 && nav.classList.contains('ouvert')) burger.click(); });
}
