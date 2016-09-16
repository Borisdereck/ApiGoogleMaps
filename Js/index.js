
var marcadores_nuevos = [];
var marcadores_db = [];

function quitar_marcadores(lista) {
		for (var i = 0; i < lista.length; i++) {
			lista[i].setMap(null);
		}

}

$(document).on("ready", function() {

		var formulario = $("#formulario");
    var punto = new google.maps.LatLng(10.9685400, -74.7813200);
    var config = {
        zoom: 12,
        center: punto,
        mapTypeId: google.maps.MapTypeId.STREETMAP
    };

    var mapa = new google.maps.Map($("#mapa")[0], config);
    //Evento Click que nos devuelve la posicion
    google.maps.event.addListener(mapa, "click", function(event) {
        //alert(event.latLng);
        //convierte coordenadas a string
        var coordenadas = event.latLng.toString();
        //reemplaza el ( por espacio
        coordenadas = coordenadas.replace("(", "");
        coordenadas = coordenadas.replace(")", "");
        //imprime las cooredenadas en string
        //alert("las Coordenadas son: " + coordenadas);
        //arma un vector con los datos q esten separados con la coma(,) con las coordenada x & y
        var lista = coordenadas.split(",");
        //alert("la coordenada x: "+lista[0]);
        //alert("la coordenada Y: "+lista[1]);

        //variable para el marcador
        var direccion = new google.maps.LatLng(lista[0], lista[1]);
        var marcador = new google.maps.Marker({
            //titulo		:prompt("Nombre del Lugar"),
            position: direccion, //posicion del marcador
            map: mapa, //en que mapa se ubicara
            animation: google.maps.Animation.DROP, //con que efecto aparecera el marcador
            draggable: false //no permitir arrastrar el marcador
        });

				//pasar las coordenadas al formulario
				formulario.find("input[name='cx']").val(lista[0]);
				formulario.find("input[name='cy']").val(lista[1]);

				formulario.find("input[name='titulo']").focus();

        //guardar el marcador en el array
        marcadores_nuevos.push(marcador);

        //agreagr evento click al marcador para mostrar el titulo
        google.maps.event.addListener(marcador, "click", function() {
            //alert(marcador.titulo);
        });

        quitar_marcadores(marcadores_nuevos);
        //ubicar el marcador
        marcador.setMap(mapa);




    });
			$("#btn-grabar").on("click", function(){
				var f = $("#formulario");
					$.ajax({
						type		:"post",
						url			:"Script/iajax.php",
						dataType:"JSON",
						data		:f.serialize()+"&tipo=grabar",
						success	:function(data){
								alert(data.mensaje)
						},
						beforeSend:function(){

						},
						complete:function(){

						}
					})
				return false;
			});
});
