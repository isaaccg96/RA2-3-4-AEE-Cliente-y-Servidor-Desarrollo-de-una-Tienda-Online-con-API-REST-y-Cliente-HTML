// Obtener la categoría seleccionada desde la URL
const params = new URLSearchParams(window.location.search);
const categoriaSeleccionada = params.get('categoria');

if (categoriaSeleccionada) {
    // Actualizar el título de la página
    document.getElementById('titulo-categoria').textContent = `Artículos de la categoría: ${categoriaSeleccionada}`;

    // Obtener el JSON de la tienda desde el localStorage
    const tienda = localStorage.getItem('tienda');

    if (tienda) {
        try {
            const datosTienda = JSON.parse(tienda); // Parsear el JSON
            const tematicas = datosTienda.tematicas;

            if (tematicas && tematicas[categoriaSeleccionada]) {
                const articulos = tematicas[categoriaSeleccionada].articulos;
                const container = document.getElementById('articulos-container');

                if (articulos && articulos.length > 0) {
                    // Mostrar los artículos de la categoría
                    articulos.forEach(articulo => {
                        const articuloDiv = document.createElement('div');
                        articuloDiv.className = 'articulo';
                        articuloDiv.innerHTML = `
                            <h2>${articulo.titulo}</h2>
                            <img src="${articulo.imagen || '../../IMG/hobbit.jpg'}" alt="Imagen de ${articulo.titulo}" class="imagen-libro">
                            <p><strong>Autor:</strong> ${articulo.autor || 'N/A'}</p>
                            <p><strong>Editorial:</strong> ${articulo.editorial || 'N/A'}</p>
                            <p><strong>Precio:</strong> $${articulo.precio}</p>
                            <a href="product.html?id=${encodeURIComponent(articulo.id)}" onclick="guardarProductoReciente('${articulo.id}', '${articulo.titulo}', ${articulo.precio}, '${articulo.imagen || '../../IMG/hobbit.jpg'}')">Ver producto</a>
                            <button class="add-to-cart" onclick="addToCart('${articulo.id}', '${articulo.titulo}', ${articulo.precio}, '${articulo.imagen || '../../IMG/hobbit.jpg'}')">Añadir al carrito</button>
                        `;
                        container.appendChild(articuloDiv);
                    });
                } else {
                    container.innerHTML = `<p>No hay artículos disponibles para la categoría ${categoriaSeleccionada}.</p>`;
                }
            } else {
                document.getElementById('articulos-container').innerHTML = `<p>La categoría ${categoriaSeleccionada} no existe.</p>`;
            }
        } catch (error) {
            console.error('Error al parsear el JSON:', error);
            document.getElementById('articulos-container').innerHTML = '<p>Hubo un error al cargar los productos.</p>';
        }
    } else {
        document.getElementById('articulos-container').innerHTML = '<p>No se encontraron datos en el localStorage.</p>';
    }
} else {
    document.getElementById('articulos-container').innerHTML = '<p>Seleccione una categoría válida.</p>';
}

// Función para guardar un producto como reciente en el localStorage
function guardarProductoReciente(id, titulo, precio, imagen) {
    // Obtenemos los productos recientes del localStorage o inicializamos un arreglo vacío
    let productosRecientes = JSON.parse(localStorage.getItem('productos_recientes')) || [];

    // Verificamos si el producto ya está en la lista para evitar duplicados
    const productoExistente = productosRecientes.find(producto => producto.id === id);
    
    if (!productoExistente) {
        // Si no está en la lista, lo agregamos
        productosRecientes.push({ id, titulo, precio, imagen });
        // Guardamos los productos recientes actualizados en el localStorage
        localStorage.setItem('productos_recientes', JSON.stringify(productosRecientes));
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
