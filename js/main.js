window.addEventListener("load", function () {


    var catalogue = (function () {

        papa = document.querySelector("main");
        templatemodel = document.getElementById("modeleProduit");
        papa_pagination = document.querySelector(".pagination");
        panier = document.querySelector(".log-in span span");
        items_dans_panier = {};// sert a sauvgarder les données du panier
        if ('panier' in sessionStorage) items_dans_panier = JSON.parse(window.sessionStorage["panier"])// si panier existe on le mets seulement à jour
        panier.innerHTML = Object.keys(items_dans_panier).length;  // affichage du nombre d'items 
        article_par_page = 12;
        page_courante = 1;
        class_affichage_liste = ""; //class pour le mode d'affichage
        /** getstion du select nombre de produits par page*/
        document.getElementById("produits").addEventListener("change", (e) => { catalogue.changerNombreProduitsParPage(e.target.value) })
        /** getstion du select option d'affichage*/
        document.getElementById("affichage").addEventListener("change", (e) => { catalogue.changerModeAffichage(e.target.value) })
        /** getstion des boutton precedant et suivant  */
        bouton_precedant = document.querySelector(".prev")
        bouton_suivant = document.querySelector(".next")
        bouton_precedant.addEventListener("click", () => { catalogue.changerPage(--page_courante) });
        bouton_suivant.addEventListener("click", () => { catalogue.changerPage(++page_courante) });

        var oCatalogue = {
            /**
             * l'affichage de la page 
             * 
             */
            afficherPage: function () {
                if ("content" in document.createElement("template")) {

                    papa.innerHTML = ""; // reset de la page 

                    for (var i = (page_courante - 1) * article_par_page; i < (page_courante * article_par_page); i++) {
                        var tClone = templatemodel.content.cloneNode(true);
                        button = document.createElement("input");
                        button.type = "button"
                        button.value = "Ajouter au panier";
                        var nom = produits[i].nom;
                        var image = produits[i].image;
                        var description = produits[i].description;
                        var prixValeur = produits[i].prix.valeur;
                        var prixUnite = produits[i].prix.unite;
                        var categorie = produits[i].categorie;
                        button.id = produits[i].id;
                        tClone.firstElementChild.innerHTML =
                            eval("`" + tClone.firstElementChild.innerHTML + "`");
                        papa.appendChild(tClone);
                        article = document.querySelectorAll(".produit");
                        if (class_affichage_liste !== "") article[article.length - 1].classList.add(class_affichage_liste);// l'ajout de classe pour affichage lise 
                        button.addEventListener("click", (e) => { this.ajouterProduit(e) }) // l'ajout du listener pour les bouttons d'ajout de produit
                        papa.lastElementChild.appendChild(button); // l'ajout du boutton au dernier element créé
                        if (i >= produits.length - 1) break; // si on atteint le nombre max de produits on quitte la boucle for 
                    }
                } else {
                    /* template non implémenté (par IE11) */
                    papa.innerHTML = " <h3> navigateur non supporté"; // reset de la page 

                }

                if (document.querySelectorAll(".pagination span").length === 0) { // on construit pagination une fois seulement lors du premier affichage ou au changement de nombre de produits par page 
                    this.construire_pagination();
                    this.update_pagination();
                }

            },
            /**
             * chnger de page 
             * 
             * @param {*} numPage 
             */
            changerPage: function (numPage) {
                (numPage < 1) ? page_courante = 1 : page_courante = numPage; // verification du input 
                (numPage > this.nombre_de_page()) ? page_courante = this.nombre_de_page : page_courante = numPage; // verification du input 
                this.afficherPage(); // l'affichage de la page 
                this.update_pagination();// mettre à jour la pagination 
            },



            /**
             * changerNombreProduitsParPage
             * 
             * @param {*} nbProduits 
             */
            changerNombreProduitsParPage: function (nbProduits) {   
                (nbProduits === "tous") ? article_par_page = produits.length : article_par_page = parseInt(nbProduits) - 1; // definition du nombre de produits par page
                spane_soeurs = document.querySelectorAll(".pagination span") // recuperation des bouttons de pagination crees lors du premier affichage 
                spane_soeurs.forEach(element => {
                    element.parentNode.removeChild(element);// destruction de tous les bouttons pour pouvoir en construire d'autre
                });
                page_courante = 1;
                this.afficherPage();
                this.update_pagination();
            },
            /**
             * le changement du mode d'affichage
             * 
             * @param {*} mode 
             */
            changerModeAffichage: function (mode) {
                (mode === "liste") ? class_affichage_liste = "produit-list" : class_affichage_liste = "";//  l'ajout de la class à la variable
                this.afficherPage();
            },

            /**
             * l'ajout du produit au panier
             * 
             * @param {*} produit 
             */
            ajouterProduit: function (produit) {
                if (items_dans_panier[produit.target.id] === undefined) {
                    items_dans_panier[produit.target.id] = produit.target.id; // l'ajout du produit dans autant q'une propreité dans l'object items_dans_panier s'il n'existe pas deja 
                    panier.innerHTML = Object.keys(items_dans_panier).length;  // affichage du nombre d'items 
                    window.sessionStorage["panier"] = JSON.stringify(items_dans_panier);// stockagede l'object sous forme d'un string
                }
            },

            /**
             * retourne le nombre de page necessaires 
             * 
             */
            nombre_de_page: function () {
                return Math.ceil(produits.length / article_par_page);
            },

            /**
             * construire pagination 
             * 
             */
            construire_pagination: function () {
                for (var i = 1; i <= this.nombre_de_page(); i++) { // pour chaque page 
                    enumero = document.createElement("span");
                    enumero.id = i;
                    enumero.innerHTML = (this.nombre_de_page() == 1) ? "Tous les produis" : i;
                    enumero.className = (i === 1) ? 'page-numbers current' : 'page-numbers';//  l'ajout des class lors de la constuction 
                    enumero.addEventListener("click", e => { this.changerPage(parseInt(e.target.id)); })// gestion des click des bouttons des pages 
                    papa_pagination.insertBefore(enumero, papa_pagination.lastElementChild)// l'insertion des boutons de la pagination
                }

            },
            /**
             * 
             * mettre à jour la pagination visibility: hidden; 
             */
            update_pagination: function () {
                bouton_suivant.style.visibility = (page_courante == this.nombre_de_page()) ? "hidden" : "visible"; //(condition vraie) on masque le boutton suivant 
                bouton_precedant.style.visibility = (page_courante == 1) ? "hidden" : "visible"; // (condition vraie) on masque le boutton precedant   
                spane_soeurs = document.querySelectorAll(".pagination span") // recuperation des bouttons de pagination 
                spane_soeurs.forEach(element => {
                    if (element.classList.contains('current')) element.classList.remove("current"); // suppression de la class current pour le boutton 
                });
                spane_soeurs[page_courante - 1].classList.add("current"); // l'ajout de la class current au boutton 
            }
        };

        return oCatalogue;
    })();

    catalogue.afficherPage();



});




