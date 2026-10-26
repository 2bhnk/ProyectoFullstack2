import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ProductCard } from './ProductCard';
import { CartProvider } from '../context/CartContext';

describe('Componente ProductCard', () => {
  const productoMock = {
    id: "machan-test",
    nombre: "Figura Aston Machan Prueba",
    precio: 50000,
    imagen: "/img.jpg"
  };

  it('debe renderizar el nombre del producto en pantalla', () => {
    render(
      <CartProvider>
        <BrowserRouter><ProductCard producto={productoMock} /></BrowserRouter>
      </CartProvider>
    );
    expect(screen.getByText('Figura Aston Machan Prueba')).toBeDefined();
  });

  it('debe contener un enlace que dirija a la vista de detalle del producto', () => {
    render(
      <CartProvider>
        <BrowserRouter><ProductCard producto={productoMock} /></BrowserRouter>
      </CartProvider>
    );
    // Buscamos el enlace (<a>)
    const enlace = screen.getByRole('link');
    expect(enlace).toBeDefined();
    expect(enlace.getAttribute('href')).toBe('/producto/machan-test');
  });

  it('debe contener la imagen del producto con su texto alternativo', () => {
    render(
      <CartProvider>
        <BrowserRouter><ProductCard producto={productoMock} /></BrowserRouter>
      </CartProvider>
    );
    const imagen = screen.getByRole('img');
    expect(imagen).toBeDefined();
    expect(imagen.getAttribute('alt')).toBe('Figura Aston Machan Prueba');
  });
  
});