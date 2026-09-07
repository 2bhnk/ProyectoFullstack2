const CLAVE_INVENTARIO = 'machan_inventario';
const CLAVE_SESION = 'machan_sesion_activa';
const CLAVE_USUARIOS = 'machan_usuarios';

// Catálogo predeterminado
const PRODUCTOS_BASE = [
    { id: "nendoroid-daiwa-scarlet", nombre: "Nendoroid Daiwa Scarlet", precio: 73990, stock: 8, imagen: "images/DaiwaNen.webp" },
    { id: "pop-up-parade-mihono-bourbon", nombre: "POP UP PARADE SP Mihono Bourbon", precio: 65990, stock: 5, imagen: "images/FiguraBourbon.webp" },
    { id: "pop-up-parade-daiwa-scarlet-l", nombre: "POP UP PARADE Daiwa Scarlet L Size", precio: 58990, stock: 6, imagen: "images/FiguraDaiwa.webp" },
    { id: "pop-up-parade-machan-costume", nombre: "Aston Machan [Unforgettable Sugar Candy]", precio: 142990, stock: 3, imagen: "images/FiguraMachanCostume.webp" },
    { id: "alter-tokai-teio-horizon", nombre: "ALTER Tokai Teio [Beyond the Horizon]", precio: 217990, stock: 2, imagen: "images/FiguraTeioAlt.jpg" },
    { id: "pop-up-parade-fine-motion-l", nombre: "POP UP PARADE Fine Motion L Size", precio: 80990, stock: 4, imagen: "images/FigurFineMo.jpg" },
    { id: "phat-calstone-light-o", nombre: "Phat! Calstone Light O 1/7", precio: 230990, stock: 3, imagen: "images/FigutaCalstone.jpg" },
    { id: "nendoroid-silence-suzuka", nombre: "Nendoroid Silence Suzuka", precio: 63990, stock: 7, imagen: "images/SuzukaNen.jpg" }
];

// --- SISTEMA INTEGRADO DE ALERTAS VISUALES ---
const mostrarAlerta = (mensaje, tipo = 'success') => {
    // Alerta integrada en la cabecera de admin.html
    const alerta = document.getElementById('alerta-admin');
    const texto = document.getElementById('mensaje-alerta-admin');
    if (alerta && texto) {
        alerta.className = `alert alert-${tipo} alert-dismissible fade show`;
        texto.textContent = mensaje;
        setTimeout(() => {
            alerta.classList.add('d-none');
        }, 3500);
    }
    // Sincroniza con el sistema global Toast si está activo
    if (typeof window.mostrarNotificacion === 'function') {
        window.mostrarNotificacion(mensaje, tipo);
    }
};

// =========================================================
// MÓDULO 1: GESTIÓN DE INVENTARIO Y STOCK
// =========================================================
const obtenerInventario = () => {
    try {
        const guardado = localStorage.getItem(CLAVE_INVENTARIO);
        if (!guardado) {
            localStorage.setItem(CLAVE_INVENTARIO, JSON.stringify(PRODUCTOS_BASE));
            return PRODUCTOS_BASE;
        }
        return JSON.parse(guardado);
    } catch (e) {
        return PRODUCTOS_BASE;
    }
};

const guardarInventario = (inventario) => {
    localStorage.setItem(CLAVE_INVENTARIO, JSON.stringify(inventario));
};

const formatearPesos = (monto) => {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(monto);
};

const actualizarEstadisticasInventario = (productos) => {
    const totalEl = document.getElementById('stat-total-figuras');
    const criticoEl = document.getElementById('stat-stock-critico');
    const agotadosEl = document.getElementById('stat-agotados');

    if (totalEl) totalEl.textContent = productos.length;
    if (criticoEl) criticoEl.textContent = productos.filter(p => p.stock > 0 && p.stock <= 3).length;
    if (agotadosEl) agotadosEl.textContent = productos.filter(p => p.stock <= 0).length;
};

const renderizarTablaStock = () => {
    const tbody = document.getElementById('tabla-admin-stock');
    if (!tbody) return;

    const productos = obtenerInventario();
    tbody.innerHTML = '';

    actualizarEstadisticasInventario(productos);

    productos.forEach(prod => {
        const fila = document.createElement('tr');
        const esAgotado = prod.stock <= 0;
        const esCritico = prod.stock > 0 && prod.stock <= 3;

        let estadoBadge = '<span class="badge bg-success">Disponible</span>';
        if (esAgotado) {
            estadoBadge = '<span class="badge bg-danger">Agotado</span>';
        } else if (esCritico) {
            estadoBadge = '<span class="badge bg-warning text-dark">Stock Bajo</span>';
        }

        fila.innerHTML = `
            <td class="align-middle">
                <div class="d-flex align-items-center">
                    <img src="../${prod.imagen}" alt="${prod.nombre}" 
                         style="width: 50px; height: 50px; object-fit: contain; background-color: #f8f9fa;" 
                         class="me-3 rounded border p-1">
                    <span class="fw-semibold">${prod.nombre}</span>
                </div>
            </td>
            <td class="text-center align-middle">${formatearPesos(prod.precio)}</td>
            <td class="text-center align-middle">
                <div class="input-group input-group-sm mx-auto" style="max-width: 120px;">
                    <input type="number" min="0" class="form-control text-center fw-bold input-stock-valor" 
                           data-id="${prod.id}" value="${prod.stock}">
                </div>
            </td>
            <td class="text-center align-middle">${estadoBadge}</td>
            <td class="text-center align-middle">
                <button class="btn btn-sm text-white btn-guardar-stock" data-id="${prod.id}" 
                        style="background-color: #5b4b7a;" title="Guardar cambios">
                    Guardar
                </button>
            </td>
        `;
        tbody.appendChild(fila);
    });
};

// =========================================================
// MÓDULO 2: GESTIÓN DE USUARIOS
// =========================================================
const obtenerUsuarios = () => {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_USUARIOS)) || [];
    } catch (e) {
        return [];
    }
};

const guardarUsuarios = (usuarios) => {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
};

const actualizarEstadisticasUsuarios = (usuarios) => {
    const totalEl = document.getElementById('stat-total-usuarios');
    const adminsEl = document.getElementById('stat-total-admins');
    const clientesEl = document.getElementById('stat-total-clientes');

    if (totalEl) totalEl.textContent = usuarios.length;
    if (adminsEl) adminsEl.textContent = usuarios.filter(u => u.rol === 'admin').length;
    if (clientesEl) clientesEl.textContent = usuarios.filter(u => u.rol !== 'admin').length;
};

const renderizarTablaUsuarios = () => {
    const tbody = document.getElementById('tabla-admin-usuarios');
    if (!tbody) return;

    const usuarios = obtenerUsuarios();
    const sesionActual = JSON.parse(localStorage.getItem(CLAVE_SESION)) || {};
    tbody.innerHTML = '';

    actualizarEstadisticasUsuarios(usuarios);

    if (usuarios.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">No hay usuarios registrados.</td></tr>`;
        return;
    }

    usuarios.forEach(user => {
        const fila = document.createElement('tr');
        const esAdmin = user.rol === 'admin';
        const esSesionPropia = sesionActual.email && sesionActual.email.toLowerCase() === user.email.toLowerCase();

        fila.innerHTML = `
            <td class="align-middle">
                <div class="fw-semibold">${user.nombre}</div>
                ${esSesionPropia ? '<small class="text-primary fw-bold">(Tú)</small>' : ''}
            </td>
            <td class="align-middle"><code>${user.email}</code></td>
            <td class="text-center align-middle">
                <span class="badge ${esAdmin ? 'bg-primary' : 'bg-secondary'}">
                    ${esAdmin ? '⚙️ Administrador' : '👤 Cliente'}
                </span>
            </td>
            <td class="text-center align-middle">
                <button class="btn btn-sm btn-outline-primary me-1 btn-editar-user" data-id="${user.id}">
                    Editar
                </button>
                <button class="btn btn-sm btn-outline-danger btn-eliminar-user" data-id="${user.id}" ${esSesionPropia ? 'disabled title="No puedes eliminar tu cuenta activa"' : ''}>
                    Eliminar
                </button>
            </td>
        `;
        tbody.appendChild(fila);
    });
};

// =========================================================
// INICIALIZACIÓN Y EVENTOS
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mostrar nombre de admin en el navbar
    try {
        const sesion = JSON.parse(localStorage.getItem(CLAVE_SESION));
        const userDisplay = document.getElementById('admin-user-display');
        if (sesion && userDisplay) {
            userDisplay.textContent = `👤 ${sesion.nombre || 'Admin'}`;
        }
    } catch (e) {}

    // 2. Render inicial de tablas
    renderizarTablaStock();
    renderizarTablaUsuarios();

    // 3. Control visual de las pestañas
    const tabBtns = document.querySelectorAll('#adminTabs button');
    tabBtns.forEach(btn => {
        btn.addEventListener('shown.bs.tab', () => {
            tabBtns.forEach(b => {
                b.classList.remove('active', 'btn-primary');
                b.classList.add('btn-outline-secondary');
            });
            btn.classList.add('active');
            btn.classList.remove('btn-outline-secondary');
        });
    });

    // 4. Guardar Stock individual
    document.getElementById('tabla-admin-stock')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-guardar-stock');
        if (btn) {
            const id = btn.dataset.id;
            const input = document.querySelector(`.input-stock-valor[data-id="${id}"]`);
            if (input) {
                const nuevoStock = Math.max(0, parseInt(input.value, 10) || 0);
                const inventario = obtenerInventario();
                const prod = inventario.find(p => p.id === id);

                if (prod) {
                    prod.stock = nuevoStock;
                    guardarInventario(inventario);
                    renderizarTablaStock();
                    mostrarAlerta(`✓ Stock de "${prod.nombre}" actualizado a ${nuevoStock} unidades.`);
                }
            }
        }
    });

    // 5. Restablecer Inventario (sin confirm bloqueante)
    document.getElementById('btn-reiniciar-stock')?.addEventListener('click', () => {
        guardarInventario(PRODUCTOS_BASE);
        renderizarTablaStock();
        mostrarAlerta('Inventario restablecido a los valores por defecto.', 'info');
    });

    // 6. Botones de la tabla de usuarios (Editar / Eliminar)
    document.getElementById('tabla-admin-usuarios')?.addEventListener('click', (e) => {
        const btnEditar = e.target.closest('.btn-editar-user');
        const btnEliminar = e.target.closest('.btn-eliminar-user');

        if (btnEditar) {
            const id = btnEditar.dataset.id;
            const usuarios = obtenerUsuarios();
            const user = usuarios.find(u => u.id === id);

            if (user) {
                document.getElementById('edit-id').value = user.id;
                document.getElementById('edit-nombre').value = user.nombre;
                document.getElementById('edit-email').value = user.email;
                document.getElementById('edit-password').value = '';
                document.getElementById('edit-rol').value = user.rol || 'cliente';

                const modal = new bootstrap.Modal(document.getElementById('modalEditarUsuario'));
                modal.show();
            }
        }

        if (btnEliminar) {
            const id = btnEliminar.dataset.id;
            const usuarios = obtenerUsuarios();
            const user = usuarios.find(u => u.id === id);

            if (user) {
                const filtrados = usuarios.filter(u => u.id !== id);
                guardarUsuarios(filtrados);
                renderizarTablaUsuarios();
                mostrarAlerta(`Usuario "${user.nombre}" eliminado correctamente.`, 'danger');
            }
        }
    });

    // 7. Formulario: Guardar cambios de usuario editado
    document.getElementById('formEditarUsuario')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-id').value;
        const nombre = document.getElementById('edit-nombre').value.trim();
        const email = document.getElementById('edit-email').value.trim();
        const password = document.getElementById('edit-password').value;
        const rol = document.getElementById('edit-rol').value;

        let usuarios = obtenerUsuarios();
        const index = usuarios.findIndex(u => u.id === id);

        if (index !== -1) {
            const correoEnUso = usuarios.some(u => u.id !== id && u.email.toLowerCase() === email.toLowerCase());
            if (correoEnUso) {
                mostrarAlerta('Ese correo ya está registrado por otro usuario.', 'danger');
                return;
            }

            usuarios[index].nombre = nombre;
            usuarios[index].email = email;
            usuarios[index].rol = rol;
            if (password.trim() !== '') {
                usuarios[index].password = password;
            }

            guardarUsuarios(usuarios);

            // Si se editó a sí mismo, sincronizar la sesión activa
            const sesion = JSON.parse(localStorage.getItem(CLAVE_SESION));
            if (sesion && sesion.id === id) {
                sesion.nombre = nombre;
                sesion.email = email;
                sesion.rol = rol;
                localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
            }

            bootstrap.Modal.getInstance(document.getElementById('modalEditarUsuario')).hide();
            renderizarTablaUsuarios();
            mostrarAlerta(`✓ Usuario "${nombre}" modificado exitosamente.`);
        }
    });

    // 8. Formulario: Crear Nuevo Usuario
    document.getElementById('formNuevoUsuario')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nuevo-nombre').value.trim();
        const email = document.getElementById('nuevo-email').value.trim();
        const password = document.getElementById('nuevo-password').value;
        const rol = document.getElementById('nuevo-rol').value;

        let usuarios = obtenerUsuarios();

        if (usuarios.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            mostrarAlerta('Este correo electrónico ya se encuentra registrado.', 'danger');
            return;
        }

        if (password.length < 6) {
            mostrarAlerta('La contraseña debe tener al menos 6 caracteres.', 'danger');
            return;
        }

        const nuevoUsuario = {
            id: 'usr_' + Date.now(),
            nombre,
            email,
            password,
            rol
        };

        usuarios.push(nuevoUsuario);
        guardarUsuarios(usuarios);

        document.getElementById('formNuevoUsuario').reset();
        bootstrap.Modal.getInstance(document.getElementById('modalNuevoUsuario')).hide();
        renderizarTablaUsuarios();
        mostrarAlerta(`✓ Usuario "${nombre}" creado con éxito.`);
    });

    // 9. Botón Cerrar Sesión
    document.getElementById('btn-admin-logout')?.addEventListener('click', () => {
        localStorage.removeItem(CLAVE_SESION);
        mostrarAlerta('Sesión cerrada correctamente.', 'info');
        setTimeout(() => {
            window.location.replace('../login.html');
        }, 1000);
    });
});