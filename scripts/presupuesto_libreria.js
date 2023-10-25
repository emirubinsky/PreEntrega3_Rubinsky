/*
    Ejecución que se realiza cada vez que se carga
    esta librería.
*/

// Definimos un objeto, y ya de paso le damos una propiedad
const objetoPresupuestador = {
    // Defino una variable adentro del objeto
    CONSTANTE_PRECIO_METRO_EN_DOLARES: 3000
}

//... y luego agrego (o mejor dicho, ASIGNO) una funcion dentro del objeto
objetoPresupuestador["ejecutarPresupuestador"] = presupuestacion


// Asignamos al boton en el "frontend" el evento "click"
// ... y que ejecute algunas cosas nuestras
document.getElementById('btn-simulador').addEventListener('click',
    function (event) {

        // Con esto evitamos que se haga "submit" del formulario
        event.preventDefault();

        const metrosCuadrados = document.getElementById('metros_cuadrados').value;
        const cantidadCuotas = document.getElementById('cantidad_cuotas').value;

        // Ejecutamos la funcion que esta dentro del objeto-presupuestador
        objetoPresupuestador.ejecutarPresupuestador(metrosCuadrados, cantidadCuotas)
    });

/*
 Funciones
*/


function presupuestacion(cantidadMetrosCuadrados, cantidadCuotas) {
    // Codigo personalizado

    /*alert(`Orgá
    Nica.
    ============================================
    Simulador Presupuesto de obra por Metro Cuadrado
    ============================================
    A continuación ingresará los parámetros de la obra que le gustaría que realicemos en conjunto.
                          
    PROMOS 2023
    - Si tu obra tiene una superficie mayor a 100mt2 entonces tienes 5% descuento
    - Si tu obra tiene una superficie mayor a 200mt2 entonces tienes 8% descuento
    ============================================`)
    */
    //let seguirTrabajando = true

    // Aquí llamo a la propiedad DENTRO del objeto
    const precioMetroEnDolares = this.CONSTANTE_PRECIO_METRO_EN_DOLARES;

   
    //while (seguirTrabajando) {

        // const cantidadMetrosCuadrados = parseInt(prompt('Ingresar metros cuadrados de la obra a realizar:'))

        // const cantidadCuotas = parseInt(prompt('Ingresar cantidad de cuotas a pagar:\nOpc A: Entre 1 a 3 cuotas: 0% interes.\nOpc B: Entre 4 a 6 cuotas: 15% interes\nOpc C: Entre 7 a 12 cuotas cuotas: 30% interes'))

        // INFO: Codigo reemplazado por una llamada a funcion
        let descuentoMetrosCuadrados = obtenerDescuentoPorMetros(cantidadMetrosCuadrados)

        // INFO: Codigo reemplazado por una llamada a funcion
        let interesPorCuotas = obtenerInteresPorCuotas(cantidadCuotas)

        // Calculamos el precio
        const precioTotalMetraje = precioMetroEnDolares * cantidadMetrosCuadrados
        const descuentoAlMetraje = descuentoMetrosCuadrados > 0 ?
            Math.round((descuentoMetrosCuadrados * precioTotalMetraje) / 100) :
            0
        const precioTotal = precioTotalMetraje - descuentoAlMetraje // Precio contado

        // Calculamos valor cuotas
        const precioTotalConInteres = interesPorCuotas > 0 ?
            precioTotal + Math.round(((interesPorCuotas * precioTotal) / 100)) : // Precio contado
            precioTotal
        const valorCadaCuota = Math.round(precioTotalConInteres / cantidadCuotas)

        // Cargando cada cuota dentro de un array.
        let arrayDeCuotas = []
        for (let index = 0; index < cantidadCuotas; index++) {
            arrayDeCuotas.push(valorCadaCuota);
        }

        // Mostramos resultados
        /*
        alert(`Orgánica.
    ============================================
    Simulador Presupuesto - RESULTADOS
    ============================================
    
    TOTAL Mts2         = ${cantidadMetrosCuadrados} Mts2
    PRECIO CONTADO     = ${precioTotal} USD
    VALOR Mts2         = ${precioMetroEnDolares} USD / Mts2
    
    PRECIO FINANCIADO  = ${precioTotalConInteres} USD
    CANTIDAD CUOTAS    = ${cantidadCuotas} Cuotas
    
    Continue para ver cada cuota.
    
    ============================================
    
    Presione ENTER para continuar`)
    */

        let desgloseCuotas = "";
        let numeroCuota = 1;

        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '';

        arrayDeCuotas.forEach(cuota => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>Cuota nº${numeroCuota}</td> <td>${cuota}</td>`;
            tableBody.appendChild(row);
            numeroCuota++
        });

/*
        alert(`Orgánica.
    ============================================
    Simulador Presupuesto - Desglosa cuotas
    ============================================
    
    ${desgloseCuotas}
    
    ============================================
    
    Presione ENTER para continuar`)
*/
        // const teclaApretada = prompt('Simulacion finalizada.\nPresione X para salir.')

        // seguirTrabajando = teclaApretada !== 'X'
        
    // }


}

function obtenerDescuentoPorMetros(cantidadMetrosCuadrados) {

    if (cantidadMetrosCuadrados >= 200) {
        return 8
    }

    if (cantidadMetrosCuadrados >= 100) {
        return 5
    }

    // retorno por defecto
    return 0

}

function obtenerInteresPorCuotas(cantidadCuotas) {

    let interesPorCuotas = 0

    // Hasta 3 cuotas, nada.
    if (cantidadCuotas <= 3) {
        interesPorCuotas = 0
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

