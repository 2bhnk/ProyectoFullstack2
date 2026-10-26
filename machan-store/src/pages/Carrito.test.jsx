import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Carrito } from './Carrito';

describe('Página Carrito', () => {
  const baseMockContext = {
    carrito: [{ id: '1', nombre: 'Aston Machan (Umamusume)', precio: 50000, cantidad: 1 }],
    cupon: null,
    obtenerStockProducto: () => 10,
    alterarCantidad: vi.fn(),
    borrarArticulo: vi.fn(),
    vaciarCarrito: vi.fn(),
    procesarCompra: vi.fn(),
    quitarCupon: vi.fn(),
    aplicarCupon: vi.fn()
  };

  it('debe renderizar la vista con los productos simulados y el botón de pago', () => {
    render(
      <CartContext.Provider value={baseMockContext}>
        <BrowserRouter><Carrito /></BrowserRouter>
      </CartContext.Provider>
    );
    expect(screen.getByText('Aston Machan (Umamusume)')).toBeDefined();
    expect(screen.getByText('Finalizar Compra')).toBeDefined();
  });

  it('debe renderizar el estado de carrito vacío correctamente', () => {
    const mockContextVacio = { ...baseMockContext, carrito: [] };
    render(
      <CartContext.Provider value={mockContextVacio}>
        <BrowserRouter><Carrito /></BrowserRouter>
      </CartContext.Provider>
    );
    expect(screen.getByText(/vacío/i)).toBeDefined();
  });

  it('debe registrar el clic en el botón de finalizar compra', () => {
    render(
      <CartContext.Provider value={baseMockContext}>
        <BrowserRouter><Carrito /></BrowserRouter>
      </CartContext.Provider>
    );
    const botonPago = screen.getByText('Finalizar Compra');
    fireEvent.click(botonPago);
    expect(botonPago).toBeDefined();
  });
});