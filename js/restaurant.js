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
    }
    
    /*
    this.isInRectangle = function () {
        var pointLat = that.pos.lat;
        var pointLng = that.pos.lng;
        var point = new google.maps.LatLng(pointLat, pointLng);
        console.log("point = " + point);
        if (google.maps.geometry.poly.containsLocation(point, rectangle)){
            console.log("IN");
            var restoName = that.name;
            var elm = document.getElementById(restoName);
            console.log("restoname = " + restoName);
            elm.classList.add("show");
        }else {
            console.log("OUT");
            var elm = document.getElementById(restoName);
            elm.classList.remove("show");
        }
    }
    */
}
