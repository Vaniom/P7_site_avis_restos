var map, marker;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 48.864716,
            lng: 2.349014
        },
        zoom: 6
    });

    // Try HTML5 geolocation.
    var pos;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            marker.setPosition(pos);
            marker.setTitle('Votre position');
            map.setZoom(9);
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, marker, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, map.getCenter());
    }
    marker = new google.maps.Marker({
        position: pos,
        map: map
    });
}

function handleLocationError(browserHasGeolocation, marker, pos) {
    window.alert(browserHasGeolocation ?
        'Erreur: Le service de géolocalisation a échoué' :
        'Erreur: Votre navigateur ne supporte pas la geolocalisation');
}