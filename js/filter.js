$(function () {
    $(".js-range-slider").ionRangeSlider({
        type: "double",
        skin: "modern",
        min: 0,
        max: 5,
        from: 0,
        to: 5,
        grid: false,
        step: 1,
        onChange: function (data)  {
            console.log(data.from);
            console.log(data.to);
            var restoArray = myLayout.restoArray;
            console.log(restoArray);
            for (var i = 0; i < restoArray.length; i++)  {
                var moy = restoArray[i].calculateAverage();
                if (isNaN(moy) === true) { // on attribue une note de 0 si la moyenne est inexistante
                    moy = 0;
                }
                var name = restoArray[i].name;
                var resto = document.getElementById(name);
                console.log(moy);
                if (restoArray[i].isInRectangle() == true){
                    if ((moy < data.from) || (moy > data.to)/* || isNaN(moy) === true*/) {
                        resto.classList.remove("show");
                        restoArray[i].marker.setVisible(false);
                    }else {
                        resto.classList.add("show");
                        restoArray[i].marker.setVisible(true);
                    }
                }else {}
            }
        }
    });
})