import { Link } from 'react-router-dom';

export const ProductCard = ({ id, nombre, precio, imagen }) => {
  const precioFormateado = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(precio);

  return (
    <div className="col-12 col-md-6 col-lg-3">
      <article className="tarjeta-producto">
        <Link to={`/producto/${id}`} className="text-decoration-none text-dark">
          <img src={imagen} alt={`Figura ${nombre}`} height="200" />
          <h3 className="tarjeta-titulo">{nombre}</h3>
        </Link>
        <p className="tarjeta-precio">{precioFormateado}</p>
        <button 
          className="btn btn-primary btn-agregar"
          style={{ backgroundColor: '#5b4b7a', border: 'none' }}
        >
          Añadir
        </button>
      </article>
    </div>
  );
};