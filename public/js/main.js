// Reordena nodos <li> por data-votes (desc) y luego por data-id (desc)
function sortList(listEl, itemSelector) {
  const items = Array.from(listEl.querySelectorAll(itemSelector));
  items.sort((a, b) => {
    const byVotes = Number(b.dataset.votes) - Number(a.dataset.votes);
    if (byVotes !== 0) return byVotes;
    return Number(b.dataset.id) - Number(a.dataset.id);
  });
  items.forEach(li => listEl.appendChild(li));
}

async function postJSON(url) {
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }});
  if (!res.ok) throw new Error('Error de red');
  const data = await res.json();
  if (!data.ok) throw new Error('Operación rechazada');
  return data;
}

document.addEventListener('click', async (e) => {
  // Voto en Topic
  if (e.target.matches('.vote-topic')) {
    e.preventDefault();
    const li = e.target.closest('.topic');
    const id = li.dataset.id;
    const dir = e.target.dataset.dir; // up | down
    try {
      const data = await postJSON(`/topics/${id}/vote?dir=${dir}`);
      const newVotes = data.topic.votes;
      li.dataset.votes = String(newVotes);
      li.querySelector('.votes').textContent = `★ ${newVotes}`;

      // Resortear lista de topics
      const topicsList = document.querySelector('#topics-list');
      sortList(topicsList, '.topic');
    } catch (err) {
      console.error(err);
      alert('No se pudo votar el tema');
    }
  }

  // Voto en Link
  if (e.target.matches('.vote-link')) {
    e.preventDefault();
    const li = e.target.closest('.link');
    const id = li.dataset.id;
    const dir = e.target.dataset.dir;
    try {
      const data = await postJSON(`/links/${id}/vote?dir=${dir}`);
      const newVotes = data.link.votes;
      li.dataset.votes = String(newVotes);
      li.querySelector('.votes').textContent = `★ ${newVotes}`;

      // Resortear solo la lista de links del mismo topic
      const ul = li.parentElement; // <ul class="links">
      sortList(ul, '.link');
    } catch (err) {
      console.error(err);
      alert('No se pudo votar el enlace');
    }
  }
});