const form = document.getElementById('loginForm');

// Escuchar el evento submit
form.addEventListener('submit', async (event) => {
    // Prevenir el envío estándar del formulario
    event.preventDefault();
    
    // Capturar los datos del formulario
    const formData = new FormData(form);
    const data = {
        username: formData.get('username'),
        password: formData.get('password')
    };

    // Enviar la solicitud al servidor
    fetch('../../SERVIDOR/PHP/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.success) {
            console.log(data.mensaje); // Login exitoso
            // Almacenar el token en el localStorage
            localStorage.setItem('authToken', data.token);
            // Almacenar la fecha de expiración del token
            localStorage.setItem('authExpiration', data.expiration);
            // Almacenar el json de la tienda
            localStorage.setItem('tienda', JSON.stringify(data.tienda));  // Convertir el objeto a string para almacenarlo
            // Redirigir al dashboard
            alert("Bienvenido...");
            setTimeout(() => {
                window.location.href = '../HTML/dashboard.html';
            }, 1000);
        } else {
            console.error(data.mensaje); // Usuario o contraseña incorrectos
            // Mostrar error al usuario
            alert(data.mensaje);
        }
    })
    .catch((error) => {
        console.error('Error', error);
    });
});