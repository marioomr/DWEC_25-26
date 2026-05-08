const form = document.getElementById('form-producto')
const nombre = document.getElementById('nombre')
const sku = document.getElementById('sku')
const precio = document.getElementById('precio')
const stock = document.getElementById('stock')
const categoria = document.getElementById('categoria')
const errNombre = document.getElementById('err-nombre')
const errSku = document.getElementById('err-sku')
const errPrecio = document.getElementById('err-precio')
const errStock = document.getElementById('err-stock')
const errCategoria = document.getElementById('err-categoria')
const estadoSku = document.getElementById('estado-sku')
const guardar = document.getElementById('guardar')
const msg = document.getElementById('msg')
let skuValido = false

function validarBasico(){
  let ok = true
  if(!nombre.value.trim()){errNombre.textContent = 'Requerido'; ok = false} else errNombre.textContent = ''
  if(!sku.value.trim() || sku.value.trim().length < 5){errSku.textContent = 'SKU mínimo 5'; ok = false} else errSku.textContent = ''
  if(!precio.value || Number(precio.value) <= 0){errPrecio.textContent = 'Precio > 0'; ok = false} else errPrecio.textContent = ''
  if(stock.value === '' || Number(stock.value) < 0){errStock.textContent = 'Stock >= 0'; ok = false} else errStock.textContent = ''
  if(!categoria.value.trim()){errCategoria.textContent = 'Requerido'; ok = false} else errCategoria.textContent = ''
  guardar.disabled = !(ok && skuValido)
}

async function validarSku(s){
  estadoSku.textContent = 'Validando SKU...'
  try{
    const res = await fetch('../data/productos.json')
    const productos = await res.json()
    const existe = productos.some(p => p.sku === s)
    if(existe){
      errSku.textContent = 'El SKU ya existe'
      skuValido = false
    } else {
      errSku.textContent = ''
      skuValido = true
    }
  }catch(e){
    errSku.textContent = 'Error validando SKU'
    skuValido = false
  } finally {
    estadoSku.textContent = ''
    validarBasico()
  }
}

[nombre,sku,precio,stock,categoria].forEach(el => {
  el.addEventListener('input', () => {
    if(el === sku) skuValido = false
    validarBasico()
  })
})

sku.addEventListener('blur', () => {
  const s = sku.value.trim()
  if(s.length >= 5) validarSku(s)
})

form.addEventListener('submit', e => {
  e.preventDefault()
  const nuevo = {
    nombre: nombre.value.trim(),
    sku: sku.value.trim(),
    precio: Number(precio.value),
    stock: Number(stock.value),
    categoria: categoria.value.trim()
  }
  msg.textContent = `Producto '${nuevo.nombre}' guardado correctamente`
  form.reset()
  skuValido = false
  guardar.disabled = true
})
