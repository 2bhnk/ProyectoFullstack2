import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errores, setErrores] = useState({});
  const [errorGlobal, setErrorGlobal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorGlobal('');
    const nuevosErrores = {};

    if (!email.trim()) nuevosErrores.email = 'Ingresa tu correo.';
    if (!password) nuevosErrores.password = 'Ingresa tu contraseña.';

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setErrores({});
    const resultado = login(email, password);

    if (resultado.exito) {
      setTimeout(() => {
        if (resultado.usuario.rol === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }, 600);
    } else {
      setErrorGlobal(resultado.mensaje);
    }
  };

  return (
    <main className="container my-5" style={{ maxWidth: '440px' }}>
      <div className="bg-white p-4 rounded shadow-sm border">
        <h2 className="text-center mb-3 fw-bold">🔐 Iniciar Sesión</h2>

        <form id="formLogin" onSubmit={handleSubmit} noValidate style={{ padding: 0, border: 'none', boxShadow: 'none' }}>
          <div className="mb-3">
            <label htmlFor="loginEmail" className="form-label fw-bold">
              Correo Electrónico:
            </label>
            <input
              type="email"
              id="loginEmail"
              className={`form-control ${errores.email ? 'is-invalid' : ''}`}
              placeholder="tu@correo.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errores.email && <small className="text-danger small d-block mt-1">{errores.email}</small>}
          </div>

          <div className="mb-3">
            <label htmlFor="loginPassword" className="form-label fw-bold">
              Contraseña:
            </label>
            <input
              type="password"
              id="loginPassword"
              className={`form-control ${errores.password ? 'is-invalid' : ''}`}
              placeholder="••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errores.password && <small className="text-danger small d-block mt-1">{errores.password}</small>}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 mt-2 fw-bold"
            style={{ backgroundColor: '#5b4b7a', border: 'none' }}
          >
            Ingresar
          </button>

          {errorGlobal && (
            <div className="alert alert-danger mt-3 text-center py-2 small">{errorGlobal}</div>
          )}
        </form>

        <div className="alert alert-info mt-3 p-2 small mb-0">
          <strong>Cuenta Admin de prueba:</strong>
          <br />
          Correo: <code>admin@machanstore.cl</code>
          <br />
          Clave: <code>admin123</code>
        </div>

        <div className="text-center mt-3 small">
          ¿No tienes una cuenta?{' '}
          <Link to="/registro" className="fw-bold" style={{ color: '#5b4b7a' }}>
            Regístrate aquí
          </Link>
        </div>
      </div>
    </main>
  );
};