var map;
$(document).ready(function(){

	var kartta = new Image();
	kartta.src = "/ticket-reservation-map/img/urheilutalo_paikkakartta.svg";
	kartta.onload = function(){
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
	}


})

