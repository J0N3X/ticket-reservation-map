<?php
$servername = "localhost";
$database ="tapahtuma_1_paikat";
$username = "test";
$password = "test";
$slot = mysql_real_escape_string($_POST["slot"]);

try{
	$conn = new mysqli($servername, $username, $password, $database);

	$queryStr = "SELECT * FROM paikat WHERE paikka='$slot'  ORDER BY paikka ASC";
	$result = $conn->query($queryStr);
	if($result->num_rows > 0){
		$free = false;
		while($row = $result->fetch_assoc()) {
			if($row["status"] === "free"){
				$free = true;
			}else if($row["status"] === "reserved") {
				$free = false;
				print json_encode(array("error" => true, "cauese" => "reserved"));
			}
		}
		if(!$free){
			$updateQuery = "UPDATE paikat SET status = 'free' WHERE paikka='$slot'";
			$newResult = $conn->query($updateQuery);
			if($result->num_rows > 0){
				print json_encode(array("error" => false));
			}
		}else{
			print json_encode(array("error" => true, "cause" => "free"));
		}

	}
	$conn->close();
	return;
}
catch(mysqli_sql_exception $ex){
	print json_encode(array("error" => $ex));
	return;
}
?>