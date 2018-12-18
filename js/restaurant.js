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
        label: that.name,
        icon: './img/restaurant.png'
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
        console.log("grade = " + grade);
        that.colorTheStars(grade);
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
        var div = document.createElement('div');
        var addressSection = document.createElement('p');
        addressSection.textContent = that.address;
        addressSection.classList.add("address");
        div.appendChild(addressSection);
        for (var i = 0; i < that.ratings.length; i++) {
            var insertComment = document.createElement("div");
            var stars = that.ratings[i].stars;
            var avis = that.ratings[i].comment;
            insertComment.innerHTML = "<p class='comment'>Commentaire N° " + (i+1) + ":  " + avis + "<br/>Note : " + stars + "</p>";
            div.appendChild(insertComment);
        }
        that.li.appendChild(div);
        div.classList.add("collapse");
        that.title.addEventListener("click", function(){
            that.li.classList.toggle("clicked");
            //var collapse = document.getElementsByClassName("collapse");
            var childNodes = that.li.childNodes;
            Array.prototype.filter.call(childNodes, function(element){
                element.classList.toggle("showElt");
            })  
        });
    };
    this.isInRectangle = function () {
        var pointLat = that.pos.lat;
        var pointLng = that.pos.lng;
        var point = new google.maps.LatLng(pointLat, pointLng);
        if (google.maps.geometry.poly.containsLocation(point, rectangle)){
            console.log("IN");
            return true;
        }else {
            console.log("OUT");
            return false;
        }
    };
    this.colorTheStars = function(element){
        var note = element;
        var averageStars = document.createElement("p");
        if ((note >= 0.0) && (note< 0.3)) {
            averageStars.innerHTML = note + ' <i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i> ' + that.ratings.length + ' avis';
        }else if ((note >= 0.3) && (note< 0.7)){
            averageStars.innerHTML = note + ' <i class="fas fa-star-half-alt"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i> ' + that.ratings.length + ' avis';
        }else if ((note >= 0.8) && (note < 1.3)){
            averageStars.innerHTML = note + ' <i class="fas fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i> ' + that.ratings.length + ' avis';
        }else if ((note >= 1.3) && (note < 1.8)){
            averageStars.innerHTML = note + ' <i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i> ' + that.ratings.length + ' avis';
        }else if ((note >= 1.8) && (note < 2.3)){
            averageStars.innerHTML = note + ' <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i> ' + that.ratings.length + ' avis';
        }else if ((note >= 2.3) && (note < 2.8)){
            averageStars.innerHTML = note + ' <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i><i class="far fa-star"></i><i class="far fa-star"></i> ' + that.ratings.length + ' avis';
        }else if ((note >= 2.8) && (note < 3.3)){
            averageStars.innerHTML = note + ' <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i> ' + that.ratings.length + ' avis';
        }else if ((note >= 3.3) && (note < 3.8)){
            averageStars.innerHTML = note + ' <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i><i class="far fa-star"></i> ' + that.ratings.length + ' avis';
        }else if ((note >= 3.8) && (note < 4.3)){
            averageStars.innerHTML = note + ' <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i> ' + that.ratings.length + ' avis';
        }else if ((note >= 4.3) && (note < 4.8)){
            averageStars.innerHTML = note + ' <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i> ' + that.ratings.length + ' avis';
        }else if ((note >= 4.8) && (note <= 5.0)){
            averageStars.innerHTML = note + ' <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i> ' + that.ratings.length + ' avis';
        }
        that.note.appendChild(averageStars);
    }
}
