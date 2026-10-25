import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext'; // Importamos tu contexto de sesión
import { Navbar } from './Navbar';

describe('Componente Navbar', () => {
  it('debe mostrar la cantidad total exacta de productos en el badge', () => {
    const mockCartContext = { 
      carrito: [{ cantidad: 2 }, { cantidad: 1 }] 
    };
    
    // Simulamos un estado de sesión básico para que el Navbar no falle
    const mockAuthContext = {
      sesion: null, 
      logout: () => {}
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <CartContext.Provider value={mockCartContext}>
          <BrowserRouter>
            <Navbar />
          </BrowserRouter>
        </CartContext.Provider>
      </AuthContext.Provider>
    );

    // Busca el número 3 dentro del HTML del componente
    expect(screen.getByText('3')).toBeDefined();
  });
});