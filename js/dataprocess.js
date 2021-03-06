function executerRequete() {
    // on vérifie si la liste a déjà été chargé pour n'exécuter la requête AJAX
    // qu'une seule fois
    if (myLayout.liste.length === 0) {
        // on récupère un objet XMLHttpRequest
        var xhr = getXMLHttpRequest();
        // on réagit à l'événement onreadystatechange
        xhr.onreadystatechange = function() {
            // test du statut de retour de la requête AJAX
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                // on désérialise la liste et on la sauvegarde dans une variable
                myLayout.liste = JSON.parse(xhr.responseText);
            }
        };
        // la requête AJAX : lecture de resto_data.json
        var url = "resto_data.json";
        xhr.open("GET", url, true);
        xhr.send(null);
    }
}