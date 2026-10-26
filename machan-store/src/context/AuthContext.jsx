import { createContext, useState, useEffect, useContext } from 'react';
import { CLAVE_USUARIOS, CLAVE_SESION } from '../data/catalogo';
import { CartContext } from './CartContext';

export const AuthContext = createContext();

const USUARIO_ADMIN_INICIAL = [
  {
    id: 'usr_admin',
    nombre: 'Administrador Machan',
    email: 'admin@machanstore.cl',
    password: 'admin123',
    rol: 'admin'
  }
];

export const AuthProvider = ({ children }) => {
  const { mostrarNotificacion } = useContext(CartContext);

  const [usuarios, setUsuarios] = useState(() => {
    try {
      const guardados = JSON.parse(localStorage.getItem(CLAVE_USUARIOS));
      if (!guardados || guardados.length === 0) {
        localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(USUARIO_ADMIN_INICIAL));
        return USUARIO_ADMIN_INICIAL;
      }
      return guardados;
    } catch {
      return USUARIO_ADMIN_INICIAL;
    }
  });

  const [sesion, setSesion] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_SESION)) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
  }, [usuarios]);

  useEffect(() => {
    if (sesion) {
      localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    } else {
      localStorage.removeItem(CLAVE_SESION);
    }
  }, [sesion]);

  const login = (email, password) => {
    const usuarioEncontrado = usuarios.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (usuarioEncontrado) {
      setSesion(usuarioEncontrado);
      mostrarNotificacion(`¡Bienvenido de nuevo, ${usuarioEncontrado.nombre}!`, 'success');
      return { exito: true, usuario: usuarioEncontrado };
    } else {
      mostrarNotificacion('Credenciales incorrectas.', 'danger');
      return { exito: false, mensaje: 'Correo o contraseña incorrectos. Intenta nuevamente.' };
    }
  };

  const registrar = (nombre, email, password) => {
    if (usuarios.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      return { exito: false, mensaje: 'Este correo ya se encuentra registrado.' };
    }

    const nuevoUsuario = {
      id: 'usr_' + Date.now(),
      nombre: nombre.trim(),
      email: email.trim(),
      password,
      rol: 'cliente'
    };

    setUsuarios((prev) => [...prev, nuevoUsuario]);
    mostrarNotificacion('¡Cuenta creada con éxito!', 'success');
    return { exito: true };
  };

  const logout = () => {
    setSesion(null);
    mostrarNotificacion('Sesión cerrada correctamente.', 'info');
  };

  // Funciones exclusivas para el panel de Administración
  const crearUsuarioAdmin = ({ nombre, email, password, rol }) => {
    if (usuarios.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      return { exito: false, mensaje: 'Este correo electrónico ya se encuentra registrado.' };
    }
    if (password.length < 6) {
      return { exito: false, mensaje: 'La contraseña debe tener al menos 6 caracteres.' };
    }

    const nuevo = {
      id: 'usr_' + Date.now(),
      nombre: nombre.trim(),
      email: email.trim(),
      password,
      rol: rol || 'cliente'
    };

    setUsuarios((prev) => [...prev, nuevo]);
    return { exito: true, mensaje: `Usuario "${nuevo.nombre}" creado con éxito.` };
  };

  const editarUsuarioAdmin = ({ id, nombre, email, password, rol }) => {
    const correoEnUso = usuarios.some(
      (u) => u.id !== id && u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (correoEnUso) {
      return { exito: false, mensaje: 'Ese correo ya está registrado por otro usuario.' };
    }

    setUsuarios((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          return {
            ...u,
            nombre: nombre.trim(),
            email: email.trim(),
            rol,
            password: password && password.trim() !== '' ? password : u.password
          };
        }
        return u;
      })
    );

    if (sesion && sesion.id === id) {
      setSesion((prev) => ({
        ...prev,
        nombre: nombre.trim(),
        email: email.trim(),
        rol
      }));
    }

    return { exito: true, mensaje: `Usuario "${nombre}" modificado exitosamente.` };
  };

  const eliminarUsuarioAdmin = (id) => {
    const user = usuarios.find((u) => u.id === id);
    if (!user) return;
    if (sesion && sesion.id === id) {
      mostrarNotificacion('No puedes eliminar tu propia sesión activa.', 'danger');
      return;
    }
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
    mostrarNotificacion(`Usuario "${user.nombre}" eliminado correctamente.`, 'danger');
  };

  return (
    <AuthContext.Provider
      value={{
        usuarios,
        sesion,
        login,
        registrar,
        logout,
        crearUsuarioAdmin,
        editarUsuarioAdmin,
        eliminarUsuarioAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};