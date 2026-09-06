/**
 * js/carrito.js
 * Gestión de compras, cálculo de cupones de descuento y persistencia
 */

const CLAVE_CARRITO = 'carrito_tienda';
const CLAVE_CUPON = 'cupon_activo_tienda';

// --- UTILIDADES DE LOCALSTORAGE ---
const obtenerCarrito = () => {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
    } catch (error) {
        console.error('Error al leer carrito:', error);
        return [];
    }
};

const guardarCarrito = (carrito) => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    actualizarContadorBadge();
};

const obtenerCuponActivo = () => {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_CUPON)) || null;
    } catch (error) {
        return null;
    }
};

const guardarCuponActivo = (cupon) => {
    localStorage.setItem(CLAVE_CUPON, JSON.stringify(cupon));
};

const removerCuponActivo = () => {
    localStorage.removeItem(CLAVE_CUPON);
};

const formatearPesosChilenos = (valor) => {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(valor);
};

// --- CONTADOR EN NAVBAR ---
const actualizarContadorBadge = () => {
    const badges = document.querySelectorAll('#carrito-contador');
    const carrito = obtenerCarrito();
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    badges.forEach(badge => {
        badge.textContent = totalItems;
    });
};

// --- AGREGAR PRODUCTO (productos.html) ---
const agregarAlCarrito = (boton) => {
    const id = boton.dataset.id;
    const nombre = boton.dataset.nombre;
    const precio = parseInt(boton.dataset.precio, 10);
    const imagen = boton.dataset.imagen;

    if (!id || isNaN(precio)) return;

    const carrito = obtenerCarrito();
    const itemExistente = carrito.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({ id, nombre, precio, imagen, cantidad: 1 });
    }

    guardarCarrito(carrito);

    // Feedback visual en el botón
    const textoOriginal = boton.textContent;
    boton.textContent = '¡Añadido! ✓';
    boton.classList.add('opacity-75');
    boton.disabled = true;

    setTimeout(() => {
        boton.textContent = textoOriginal;
        boton.classList.remove('opacity-75');
        boton.disabled = false;
    }, 900);
};

// --- GESTIÓN DE CANTIDADES Y ELIMINACIÓN ---
const alterarCantidad = (id, delta) => {
    let carrito = obtenerCarrito();
    const producto = carrito.find(item => item.id === id);

    if (producto) {
        producto.cantidad += delta;
        if (producto.cantidad <= 0) {
            carrito = carrito.filter(item => item.id !== id);
        }
    }

    guardarCarrito(carrito);
    dibujarTablaCarrito();
};

const borrarArticulo = (id) => {
    const carrito = obtenerCarrito().filter(item => item.id !== id);
    guardarCarrito(carrito);
    dibujarTablaCarrito();
};

const vaciarTodoElCarrito = () => {
    localStorage.removeItem(CLAVE_CARRITO);
    removerCuponActivo();
    actualizarContadorBadge();
    dibujarTablaCarrito();
};

// --- VALIDACIÓN Y APLICACIÓN DE CUPONES (IE1.2.1) ---
const procesarCodigoDescuento = () => {
    const inputCupon = document.getElementById('input-cupon');
    const mensajeCupon = document.getElementById('mensaje-cupon');
    const carrito = obtenerCarrito();

    if (!inputCupon || !mensajeCupon) return;

    const valor = inputCupon.value.trim();

    // Validar si el carrito tiene productos
    if (carrito.length === 0) {
        mensajeCupon.textContent = 'Agrega productos al carrito antes de aplicar un descuento.';
        mensajeCupon.className = 'small mt-2 text-danger fw-semibold d-block';
        return;
    }

    if (!valor) {
        mensajeCupon.textContent = 'Por favor ingresa un código o correo válido (ej: DUOC20).';
        mensajeCupon.className = 'small mt-2 text-danger fw-semibold d-block';
        return;
    }

    const valorMayus = valor.toUpperCase();
    const regexDuocEmail = /^[^\s@]+@(duocuc\.cl|profesor\.duoc\.cl)$/i;

    let cuponAplicado = null;

    // Caso 1: Código oficial Duoc UC (20%) o Correo Institucional
    if (valorMayus === 'DUOC20' || valorMayus === 'DUOCUC' || regexDuocEmail.test(valor)) {
        cuponAplicado = {
            codigo: regexDuocEmail.test(valor) ? 'Convenio Duoc UC' : valorMayus,
            porcentaje: 0.20,
            descripcion: '20% Descuento Duoc UC'
        };
        mensajeCupon.textContent = '¡Descuento institucional del 20% aplicado con éxito!';
        mensajeCupon.className = 'small mt-2 text-success fw-semibold d-block';
    } 
    // Caso 2: Cupón fidelización Ciber Equipo Pride (10%)
    else if (valorMayus === 'PRIDE10' || valorMayus === 'PRIDE') {
        cuponAplicado = {
            codigo: 'PRIDE10',
            porcentaje: 0.10,
            descripcion: '10% Descuento Equipo Pride'
        };
        mensajeCupon.textContent = '¡Cupón Pride aplicado! Disfrutas de un 10% de descuento.';
        mensajeCupon.className = 'small mt-2 text-success fw-semibold d-block';
    } 
    // Caso 3: Código inválido
    else {
        mensajeCupon.textContent = 'Código o correo no válido. Prueba con DUOC20 o tu correo @duocuc.cl.';
        mensajeCupon.className = 'small mt-2 text-danger fw-semibold d-block';
        return;
    }

    guardarCuponActivo(cuponAplicado);
    inputCupon.value = '';
    dibujarTablaCarrito();
};

const eliminarCupon = () => {
    removerCuponActivo();
    const mensajeCupon = document.getElementById('mensaje-cupon');
    if (mensajeCupon) {
        mensajeCupon.textContent = 'Cupón eliminado.';
        mensajeCupon.className = 'small mt-2 text-secondary d-block';
        setTimeout(() => { mensajeCupon.style.display = 'none'; }, 2000);
    }
    dibujarTablaCarrito();
};

// --- RENDERIZADO DEL CARRITO Y TOTALES ---
const dibujarTablaCarrito = () => {
    const contenedor = document.getElementById('carrito-items');
    const elementoSubtotal = document.getElementById('carrito-subtotal');
    const elementoTotal = document.getElementById('carrito-total');
    const elementoDescuento = document.getElementById('carrito-descuento');
    const etiquetaCupon = document.getElementById('etiqueta-cupon');
    const filaDescuento = document.getElementById('fila-descuento');
    const btnVaciar = document.getElementById('btn-vaciar');
    const btnFinalizar = document.getElementById('btn-finalizar');
    const btnAplicarCupon = document.getElementById('btn-aplicar-cupon');
    const inputCupon = document.getElementById('input-cupon');
    const alertaCompra = document.getElementById('alerta-compra');

    if (!contenedor) return;

    const carrito = obtenerCarrito();
    contenedor.innerHTML = '';

    if (alertaCompra && !alertaCompra.classList.contains('d-none')) {
        alertaCompra.classList.add('d-none');
    }

    if (carrito.length === 0) {
        removerCuponActivo();
        contenedor.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-5 text-muted">
                    <p class="fs-5 mb-2">Tu carrito está vacío.</p>
                    <a href="productos.html" class="btn btn-sm text-white" style="background-color: #5b4b7a;">Explorar figuras</a>
                </td>
            </tr>
        `;
        if (elementoSubtotal) elementoSubtotal.textContent = formatearPesosChilenos(0);
        if (elementoTotal) elementoTotal.textContent = formatearPesosChilenos(0);
        if (filaDescuento) filaDescuento.classList.add('d-none');
        if (btnVaciar) btnVaciar.disabled = true;
        if (btnFinalizar) btnFinalizar.disabled = true;
        if (btnAplicarCupon) btnAplicarCupon.disabled = true;
        if (inputCupon) inputCupon.disabled = true;
        return;
    }

    if (btnVaciar) btnVaciar.disabled = false;
    if (btnFinalizar) btnFinalizar.disabled = false;
    if (btnAplicarCupon) btnAplicarCupon.disabled = false;
    if (inputCupon) inputCupon.disabled = false;

    let subtotal = 0;

    carrito.forEach(prod => {
        const totalFila = prod.precio * prod.cantidad;
        subtotal += totalFila;

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td class="align-middle">
                <div class="d-flex align-items-center">
                    <!-- AQUÍ VA LA CLASE NUEVA: -->
                    <img src="${prod.imagen}" alt="${prod.nombre}" class="img-carrito-figura me-3 rounded border p-1">
                    <span class="fw-semibold">${prod.nombre}</span>
                </div>
            </td>
            <td class="text-center align-middle">${formatearPesosChilenos(prod.precio)}</td>
            <td class="text-center align-middle">
                <div class="btn-group border rounded" role="group">
                    <button type="button" class="btn btn-light btn-sm btn-decrementar px-2" data-id="${prod.id}">−</button>
                    <span class="px-3 py-1 fw-bold bg-white">${prod.cantidad}</span>
                    <button type="button" class="btn btn-light btn-sm btn-incrementar px-2" data-id="${prod.id}">+</button>
                </div>
            </td>
            <td class="text-center align-middle fw-bold">${formatearPesosChilenos(totalFila)}</td>
            <td class="text-center align-middle">
                <button type="button" class="btn btn-outline-danger btn-sm btn-eliminar" data-id="${prod.id}">✕</button>
            </td>
        `;
        contenedor.appendChild(fila);
    });

    // Cálculos con Descuento
    const cupon = obtenerCuponActivo();
    let montoDescuento = 0;

    if (cupon && cupon.porcentaje > 0) {
        montoDescuento = Math.round(subtotal * cupon.porcentaje);
        if (filaDescuento) {
            filaDescuento.classList.remove('d-none');
            etiquetaCupon.textContent = `${cupon.codigo} -${cupon.porcentaje * 100}%`;
            elementoDescuento.textContent = `-${formatearPesosChilenos(montoDescuento)}`;
        }
    } else {
        if (filaDescuento) filaDescuento.classList.add('d-none');
    }

    const totalFinal = subtotal - montoDescuento;

    if (elementoSubtotal) elementoSubtotal.textContent = formatearPesosChilenos(subtotal);
    if (elementoTotal) elementoTotal.textContent = formatearPesosChilenos(totalFinal);
};

// --- SIMULACIÓN DE FINALIZACIÓN DE COMPRA ---
const procesarCompra = () => {
    const alertaCompra = document.getElementById('alerta-compra');
    const carrito = obtenerCarrito();

    if (carrito.length === 0) return;

    vaciarTodoElCarrito();

    if (alertaCompra) {
        alertaCompra.classList.remove('d-none');
    }
};

// --- INICIALIZACIÓN Y EVENTOS ---
document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorBadge();

    // Evento para botones de agregar (catálogo)
    document.addEventListener('click', (e) => {
        const botonAgregar = e.target.closest('.btn-agregar');
        if (botonAgregar) agregarAlCarrito(botonAgregar);
    });

    // Eventos dentro de carrito.html
    const contenedorCarrito = document.getElementById('carrito-items');
    if (contenedorCarrito) {
        dibujarTablaCarrito();

        contenedorCarrito.addEventListener('click', (e) => {
            const btnInc = e.target.closest('.btn-incrementar');
            const btnDec = e.target.closest('.btn-decrementar');
            const btnEli = e.target.closest('.btn-eliminar');

            if (btnInc) alterarCantidad(btnInc.dataset.id, 1);
            if (btnDec) alterarCantidad(btnDec.dataset.id, -1);
            if (btnEli) borrarArticulo(btnEli.dataset.id);
        });

        // Botones de acción
        const btnVaciar = document.getElementById('btn-vaciar');
        if (btnVaciar) btnVaciar.addEventListener('click', vaciarTodoElCarrito);

        const btnFinalizar = document.getElementById('btn-finalizar');
        if (btnFinalizar) btnFinalizar.addEventListener('click', procesarCompra);

        const btnAplicarCupon = document.getElementById('btn-aplicar-cupon');
        if (btnAplicarCupon) btnAplicarCupon.addEventListener('click', procesarCodigoDescuento);

        const btnQuitarCupon = document.getElementById('btn-quitar-cupon');
        if (btnQuitarCupon) btnQuitarCupon.addEventListener('click', eliminarCupon);

        // Permitir presionar Enter en el input de cupón
        const inputCupon = document.getElementById('input-cupon');
        if (inputCupon) {
            inputCupon.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    procesarCodigoDescuento();
                }
            });
        }
    }
});