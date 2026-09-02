document.addEventListener('DOMContentLoaded', () => {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const agregarAlCarrito = (id, nombre, precio) => {
        const productoExistente = carrito.find(prod => prod.id === id);
        if (productoExistente) {
            productoExistente.cantidad++; 
        } else {
            carrito.push({ id, nombre, precio, cantidad: 1 });
        }
        localStorage.setItem('carrito', JSON.stringify(carrito));
        alert(`¡${nombre} agregado al carrito!`);
    };
    const botonesAgregar = document.querySelectorAll('.btn-agregar');
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const nombre = e.target.getAttribute('data-nombre');
            const precio = parseInt(e.target.getAttribute('data-precio'));

            agregarAlCarrito(id, nombre, precio);
        });
    });
});