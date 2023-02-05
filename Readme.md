# EventDensity

Un outil de visualisation des évènements.


## Format des fichiers
EventDensity accepte les fichiers CSV avec le séparateur ;
Les colonnes obligatoires sont :
- Latitude
- Longitude
- Date et heure (dd/mm/yyyy hh:mm:ss)
- Count (poids du point : par défaut mettre 1)

Les colonnes supplémentaires sont intégrées comme attributs pouvant être filtrés


## Dépendances

Ce logiciel utilise :
[Leaflet 1.9.3](https://leafletjs.com/)
[leaflet-heatmap plugin](https://www.patrick-wied.at/static/heatmapjs/plugin-leaflet-layer.html)
[leaflet-coordinates plugin](https://github.com/zimmicz/Leaflet-Coordinates-Control)
[Bootstrap 4.6.2](https://getbootstrap.com/)
[Dual range slider](https://medium.com/@predragdavidovic10/native-dual-range-slider-html-css-javascript-91e778134816)
