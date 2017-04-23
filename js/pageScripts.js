var map
	, $ = jQuery
	, slots = {}
	,pisteet = []
	, vectorLayer
	, vectorSource
	, deletaus = false
	;
var freeStyle = new ol.style.Style({
	image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
		anchor: [5, 5],
		anchorXUnits: 'pixels',
		anchorYUnits: 'pixels',
		src: '/ticket-reservation-map/img/vapaa.png'
	}))
});
var reserved = new ol.style.Style({
	image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
		anchor: [5, 5],
		anchorXUnits: 'pixels',
		anchorYUnits: 'pixels',
		src: '/ticket-reservation-map/img/varattu.png'
	}))
});
// Alustava varaus
var av = new ol.style.Style({
	image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
		anchor: [5, 5],
		anchorXUnits: 'pixels',
		anchorYUnits: 'pixels',
		src: '/ticket-reservation-map/img/av.png'
	}))
});
$(document).ready(function() {

	var kartta = new Image();
	kartta.src = "/ticket-reservation-map/img/urheilutalo_paikkakartta.svg";
	kartta.onload = function() {
		var extent = [0, 0, kartta.width, kartta.height];
		var projection = new ol.proj.Projection({
			code: 'xkcd-image',
			units: 'pixels',
			extent: extent
		});
		map = new ol.Map({
			layers: [
				new ol.layer.Image({
					source: new ol.source.ImageStatic({
						url: '/ticket-reservation-map/img/urheilutalo_paikkakartta.png',
						projection: projection,
						imageExtent: extent
					})
				})
			],
			restrictedExtent: extent,
			target: 'map',
			view: new ol.View({
				projection: projection,
				center: ol.extent.getCenter(extent),
				zoom: 1,
				maxZoom: 4,
				minZoom: 1,
				extent: extent
			})
		});
		map.on('click', function(evt) {
			console.info(evt.coordinate);
			var feature = map.forEachFeatureAtPixel(evt.pixel,
				function(feature) {
					return feature;
				});
			if (feature) {
				slotInformation(feature.get("slot"))
			}else{
				uudenPisteenLisays(evt.coordinate[0], evt.coordinate[1])
			}
		});

		loadPointInfo();
	}
})

function loadPointInfo() {
	$.ajax({
		url: "/ticket-reservation-map/map.php",
		dataType: "json",
		success: function(result) {
			console.log(result);
			updatePoints(result);
		}
	})
}
function updatePoints(points) {
	let toRun = false;
	for (var i in points) {
		if (points.hasOwnProperty(i)) {
			if (slots.hasOwnProperty(i)) {
				slots[i].status = points[i].status;
				if(slots[i].status === "free"){
					slots[i].point.setStyle(freeStyle);
				}else{
					slots[i].point.setStyle(reserved);
				}
			} else {
				toRun = true;
				//create the slot
				var iconFeature = new ol.Feature({
					geometry: new ol.geom.Point([points[i].x, points[i].y]),
					name: 'Testi',
					slot: i
				});
				if(points[i].status === "free"){
					iconFeature.setStyle(freeStyle);
				}else if(points[i].status === "reserved"){
					iconFeature.setStyle(reserved);
				}else if(points[i].status === "av"){
					iconFeature.setStyle(av);
				}
				iconFeature.on("click", slotInformation.bind(slots[i]))
				pisteet.push(iconFeature);

				slots[i] = {
					x: points[i].x,
					y: points[i].y,
					status: points[i].status,
					point:iconFeature,
				}
			}
		}
	}
	if(toRun){
		vectorSource = new ol.source.Vector({
			features: pisteet //add an array of features
		});

		vectorLayer = new ol.layer.Vector({
			source: vectorSource,
			style: freeStyle
		});
		map.addLayer(vectorLayer);
	}

}

function uudenPisteenLisays(x, y){
	// Täääääää sitten tulee olemaan ihna vitun reikänen paska.
	// Tätä kutsutaan jos pistettä clickauksen alla ei ole. Luo pisteen vapaa statuksella
	// TODO: tietojen kantaan kirjoittaminen
	var iconFeature = new ol.Feature({
		geometry: new ol.geom.Point([x, y]),
		name: 'Testi',
		slot: "xy"
	});
	iconFeature.setStyle(freeStyle);
	pisteet.push(iconFeature);
	vectorSource.addFeature(iconFeature)
	var slot = prompt("Paikkaid", "a1");
	if(slot != null){
		$.ajax({
		url: "/ticket-reservation-map/addSlot.php",
		type: "POST",
		dataType: "json",
		data: {slot: slot, xCoord: x, yCoord: y},
		success: function(result) {
			console.log(result)
		},
		error: function(error){
			console.log(error)
		}
	})
	}
}

function slotInformation(index){
	// Eli nyt käyttäjä on valinnut paikan <index>(slots[index])
	// Kerrotaan palvelimelle siitä

	//DELETE TESTI
	if(deletaus){
		$.ajax({
			url: "/ticket-reservation-map/delete.php",
			type: "POST",
			dataType: "json",
			data: {slot: index},
			success: function(result) {
				if(result["error"] === false){
					console.log(index + "poistettiin")
				}
			},
			error: function(error){
				console.log(error)
			}
		})
	}else{

		let time = new Date().getTime();
		$.ajax({
			url: "/ticket-reservation-map/reserve.php",
			type: "POST",
			dataType: "json",
			data: {time:time, slot: index},
			success: function(result) {
				console.log(result)
				if(result["error"] === false){
					slots[index].point.setStyle(av);
				}
			},
			error: function(error){
				console.log(error)
			}
		})
	}
}

function freeASlot(index){
	$.ajax({
		url: "/ticket-reservation-map/freeup.php",
		type: "POST",
		dataType: "json",
		data: {slot: index},
		success: function(result) {
			if(result["error"] === false){
				slots[index].point.setStyle(freeStyle);
				console.log("slot freed");
			}
		},
		error: function(error){
			console.log(error)
		}
	})
}