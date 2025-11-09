(() => {
  const pickInput = document.getElementById('pick-input');
  const pickList  = document.getElementById('pick-list');
  const dropInput = document.getElementById('drop-input');
  const dropList  = document.getElementById('drop-list');
  const EMAIL = '';
  const debounce = (fn, ms = 250) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

  function createAutocomplete(inputEl, listEl, opts = {}) {
    const endpoint = 'https://nominatim.openstreetmap.org/search';
    let controller = null;
    function show(){ listEl.classList.remove('hidden'); }
    function hide(){ listEl.classList.add('hidden'); }
    function clear(){ listEl.innerHTML = ''; }

    async function fetchPlaces(query) {
      if (controller) controller.abort();
      controller = new AbortController();
      const params = new URLSearchParams({ q: query, format: 'jsonv2', limit: String(opts.limit ?? 7), addressdetails: '0', dedupe: '1', countrycodes: 'in' });
      if (EMAIL) params.append('email', EMAIL);
      const url = `${endpoint}?${params.toString()}`;
      const res = await fetch(url, { signal: controller.signal, headers: { 'Accept':'application/json', 'Accept-Language': 'en-IN' }, cache: 'no-store', mode: 'cors' });
      if (res.status === 429) throw new Error('rate'); if (res.status === 403) throw new Error('blocked'); if (!res.ok) throw new Error('net');
      return res.json();
    }

    function render(items) {
      clear(); if (!items?.length) { listEl.innerHTML = `<li class="item">No results</li>`; show(); return; }
      const frag = document.createDocumentFragment();
      items.forEach((it) => { const li = document.createElement('li'); li.className = 'item'; li.textContent = it.display_name; li.addEventListener('mousedown', e => e.preventDefault()); li.addEventListener('click', () => choose(it)); frag.appendChild(li); });
      listEl.appendChild(frag); show();
    }

    function choose(it) { inputEl.value = it.display_name; hide(); clear(); inputEl.dataset.lat = it.lat; inputEl.dataset.lon = it.lon; }

    const run = debounce(async (q) => {
      if (!q.trim()) { hide(); clear(); return; }
      try { render(await fetchPlaces(q.trim())); }
      catch (e) {
        if (e.name === 'AbortError') return; clear(); let msg = 'Couldn’t load results'; if (e.message === 'rate') msg = 'Too many requests. Try again in a moment.'; if (e.message === 'blocked') msg = 'Blocked. Add your email in show-places.js.'; listEl.innerHTML = `<li class="item">${msg}</li>`; show();
      }
    }, opts.debounce ?? 250);

    inputEl.addEventListener('input', (e) => run(e.target.value));
    inputEl.addEventListener('focus', () => { if (listEl.children.length) show(); });
    document.addEventListener('click', (e) => { const wrapper = inputEl.closest('.location-input'); if (!wrapper?.contains(e.target)) hide(); });
    return { hide, clear };
  }

  createAutocomplete(pickInput, pickList,  { limit: 6, debounce: 250 });
  createAutocomplete(dropInput, dropList,  { limit: 6, debounce: 250 });

  // On See prices, also include the human-readable addresses
  document.addEventListener('cabme:see-prices', () => {
    const pick = (pickInput?.dataset.lat && pickInput?.dataset.lon)
      ? { lat: +pickInput.dataset.lat, lon: +pickInput.dataset.lon, name: pickInput.value }
      : null;
    const drop = (dropInput?.dataset.lat && dropInput?.dataset.lon)
      ? { lat: +dropInput.dataset.lat, lon: +dropInput.dataset.lon, name: dropInput.value }
      : null;
    if (pick && drop) {
      document.dispatchEvent(new CustomEvent('cabme:coordinates', { detail: { pick, drop } }));
      document.dispatchEvent(new CustomEvent('cabme:addresses', { detail: { pick: pick.name, drop: drop.name } }));
    } else {
      alert('Please pick both locations from the suggestions to continue.');
    }
  });
})();