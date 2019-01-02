function Restaurant(name, adress, lat, lng) {
    var that = this;
    this.name = name;
    this.address = adress;
    this.pos = {
        lat,
        lng
    };
    this.ratings = "";
    this.marker = new google.maps.Marker({
        position: that.pos,
        map: map,
        title: that.name,
        icon: './img/restaurant.png',
        animation: null // Attention: à definir au moment de l'instanciation pour prise en compte lors de l'appel de la fonction toggleBounce()
    });
    this.calculateAverage = function() {
        var somme = 0;
        for (var i = 0; i < that.ratings.length; i++) {
            somme = that.ratings[i].stars + parseInt(somme);
        }
        var moy = somme / (that.ratings.length);
        return Number(moy.toFixed(1));
    };
    this.li = document.createElement("li");
    this.title = document.createElement("h3");
    this.note = document.createElement("p");
    this.showInfos = function () {//Mise en forme des informations et gestion du clic sur le titre
        var listUL = document.getElementById("listUL");
        that.title.textContent = that.name;
        var grade = that.calculateAverage();
        that.colorTheStars(grade, that.note);
        that.li.appendChild(that.title);
        that.li.id = that.name;
        that.li.classList.add("clickable");
        that.li.appendChild(that.note);
        listUL.appendChild(that.li);
        if (this.isInRectangle() == true) {
            that.li.classList.add("show");
        }else {
            that.li.classList.remove("show");
        }
        var contentDiv = document.createElement('div');
        var addressSection = document.createElement('p');
        var imgSection = document.createElement('p');
        imgSection.classList.add("streetviewSection");
        imgSection.innerHTML = '<img src="' + that.streetviewImage + '" class="streetviewImage" alt="image streetview" />';
        addressSection.textContent = that.address;
        addressSection.classList.add("address");
        contentDiv.appendChild(addressSection);
        contentDiv.appendChild(imgSection);
        for (var i = 0; i < that.ratings.length; i++) {
            var insertComment = document.createElement("div");
            var stars = that.ratings[i].stars;
            var avis = that.ratings[i].comment;
            insertComment.innerHTML = "<p class='comment'>Commentaire N° " + (i+1) + ":  " + avis + "<br/>Note : " + stars + "</p>";
            contentDiv.appendChild(insertComment);
        }
        that.li.appendChild(contentDiv);
        contentDiv.classList.add("collapse");
        that.title.addEventListener("click", function(){// Ecouteur d'evenement au clic
        for (var i = 0; i < restoArray.length; i++) {
            if (restoArray[i].name != that.name) {
                restoArray[i].li.classList.remove("clicked");
                restoArray[i].marker.setAnimation(null);                
                var children = restoArray[i].li.childNodes;
                Array.prototype.filter.call(children, function(element){
                    element.classList.remove("showElt");
                })             
            } else {}
        }
            that.toggleBounce();// On declenche l'animation du marqueur
            that.li.classList.toggle("clicked");// On permutte la classe sur l'entrée de liste correspondante
            //that.detailed = true;
            var childNodes = that.li.childNodes;
            // On affiche les elements attachés
            Array.prototype.filter.call(childNodes, function(element){
                element.classList.toggle("showElt");
            });
        });
    };
    this.toggleBounce = function () { // gestion de l'animation du marqueur
        if (that.marker.getAnimation() !== null) {
            that.marker.setAnimation(null);
          } else if (that.marker.getAnimation() == null) {
            that.marker.setAnimation(google.maps.Animation.BOUNCE);
          }
    };
    this.isInRectangle = function () {
        var pointLat = that.pos.lat;
        var pointLng = that.pos.lng;
        var point = new google.maps.LatLng(pointLat, pointLng);
        if (rectangle.getBounds().contains(point)){
            console.log(that.name + " IN");
            return true;
        }else {
            console.log(that.name + " OUT");
            return false;
        }
    };
    this.colorTheStars = function(element, insertIn){ // Methode pour afficher le système de notation etoiles
        var note = element;
        var averageStars = document.createElement("p");
        var arrondi = Math.round (note);
        var reste = arrondi - note;
        var fullStars, halfStars, iFull, iHalf;
        if ((reste <= -0.3) && (reste >= -0.4)) {
            fullStars = arrondi;
            halfStars = 1;
        }else if ((reste <= 0.5) && (reste >= 0.3)) {
            fullStars = arrondi - 1;
            halfStars = 1;
        } else {
            fullStars = arrondi;
            halfStars = 0;
        }
        if (note >= 0) {
            var span = document.createElement("span"); 
            span.textContent = note + " ";
            averageStars.appendChild(span);
        }else {}
        for (var i = 0; i < fullStars; i++) {
            iFull = document.createElement("i");
            iFull.classList.add("fas");
            iFull.classList.add("fa-star");
            averageStars.appendChild(iFull);
        }
        for (var j = 0; j < halfStars; j++) {
            iHalf = document.createElement("i");
            iHalf.classList.add("fas");
            iHalf.classList.add("fa-star-half-alt");
            averageStars.appendChild(iHalf); 
        }
        var noStars = 5 - (fullStars + halfStars);
        for (var k = 0; k < noStars; k++){
            noStars = document.createElement("i");
            noStars.classList.add("far");
            noStars.classList.add("fa-star");
            averageStars.appendChild(noStars);
        }
        var nbAvis = document.createElement("span");
        if (that.ratings.length > 0){
            nbAvis.textContent = " " + that.ratings.length + " avis.";
        }else {
            nbAvis.textContent = "Aucun avis publié.";
        }
        averageStars.appendChild(nbAvis);
        insertIn.appendChild(averageStars);
    };
    this.streetviewImage = "https://maps.googleapis.com/maps/api/streetview?size=400x200&location=" + this.pos.lat + "," + this.pos.lng + "&fov=90&heading=235&pitch=10&key=" + myApiKey;
    this.clicOnMarker = function () {
        var infoContent = document.createElement("div");
        var infoMoyenne = document.createElement("p");
        var grade = that.calculateAverage();
        var infoTitle = document.createElement("h3");
        var infoStreetview = document.createElement("p");
        infoTitle.textContent = that.name;
        infoContent.appendChild(infoTitle);
        infoStreetview.innerHTML = '<img src="' + that.streetviewImage + '" class="streetviewImage" alt="image streetview" />';         
        infoMoyenne.textContent = that.ratings.length + " avis " + that.colorTheStars(grade, infoContent);
        infoContent.appendChild(infoStreetview);
        that.marker.addListener("click", function(){
            var infoWindow = new google.maps.InfoWindow({
                maxWidth: 300,
                position: that.pos,
                map: map,
                content: infoContent
            }); 
        })
    };
    this.filter = "show";
}
