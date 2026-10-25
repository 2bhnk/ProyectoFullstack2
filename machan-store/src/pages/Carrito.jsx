import { Link } from 'react-router-dom';

export const Carrito = () => {
  // Datos simulados (mock) para visualizar el carrito antes de conectarlo a un estado global
  const productosCarrito = [
    {
      id: "aston-machan-popup",
      nombre: "Aston Machan (Umamusume)",
      precio: 142990,
      cantidad: 1,
      imagen: "/images/FiguraMachanCostume.webp"
    },
    {
      id: "nakayama-festa-nendo",
      nombre: "Nendoroid Nakayama Festa",
      precio: 65990,
      cantidad: 2,
      imagen: "/images/RIPNakayamaFesta.webp"
    }
  ];

  const total = productosCarrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  return (
    <main className="container my-5">
      <h1 className="fw-bold mb-4">Tu Carrito de Compras 🛒</h1>
      
      <div className="row">
        {/* Columna Izquierda: Lista de productos */}
        <div className="col-lg-8 mb-4">
          {productosCarrito.map((item) => (
            <div key={item.id} className="card mb-3 shadow-sm border-0 rounded-4">
              <div className="row g-0 align-items-center p-3">
                <div className="col-md-2 text-center">
                  <img 
                    src={item.imagen} 
                    alt={item.nombre} 
                    className="img-fluid rounded" 
                    style={{ maxHeight: '100px', objectFit: 'contain' }} 
                  />
                </div>
                <div className="col-md-5">
                  <div className="card-body py-0">
                    <h5 className="card-title fw-bold mb-1">{item.nombre}</h5>
                    <p className="card-text text-muted small mb-0">SKU: {item.id}</p>
                  </div>
                </div>
                <div className="col-md-3 text-center my-3 my-md-0">
                  <div className="d-flex justify-content-center align-items-center">
                    <button className="btn btn-sm btn-outline-secondary px-2">-</button>
                    <span className="mx-3 fw-bold">{item.cantidad}</span>
                    <button className="btn btn-sm btn-outline-secondary px-2">+</button>
                  </div>
                </div>
                <div className="col-md-2 text-end">
                  <p className="fw-bold mb-0 fs-5" style={{ color: '#5b4b7a' }}>
                    ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Columna Derecha: Resumen de compra */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 rounded-4 p-4 bg-light">
            <h4 className="fw-bold mb-4">Resumen</h4>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Subtotal</span>
              <span className="fw-bold">${total.toLocaleString('es-CL')}</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Envío</span>
              <span className="text-success fw-bold">¡Gratis!</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between mb-4">
              <span className="fw-bold fs-5">Total</span>
              <span className="fw-bold fs-4" style={{ color: '#5b4b7a' }}>
                ${total.toLocaleString('es-CL')}
              </span>
            </div>
            <button className="btn text-white w-100 fw-bold py-2 mb-3 shadow-sm" style={{ backgroundColor: '#5b4b7a' }}>
              Ir a Pagar
            </button>
            <Link to="/productos" className="btn btn-outline-secondary w-100 py-2">
              Seguir Comprando
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};