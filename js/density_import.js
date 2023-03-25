var splitcsv = /;(?=(?:(?:[^"]*"){2})*[^"]*$)/

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
      importedData = [];
    }

    if (importedData.length == 0)
    {
      alert("Format inconnu et/ou aucune donnée");
      return;
    }

    importedData.sort((a, b) => a.gdh > b.gdh);
    startDate = importedData[0].gdh;
    endDate = importedData[importedData.length - 1].gdh;

    idxColCouleur = -1;
    filteredData = importedData;

    creerBandeau(filteredData);
    remplirFormCouleur();
    remplirFormFiltre();
    majPeriode();

    dessiner(filteredData);
    centrerVue(filteredData);
    initHeatmap();
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
    var tab = lines[i].trim().split(splitcsv);
    if (tab.length < 5) continue;

    var tabAttr = tab.slice(5);
    for (var j = 0; j < tabAttr.length; j++) tabAttr[j] = tabAttr[j].replace(/^"+|"+$/g, '');

    data.push({lat: tab[1], lng: tab[0], gdh: Date.parse(tab[4].replace(/^"+|"+$/g, '')), 
      count: 1, attr: tabAttr });
  }

  
  return data;
}


function findBounds(tabPoints)
{
    var N = tabPoints[0].lat, S = tabPoints[0].lat, E = tabPoints[0].lng, W = tabPoints[0].lng;

    for (var i = 1; i < tabPoints.length; i++)
    {
        if (N > tabPoints[i].lat) N = tabPoints[i].lat;
        else if (S < tabPoints[i].lat) S = tabPoints[i].lat;
        
        if (E > tabPoints[i].lng) E = tabPoints[i].lng;
        else if (W < tabPoints[i].lng) W = tabPoints[i].lng;
    }

    return [[N, W], [S, E]];
}

function centrerVue(tabPoints)
{
    var bounds = findBounds(tabPoints);

    var pointNW = new  L.LatLng(bounds[0][0], bounds[0][1]); 
    var pointSE = new  L.LatLng(bounds[1][0], bounds[1][1]); 
    distanceNWSE = pointNW.distanceTo(pointSE);

    map.flyToBounds(bounds, {animate:false});
    map.zoomOut();
}