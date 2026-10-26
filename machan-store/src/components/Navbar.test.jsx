import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { Navbar } from './Navbar';

describe('Componente Navbar', () => {
  const mockAuthContext = { sesion: null, logout: () => {} };
  const mockCartContext = { carrito: [{ cantidad: 2 }, { cantidad: 1 }] };

  it('debe mostrar la cantidad total exacta de productos en el badge', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <CartContext.Provider value={mockCartContext}>
          <BrowserRouter><Navbar /></BrowserRouter>
        </CartContext.Provider>
      </AuthContext.Provider>
    );
    expect(screen.getByText('3')).toBeDefined();
  });

  it('debe renderizar la marca o enlace principal de la tienda', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <CartContext.Provider value={mockCartContext}>
          <BrowserRouter><Navbar /></BrowserRouter>
        </CartContext.Provider>
      </AuthContext.Provider>
    );
    expect(screen.getByText(/MachanStore/i)).toBeDefined();
  });
});