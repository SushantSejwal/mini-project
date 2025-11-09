(function () {
  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  const map = L.map('map').setView([28.6327, 77.2198], 11);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const { latitude, longitude } = coords;
      map.setView([latitude, longitude], 13);
      L.marker([latitude, longitude]).addTo(map).bindPopup('You are here').openPopup();
    }, (err) => console.warn('Geolocation error:', err.message), { enableHighAccuracy: true });
  }

  const markers = [];
  function addMarker([lat, lon], label) { const m = L.marker([+lat, +lon]).addTo(map); if (label) m.bindPopup(label); markers.push(m); }
  function clearMarkers() { markers.forEach(m => map.removeLayer(m)); markers.length = 0; }
  function fitToMarkers() { if (!markers.length) return; const group = new L.featureGroup(markers); map.fitBounds(group.getBounds().pad(0.25)); }

  document.addEventListener('cabme:coordinates', (e) => {
    const { pick, drop } = e.detail || {}; if (!(pick && drop)) return;
    clearMarkers(); addMarker([pick.lat, pick.lon], 'Pickup'); addMarker([drop.lat, drop.lon], 'Drop'); fitToMarkers();
    if (window.CABME && window.CABME.routeLine) { map.removeLayer(window.CABME.routeLine); window.CABME.routeLine = null; }
    window.CABME = window.CABME || {}; window.CABME.routeLine = L.polyline([[pick.lat, pick.lon],[drop.lat, drop.lon]], { weight: 4 }).addTo(map);
  });

  window.CABME = window.CABME || {}; window.CABME.map = map;
})();