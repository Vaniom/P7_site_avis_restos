var map, marker, rectangle, newResto;
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
    rectangle = new google.maps.Rectangle();
    map.addListener('bounds_changed', function(){
        let my_range = $(".js-range-slider").data("ionRangeSlider"); //stockage de l'instance du slider ds une variable
        my_range.reset();// reset des données du slider aux données initiales
        rectangle.setOptions({
            strokeColor: '#FF0000',
                strokeOpacity: 0.0,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.0,
                map: map,
                bounds: map.getBounds()
        });
        listUpdate();
        console.log(restoArray);
    })

    console.log("liste = " + liste);
    //Recuperation des données de restaurants
    function listUpdate() {
        restoArray.forEach(function(element){// on efface les marqueurs deja présents sur la carte
            element.marker.setMap(null);
        })
        restoArray.splice(0, restoArray.length);// On vide le tableau qui contient les objets
        var div = document.getElementById("listUL");
        div.innerHTML = "";
        liste.forEach(function(element) {// On boucle sur la liste et on instancie un nouvel objet pour chaque element du tableau
            newResto = new Restaurant(element.restaurantName, element.address, element.lat, element.long);
            newResto.ratings = element.ratings;
            restoArray.push(newResto);
            var timeoutID = window.setTimeout(newResto.isInRectangle, 1000);
            newResto.showInfos();
            newResto.clicOnMarker();
        })
    }
}