import { ProductCard } from '../components/ProductCard';

export const Productos = () => {
  const figuras = [
    {
      id: "aston-machan-popup",
      imagen: "images/FiguraMachanCostume.webp",
      nombre: "Aston Machan (Umamusume)",
      precio: 142990
    },
    {
      id: "nakayama-festa-nendo",
      imagen: "images/RIPNakayamaFesta.webp", 
      nombre: "Nendoroid Nakayama Festa",
      precio: 65990
    },
    {
      id: "gold-ship-figma",
      imagen: "images/LogoMachan.png", 
      nombre: "Figma Gold Ship",
      precio: 89990
    }
  ];

  return (
    <main className="container my-5 text-center">
      <h2 className="mb-5 fw-bold">Catálogo de Figuras</h2>
      <div className="row g-4">
        {figuras.map((figura) => (
          <ProductCard 
            key={figura.id}
            id={figura.id}
            imagen={figura.imagen}
            nombre={figura.nombre}
            precio={figura.precio}
          />
        ))}
      </div>
    </main>
  );
};