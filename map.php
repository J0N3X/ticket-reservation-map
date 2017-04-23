<?php
$servername = "localhost";
$database ="tapahtuma_1_paikat";
$username = "test";
$password = "test";
$slots = array();

try{
	$conn = new mysqli($servername, $username, $password, $database);

	$queryStr = "SELECT * FROM paikat ORDER BY paikka ASC";
	$result = $conn->query($queryStr);
	if($result->num_rows > 0){
		while($row = $result->fetch_assoc()) {
			$slots[$row["paikka"]] = array(
				"x" => $row["xCoord"],
				"y" => $row["yCoord"],
				"status" => $row["status"],
				"owner" => $row["owner"],
				"avTime" => $row["avTime"],
			);
		}
	}
	$conn->close();
}
catch(mysqli_sql_exception $ex){
	$slots["error"] = $ex;
}


print json_encode($slots);
?>