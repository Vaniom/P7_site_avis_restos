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


function handleLocationError(browserHasGeolocation, marker, pos) {
    window.alert(browserHasGeolocation ?
        'Erreur: Le service de géolocalisation a échoué' :
        'Erreur: Votre navigateur ne supporte pas la geolocalisation');
}

   // Geolocalisation via Google API
   /*
    var req = new XMLHttpRequest();
    var url = "https://www.googleapis.com/geolocation/v1/geolocate?key=" + myApiKey;
    // Requête HTTP POST
    req.open("POST", url, false);
    // Envoi de la requête
    req.send(null);
    // Affiche la réponse reçue pour la requête    
    var userLocation = JSON.parse(req.response);
    var userLat = userLocation.location.lat;
    var userLng = userLocation.location.lng;
    console.log("userLat " + userLat);
    console.log("userLng " + userLng);
    var pos = {
        lat: userLat,
        lng: userLng
    };
    */
    var image = {
        url: './img/user_marker.png',
        // This marker is 60 pixels wide by 60 pixels high.
        size: new google.maps.Size(60, 60),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0),
        // The anchor for this image is at (30, 60).
        anchor: new google.maps.Point(30, 60)
      };
    map.setZoom(8);
    map.setCenter(pos);
    marker = new google.maps.Marker({
        position: pos,
        map: map,
        title: 'Vous êtes ici',
        icon: image
    });
}