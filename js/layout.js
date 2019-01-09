function Layout(name) {
    var self = this;
    this.name = name;
    this.restoArray = [];
    this.userCreated = [];
    this.map = map;
    this.init = function(){
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
            var my_range = $(".js-range-slider").data("ionRangeSlider"); //stockage de l'instance du slider ds une variable
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
            self.listUpdate();
            console.log(self.restoArray);
        });
        var listener1 = rectangle.addListener("click", function(event){
            self.addRestaurant(event.latLng, map, listener1);
        });
    
        console.log("liste = " + liste);
    };
    this.listUpdate = function(){
        var restoArray = self.restoArray;
        var userCreated = self.userCreated;
            restoArray.forEach(function(element){// on efface les marqueurs deja présents sur la carte
                element.marker.setMap(null);
            });
            restoArray.splice(0, restoArray.length);// On vide le tableau qui contient les objets
            var div = document.getElementById("listUL");
            div.innerHTML = "";
            userCreated.forEach(function(element){
                liste.push(element);
            });
            userCreated.splice(0, userCreated.length);
            liste.forEach(function(element) {// On boucle sur la liste et on instancie un nouvel objet pour chaque element du tableau
                newResto = new Restaurant(element.restaurantName, element.address, element.lat, element.long);
                newResto.ratings = element.ratings;
                restoArray.push(newResto);
                var timeoutID = window.setTimeout(newResto.isInRectangle, 1000);
                newResto.showInfos();
                newResto.clicOnMarker();
            });
    };
    this.addRestaurant = function(latLng, map, listener){ 
        var infoContent = document.createElement('div');
        var question = document.createElement('p');
        question.textContent = 'Ajouter un nouveau restaurant ici ?';
        infoContent.appendChild(question);
        var validButton = document.createElement('button');
        validButton.textContent = 'Ajouter !';
        validButton.classList.add('btn');
        validButton.id = 'validButton';
        validButton.classList.add('btn-primary');
        validButton.classList.add('btn-sm');
        infoContent.appendChild(validButton);
        creationSection = document.createElement('div');
        creationSection.innerHTML = "<form class='creationForm'><input type='text' placeholder='nom' id='name' class='form-control form-control-sm' required /><br /><input type='text' placeholder='adresse' id='address' class='form-control' /><br /><button id='submitButton' class='btn btn-success btn-sm'>Valider</button></form>";
        creationSection.style.display = 'none';
        infoContent.appendChild(creationSection);
        var listener2 = validButton.addEventListener("click", function(){
          creationSection.style.display = 'block';
          var submitButton = document.getElementById('submitButton');
          submitButton.addEventListener('click', function(){
            var resto = {
                restaurantName: document.getElementById('name').value,
                adress: document.getElementById('address').value,
                lat: latLng.lat(),
                long: latLng.lng(),
                ratings: []
            };
            self.userCreated.push(resto);
            console.log('resto = ' + resto);
            console.log('liste = ' + liste);
            self.listUpdate();
            infoWindow.close();
          });
        });
          var infoWindow = new google.maps.InfoWindow({
            maxWidth: 300,
            position: latLng,
            map: map,
            content: infoContent
        });
        map.panTo(latLng);
        map.setZoom(15);
    };
}