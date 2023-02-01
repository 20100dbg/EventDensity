function GetColor(s)
{
  var tabData = [ "" ];
  var tabColor = [ "#3388ff" ];

  var idx = tabData.find(s);
  return tabColor[idx];
}

function importFile() {
  var fileInput = document.getElementById('fileInput');
  var fileReader = new FileReader();

  fileReader.onload = function (e) {
    
    if (fileInput.files[0].name.endsWith(".csv")) heatData = importCSV(fileReader.result);
    else heatData = JSON.parse(fileReader.result).data;

    setParams(heatData);
    resetSlider();
  }
  
  fileReader.readAsText(fileInput.files[0]);
}

function drawPoints(heatData)
{
  for (var i = 0; i < layers.length; i++) layers[i].remove();
  layers = [];

  for (var i = 0; i < heatData.data.length; i++)
  {
    layer = L.circle([heatData.data[i].lat, heatData.data[i].lng], 
      {radius: 100, color: GetColor(""), fill: true, fillColor: "#3388ff", fillOpacity: 1}).addTo(map);
    
    layers.push(layer);
  }
}

function resetSlider()
{
  document.getElementById("fromSlider").value = 0;
  document.getElementById("toSlider").value = 10;
  updateHeatmap(0, 10);
}

function importCSV(txt)
{
  //lat / long / gdh / count
  var lines = txt.split('\n');
  var data = [];

  for (var i = 0; i < lines.length; i++)
  {
    var tab = lines[i].trim().split(';');
    var c = (tab.length > 3) ? tab[3] : 1;
    data.push({lat: tab[0], lng: tab[1], gdh: Date.parse(ConvertDate(tab[2])), count: c });
  }

  data.sort((a, b) => a.gdh > b.gdh);
  return data;
}

function setParams(data)
{
  minGdh = data[0].gdh;
  maxGdh = data[data.length - 1].gdh;
}

function info(valSlider, minGdh, maxGdh, deb, fin, nb)
{
  document.getElementById("info").innerText = 
    "nb data : " + nb + "\n" +
    "minGdh : " + new Date(minGdh) + "\n" +
    "maxGdh : " + new Date(maxGdh) + "\n";
}

function updateHeatmap(fromSlider, toSlider)
{
  const [from, to] = getParsed(fromSlider, toSlider);
  var diff = maxGdh - minGdh;
  var deb = minGdh + (from * diff / 100);
  var fin = minGdh + (to * diff / 100);
  var data = [];

  for (var i = 0; i < heatData.length; i++)
    if (heatData[i].gdh > deb && heatData[i].gdh < fin)
      data.push(heatData[i]);

  if (heatData.length > 0)
    info(0, heatData[0].gdh, heatData[heatData.length - 1].gdh, deb, fin, data.length);

  var tmp = GetHeatDataObject(data);
  heatmapLayer.setData(tmp);
  drawPoints(tmp);
}


function GetHeatDataObject(data)
{
  var max = 0;
  for (var i = data.length - 1; i >= 0; i--)
    if (max < data[i].count) max = data[i].count;
  return { max: max + 1, data: data };
}

//Excel 15/01/2000 10:10:10 to 2000-01-15 10:10:10
function ConvertDate(val)
{
  tab = val.split(' ');
  date = tab[0].split('/');
  return date[2] + "-" + date[1] + "-" + date[0] + " " + tab[1]; 
}