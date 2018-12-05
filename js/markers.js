var index = 0;
var liste = [];
function executerRequete() {
    // on vérifie si la liste a déjà été chargé pour n'exécuter la requête AJAX
    // qu'une seule fois
    if (liste.length === 0) {
        // on récupère un objet XMLHttpRequest
        var xhr = getXMLHttpRequest();
        // on réagit à l'événement onreadystatechange
        xhr.onreadystatechange = function() {
            // test du statut de retour de la requête AJAX
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                // on désérialise la liste et on le sauvegarde dans une variable
                liste = JSON.parse(xhr.responseText);
                console.log(liste);
                // on lance la fonction de callback avec le catalogue récupéré
                doList();
            }
        }
        // la requête AJAX : lecture de resto_data.json
        var url = "resto_data.json";
        xhr.open("GET", url, true);
        xhr.send(null);
    } else {
        // on lance la fonction de callback avec le catalogue déjà récupéré précédemment
        doList();
    }    
}
executerRequete();

function doList() {
    liste.forEach(function(element) {
        var listUL = document.getElementById("listUL");
        var li = document.createElement("li");
        li.textContent = element.restaurantName;
        listUL.appendChild(li);
    })
}
/*
$(function(){
    $.getJSON('resto_data.json', function(data){
        $('#listUL').html('<li>' + data.restaurantName + '</li>');
    })
})
*/