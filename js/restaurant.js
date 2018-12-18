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
    that.title = document.createElement("h3");

    this.showInfos = function () {//Mise en forme des informations et gestion du clic sur le titre
        var listUL = document.getElementById("listUL");
        //var li = document.createElement("li");
        //var that.title = document.createElement("h3");
        var note = document.createElement("p");
        that.title.textContent = that.name;
        note.textContent = "Note moy.: " + that.calculateAverage();
        that.li.appendChild(that.title);
        that.li.id = that.name;
        that.li.classList.add("clickable");
        that.li.appendChild(note);
        that.li.appendChild(document.createElement('hr'));
        listUL.appendChild(that.li);
        if (this.isInRectangle() == true) {
            that.li.classList.add("show");
        }else {
            that.li.classList.remove("show");
        }
        var div = document.createElement('div');
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
}
