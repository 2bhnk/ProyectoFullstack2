import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const Registro = () => {
  const { usuarios, registrar } = useContext(AuthContext);
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState('');

  const validarFormulario = () => {
    const nuevosErrores = {};
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (nombre.trim().length < 3) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 3 caracteres.';
    }

    if (!regexEmail.test(email.trim())) {
      nuevosErrores.email = 'Ingresa un correo electrónico válido.';
    } else if (usuarios.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      nuevosErrores.email = 'Este correo ya se encuentra registrado.';
    }

    if (password.length < 6) {
      nuevosErrores.password = 'La contraseña debe tener mínimo 6 caracteres.';
    }

    if (password2 !== password || password2 === '') {
      nuevosErrores.password2 = 'Las contraseñas no coinciden.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const resultado = registrar(nombre, email, password);
    if (resultado.exito) {
      setExito('¡Cuenta creada con éxito! Redirigiendo a Iniciar Sesión...');
      setNombre('');
      setEmail('');
      setPassword('');
      setPassword2('');
      setTimeout(() => {
        navigate('/login');
      }, 1400);
    } else {
      setErrores({ email: resultado.mensaje });
    }
  };

  return (
    <main className="container my-5" style={{ maxWidth: '520px' }}>
      <div className="bg-white p-4 rounded shadow-sm border">
        <h2 className="text-center mb-2 fw-bold">✨ Crear Cuenta ✨</h2>
        <p className="text-center text-muted small mb-4">
          Únete a MachanStore para gestionar tus pedidos y obtener descuentos.
        </p>

        <form id="formRegistro" onSubmit={handleSubmit} noValidate style={{ padding: 0, border: 'none', boxShadow: 'none' }}>
          <div className="mb-3">
            <label htmlFor="regNombre" className="form-label fw-bold">
              Nombre Completo:
            </label>
            <input
              type="text"
              id="regNombre"
              className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
              placeholder="Ej: Javier Tapia"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            {errores.nombre && <small className="text-danger small d-block mt-1">{errores.nombre}</small>}
          </div>

          <div className="mb-3">
            <label htmlFor="regEmail" className="form-label fw-bold">
              Correo Electrónico:
            </label>
            <input
              type="email"
              id="regEmail"
              className={`form-control ${errores.email ? 'is-invalid' : ''}`}
              placeholder="usuario@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errores.email && <small className="text-danger small d-block mt-1">{errores.email}</small>}
          </div>

          <div className="mb-3">
            <label htmlFor="regPassword" className="form-label fw-bold">
              Contraseña:
            </label>
            <input
              type="password"
              id="regPassword"
              className={`form-control ${errores.password ? 'is-invalid' : ''}`}
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errores.password && <small className="text-danger small d-block mt-1">{errores.password}</small>}
          </div>

          <div className="mb-3">
            <label htmlFor="regPassword2" className="form-label fw-bold">
              Confirmar Contraseña:
            </label>
            <input
              type="password"
              id="regPassword2"
              className={`form-control ${errores.password2 ? 'is-invalid' : ''}`}
              placeholder="Repite tu contraseña"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
            {errores.password2 && <small className="text-danger small d-block mt-1">{errores.password2}</small>}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 mt-2 fw-bold"
            style={{ backgroundColor: '#5b4b7a', border: 'none' }}
          >
            Registrarme
          </button>

          {exito && <div className="alert alert-success mt-3 text-center py-2 small">{exito}</div>}
        </form>

        <div className="text-center mt-3 small">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="fw-bold" style={{ color: '#5b4b7a' }}>
            Inicia sesión aquí
          </Link>
        </div>
      </div>
    </main>
  );
};