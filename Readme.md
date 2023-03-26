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


### Tuile en ligne
EventDensity peut afficher les tuiles OpenStreetMap en ligne pour une couverture complète

Dans le fichier main.html, la variable URL_CARTO pointe sur le dépôt de carto à utiliser.
La première ligne pointe vers le dossier local. La seconde ligne utilise la version en ligne d'OSM.
Commenter/décommenter les lignes selon le comportement voulu.



## Dépendances

Ce logiciel utilise :
- [Leaflet 1.9.3](https://leafletjs.com/)
- [leaflet-heatmap plugin](https://www.patrick-wied.at/static/heatmapjs/plugin-leaflet-layer.html)
- [leaflet-coordinates plugin](https://github.com/zimmicz/Leaflet-Coordinates-Control)
- [Bootstrap 4.6.2](https://getbootstrap.com/)
- [Dual range slider](https://medium.com/@predragdavidovic10/native-dual-range-slider-html-css-javascript-91e778134816)


## Générer des tuiles

Générer des tuiles PNG avec [maperitive](http://maperitive.net) :
- zoomer sur la zone voulue
- set-geo-bounds
- generate-tiles minzoom=8 maxzoom=12 
- copier coller le contenu de Mapertive/Tiles dans le dossier *carto* de EventDensity
