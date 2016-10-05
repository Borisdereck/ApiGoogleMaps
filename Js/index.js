var marcadores_nuevos = [];
var marcadores_db = [];
var mapa= null;

function quitar_marcadores(lista) {
    for (var i = 0; i < lista.length; i++) {
        lista[i].setMap(null);
    }

}

$(document).on("ready", function() {

    var formulario = $("#formulario");
    var punto = new google.maps.LatLng(10.9685400, -74.7813200);
    var config = {
        zoom: 11,
        center: punto,
        mapTypeId: google.maps.MapTypeId.STREETMAP
    };

     mapa = new google.maps.Map($("#mapa")[0], config);
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

				//mostramos y escondemos los paneles
				$("#collapseOne").collapse("show");
				$("#collapseTwo").collapse("hide");

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
    $("#btn-grabar").on("click", function() {
        var f = $("#formulario");
				if (f.find("input[name='titulo']").val().trim()=="") {
					alert("falta TItulo");
					return false;
				}
				if (f.find("input[name='cx']").val().trim()=="") {
					alert("falta COordenada X");
					return false;
				}
				if (f.find("input[name='cy']").val().trim()=="") {
					alert("falta COordenada Y");
					return false;
				}
				if (f.hasClass("busy")) {


					return false;
				}
				f.addClass("busy");
				var loader_grabar = $("#loader_grabar");
        $.ajax({
            type: "post",
            url: "Script/iajax.php",
            dataType: "JSON",
            data: f.serialize() + "&tipo=grabar",
            success: function(data) {
                //alert(data.mensaje);
								if (data.estado == "ok" ) {
									loader_grabar.removeClass("label-warning").addClass("label-success").text("Datos Grabados!").delay(3000).slideUp();
										listar();
								} else {
									alert(data.mensaje);
								}

            },
            beforeSend: function() {
								loader_grabar.removeClass("label-success").addClass("label label-warning").text("Procesando...").slideDown();
            },
            complete: function() {
							f.removeClass("busy");

								$("form")[0].reset();
            }
        });
        return false;
    });

		$("#botonborrar").on("click", function(){
			if (confirm("esta Seguro?")== false) {
				return;
			}
			var f = $("#formulario_edicion");
				$.ajax({
						type: "POST",
						url: "Script/iajax.php",
						data: f.serialize() + "&tipo=borrar",
						dataType: "JSON",
						success:function(data){
								if (data.estado == "ok") {
									alert(data.mensaje);
									//quitar_marcadores(marcadores_nuevos);
									//$("formulario_edicion")[0].reset();
									listar();
								} else {
										alert(data.mensaje);
								}
						},
						beforeSend:function(){

						},
						complete:function(){
								$("#formulario_edicion")[0].reset();
						}
				});
		});
    //cargar puntos al terminar de cargar la pagination
    listar();
});
//fuera del document on ready




function listar() {
		quitar_marcadores(marcadores_db);
		var formulario_edicion = $("#formulario_edicion");

    $.ajax({
        type: "post",
        url: "Script/iajax.php",
        dataType: "JSON",
        data: "&tipo=listar",
        success: function(data) {
            if (data.estado == "ok") {
                $.each(data.mensaje, function(i, item) {
                    var posi = new google.maps.LatLng(item.cx, item.cy);
                    var marca = new google.maps.Marker({
                        idMarcador: item.IdPunto,
                        position: posi,
                        titulo: item.Titulo,
												cx: item.cx,
												cy: item.cy,
												imagen: item.imagen
                    });
                    //agregar evento click al marcador
                    google.maps.event.addListener(marca, "click", function() {
											//Mostramos la informacion en un alert
												//alert("hiciste click en: "+marca.idMarcador + " - " +marca.titulo);
												$("#collapseTwo").collapse("show");
												$("#collapseOne").collapse("hide");


												formulario_edicion.find("input[name='id']").val(marca.idMarcador);
												formulario_edicion.find("input[name='titulo']").val(marca.titulo).focus();
												formulario_edicion.find("input[name='cx']").val(marca.cx);
												formulario_edicion.find("input[name='cy']").val(marca.cy);

												 $('#myModal').modal('show');

												 $("#tituloinfo").text(marca.titulo);
												 $("#promo").attr("src","http://localhost/apigooglemaps/img/"+marca.imagen);






                    });
                    marcadores_db.push(marca);
                    marca.setMap(mapa);

                });
            } else {
                alert("Hay puntos en la db");
            }
        },
        beforeSend: function() {

        },
        complete: function() {

        }
    })
}//cierre de la funcion listar
