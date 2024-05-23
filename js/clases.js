class Usuario {
    constructor(nombre, pin, cuenta) {
       this.nombre = nombre;
       this.pin = pin;
       this.cuenta = cuenta;
    }
 }

 /*
   fecha: es la fecha y hora actual
   tipoTransaccion: pueden ser: Deposito, Retiro, Pago de Servicio
   descripcion: pueden ser: Deposito, Retiro, (Energia Electrica, Agua Potable, Internet, etc)
   cantidad: es la cantidad a depositar, retirar o pagar (Ej: $500)
 */
class Transaccion {
   constructor(fecha, tipoTransaccion, descripcion, cantidad) {
      this.fecha = fecha;
      this.tipoTransaccion = tipoTransaccion;
      this.descripcion = descripcion;
      this.cantidad = cantidad;
   }
}