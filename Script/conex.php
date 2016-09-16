<?php
class conex{

	public static function con(){
		$conexion = mysql_connect("localhost","root","");
		mysql_select_db("bies");
		mysql_query("SET NAMES 'utf-8'");
		if(!$conexion){
			return false;
		}
		else{
			return $conexion;
		}
	}


}



 ?>
