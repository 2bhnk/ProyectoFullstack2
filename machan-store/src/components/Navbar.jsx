import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export const Navbar = () => {
  const { carrito } = useContext(CartContext);

  // Suma la cantidad total de artículos en el carrito
  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark px-4" style={{ backgroundColor: '#2f2738' }}>
      <div className="container-fluid">
        <Link className="navbar-brand fs-4" to="/">
          ★·°≽ MachanStore ≼°·★
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center gap-3">
            <li className="nav-item">
              <Link className="nav-link" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/productos">Productos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/blog">Blog</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link btn btn-outline-light px-3 py-1 text-white" to="/carrito">
                Carrito <span className="badge bg-danger ms-1">{cantidadTotal}</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};