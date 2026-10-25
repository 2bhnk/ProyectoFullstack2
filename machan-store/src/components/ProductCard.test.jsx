import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import { CartProvider } from '../context/CartContext';

describe('Componente ProductCard', () => {
  it('debe renderizar el nombre del producto en pantalla', () => {
    // Agrupamos los datos en el formato exacto que espera tu componente
    const productoMock = {
      id: "machan-test",
      nombre: "Figura Aston Machan Prueba",
      precio: 50000,
      imagen: "/img.jpg"
    };

    render(
      <CartProvider>
        <BrowserRouter>
          <ProductCard producto={productoMock} />
        </BrowserRouter>
      </CartProvider>
    );
    
    // Verifica si el texto exacto se imprimió en el HTML
    expect(screen.getByText('Figura Aston Machan Prueba')).toBeDefined();
  });
});