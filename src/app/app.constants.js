app.constant("rutas", (function() {
	var appBaseUrl = "#";
	return {
		appBaseUrl : appBaseUrl,
		home : "/",
		banda : "/banda",
		discografia : "/discografia",
		contacto : "/contacto",
		obituario : "/obituario",
		login : "/login",
		logout : "/logout",
		dashboard : "/dashboard",
		compra : "/compra",
		tienda : "/tienda"
	}
})());

app.constant("api", (function() {
	var baseUrl = "http://localhost:3000/api";
	return {
		baseUrl : baseUrl
	}
})());