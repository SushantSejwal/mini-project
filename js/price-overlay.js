(function(){
  const overlay = document.getElementById('price-overlay');
  const closeBtn = document.getElementById('price-close');
  const pickEl = document.getElementById('overlay-pick');
  const dropEl = document.getElementById('overlay-drop');
  const distEl = document.getElementById('overlay-distance');
  const fareEl = document.getElementById('overlay-fare');
  const editBtn = document.getElementById('edit-ride');
  let priceMap, routeLayer, startMarker, endMarker;

  function openOverlay(){ overlay.classList.add('active'); overlay.classList.remove('hidden'); overlay.setAttribute('aria-hidden','false'); }
  function closeOverlay(){ overlay.classList.remove('active'); overlay.setAttribute('aria-hidden','true'); }

  closeBtn?.addEventListener('click', closeOverlay);
  editBtn?.addEventListener('click', closeOverlay);

  function ensureMap(){
    if (priceMap) return priceMap;
    priceMap = L.map('price-map');
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; OpenStreetMap contributors' }).addTo(priceMap);
    return priceMap;
  }

  function iconHtml(color, cls){ return L.divIcon({ className: 'cabme-divicon', html: `<i class="fa-solid ${cls}" style="font-size:24px;color:${color}"></i>`, iconSize: [24,24], iconAnchor: [12,24] }); }

  function rupees(x){ return new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(x); }

  function calcFare(distanceKm){
    // Competitive simple fare: ₹59 minimum (covers 3 km), then ₹12 per km beyond.
    const minFare = 59, included = 3, perKm = 12;
    if (distanceKm <= included) return minFare;
    return Math.round(minFare + (distanceKm - included) * perKm);
  }

  async function route(pick, drop){
    // Try OSRM demo; fallback to straight-line haversine if it fails.
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${pick.lon},${pick.lat};${drop.lon},${drop.lat}?overview=full&geometries=geojson`;
      const res = await fetch(url, { mode:'cors' });
      if (!res.ok) throw new Error('router');
      const data = await res.json();
      const route = data?.routes?.[0];
      if (!route) throw new Error('no_route');
      return { meters: route.distance, geometry: route.geometry };
    } catch(err){
      // Haversine fallback
      const R = 6371e3; // meters
      const toRad = (d)=>d*Math.PI/180;
      const φ1 = toRad(pick.lat), φ2 = toRad(drop.lat);
      const Δφ = toRad(drop.lat-pick.lat), Δλ = toRad(drop.lon-pick.lon);
      const a = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
      const meters = 2*R*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return { meters, geometry: null };
    }
  }

  function draw(pick, drop, geo){
    const map = ensureMap();
    if (routeLayer) { map.removeLayer(routeLayer); routeLayer = null; }
    if (startMarker) { map.removeLayer(startMarker); }
    if (endMarker) { map.removeLayer(endMarker); }

    startMarker = L.marker([pick.lat, pick.lon], { icon: iconHtml('#2e8b57', 'fa-location-dot') }).addTo(map);
    endMarker = L.marker([drop.lat, drop.lon], { icon: iconHtml('#c03', 'fa-location-dot') }).addTo(map);

    let bounds;
    if (geo) {
      routeLayer = L.geoJSON(geo, { style: { weight: 4 } }).addTo(map);
      bounds = routeLayer.getBounds();
    } else {
      bounds = L.latLngBounds([ [pick.lat, pick.lon], [drop.lat, drop.lon] ]);
    }
    map.fitBounds(bounds.pad(0.25));
  }

  document.addEventListener('cabme:addresses', (e) => {
    const { pick, drop } = e.detail || {}; pickEl.textContent = pick || '—'; dropEl.textContent = drop || '—';
  });

  document.addEventListener('cabme:coordinates', async (e) => {
    const { pick, drop } = e.detail || {}; if (!(pick && drop)) return;
    openOverlay();
    const res = await route(pick, drop);
    const km = res.meters/1000;
    distEl.textContent = `${km.toFixed(1)} km`;
    fareEl.textContent = rupees(calcFare(km));
    draw(pick, drop, res.geometry);
  });
})();