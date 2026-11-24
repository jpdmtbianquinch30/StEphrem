// Adresse Formspree : remplacez VOTRE_ID par votre identifiant (formspree.io)
const FORMSPREE = "https://formspree.io/f/VOTRE_ID";
const MONTANT = "25 000 FCFA";

const f = document.getElementById('form');
const refus = document.getElementById('refus');
const envoi = document.getElementById('envoi');
const succes = document.getElementById('succes');
const etapes = document.querySelectorAll('.etapes li');

function etape(n) {
  etapes.forEach((li, i) => {
    li.classList.toggle('fait', i < n - 1);
    li.classList.toggle('actif', i === n - 1);
  });
}
etape(1);

// Si les inscriptions sont fermées
if (typeof OUVERT !== 'undefined' && !OUVERT) {
  f.innerHTML = '<div class="msg non show">Les inscriptions sont fermées pour le moment. Contactez-nous sur WhatsApp pour plus d\'informations.</div>' +
    '<a class="btn vert" href="https://wa.me/' + WHATSAPP + '">Écrire sur WhatsApp</a>';
}

function erreur(champ, msg) {
  const e = document.getElementById('err-' + champ);
  if (e) { e.textContent = msg; e.classList.toggle('show', !!msg); }
  const el = f.elements[champ];
  if (el && el.classList) el.classList.toggle('erreur', !!msg);
}

// Non-chrétien : message clair et bouton désactivé
f.querySelectorAll('[name=chretien]').forEach(r => r.addEventListener('change', () => {
  const non = f.chretien.value === 'non';
  refus.classList.toggle('show', non);
  envoi.disabled = non;
  erreur('chretien', '');
}));

function telValide(t) { return t.replace(/\D/g, '').length >= 9; }

f.addEventListener('submit', async e => {
  e.preventDefault();
  let ok = true, premier = null;
  const verif = (champ, mauvais, msg) => {
    if (mauvais) { erreur(champ, msg); ok = false; if (!premier) premier = f.elements[champ]; }
    else erreur(champ, '');
  };
  verif('prenom', !f.prenom.value.trim(), 'Entrez le prénom.');
  verif('nom', !f.nom.value.trim(), 'Entrez le nom.');
  verif('telephone', !telValide(f.telephone.value), 'Entrez un numéro valide (9 chiffres minimum).');
  verif('instrument', !f.instrument.value, 'Choisissez un instrument.');
  if (!f.chretien.value) { erreur('chretien', 'Répondez à cette question.'); ok = false; premier = premier || f.chretien[0]; }
  if (f.chretien.value === 'non') { refus.classList.add('show'); return; }
  if (!f.engagement.checked) { erreur('engagement', 'Cochez pour accepter.'); ok = false; premier = premier || f.engagement; }
  else erreur('engagement', '');
  if (!ok) { premier && premier.focus(); return; }

  envoi.disabled = true; envoi.textContent = 'Envoi en cours…';
  const data = new FormData(f);
  let enregistre = false;
  if (!FORMSPREE.includes('VOTRE_ID')) {
    try {
      const r = await fetch(FORMSPREE, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      enregistre = r.ok;
    } catch (_) {}
  }

  // Récapitulatif + message WhatsApp pré-rempli (sert aussi de secours)
  const nomComplet = f.prenom.value.trim() + ' ' + f.nom.value.trim();
  document.getElementById('r-nom').textContent = nomComplet;
  document.getElementById('r-inst').textContent = f.instrument.value;
  document.getElementById('r-tel').textContent = f.telephone.value.trim();
  const msg = 'Bonjour, je souhaite m\'inscrire à l\'école de musique St Ephrem.\n' +
    'Nom : ' + nomComplet + '\nInstrument : ' + f.instrument.value + '\nTéléphone : ' + f.telephone.value.trim() +
    '\nJe joins la capture du paiement.';
  document.getElementById('wa-envoi').href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(msg);

  f.style.display = 'none';
  succes.classList.add('show');
  etape(2);
  succes.scrollIntoView({ behavior: 'smooth', block: 'start' });
  succes.focus();
});

// Effacer l'erreur dès que l'on corrige
f.addEventListener('input', e => { if (e.target.name) erreur(e.target.name, ''); });
