// Obtener el ID del producto desde la URL
const params = new URLSearchParams(window.location.search);
const productoId = params.get('id');

if (productoId) {
    // Verificar si el JSON de la tienda está en el Local Storage
    const tiendaJSON = localStorage.getItem('tienda');

    if (tiendaJSON) {
        // Parsear el JSON de la tienda
        const tiendaObj = JSON.parse(tiendaJSON);

        // Buscar el producto por su ID
        let productoEncontrado = null;
        for (const categoria in tiendaObj.tematicas) {
            const articulos = tiendaObj.tematicas[categoria].articulos;
            productoEncontrado = articulos.find(articulo => articulo.id === productoId);
            if (productoEncontrado) break; // Si encontramos el producto, salimos del bucle
        }

        if (productoEncontrado) {
            // Mostrar los detalles del producto
            const container = document.getElementById('producto-container');
            container.innerHTML = `
                <div class="producto">
                    <img src="${productoEncontrado.imagen || '../../IMG/default.jpg'}" alt="Imagen de ${productoEncontrado.titulo}" class="imagen-producto">
                    <div class="producto-info">
                        <h2>${productoEncontrado.titulo}</h2>
                        <p><strong>Autor:</strong> ${productoEncontrado.autor || 'Desconocido'}</p>
                        <p><strong>Editorial:</strong> ${productoEncontrado.editorial || 'No disponible'}</p>
                        <p><strong>Precio:</strong> $${productoEncontrado.precio.toFixed(2)}</p>
                        <p><strong>Descripción:</strong> ${productoEncontrado.descripcion || 'No disponible'}</p>
                        <button class="add-to-cart" onclick="addToCart('${productoEncontrado.id}', '${productoEncontrado.titulo}', ${productoEncontrado.precio}, '${productoEncontrado.imagen || '../../IMG/hobbit.jpg'}')">Añadir al carrito</button>
                    </div>
                </div>
            `;
        } else {
            document.getElementById('producto-container').innerHTML = '<p>Producto no encontrado.</p>';
        }
    } else {
        // Si no se encuentra el JSON de la tienda en Local Storage
        document.getElementById('producto-container').innerHTML = '<p>No se encontraron datos de la tienda. Por favor, recarga la página.</p>';
    }
} else {
    // Si no se proporciona un ID de producto
    document.getElementById('producto-container').innerHTML = '<p>No se ha especificado un producto.</p>';
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
