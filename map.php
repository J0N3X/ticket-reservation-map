<?php
$testi = array(
	"a1" => array(
		"x" => 362.3046875000001,
		"y" => 646.1601562500005,
		"status" => "free",
	),
	"a2" => array(
		"x" => 375.4414062500001,
		"y" => 646.1601562500005,
		"status" => "reserved",
	)
);
print json_encode($testi);
?>