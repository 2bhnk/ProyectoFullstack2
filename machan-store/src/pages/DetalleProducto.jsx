import { useParams, Link } from 'react-router-dom';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export const DetalleProducto = () => {
  const { id } = useParams(); 
  const { agregarAlCarrito } = useContext(CartContext);

  const producto = {
    id: id,
    nombre: "Good Smile Collection [Unforgettable Sugar Candy] Aston Machan (Umamusume: Pretty Derby)",
    precio: 142990,
    imagen: "/images/FiguraMachanCostume.webp", 
    descripcion: "'¡La dulce y esponjosa Machan, lista para apoyarte!'\n\nDel juego 'Umamusume: Pretty Derby' llega una figura de Aston Machan luciendo su atuendo del evento de San Valentín.\n\n¡Como su nombre sugiere, la figura ha sido esculpida para parecer hecha de dulces! La sonrisa tímida de Aston Machan y la pura alegría de pasar un San Valentín perfecto junto a su Entrenador han sido plasmadas cuidadosamente en esta figura.\n\n¡Asegúrate de añadirla a tu colección y disfrutad juntos de un momento dulce y maravilloso!\n\nProducto completo de plástico pintado a escala 1/7 con base incluida. Aproximadamente 230 mm de altura."
  };

  return (
    <main className="container my-5">
      <div className="row bg-white p-4 p-md-5 rounded-4 shadow-sm align-items-center">
        
        <div className="col-md-5 text-center mb-4 mb-md-0">
          <div className="p-4 bg-light rounded-4 border">
            <img 
              src={producto.imagen} 
              alt={producto.nombre} 
              className="img-fluid rounded drop-shadow" 
              style={{ maxHeight: '450px', objectFit: 'contain' }} 
            />
          </div>
        </div>
        
        <div className="col-md-7 d-flex flex-column justify-content-center text-start px-md-5">
          <span className="badge align-self-start mb-3 fs-6" style={{ backgroundColor: '#e2d5f8', color: '#5b4b7a' }}>
            {"(˶>⩊<˶)"} Nuevo Ingreso
          </span>
          
          <h1 className="fw-bold mb-3 fs-2" style={{ lineHeight: '1.2' }}>{producto.nombre}</h1>
          
          <h2 className="mb-4 display-6 fw-bold" style={{ color: '#5b4b7a' }}>
            ${producto.precio.toLocaleString('es-CL')}
          </h2>
          
          <p className="text-muted mb-4" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', fontSize: '1.05rem' }}>
            {producto.descripcion}
          </p>
          
          <div className="d-grid gap-3 d-md-flex mt-2">
            <button 
              className="btn text-white btn-lg fw-bold shadow-sm px-5" 
              style={{ backgroundColor: '#5b4b7a' }}
              onClick={() => agregarAlCarrito(producto)}
            >
              Añadir al Carrito 🛒
            </button>
            <Link to="/productos" className="btn btn-outline-secondary btn-lg px-4">
              Volver
            </Link>
          </div>
          
          <hr className="my-4" />
          <p className="text-muted small mb-0">SKU / ID Interno: <span className="fw-bold">{id}</span></p>
        </div>
      </div>
    </main>
  );
};