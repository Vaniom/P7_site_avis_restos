function Restaurant(name, adress, lat, lng) {

    var self = this;

    this.name = name;

    this.address = adress;

    this.pos = {
        lat: lat,
        lng: lng
    };

    this.ratings = "";

    this.marker = new google.maps.Marker({
        position: self.pos,
        map: map,
        title: self.name,
        icon: './img/restaurant.png',
        animation: null // Attention: à definir au moment de l'instanciation pour prise en compte lors de l'appel à la méthode toggleBounce()
    });

    this.average = "";

    this.id = "";

    this.hasToGetDetails = false;

    this.streetviewImage =  "https://maps.googleapis.com/maps/api/streetview?size=400x200&location=" + this.pos.lat + "," + this.pos.lng + "&fov=90&heading=235&pitch=10&key=" + myApiKey;

    this.li = document.createElement("li");

    this.title = document.createElement("h3");

    this.note = document.createElement("p");

    this.voteBtn = document.createElement('div');

    this.contentDiv = document.createElement('div');

    this.addressSection = document.createElement('p');

    this.imgSection = document.createElement('p');

    this.formDiv = document.createElement('div');

    this.userComment = "";

    this.userNote = 0;

    this.calculateAverage = function () {
        var somme = 0;
        if (self.average !== undefined){
            return self.average;
        }else {
            for (var i = 0; i < self.ratings.length; i++) {
                somme = self.ratings[i].stars + parseInt(somme);
            }
            var moy = somme / (self.ratings.length);
            return Number(moy.toFixed(1));
        }       
    };
    
    this.showInfos = function () {//Mise en forme des informations et gestion du clic sur le titre
        var listUL = document.getElementById("listUL");
        self.title.textContent = self.name;
        var grade = self.calculateAverage();
        self.colorTheStars(grade, self.note);
        self.li.appendChild(self.title);
        self.li.id = self.name;
        self.li.classList.add("clickable");
        self.voteBtn.id = 'voteBtn';
        self.voteBtn.innerHTML = "<button type='button' id='avisBtn' class='btn btn-outline-primary btn-sm voteBtn'>Je donne mon avis</button>";
        self.formDiv.appendChild(self.voteBtn);
        var listener1 = self.voteBtn.addEventListener("click", function(){
            self.voteBtn.classList.add('hideBtn');
            self.constructForm();
            self.vote();
        });
        self.li.appendChild(self.note);
        listUL.appendChild(self.li);
        if (this.isInRectangle() == true) {
            self.li.classList.add("show");
        }else {
            self.li.classList.remove("show");
        }
        var contentDiv = self.contentDiv;
        var addressSection = self.addressSection;
        var imgSection = self.imgSection;
        imgSection.classList.add("streetviewSection");
        
        self.li.appendChild(contentDiv);
        contentDiv.classList.add("collapse");
        var restoArray = myLayout.restoArray;
        self.title.addEventListener("click", function(){// Ecouteur d'evenement au clic
        setTimeout(self.showNext, 100);
        
        for (var i = 0; i < restoArray.length; i++) {
            if (restoArray[i].name != self.name) {
                restoArray[i].li.classList.remove("clicked");
                restoArray[i].marker.setAnimation(null);                
                var children = restoArray[i].li.childNodes;
                Array.prototype.filter.call(children, function(element){
                    element.classList.remove("showElt");
                });
            }
        }
            self.toggleBounce();// On declenche l'animation du marqueur
            self.li.classList.toggle("clicked");// On permutte la classe sur l'entrée de liste correspondante
            var childNodes = self.li.childNodes;
            // On affiche les elements attachés
            Array.prototype.filter.call(childNodes, function(element){
                element.classList.toggle("showElt");
            });
        });
    };
    
    this.showNext = function() {
        var contentDiv = self.contentDiv;
        var addressSection = self.addressSection;
        var imgSection = self.imgSection;
        contentDiv.innerHTML = '';
        addressSection.textContent = self.address;
        imgSection.innerHTML = '<img src="' + self.streetviewImage + '" class="streetviewImage" alt="image streetview" />';
        contentDiv.appendChild(imgSection);
        addressSection.classList.add("address");
        contentDiv.appendChild(addressSection);
        contentDiv.appendChild(self.formDiv);
        
        for (var j = 0; j < self.ratings.length; j++) {
            var insertComment = document.createElement("div");
            var stars = self.ratings[j].stars;
            var avis = self.ratings[j].comment;
            insertComment.innerHTML = "<p class='comment'><span class='avis'>Avis N° " + (j+1) + ":  </span>" + avis + "<br/><span class='note'>Note : " + stars + "</span></p>";
            contentDiv.appendChild(insertComment);
        }
    };

    this.toggleBounce = function () { // gestion de l'animation du marqueur
        if (self.marker.getAnimation() !== null) {
            self.marker.setAnimation(null);
          } else if (self.marker.getAnimation() == null) {
            self.marker.setAnimation(google.maps.Animation.BOUNCE);
          }
    };

    this.isInRectangle = function () {
        var pointLat = self.pos.lat;
        var pointLng = self.pos.lng;
        var point = new google.maps.LatLng(pointLat, pointLng);
        if (rectangle.getBounds().contains(point)){
            return true;
        }else {
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
        }
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
        if (self.ratings.length > 0){
            nbAvis.textContent = " " + self.ratings.length + " avis.";
        }else {
            nbAvis.textContent = "Aucun avis publié.";
        }
        averageStars.appendChild(nbAvis);
        insertIn.appendChild(averageStars);
    };
    
    this.clicOnMarker = function () {
        var infoContent = document.createElement("div");
        var infoMoyenne = document.createElement("p");
        var grade = self.calculateAverage();
        var infoTitle = document.createElement("h3");
        var infoStreetview = document.createElement("p");
        infoTitle.textContent = self.name;
        infoContent.appendChild(infoTitle);
        infoStreetview.innerHTML = '<img src="' + self.streetviewImage + '" class="streetviewImage" alt="image streetview" />';         
        infoMoyenne.textContent = self.ratings.length + " avis " + self.colorTheStars(grade, infoContent);
        infoContent.appendChild(infoStreetview);
        self.marker.addListener("click", function(){
            var infoWindow = new google.maps.InfoWindow({
                maxWidth: 300,
                position: self.pos,
                map: map,
                content: infoContent
            }); 
        });
    };
    
    this.constructForm = function(listener){
        var formDiv = document.createElement('div');
        formDiv.innerHTML = '<div id="voteForm"><form><p>Donnez une note :<br /><div class="rating"><i id="note1" class="vote far fa-star"></i><i id="note2" class="vote far fa-star"></i><i id="note3" class="vote far fa-star"></i><i id="note4" class="vote far fa-star"></i><i id="note5" class="vote far fa-star"></i></div></p><label for="commentaire">Votre commentaire :</label><textarea class="form-control" id="commentaire" rows="5" required></textarea></form><button type="submit" id="saveBtn" class="btn btn-primary">Envoyer</button><button type="button" id="closeBtn" class="btn btn-secondary">Fermer</button></div>';
        $(self.formDiv).append(formDiv);
        var saveBtn = document.getElementById('saveBtn');
        var closeBtn = document.getElementById('closeBtn');
        saveBtn.addEventListener('click', function(e){
            e.preventDefault();
            self.userComment = document.getElementById('commentaire').value;
            //console.log('commentaire = ' + self.userComment + ' / note = ' + self.userNote);
            var rating = {stars: self.userNote, comment: self.userComment};
            self.ratings.push(rating);
            self.voteBtn.classList.remove("hideBtn");
            formDiv.innerHTML = "";
            self.userComment = "";
            self.userNote = 0;
            myLayout.listUpdate();
        });
        closeBtn.addEventListener('click', function(){
            self.voteBtn.classList.remove("hideBtn");
            formDiv.innerHTML = "";
            self.userComment = "";
            self.userNote = 0;
        });
    };

    this.vote = function(){ // attribution de la note "étoile"
        self.userNote = 0;
        var userComment;
        var textarea = document.getElementById('commentaire');
        var voteForm = document.getElementById('voteForm');
        textarea.value = "";
        var star1 = document.getElementById('note1');
        star1.addEventListener('click', function(){
            star1.classList.toggle('fas');
            star1.classList.toggle('far');
            self.userNote = voteForm.getElementsByClassName('fas').length;
        });
        var star2 = document.getElementById('note2');
        star2.addEventListener('click', function(){
            star1.classList.add('fas');
            star1.classList.remove('far');
            star2.classList.toggle('fas');
            star2.classList.toggle('far');
            self.userNote = voteForm.getElementsByClassName('fas').length;
        });
        var star3 = document.getElementById('note3');
        star3.addEventListener('click', function(){
            star1.classList.add('fas');
            star1.classList.remove('far');
            star2.classList.add('fas');
            star2.classList.remove('far');
            star3.classList.toggle('fas');
            star3.classList.toggle('far');
            self.userNote = voteForm.getElementsByClassName('fas').length;
        });
        var star4 = document.getElementById('note4');
        star4.addEventListener('click', function(){
            star1.classList.add('fas');
            star1.classList.remove('far');
            star2.classList.add('fas');
            star2.classList.remove('far');
            star3.classList.add('fas');
            star3.classList.remove('far');
            star4.classList.toggle('fas');
            star4.classList.toggle('far');
            self.userNote = voteForm.getElementsByClassName('fas').length;
        });
        var star5 = document.getElementById('note5');
        star5.addEventListener('click', function(){
            star1.classList.add('fas');
            star1.classList.remove('far');
            star2.classList.add('fas');
            star2.classList.remove('far');
            star3.classList.add('fas');
            star3.classList.remove('far');
            star4.classList.add('fas');
            star4.classList.remove('far');
            star5.classList.toggle('fas');
            star5.classList.toggle('far');
            self.userNote = voteForm.getElementsByClassName('fas').length;
        });
    };
}