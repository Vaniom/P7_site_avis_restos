var map, marker, rectangle;
var restoArray = [];

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
        console.log(restoArray);
    })

    console.log("liste = " + liste);
    //Recuperation des données de restaurants
    function listUpdate() {
        restoArray.splice(0, restoArray.length);
        var div = document.getElementById("listUL");
        div.innerHTML = "";
        liste.forEach(function(element) {
            var newResto = new Restaurant(element.restaurantName, element.address, element.lat, element.long);
            newResto.ratings = element.ratings;
            restoArray.push(newResto);
            var timeoutID = window.setTimeout(newResto.isInRectangle, 1000);
            newResto.showInfos();
        })
    }
}
