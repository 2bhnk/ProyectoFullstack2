import { useParams, Link } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';

export const DetalleProducto = () => {
  const { id } = useParams();
  const { inventario, agregarAlCarrito } = useContext(CartContext);

  // Buscar el producto en el inventario según el parámetro :id de la URL
  const producto = inventario.find((p) => p.id === id) || inventario[0];
  const stockReal = producto ? producto.stock : 0;

  const [cantidad, setCantidad] = useState(1);
  const [agregando, setAgregando] = useState(false);

  // Reiniciar cantidad, subir el scroll y cambiar el título de la pestaña al cambiar de producto
  useEffect(() => {
    if (producto) {
      document.title = `${producto.nombre} - MachanStore`;
      setCantidad(producto.stock > 0 ? 1 : 0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id, producto]);

  if (!producto) {
    return (
      <main className="container my-5 text-center">
        <h2>Producto no encontrado</h2>
        <Link to="/productos" className="btn btn-primary mt-3" style={{ backgroundColor: '#5b4b7a', border: 'none' }}>
          Volver al catálogo
        </Link>
      </main>
    );
  }

  const formatearCLP = (monto) =>
    new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(monto);

  const handleCantidadChange = (e) => {
    const valor = parseInt(e.target.value, 10);
    if (isNaN(valor) || valor < 1) {
      setCantidad(1);
    } else if (valor > stockReal) {
      setCantidad(stockReal);
    } else {
      setCantidad(valor);
    }
  };

  const handleAgregar = () => {
    if (stockReal <= 0) return;
    const cantElegida = Math.max(1, Math.min(cantidad, stockReal));
    const exito = agregarAlCarrito(producto, cantElegida);

    if (exito) {
      setAgregando(true);
      setTimeout(() => setAgregando(false), 900);
    }
  };

  // Filtrar hasta 4 productos relacionados distintos al actual
  const relacionados = inventario.filter((p) => p.id !== producto.id).slice(0, 4);

  return (
    <main className="container my-5 flex-grow-1">
 {/* Migas de Pan (Breadcrumb) */}
      <div className="mb-4 py-3 px-3 px-md-5" style={{ backgroundColor: '#2f2738' }}>
        <div className="container px-0">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb breadcrumb-claro mb-0" style={{ '--bs-breadcrumb-divider-color': '#ffffff' }}>
              <li className="breadcrumb-item">
                <Link to="/" className="text-decoration-none fw-semibold">
                  Inicio
                </Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/productos" className="text-decoration-none fw-semibold">
                  Productos
                </Link>
              </li>
              <li className="breadcrumb-item active fw-bold" aria-current="page">
                {producto.nombreCorto || producto.nombre}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Tarjeta de Detalle del Producto */}
      <div className="card shadow-sm border-0 p-4 mb-5" id="detalle-producto">
        <div className="row g-4">
          {/* Columna Izquierda: Galería e Imagen Principal */}
          <div className="col-12 col-md-6 text-center">
            <div
              className="bg-white p-3 border rounded mb-3 d-flex align-items-center justify-content-center"
              style={{ minHeight: '420px' }}
            >
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="img-fluid"
                style={{ maxHeight: '390px', objectFit: 'contain' }}
              />
            </div>
            {/* Miniaturas */}
            <div className="d-flex gap-2 justify-content-center">
              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className="border rounded p-1 bg-white"
                  style={{ width: '70px', height: '70px', cursor: 'pointer' }}
                >
                  <img
                    src={producto.imagen}
                    alt={`${producto.nombre} vista ${num}`}
                    className="img-fluid w-100 h-100"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Columna Derecha: Información y Acciones */}
          <div className="col-12 col-md-6 d-flex flex-column text-start">
            <span className="badge bg-secondary mb-2 align-self-start">
              {producto.categoria || 'Figura de Colección'}
            </span>
            <h1 className="h2 fw-bold mb-2">{producto.nombre}</h1>

            <div className="mb-3">
              <span className="fs-2 fw-bold text-success">{formatearCLP(producto.precio)}</span>
            </div>

            <div className="mb-3">
              {stockReal <= 0 ? (
                <span className="badge bg-danger">Agotado</span>
              ) : (
                <span className={`badge ${stockReal <= 3 ? 'bg-warning text-dark' : 'bg-success'}`}>
                  En Stock ({stockReal} unidades disponibles)
                </span>
              )}
            </div>

            <p className="text-muted mb-4" id="detalle-descripcion" style={{ lineHeight: '1.6', whiteSpace: 'pre-line' }}>
              {producto.descripcion}
            </p>

            <div className="bg-light p-3 rounded mb-4 border">
              <ul className="list-unstyled mb-0 small">
                <li className="mb-1">
                  <strong>Fabricante / Distribuidor:</strong> <span>{producto.distribuidor || 'Good Smile Company'}</span>
                </li>
                <li className="mb-1">
                  <strong>Garantía:</strong> 3 meses por fallas de fábrica
                </li>
                <li>
                  <strong>Envío:</strong> Despacho a todo Chile por Starken y Correos
                </li>
              </ul>
            </div>

            {/* Selector de Cantidad y Botón de Añadir */}
            <div className="mt-auto">
              <div className="row g-2 align-items-end">
                <div className="col-4 col-sm-3">
                  <label htmlFor="cantidad-producto" className="form-label small fw-bold">
                    Cantidad:
                  </label>
                  <input
                    type="number"
                    id="cantidad-producto"
                    className="form-control text-center fw-bold"
                    value={cantidad}
                    min={stockReal > 0 ? 1 : 0}
                    max={stockReal}
                    onChange={handleCantidadChange}
                    disabled={stockReal <= 0}
                  />
                </div>
                <div className="col-8 col-sm-9">
                  <button
                    className={`btn w-100 py-2 fw-bold text-white ${agregando ? 'opacity-75' : ''}`}
                    style={{
                      backgroundColor: stockReal <= 0 ? '#6c757d' : '#5b4b7a',
                      border: 'none'
                    }}
                    onClick={handleAgregar}
                    disabled={stockReal <= 0 || agregando}
                  >
                    {stockReal <= 0
                      ? 'Sin Stock Disponible'
                      : agregando
                      ? `¡Añadido (${cantidad})! ✓`
                      : 'Añadir al Carrito'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección: Productos Relacionados */}
      <section className="mt-5">
        <h3 className="fw-bold mb-3">˚˖𓍢ִ໋❀ Figuras que te podrían interesar 𐔌՞ ܸ.ˬ.ܸ՞𐦯</h3>
        <div className="row g-3">
          {relacionados.map((rel) => (
            <div key={rel.id} className="col-6 col-md-3">
              <div className="card h-100 p-2 shadow-sm text-center border-0">
                <Link to={`/producto/${rel.id}`} className="text-decoration-none text-dark">
                  <img
                    src={rel.imagen}
                    alt={rel.nombre}
                    className="img-fluid mb-2 p-1"
                    style={{ height: '140px', objectFit: 'contain' }}
                  />
                  <h6 className="text-truncate fw-bold mb-1" title={rel.nombre}>
                    {rel.nombre}
                  </h6>
                  <p className="text-success fw-bold m-0">{formatearCLP(rel.precio)}</p>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};