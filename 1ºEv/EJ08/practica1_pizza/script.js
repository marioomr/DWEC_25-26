document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll("input, select");
  inputs.forEach(el => el.addEventListener("change", actualizarPrecio));
  document.getElementById("pedidoBtn").addEventListener("click", mostrarResumen);
  actualizarPrecio();
});

function actualizarPrecio() {
  let total = 0;

  const tamaño = document.querySelector('input[name="tamaño"]:checked');
  total += parseFloat(tamaño.value);

  const masa = document.getElementById("masa");
  total += parseFloat(masa.value);

  const extras = document.querySelectorAll('input[type="checkbox"]:checked');
  extras.forEach(chk => total += parseFloat(chk.value));

  document.getElementById("precioTotal").textContent = total.toFixed(2);
}

function mostrarResumen() {
  const tamaño = document.querySelector('input[name="tamaño"]:checked').parentElement.textContent.trim();
  const masa = document.getElementById("masa").selectedOptions[0].text;
  const extras = [...document.querySelectorAll('input[type="checkbox"]:checked')]
    .map(chk => chk.parentElement.textContent.trim())
    .join(", ") || "Sin extras";

  const total = document.getElementById("precioTotal").textContent;

  alert(`Tu pedido:\n${tamaño}\nMasa: ${masa}\nExtras: ${extras}\nTotal: ${total} €`);
}
