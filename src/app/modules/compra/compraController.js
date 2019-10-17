app.controller("compraController", ["rutas", "Compra", function(rutas, Compra){
    var ctrl = this;
    ctrl.rutas = rutas;
    //console.log("imprimeindo compras:",Compra.get());
    ctrl.compras =  null; 
    Compra.query(function(resp){
        ctrl.compras = resp;
    });

    
}]);