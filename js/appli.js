function importFile() {
  var fileInput = document.getElementById('fileInput');
  var fileReader = new FileReader();

  fileReader.onload = function (e) {
    
    if (fileInput.files[0].name.endsWith(".csv"))
    {
      heatData = importCSV(fileReader.result);
    }
    else
    {
      heatData = JSON.parse(fileReader.result).data;
    }

    setParams(heatData);
    resetSlider();
  }
  
  fileReader.readAsText(fileInput.files[0]);
}

function resetSlider()
{
  document.getElementById("myRange").value = 1;
  updateHeatmap(1);
}

function importCSV(txt)
{
  //lat / long / gdh
  var lines = txt.split('\n');
  var data = [];

  for (var i = 0; i < lines.length; i++)
  {
    var tab = lines[i].trim().split(';');

    data.push({lat: tab[0], lng: tab[1], 
      gdh: Date.parse(ConvertDate(tab[2])), count: 1 });
  }

  data.sort((a, b) => a.gdh > b.gdh);

  return data;
}

function setParams(data)
{
  minGdh = data[0].gdh;
  maxGdh = data[data.length - 1].gdh;

  ecartTotal = maxGdh - minGdh;
  sliderSpan = ecartTotal / 20;
}

function info(valSlider, minGdh, maxGdh, deb, fin, nb)
{
  document.getElementById("info").innerText = 
    "slider : " + valSlider + "\n" +
    "sliderSpan : " + sliderSpan + "\n" +
    "nb data : " + nb + "\n" +
    "minGdh : " + new Date(minGdh) + "\n" +
    "maxGdh : " + new Date(maxGdh) + "\n" +
    "deb : " + deb + "\n" +
    "fin : " + fin + "\n";
}

function updateHeatmap()
{
  value = document.getElementById("myRange").value;

  var deb = minGdh + ((value - 1) * sliderSpan);
  var fin = deb + sliderSpan;
  var data = [];

  for (var i = 0; i < heatData.length; i++)
    if (heatData[i].gdh > deb && heatData[i].gdh < fin)
      data.push(heatData[i]);

  if (heatData.length > 0)
    info(value, heatData[0].gdh, heatData[heatData.length - 1].gdh, deb, fin, data.length);

  heatmapLayer.setData(GetHeatDataObject(data));
}


function GetHeatDataObject(data)
{
  var max = 0;
  for (var i = data.length - 1; i >= 0; i--)
    if (max < data[i].count) max = data[i].count;

  return { max: 2, data: data };
}


function ResizeSpan()
{
  var x = document.getElementById("SpanSize").value;
  sliderSpan = x * 60* 60 * 1000;

  document.getElementById("progressbar").value = sliderSpan / ecartTotal * 100;
}

//Excel 15/01/2000 10:10:10 to 2000-01-15 10:10:10
function ConvertDate(val)
{
  tab = val.split(' ');
  date = tab[0].split('/');
  return date[2] + "-" + date[1] + "-" + date[0] + " " + tab[1]; 
}