const KEY_USUARIOS = 'machan_usuarios';
const KEY_SESION = 'machan_sesion_activa';

// --- INICIALIZACIÓN DE USUARIO ADMINISTRADOR POR DEFECTO ---
const inicializarUsuarios = () => {
    let usuarios = JSON.parse(localStorage.getItem(KEY_USUARIOS));
    if (!usuarios || usuarios.length === 0) {
        usuarios = [
            {
                id: 'usr_admin',
                nombre: 'Administrador Machan',
                email: 'admin@machanstore.cl',
                password: 'admin123',
                rol: 'admin' // Rol para redirigir a adminVista
            }
        ];
        localStorage.setItem(KEY_USUARIOS, JSON.stringify(usuarios));
    }
};

// Utilidades para mostrar/limpiar errores (siguiendo la pauta IE1.2.1)
const mostrarError = (input, elementoError, texto) => {
    if (elementoError) {
        elementoError.textContent = texto;
        elementoError.style.display = 'block';
    }
    if (input) input.classList.add('is-invalid');
};

const limpiarError = (input, elementoError) => {
    if (elementoError) {
        elementoError.textContent = '';
        elementoError.style.display = 'none';
    }
    if (input) input.classList.remove('is-invalid');
};

document.addEventListener('DOMContentLoaded', () => {
    inicializarUsuarios();

    // ==========================================
    // LÓGICA DE REGISTRO (registro.html)
    // ==========================================
    const formRegistro = document.getElementById('formRegistro');
    if (formRegistro) {
        const nombre = document.getElementById('regNombre');
        const email = document.getElementById('regEmail');
        const pass = document.getElementById('regPassword');
        const pass2 = document.getElementById('regPassword2');
        const exito = document.getElementById('mensajeExitoRegistro');

        const errNombre = document.getElementById('errorRegNombre');
        const errEmail = document.getElementById('errorRegEmail');
        const errPass = document.getElementById('errorRegPassword');
        const errPass2 = document.getElementById('errorRegPassword2');

        const validarNombre = () => {
            if (nombre.value.trim().length < 3) {
                mostrarError(nombre, errNombre, 'El nombre debe tener al menos 3 caracteres.');
                return false;
            }
            limpiarError(nombre, errNombre);
            return true;
        };

        const validarEmail = () => {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!regex.test(email.value.trim())) {
                mostrarError(email, errEmail, 'Ingresa un correo electrónico válido.');
                return false;
            }
            // Verificar si el correo ya existe
            const usuarios = JSON.parse(localStorage.getItem(KEY_USUARIOS)) || [];
            if (usuarios.some(u => u.email.toLowerCase() === email.value.trim().toLowerCase())) {
                mostrarError(email, errEmail, 'Este correo ya se encuentra registrado.');
                return false;
            }
            limpiarError(email, errEmail);
            return true;
        };

        const validarPass = () => {
            if (pass.value.length < 6) {
                mostrarError(pass, errPass, 'La contraseña debe tener mínimo 6 caracteres.');
                return false;
            }
            limpiarError(pass, errPass);
            return true;
        };

        const validarPass2 = () => {
            if (pass2.value !== pass.value || pass2.value === '') {
                mostrarError(pass2, errPass2, 'Las contraseñas no coinciden.');
                return false;
            }
            limpiarError(pass2, errPass2);
            return true;
        };

        // Eventos en tiempo real
        nombre.addEventListener('blur', validarNombre);
        email.addEventListener('blur', validarEmail);
        pass.addEventListener('input', validarPass);
        pass2.addEventListener('input', validarPass2);

        formRegistro.addEventListener('submit', (e) => {
            e.preventDefault();

            const v1 = validarNombre();
            const v2 = validarEmail();
            const v3 = validarPass();
            const v4 = validarPass2();

            if (v1 && v2 && v3 && v4) {
                const usuarios = JSON.parse(localStorage.getItem(KEY_USUARIOS)) || [];
                const nuevoUsuario = {
                    id: 'usr_' + Date.now(),
                    nombre: nombre.value.trim(),
                    email: email.value.trim(),
                    password: pass.value,
                    rol: 'cliente' // Nuevos registros son clientes normales
                };

                usuarios.push(nuevoUsuario);
                localStorage.setItem(KEY_USUARIOS, JSON.stringify(usuarios));

                exito.textContent = '¡Cuenta creada con éxito! Redirigiendo a Iniciar Sesión...';
                exito.style.display = 'block';
                formRegistro.reset();

                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1500);
            }
        });
    }

    // ==========================================
    // LÓGICA DE LOGIN (login.html)
    // ==========================================
    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        const email = document.getElementById('loginEmail');
        const pass = document.getElementById('loginPassword');
        const errEmail = document.getElementById('errorLoginEmail');
        const errPass = document.getElementById('errorLoginPassword');
        const errGlobal = document.getElementById('mensajeLoginGlobal');

        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            errGlobal.style.display = 'none';

            let valido = true;
            if (!email.value.trim()) {
                mostrarError(email, errEmail, 'Ingresa tu correo.');
                valido = false;
            } else {
                limpiarError(email, errEmail);
            }

            if (!pass.value) {
                mostrarError(pass, errPass, 'Ingresa tu contraseña.');
                valido = false;
            } else {
                limpiarError(pass, errPass);
            }

            if (!valido) return;

            const usuarios = JSON.parse(localStorage.getItem(KEY_USUARIOS)) || [];
            const usuarioEncontrado = usuarios.find(
                u => u.email.toLowerCase() === email.value.trim().toLowerCase() && u.password === pass.value
            );

            if (usuarioEncontrado) {
                // Guardar la sesión activa
                localStorage.setItem(KEY_SESION, JSON.stringify(usuarioEncontrado));

                // 🚀 REDIRECCIÓN SEGÚN ROL:
                if (usuarioEncontrado.rol === 'admin') {
                    // Si es administrador -> va a adminVista/admin.html
                    window.location.href = 'adminVista/admin.html';
                } else {
                    // Si es cliente regular -> va a la tienda (index.html)
                    window.location.href = 'index.html';
                }
            } else {
                errGlobal.textContent = 'Correo o contraseña incorrectos. Intenta nuevamente.';
                errGlobal.style.display = 'block';
            }
        });
    }
});