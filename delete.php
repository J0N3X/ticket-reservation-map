<?php

$servername = "localhost";
$database ="tapahtuma_1_paikat";
$username = "test";
$password = "test";
$slot = mysql_real_escape_string($_POST["slot"]);

try{
	$conn = new mysqli($servername, $username, $password, $database);

	$queryStr = "DELETE FROM paikat WHERE paikka = \"$slot\"";
	$result = $conn->query($queryStr);
	if($result === TRUE){
		print json_encode(array("error" => false));
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