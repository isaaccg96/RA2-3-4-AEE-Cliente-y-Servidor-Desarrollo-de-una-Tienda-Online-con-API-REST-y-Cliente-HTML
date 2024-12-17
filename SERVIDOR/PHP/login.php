<?php
    //COMPROBAR SI EL USUARIO ESTÁ EN EL JSON Y CREAR EL TOKEN
    header('Content-Type: application/json');
    $usuariosJson = '../JSON/usuarios.json';
    $tiendaJson = '../JSON/tienda.json';

    $usuarios = json_decode(file_get_contents($usuariosJson), true);
    $tienda = json_decode(file_get_contents($tiendaJson), true);
    $datosRecibidos = json_decode(file_get_contents('php://input'), true);

    $usuarioIngresado = $datosRecibidos['username'];
    $passwordIngresada = $datosRecibidos['password'];

    $loginValido = false;

    foreach ($usuarios as $usuario) {
        if ($usuario['username'] === $usuarioIngresado && $usuario['password'] === $passwordIngresada) {
            $loginValido = true;
            break;
        }
    }

    if ($loginValido) {
        // Generar un token aleatorio de 16 bytes
        $token = bin2hex(random_bytes(16)); 
        
        //Establecer la expiración del token
        $expiration_time = time() + 3600;  //1 hora 
          
        //Respuesta con éxito y el token
        echo json_encode(["success" => true, "mensaje" => "Login exitoso", "token" => $token, "expiration" => $expiration_time,  "tienda" => $tienda  ]); 
    } else {
        echo json_encode(["success" => false, "mensaje" => "Usuario o contraseña incorrectos"]);
    }
?>