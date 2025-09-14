// Utilidades UI 
const $ = (sel, root=document) => root.querySelector(sel);

// desocultar el toast
function showToast(msg, kind='ok', ms=2000) {
  const box = $('#toast');
  if (!box) return alert(msg); // fallback

  box.textContent = msg;
  box.classList.remove('hidden', 'ok', 'err');
  box.classList.add(kind === 'err' ? 'err' : 'ok');

  setTimeout(() => box.classList.add('hidden'), ms);
}

// para no abusar de clicks
function setBusy(el, busy=true) {
  if (!el) return;
  if (busy) {
    el.setAttribute('disabled', 'true');
    el.dataset.busy = '1';
  } 
  else {
    el.removeAttribute('disabled');
    delete el.dataset.busy;
  }
}

// funcion asincrona para obtener data de post
async function postJSON(url, body=null) {
  const opts = { method: 'POST', headers: { 'Content-Type': 'application/json' } };

  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = await res.json().catch(() => ({}));

  if (data && data.ok === false) throw new Error('Operación rechazada');
  return data;
}

// Ordenamiento 
function sortList(listEl, itemSelector) {
  const items = Array.from(listEl.querySelectorAll(itemSelector));
  
  items.sort((a, b) => {
    const byVotes = Number(b.dataset.votes) - Number(a.dataset.votes);
    if (byVotes !== 0) return byVotes;
    return Number(b.dataset.id) - Number(a.dataset.id);
  });

  items.forEach(li => listEl.appendChild(li));
}

// Votaciones (topics y links) 
document.addEventListener('click', async (e) => {
  // Voto Topic
  if (e.target.matches('.vote-topic')) {
    e.preventDefault();
    
    if (e.target.dataset.busy) return;      // evita spam de clic
    const btn = e.target;
    const li = btn.closest('.topic');
    const id = li?.dataset.id;
    const dir = btn.dataset.dir; // up | down
    if (!id || !dir) return;

    try {
      setBusy(btn, true);
      const data = await postJSON(`/topics/${id}/vote?dir=${dir}`);
      const newVotes = data.topic.votes;
      li.dataset.votes = String(newVotes);
      li.querySelector('.votes').textContent = `★ ${newVotes}`;
      sortList($('#topics-list'), '.topic');
      showToast('Voto aplicado al tema');
    } catch (err) {
      console.error(err);
      showToast('No se pudo votar el tema', 'err');
    } finally {
      setBusy(btn, false);
    }
  }

  // Voto Link
  if (e.target.matches('.vote-link')) {
    e.preventDefault();
    if (e.target.dataset.busy) return;
    const btn = e.target;
    const li = btn.closest('.link');
    const id = li?.dataset.id;
    const dir = btn.dataset.dir;
    if (!id || !dir) return;

    try {
      setBusy(btn, true);
      const data = await postJSON(`/links/${id}/vote?dir=${dir}`);
      const newVotes = data.link.votes;
      li.dataset.votes = String(newVotes);
      li.querySelector('.votes').textContent = `★ ${newVotes}`;
      sortList(li.parentElement, '.link'); // solo resortear su lista
      showToast('Voto aplicado al enlace');
    } catch (err) {
      console.error(err);
      showToast('No se pudo votar el enlace', 'err');
    } finally {
      setBusy(btn, false);
    }
  }
});

// Confirmar eliminaciones + evitar dobles submit
document.addEventListener('submit', (e) => {
  const form = e.target;

  // Evita dobles envíos
  if (form.dataset.submitting === '1') {
    e.preventDefault();
    return;
  }

  // Confirmaciones para /delete
  if (form.action && /\/(topics|links)\/\d+\/delete$/.test(form.action)) {
    const ok = confirm('¿Seguro que querés eliminar? Esta acción no se puede deshacer.');
    if (!ok) {
      e.preventDefault();
      return;
    }
  }

  // Limpieza mínima de inputs de texto (trim) antes de enviar
  const inputs = form.querySelectorAll('input[type="text"], input[name="url"]');
  inputs.forEach(inp => inp.value = (inp.value || '').trim());

  form.dataset.submitting = '1';
  setTimeout(() => delete form.dataset.submitting, 1500); // reset por si la red falla
});

// Accesibilidad menor: Enter en botones que no son submit 
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.target.matches('button:not([type])')) {
    e.preventDefault(); // evita submits accidentales en forms
  }
});