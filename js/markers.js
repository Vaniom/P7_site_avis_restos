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
    var moy;
    var somme = 0;
    liste.forEach(function(element) {
        var listUL = document.getElementById("listUL");
        var li = document.createElement("li");
        var titre = document.createElement("h3");
        var note = document.createElement("p");
        moyenne(element);
        titre.textContent = element.restaurantName;
        note.textContent = "Moyenne des notes: " + moy + " sur 5";
        li.appendChild(titre);
        li.appendChild(note);
        listUL.appendChild(li);
        
        function moyenne(element) {
            for (var i = 0; i < element.ratings.length; i++) {
                somme = element.ratings[i].stars + parseInt(somme);
                console.log("somme = " + somme);
            }
            moy = somme / (element.ratings.length);
            console.log("moyenne = " + moy);
            somme = 0;
        }
        
    })
}
