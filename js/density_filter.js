function addFormFilter(obj)
{
  var div = document.querySelector("#containerFilter");
  div.innerHTML += '<div id="div-'+ obj.value +'" class="col-sm"></div>';
  div = document.querySelector("#div-"+ obj.value);
  div.innerHTML = '<button onclick="delFilter(\''+ obj.value +'\')">Supprimer filtre</button><br>' + 
                  '<select id="values-'+ obj.value +'" multiple></select>';
  
  div = document.querySelector("#values-"+ obj.value);

  var tmpTabValues = [];
  for (var i = 0; i < importedData.length; i++)
  {
    var tmpVal = importedData[i].attr[obj.value];
    if (!tmpTabValues.includes(tmpVal))
    {
      tmpTabValues.push(tmpVal);
      div.innerHTML += "<option value='"+ i +"'>"+ tmpVal +"</option>";
    }    
  }  
}

function delFilter(id)
{
  document.querySelector("#div-" + id).outerHTML = '';
}

function buildFilterTab()
{
  var div = document.querySelector("#containerFilter");
  var tabFilter = [];

  for (var i = 0; i < div.childNodes.length; i++)
  {
    var id = parseInt(div.childNodes[0].id.split('-')[1]);
    var tmpVals = document.querySelectorAll("#values-"+ id +" option:checked");
    var filterValues = [];
    for (var i = 0; i < tmpVals.length; i++) filterValues.push(tmpVals[i].text);
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
      tabFlag.push(tabFilter[j].values.indexOf(importedData[i].attr[idxCol]) > -1);
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