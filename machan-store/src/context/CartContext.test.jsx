import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useContext } from 'react';
import { CartContext, CartProvider } from './CartContext';

vi.mock('../data/catalogo', () => ({
  CATALOGO_INICIAL: [{ id: 'mock-1', nombre: 'Test', precio: 1000, stock: 10 }],
  CLAVE_INVENTARIO: 'inv_test',
  CLAVE_CARRITO: 'cart_test',
  CLAVE_CUPON: 'cupon_test'
}));

const ComponentePrueba = () => {
  const { carrito, agregarAlCarrito, aplicarCupon, cupon } = useContext(CartContext);
  return (
    <div>
      <span data-testid="contador-carrito">{carrito.length}</span>
      <span data-testid="estado-cupon">{cupon ? 'activo' : 'inactivo'}</span>
      <button onClick={() => agregarAlCarrito({ id: 'mock-1', nombre: 'Test', precio: 1000 }, 1)}>Normal</button>
      <button onClick={() => agregarAlCarrito({ id: 'mock-1', nombre: 'Test', precio: 1000 }, 99)}>Exceso</button>
      <button onClick={() => aplicarCupon('CUPON_FALSO')}>Malo</button>
    </div>
  );
};

describe('Lógica de CartContext', () => {
  it('debe agregar un nuevo producto pasando la validación de stock', async () => {
    localStorage.clear();
    render(<CartProvider><ComponentePrueba /></CartProvider>);
    fireEvent.click(screen.getByText('Normal'));
    await waitFor(() => expect(screen.getByTestId('contador-carrito').textContent).toBe('1'));
  });

  it('debe bloquear la adición si se supera el stock disponible', async () => {
    localStorage.clear();
    render(<CartProvider><ComponentePrueba /></CartProvider>);
    fireEvent.click(screen.getByText('Exceso'));
    await waitFor(() => expect(screen.getByTestId('contador-carrito').textContent).toBe('0'));
  });

  it('debe rechazar la aplicación de un cupón inválido', async () => {
    localStorage.clear();
    render(<CartProvider><ComponentePrueba /></CartProvider>);
    fireEvent.click(screen.getByText('Malo'));
    await waitFor(() => expect(screen.getByTestId('estado-cupon').textContent).toBe('inactivo'));
  });
});