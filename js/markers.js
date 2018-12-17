var index = 0;
var liste = [];
var li, listUL, div;
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
                // on désérialise la liste et on la sauvegarde dans une variable
                liste = JSON.parse(xhr.responseText);
                console.log(liste);
                // on lance la fonction de callback avec la liste récupérée
                doList();
            }
        }
        // la requête AJAX : lecture de resto_data.json
        var url = "resto_data.json";
        xhr.open("GET", url, true);
        xhr.send(null);
    } else {
        // on lance la fonction de callback avec la liste déjà récupérée précédemment
        doList();
    }    
}
executerRequete();

function doList() {
    var moy;
    var somme = 0;
    liste.forEach(function(element) {
        moyenne(element);
        listUL = document.getElementById("listUL");
        li = document.createElement("li");
        var titre = document.createElement("h3");
        var note = document.createElement("p");
        titre.textContent = element.restaurantName;
        note.textContent = "Note moy.: " + moy.toFixed(1);
        li.appendChild(titre);
        li.id = element.restaurantName;
        li.classList.add("clickable");
        li.appendChild(note);
        li.appendChild(document.createElement('hr'));
        comments(element);
        listUL.appendChild(li);

    });
    // Gestion du click pour afficher les commentaires et les notes
    var clickable = document.getElementsByClassName("clickable");
    Array.prototype.filter.call(clickable, function(element){
        var childsCollapse = element.getElementsByClassName("collapse");
        element.addEventListener("click", function(element){
            var show = document.getElementsByClassName("showElt");
            Array.prototype.filter.call(show, function(elt){
                elt.classList.remove("showElt");
                var removeColor = elt.parentNode;
                removeColor.style.backgroundColor = "white";
            })
            Array.prototype.filter.call(childsCollapse, function(childsCollapseElt){
                childsCollapseElt.classList.add("showElt");
                var addColor = childsCollapseElt.parentNode;
                addColor.style.backgroundColor = "lightGrey";
            })
        })
    })
    //Recuperation des notes pour calcul de la moyenne
    function moyenne(element) {
        for (var i = 0; i < element.ratings.length; i++) {
            somme = element.ratings[i].stars + parseInt(somme);

        }
        moy = somme / (element.ratings.length);
        somme = 0;
    }
    // recupération et affichage des commentaires
    function comments(element) {
        div = document.createElement('div');
        for (var i = 0; i < element.ratings.length; i++) {
            var insertComment = document.createElement("div");
            var stars = element.ratings[i].stars;
            var avis = element.ratings[i].comment;
            insertComment.innerHTML = "<p class='comment'>Commentaire N° " + (i+1) + ":  " + avis + "<br/>Note : " + stars + "</p>";
            div.appendChild(insertComment);
        }
        li.appendChild(div);
        div.classList.add("collapse");
    }
}