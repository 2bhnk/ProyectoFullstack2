import { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

export const Admin = () => {
  const { inventario, actualizarStockAdmin, restablecerInventario, mostrarNotificacion } = useContext(CartContext);
  const { usuarios, sesion, crearUsuarioAdmin, editarUsuarioAdmin, eliminarUsuarioAdmin } = useContext(AuthContext);

  const [tabActiva, setTabActiva] = useState('inventario');
  const [stocksTemp, setStocksTemp] = useState({});
  const [alertaAdmin, setAlertaAdmin] = useState(null);

  // Estados para modales de Usuarios
  const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false);
  const [nuevoUser, setNuevoUser] = useState({ nombre: '', email: '', password: '', rol: 'cliente' });

  const [usuarioEditando, setUsuarioEditando] = useState(null);

  useEffect(() => {
    const inicial = {};
    inventario.forEach((p) => {
      inicial[p.id] = p.stock;
    });
    setStocksTemp(inicial);
  }, [inventario]);

  const lanzarAlertaLocal = (texto, tipo = 'success') => {
    setAlertaAdmin({ texto, tipo });
    mostrarNotificacion(texto, tipo);
    setTimeout(() => setAlertaAdmin(null), 3500);
  };

  const formatearPesos = (monto) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(monto);

  // Estadísticas Inventario
  const totalFiguras = inventario.length;
  const stockCritico = inventario.filter((p) => p.stock > 0 && p.stock <= 3).length;
  const agotados = inventario.filter((p) => p.stock <= 0).length;

  // Estadísticas Usuarios
  const totalUsuarios = usuarios.length;
  const totalAdmins = usuarios.filter((u) => u.rol === 'admin').length;
  const totalClientes = usuarios.filter((u) => u.rol !== 'admin').length;

  const handleGuardarStock = (prod) => {
    const valor = Math.max(0, parseInt(stocksTemp[prod.id], 10) || 0);
    actualizarStockAdmin(prod.id, valor);
    lanzarAlertaLocal(`✓ Stock de "${prod.nombreCorto || prod.nombre}" actualizado a ${valor} unidades.`, 'success');
  };

  const handleRestablecer = () => {
    restablecerInventario();
    lanzarAlertaLocal('Inventario restablecido a los valores por defecto.', 'info');
  };

  const handleSubmitNuevoUsuario = (e) => {
    e.preventDefault();
    const res = crearUsuarioAdmin(nuevoUser);
    if (!res.exito) {
      lanzarAlertaLocal(res.mensaje, 'danger');
      return;
    }
    setNuevoUser({ nombre: '', email: '', password: '', rol: 'cliente' });
    setMostrarModalNuevo(false);
    lanzarAlertaLocal(`✓ ${res.mensaje}`, 'success');
  };

  const handleSubmitEditarUsuario = (e) => {
    e.preventDefault();
    const res = editarUsuarioAdmin(usuarioEditando);
    if (!res.exito) {
      lanzarAlertaLocal(res.mensaje, 'danger');
      return;
    }
    setUsuarioEditando(null);
    lanzarAlertaLocal(`✓ ${res.mensaje}`, 'success');
  };

  return (
    <main className="container my-5 flex-grow-1">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h2 className="fw-bold mb-1">⚙️ Panel de Administración</h2>
          <p className="text-muted small mb-0">
            Sesión activa: <strong>{sesion ? sesion.nombre : 'Administrador'}</strong>
          </p>
        </div>

        {/* Pestañas de navegación */}
        <div className="d-flex gap-2" id="adminTabs">
          <button
            type="button"
            className={`btn fw-bold ${tabActiva === 'inventario' ? 'text-white' : 'btn-outline-secondary'}`}
            style={tabActiva === 'inventario' ? { backgroundColor: '#5b4b7a' } : {}}
            onClick={() => setTabActiva('inventario')}
          >
            📦 Inventario y Stock
          </button>
          <button
            type="button"
            className={`btn fw-bold ${tabActiva === 'usuarios' ? 'text-white' : 'btn-outline-secondary'}`}
            style={tabActiva === 'usuarios' ? { backgroundColor: '#5b4b7a' } : {}}
            onClick={() => setTabActiva('usuarios')}
          >
            👥 Gestión de Usuarios
          </button>
        </div>
      </div>

      {alertaAdmin && (
        <div className={`alert alert-${alertaAdmin.tipo} alert-dismissible fade show`} role="alert">
          <span>{alertaAdmin.texto}</span>
          <button type="button" className="btn-close" onClick={() => setAlertaAdmin(null)}></button>
        </div>
      )}

      {/* TAB 1: INVENTARIO Y STOCK */}
      {tabActiva === 'inventario' && (
        <section>
          <div className="row g-3 mb-4 text-center">
            <div className="col-12 col-md-4">
              <div className="bg-white p-3 rounded border shadow-sm">
                <span className="text-muted small d-block">Total Figuras en Catálogo</span>
                <span className="fs-3 fw-bold" style={{ color: '#5b4b7a' }}>{totalFiguras}</span>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="bg-white p-3 rounded border shadow-sm">
                <span className="text-muted small d-block">Stock Crítico (≤ 3 unidades)</span>
                <span className="fs-3 fw-bold text-warning">{stockCritico}</span>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="bg-white p-3 rounded border shadow-sm">
                <span className="text-muted small d-block">Productos Agotados</span>
                <span className="fs-3 fw-bold text-danger">{agotados}</span>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold m-0">Control de Existencias</h5>
            <button type="button" className="btn btn-sm btn-outline-danger fw-semibold" onClick={handleRestablecer}>
              🔄 Restablecer Inventario Base
            </button>
          </div>

          <div className="table-responsive bg-white rounded shadow-sm border">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Figura</th>
                  <th className="text-center">Precio</th>
                  <th className="text-center">Stock</th>
                  <th className="text-center">Estado</th>
                  <th className="text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {inventario.map((prod) => {
                  const esAgotado = prod.stock <= 0;
                  const esCritico = prod.stock > 0 && prod.stock <= 3;

                  return (
                    <tr key={prod.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={prod.imagen}
                            alt={prod.nombre}
                            style={{ width: '50px', height: '50px', objectFit: 'contain', backgroundColor: '#f8f9fa' }}
                            className="me-3 rounded border p-1"
                          />
                          <span className="fw-semibold">{prod.nombreCorto || prod.nombre}</span>
                        </div>
                      </td>
                      <td className="text-center">{formatearPesos(prod.precio)}</td>
                      <td className="text-center">
                        <div className="input-group input-group-sm mx-auto" style={{ maxWidth: '110px' }}>
                          <input
                            type="number"
                            min="0"
                            className="form-control text-center fw-bold"
                            value={stocksTemp[prod.id] ?? prod.stock}
                            onChange={(e) =>
                              setStocksTemp((prev) => ({ ...prev, [prod.id]: e.target.value }))
                            }
                          />
                        </div>
                      </td>
                      <td className="text-center">
                        {esAgotado ? (
                          <span className="badge bg-danger">Agotado</span>
                        ) : esCritico ? (
                          <span className="badge bg-warning text-dark">Stock Bajo</span>
                        ) : (
                          <span className="badge bg-success">Disponible</span>
                        )}
                      </td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-sm text-white fw-semibold"
                          style={{ backgroundColor: '#5b4b7a' }}
                          onClick={() => handleGuardarStock(prod)}
                        >
                          Guardar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 2: GESTIÓN DE USUARIOS */}
      {tabActiva === 'usuarios' && (
        <section>
          <div className="row g-3 mb-4 text-center">
            <div className="col-12 col-md-4">
              <div className="bg-white p-3 rounded border shadow-sm">
                <span className="text-muted small d-block">Total Usuarios</span>
                <span className="fs-3 fw-bold" style={{ color: '#5b4b7a' }}>{totalUsuarios}</span>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="bg-white p-3 rounded border shadow-sm">
                <span className="text-muted small d-block">Administradores</span>
                <span className="fs-3 fw-bold text-primary">{totalAdmins}</span>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="bg-white p-3 rounded border shadow-sm">
                <span className="text-muted small d-block">Clientes</span>
                <span className="fs-3 fw-bold text-secondary">{totalClientes}</span>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold m-0">Usuarios Registrados</h5>
            <button
              type="button"
              className="btn btn-sm text-white fw-bold"
              style={{ backgroundColor: '#5b4b7a' }}
              onClick={() => setMostrarModalNuevo(true)}
            >
              + Nuevo Usuario
            </button>
          </div>

          <div className="table-responsive bg-white rounded shadow-sm border">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th className="text-center">Rol</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">
                      No hay usuarios registrados.
                    </td>
                  </tr>
                ) : (
                  usuarios.map((user) => {
                    const esAdmin = user.rol === 'admin';
                    const esSesionPropia =
                      sesion?.email && sesion.email.toLowerCase() === user.email.toLowerCase();

                    return (
                      <tr key={user.id}>
                        <td>
                          <div className="fw-semibold">{user.nombre}</div>
                          {esSesionPropia && <small className="text-primary fw-bold">(Tú)</small>}
                        </td>
                        <td>
                          <code>{user.email}</code>
                        </td>
                        <td className="text-center">
                          <span className={`badge ${esAdmin ? 'bg-primary' : 'bg-secondary'}`}>
                            {esAdmin ? '🛡️ Administrador' : '👤 Cliente'}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => setUsuarioEditando({ ...user, password: '' })}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            disabled={esSesionPropia}
                            title={esSesionPropia ? 'No puedes eliminar tu cuenta activa' : ''}
                            onClick={() => eliminarUsuarioAdmin(user.id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* MODAL CREAR NUEVO USUARIO */}
      {mostrarModalNuevo && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Crear Nuevo Usuario</h5>
                <button type="button" className="btn-close" onClick={() => setMostrarModalNuevo(false)}></button>
              </div>
              <form onSubmit={handleSubmitNuevoUsuario}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Nombre Completo</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={nuevoUser.nombre}
                      onChange={(e) => setNuevoUser({ ...nuevoUser, nombre: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Correo Electrónico</label>
                    <input
                      type="email"
                      className="form-control"
                      required
                      value={nuevoUser.email}
                      onChange={(e) => setNuevoUser({ ...nuevoUser, email: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Contraseña (mín. 6 caracteres)</label>
                    <input
                      type="password"
                      className="form-control"
                      required
                      value={nuevoUser.password}
                      onChange={(e) => setNuevoUser({ ...nuevoUser, password: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Rol</label>
                    <select
                      className="form-select"
                      value={nuevoUser.rol}
                      onChange={(e) => setNuevoUser({ ...nuevoUser, rol: e.target.value })}
                    >
                      <option value="cliente">Cliente</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setMostrarModalNuevo(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn text-white fw-bold" style={{ backgroundColor: '#5b4b7a' }}>
                    Crear Usuario
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDITAR USUARIO */}
      {usuarioEditando && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Editar Usuario</h5>
                <button type="button" className="btn-close" onClick={() => setUsuarioEditando(null)}></button>
              </div>
              <form onSubmit={handleSubmitEditarUsuario}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Nombre Completo</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={usuarioEditando.nombre}
                      onChange={(e) => setUsuarioEditando({ ...usuarioEditando, nombre: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Correo Electrónico</label>
                    <input
                      type="email"
                      className="form-control"
                      required
                      value={usuarioEditando.email}
                      onChange={(e) => setUsuarioEditando({ ...usuarioEditando, email: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Nueva Contraseña (opcional)</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Dejar en blanco para mantener la actual"
                      value={usuarioEditando.password}
                      onChange={(e) => setUsuarioEditando({ ...usuarioEditando, password: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Rol</label>
                    <select
                      className="form-select"
                      value={usuarioEditando.rol}
                      onChange={(e) => setUsuarioEditando({ ...usuarioEditando, rol: e.target.value })}
                    >
                      <option value="cliente">Cliente</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setUsuarioEditando(null)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn text-white fw-bold" style={{ backgroundColor: '#5b4b7a' }}>
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};