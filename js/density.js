//Excel 15/01/2000 10:10:10 to 2000-01-15 10:10:10
function ConvertDate(val)
{
  tab = val.split(' ');
  date = tab[0].split('/');
  return date[2] + "-" + date[1] + "-" + date[0] + " " + tab[1]; 
}


//filtres et couleur

function remplirFormCouleur()
{
  var div = document.getElementById("selectCouleur");
  div.innerHTML = '<option value="-1">Coloration</option>';

  for (var i = 0; i < tabHeaders.length; i++)
    div.innerHTML += "<option value='"+ i +"'>"+ tabHeaders[i] +"</option>";
}

function remplirFormFiltre()
{
  document.getElementById("divFiltres").innerHTML = '';

  var div = document.getElementById("selectFiltre");
  div.innerHTML = '<option value="-1">Filtre</option>';

  for (var i = 0; i < tabHeaders.length; i++)
    div.innerHTML += "<option value='"+ i +"'>"+ tabHeaders[i] +"</option>";
}



function changeCouleur(obj)
{
  idxColCouleur = parseInt(obj.value);
  dicCouleur = {};
  tabValCouleur = {};
  var idxColor = 0;
  var tabValeurs = {};

  for (var i = 0; i < importedData.length; i++)
  {
    var val = importedData[i].attr[idxColCouleur].trim();
    if (val == "") val = "(vide)";
    if (!(val in tabValeurs)) tabValeurs[val] = 0;
    tabValeurs[val] += 1;
  }

  //tri dans l'ordre du nombre de points décroissants
  var items = Object.keys(tabValeurs).map(function(key) { return [key, tabValeurs[key]]; });
  items.sort(function(a,b) { return b[1] - a[1]; });

  var div = document.getElementById("CouleurValues");
  div.innerHTML = '';

  for (var i = 0; i < items.length; i++)
  {
    var val = items[i][0];
    tabValCouleur[val] = 0;

    dicCouleur[val] = tabColor[idxColor];
    div.innerHTML += "<option style='background:"+ tabColor[idxColor] +"'>" + val + "</option>";
    if (idxColor < tabColor.length - 1) idxColor++;
  }

  dessiner(filteredData);
}



function remplirStatsCouleurs(data)
{
  if (idxColCouleur == -1) return;

  for (var val in tabValCouleur)
    tabValCouleur[val] = 0;

  for (var i = 0; i < data.length; i++)
  {
    var tmp = data[i].attr[idxColCouleur].trim();
    if (tmp == "") tmp = "(vide)";
    tabValCouleur[tmp] += 1;
  }

  var div = document.getElementById('statsCouleurs');
  div.innerText = '';
  
  for (var val in tabValCouleur)
    div.innerText += val + ' ('+ tabValCouleur[val] +'), ';

}

//dessin

function dessiner(data)
{
  drawData = filtrePeriode(data);
  remplirStatsCouleurs(drawData);

  var tmp = GetHeatDataObject(drawData);
  if (config.showHeatmap) heatmapLayer.setData(tmp);
  if (config.showPoints) dessinerPoints(tmp);
}


function GetHeatDataObject(data)
{
  //data = {count: 1, gdh: 1668069300000, lat: "11.43690014", lng: "13.76010036"}

  var max = 0;
  for (var i = data.length - 1; i >= 0; i--)
    if (max < data[i].count) max = data[i].count;
  return { max: max + 1, data: data };
}

function majPeriode()
{
  const [from, to] = getParsed(fromSlider, toSlider);

  var diff = endDate - startDate;
  startSpan = startDate + (from * diff / 100);
  endSpan = startDate + (to * diff / 100);
}


function filtrePeriode(data)
{
  var dataFiltree = [];

  for (var i = 0; i < data.length; i++)
    if (data[i].gdh >= startSpan && data[i].gdh <= endSpan)
      dataFiltree.push(data[i]);

  return dataFiltree;
}


function dessinerPoints(drawData)
{
  for (var i = 0; i < layers.length; i++) layers[i].remove();
  layers = [];

  for (var i = 0; i < drawData.data.length; i++)
  {
    var color = '#000000';
    if (Object.keys(dicCouleur).length > 0) 
      color = dicCouleur[drawData.data[i].attr[idxColCouleur]];

    layer = L.circleMarker([drawData.data[i].lat, drawData.data[i].lng], 
      {radius: config.circleSize, stroke:true, color: '#000000', weight:1,
       fill: true, fillColor: color, fillOpacity: 1}).addTo(map);
    
    layers.push(layer);
  }
}



function resetSlider()
{
  fromSlider.value = 0;
  toSlider.value = 10;

  majPeriode();
  filtrePeriode(filteredData);
}


function afficherStats()
{
  var x = (new Date(endSpan) - new Date(startSpan)) / 1000;
  
  document.getElementById("info").innerText =   
    "Points importés : " + importedData.length + "\n" +
    "Après filtres : " + filteredData.length + "\n" +
    "Avec la période : " + drawData.length + "\n" +
    "Premier point : " + new Date(startDate).toLocaleString() + "\n" +
    "Dernier point : " + new Date(endDate).toLocaleString() + "\n" +
    "Début période : " + new Date(startSpan).toLocaleString() + "\n" +
    "Fin période : " + new Date(endSpan).toLocaleString() + "\n" +
    "Durée période : " + getSpan(x) + "\n" +
    "";
}

function getSpan(val)
{
  var sec = Math.floor(val % 60);
  val = val / 60;
  var min = Math.floor(val % 60);
  val = val / 60;
  var heures = Math.floor(val % 24);
  val = val / 24;
  var jours = Math.floor(val % 30);
  //val = val /30;
  //var mois = Math.floor(val);
  return jours + "j " + heures + "h " + min + "m " + sec + "s";
}


function creerBandeau(data)
{
  viderBandeau();
  var c = document.getElementById("bandeau");
  var ctx = c.getContext("2d");

  var diff = endDate - startDate;
  var largeur = 400;

  for (var i = 0; i < data.length; i++)
  {
    var madate = endDate - data[i].gdh;
    var x = madate * largeur / diff;

    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 20);
    ctx.stroke();
  }
}

function viderBandeau()
{
  var c = document.getElementById("bandeau");
  var ctx = c.getContext("2d");
  ctx.clearRect(0,0,c.width,c.height);
}

function initHeatmap()
{
  var radius = 1;
  var tmp = distanceNWSE / 10000;
  //console.log('dist : ' + tmp);

  radius = radius * tmp / 1400;
  //console.log('radius : ' + radius);

  majRadiusHeatmap(radius);
}

function majRadiusHeatmap(radius)
{
  map.removeLayer(heatmapLayer);
  radius = facteurRadius * radius;

  //radius += Math.log(facteurRadius);
  //console.log('après facteur '+ facteurRadius +' : ' + radius);
  
  heatmapcfg.radius = radius;
  map.addLayer(heatmapLayer);
}