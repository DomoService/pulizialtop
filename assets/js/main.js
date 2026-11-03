
const PROVINCE_NAMES = { CA: 'Cagliari', SS: 'Sassari', NU: 'Nuoro', OR: 'Oristano', SU: 'Sud Sardegna' };

function esc(value){
  return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

async function loadAgencies(){
  try {
    const res = await fetch('./data/agencies.json', { cache: 'no-store' });
    const all = await res.json();
    window.__AGENCIES__ = all;
    populateProvinces(all);
  } catch (err) {
    window.__AGENCIES__ = [];
    document.getElementById('results').innerHTML = '<p class="muted">Impossibile caricare le agenzie. Riprova più tardi.</p>';
    return;
  }
  render();
}

function populateProvinces(all){
  const select = document.getElementById('provincia');
  if (!select) return;
  const sigle = [...new Set(all.map(a => a.provincia).filter(Boolean))].sort();
  sigle.forEach(sigla => {
    const opt = document.createElement('option');
    opt.value = sigla;
    opt.textContent = `${PROVINCE_NAMES[sigla] || sigla} (${sigla})`;
    select.appendChild(opt);
  });
}

function getVal(id){
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function renderCard(a){
  const rating = typeof a.rating === 'number' ? a.rating : null;
  const servizi = (a.servizi_offerti || []).join(' · ');
  const website = a.sito_web ? `<a class="btn" href="${esc(a.sito_web)}" target="_blank" rel="noopener noreferrer">Sito web</a>` : '';
  const contact = a.email
    ? `<a class="btn" href="mailto:${esc(a.email)}?subject=Richiesta%20informazioni">Contatta</a>`
    : (a.telefono ? `<a class="btn" href="tel:${esc(a.telefono.replace(/\s+/g,''))}">Chiama</a>` : '');
  const logo = a.logo_url ? `<img src="${esc(a.logo_url)}" alt="Logo ${esc(a.nome_commerciale)}" style="width:48px;height:48px;object-fit:contain;border-radius:8px;float:right;margin-left:10px" loading="lazy">` : '';

  return `
    <div class="card">
      ${logo}
      <h3>${esc(a.nome_commerciale)} <small class="muted">— ${esc(a.comune)} (${esc(a.provincia)})</small></h3>
      <div class="meta">
        <div>${rating !== null ? `⭐ ${rating.toFixed(1)} · ${esc(a.recensioni || 0)} recensioni` : 'Nessuna recensione ancora'}</div>
        ${a.fascia_prezzo ? `<div>${esc(a.fascia_prezzo)}</div>` : ''}
        ${servizi ? `<div>${esc(servizi)}</div>` : ''}
        ${a.descrizione ? `<div class="muted">${esc(a.descrizione.length > 180 ? a.descrizione.slice(0, 180) + '…' : a.descrizione)}</div>` : ''}
        ${a.indirizzo ? `<div class="muted">${esc(a.indirizzo)}</div>` : ''}
        ${a.telefono ? `<div class="muted">${esc(a.telefono)}</div>` : ''}
      </div>
      <div class="badges">
        <span class="badge">${esc(a.regione)}</span>
        <span class="badge">${esc(PROVINCE_NAMES[a.provincia] || a.comune)}</span>
        ${a.tipo ? `<span class="badge">${esc(a.tipo)}</span>` : ''}
      </div>
      <div style="margin-top:10px">
        ${contact}
        ${website}
        <a class="btn" href="./lascia-recensione.html">Lascia recensione</a>
      </div>
    </div>
  `;
}

function render(){
  const q = getVal('q').toLowerCase();
  const regione = getVal('regione');
  const provincia = getVal('provincia');
  const comune = getVal('comune').toLowerCase();
  const prezzo = getVal('prezzo');
  const minRating = parseFloat(getVal('rating')) || 0;

  const root = document.getElementById('results');
  const all = window.__AGENCIES__ || [];
  const filtered = all.filter(a => {
    const text = [a.nome_commerciale, a.ragione_sociale, a.descrizione, a.tipo, (a.servizi_offerti || []).join(' '), a.indirizzo, a.comune, a.provincia, a.regione]
      .filter(Boolean).join(' ').toLowerCase();
    if (q && !text.includes(q)) return false;
    if (regione && a.regione !== regione) return false;
    if (provincia && a.provincia !== provincia) return false;
    if (comune && !`${a.comune || ''} ${a.indirizzo || ''}`.toLowerCase().includes(comune)) return false;
    if (prezzo && a.fascia_prezzo !== prezzo) return false;
    if (minRating > 0 && !(typeof a.rating === 'number' && a.rating >= minRating)) return false;
    return true;
  });

  filtered.sort((x, y) => (y.rating || 0) - (x.rating || 0) || (y.recensioni || 0) - (x.recensioni || 0));

  root.innerHTML = filtered.length
    ? filtered.map(renderCard).join('')
    : '<p class="muted">Nessuna agenzia trovata con questi filtri.</p>';

  const count = document.getElementById('count');
  if (count) count.innerText = filtered.length + (filtered.length === 1 ? ' agenzia' : ' agenzie');
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('input,select').forEach(el => {
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  });
  loadAgencies();
});
