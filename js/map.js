var map, marker, rectangle;

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
        //Recupération des coordonnées de l'utilisateur
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

    function handleLocationError(browserHasGeolocation, marker, pos) {
        window.alert(browserHasGeolocation ?
            'Erreur: Le service de géolocalisation a échoué' :
            'Erreur: Votre navigateur ne supporte pas la geolocalisation');
    }
    // placement d'un marqueur à la position de l'utilisateur
    marker = new google.maps.Marker({
        map: map,
        icon: './img/user_marker.png'
    });

    // definition d'un polygone aux dimensions de la zone affichée
    rectangle = new google.maps.Polygon(
        {
            strokeColor: '#FF0000',
            strokeOpacity: 0.0,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.0,
            map: map
          }
    );
    //on recupere les coordonnées de limite de carte à chaque redimensionnement pour faire varier le rectangle en fonction
    map.addListener('bounds_changed', function(){
        var bds = map.getBounds();
        var rectangleCoord = [
            {lat: bds.la.j, lng: bds.ea.j},
            {lat: bds.la.l, lng: bds.ea.j},
            {lat: bds.la.l, lng: bds.ea.l},
            {lat: bds.la.j, lng: bds.ea.l},
            {lat: bds.la.j, lng: bds.ea.j}
        ]
        rectangle.setPath(rectangleCoord);
        listUpdate();
    })

    console.log("liste = " + liste);
    //Recuperation des données de restaurants
    function listUpdate() {
        liste.forEach(function(element) {
            var restoPos = {
                lat: element.lat,
                lng: element.long
            };
            var restoName = element.restaurantName;
            //Placement d'un marqueur pour chaque resto
            var restoMarker = new google.maps.Marker({
                position: restoPos,
                map: map,
                label: restoName,
                icon: './img/restaurant.png'
            });
            //On verifie pour chaque resto s'il est dans la zone d'affcihage ou non, et on actualise l'affichage de la liste en fonction
            function isInRectangle(){
                var pointLat = element.lat;
                var pointLng = element.long;
                var point = new google.maps.LatLng(pointLat, pointLng);
                console.log("point = " + point);
                if (google.maps.geometry.poly.containsLocation(point, rectangle)){
                    console.log("IN");
                    var elm = document.getElementById(restoName);
                    console.log("restoname = " + restoName);
                    elm.classList.add("show");
                }else {
                    console.log("OUT");
                    var elm = document.getElementById(restoName);
                    elm.classList.remove("show");
                }
            }
            var timeoutID = window.setTimeout(isInRectangle, 1000);     
        })
    }
}
