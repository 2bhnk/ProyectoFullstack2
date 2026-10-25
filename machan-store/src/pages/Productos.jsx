import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';

export const Productos = () => {
  const { inventario } = useContext(CartContext);

  return (
    <main className="container my-5 text-center">
      <section id="productos">
        <h1 className="fw-bold mb-4">{"͙͘͡★ Nuestros productos ദ്ദി˙∇˙)ว"}</h1>
        <div className="row g-4 mt-2">
          {inventario.map((figura) => (
            <ProductCard key={figura.id} producto={figura} />
          ))}
        </div>
      </section>
    </main>
  );
};