function addFormFilter(obj)
{
  if (obj.value == "-1") return;
  var div = document.querySelector("#containerFilter");
  div.innerHTML += '<div id="div-'+ obj.value +'" class="col-sm"></div>';

  div = document.querySelector("#div-"+ obj.value);
  div.innerHTML = '<b>' + obj.item(obj.selectedIndex).text + '</b><br>' +
                  '<select id="values-'+ obj.value +'" multiple></select><br>' +
                  '<button onclick="delFilter(\''+ obj.value +'\')">Supprimer filtre</button>';

  div = document.querySelector("#values-"+ obj.value);

  var tabValAttribut = [];
  for (var i = 0; i < importedData.length; i++)
  {
    var valAttribut = importedData[i].attr[obj.value];
    if (!tabValAttribut.includes(valAttribut)) tabValAttribut.push(valAttribut);
  }

  tabValAttribut.sort()
  for (var i = 0; i < tabValAttribut.length; i++)
      div.innerHTML += "<option value='"+ i +"'>"+ tabValAttribut[i] +"</option>";

  document.querySelector("#filterColumn").selectedIndex = 0;
}

function delFilter(id)
{
  document.querySelector("#div-" + id).outerHTML = '';
  applyFilter();
}

function buildFilterTab()
{
  var div = document.querySelector("#containerFilter");
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


function applyFilter()
{
  var tabFilter = buildFilterTab();
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

    if ((config.filterAllCriteria && !tabFlag.includes(false)) ||
        (!config.filterAllCriteria && tabFlag.includes(true)))
    {
      filteredData.push(importedData[i]);  
    }
  }

  info.nbLigneFiltrees = filteredData.length;
  printinfo();
}