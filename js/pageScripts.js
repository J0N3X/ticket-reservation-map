var map
	, $ = jQuery
	, slots = {}
	,pisteet = []
	, vectorLayer
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
			var feature = map.forEachFeatureAtPixel(evt.pixel,
				function(feature) {
				return feature;
				});
			if (feature) {
				slotInformation(feature.get("slot"))
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
				}else{
					iconFeature.setStyle(reserved);
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
		var vectorSource = new ol.source.Vector({
			features: pisteet //add an array of features
		});

		vectorLayer = new ol.layer.Vector({
			source: vectorSource,
			style: freeStyle
		});
		map.addLayer(vectorLayer);
	}

}

function slotInformation(index){
	console.log(slots[index])
}