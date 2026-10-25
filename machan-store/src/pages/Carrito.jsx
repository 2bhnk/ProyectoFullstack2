import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

export const Carrito = () => {
  const {
    carrito,
    cupon,
    obtenerStockProducto,
    alterarCantidad,
    borrarArticulo,
    vaciarCarrito,
    aplicarCupon,
    quitarCupon,
    procesarCompra
  } = useContext(CartContext);

  const [inputCupon, setInputCupon] = useState('');
  const [feedbackCupon, setFeedbackCupon] = useState(null);
  const [compraExitosa, setCompraExitosa] = useState(false);

  const formatearCLP = (valor) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(valor);

  const subtotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const montoDescuento = cupon ? Math.round(subtotal * cupon.porcentaje) : 0;
  const totalFinal = Math.max(0, subtotal - montoDescuento);

  const handleAplicarCupon = (e) => {
    e.preventDefault();
    const resultado = aplicarCupon(inputCupon);
    setFeedbackCupon(resultado);
    if (resultado.exito) setInputCupon('');
  };

  const handleFinalizarCompra = () => {
    const ok = procesarCompra();
    if (ok) {
      setCompraExitosa(true);
      setFeedbackCupon(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <main className="container my-5 flex-grow-1">
      <section id="seccion-carrito">
        <h2 className="mb-4 fw-bold">🛒 Tu Carrito de Compras</h2>

        {compraExitosa && (
          <div className="alert alert-success mb-4 text-center fw-semibold" role="alert">
            🎉 ¡Gracias por tu compra! Tu pedido fue procesado exitosamente y el stock ha sido descontado del inventario.
          </div>
        )}

        <div className="table-responsive shadow-sm rounded mb-4 bg-white border">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col" style={{ minWidth: '280px' }}>Producto</th>
                <th scope="col" className="text-center">Precio</th>
                <th scope="col" className="text-center" style={{ minWidth: '140px' }}>Cantidad</th>
                <th scope="col" className="text-center">Subtotal</th>
                <th scope="col" className="text-center">Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {carrito.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    <p className="fs-5 mb-2">Tu carrito está vacío.</p>
                    <Link to="/productos" className="btn btn-sm text-white" style={{ backgroundColor: '#5b4b7a' }}>
                      Explorar figuras
                    </Link>
                  </td>
                </tr>
              ) : (
                carrito.map((prod) => {
                  const stockActual = obtenerStockProducto(prod.id);
                  return (
                    <tr key={prod.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={prod.imagen}
                            alt={prod.nombre}
                            className="img-carrito-figura me-3 rounded border p-1"
                          />
                          <div>
                            <span className="fw-semibold d-block">{prod.nombre}</span>
                            <small className="text-muted">Stock disponible: {stockActual}</small>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">{formatearCLP(prod.precio)}</td>
                      <td className="text-center">
                        <div className="btn-group border rounded" role="group">
                          <button
                            type="button"
                            className="btn btn-light btn-sm px-2"
                            onClick={() => alterarCantidad(prod.id, -1)}
                          >
                            −
                          </button>
                          <span className="px-3 py-1 fw-bold bg-white">{prod.cantidad}</span>
                          <button
                            type="button"
                            className="btn btn-light btn-sm px-2"
                            onClick={() => alterarCantidad(prod.id, 1)}
                            disabled={prod.cantidad >= stockActual}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="text-center fw-bold">{formatearCLP(prod.precio * prod.cantidad)}</td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => borrarArticulo(prod.id)}
                          title="Eliminar figura"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Sección de Descuento y Resumen de Totales */}
        <div className="row g-4">
          <div className="col-12 col-lg-6">
            <div className="bg-white p-4 rounded border shadow-sm mb-3">
              <label htmlFor="input-cupon" className="form-label fw-bold">
                ¿Tienes un código o correo de descuento?
              </label>
              <p className="small text-muted mb-2">
                Aplica tu cupón <strong>DUOC20</strong> o tu correo institucional (<strong>@duocuc.cl</strong>) para 20% de rebaja.
              </p>
              <form onSubmit={handleAplicarCupon} className="input-group">
                <input
                  type="text"
                  id="input-cupon"
                  className="form-control"
                  placeholder="Ej: DUOC20 o alumno@duocuc.cl"
                  value={inputCupon}
                  onChange={(e) => setInputCupon(e.target.value)}
                  disabled={carrito.length === 0}
                />
                <button
                  type="submit"
                  className="btn text-white"
                  style={{ backgroundColor: '#5b4b7a', width: 'auto' }}
                  disabled={carrito.length === 0}
                >
                  Aplicar
                </button>
              </form>
              {feedbackCupon && (
                <div className={`small mt-2 fw-semibold ${feedbackCupon.exito ? 'text-success' : 'text-danger'}`}>
                  {feedbackCupon.mensaje}
                </div>
              )}
            </div>

            <div className="d-flex gap-2">
              <Link to="/productos" className="btn btn-outline-secondary">
                ← Seguir Comprando
              </Link>
              <button
                className="btn btn-outline-danger"
                onClick={vaciarCarrito}
                disabled={carrito.length === 0}
              >
                Vaciar Carrito
              </button>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="bg-white p-4 rounded border shadow-sm">
              <h5 className="mb-3 fw-bold">Resumen de tu Pedido</h5>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal:</span>
                <span className="fw-semibold">{formatearCLP(subtotal)}</span>
              </div>

              {cupon && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Descuento aplicado ({cupon.codigo} -{cupon.porcentaje * 100}%):</span>
                  <div>
                    <span className="fw-bold">-{formatearCLP(montoDescuento)}</span>
                    <button
                      type="button"
                      onClick={quitarCupon}
                      className="btn btn-sm text-danger p-0 ms-2 text-decoration-underline border-0 bg-transparent"
                    >
                      (Quitar)
                    </button>
                  </div>
                </div>
              )}

              <hr className="my-2" />

              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fs-5 fw-bold">Total Final:</span>
                <span className="fs-4 fw-bold text-success">{formatearCLP(totalFinal)}</span>
              </div>

              <button
                className="btn btn-primary w-100 py-2 fw-bold"
                style={{ backgroundColor: '#5b4b7a', border: 'none' }}
                disabled={carrito.length === 0}
                onClick={handleFinalizarCompra}
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};