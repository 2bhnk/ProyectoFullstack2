/**
 * js/detalle.js
 * Carga dinámica del producto por ID (?id=...),
 * lectura y sincronización del stock desde el inventario del administrador
 * y adición al carrito con control de existencias.
 */

const CLAVE_CARRITO = 'carrito_tienda';
const CLAVE_INVENTARIO = 'machan_inventario';

// Catálogo con especificaciones extendidas
const CATALOGO_DETALLE = [
    {
        id: "nendoroid-daiwa-scarlet",
        nombre: "Good Smile Company Nendoroid Daiwa Scarlet (Umamusume: Pretty Derby)",
        precio: 73990,
        imagen: "images/DaiwaNen.webp",
        distribuidor: "Good Smile Company",
        categoria: "Nendoroid / Chibi",
        descripcion: "¡Del juego 'Umamusume: Pretty Derby' llega una figura Nendoroid de Daiwa Scarlet, la Umamusume que siempre lucha por alcanzar el primer puesto! Incluye tres expresiones faciales: una sonrisa llena de energía, una expresión decidida que suele mostrar a sus rivales y una expresión lanzando un beso, inspirada en su actuación durante una de las canciones más populares del juego. \n Entre los accesorios opcionales se incluye una base Nendoroid de gran tamaño que imita el césped de una pista de carreras, así como una valla de la pista. \n ¡Diviértete recreando poses de competición con este estilo Nendoroid! ¡No dejes pasar la oportunidad de añadir a tu colección a Daiwa Scarlet, la Umamusume dispuesta a afrontar cualquier desafío para convertirse en la mejor! \n Figura articulada de plástico pintado, sin escala, con soporte incluido. Altura aproximada: 100 mm."
    },
    {
        id: "pop-up-parade-mihono-bourbon",
        nombre: "Good Smile Company POP UP PARADE SP Mihono Bourbon (Umamusume: Pretty Derby)",
        precio: 65990,
        imagen: "images/FiguraBourbon.webp",
        distribuidor: "Good Smile Company",
        categoria: "POP UP PARADE SP",
        descripcion: "Edición especial POP UP PARADE de la infatigable Mihono Bourbon. Destaca por su modelado dinámico, traje cibernético con acabados metálicos y pose firme que refleja su implacable disciplina de entrenamiento."
    },
    {
        id: "pop-up-parade-daiwa-scarlet-l",
        nombre: "Good Smile Company POP UP PARADE Daiwa Scarlet L Size Figure (Umamusume: Pretty Derby)",
        precio: 58990,
        imagen: "images/FiguraDaiwa.webp",
        distribuidor: "Good Smile Company",
        categoria: "POP UP PARADE (Tamaño L)",
        descripcion: "Figura de gran escala (aproximadamente 24 cm) de Daiwa Scarlet luciendo el uniforme clásico de Tracen. Captura a la perfección su dinamismo, doble coleta al viento y carácter enérgico."
    },
    {
        id: "pop-up-parade-machan-costume",
        nombre: "Good Smile Collection [Unforgettable Sugar Candy] Aston Machan (Umamusume: Pretty Derby)",
        precio: 142990,
        imagen: "images/FiguraMachanCostume.webp",
        distribuidor: "Good Smile Arts Shanghai",
        categoria: "Escala 1/7",
        descripcion: "Aston Machan con su vestido de ensueño 'Unforgettable Sugar Candy'. Esculpida meticulosamente capturando los volantes de su falda, texturas finas de tela y una paleta de colores pasteles inolvidable."
    },
    {
        id: "alter-tokai-teio-horizon",
        nombre: "ALTER [Beyond the Horizon] Tokai Teio 1/7 Figure (Umamusume: Pretty Derby)",
        precio: 217990,
        imagen: "images/FiguraTeioAlt.jpg",
        distribuidor: "ALTER",
        categoria: "Escala Premium 1/7",
        descripcion: "Una obra maestra de ingeniería por la prestigiosa casa ALTER. Presenta a Tokai Teio saltando llena de vitalidad con su traje de carreras 'Beyond the Horizon', con pintura degradada y base con efectos translúcidos."
    },
    {
        id: "pop-up-parade-fine-motion-l",
        nombre: "Good Smile Company POP UP PARADE Fine Motion L Size Figure (Umamusume: Pretty Derby)",
        precio: 80990,
        imagen: "images/FigurFineMo.jpg",
        distribuidor: "Good Smile Company",
        categoria: "POP UP PARADE (Tamaño L)",
        descripcion: "La noble princesa Fine Motion representada en escala L. Expresa toda su elegancia natural y sonrisa amable, luciendo el uniforme clásico de Tracen con gran nivel de detalle y terminaciones satinadas."
    },
    {
        id: "phat-calstone-light-o",
        nombre: "Phat! Calstone Light O 1/7 Figure (Umamusume: Pretty Derby)",
        precio: 230990,
        imagen: "images/FigutaCalstone.jpg",
        distribuidor: "Phat! Company",
        categoria: "Escala 1/7",
        descripcion: "La especialista en velocidad Calstone Light O en una pose cargada de aceleración. Fabricada por Phat! Company con materiales de alta gama, efecto de viento en el cabello y acabados satinados de primera línea."
    },
    {
        id: "nendoroid-silence-suzuka",
        nombre: "Good Smile Company Nendoroid Silence Suzuka Figure (Umamusume: Pretty Derby)",
        precio: 63990,
        imagen: "images/SuzukaNen.jpg",
        distribuidor: "Good Smile Company",
        categoria: "Nendoroid / Chibi",
        descripcion: "La velocista silenciosa Silence Suzuka en su versión Nendoroid. Incluye expresiones faciales, piernas intercambiables de carrera y su placa de valla de pista de césped."
    }
];

// Obtener el stock actualizado desde el inventario de localStorage
const consultarStockDesdeStorage = (id) => {
    try {
        const guardado = localStorage.getItem(CLAVE_INVENTARIO);
        if (guardado) {
            const inventario = JSON.parse(guardado);
            const productoEncontrado = inventario.find(p => p.id === id);
            if (productoEncontrado) return productoEncontrado.stock;
        }
    } catch (e) {}
    return 5; // Stock por defecto si no existiera
};

const formatearCLP = (monto) => {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(monto);
};

const refrescarBadgeCarrito = () => {
    try {
        const carrito = JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
        const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        document.querySelectorAll('#carrito-contador').forEach(b => b.textContent = total);
    } catch (e) {}
};

document.addEventListener('DOMContentLoaded', () => {
    refrescarBadgeCarrito();

    // 1. Obtener ID de la figura desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = urlParams.get('id');

    // 2. Buscar datos del producto
    const producto = CATALOGO_DETALLE.find(p => p.id === productoId) || CATALOGO_DETALLE[0];
    const stockReal = consultarStockDesdeStorage(producto.id);

    // 3. Modificar título de pestaña
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
    const inputCantidad = document.getElementById('cantidad-producto');
    const btnAgregar = document.getElementById('btn-agregar-detalle');

    if (breadNombre) breadNombre.textContent = producto.nombre;
    if (imgPrincipal) {
        imgPrincipal.src = producto.imagen;
        imgPrincipal.alt = producto.nombre;
    }
    if (txtNombre) txtNombre.textContent = producto.nombre;
    if (txtPrecio) txtPrecio.textContent = formatearCLP(producto.precio);
    if (txtDesc) txtDesc.textContent = producto.descripcion;
    if (txtProv) txtProv.textContent = producto.distribuidor;
    if (txtCat) txtCat.textContent = producto.categoria;

    // Miniaturas
    const miniaturas = document.querySelectorAll('#detalle-producto .cursor-pointer img');
    miniaturas.forEach(img => {
        img.src = producto.imagen;
        img.alt = producto.nombre;
    });

    // 5. Configurar Stock y Bloquear Botón si está Agotado
    if (txtStock) {
        if (stockReal <= 0) {
            txtStock.textContent = 'Agotado';
            txtStock.className = 'badge bg-danger';
            if (btnAgregar) {
                btnAgregar.disabled = true;
                btnAgregar.textContent = 'Sin Stock Disponible';
                btnAgregar.classList.remove('btn-primary');
                btnAgregar.classList.add('btn-secondary');
            }
            if (inputCantidad) {
                inputCantidad.disabled = true;
                inputCantidad.value = 0;
            }
        } else {
            txtStock.textContent = `En Stock (${stockReal} unidades disponibles)`;
            txtStock.className = stockReal <= 3 ? 'badge bg-warning text-dark' : 'badge bg-success';
            if (inputCantidad) {
                inputCantidad.disabled = false;
                inputCantidad.max = stockReal;
                inputCantidad.value = 1;
            }
        }
    }

    // 6. Evento de Añadir al Carrito
    if (btnAgregar && stockReal > 0) {
        btnAgregar.addEventListener('click', () => {
            const cantElegida = parseInt(inputCantidad.value, 10) || 1;

            let carrito = [];
            try {
                carrito = JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
            } catch (e) {
                carrito = [];
            }

            const itemExistente = carrito.find(item => item.id === producto.id);
            const cantidadPrevia = itemExistente ? itemExistente.cantidad : 0;

            if (cantidadPrevia + cantElegida > stockReal) {
                alert(`No puedes añadir esa cantidad. Ya tienes ${cantidadPrevia} en el carrito y el stock total es de ${stockReal}.`);
                return;
            }

            if (itemExistente) {
                itemExistente.cantidad += cantElegida;
            } else {
                carrito.push({
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    imagen: producto.imagen,
                    cantidad: cantElegida
                });
            }

            localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
            refrescarBadgeCarrito();

            const textoOriginal = btnAgregar.textContent;
            btnAgregar.textContent = `¡Añadido (${cantElegida})! ✓`;
            btnAgregar.classList.add('opacity-75');
            btnAgregar.disabled = true;

            setTimeout(() => {
                btnAgregar.textContent = textoOriginal;
                btnAgregar.classList.remove('opacity-75');
                btnAgregar.disabled = false;
            }, 900);
        });
    }

    // 7. Productos Relacionados
    const contenedorRelacionados = document.getElementById('contenedor-relacionados');
    if (contenedorRelacionados) {
        const relacionados = CATALOGO_DETALLE.filter(p => p.id !== producto.id).slice(0, 4);
        contenedorRelacionados.innerHTML = '';

        relacionados.forEach(rel => {
            const col = document.createElement('div');
            col.className = 'col-6 col-md-3';
            col.innerHTML = `
                <div class="card h-100 p-2 shadow-sm text-center border-0">
                    <a href="detallesProducto.html?id=${rel.id}" class="text-decoration-none text-dark">
                        <img src="${rel.imagen}" alt="${rel.nombre}" class="img-fluid mb-2 p-1" style="height: 140px; object-fit: contain;">
                        <h6 class="text-truncate fw-bold mb-1" title="${rel.nombre}">${rel.nombre}</h6>
                        <p class="text-success fw-bold m-0">${formatearCLP(rel.precio)}</p>
                    </a>
                </div>
            `;
            contenedorRelacionados.appendChild(col);
        });
    }
});