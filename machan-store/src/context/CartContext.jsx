import { createContext, useState, useEffect } from 'react';
import { CATALOGO_INICIAL, CLAVE_INVENTARIO, CLAVE_CARRITO, CLAVE_CUPON } from '../data/catalogo';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. Inventario sincronizado con localStorage
  const [inventario, setInventario] = useState(() => {
    try {
      const guardado = localStorage.getItem(CLAVE_INVENTARIO);
      if (guardado) {
        const parsed = JSON.parse(guardado);
        // Asegura que tenga todos los campos del catálogo detallado
        return CATALOGO_INICIAL.map(itemBase => {
          const encontrado = parsed.find(p => p.id === itemBase.id);
          return encontrado ? { ...itemBase, stock: encontrado.stock } : itemBase;
        });
      }
      localStorage.setItem(CLAVE_INVENTARIO, JSON.stringify(CATALOGO_INICIAL));
      return CATALOGO_INICIAL;
    } catch {
      return CATALOGO_INICIAL;
    }
  });

  // 2. Carrito sincronizado con localStorage
  const [carrito, setCarrito] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
    } catch {
      return [];
    }
  });

  // 3. Cupón activo
  const [cupon, setCupon] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_CUPON)) || null;
    } catch {
      return null;
    }
  });

  // 4. Notificación Toast integrada en React
  const [toast, setToast] = useState(null);

  const mostrarNotificacion = (mensaje, tipo = 'success') => {
    setToast({ mensaje, tipo, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  }, [carrito]);

  useEffect(() => {
    localStorage.setItem(CLAVE_INVENTARIO, JSON.stringify(inventario));
  }, [inventario]);

  useEffect(() => {
    if (cupon) {
      localStorage.setItem(CLAVE_CUPON, JSON.stringify(cupon));
    } else {
      localStorage.removeItem(CLAVE_CUPON);
    }
  }, [cupon]);

  const obtenerStockProducto = (id) => {
    const prod = inventario.find(p => p.id === id);
    return prod ? prod.stock : 0;
  };

  const agregarAlCarrito = (producto, cantidadElegida = 1) => {
    const stockDisponible = obtenerStockProducto(producto.id);

    if (stockDisponible <= 0) {
      mostrarNotificacion('Lo sentimos, este producto se encuentra agotado.', 'danger');
      return false;
    }

    const itemExistente = carrito.find(item => item.id === producto.id);
    const cantidadPrevia = itemExistente ? itemExistente.cantidad : 0;

    if (cantidadPrevia + cantidadElegida > stockDisponible) {
      mostrarNotificacion(
        `No puedes agregar más. Solo quedan ${stockDisponible} unidades disponibles (tienes ${cantidadPrevia} en el carrito).`,
        'danger'
      );
      return false;
    }

    setCarrito(prev => {
      if (itemExistente) {
        return prev.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidadElegida }
            : item
        );
      }
      return [...prev, {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: cantidadElegida
      }];
    });

    mostrarNotificacion(`"${producto.nombreCorto || producto.nombre}" añadido al carrito.`, 'success');
    return true;
  };

  const alterarCantidad = (id, incremento) => {
    const stockMaximo = obtenerStockProducto(id);
    const productoEnCarrito = carrito.find(item => item.id === id);

    if (!productoEnCarrito) return;

    if (incremento > 0 && productoEnCarrito.cantidad >= stockMaximo) {
      mostrarNotificacion(`Has alcanzado el límite máximo de existencias (${stockMaximo} unidades).`, 'danger');
      return;
    }

    setCarrito(prev =>
      prev
        .map(item => item.id === id ? { ...item, cantidad: item.cantidad + incremento } : item)
        .filter(item => item.cantidad > 0)
    );
  };

  const borrarArticulo = (id) => {
    setCarrito(prev => prev.filter(item => item.id !== id));
    mostrarNotificacion('Producto eliminado del carrito.', 'warning');
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    setCupon(null);
  };

  const aplicarCupon = (inputValor) => {
    const valor = inputValor.trim();
    if (carrito.length === 0) {
      return { exito: false, mensaje: 'Agrega productos al carrito antes de aplicar un descuento.' };
    }
    if (!valor) {
      return { exito: false, mensaje: 'Por favor ingresa un código o correo válido (ej: DUOC20).' };
    }

    const valorMayus = valor.toUpperCase();
    const regexDuocEmail = /^[^\s@]+@(duocuc\.cl|profesor\.duoc\.cl)$/i;

    if (valorMayus === 'DUOC20' || valorMayus === 'DUOCUC' || regexDuocEmail.test(valor)) {
      const nuevoCupon = {
        codigo: regexDuocEmail.test(valor) ? 'Convenio Duoc UC' : valorMayus,
        porcentaje: 0.20,
        descripcion: '20% Descuento Duoc UC'
      };
      setCupon(nuevoCupon);
      mostrarNotificacion('Cupón Duoc UC (20%) aplicado correctamente.', 'success');
      return { exito: true, mensaje: '¡Descuento institucional del 20% aplicado con éxito!' };
    } else if (valorMayus === 'PRIDE10' || valorMayus === 'PRIDE') {
      const nuevoCupon = {
        codigo: 'PRIDE10',
        porcentaje: 0.10,
        descripcion: '10% Descuento Equipo Pride'
      };
      setCupon(nuevoCupon);
      mostrarNotificacion('Cupón Pride (10%) aplicado correctamente.', 'success');
      return { exito: true, mensaje: '¡Cupón Pride aplicado! Disfrutas de un 10% de descuento.' };
    } else {
      mostrarNotificacion('Código de descuento no válido.', 'danger');
      return { exito: false, mensaje: 'Código o correo no válido. Prueba con DUOC20 o tu correo @duocuc.cl.' };
    }
  };

  const quitarCupon = () => {
    setCupon(null);
  };

  const procesarCompra = () => {
    if (carrito.length === 0) return false;

    setInventario(prevInv =>
      prevInv.map(prod => {
        const itemComprado = carrito.find(c => c.id === prod.id);
        if (itemComprado) {
          return { ...prod, stock: Math.max(0, prod.stock - itemComprado.cantidad) };
        }
        return prod;
      })
    );

    setCarrito([]);
    setCupon(null);
    mostrarNotificacion('¡Compra realizada con éxito!', 'success');
    return true;
  };

  // Funciones para el panel Admin
  const actualizarStockAdmin = (id, nuevoStock) => {
    const stockValido = Math.max(0, parseInt(nuevoStock, 10) || 0);
    setInventario(prev =>
      prev.map(p => p.id === id ? { ...p, stock: stockValido } : p)
    );
  };

  const restablecerInventario = () => {
    setInventario(CATALOGO_INICIAL);
    localStorage.setItem(CLAVE_INVENTARIO, JSON.stringify(CATALOGO_INICIAL));
  };

  return (
    <CartContext.Provider
      value={{
        inventario,
        carrito,
        cupon,
        obtenerStockProducto,
        agregarAlCarrito,
        alterarCantidad,
        borrarArticulo,
        vaciarCarrito,
        aplicarCupon,
        quitarCupon,
        procesarCompra,
        actualizarStockAdmin,
        restablecerInventario,
        mostrarNotificacion
      }}
    >
      {children}
      {/* Contenedor Global de Notificaciones Toast */}
      {toast && (
        <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 99999 }}>
          <div className="toast show align-items-center shadow-lg border-0 bg-white" role="alert">
            <div
              className="d-flex border-start border-4"
              style={{
                borderColor: toast.tipo === 'success' ? '#5b4b7a' : toast.tipo === 'danger' ? '#dc3545' : '#ffc107'
              }}
            >
              <div className="toast-body d-flex align-items-center gap-2">
                <span
                  className="badge rounded-circle text-white p-1 px-2"
                  style={{
                    backgroundColor: toast.tipo === 'success' ? '#5b4b7a' : toast.tipo === 'danger' ? '#dc3545' : '#ffc107'
                  }}
                >
                  {toast.tipo === 'success' ? '✓' : '!'}
                </span>
                <span className="fw-semibold text-dark small">{toast.mensaje}</span>
              </div>
              <button type="button" className="btn-close me-2 m-auto" onClick={() => setToast(null)}></button>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
};