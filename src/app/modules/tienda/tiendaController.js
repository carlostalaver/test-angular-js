app.controller("tiendaController", ["rutas", "Producto", "SessionStorage", "Auth", "Compra", function (rutas, Producto, SessionStorage, Auth, Compra) {
  var ctrl = this;
  ctrl.rutas = rutas;
  ctrl.irCompras = false;
  Producto.query(function (res) {
    ctrl.productos = res;
  });

  ctrl.msj = "Sin items en el carrito."

  ctrl.usuario = Auth.parseToken(Auth.getToken()).email;
  var carritoCompra = SessionStorage.getObject('carrito') || []
  ctrl.shoppingCar = SessionStorage.getObject('carrito') || []
  ctrl.tlt = SessionStorage.getObject('total');

  ctrl.addProducto = function (producto, cantidad) {

    var encontrado = carritoCompra.findIndex(function (produc) {
      return produc.id == producto.id;
    })


    if (encontrado == -1) {
      var objProducto = {
        id: producto.id,
        nombre: producto.nombre,
        desc: producto.desc,
        urlImagen: producto.urlImagen,
        precio: producto.precio,
        moneda: producto.moneda,
        stock: producto.stock,
        cantidad: producto.cantidad
      }
      carritoCompra.push(objProducto)

    } else {
      carritoCompra[encontrado].cantidad = (carritoCompra[encontrado].cantidad + producto.cantidad);
    }

    ctrl.shoppingCar = carritoCompra;
    ctrl.tlt = ctrl.total();
    actualizaSessionStorage()

  }


  ctrl.total = function () {
    return carritoCompra.reduce(function (resultado, ValorActual) {
      resultado['total'] = (ValorActual.precio * ValorActual.cantidad) + (resultado['total'] ? resultado['total'] : 0);
      resultado['cantidad'] = ValorActual.cantidad + (resultado['cantidad'] ? resultado['cantidad'] : 0);
      return resultado;
    }, {})
  }


  ctrl.eliminar = function (id) {

    var temp = ctrl.shoppingCar.filter(function (a) {
      var result = (a.id != id);
      return result;
    })

    carritoCompra = temp.length > 0 ? temp : [];
    ctrl.shoppingCar = temp.length > 0 ? temp : null;
    ctrl.tlt = ctrl.total();
    actualizaSessionStorage();
  }


  ctrl.comprar = function () {
   var compras = {
    "fecha": new Date(),
    "items": [carritoCompra],
    "precioTotal": ctrl.tlt.total,
    "cantidadTotal": ctrl.tlt.cantidad,
    "moneda": "CLP",
    "usuario": ctrl.usuario,
    "estado": "enviada",
  
   }
    Compra.save(compras,function(){
        console.log('Compra procesada');
        
    })//endCompra
    
    ctrl.msj = "La compra ha sido exitosa"
    clearSession();

  }


  function actualizaSessionStorage() {
    SessionStorage.setObject('carrito', ctrl.shoppingCar);
    SessionStorage.setObject('total', ctrl.tlt);
  }

  function clearSession() {
    compras = {};
    ctrl.tlt = null;
    ctrl.irCompras = true;
    ctrl.shoppingCar = null;
    ctrl.carritoCompra = null;
    SessionStorage.remove('carrito');
    SessionStorage.remove('total');
  }
}]);