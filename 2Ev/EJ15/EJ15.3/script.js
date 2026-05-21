const map = L.map('map').setView([40, 0], 3);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19
}).addTo(map);

let points = [];
let polyline = L.polyline([], { color: '#007bff', weight: 3, opacity: 0.8 }).addTo(map);
let totalDistance = 0;

document.getElementById('add').addEventListener('click', async () => {
  const latInput = document.getElementById('lat');
  const lngInput = document.getElementById('lng');

  const lat = parseFloat(latInput.value);
  const lng = parseFloat(lngInput.value);

  if (isNaN(lat) || isNaN(lng)) {
    alert('Por favor, introduce valores numéricos válidos.');
    return;
  }

  if (lat < -90 || lat > 90) {
    alert('La latitud debe estar entre -90 y 90.');
    return;
  }

  if (lng < -180 || lng > 180) {
    alert('La longitud debe estar entre -180 y 180.');
    return;
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'User-Agent': 'RutePlanner/1.0 (ejercicio-dwec)'
        }
      }
    );

    if (!res.ok) {
      throw new Error(`Error en la API: ${res.status}`);
    }

    const data = await res.json();

    points.push([lat, lng]);
    const marker = L.marker([lat, lng])
      .bindPopup(`<b>${data.address.city || data.address.town || 'Ubicación'}</b><br>${lat.toFixed(4)}, ${lng.toFixed(4)}`)
      .addTo(map);

    polyline.setLatLngs(points);

    if (points.length > 1) {
      const prev = points[points.length - 2];
      totalDistance += haversine(prev[0], prev[1], lat, lng);
    }

    document.getElementById('distance').textContent = totalDistance.toFixed(2);

    const address = data.display_name.split(',').slice(0, 3).join(',');
    document.getElementById('points').innerHTML +=
      `<li><strong>${lat.toFixed(4)}, ${lng.toFixed(4)}</strong> - ${address}</li>`;

    map.fitBounds(polyline.getBounds().pad(0.1));

    latInput.value = '';
    lngInput.value = '';
    latInput.focus();

  } catch (error) {
    alert(`Error al obtener la ubicación: ${error.message}`);
  }
});

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
