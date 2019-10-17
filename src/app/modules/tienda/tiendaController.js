app.controller("tiendaController", ["rutas", "Producto","SessionStorage","Auth", function(rutas, Producto, SessionStorage, Auth){
    var ctrl = this;
    ctrl.rutas = rutas;
     Producto.query(function(res){
        ctrl.productos = res;
    });

    ctrl.usuario = Auth.parseToken(Auth.getToken()).email;
      var carritoCompra = SessionStorage.getObject('carrito') || []
       ctrl.shoppingCar = SessionStorage.getObject('carrito') || []
       ctrl.tlt = SessionStorage.getObject('total');

    ctrl.addProducto = function (producto, cantidad){

           var encontrado = carritoCompra.findIndex(function(produc){
                return produc.id == producto.id;
            })


        if (encontrado==-1) {
            var objProducto = {
                id: producto.id,
                producto: producto.nombre,
                precio: producto.precio,
                cantidad: producto.cantidad
            }
            carritoCompra.push(objProducto)

        } else {
            carritoCompra[encontrado].cantidad =  (carritoCompra[encontrado].cantidad + producto.cantidad);
        }

        ctrl.shoppingCar = carritoCompra;
        ctrl.tlt = ctrl.total();
        actualizaSessionStorage()
        
    }


    ctrl.total = function () {
      return  carritoCompra.reduce(function(resultado, ValorActual){
            resultado['total'] = (ValorActual.precio * ValorActual.cantidad) + ( resultado['total'] ? resultado['total'] : 0);
            resultado['cantidad'] = ValorActual.cantidad + ( resultado['cantidad'] ? resultado['cantidad'] : 0);
        return resultado;
        }, {})
    }


    ctrl.eliminar = function(id){
       
       var temp =  ctrl.shoppingCar.filter( function (a){
          var result = (a.id != id); 
          return result;
        })

        carritoCompra = temp.length > 0 ? temp : [];
        ctrl.shoppingCar = temp.length > 0 ? temp : null;
        ctrl.tlt = ctrl.total();
        actualizaSessionStorage();
   }


    ctrl.comprar = function(){
        console.log('comprando');
        
    }
   

    function actualizaSessionStorage(){
        SessionStorage.setObject('carrito', ctrl.shoppingCar);
        SessionStorage.setObject('total', ctrl.tlt);
    }
}]);