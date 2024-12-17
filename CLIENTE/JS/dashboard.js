// JSON de la tienda cargado desde Local Storage
const tiendaJSON = localStorage.getItem('tienda');

if (tiendaJSON) {
    const tiendaObj = JSON.parse(tiendaJSON);
    const destacadosContainer = document.getElementById('destacados-container');

    // Verificar si existe el carrito en Local Storage, si no, inicializarlo
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    for (const categoria in tiendaObj.tematicas) {
        const articulos = tiendaObj.tematicas[categoria].articulos;

        if (articulos.length > 0) {
            // Obtén el primer producto de la categoría
            const producto = articulos[1];

            // Crea el HTML del producto destacado
            const productoHTML = `
                <div class="product">
                    <img src="${producto.imagen || '../../IMG/default.jpg'}" alt="Imagen de ${producto.titulo}">
                    <h3>${producto.titulo}</h3>
                    <p>${producto.descripcion || 'Descripción no disponible.'}</p>
                    <button class="add-to-cart" onclick="addToCart('${producto.id}', '${producto.titulo}', ${producto.precio}, '${producto.imagen || '../../IMG/hobbit.jpg'}')">Añadir al carrito</button>
                </div>
            `;

            // Añade el producto al contenedor
            destacadosContainer.innerHTML += productoHTML;
        }
    }

    // Función para añadir un producto al carrito
    function addToCart(id, titulo, precio, imagen) {
        // Obtener el carrito desde el localStorage o crear uno vacío
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

        // Verificar si el producto ya está en el carrito
        const productoExistente = carrito.find(item => item.id === id);

        if (productoExistente) {
            // Si el producto ya existe, aumentar la cantidad
            productoExistente.cantidad++;
        } else {
            // Si no está en el carrito, agregarlo con cantidad 1
            carrito.push({
                id: id,
                titulo: titulo,
                precio: precio,
                imagen: imagen,
                cantidad: 1
            });
        }

        // Guardar el carrito actualizado en localStorage
        localStorage.setItem('carrito', JSON.stringify(carrito));

        // Mostrar una alerta o mensaje para confirmar la acción
        alert(`${titulo} ha sido añadido al carrito!`);

        // Actualizar el número de productos en el carrito (ícono de carrito)
        actualizarCarrito();
    }


} else {
    console.error('No se encontraron datos de la tienda en Local Storage.');
}
