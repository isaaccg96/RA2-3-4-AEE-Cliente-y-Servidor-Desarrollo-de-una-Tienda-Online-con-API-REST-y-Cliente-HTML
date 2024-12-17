<?php
header('Content-Type: application/json');

$inputJSON = file_get_contents("php://input");

if (empty($inputJSON)) {
    echo json_encode(['error' => 'No se recibieron datos en la solicitud']);
    exit;
}

$data = json_decode($inputJSON, true);

if ($data === null) {
    echo json_encode(['error' => 'Error al decodificar JSON']);
    exit;
}

if (!isset($data['carrito']) || !isset($data['tienda'])) {
    echo json_encode(['error' => 'No se encontraron los datos del carrito o tienda']);
    exit;
}

// Obtener el carrito y los productos de la tienda
$carrito = $data['carrito'];
$productosEnTienda = $data['tienda'];

// Validar los productos del carrito
foreach ($carrito as $productoCarrito) {
    // Buscar el producto en el JSON de productos de la tienda
    $productoEncontrado = false;
    foreach ($productosEnTienda['tematicas'] as $tematica) {
        foreach ($tematica['articulos'] as $productoTienda) {
            if ($productoTienda['id'] == $productoCarrito['id']) {
                $productoEncontrado = true;

                // Comparar los precios
                if ($productoCarrito['precio'] != $productoTienda['precio']) {
                    echo json_encode(["error" => "El precio del producto '{$productoTienda['titulo']}' no coincide", "producto" => $productoCarrito['id']]);
                    exit;
                }
                break 2; // Rompe ambos bucles si se encuentra el producto
            }
        }
    }

    // Si el producto no se encuentra en la tienda
    if (!$productoEncontrado) {
        echo json_encode(["error" => "Producto no encontrado en la tienda", "producto" => $productoCarrito['id']]);
        exit;
    }
}

echo json_encode(['success' => 'Carrito validado con éxito', 'data' => $data]);
?>

