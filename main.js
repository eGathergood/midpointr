function initMap() {
    var mapDiv = document.getElementById('map');
    var map = new google.maps.Map(mapDiv, {
      center: {lat: -34.397, lng: 150.644},
      zoom: 6
    });

    // Try HTML5 geolocation.
  if (navigator.geolocation) {
  	navigator.geolocation.getCurrentPosition(function(position) {
  		var pos = {
  			lat: position.coords.latitude,
  			lng: position.coords.longitude
  		};
  		map.setCenter(pos);
  	}, function() {
  		handleLocationError(true, map.getCenter());
  	});
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, map.getCenter());
}
}

function handleLocationError(browserHasGeolocation, pos) {
	console.log("GPS not supported.")
}