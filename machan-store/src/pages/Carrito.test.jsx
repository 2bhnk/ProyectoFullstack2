import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Carrito } from './Carrito';

describe('Página Carrito', () => {
  it('debe renderizar la vista con los productos simulados y el botón de pago', () => {
    // Inyecta todas las variables y funciones que el Carrito extrae del contexto
    const mockContextValue = {
      carrito: [{ id: '1', nombre: 'Aston Machan (Umamusume)', precio: 50000, cantidad: 1 }],
      cupon: null,
      obtenerStockProducto: () => 10,
      alterarCantidad: () => {},
      borrarArticulo: () => {},
      vaciarCarrito: () => {},
      procesarCompra: () => {},
      quitarCupon: () => {},
      aplicarCupon: () => {}
    };

    render(
      <CartContext.Provider value={mockContextValue}>
        <BrowserRouter>
          <Carrito />
        </BrowserRouter>
      </CartContext.Provider>
    );
    
    // Verifica los textos exactos programados en el componente
    expect(screen.getByText('Aston Machan (Umamusume)')).toBeDefined();
    expect(screen.getByText('Finalizar Compra')).toBeDefined();
  });
});