var geocoder;
var map;
var location1Input;
var place1;
var place2;
var answer;
var marker1;
var marker2;
var marker3;
var infowindow3;

function initMap() {
    var mapDiv = document.getElementById('map');
    map = new google.maps.Map(mapDiv, {
        center: {lat: -0, lng: 0},
        zoom: 2
    });

    $('#gpsBtn').tooltip();

    infoWindow = new google.maps.InfoWindow({map: map});
    geocoder = new google.maps.Geocoder;

    answer = document.getElementById('answer');

// Set up google places autocomplete
    location1Input = document.getElementById('location1');
    var autocomplete1 = new google.maps.places.Autocomplete(location1Input);

    var location2Input = document.getElementById('location2');
    var autocomplete2 = new google.maps.places.Autocomplete(location2Input);

// Initialise markers
    var infowindow1 = new google.maps.InfoWindow();
    marker1 = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    marker1.addListener('click', function () {
        infowindow1.open(map, marker1);
    });

    var infowindow2 = new google.maps.InfoWindow();
    marker2 = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    marker2.addListener('click', function () {
        infowindow2.open(map, marker2);
    });

    marker3 = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29),
        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
    });

  // Configure Listeners
    autocomplete1.addListener('place_changed', function () {
        infowindow1.close();
        marker1.setVisible(false);
        place1 = autocomplete1.getPlace();
        if (place1.geometry.viewport) {
            map.fitBounds(place1.geometry.viewport);
        } else {
            map.setCenter(place1.geometry.location);
            map.setZoom(6);
        }

        marker1.setPosition(place1.geometry.location);
        marker1.setVisible(true);

        var address = '';
        if (place1.address_components) {
            address = generateAddress(place1.address_components);
        }

        infowindow1.setContent('<strong>' + place1.name + '</strong><br>' + address);

    });

    autocomplete2.addListener('place_changed', function () {
        infowindow2.close();
        marker2.setVisible(false);
        place2 = autocomplete2.getPlace();

        if (place2.geometry.viewport) {
            map.fitBounds(place2.geometry.viewport);
        } else {
            map.setCenter(place2.geometry.location);
            map.setZoom(6);
        }

        marker2.setPosition(place2.geometry.location);
        marker2.setVisible(true);

        var address = '';
        if (place2.address_components) {
            address = generateAddress(place2.address_components);
        }

        infowindow2.setContent('<strong>' + place2.name + '</strong><br>' + address);
    });
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
                // alertDialog('<p>Could not determine location. Please enter a more detailed address.</p>', true);
                // console.log('Geocoder failed due to: ' + status);
                //addMarker(latlng);
                resolve("in the middle of nowhere!");
            }
        });
    })
}

function calculateMidpoint(location1, location2) {

infowindow3 = new google.maps.InfoWindow();
infowindow3.close();

// Calculate total distance
    var distance = google.maps.geometry.spherical.computeDistanceBetween(location1, location2);

    var message1 = message1 = "Location 1 is " + distance.toFixed(2) + " metres away from Location 2.";

// Get middle lat and lng
    var midpointCoords = google.maps.geometry.spherical.interpolate(location1, location2, 0.5);

// Get address of midpoint
    geocodeLatLng(geocoder, midpointCoords.lat(), midpointCoords.lng()).then(function (data) {
        marker3.setVisible(false);
        var message2 = "The midpoint is " + data + " which is " + distance.toFixed(2) / 2 + " metres away.";
        alertDialog('<p>' + message1 + '</p><p>' + message2 + '</p>', false);

        var myLatLng = {lat: midpointCoords.lat(), lng: midpointCoords.lng()};
        marker3.setPosition(myLatLng);
        marker3.setVisible(true);

        var markers = [marker1, marker2, marker3];//some array
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markers.length; i++) {
            bounds.extend(markers[i].getPosition());
        }

        infowindow3.setContent(data);

        marker3.addListener('click', function () {
            infowindow3.open(map, marker3);
        });

        map.setCenter(bounds.getCenter());
        map.fitBounds(bounds);

    }, function (error) {
        console.log(error);
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