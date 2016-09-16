<?php
header('content-type: application/json; charset=utf-8');//HEADER PARA JSON
include_once 'puntosDao.php';
$ac = isset($_POST["tipo"])?$_POST["tipo"]:"x"; //PARAMETRO PARA DETERMINAR LA ACCION

switch ($ac) {
    case "grabar":
        $p = new puntosDao();
        $exito = $p->grabar($_POST["titulo"], $_POST["cx"], $_POST["cy"]);
        if($exito)
        {
            $r["estado"] = "ok";
            $r["mensaje"] = "Grabado Correctamente";
        }
        else
        {
            $r["estado"] = "error";
            $r["mensaje"] = "error al grabar!";
        }
    break;
		
		case "listar":
				$p = new puntosDao();
				$resultados =  $p->listar_todo();
				if (sizeof($resultados)>0) {
					$r["estado"] = "ok";
					$r["mensaje"] = $resultados;
				}
				else{
					$r["estado"] = "error";
					$r["mensaje"] = "No ahi registros!";
				}
		break;

   default:
        $r["estado"] = "error";
        $r["mensaje"] = "datos no válidos";
    break;
}
echo json_encode($r);//IMPRIMIR JSON
?>
