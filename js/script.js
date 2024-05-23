
/* ------------------------------------------- */
// FUNCIONES PRINCIPALES 
/* ------------------------------------------- */

/* 
    Iniciamos todas las variables que ocuparemos dentro del LocalStorage:
    -usuario (de tipo: Usuario)
    -transacciones (de tipo: Array(Transaccion))
*/

if (localStorage.getItem("usuario") === null) {

    // creamos variable "usuario" inicial
    const usuario = new Usuario('Ash Ketchum', '1234', '0987654321');

    // lista de transacciones
    const transacciones = new Array();
    const date = new Date();
    const dateStr = date.toLocaleDateString() + " " + date.toLocaleTimeString();
    transacciones.push(new Transaccion(dateStr, "Deposito", "Saldo Inicial", 500.00))

    // inicializamos LocalStorage con las variables: usuario y transacciones
    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem("transacciones", JSON.stringify(transacciones));

}


/*
    Las funciones refrescar() y pintar() se encargan de pintar en pantalla 
    los datos actualizados existentes en el LocalStorage
*/

function refrescar(pantalla) {
    pintarInfoUsuario();
    if(pantalla === "consulta-saldo") {
        pintarConsultaSaldo();
    }
    if(pantalla === "historial-transacciones") {
        pintarHistorialTransacciones();
    }
    if(pantalla === "graficos") {
        pintarGrafico();
    }
}

/*
    Las funciones refrescar() y pintar() se encargan de pintar en pantalla 
    los datos actualizados existentes en el LocalStorage
*/

function entrar() {

    // leyendo los valores del formulario
    const pin = document.getElementById("pin").value;

    // obtenemos la variable "usuario" del Localstorage
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (pin === usuario.pin) {
        location.replace("http://127.0.0.1:5500/principal.html")
    } else {
        mostrarAlert("Pin incorrecto", "El pin ingresado es incorrecto", "error");
    }

}

/*
    La funcion "depositar()" deposita dinero en la cuenta de ahorros
*/

function depositar() {

    // leyendo los valores del formulario
    const cantidadDeposito = document.getElementById("cantidad-deposito").value;

    // realizar validaciones
    if (!validarCantidadSoloNumeros(cantidadDeposito)) {
        mostrarAlert("Cantidad incorrecta", "La Cantidad debe contener unicamente numeros", "error");
        return;
    }

    // Si llegamos hasta aqui... significa que pasamos todas las validaciones
    // agregamos la transaccion al LocalStorage
    agregarTransaccion("Deposito", "Deposito", cantidadDeposito);
    mostrarAlert("Transaccion Exitosa", "Deposito realizado exitosamente", "success");


}

/*
    La funcion "retirar()" retira dinero de la cuenta de ahorros
*/

function retirar() {

    // leyendo los valores del formulario
    const cantidadRetiro = document.getElementById("cantidad-retiro").value;

    // realizar validaciones
    if (!validarCantidadSoloNumeros(cantidadRetiro)) {
        mostrarAlert("Cantidad incorrecta", "La Cantidad debe contener unicamente numeros", "error");
        return;
    }
    if (calcularSaldoActual() < parseFloat(cantidadRetiro)) {
        mostrarAlert("Transaccion Fallida", "Fondos insuficientes para realizar el retiro", "error");
        return;
    }

    // Si llegamos hasta aqui... significa que pasamos todas las validaciones
    // Procedemos a agregar la transaccion al LocalStorage
    agregarTransaccion("Retiro", "Retiro", cantidadRetiro);
    mostrarAlert("Transaccion Exitosa", "Retiro realizado exitosamente", "success");

}

/*
    La funcion "pagarServicio()" paga un servicio con dinero de la cuenta de ahorros
*/

function pagarServicio() {

    // leyendo los valores del formulario
    const tipoServicio = document.getElementById("tipo_servicio").value;
    const cantidadPagoServicio = document.getElementById("cantidad-pago-servicio").value;

    // realizar validaciones
    if (!validarCantidadSoloNumeros(cantidadPagoServicio)) {
        mostrarAlert("Cantidad incorrecta", "La Cantidad debe contener unicamente numeros", "error");
        return;
    }
    if (calcularSaldoActual() < parseFloat(cantidadPagoServicio)) {
        mostrarAlert("Transaccion Fallida", "Fondos insuficientes para realizar el retiro", "error");
        return;
    }

    // Si llegamos hasta aqui... significa que pasamos todas las validaciones
    // Procedemos a agregar la transaccion al LocalStorage
    agregarTransaccion("Pago de Servicio", tipoServicio, cantidadPagoServicio);
    mostrarAlert("Transaccion Exitosa", "Pago de Servicio realizado exitosamente", "success");

}

/* ------------------------------------------- */
// FUNCIONES PARA PINTAR DATOS 
/* ------------------------------------------- */

/*
    La funcion "pintarInfoUsuario()" pinta la informacion del usuario
    en el header de todos los archivos .html
*/

function pintarInfoUsuario() {
    
    // obtenemos la variable "usuario" del Localstorage
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    // pintamos los valores en las etiquetas HTML correspondientes
    document.getElementById("usuario").innerHTML = usuario.nombre;
    document.getElementById("cuenta").innerHTML = usuario.cuenta;
    document.getElementById("saldo").innerHTML = calcularSaldoActual();
}

/*
    La funcion "pintarConsultaSaldo()" pinta la informacion del usuario
    dentro de consulta-saldo.html
*/

function pintarConsultaSaldo() {
    
    // obtenemos la variable "usuario" del Localstorage
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    // pintamos los valores en las etiquetas HTML correspondientes
    document.getElementById("usuario-cs").innerHTML = usuario.nombre;
    document.getElementById("cuenta-cs").innerHTML = usuario.cuenta;
    document.getElementById("saldo-cs").innerHTML = calcularSaldoActual();
}

/*
    La funcion "pintarHistorialTransacciones()" pinta el historial de transacciones
    dentro de historial-transacciones.html
*/

function pintarHistorialTransacciones() {

    // obteniendo la variable transacciones del localstorage
    const transacciones = JSON.parse(localStorage.getItem("transacciones"));

    var filas = "";
    var saldo = 0;
    for (transaccion of transacciones) {
        var signo = transaccion.tipoTransaccion === "Deposito" ? "+ $" : "- $" 
        if (transaccion.tipoTransaccion === "Deposito") {
            saldo = parseFloat(saldo) + parseFloat(transaccion.cantidad); 
        } else {
            saldo = parseFloat(saldo) - parseFloat(transaccion.cantidad); 
        }
        filas += "<tr>"
        filas += "<td>" + transaccion.fecha + "</td>"
        filas += "<td>" + transaccion.tipoTransaccion + "</td>"
        filas += "<td>" + transaccion.descripcion + "</td>"
        filas += "<td>" + signo + transaccion.cantidad + "</td>"
        filas += "<td>$" + saldo.toFixed(2) + "</td>"
        filas += "</td>"
    }
 
    var tbodyIngresos = document.getElementById("tblTransacciones").getElementsByTagName("tbody")[0];
    tbodyIngresos.innerHTML = filas;

}

/*
    La funcion "pintarGrafico()" pinta el grafico de las transacciones
    dentro de graficos.html
*/

function pintarGrafico() {

    // obtenemos el canvas id donde se pintara el grafico
    const ctx = document.getElementById('grafico');

    // calculamos la suma de montos de cada tipo de transaccion:
    // Depositos, Retiros y Pagos de Servicios

    const sumDepositos = calcularSumatoriaPorTransaccion('Deposito');
    const sumRetiros = calcularSumatoriaPorTransaccion('Retiro');
    const sumPagos = calcularSumatoriaPorTransaccion('Pago de Servicio');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Depositos', 'Retiros', 'Pagos'],
            datasets: [{
                label: '',
                data: [sumDepositos, sumRetiros, sumPagos],
                borderWidth: 1,
                backgroundColor: ['blue', 'red', 'orange']
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false // Para no ver la leyenda en el grafico
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        },
    });

}

/* ------------------------------------------- */
// FUNCIONES HELPERS 
/* ------------------------------------------- */

/*
    La funcion "calcularSaldoActual()" es una funcion que obtiene 
    el saldo actual: depositos - retiros - pagos de servicios 
*/

function calcularSaldoActual() {

    // obtenemos la lista de "transacciones" del Localstorage
    const transacciones = JSON.parse(localStorage.getItem("transacciones"));

    // calculamos el saldo actual    
    var saldo = 0;
    for (transaccion of transacciones) {
        if (transaccion.tipoTransaccion === "Deposito") {
            saldo = parseFloat(saldo) + parseFloat(transaccion.cantidad);
        } else {
            saldo = parseFloat(saldo) - parseFloat(transaccion.cantidad);
        }
    }

    return saldo.toFixed(2);

}

/*
    La funcion "calcularPorcentaje()" es una funcion generica que obtiene 
    el porcentaje equivalente a cualquier tipo de transaccion:
    depositos, retiros o pagos de servicios 
*/

function calcularSumatoriaPorTransaccion(tipoTransaccion) {

    console.log('tipoTransaccion: ' + tipoTransaccion);

    // obtenemos la lista de "transacciones" del Localstorage
    const transacciones = JSON.parse(localStorage.getItem("transacciones"));

    // obtenemos 'sumatoriaMonto' de dicho tipo de transaccion
    var sumatoria = 0;
    for (transaccion of transacciones) {
        if (transaccion.tipoTransaccion === tipoTransaccion) {
            sumatoria = parseFloat(sumatoria) + parseFloat(transaccion.cantidad);
        }
    }
    console.log('sumatoria: ' + sumatoria);

    return sumatoria;

}

/*
    La funcion "agregarTransaccion()" es una funcion generica que sirve 
    para agregar una transaccion de cualquier tipo en el LocalStorage
*/

function agregarTransaccion(tipoTransaccion, descripcion, cantidad) {
    
    // obtener fecha actual
    const date = new Date();
    const dateStr = date.toLocaleDateString() + " " + date.toLocaleTimeString();
    
    // crear un objeto de tipo Transaccion
    const transaccion = new Transaccion(dateStr, tipoTransaccion, descripcion, cantidad);

    // obteniendo la variable transacciones del Localstorage
    const transacciones = JSON.parse(localStorage.getItem("transacciones"));

    // agregamos la transaccion a la lista de transacciones
    transacciones.push(transaccion);

    // actualizamos la lista de transacciones dentro del LocalStorage
    localStorage.setItem("transacciones", JSON.stringify(transacciones));

}

/*
    La funcion "mostrarAlert()" es una funcion generica que sirve 
    para mostrar un SweetAlert en cualquier lugar de la aplicacion.
*/

function mostrarAlert(titulo, texto, icono){
    swal({
        title: titulo, 
        text: texto, 
        icon: icono
    }).then(
        function() { 
            location.reload();
        }
    );
}

/*
    La funcion "validarCantidadSoloNumeros()" es una funcion que sirve 
    para validar que la cantidad ingresada solo contenga numeros sin signos.
*/

function validarCantidadSoloNumeros(cantidad) {
    if (cantidad.startsWith("+") 
        || cantidad.startsWith("-")
        || cantidad.startsWith("*")
        || cantidad.startsWith("/")) {
            return false;
    } else {
        return true;
    }
}