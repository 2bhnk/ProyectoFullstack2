
const CLAVE_SESION = 'machan_sesion_activa';

// Obtener los datos del usuario logeado
const obtenerSesion = () => {
    try {
        return JSON.parse(localStorage.getItem(CLAVE_SESION)) || null;
    } catch (e) {
        return null;
    }
};

// Función para cerrar la sesión
const cerrarSesion = () => {
    localStorage.removeItem(CLAVE_SESION);
    alert('Has cerrado sesión correctamente.');
    
    // Si estamos dentro de la subcarpeta adminVista/, salimos a la raíz
    if (window.location.pathname.includes('/adminVista/')) {
        window.location.replace('../index.html');
    } else {
        window.location.replace('index.html');
    }
};

// 1. RESTRICCIÓN: Si ya está logeado, no permitir entrar a login ni registro
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
    
    // Buscamos el contenedor de enlaces del navbar (.navbar-nav)
    const contenedorNav = document.querySelector('.navbar-nav');
    if (!contenedorNav) return;

    // Determinamos el prefijo de las rutas si estamos dentro de adminVista/
    const esAdminVista = window.location.pathname.includes('/adminVista/');
    const prefijoRuta = esAdminVista ? '../' : '';

    // Buscar el botón o enlace que lleva a login.html
    const linksNav = contenedorNav.querySelectorAll('a');
    let enlaceLogin = null;
    linksNav.forEach(link => {
        if (link.getAttribute('href') && link.getAttribute('href').includes('login.html')) {
            enlaceLogin = link;
        }
    });

    // Si hay una sesión activa, modificamos la barra de navegación
    if (sesion) {
        // Enlace adicional al panel de administración si el usuario es admin
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
            // Si el enlace a login estaba envuelto en un <li> (como en carrito o contacto)
            const liPadre = enlaceLogin.closest('li.nav-item');
            if (liPadre) {
                liPadre.innerHTML = bloqueSesionHTML;
                liPadre.classList.add('d-flex', 'align-items-center', 'gap-1');
            } else {
                // Si eran enlaces <a> directos
                const wrapper = document.createElement('div');
                wrapper.className = 'd-inline-flex align-items-center gap-1';
                wrapper.innerHTML = bloqueSesionHTML;
                enlaceLogin.replaceWith(wrapper);
            }
        }

        // Asignar el evento al botón de Salir
        const btnLogout = document.getElementById('btnCerrarSesion');
        if (btnLogout) {
            btnLogout.addEventListener('click', (e) => {
                e.preventDefault();
                cerrarSesion();
            });
        }
    }
});