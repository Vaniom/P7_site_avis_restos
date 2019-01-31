function Layout(name) {

    var self = this;

    this.name = name;

    this.liste = []; // array de stockage des données recupérées dans le JSON

    this.restoArray = []; // array de stockage des objets créés

    this.userCreated = []; //array de stockage des restaurants récupérés via google places et créés par l'utilisateur

    this.map = map;

    this.userPos = "";

    this.requestArray = [];

    this.init = function(){ // on crée un nouveau fond de carte
        map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: 48.864716,
                lng: 2.349014
            },
            zoom: 6
        });
        // Try HTML5 geolocation.     
        var pos;
        var liste = self.liste;
        if (navigator.geolocation) {
            //Recupération de la position de l'utilisateur
            navigator.geolocation.getCurrentPosition(function (position) {
                self.userPos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                //On definit les propriétés du marqueur de position de l'utilisateur
                marker.setPosition(self.userPos);
                marker.setTitle('Votre position');
                map.setZoom(9);
                map.setCenter(self.userPos);
            }, function () { // appel de la fonction de callBack
                self.handleLocationError(true, marker, map.getCenter());
            });
        } else {
            // Le navigateur ne supporte pas la geolocalistaion
            self.handleLocationError(false, map.getCenter());        
        }
        // placement d'un marqueur à la position de l'utilisateur
        marker = new google.maps.Marker({
            map: map,
            icon: './img/user_marker.png'
        });
        // Execution de la requete de traitement des données du fichier JSON
        executerRequete();
        // definition d'un rectangle aux dimensions de la zone affichée
        rectangle = new google.maps.Rectangle();
        map.addListener('bounds_changed', function(){ // ajout un listener sur la modification des bornes
            var my_range = $(".js-range-slider").data("ionRangeSlider"); //stockage de l'instance du slider ds une variable
            my_range.reset();// reset des données du slider aux données initiales
            rectangle.setOptions({
                strokeColor: '#FF0000', // couleur de contour
                    strokeOpacity: 0.0, // regler l'opacité à 0
                    strokeWeight: 2,
                    fillColor: '#FF0000', // couleur de remplissage
                    fillOpacity: 0.0, // opacité sur 0
                    map: map,
                    bounds: map.getBounds() // bornage aux dimensions de la map
            });
       
            self.listUpdate(); // mise à jour de l'affichage
        });
        var listener1 = rectangle.addListener("click", function(event){ // ajout d'un listener sur le click dans le rectangle
            self.addRestaurant(event.latLng, map, listener1); 
        });
        map.addListener("dragend", function(){ // ajout d'un listener sur le glissement de la carte
            self.userCreated.splice(0, self.userCreated.length);
            self.requestPlacesService();
            self.listUpdate();
        });
        // On appelle la methode de requete à l'API google places
        setTimeout(self.requestPlacesService, 1000);
    };

    this.handleLocationError = function(browserHasGeolocation, marker, pos) {
        window.alert(browserHasGeolocation ?
            'Erreur: Le service de géolocalisation a échoué' :
            'Erreur: Votre navigateur ne supporte pas la geolocalisation');
    };

    // mise à jour de l'affichage
    this.listUpdate = function(){
        var liste = self.liste;
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
            //suppression des doublons:
            var cache = {};
            liste = liste.filter(function(elem,index,array){
                return cache[elem.restaurantName]?0:cache[elem.restaurantName]=1;
            });
            // On boucle sur la liste et on instancie un nouvel objet pour chaque element du tableau
            liste.forEach(function(element) {
                newResto = new Restaurant(element.restaurantName, element.address, element.lat, element.long);
                newResto.ratings = element.ratings;
                newResto.hasToGetDetails = element.hasToGetDetails;
                if (typeof element.average !== undefined) {
                    newResto.average = element.average;
                    newResto.id = element.id;
                }
                restoArray.push(newResto);
                var timeoutID = window.setTimeout(newResto.isInRectangle, 1000);
                newResto.showInfos();
                newResto.clicOnMarker();
            });
            self.countResults();
    };

    // ajout d'un nouveau restaurant par l'utilisateur (lors du clic sur la carte)
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
        creationSection.innerHTML = "<form class='creationForm'><input type='text' placeholder='nom' id='name' class='form-control form-control-sm' aria-describedby='nameHelpBlock' required/><br /><small id='nameHelpBlock' class='form-text text-muted'>Le nom doit être renseigné. Il doit contenir au moins 2 caractères et le premier caractère doit être une lettre ou un chiffre.</small><br /><button id='submitButton' class='btn btn-success btn-sm'>Valider</button></form>";
        creationSection.style.display = 'none';
        infoContent.appendChild(creationSection);
        var listener2 = validButton.addEventListener("click", function(){
            validButton.style.display = "none";
            creationSection.style.display = 'block';
            var submitButton = document.getElementById('submitButton');
            submitButton.addEventListener('click', function(){
                var champName = document.getElementById('name').value;
                console.log("champName = " + champName);
                // verification du formulaire
                var regex = /^[0-9A-Z]{2,}/i;// doit commencer par un chiffre ou une lettre, longueur minimum 2 caractères, insensible à la casse (i)
                var nameTrim = champName.trim();// methode trim() pour enlever les blancs en debut et fin de chaine
                if (regex.test(nameTrim)){ // on teste la valeur saisie par l'utilisateur
                    var resto = {
                        restaurantName: document.getElementById('name').value,
                        adress: "",
                        lat: latLng.lat(),
                        long: latLng.lng(),
                        ratings: []
                    };
                    self.userCreated.push(resto);
                    self.listUpdate();
                    infoWindow.close();
                }else {
                    event.preventDefault();
                    event.stopPropagation();
                    document.getElementById('nameHelpBlock').style.display = "block";
                }
                
            });
        });
        // on injecte le formulaire dans une infoWindow
          var infoWindow = new google.maps.InfoWindow({
            maxWidth: 300,
            position: latLng,
            map: map,
            content: infoContent
        });
        //reglage de la vue
        map.panTo(latLng);
        map.setZoom(15);
    };

    // comptage des resultats affichés dans la liste
    this.countResults = function() {
        var listUL = document.getElementById("listUL");
        var count = listUL.getElementsByClassName('show').length;
        var countText = document.createElement('p');
        document.getElementById("nbResultats").innerHTML = "";
        if ((count === 0) || (count === 1)) {
            countText.textContent = count +  "résultat";
        }else {
            countText.textContent = count + " résultats";
        }
        document.getElementById("nbResultats").appendChild(countText);
    };

    //construction de la requete à google places
    this.requestPlacesService = function(){
        var request = { // preparation de la requete
            location: map.getCenter(),
            radius: '5000',
            type: ['restaurant']
        };
        var loc;
        var resto;
        var ratingsArray = [];
        // On effectue une requête nearbySearch et pour chaque resultat obtenu, on appelle la fonction getDetails (pour obtenir les infos complémentaires)
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
        function callback(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    loc = results[i];
                    ratingsArray.splice(0, ratingsArray.length);
                    getDetails(loc.place_id);
                }
            }
        }
        //Pour chaque resultat, on recupère le place_id et on effectue une requete gatDetails
        function getDetails (id) {
            ratingsArray.splice(0, ratingsArray.length);
            var service = new google.maps.places.PlacesService(map);
            service.getDetails({placeId: id}, function (place, status){
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    //On crée un nouvel objet
                    resto = {
                        id: id,
                        restaurantName: place.name,
                        address: place.formatted_address,
                        lat: place.geometry.location.lat(),
                        long: place.geometry.location.lng(),
                        ratings: [],
                    };
                    // on push chaque couple {note, commentaire} dans l'array resto.ratings précédemment définit
                    if (place.reviews !== undefined) {
                        place.reviews.forEach(function(element){
                            newRating = {stars: element.rating, comment: element.text};
                            resto.ratings.push(newRating);
                        });
                    }
                    self.userCreated.push(resto);
                    self.listUpdate();
                }
            });
        }
        self.listUpdate();
    };
}