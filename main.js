function initMap() {
	var mapDiv = document.getElementById('map');
	var map = new google.maps.Map(mapDiv, {
		center: {lat: -34.397, lng: 150.644},
		zoom: 6
	});

	var infoWindow = new google.maps.InfoWindow({map: map});
    var geocoder = new google.maps.Geocoder;

    // Set up google places autocomplete
    var location1Input = document.getElementById('location1');
    var autocomplete1 = new google.maps.places.Autocomplete(location1Input);

    var location2Input = document.getElementById('location2');
    var autocomplete2 = new google.maps.places.Autocomplete(location2Input);

    autocomplete1.addListener('place_changed', function() {
        var place1 = autocomplete1.getPlace();
        console.log(place1);
    });

    autocomplete2.addListener('place_changed', function() {
        var place2 = autocomplete2.getPlace();
        console.log(place2);
    });


    // Try HTML5 geolocation.
    if (navigator.geolocation) {
    	navigator.geolocation.getCurrentPosition(function(position) {
    		var pos = {
    			lat: position.coords.latitude,
    			lng: position.coords.longitude
    		};

    		infoWindow.setPosition(pos);
    		infoWindow.setContent('You are here!');
    		map.setCenter(pos);
            geocodeLatLng(location1Input, geocoder, pos.lat, pos.lng);

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

function geocodeLatLng(location1Input, geocoder, latitude, longitude) {
    var latlng = {lat: parseFloat(latitude), lng: parseFloat(longitude)};
    geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[1]) {
           location1Input.value = results[1].formatted_address;
       } else {
        window.alert('No results found');
    }
} else {
  window.alert('Geocoder failed due to: ' + status);
}
});
}