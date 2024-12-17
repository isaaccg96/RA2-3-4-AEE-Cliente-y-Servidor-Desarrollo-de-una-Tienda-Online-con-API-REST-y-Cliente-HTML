<?php

// Verificamos si los datos han sido enviados por el método POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtenemos los datos del producto enviados desde el cliente
    $producto = [
        'id' => $_POST['id'],
        'titulo' => $_POST['titulo'],
        'precio' => $_POST['precio'],
        'imagen' => $_POST['imagen']
    ];

    // Ruta de archivo donde se guardarán los productos recientes
    $archivo = 'productos_recientes.json';

    // Intentamos leer los productos existentes
    if (file_exists($archivo)) {
        $productos = json_decode(file_get_contents($archivo), true);
    } else {
        $productos = [];
    }

    // Agregar el nuevo producto a la lista de productos recientes
    // Comprobamos si el producto ya existe para evitar duplicados
    $productoExistente = false;
    foreach ($productos as $prod) {
        if ($prod['id'] == $producto['id']) {
            $productoExistente = true;
            break;
        }
    }

    if (!$productoExistente) {
        $productos[] = $producto;
        // Guardar la lista de productos actualizada en el archivo
        file_put_contents($archivo, json_encode($productos, JSON_PRETTY_PRINT));
    }

    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
}
?>
