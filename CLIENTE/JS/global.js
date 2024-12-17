window.onload = function () {
    // Obtener el token del localStorage
    const token = localStorage.getItem('authToken');
    // Obtener la fecha de expiración
    const expirationTime = localStorage.getItem('authExpiration');
    // Obtener el JSON de la tienda
    const tienda = localStorage.getItem('tienda');

    if (!token || !expirationTime || !tienda) {
        // Si el token no existe, Vaciar el localStorage y redirigir al login
        localStorage.clear();
        console.log('Local Storage borrado exitosamente.');
        window.location.href = '../HTML/login.html';
    } else {
        console.log('Token recuperado');
        console.log('Expiración recuperado');
        console.log('JSON recuperado');

        const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
        if (currentTime >= expirationTime) {
            // Si el token ha expirado, redirigir al login
            alert("El token ha expirado. Por favor, inicia sesión de nuevo.");
            window.location.href = 'login.html';
        }
        // Cargar las categorías desde el json en el local storage
        const tiendaObj = JSON.parse(tienda);

        // Verificar si existe la propiedad de temáticas
        if (tiendaObj && tiendaObj.tematicas) {
            // Seleccionar el contenedor de enlaces de la navbar
            const navbarLinks = document.getElementById('navbar-links');

            // Insertar "Inicio" al principio
            const inicioLink = document.createElement('a');
            inicioLink.href = 'dashboard.html';
            inicioLink.textContent = 'Inicio';
            navbarLinks.appendChild(inicioLink); // Insertar después del logo

            // Insertar dinámicamente los enlaces de las categorías (temáticas)
            for (const categoria in tiendaObj.tematicas) {
                if (tiendaObj.tematicas.hasOwnProperty(categoria)) {
                    const link = document.createElement('a');
                    link.href = `../HTML/categories.html?categoria=${encodeURIComponent(categoria)}`;
                    link.textContent = categoria;
                    navbarLinks.appendChild(link); // Añadir los enlaces de categoría después de "Inicio"
                }
            }
        } else {
            console.error('No se encontraron temáticas en el JSON de la tienda');
        }
    }
};

//Cerrar sesión
document.getElementById('logout-link').addEventListener('click', function (e) {
    e.preventDefault();
    
    // Limpiar el LocalStorage
    localStorage.clear();
    
    // Opcional: mensaje de confirmación
    alert('Sesión cerrada correctamente');

    // Redirigir al login (o página de inicio)
    window.location.href = 'login.html';
});



// Función para actualizar el carrito
function actualizarCarrito() {
    // Obtener el carrito desde el localStorage
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Calcular el total de artículos en el carrito
    const carritoCount = carrito.reduce((total, producto) => total + producto.cantidad, 0);

    // Actualizar el contador del carrito en la interfaz
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = carritoCount;
    }
}

// Llamar a la función para inicializar el contador de carrito al cargar la página
document.addEventListener('DOMContentLoaded', actualizarCarrito);