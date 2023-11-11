/*
    Codigo que se ejecutará al inicio.
*/
const objetoPresupuestador = {}
accionesAlCargarLibreria()

/*
 Funciones
*/

async function accionesAlCargarLibreria() {
    // Defino una variable adentro del objeto
    // -> que ahora lee datos desde una página que nos brinda un servicio
    objetoPresupuestador.promesaValorDolarBlue = await getValorDolarBlue()
    objetoPresupuestador.CONSTANTE_PRECIO_METRO_EN_DOLARES = objetoPresupuestador.promesaValorDolarBlue.compra

    objetoPresupuestador["detallesDescuentos"] = {
        "descuentoPorMas100metros": 5,
        "descuentoPorMas200metros": 8,
        "descuentoPorDefecto": 0
    }


    //... y luego agrego (o mejor dicho, ASIGNO) una funcion dentro del objeto
    objetoPresupuestador["ejecutarPresupuestador"] = presupuestacion

    agregarEventosAlDOM()

}

function agregarEventosAlDOM() {
    // Asignamos al boton en el "frontend" el evento "click"
    // ... y que ejecute algunas cosas nuestras
    document.getElementById('btn-simulador')
        .addEventListener('click', onClickListenerBotonPresupuesto);
}

function onClickListenerBotonPresupuesto(event) {
    // Evitamos que se ejecute el Form-submit por defecto.
    event.preventDefault();

    // Lectura de datos
    const nombreProyecto = document.getElementById('nombre_proyecto_input').value;
    localStorage.setItem("nombre_proyecto_storage", nombreProyecto);

    const metrosCuadrados = parseInt(document.getElementById('metros_cuadrados').value);
    const cantidadCuotas = parseInt(document.querySelector('input[name="cantidad_cuotas"]:checked').value);

    // Ejecucion de la Promise
    presupuestacion({ metrosCuadrados, cantidadCuotas })
        .then((presupuestoResultante) => {
            // Aquí puedes trabajar con los resultados
            console.log(presupuestoResultante);

            // Integración con el Toastify
            mostrarNotificacion("Presupuesto Realizado");

            // Integración con la página
            mostrarElPresupuestoEnHTML(presupuestoResultante)
        })
        .catch((error) => {
            console.error(error);

            // Usamos destructuring del error
            const { message } = error

            // Integración con el Toastify
            // + Template literal
            mostrarNotificacion(`Un Error ha ocurrido. Detalles: ${message}`);
        });
}

/**
 * Ejemplo de UN presupuestoResultante...
 * {
    "cantidadMetrosCuadrados": "111",
    "precioTotal": 98068,
    "precioMetroEnDolares": 930,
    "precioTotalConInteres": 98068,
    "cantidadCuotas": "1",
    "arrayDeCuotas": [
        98068
    ],
    "nombreProyecto": "test"
}
De aqui solo necesitamos ARRAY DE CUOTAS, 
entonces aca aplicamos destructuring.
 */
// Definimos una funcion que va a aplicar el DESTRUCTURING en el procesamiento de parametros
function mostrarElPresupuestoEnHTML({
    arrayDeCuotas,
}){
    let numeroCuota = 1;

    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    arrayDeCuotas.forEach(cuota => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>Cuota nº${numeroCuota}</td> <td>${cuota}</td>`;
        tableBody.appendChild(row);
        numeroCuota++
    });

    // Imprimimos el nombre del proyecto, desde el storage
    const nombreProyectoDesdeElStorage = localStorage.getItem("nombre_proyecto_storage");
    document.getElementById('nombre_proyecto_visual').innerHTML = nombreProyectoDesdeElStorage;

}

// Función para mostrar notificaciones con Toastify
function mostrarNotificacion(mensaje) {
    Toastify({
        text: mensaje,
        duration: 3000, // Duración en milisegundos
        gravity: "center", // Posición de la notificación (top, bottom, center)
        position: "center", // Alineación horizontal (left, center, right)
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)", // Color de fondo
        stopOnFocus: true, // La notificación se cierra cuando se enfoca en ella
    }).showToast();
}


// Info: probamos el renombre metrosCuadrados >> a cantidadMetrosCuadrados
function presupuestacion({ metrosCuadrados: cantidadMetrosCuadrados, cantidadCuotas }) {
    return new Promise((resolve, reject) => {
        const { CONSTANTE_PRECIO_METRO_EN_DOLARES } = objetoPresupuestador;

        let descuentoMetrosCuadrados = obtenerDescuentoPorMetros(cantidadMetrosCuadrados);
        let interesPorCuotas = obtenerInteresPorCuotas(cantidadCuotas);

        const precioTotalMetraje = CONSTANTE_PRECIO_METRO_EN_DOLARES * cantidadMetrosCuadrados;
        const descuentoAlMetraje = descuentoMetrosCuadrados > 0 ?
            Math.round((descuentoMetrosCuadrados * precioTotalMetraje) / 100) : //<- TODO: potencial arrow function de dos parametros
            0;
        const precioTotal = precioTotalMetraje - descuentoAlMetraje;

        const precioTotalConInteres = interesPorCuotas > 0 ?
            precioTotal + obtenerPrecioTotal(interesPorCuotas, precioTotal) : //<- uso de arrow function
            precioTotal;
        const valorCadaCuota = obtenerValorCadaCuota(precioTotalConInteres, cantidadCuotas); //<- uso de arrow function

        let arrayDeCuotas = [];
        for (let index = 0; index < cantidadCuotas; index++) {
            arrayDeCuotas.push(valorCadaCuota);
        }

        const nombreProyectoDesdeElStorage = localStorage.getItem("nombre_proyecto_storage");

        const resultados = {
            cantidadMetrosCuadrados,
            precioTotal,
            precioMetroEnDolares: CONSTANTE_PRECIO_METRO_EN_DOLARES,
            precioTotalConInteres,
            cantidadCuotas,
            arrayDeCuotas,
            nombreProyecto: nombreProyectoDesdeElStorage
        };

        resolve(resultados);
    });
}

// Uso de arrow functions "nombradas" (o named arrow functions)
obtenerPrecioTotal = (interesPorCuotas, precioTotal) => Math.round(((interesPorCuotas * precioTotal) / 100));
obtenerValorCadaCuota = (precioTotalConInteres, cantidadCuotas) => (Math.round(precioTotalConInteres / cantidadCuotas));

function obtenerDescuentoPorMetros(cantidadMetrosCuadrados) {

    if (cantidadMetrosCuadrados >= 200) {
        return objetoPresupuestador["detallesDescuentos"].descuentoPorMas200metros
    }

    if (cantidadMetrosCuadrados >= 100) {
        return objetoPresupuestador["detallesDescuentos"].descuentoPorMas100metros
    }

    // retorno por defecto
    return objetoPresupuestador["detallesDescuentos"].descuentoPorDefecto

}

function obtenerInteresPorCuotas(cantidadCuotas) {

    let interesPorCuotas = 0

    // Hasta 3 cuotas, nada.
    if (cantidadCuotas <= 3) {
        interesPorCuotas = 0  //<-- aca se podría hacer lo mismo, y leer de json.
    } else {
        if (cantidadCuotas >= 4 && cantidadCuotas <= 6) {
            interesPorCuotas = 15
        } else {
            if (cantidadCuotas >= 7 && cantidadCuotas <= 12) {
                interesPorCuotas = 30
            }
        }
    }

    return Math.round(interesPorCuotas)
}

async function getValorDolarBlue() {
    // URL de la API que deseas consultar
    const apiUrl = 'https://dolarapi.com/v1/dolares/blue';

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        // Mostrar el valor del dólar en algún elemento HTML

        const valorDolarElement = document.getElementById('valorDolar');
        valorDolarElement.innerHTML = `<strong>Valor del Dólar Blue:</strong> <strong>$${data.compra}</strong> (Compra), <strong>$${data.venta}</strong> (Venta)`;



        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// Llamamos a la función y mostramos el valor en los elementos HTML
getValorDolarBlue().catch(error => {
    console.error('Error:', error.message);
});

