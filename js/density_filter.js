function ajouterFormFiltre(obj)
{
  if (obj.value == "-1") return;
  var div = document.getElementById("divFiltres");
  div.innerHTML += '<div id="div-'+ obj.value +'" class="col-sm"></div>';

  div = document.getElementById("div-"+ obj.value);
  div.innerHTML = '<b>' + obj.item(obj.selectedIndex).text + '</b><br>' +
                  '<select id="values-'+ obj.value +'" multiple></select><br>' +
                  '<button onclick="supprimerFormFiltre(\''+ obj.value +'\')">Supprimer filtre</button>';

  div = document.getElementById("values-"+ obj.value);

  var tabValAttribut = [];
  for (var i = 0; i < importedData.length; i++)
  {
    var valAttribut = importedData[i].attr[obj.value];
    if (!tabValAttribut.includes(valAttribut)) tabValAttribut.push(valAttribut);
  }

  tabValAttribut.sort()
  for (var i = 0; i < tabValAttribut.length; i++)
      div.innerHTML += "<option value='"+ i +"'>"+ tabValAttribut[i] +"</option>";

  document.getElementById("selectFiltre").selectedIndex = 0;
}

function supprimerFormFiltre(id)
{
  document.getElementById("div-" + id).outerHTML = '';
  appliquerFiltres();
}

function creerTabFiltres()
{
  var div = document.getElementById("divFiltres");
  var tabFilter = [];

  for (var i = 0; i < div.childNodes.length; i++)
  {
    var id = parseInt(div.childNodes[i].id.split('-')[1]);
    var tmpVals = document.querySelectorAll("#values-"+ id +" option:checked");
    var filterValues = [];
    for (var j = 0; j < tmpVals.length; j++) filterValues.push(tmpVals[j].text);
    tabFilter.push({"idxCol": id, "values" : filterValues });
  }

  return tabFilter;
}


function appliquerFiltres()
{
  var tabFilter = creerTabFiltres();
  filteredData = [];

  for (var i = 0; i < importedData.length; i++)
  {
    var tabFlag = [];
    for (var j = 0; j < tabFilter.length; j++)
    {
      var idxCol = tabFilter[j].idxCol;
      var tmp = importedData[i].attr[idxCol];
      tabFlag.push(tabFilter[j].values.indexOf(tmp) > -1);
    }

    if (!tabFlag.includes(false))
    {
      filteredData.push(importedData[i]);  
    }
  }

  dessiner(filteredData);
  afficherStats();
}