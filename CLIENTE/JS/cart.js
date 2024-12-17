// Cargar el carrito desde el localStorage o crear uno vacío
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Si el carrito está vacío (es decir, es el primer acceso o se borró previamente)
if (carrito.length === 0) {
    console.log("Carrito vacío creado.");
    localStorage.setItem('carrito', JSON.stringify(carrito)); // Guarda el carrito vacío en localStorage
} else {
    console.log("Carrito cargado desde localStorage:", carrito);
}

// Función para mostrar los productos en el carrito
function renderCarrito() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Limpiar el contenido antes de renderizar

    let total = 0;

    carrito.forEach((producto, index) => {
        const productoDiv = document.createElement('div');
        productoDiv.classList.add('cart-item');
        productoDiv.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.titulo}">
            <div class="cart-item-info">
                <h3>${producto.titulo}</h3>
                <p>Precio Unitario: $${producto.precio}</p>
                <p>Cantidad: <span class="cantidad">${producto.cantidad}</span></p>
                <p>Precio Total: $<span class="precio-total">${producto.precio * producto.cantidad}</span></p>
            </div>
            <div class="cart-item-buttons">
                <button onclick="modificarCantidad(${index}, 1)">Añadir</button>
                <button onclick="modificarCantidad(${index}, -1)">Quitar</button>
                <button onclick="eliminarProducto(${index})">Eliminar</button>
            </div>
        `;
        cartItemsContainer.appendChild(productoDiv);

        total += producto.precio * producto.cantidad;
    });

    // Mostrar el total en el carrito
    document.getElementById('total-price').innerText = total.toFixed(2);
}

// Función para modificar la cantidad de un producto en el carrito
function modificarCantidad(index, cantidad) {
    if (carrito[index].cantidad + cantidad <= 0) {
        return; // No permitir cantidades negativas o cero
    }
    carrito[index].cantidad += cantidad;
    localStorage.setItem('carrito', JSON.stringify(carrito)); // Guardar en localStorage
    renderCarrito(); // Volver a renderizar el carrito
    actualizarCarrito(); // Actualizar el contador en la navbar
}

// Función para eliminar un producto del carrito
function eliminarProducto(index) {
    carrito.splice(index, 1); // Eliminar el producto del array
    localStorage.setItem('carrito', JSON.stringify(carrito)); // Guardar en localStorage
    renderCarrito(); // Volver a renderizar el carrito
    actualizarCarrito(); // Actualizar el contador en la navbar
}

// Inicializar el carrito
renderCarrito();


// Función para mostrar los productos recientes
function mostrarProductosRecientes() {
    const productosRecientes = JSON.parse(localStorage.getItem('productos_recientes')) || [];

    // Obtener el contenedor donde se mostrarán los productos
    const container = document.getElementById('productos-recientes-container');

    // Limpiar el contenedor antes de agregar nuevos productos
    container.innerHTML = '';

    // Limitar a un máximo de 5 productos recientes
    const productosLimitados = productosRecientes.slice(0, 5);

    // Si hay productos recientes, mostrarlos
    if (productosLimitados.length > 0) {
        productosLimitados.forEach(producto => {
            const productoDiv = document.createElement('div');
            productoDiv.className = 'producto-reciente';

            productoDiv.innerHTML = `
            <img src="${producto.imagen}" alt="Imagen de ${producto.titulo}">
            <div class="info">
            <h3>${producto.titulo}</h3>
            <p>Precio: $${producto.precio}</p>
            <button class="add-to-cart" onclick="addToCart('${producto.id}', '${producto.titulo}', ${producto.precio}, '${producto.imagen}')">
                Añadir al carrito
            </button>
            </div>
            `;


            container.appendChild(productoDiv);
        });
    } else {
        container.innerHTML = '<p>No has visitado ningún producto recientemente.</p>';
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

    // Actualizar el número de productos en el carrito counter
    actualizarCarrito();

    // Recargar la página
    location.reload();
}




// Añadir el event listener al botón de checkout
document.getElementById('checkout-btn').addEventListener('click', function (event) {
    event.preventDefault();
    // Obtener el carrito desde el localStorage
    const carrito = JSON.parse(localStorage.getItem('carrito'));

    // Obtener los productos de la tienda desde el localStorage con el nombre correcto ('tienda')
    const tienda = JSON.parse(localStorage.getItem('tienda'));

    // Si el carrito está vacío, mostrar un mensaje y no proceder
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Añade productos antes de realizar la compra.");
        return;
    }

    // Preparar los datos para enviar al servidor
    const datos = {
        carrito: carrito,
        tienda: tienda
    };

    console.log("Datos a enviar:", JSON.stringify(datos));

    // Enviar el carrito y los productos al servidor para su validación
    fetch('../../SERVIDOR/PHP/carrito.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)  // Enviar el objeto datos directamente
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.success) {
                alert(data.success);
            } else {
                alert('Error: ' + (data.error || 'No se pudieron procesar los datos'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error al procesar la solicitud.');
        });


});





// Llamar a la función cuando la página se cargue
document.addEventListener('DOMContentLoaded', mostrarProductosRecientes);