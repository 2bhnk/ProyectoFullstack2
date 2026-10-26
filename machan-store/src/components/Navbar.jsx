import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

export const Navbar = () => {
  const { carrito } = useContext(CartContext);
  const { sesion, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark menu-morado">
        <div className="container">
          <Link className="navbar-brand titulo-principal m-0" to="/">
            ✮ ⋆ ˚｡ MachanStore ⋆｡°✩
          </Link>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#menu"
            aria-controls="menu"
            aria-expanded="false"
            aria-label="Abrir Menu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="menu">
            <div className="navbar-nav ms-auto align-items-center">
              <Link className="boton-menu" to="/">
                Inicio
              </Link>
              <Link className="boton-menu" to="/productos">
                Productos
              </Link>
              <Link className="boton-menu" to="/blog">
                Blog
              </Link>
              <Link className="boton-menu" to="/contacto">
                Contacto
              </Link>
              <Link className="boton-menu" to="/carrito">
                Carrito <span className="badge rounded-pill bg-danger ms-1">{cantidadTotal}</span>
              </Link>

              {sesion ? (
                <>
                  {sesion.rol === 'admin' && (
                    <Link className="boton-menu text-warning" to="/admin">
                      ⚙️ Admin
                    </Link>
                  )}
                  <span className="text-white small fw-semibold mx-2">
                    👤 {sesion.nombre.split(' ')[0]}
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn btn-sm btn-outline-light ms-1 fw-bold"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <Link className="boton-menu" to="/login">
                  Iniciar sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};