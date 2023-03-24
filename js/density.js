//import
function importFile()
{
  var fileInput = document.getElementById('fileInput');
  var fileReader = new FileReader();

  fileReader.onload = function (e) {
    
    var filename = fileInput.files[0].name;
    var ext = filename.substring(filename.lastIndexOf('.'));

    if (filename.indexOf('CITHARE') > -1) importedData = importCITHARE(fileReader.result);
    else if (ext == ".csv") importedData = importCSV(fileReader.result);
    else
    {
      alert("Format inconnu");
      importedData = [];
    }

    document.querySelector("#containerFilter").innerHTML = '';
    info.nbTotalLigne = importedData.length;
    if (info.nbTotalLigne > 0)
    {
      info.minGdh = importedData[0].gdh;
      info.maxGdh = importedData[importedData.length - 1].gdh;      
    }
    printinfo();

    filteredData = importedData;
    resetCanvas();
    buildBandeau(filteredData);
    fillCouleurForm();
    fillFilterForm();
    resetSlider();
  }
  
  fileReader.readAsText(fileInput.files[0]);
}


function importCSV(txt)
{
  //lat / long / gdh / count
  var lines = txt.split('\n');
  var data = [];

  var headerLine = lines[0].trim().split(';');
  if (headerLine.length < 4) return data;
  tabHeaders = headerLine.slice(4);

  for (var i = 1; i < lines.length; i++)
  {
    var tab = lines[i].trim().split(';');
    if (tab.length < 4) continue;
    data.push({lat: tab[0], lng: tab[1], gdh: Date.parse(ConvertDate(tab[2])), 
      count: parseInt(tab[3]), attr: tab.slice(4) });
  }

  data.sort((a, b) => a.gdh > b.gdh);
  return data;
}

function importCITHARE(txt)
{
  var lines = txt.split('\n');
  var data = [];

  var headerLine = lines[0].trim().split(';');
  if (headerLine.length < 5) return data;
  tabHeaders = headerLine.slice(5);

  for (var i = 1; i < lines.length; i++)
  {
    var tab = lines[i].trim().split(';');
    if (tab.length < 5) continue;

    var tabAttr = tab.slice(5);
    for (var j = 0; j < tabAttr.length; j++) tabAttr[j] = tabAttr[j].replace(/^"+|"+$/g, '');

    data.push({lat: tab[1], lng: tab[0], gdh: Date.parse(tab[4].replace(/^"+|"+$/g, '')), 
      count: 1, attr: tabAttr });
  }

  data.sort((a, b) => a.gdh > b.gdh);
  return data;
}

//Excel 15/01/2000 10:10:10 to 2000-01-15 10:10:10
function ConvertDate(val)
{
  tab = val.split(' ');
  date = tab[0].split('/');
  return date[2] + "-" + date[1] + "-" + date[0] + " " + tab[1]; 
}


//prepare data

function GetHeatDataObject(data)
{
  var max = 0;
  for (var i = data.length - 1; i >= 0; i--)
    if (max < data[i].count) max = data[i].count;
  return { max: max + 1, data: data };
}


//filtres et couleur

function fillCouleurForm()
{
  var div = document.querySelector("#CouleurColumn");
  div.innerHTML = '<option value="-1">Coloration</option>';

  for (var i = 0; i < tabHeaders.length; i++)
    div.innerHTML += "<option value='"+ i +"'>"+ tabHeaders[i] +"</option>";
}

function fillFilterForm()
{
  var div = document.querySelector("#filterColumn");
  div.innerHTML = '<option value="-1">Filtre</option>';

  for (var i = 0; i < tabHeaders.length; i++)
    div.innerHTML += "<option value='"+ i +"'>"+ tabHeaders[i] +"</option>";
}

function changeCouleur(obj)
{
  var div = document.querySelector("#CouleurValues");
  div.innerHTML = '';
  idxColCouleur = parseInt(obj.value);
  dicCouleur = {};
  var tmpTabValues = [];
  var idxColor = 0;
  var tabValeurs = {};

  for (var i = 0; i < importedData.length; i++)
  {
    var val = importedData[i].attr[idxColCouleur];
    if (!(val in tabValeurs)) tabValeurs[val] = 0;
    tabValeurs[val] += 1;
  }

  var items = Object.keys(tabValeurs).map(function(key) { return [key, tabValeurs[key]]; });
  items.sort(function(a,b) { return b[1] - a[1]; });

  for (var i = 0; i < items.length; i++)
  {
    var val = items[i][0];
    dicCouleur[val] = tabColor[idxColor];
    div.innerHTML += "<option style='background:"+ tabColor[idxColor] +"'>" + val + "</option>";
    if (idxColor < tabColor.length - 1) idxColor++;
  }
}

//dessin

function updateHeatmap(data, fromSlider, toSlider)
{
  const [from, to] = getParsed(fromSlider, toSlider);
  if (data.length == 0) return;

  var minGdh = data[0].gdh;
  var maxGdh = data[data.length - 1].gdh;
  var diff = maxGdh - minGdh;
  var deb = minGdh + (from * diff / 100);
  var fin = minGdh + (to * diff / 100);
  var drawData = [];

  for (var i = 0; i < data.length; i++)
    if (data[i].gdh >= deb && data[i].gdh <= fin)
      drawData.push(data[i]);


  info.debSpan = deb;
  info.finSpan = fin;
  info.nbLigneCurrent = drawData.length;
  printinfo();

  var tmp = GetHeatDataObject(drawData);
  if (config.showHeatmap) heatmapLayer.setData(tmp);
  if (config.showPoints) drawPoints(tmp);
}


function drawPoints(heatData)
{
  for (var i = 0; i < layers.length; i++) layers[i].remove();
  layers = [];

  for (var i = 0; i < heatData.data.length; i++)
  {
    var color = (Object.keys(dicCouleur).length == 0) ? '#000000' : dicCouleur[heatData.data[i].attr[idxColCouleur]];

    layer = L.circle([heatData.data[i].lat, heatData.data[i].lng], 
      {radius: config.circleSize, color: color, fill: true, fillColor: color, fillOpacity: 1}).addTo(map);
    
    layers.push(layer);
  }
}


function buildDicCouleur(id)
{
  var selValues = document.querySelector("#values-" + id);

  dicCouleur = {};
  //selValues.innerHTML = '';
  var idxColor = 0;

  for (var i = 0; i < importedData.length; i++)
  {
    var tmpVal = importedData[i].attr[id];

    if (!dicCouleur.includes(tmpVal))
    {
      dicCouleur[tmpVal] = tabColor[idxColor];
      selValues.innerHTML += "<option style='background:"+ tabColor[idxColor] +"'>" + tmpVal + "</option>";
      if (idxColor < tabColor.length - 1) idxColor++;
    }
  }
}


function resetSlider()
{
  const fromSlider = document.querySelector('#fromSlider');
  const toSlider = document.querySelector('#toSlider');
  fromSlider.value = 0;
  toSlider.value = 10;

  //document.getElementById("fromSlider").value = 0;
  //document.getElementById("toSlider").value = 10;
  updateHeatmap(importedData, fromSlider, toSlider);
}

function printinfo()
{
  var x = (new Date(info.finSpan) - new Date(info.debSpan)) / 1000;
  
  document.getElementById("info").innerText =   
    "nbTotalLigne : " + info.nbTotalLigne + "\n" +
    "nbLigneFiltrees : " + info.nbLigneFiltrees + "\n" +
    "nbLigneCurrent : " + info.nbLigneCurrent + "\n" +
    "minGdh : " + new Date(info.minGdh).toLocaleString() + "\n" +
    "maxGdh : " + new Date(info.maxGdh).toLocaleString() + "\n" +
    "debSpan : " + new Date(info.debSpan).toLocaleString() + "\n" +
    "finSpan : " + new Date(info.finSpan).toLocaleString() + "\n" +
    "span : " + getSpan(x) + "\n" +
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

function drawLine(x)
{
  var c = document.getElementById("bandeau");
  var ctx = c.getContext("2d");
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, 20);
  ctx.stroke();
}

function buildBandeau(data)
{
  var startDate = getMinDate(data);
  var endDate = getMaxDate(data);
  var diff = endDate - startDate;
  var largeur = 400;

  for (var i = 0; i < data.length; i++)
  {
    var madate = endDate - data[i].gdh;
    drawLine(madate * largeur / diff);
  }
}

function resetCanvas()
{
  var c = document.getElementById("bandeau");
  var ctx = c.getContext("2d");
  ctx.clearRect(0,0,c.width,c.height);
}


function getMinDate(tab)
{
  var min = new Date(2999, 11, 31).getTime();
  for (var i = 0; i < tab.length; i++)
    if (min > tab[i].gdh) min = tab[i].gdh;
  return min;
}

function getMaxDate(tab)
{
  var max = new Date(0, 0, 1).getTime();
  for (var i = 0; i < tab.length; i++)
    if (max < tab[i].gdh) max = tab[i].gdh;
  return max;
}