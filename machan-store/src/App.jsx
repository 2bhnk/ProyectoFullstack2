import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Blog } from './pages/Blog';
import { Productos } from './pages/Productos';
import { DetalleProducto } from './pages/DetalleProducto';
import { Carrito } from './pages/Carrito';
import { Contacto } from './pages/Contacto';
import { Login } from './pages/Login';
import { Registro } from './pages/Registro';
import { Admin } from './pages/Admin';
import './index.css';



function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="d-flex flex-column min-vh-100">
            <Navbar />
           <div className="flex-grow-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/productos" element={<Productos />} />
                <Route path="/producto/:id" element={<DetalleProducto />} />
                <Route path="/carrito" element={<Carrito />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;