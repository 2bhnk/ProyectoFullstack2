const CLAVE_INVENTARIO = 'machan_inventario';

const PRODUCTOS_BASE = [
  { id: "nendoroid-daiwa-scarlet", nombre: "Nendoroid Daiwa Scarlet", precio: 73990, stock: 8, imagen: "images/DaiwaNen.webp" },
  { id: "pop-up-parade-mihono-bourbon", nombre: "POP UP PARADE Mihono Bourbon", precio: 65990, stock: 5, imagen: "images/FiguraBourbon.webp" },
  { id: "pop-up-parade-daiwa-scarlet-l", nombre: "POP UP PARADE Daiwa Scarlet L", precio: 58990, stock: 6, imagen: "images/FiguraDaiwa.webp" },
  { id: "pop-up-parade-machan-costume", nombre: "Aston Machan Sugar Candy", precio: 142990, stock: 3, imagen: "images/FiguraMachanCostume.webp" },
  { id: "alter-tokai-teio-horizon", nombre: "ALTER Tokai Teio", precio: 217990, stock: 2, imagen: "images/FiguraTeioAlt.jpg" },
  { id: "pop-up-parade-fine-motion-l", nombre: "POP UP PARADE Fine Motion L", precio: 80990, stock: 4, imagen: "images/FigurFineMo.jpg" },
  { id: "phat-calstone-light-o", nombre: "Phat! Calstone Light O", precio: 230990, stock: 3, imagen: "images/FigutaCalstone.jpg" },
  { id: "nendoroid-silence-suzuka", nombre: "Nendoroid Silence Suzuka", precio: 63990, stock: 7, imagen: "images/SuzukaNen.jpg" }
];

const obtenerInventario = () => {
  const guardado = localStorage.getItem(CLAVE_INVENTARIO);
  if (!guardado) {
    localStorage.setItem(CLAVE_INVENTARIO, JSON.stringify(PRODUCTOS_BASE));
    return PRODUCTOS_BASE;
  }
  return JSON.parse(guardado);
};

const guardarInventario = (inventario) => {
  localStorage.setItem(CLAVE_INVENTARIO, JSON.stringify(inventario));
};

const obtenerStockProducto = (id) => {
  const inv = obtenerInventario();
  const prod = inv.find(p => p.id === id);
  return prod ? prod.stock : 0;
};

const actualizarStockEnBD = (id, nuevoStock) => {
  const inv = obtenerInventario();
  const prod = inv.find(p => p.id === id);
  if (prod) {
    prod.stock = Math.max(0, parseInt(nuevoStock, 10) || 0);
    guardarInventario(inv);
  }
};