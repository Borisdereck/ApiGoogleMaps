<?php
include_once 'conex.php';//INCLUIR CONEXION DE BASE DE DATOS

class puntosDao
{
    private $r;
    public function __construct()
    {
        $this->r = array();
    }
    public function grabar($titulo, $cx,$cy)//METODO PARA GRABAR A LA BD
    {
        $con = conex::con();
        $titulo = mysql_real_escape_string($titulo);
        $cx = mysql_real_escape_string($cx);
        $cy = mysql_real_escape_string($cy);
        $q = "insert into puntos (Titulo, cx, cy)".
             "values ('".addslashes($titulo)."','".addslashes($cx)."','".addslashes($cy)."')";
        $rpta = mysql_query($q, $con);
        mysql_close($con);
        if($rpta==1)
        {
            return TRUE;
        }
        else
        {
            return FALSE;
        }
    }

		public function borrar($id){

			$con = conex::con();
			$idpunto = mysql_real_escape_string($id);
			$q = "delete from puntos where IdPunto = ".(int)$idpunto;
			$rpta = mysql_query($q, $con);
			mysql_close($con);
			if($rpta==1)
			{
					return TRUE;
			}
			else
			{
					return FALSE;
			}
		}

		public function listar_todo(){
				$q = "select * from puntos";
				$con = conex::con();
				$rpta = mysql_query($q,$con);
				mysql_close($con);
				while ($fila = mysql_fetch_assoc($rpta)) {
						$this->r[] = $fila;
				}
				return $this->r;
		}
 }
?>
