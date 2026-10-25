import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useContext } from 'react';
import { CartContext, CartProvider } from './CartContext';

// Simulamos tu archivo de datos para asegurar que nuestro producto de prueba tenga stock
vi.mock('../data/catalogo', () => ({
  CATALOGO_INICIAL: [{ id: 'mock-1', nombre: 'Test', precio: 1000, stock: 10 }],
  CLAVE_INVENTARIO: 'inv_test',
  CLAVE_CARRITO: 'cart_test',
  CLAVE_CUPON: 'cupon_test'
}));

const ComponentePrueba = () => {
  const { carrito, agregarAlCarrito } = useContext(CartContext);
  return (
    <div>
      <span data-testid="contador-carrito">{carrito.length}</span>
      {/* Pasamos el mismo ID que mockeamos arriba para que pase la validación de stock */}
      <button onClick={() => agregarAlCarrito({ id: 'mock-1', nombre: 'Test', precio: 1000 }, 1)}>
        Agregar
      </button>
    </div>
  );
};

describe('Lógica de CartContext', () => {
  it('debe agregar un nuevo producto pasando la validación de stock', async () => {
    localStorage.clear(); // Limpiamos la caché del test

    render(
      <CartProvider>
        <ComponentePrueba />
      </CartProvider>
    );
    
    const boton = screen.getByText('Agregar');
    fireEvent.click(boton);
    
    // Esperamos a que React actualice el estado
    await waitFor(() => {
      expect(screen.getByTestId('contador-carrito').textContent).toBe('1');
    });
  });
});