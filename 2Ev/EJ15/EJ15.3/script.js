const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let points = [];
let polyline = L.polyline([]).addTo(map);
let totalDistance = 0;

document.getElementById('add').addEventListener('click', async () => {
  const lat = parseFloat(document.getElementById('lat').value);
  const lng = parseFloat(document.getElementById('lng').value);

  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
  );
  const data = await res.json();

  points.push([lat, lng]);
  L.marker([lat, lng]).addTo(map);

  polyline.addLatLng([lat, lng]);
  map.fitBounds(polyline.getBounds());

  if (points.length > 1) {
    const prev = points[points.length - 2];
    totalDistance += haversine(prev[0], prev[1], lat, lng);
  }

  document.getElementById('distance').textContent = totalDistance.toFixed(2);
  document.getElementById('points').innerHTML +=
    `<li>${lat}, ${lng} - ${data.display_name}</li>`;
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
