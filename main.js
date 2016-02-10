var infoWindow;
var geocoder;
var map;
var location1Input;
var place1;
var place2;

function initMap() {
	var mapDiv = document.getElementById('map');
	map = new google.maps.Map(mapDiv, {
		center: {lat: -0, lng: 0},
		zoom: 2
	});

    infoWindow = new google.maps.InfoWindow({map: map});
    geocoder = new google.maps.Geocoder;

    // Set up google places autocomplete
    location1Input = document.getElementById('location1');
    var autocomplete1 = new google.maps.places.Autocomplete(location1Input);

    var location2Input = document.getElementById('location2');
    var autocomplete2 = new google.maps.places.Autocomplete(location2Input);

    autocomplete1.addListener('place_changed', function() {
        place1 = autocomplete1.getPlace();
    });

    autocomplete2.addListener('place_changed', function() {
        place2 = autocomplete2.getPlace();
    });   
}

function midpoint () {
    if(place1 === undefined || place2 === undefined) {
        window.alert("Please select valid locations.");
    } else {
        calculateMidpoint(place1.geometry.location, place2.geometry.location);
    }
}

function getGPS () {
     // Try HTML5 geolocation.
     if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            gpsFlag = true;

            infoWindow.setPosition(pos);
            infoWindow.setContent('You are here!');
            map.setCenter(pos);
            map.setZoom(6);
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
             location1Input.focus();
         } else {
            window.alert('No results found');
        }
    } else {
      window.alert('Geocoder failed due to: ' + status);
  }
});
}

function calculateMidpoint (location1, location2) {
    var distance = google.maps.geometry.spherical.computeDistanceBetween(location1, location2);
    console.log(distance);
    var message = place1.address_components[2].long_name + " is " + distance.toFixed(2) + " metres away from " + place2.address_components[2].long_name;
    window.alert(message);

    var midpoint = google.maps.geometry.spherical.interpolate(location1, location2, 0.5);
    console.log(midpoint.lat());
    console.log(midpoint.lng());
}