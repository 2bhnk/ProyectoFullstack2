// js/carrito.js
const STORAGE_KEY = 'carrito_tienda';

// --- UTILIDADES DE LOCALSTORAGE ---
const obtenerCarrito = () => JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const guardarCarrito = (carrito) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
  actualizarContador();
};

const formatearMoneda = (monto) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(monto);
};

// --- AGREGAR PRODUCTO (productos.html) ---
const agregarProducto = (e) => {
  const boton = e.target.closest('.btn-agregar');
  if (!boton) return;

  const id = boton.dataset.id;
  const nombre = boton.dataset.nombre;
  const precio = parseInt(boton.dataset.precio, 10);
  const imagen = boton.dataset.imagen;

  const carrito = obtenerCarrito();
  const productoExistente = carrito.find(item => item.id === id);

  if (productoExistente) {
    productoExistente.cantidad += 1;
  } else {
    carrito.push({ id, nombre, precio, imagen, cantidad: 1 });
  }

  guardarCarrito(carrito);

  // Feedback mínimo sin alterar el layout
  const textoOriginal = boton.textContent;
  boton.textContent = '¡Agregado! ✓';
  boton.disabled = true;
  setTimeout(() => {
    boton.textContent = textoOriginal;
    boton.disabled = false;
  }, 1000);
};

// --- CONTADOR DEL NAVBAR ---
const actualizarContador = () => {
  const badge = document.getElementById('carrito-contador');
  if (badge) {
    const carrito = obtenerCarrito();
    const totalArticulos = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    badge.textContent = totalArticulos;
  }
};

// --- GESTIÓN DE CANTIDADES (carrito.html) ---
const modificarCantidad = (id, delta) => {
  let carrito = obtenerCarrito();
  const producto = carrito.find(item => item.id === id);

  if (producto) {
    producto.cantidad += delta;
    if (producto.cantidad <= 0) {
      carrito = carrito.filter(item => item.id !== id);
    }
  }

  guardarCarrito(carrito);
  renderizarCarrito();
};

const eliminarProducto = (id) => {
  const carrito = obtenerCarrito().filter(item => item.id !== id);
  guardarCarrito(carrito);
  renderizarCarrito();
};

const vaciarCarrito = () => {
  localStorage.removeItem(STORAGE_KEY);
  actualizarContador();
  renderizarCarrito();
};

// --- DIBUJAR EN EL DOM (carrito.html) ---
const renderizarCarrito = () => {
  const contenedor = document.getElementById('carrito-items');
  const elementoTotal = document.getElementById('carrito-total');
  const btnVaciar = document.getElementById('btn-vaciar');

  if (!contenedor) return; // Si no estamos en carrito.html, salimos

  const carrito = obtenerCarrito();
  contenedor.innerHTML = '';

  if (carrito.length === 0) {
    contenedor.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-4">Tu carrito está vacío.</td>
      </tr>`;
    if (elementoTotal) elementoTotal.textContent = formatearMoneda(0);
    if (btnVaciar) btnVaciar.disabled = true;
    return;
  }

  if (btnVaciar) btnVaciar.disabled = false;

  let sumaTotal = 0;

  carrito.forEach(prod => {
    const subtotal = prod.precio * prod.cantidad;
    sumaTotal += subtotal;

    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td class="align-middle">
        <img src="${prod.imagen}" alt="${prod.nombre}" style="width: 50px; height: 50px; object-fit: cover;" class="me-2 rounded">
        <span>${prod.nombre}</span>
      </td>
      <td class="align-middle">${formatearMoneda(prod.precio)}</td>
      <td class="align-middle">
        <button class="btn btn-sm btn-outline-secondary btn-restar" data-id="${prod.id}">-</button>
        <span class="mx-2 fw-bold">${prod.cantidad}</span>
        <button class="btn btn-sm btn-outline-secondary btn-sumar" data-id="${prod.id}">+</button>
      </td>
      <td class="align-middle fw-bold">${formatearMoneda(subtotal)}</td>
      <td class="align-middle">
        <button class="btn btn-sm btn-danger btn-eliminar" data-id="${prod.id}">✕</button>
      </td>
    `;
    contenedor.appendChild(fila);
  });

  if (elementoTotal) {
    elementoTotal.textContent = formatearMoneda(sumaTotal);
  }
};

// --- INICIALIZACIÓN DE EVENTOS ---
document.addEventListener('DOMContentLoaded', () => {
  actualizarContador();

  // Escucha para botones de catálogo
  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-agregar')) {
      agregarProducto(e);
    }
  });

  // Delegación de eventos para la tabla del carrito
  const contenedor = document.getElementById('carrito-items');
  if (contenedor) {
    renderizarCarrito();

    contenedor.addEventListener('click', (e) => {
      const target = e.target;
      const id = target.dataset.id;
      if (target.classList.contains('btn-sumar')) modificarCantidad(id, 1);
      if (target.classList.contains('btn-restar')) modificarCantidad(id, -1);
      if (target.classList.contains('btn-eliminar')) eliminarProducto(id);
    });

    const btnVaciar = document.getElementById('btn-vaciar');
    if (btnVaciar) btnVaciar.addEventListener('click', vaciarCarrito);
  }
});