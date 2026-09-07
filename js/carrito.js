const CLAVE_CARRITO = 'carrito_tienda';
const CLAVE_CUPON = 'cupon_activo_tienda';
const CLAVE_INVENTARIO = 'machan_inventario';

// Helper de notificación segura
const notificarUsuario = (mensaje, tipo = 'danger') => {
    if (typeof window.mostrarNotificacion === 'function') {
        window.mostrarNotificacion(mensaje, tipo);
    }
};

// Catálogo base de inventario (por defecto si no ha sido inicializado en adminVista)
const INVENTARIO_PREDETERMINADO = [
    { id: "nendoroid-daiwa-scarlet", nombre: "Nendoroid Daiwa Scarlet", precio: 73990, stock: 8, imagen: "images/DaiwaNen.webp" },
    { id: "pop-up-parade-mihono-bourbon", nombre: "POP UP PARADE SP Mihono Bourbon", precio: 65990, stock: 5, imagen: "images/FiguraBourbon.webp" },
    { id: "pop-up-parade-daiwa-scarlet-l", nombre: "POP UP PARADE Daiwa Scarlet L Size", precio: 58990, stock: 6, imagen: "images/FiguraDaiwa.webp" },
    { id: "pop-up-parade-machan-costume", nombre: "Aston Machan [Unforgettable Sugar Candy]", precio: 142990, stock: 3, imagen: "images/FiguraMachanCostume.webp" },
    { id: "alter-tokai-teio-horizon", nombre: "ALTER Tokai Teio [Beyond the Horizon]", precio: 217990, stock: 2, imagen: "images/FiguraTeioAlt.jpg" },
    { id: "pop-up-parade-fine-motion-l", nombre: "POP UP PARADE Fine Motion L Size", precio: 80990, stock: 4, imagen: "images/FigurFineMo.jpg" },
    { id: "phat-calstone-light-o", nombre: "Phat! Calstone Light O 1/7", precio: 230990, stock: 3, imagen: "images/FigutaCalstone.jpg" },
    { id: "nendoroid-silence-suzuka", nombre: "Nendoroid Silence Suzuka", precio: 63990, stock: 7, imagen: "images/SuzukaNen.jpg" }
];

// --- GESTIÓN DE INVENTARIO CENTRALIZADO ---
const obtenerInventario = () => {
    try {
        const guardado = localStorage.getItem(CLAVE_INVENTARIO);
        if (!guardado) {
            localStorage.setItem(CLAVE_INVENTARIO, JSON.stringify(INVENTARIO_PREDETERMINADO));
            return INVENTARIO_PREDETERMINADO;
        }
        return JSON.parse(guardado);
    } catch (e) {
        return INVENTARIO_PREDETERMINADO;
    }
};

const guardarInventario = (inventario) => {
    localStorage.setItem(CLAVE_INVENTARIO, JSON.stringify(inventario));
};

const obtenerStockProducto = (id) => {
    const inv = obtenerInventario();
    const prod = inv.find(p => p.id === id);
    return prod ? prod.stock : 0;
};

// --- UTILIDADES DEL CARRITO ---
const obtenerCarrito = () => {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
    } catch (error) {
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

// --- ACTUALIZAR CONTADOR DE NAVBAR ---
const actualizarContadorBadge = () => {
    const badges = document.querySelectorAll('#carrito-contador');
    const carrito = obtenerCarrito();
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    badges.forEach(badge => {
        badge.textContent = totalItems;
    });
};

// --- AGREGAR PRODUCTO DESDE CATÁLOGO CON VERIFICACIÓN DE STOCK ---
const agregarAlCarrito = (boton) => {
    const id = boton.dataset.id;
    const nombre = boton.dataset.nombre;
    const precio = parseInt(boton.dataset.precio, 10);
    const imagen = boton.dataset.imagen;

    if (!id || isNaN(precio)) return;

    const stockDisponible = obtenerStockProducto(id);

    if (stockDisponible <= 0) {
        notificarUsuario('Lo sentimos, este producto se encuentra agotado.', 'danger');
        return;
    }

    const carrito = obtenerCarrito();
    const itemExistente = carrito.find(item => item.id === id);

    if (itemExistente) {
        if (itemExistente.cantidad >= stockDisponible) {
            notificarUsuario(`No puedes agregar más. Solo quedan ${stockDisponible} unidades disponibles de esta figura.`, 'danger');
            return;
        }
        itemExistente.cantidad += 1;
    } else {
        carrito.push({ id, nombre, precio, imagen, cantidad: 1 });
    }

    guardarCarrito(carrito);
    notificarUsuario(`"${nombre}" añadido al carrito.`, 'success');

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

// --- CONTROL DE CANTIDADES CON CONTROL DE LÍMITE DE STOCK ---
const alterarCantidad = (id, incremento) => {
    let carrito = obtenerCarrito();
    const producto = carrito.find(item => item.id === id);
    const stockMaximo = obtenerStockProducto(id);

    if (producto) {
        if (incremento > 0 && producto.cantidad >= stockMaximo) {
            notificarUsuario(`Has alcanzado el límite máximo de existencias disponibles (${stockMaximo} unidades).`, 'danger');
            return;
        }

        producto.cantidad += incremento;
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

// --- VALIDACIÓN DE CUPONES DE DESCUENTO ---
const procesarCodigoDescuento = () => {
    const inputCupon = document.getElementById('input-cupon');
    const mensajeCupon = document.getElementById('mensaje-cupon');
    const carrito = obtenerCarrito();

    if (!inputCupon || !mensajeCupon) return;

    const valor = inputCupon.value.trim();

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

    if (valorMayus === 'DUOC20' || valorMayus === 'DUOCUC' || regexDuocEmail.test(valor)) {
        cuponAplicado = {
            codigo: regexDuocEmail.test(valor) ? 'Convenio Duoc UC' : valorMayus,
            porcentaje: 0.20,
            descripcion: '20% Descuento Duoc UC'
        };
        mensajeCupon.textContent = '¡Descuento institucional del 20% aplicado con éxito!';
        mensajeCupon.className = 'small mt-2 text-success fw-semibold d-block';
        notificarUsuario('Cupón Duoc UC (20%) aplicado correctamente.', 'success');
    } else if (valorMayus === 'PRIDE10' || valorMayus === 'PRIDE') {
        cuponAplicado = {
            codigo: 'PRIDE10',
            porcentaje: 0.10,
            descripcion: '10% Descuento Equipo Pride'
        };
        mensajeCupon.textContent = '¡Cupón Pride aplicado! Disfrutas de un 10% de descuento.';
        mensajeCupon.className = 'small mt-2 text-success fw-semibold d-block';
        notificarUsuario('Cupón Pride (10%) aplicado correctamente.', 'success');
    } else {
        mensajeCupon.textContent = 'Código o correo no válido. Prueba con DUOC20 o tu correo @duocuc.cl.';
        mensajeCupon.className = 'small mt-2 text-danger fw-semibold d-block';
        notificarUsuario('Código de descuento no válido.', 'danger');
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

// --- RENDERIZADO DE TABLA EN CARRITO.HTML ---
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
        const stockActual = obtenerStockProducto(prod.id);
        
        // Si el admin redujo el stock por debajo de la cantidad que ya tenía en el carrito
        if (prod.cantidad > stockActual) {
            prod.cantidad = Math.max(1, stockActual);
            guardarCarrito(carrito);
        }

        const totalFila = prod.precio * prod.cantidad;
        subtotal += totalFila;

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td class="align-middle">
                <div class="d-flex align-items-center">
                    <img src="${prod.imagen}" alt="${prod.nombre}" class="img-carrito-figura me-3 rounded border p-1" style="width: 60px; height: 60px; object-fit: contain; background: #fff;">
                    <div>
                        <span class="fw-semibold d-block">${prod.nombre}</span>
                        <small class="text-muted">Stock actual: ${stockActual}</small>
                    </div>
                </div>
            </td>
            <td class="text-center align-middle">${formatearPesosChilenos(prod.precio)}</td>
            <td class="text-center align-middle">
                <div class="btn-group border rounded" role="group">
                    <button type="button" class="btn btn-light btn-sm btn-decrementar px-2" data-id="${prod.id}">−</button>
                    <span class="px-3 py-1 fw-bold bg-white">${prod.cantidad}</span>
                    <button type="button" class="btn btn-light btn-sm btn-incrementar px-2" data-id="${prod.id}" ${prod.cantidad >= stockActual ? 'disabled' : ''}>+</button>
                </div>
            </td>
            <td class="text-center align-middle fw-bold">${formatearPesosChilenos(totalFila)}</td>
            <td class="text-center align-middle">
                <button type="button" class="btn btn-outline-danger btn-sm btn-eliminar" data-id="${prod.id}" title="Eliminar figura">
                    ✕
                </button>
            </td>
        `;
        contenedor.appendChild(fila);
    });

    // Descuentos
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

    const totalFinal = Math.max(0, subtotal - montoDescuento);

    if (elementoSubtotal) elementoSubtotal.textContent = formatearPesosChilenos(subtotal);
    if (elementoTotal) elementoTotal.textContent = formatearPesosChilenos(totalFinal);
};

// --- PROCESAR COMPRA Y DESCONTAR STOCK REAL ---
const procesarCompra = () => {
    const alertaCompra = document.getElementById('alerta-compra');
    const carrito = obtenerCarrito();

    if (carrito.length === 0) return;

    // 1. Descontar del inventario centralizado
    const inventario = obtenerInventario();
    carrito.forEach(item => {
        const prod = inventario.find(p => p.id === item.id);
        if (prod) {
            prod.stock = Math.max(0, prod.stock - item.cantidad);
        }
    });
    guardarInventario(inventario);

    // 2. Vaciar carrito
    localStorage.removeItem(CLAVE_CARRITO);
    removerCuponActivo();
    actualizarContadorBadge();
    dibujarTablaCarrito();

    // 3. Mostrar confirmación
    if (alertaCompra) {
        alertaCompra.classList.remove('d-none');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

// --- ESCUCHADORES DE EVENTOS ---
document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorBadge();

    // Evento para añadir desde catálogo
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

        const btnVaciar = document.getElementById('btn-vaciar');
        if (btnVaciar) btnVaciar.addEventListener('click', vaciarTodoElCarrito);

        const btnFinalizar = document.getElementById('btn-finalizar');
        if (btnFinalizar) btnFinalizar.addEventListener('click', procesarCompra);

        const btnAplicarCupon = document.getElementById('btn-aplicar-cupon');
        if (btnAplicarCupon) btnAplicarCupon.addEventListener('click', procesarCodigoDescuento);

        const btnQuitarCupon = document.getElementById('btn-quitar-cupon');
        if (btnQuitarCupon) btnQuitarCupon.addEventListener('click', eliminarCupon);

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