//import
function importFile()
{
  var fileInput = document.getElementById('fileInput');
  var fileReader = new FileReader();

  fileReader.onload = function (e) {
    
    var filename = fileInput.files[0].name;
    var ext = filename.substring(filename.lastIndexOf('.'));

    if (ext == ".csv") importedData = importCSV(fileReader.result);
    else if (ext == ".json") importedData = JSON.parse(fileReader.result);
    else
    {
      alert("Format inconnu");
      importedData = [];
    }

    filteredData = importedData;
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
    var attr = tab.slice(4);

    data.push({lat: tab[0], lng: tab[1], gdh: Date.parse(ConvertDate(tab[2])), 
      count: parseInt(tab[3]), attr: attr });
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


//filtres

function fillFilterForm()
{
  var div = document.querySelector("#filterColumn");
  div.innerHTML = '<option value="-1">Filtre</option>';

  for (var i = 0; i < tabHeaders.length; i++)
    div.innerHTML += "<option value='"+ i +"'>"+ tabHeaders[i] +"</option>";
}

function applyFilter()
{
  filterCol = document.querySelector("#filterColumn").value;
  //var val = document.querySelector("#filterValue").value;

  var tmpVals = document.querySelectorAll("#filterAvailableValues option:checked");
  filterValues = [];
  for (var i = 0; i < tmpVals.length; i++) filterValues.push(tmpVals[i].value);

  filteredData = [];
  for (var i = 0; i < importedData.length; i++)
  {
    if (filterValues.indexOf(importedData[i].attr[filterCol]) > -1)
      filteredData.push(importedData[i])
  }
}

function colFilterSelected()
{
  var idxCol = parseInt(document.querySelector("#filterColumn").value);
  var selValues = document.querySelector("#filterAvailableValues");

  if (idxCol == -1) return;

  dicCouleur = {};
  selValues.innerHTML = '';
  var idxColor = 0;

  for (var i = 0; i < importedData.length; i++)
  {
    var tmpVal = importedData[i].attr[idxCol];

    //construire un dictionnaire de couleurs
    if (!(tmpVal in dicCouleur))
    {
      //charger les valeurs de cette colonnes  
      dicCouleur[tmpVal] = tabColor[idxColor];
      selValues.innerHTML += "<option>" + tmpVal + "</option>";
      if (idxColor < tabColor.length - 1) idxColor++;
    }
  }

}

//dessin

function updateHeatmap(data, fromSlider, toSlider)
{
  const [from, to] = getParsed(fromSlider, toSlider);
  
  var minGdh = data[0].gdh;
  var maxGdh = data[data.length - 1].gdh;
  var diff = maxGdh - minGdh;
  var deb = minGdh + (from * diff / 100);
  var fin = minGdh + (to * diff / 100);

  var drawData = [];

  for (var i = 0; i < data.length; i++)
    if (data[i].gdh > deb && data[i].gdh < fin)
      drawData.push(data[i]);


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
    var color = dicCouleur[heatData.data[i].attr[filterCol]];
    layer = L.circle([heatData.data[i].lat, heatData.data[i].lng], 
      {radius: 100, color: color, fill: true, fillColor: color, fillOpacity: 1}).addTo(map);
    
    layers.push(layer);
  }
}

function resetSlider()
{
  document.getElementById("fromSlider").value = 0;
  document.getElementById("toSlider").value = 10;
  updateHeatmap(importedData, 0, 10);
}

function info()
{
  document.getElementById("info").innerText = 
    
    "nbTotalLigne : " + info.nbTotalLigne + "\n" +
    "minGdh : " + new Date(info.minGdh) + "\n" +
    "maxGdh : " + new Date(info.maxGdh) + "\n";
}
