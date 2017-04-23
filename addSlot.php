<?php
$servername = "localhost";
$database ="tapahtuma_1_paikat";
$username = "test";
$password = "test";
$slot = mysql_real_escape_string($_POST["slot"]);
$xCoord = floatval(mysql_real_escape_string($_POST["xCoord"]));
$yCoord = floatval(mysql_real_escape_string($_POST["yCoord"]));
$time = 0;

try{
	$conn = new mysqli($servername, $username, $password, $database);

	$queryStr = "SELECT * FROM paikat WHERE paikka='$slot'  ORDER BY paikka ASC";
	$result = $conn->query($queryStr);
	if($result->num_rows === 0){
		$insertti = "INSERT INTO paikat (paikka, status, xCoord, yCoord, owner, avTime) VALUES (\"$slot\", \"free\", $xCoord, $yCoord, \"Dataday\", 0)";
		$resultti = $conn->query($insertti);
			if( $resultti === TRUE){
				print json_encode(array("error" => false));
			}else{
				print json_encode(array("error" => true, "debug" => array(
					"x" => $xCoord,
					"y" => $yCoord,
					"slot" => $slot,
					"result" => $resultti,
					"insert" => $insertti
				)));
			}
	} else {
		print json_encode(array("error" => true, "cause", "paikka on jo olemassa"));
	}
	$conn->close();
	return;
}
catch(mysqli_sql_exception $ex){
	print json_encode(array("error" => $ex));
	return;
}


?>