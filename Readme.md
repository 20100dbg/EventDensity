# EventDensity
Un outil de visualisation des évènements.


## Format des fichiers
EventDensity accepte les fichiers CSV avec le séparateur ;
Les colonnes obligatoires sont :
- Latitude
- Longitude
- Date et heure (dd/mm/yyyy hh:mm:ss)
- Count (poids du point : par défaut mettre 1)

EventDensity supporte également le format CSV CITHARE.


## Fonctionnalités
Les colonnes supplémentaires sont intégrées comme attributs pouvant être filtrés.

Les points peuvent être colorés selon la valeur d'un attribut sélectionné.


## Paramètres
Affichage uniquement des points
Affichage uniquement de la carte de chaleur
Prise en compte d'au moins un filtre ou de tous les filtres


## Paramètres avancés

### Tuile en ligne
EventDensity peut afficher les tuiles OpenStreetMap en ligne pour une couverture complète

Dans le fichier main.html, trouver URL_CARTO
La première ligne pointe vers le dossier local. La seconde ligne utilise la version en ligne d'OSM.
Commenter/décommenter les lignes selon le comportement voulu.


### Sensibilité de la carte de chaleur
Ce paramètre est pertinent selon le niveau de zoom et l'écartement des points.

Dans le fichier main.html, trouver heatmapcfg
Dans cette variable l'attribut *radius* définit le rayon de recherche pour établir la carte de chaleur.
Augmenter la valeur pour agrandir le rayon de recherche et obtenir des points plus étendus.
Par défaut 0.01


## Dépendances

Ce logiciel utilise :
[Leaflet 1.9.3](https://leafletjs.com/)
[leaflet-heatmap plugin](https://www.patrick-wied.at/static/heatmapjs/plugin-leaflet-layer.html)
[leaflet-coordinates plugin](https://github.com/zimmicz/Leaflet-Coordinates-Control)
[Bootstrap 4.6.2](https://getbootstrap.com/)
[Dual range slider](https://medium.com/@predragdavidovic10/native-dual-range-slider-html-css-javascript-91e778134816)


