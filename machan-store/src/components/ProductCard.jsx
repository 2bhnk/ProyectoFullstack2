import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';

export const ProductCard = ({ producto }) => {
  const { agregarAlCarrito } = useContext(CartContext);
  const [agregando, setAgregando] = useState(false);

  const precioFormateado = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(producto.precio);

  const handleAgregar = () => {
    const exito = agregarAlCarrito(producto, 1);
    if (exito) {
      setAgregando(true);
      setTimeout(() => setAgregando(false), 800);
    }
  };

  const sinStock = producto.stock <= 0;

  return (
    <div className="col-12 col-md-6 col-lg-3">
      <article className="tarjeta-producto d-flex flex-column justify-content-between">
        <Link to={`/producto/${producto.id}`} className="text-decoration-none text-dark">
          <img src={producto.imagen} alt={producto.nombre} height="200" />
          <h3 className="tarjeta-titulo">{producto.nombre}</h3>
        </Link>
        <div>
          <p className="tarjeta-precio mb-2">{precioFormateado}</p>
          <button
            className={`btn w-100 fw-bold text-white ${agregando ? 'opacity-75' : ''}`}
            style={{ backgroundColor: sinStock ? '#6c757d' : '#5b4b7a', border: 'none' }}
            onClick={handleAgregar}
            disabled={sinStock || agregando}
          >
            {sinStock ? 'Agotado' : agregando ? '¡Añadido! ✓' : 'Añadir'}
          </button>
        </div>
      </article>
    </div>
  );
};