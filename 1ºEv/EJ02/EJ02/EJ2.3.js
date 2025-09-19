//1-5
function retirarDinero(saldo, retirar, tieneTarjetaCredito = false) {
    //2
    if (saldo >= retirar) {
    const nuevoSaldo = saldo - retirar;
    //3
    console.log(`Retiro exitoso. Saldo restante: ${nuevoSaldo}`);
  } else if (tieneTarjetaCredito) {
    console.log("Saldo insuficiente, pagando con tarjeta de crédito");
  } 
  //4
  else {
    console.log("Saldo insuficiente");
  }
}

retirarDinero(1000, 500); 
retirarDinero(300, 500, true); 
