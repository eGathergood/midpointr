var geocoder;
var map;
var location1Input;
var place1;
var place2;
var answer;
var markers = [];
var infoWindows = [];

function initMap() {
    var mapDiv = document.getElementById('map');
    map = new google.maps.Map(mapDiv, {
        center: {lat: -0, lng: 0},
        zoom: 2
    });

    $('#gpsBtn').tooltip();

    geocoder = new google.maps.Geocoder;

    answer = document.getElementById('answer');

    location1Input = document.getElementById('location1');
    var autocomplete1 = new google.maps.places.Autocomplete(location1Input);

    var location2Input = document.getElementById('location2');
    var autocomplete2 = new google.maps.places.Autocomplete(location2Input);

    initialiseMarkers();
    configureListeners(autocomplete1, autocomplete2);

}

function midpoint() {
    if (place1 === undefined || place2 === undefined) {
        alertDialog("Please select valid locations.", true);
    } else {
        calculateMidpoint(place1.geometry.location, place2.geometry.location);
    }
}

function getGPS() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            map.setCenter(pos);
            map.setZoom(6);
            
            geocodeLatLng(geocoder, pos.lat, pos.lng).then(function (data) {
                location1Input.value = data;
                location1Input.focus();
            }, function (error) {
                console.log(error);
            });

        }, function () {
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

function geocodeLatLng(geocoder, latitude, longitude) {
    return new Promise(function (resolve, reject) {
        var latlng = {lat: parseFloat(latitude), lng: parseFloat(longitude)};
        geocoder.geocode({'location': latlng}, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    resolve(results[1].formatted_address);
                } else {
                    alertDialog('No results found', false);
                }
            } else {
                resolve("in the middle of nowhere!");
            }
        });
    })
}

function calculateMidpoint(location1, location2) {

// Calculate total distance
    var distance = google.maps.geometry.spherical.computeDistanceBetween(location1, location2);

    var message1 = message1 = "Location 1 is " + distance.toFixed(2) + " metres away from Location 2.";

// Get middle lat and lng
    var midpointCoords = google.maps.geometry.spherical.interpolate(location1, location2, 0.5);

// Get address of midpoint
    geocodeLatLng(geocoder, midpointCoords.lat(), midpointCoords.lng()).then(function (data) {

        var message2 = "The midpoint is " + data + " which is " + distance.toFixed(2) / 2 + " metres away.";
        alertDialog('<p>' + message1 + '</p><p>' + message2 + '</p>', false);

        var myLatLng = {lat: midpointCoords.lat(), lng: midpointCoords.lng()};
        markers[2].setPosition(myLatLng);
        markers[2].setVisible(true);

        closeInfoWindows();
        resizeMap();

        infoWindows[2].setContent(data);

    }, function (error) {
        console.log(error);
    });
}

function initialiseMarkers() {
    for (var i = 0; i < 3; i++) {
        var infowindow = new google.maps.InfoWindow();
        var marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29),
            animation: google.maps.Animation.DROP,
            strokeColor: "green"
        });

        google.maps.event.addListener(marker, 'click', (function (marker, infowindow) {
            return function () {
                infowindow.open(map, marker);
            };
        })(marker, infowindow));

        markers.push(marker);
        infoWindows.push(infowindow);
    }

    markers[2].setIcon('images/blue-pin.png');
}

function configureListeners(autocomplete1, autocomplete2) {
    // Configure Listeners for autocomplete inputs
    autocomplete1.addListener('place_changed', function () {
        closeInfoWindows();
        markers[0].setVisible(false);
        place1 = autocomplete1.getPlace();
        if (place1.geometry.viewport) {
            map.fitBounds(place1.geometry.viewport);
            map.setZoom(10);
        } else {
            map.setCenter(place1.geometry.location);
            map.setZoom(10);
        }

        markers[0].setPosition(place1.geometry.location);
        markers[0].setVisible(true);

        var address = '';
        if (place1.address_components) {
            address = generateAddress(place1.address_components);
        }

        infoWindows[0].setContent('<strong>' + place1.name + '</strong><br>' + address);

    });

    autocomplete2.addListener('place_changed', function () {
        closeInfoWindows();
        markers[1].setVisible(false);
        place2 = autocomplete2.getPlace();

        if (place2.geometry.viewport) {
            map.fitBounds(place2.geometry.viewport);
            map.setZoom(10);
        } else {
            map.setCenter(place2.geometry.location);
            map.setZoom(10);
        }

        markers[1].setPosition(place2.geometry.location);
        markers[1].setVisible(true);

        var address = '';
        if (place2.address_components) {
            address = generateAddress(place2.address_components);
        }

        infoWindows[1].setContent('<strong>' + place2.name + '</strong><br>' + address);
    });
}

function alertDialog(message, error) {
    if (error === true) {
        $('#alertDialog').removeClass('alert-info').addClass('alert-danger');
    } else {
        $('#alertDialog').removeClass('alert-danger').addClass('alert-info');
    }

    $('#alertDialog').html(message).fadeIn();
}

function generateAddress(location) {
    var address = [
        (location[0] && location[0].short_name || ''),
        (location[1] && location[1].short_name || ''),
        (location[2] && location[2].short_name || '')
    ].join(' ');

    return address;
}

function resizeMap() {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < markers.length; i++) {
        bounds.extend(markers[i].getPosition());
    }

    map.setCenter(bounds.getCenter());
    map.fitBounds(bounds);
}

function closeInfoWindows() {
    for (var i = 0; i < infoWindows.length; i++) {
        infoWindows[i].close();
    }
}

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-73677252-1', 'auto');
  ga('send', 'pageview');