const CLAVE_SESION = 'machan_sesion_activa';

// --- SISTEMA GLOBAL DE NOTIFICACIONES FLOTANTES (TOASTS) ---
window.mostrarNotificacion = (mensaje, tipo = 'success') => {
    let contenedor = document.getElementById('toast-global-container');
    if (!contenedor) {
        contenedor = document.createElement('div');
        contenedor.id = 'toast-global-container';
        contenedor.className = 'toast-container position-fixed top-0 end-0 p-3';
        contenedor.style.zIndex = '99999';
        document.body.appendChild(contenedor);
    }

    const toastId = 'toast_' + Date.now();
    const colorBorde = tipo === 'success' ? '#5b4b7a' : (tipo === 'danger' ? '#dc3545' : '#ffc107');
    const icono = tipo === 'success' ? '✓' : (tipo === 'danger' ? '✕' : '⚠');

    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center shadow-lg border-0 bg-white" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex border-start border-4" style="border-color: ${colorBorde} !important;">
                <div class="toast-body d-flex align-items-center gap-2">
                    <span class="badge rounded-circle text-white p-1 px-2" style="background-color: ${colorBorde};">${icono}</span>
                    <span class="fw-semibold text-dark small">${mensaje}</span>
                </div>
                <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Cerrar"></button>
            </div>
        </div>
    `;

    contenedor.insertAdjacentHTML('beforeend', toastHTML);
    const elementoToast = document.getElementById(toastId);

    if (window.bootstrap && bootstrap.Toast) {
        const bsToast = new bootstrap.Toast(elementoToast, { delay: 2800 });
        bsToast.show();
        elementoToast.addEventListener('hidden.bs.toast', () => elementoToast.remove());
    } else {
        setTimeout(() => elementoToast.remove(), 3000);
    }
};

// Obtener datos de la sesión activa
const obtenerSesion = () => {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_SESION)) || null;
    } catch (e) {
        return null;
    }
};

// Cierre de sesión suave con notificación flotante
const cerrarSesion = () => {
    localStorage.removeItem(CLAVE_SESION);
    window.mostrarNotificacion('Has cerrado sesión correctamente.', 'success');

    setTimeout(() => {
        if (window.location.pathname.includes('/adminVista/')) {
            window.location.replace('../index.html');
        } else {
            window.location.replace('index.html');
        }
    }, 1000);
};

// 1. RESTRICCIÓN: Si ya está logeado, no permitir ingresar a login ni registro
(function verificarAccesoAuth() {
    const sesion = obtenerSesion();
    const ruta = window.location.pathname;

    if (sesion) {
        if (ruta.endsWith('login.html') || ruta.endsWith('registro.html')) {
            if (sesion.rol === 'admin') {
                window.location.replace('adminVista/admin.html');
            } else {
                window.location.replace('index.html');
            }
        }
    }
})();

// 2. ACTUALIZACIÓN DINÁMICA DEL NAVBAR
document.addEventListener('DOMContentLoaded', () => {
    const sesion = obtenerSesion();
    const contenedorNav = document.querySelector('.navbar-nav');
    if (!contenedorNav) return;

    const esAdminVista = window.location.pathname.includes('/adminVista/');
    const prefijoRuta = esAdminVista ? '../' : '';

    const linksNav = contenedorNav.querySelectorAll('a');
    let enlaceLogin = null;
    linksNav.forEach(link => {
        if (link.getAttribute('href') && link.getAttribute('href').includes('login.html')) {
            enlaceLogin = link;
        }
    });

    if (sesion) {
        const linkAdminHTML = (sesion.rol === 'admin' && !esAdminVista) 
            ? `<a class="boton-menu fw-bold text-warning" href="${prefijoRuta}adminVista/admin.html">⚙ Admin</a>` 
            : '';

        const bloqueSesionHTML = `
            ${linkAdminHTML}
            <span class="text-white px-2 py-1 small fw-bold" style="white-space: nowrap;">
                👤 ${sesion.nombre || 'Usuario'}
            </span>
            <button id="btnCerrarSesion" class="boton-menu btn btn-sm text-white ms-1" style="background-color: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 6px;">
                Salir
            </button>
        `;

        if (enlaceLogin) {
            const liPadre = enlaceLogin.closest('li.nav-item');
            if (liPadre) {
                liPadre.innerHTML = bloqueSesionHTML;
                liPadre.classList.add('d-flex', 'align-items-center', 'gap-1');
            } else {
                const wrapper = document.createElement('div');
                wrapper.className = 'd-inline-flex align-items-center gap-1';
                wrapper.innerHTML = bloqueSesionHTML;
                enlaceLogin.replaceWith(wrapper);
            }
        }

        const btnLogout = document.getElementById('btnCerrarSesion');
        if (btnLogout) {
            btnLogout.addEventListener('click', (e) => {
                e.preventDefault();
                cerrarSesion();
            });
        }
    }
});