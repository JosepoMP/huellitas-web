// =========================================
// CÓDIGO JQUERY DE LA TIENDA HUELLITAS
// =========================================
//
// MINI DICCIONARIO (para leer este archivo):
//   $("#algo")     -> busca el elemento con id="algo"
//   $(".algo")     -> busca TODOS los elementos con class="algo"
//   $(this)        -> el elemento al que le hicieron clic
//   var nombre     -> crea una "cajita" (variable) para guardar un dato
//   function () {} -> un paquete de instrucciones que se ejecuta después
//   if / else      -> "si pasa esto... si no..."
//   ==             -> compara si dos cosas son iguales
//   ||             -> significa "o"
// =========================================

// Espera a que la página cargue y después ejecuta todo lo de adentro
$(document).ready(function () {

    // ===== 1. MENÚ HAMBURGUESA (celular) =====
    // Al tocar el botón ☰...
    $("#botonMenu").click(function () {
        // ...pone o quita la clase "menu-abierto" (como un interruptor).
        // El CSS muestra el menú cuando tiene esa clase.
        $("#menu").toggleClass("menu-abierto");
    });


    // ===== 2. FILTRAR PRODUCTOS POR CATEGORÍA =====
    // Función que recibe una categoría (ej: "juguetes") y muestra solo esos productos.
    // La usan los botones de filtro y también la barra de categorías.
    function filtrarProductos(categoria) {
        // Todos los botones de filtro quedan blancos...
        $(".boton-filtro").removeClass("activo");
        // ...y se pinta solo el botón de esta categoría
        $(".boton-filtro[data-categoria='" + categoria + "']").addClass("activo");

        // Borra lo que hubiera escrito en el buscador y oculta su mensaje
        $("#buscador").val("");
        $("#sinResultados").hide();

        if (categoria == "todos") {
            // Si es "todos": se muestran todas las tarjetas
            $(".tarjeta-producto").fadeIn();
        } else {
            // Si no: se esconden todas...
            $(".tarjeta-producto").hide();
            // ...y aparecen solo las que tienen esa clase (ej: ".tarjeta-producto.juguetes")
            $(".tarjeta-producto." + categoria).fadeIn();
        }
    }

    // Al hacer clic en un botón de filtro (Todos, Alimentos, Juguetes, Accesorios)
    $(".boton-filtro").click(function () {
        var categoria = $(this).attr("data-categoria");  // lee data-categoria del botón
        filtrarProductos(categoria);                      // y filtra con esa palabra
    });

    // Al hacer clic en la barra de categorías (Perro, Gato, Alimentos...)
    $(".enlace-categoria").click(function () {
        var categoria = $(this).attr("data-categoria");  // igual que arriba
        filtrarProductos(categoria);
    });


    // ===== 3. BUSCADOR DE PRODUCTOS =====
    // "input" = cada vez que se escribe o se borra una letra
    $("#buscador").on("input", function () {
        // Lo que escribió la persona, en minúsculas (así "PERRO" = "perro")
        var texto = $(this).val().toLowerCase();

        // El filtro vuelve a "Todos"
        $(".boton-filtro").removeClass("activo");
        $(".boton-filtro[data-categoria='todos']").addClass("activo");

        // .each = "para cada tarjeta, haz esto:"
        $(".tarjeta-producto").each(function () {
            // Toma el nombre del producto (el <h3>) en minúsculas
            var nombre = $(this).find("h3").text().toLowerCase();

            // indexOf busca el texto dentro del nombre. Si no lo encuentra da -1
            if (nombre.indexOf(texto) != -1) {
                $(this).show();   // sí lo contiene: se muestra
            } else {
                $(this).hide();   // no lo contiene: se esconde
            }
        });

        // Cuenta cuántas tarjetas quedaron visibles. Si son 0, sale el mensaje
        if ($(".tarjeta-producto:visible").length == 0) {
            $("#sinResultados").show();
        } else {
            $("#sinResultados").hide();
        }
    });


    // ===== 4. BANNER CON FLECHAS =====
    var slideActual = 0;                     // el mensaje que se ve ahora (empieza en 0 = el primero)
    var totalSlides = $(".slide").length;    // cuántos mensajes hay (3)

    // Función: esconde todos los mensajes y muestra solo el número que le pidamos
    function mostrarSlide(numero) {
        $(".slide").hide();
        $(".slide").eq(numero).fadeIn();     // .eq(1) = el mensaje número 1 (se cuenta desde 0)
    }

    // Flecha derecha: pasa al siguiente mensaje
    $("#flechaDerecha").click(function () {
        slideActual = slideActual + 1;
        if (slideActual >= totalSlides) {
            slideActual = 0;   // después del último, vuelve al primero
        }
        mostrarSlide(slideActual);
    });

    // Flecha izquierda: vuelve al mensaje anterior
    $("#flechaIzquierda").click(function () {
        slideActual = slideActual - 1;
        if (slideActual < 0) {
            slideActual = totalSlides - 1;   // antes del primero, va al último
        }
        mostrarSlide(slideActual);
    });


    // ===== 5. CONTADOR DEL CARRITO =====
    // Va afuera del clic para que no vuelva a 0 cada vez
    var contador = 0;

    $(".boton-agregar").click(function () {
        contador = contador + 1;                  // suma 1
        $("#contadorCarrito").text(contador);     // muestra el número en el menú
        $(this).text("¡Agregado!");               // cambia el texto del botón presionado
    });

    // Corazón de favoritos: pone o quita la clase "favorito" (se pinta o se despinta)
    $(".boton-favorito").click(function () {
        $(this).toggleClass("favorito");
    });


    // ===== 6. VALIDAR EL FORMULARIO DE CONTACTO =====
    // "submit" = cuando se envía el formulario (botón o tecla Enter)
    $("#formularioContacto").submit(function (evento) {
        // Evita que la página se recargue al enviar
        evento.preventDefault();

        // Lee lo que escribió la persona. trim() quita los espacios de los lados
        var nombre = $("#nombre").val().trim();
        var correo = $("#correo").val().trim();
        var mensaje = $("#mensaje").val().trim();

        // Borra los errores del intento anterior (empezamos de cero)
        $(".error").text("");
        $("#nombre, #correo, #mensaje").removeClass("campo-error");
        $("#mensajeEnviado").hide();

        // "Bandera": suponemos que todo está bien. Si algo falla, pasa a false
        var todoBien = true;

        // ¿El nombre está vacío?
        if (nombre == "") {
            $("#errorNombre").text("Por favor escribe tu nombre.");  // escribe el error
            $("#nombre").addClass("campo-error");                     // borde rojo
            todoBien = false;
        }

        // ¿El correo está vacío? Si no, ¿le falta la @ o el punto?
        if (correo == "") {
            $("#errorCorreo").text("Por favor escribe tu correo.");
            $("#correo").addClass("campo-error");
            todoBien = false;
        } else if (correo.indexOf("@") == -1 || correo.indexOf(".") == -1) {
            $("#errorCorreo").text("El correo no es válido. Ejemplo: ana@correo.com");
            $("#correo").addClass("campo-error");
            todoBien = false;
        }

        // ¿El mensaje tiene menos de 10 letras? (.length cuenta las letras)
        if (mensaje.length < 10) {
            $("#errorMensaje").text("El mensaje debe tener al menos 10 caracteres.");
            $("#mensaje").addClass("campo-error");
            todoBien = false;
        }

        // Si nadie bajó la bandera: muestra "enviado" y vacía las cajas
        if (todoBien == true) {
            $("#mensajeEnviado").fadeIn();
            $("#nombre").val("");     // .val("") = deja la caja vacía
            $("#correo").val("");
            $("#mensaje").val("");
        }
    });


    // ===== 7. BOTÓN VOLVER ARRIBA =====
    // "scroll" = cada vez que la persona baja o sube la página
    $(window).scroll(function () {
        // scrollTop() = cuántos píxeles ha bajado
        if ($(window).scrollTop() > 300) {
            $("#botonArriba").fadeIn();    // bajó más de 300: aparece el botón
        } else {
            $("#botonArriba").fadeOut();   // está arriba: desaparece
        }
    });

    // Al hacer clic: sube hasta arriba (posición 0) en 600 milisegundos
    $("#botonArriba").click(function () {
        $("html, body").animate({ scrollTop: 0 }, 600);
    });

});
// NOTA: la galería con lightbox NO usa este archivo. Funciona solo con HTML y CSS (:target).
