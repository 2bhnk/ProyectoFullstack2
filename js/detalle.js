
const PRODUCTOS = [
    {
        id: "nendoroid-daiwa-scarlet",
        nombre: "Good Smile Company Nendoroid Daiwa Scarlet (Umamusume: Pretty Derby)",
        precio: 73990,
        imagen: "images/DaiwaNen.webp",
        distribuidor: "Good Smile Company",
        categoria: "Nendoroid / Chibi",
        stock: true,
        descripcion: "a"
    },
    {
        id: "pop-up-parade-mihono-bourbon",
        nombre: "Good Smile Company POP UP PARADE SP Mihono Bourbon (Umamusume: Pretty Derby)",
        precio: 65990,
        imagen: "images/FiguraBourbon.webp",
        distribuidor: "Good Smile Company",
        categoria: "POP UP PARADE SP",
        stock: true,
        descripcion: "a"    
    },
    {
        id: "pop-up-parade-daiwa-scarlet-l",
        nombre: "Good Smile Company POP UP PARADE Daiwa Scarlet L Size Figure (Umamusume: Pretty Derby)",
        precio: 58990,
        imagen: "images/FiguraDaiwa.webp",
        distribuidor: "Good Smile Company",
        categoria: "POP UP PARADE (Tamaño L)",
        stock: true,
        descripcion: "a"    
    },
    {
        id: "pop-up-parade-machan-costume",
        nombre: "Good Smile Collection [Unforgettable Sugar Candy] Aston Machan (Umamusume: Pretty Derby)",
        precio: 142990,
        imagen: "images/FiguraMachanCostume.webp",
        distribuidor: "Good Smile Arts Shanghai",
        categoria: "Escala 1/7",
        stock: true,
        descripcion: "a"    
    },
    {
        id: "alter-tokai-teio-horizon",
        nombre: "ALTER [Beyond the Horizon] Tokai Teio 1/7 Figure (Umamusume: Pretty Derby)",
        precio: 217990,
        imagen: "images/FiguraTeioAlt.jpg",
        distribuidor: "ALTER",
        categoria: "Escala Premium 1/7",
        stock: true,
        descripcion: "a"    
    },
    {
        id: "pop-up-parade-fine-motion-l",
        nombre: "Good Smile Company POP UP PARADE Fine Motion L Size Figure (Umamusume: Pretty Derby)",
        precio: 80990,
        imagen: "images/FigurFineMo.jpg",
        distribuidor: "Good Smile Company",
        categoria: "POP UP PARADE (Tamaño L)",
        stock: true,
        descripcion: "a"    
    },
    {
        id: "phat-calstone-light-o",
        nombre: "Phat! Calstone Light O 1/7 Figure (Umamusume: Pretty Derby)",
        precio: 230990,
        imagen: "images/FigutaCalstone.jpg",
        distribuidor: "Phat! Company",
        categoria: "Escala 1/7",
        stock: true,
        descripcion: "a"    
    },
    {
        id: "nendoroid-silence-suzuka",
        nombre: "Good Smile Company Nendoroid Silence Suzuka Figure (Umamusume: Pretty Derby)",
        precio: 63990,
        imagen: "images/SuzukaNen.jpg",
        distribuidor: "Good Smile Company",
        categoria: "Nendoroid / Chibi",
        stock: true,
        descripcion: "a"    
    }
];

// --- UTILIDADES ---
const formatearMoneda = (monto) => {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(monto);
};

// Función para actualizar el contador de navbar
const refrescarContadorNavbar = () => {
    try {
        const carrito = JSON.parse(localStorage.getItem('carrito_tienda')) || [];
        const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        const badges = document.querySelectorAll('#carrito-contador');
        badges.forEach(b => b.textContent = total);
    } catch (e) {
        console.error(e);
    }
};

// --- AGREGAR CON CANTIDAD PERSONALIZADA ---
const agregarProductoConCantidad = (producto, cantidad) => {
    const CLAVE_CARRITO = 'carrito_tienda';
    let carrito = [];
    try {
        carrito = JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
    } catch (e) {
        carrito = [];
    }

    const existente = carrito.find(item => item.id === producto.id);
    if (existente) {
        existente.cantidad += cantidad;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: cantidad
        });
    }

    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    refrescarContadorNavbar();
};

// --- INICIALIZAR VISTA DETALLE ---
document.addEventListener('DOMContentLoaded', () => {
    refrescarContadorNavbar();

    // 1. Obtener ID desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = urlParams.get('id');

    // 2. Buscar producto o mostrar el primero por defecto si no viene parámetro
    const producto = PRODUCTOS.find(p => p.id === productoId) || PRODUCTOS[0];

    // 3. Modificar título de la pestaña del navegador
    document.title = `${producto.nombre} - MachanStore`;

    // 4. Inyectar datos en el DOM
    const breadNombre = document.getElementById('bread-nombre-producto');
    const imgPrincipal = document.getElementById('detalle-imagen-principal');
    const txtNombre = document.getElementById('detalle-nombre');
    const txtPrecio = document.getElementById('detalle-precio');
    const txtDesc = document.getElementById('detalle-descripcion');
    const txtProv = document.getElementById('detalle-proveedor');
    const txtCat = document.getElementById('detalle-categoria');
    const txtStock = document.getElementById('detalle-stock');

    if (breadNombre) breadNombre.textContent = producto.nombre;
    if (imgPrincipal) {
        imgPrincipal.src = producto.imagen;
        imgPrincipal.alt = producto.nombre;
    }
    if (txtNombre) txtNombre.textContent = producto.nombre;
    if (txtPrecio) txtPrecio.textContent = formatearMoneda(producto.precio);
    if (txtDesc) txtDesc.textContent = producto.descripcion;
    if (txtProv) txtProv.textContent = producto.distribuidor;
    if (txtCat) txtCat.textContent = producto.categoria;
    
    if (txtStock) {
        txtStock.textContent = producto.stock ? 'En Stock (Envío Inmediato)' : 'Agotado';
        txtStock.className = producto.stock ? 'badge bg-success' : 'badge bg-secondary';
    }

    // Miniaturas (asigna la imagen del producto a las 3 miniaturas de muestra)
    const miniaturas = document.querySelectorAll('#detalle-producto .cursor-pointer img');
    miniaturas.forEach(img => {
        img.src = producto.imagen;
        img.alt = producto.nombre;
    });

    // 5. Botón Añadir al Carrito con cantidad seleccionada
    const btnAgregar = document.getElementById('btn-agregar-detalle');
    const inputCantidad = document.getElementById('cantidad-producto');

    if (btnAgregar && inputCantidad) {
        btnAgregar.addEventListener('click', () => {
            const cant = parseInt(inputCantidad.value, 10);
            const cantidadFinal = (!isNaN(cant) && cant >= 1) ? cant : 1;

            agregarProductoConCantidad(producto, cantidadFinal);

            // Efecto visual
            const textoOriginal = btnAgregar.textContent;
            btnAgregar.textContent = `¡Añadido (${cantidadFinal})! ✓`;
            btnAgregar.classList.add('opacity-75');
            btnAgregar.disabled = true;

            setTimeout(() => {
                btnAgregar.textContent = textoOriginal;
                btnAgregar.classList.remove('opacity-75');
                btnAgregar.disabled = false;
            }, 900);
        });
    }

    // 6. Cargar Productos Relacionados (muestra otros productos excluyendo el actual)
    const contenedorRelacionados = document.getElementById('contenedor-relacionados');
    if (contenedorRelacionados) {
        const relacionados = PRODUCTOS.filter(p => p.id !== producto.id).slice(0, 4);
        contenedorRelacionados.innerHTML = '';

        relacionados.forEach(rel => {
            const col = document.createElement('div');
            col.className = 'col-6 col-md-3';
            col.innerHTML = `
                <div class="card h-100 p-2 shadow-sm text-center">
                    <a href="detallesProducto.html?id=${rel.id}" class="text-decoration-none text-dark">
                        <img src="${rel.imagen}" alt="${rel.nombre}" class="img-fluid mb-2" style="height: 140px; object-fit: contain;">
                        <h6 class="text-truncate fw-bold mb-1" title="${rel.nombre}">${rel.nombre}</h6>
                        <p class="text-success fw-bold m-0">${formatearMoneda(rel.precio)}</p>
                    </a>
                </div>
            `;
            contenedorRelacionados.appendChild(col);
        });
    }
});