var currentHost: string = "http://"+window.location.hostname+":"+8100+"/";
var currentHost: string = "http://localhost:8100/";

var MaxTimeSinceUpdateInMin = 15;
var utcOffsets: { label: string, value: number }[] = [];

(<HTMLInputElement>document.getElementById("InputTimeForUpdate"))!.value = "15"

StartSetupUTCTime();
ResetUTCLabel();
GetServers();
GetCategories();
GetStatus();

setInterval(function() {
  GetServers();
  GetCategories();
  GetStatus();
},  300000)


var CurrentServerObjects: ServerObject[] = [];
//#region Setup

var currentSearchTerm = "";

document.getElementById("SearchInput")?.addEventListener("input",function(){
  var searchinput = <HTMLInputElement>this;
  currentSearchTerm = searchinput.value;
  console.log(currentSearchTerm);
  GenerateStatus();
})

document.getElementById("addSource")?.addEventListener("click", function(){
  var promtbox = document.getElementById("promtbox");
  if(promtbox!=null) promtbox.hidden = !promtbox.hidden
});
document.getElementById("CancelDataSource")?.addEventListener("click", function(){
  var promtbox = document.getElementById("promtbox");
  if(promtbox!=null) promtbox.hidden = true
  ResetInput();
});
document.getElementById("AddDataSource")?.addEventListener("click", function(){
  var promtbox = document.getElementById("promtbox");
  AddSource();
  ResetInput();
  if(promtbox!=null) promtbox.hidden = true
});
document.getElementById("DataSourceServers")?.addEventListener("change", function(){
  var selectElement = <HTMLSelectElement>document.getElementById("DataSourceServers");
  var DatabaseSelectElement = <HTMLSelectElement>document.getElementById("DataSourceDB");
  var TableSchemaSelectElement = <HTMLSelectElement>document.getElementById("DataSourceSchemas");
  var TableSelectElement = <HTMLSelectElement>document.getElementById("DataSourceTables");
  var columnFlexDiv = <HTMLDivElement>document.getElementById("collumnFlex");
  var StatusColumnSelectElement = <HTMLInputElement>document.getElementById("DataSourceStatusColumn");
  DatabaseSelectElement.value = "";
  TableSchemaSelectElement.value = "";
  TableSelectElement.value = "";
  StatusColumnSelectElement.value = "";
  columnFlexDiv.innerHTML = "";
  TableSchemaSelectElement.disabled = true;
  TableSelectElement.disabled = true;
  StatusColumnSelectElement.disabled = true;

  if(selectElement!=null){
    console.log(selectElement.value)
    if(selectElement.value != ""){
      GetDatabases();
    }
  }
});
document.getElementById("DataSourceServers")?.addEventListener("click", function() {
  var selectElement = <HTMLSelectElement>document.getElementById("DataSourceServers");
  var DatabaseSelectElement = <HTMLSelectElement>document.getElementById("DataSourceDB");
  var TableSchemaSelectElement = <HTMLSelectElement>document.getElementById("DataSourceSchemas");
  var TableSelectElement = <HTMLSelectElement>document.getElementById("DataSourceTables");
  var columnFlexDiv = <HTMLDivElement>document.getElementById("collumnFlex");
  var StatusColumnSelectElement = <HTMLInputElement>document.getElementById("DataSourceStatusColumn");
  DatabaseSelectElement.value = "";
  TableSchemaSelectElement.value = "";
  TableSelectElement.value = "";
  StatusColumnSelectElement.value = "";
  columnFlexDiv.innerHTML = "";
  TableSchemaSelectElement.disabled = true;
  TableSelectElement.disabled = true;
  StatusColumnSelectElement.disabled = true;

  var options = selectElement?.querySelectorAll("option");
  var count = options?.length;
  if(typeof(count) === "undefined" || count < 2)
  {
    console.log(selectElement.value)
    GetDatabases();
  }
});

document.getElementById("DataSourceDB")?.addEventListener("change", function(){
  var selectElement = <HTMLSelectElement>document.getElementById("DataSourceDB");
  var TableSchemaSelectElement = <HTMLSelectElement>document.getElementById("DataSourceSchemas");
  var TableSelectElement = <HTMLSelectElement>document.getElementById("DataSourceTables");
  TableSchemaSelectElement.value = "";
  TableSelectElement.value = "";
  TableSchemaSelectElement.innerHTML = "";
  TableSelectElement.innerHTML = "";

  if(selectElement!=null){
    console.log(selectElement.value)
    GetTables();
    GetTableSchemas();
    GetSelectionConditions();
  }
});
document.getElementById("DataSourceDB")?.addEventListener("click", function() {
  var selectElement = <HTMLSelectElement>document.getElementById("DataSourceDB");
  var TableSchemaSelectElement = <HTMLSelectElement>document.getElementById("DataSourceSchemas");
  var TableSelectElement = <HTMLSelectElement>document.getElementById("DataSourceTables");
  TableSchemaSelectElement.value = ""
  TableSelectElement.value = ""
  TableSchemaSelectElement.innerHTML = "";
  TableSelectElement.innerHTML = "";

  var options = selectElement?.querySelectorAll("option");
  var count = options?.length;
  if(typeof(count) === "undefined" || count < 2)
  {
    console.log(selectElement.value)
    GetTables();
    GetTableSchemas();
    GetSelectionConditions();
  }
});
document.getElementById("DataSourceTables")?.addEventListener("change", function(){
  var selectElement = <HTMLSelectElement>document.getElementById("DataSourceTables");
  if(selectElement!=null){
    if(selectElement.value != ""){
      GetTableCollumns()
    }
  }
});
document.getElementById("DataSourceTables")?.addEventListener("click", function() {
  var selectElement = <HTMLSelectElement>document.getElementById("DataSourceTables");
  var options = selectElement?.querySelectorAll("option");
  var count = options?.length;
  if(typeof(count) === "undefined" || count < 2)
  {
    if(selectElement.value != ""){
      GetTableCollumns()
    }
  }
});
document.getElementById("DataSourceCategories")?.addEventListener("change", function(){
  var selectElement = <HTMLSelectElement>document.getElementById("DataSourceCategories");
  if(selectElement!=null){
    console.log(selectElement.value)
  }
});
document.getElementById("DataSourceCategories")?.addEventListener("click", function() {
  var selectElement = <HTMLSelectElement>document.getElementById("DataSourceCategories");
  var options = selectElement?.querySelectorAll("option");
  var count = options?.length;
  if(typeof(count) === "undefined" || count < 2)
  {
    console.log(selectElement.value)
  }
});
document.getElementById("DataSourceStatusColumn")?.addEventListener("change", function(){
  var selectElement = <HTMLSelectElement>document.getElementById("DataSourceStatusColumn");
  if(selectElement!=null){
    console.log(selectElement.value)
  }
});
document.getElementById("DataSourceStatusColumn")?.addEventListener("click", function() {
  var selectElement = <HTMLSelectElement>document.getElementById("DataSourceStatusColumn");
  var options = selectElement?.querySelectorAll("option");
  var count = options?.length;
  if(typeof(count) === "undefined" || count < 2)
  {
    console.log(selectElement.value)
  }
});
document.getElementById("DataSourceSchemas")?.addEventListener("change", function(){
  var selectElement = <HTMLSelectElement>document.getElementById("DataSourceSchemas");
  if(selectElement!=null){
    console.log(selectElement.value)
  }
});
document.getElementById("DataSourceSchemas")?.addEventListener("click", function() {
  var selectElement = <HTMLSelectElement>document.getElementById("DataSourceSchemas");
  var options = selectElement?.querySelectorAll("option");
  var count = options?.length;
  if(typeof(count) === "undefined" || count < 2)
  {
    console.log(selectElement.value)
  }
});

document.getElementById("DataSourceSelectionCondition")?.addEventListener("change", function(){
  var selectElement = <HTMLSelectElement>document.getElementById("DataSourceSelectionCondition");
  if(selectElement!=null){
    console.log(selectElement.value)
  }
});
document.getElementById("DataSourceSelectionCondition")?.addEventListener("click", function() {
  var selectElement = <HTMLSelectElement>document.getElementById("DataSourceSelectionCondition");
  var options = selectElement?.querySelectorAll("option");
  var count = options?.length;
  if(typeof(count) === "undefined" || count < 2)
  {
    console.log(selectElement.value)
  }
});

//#endregion

//#region Get-Funktions

function GetServers(){
  var ServerSelectElement = <HTMLSelectElement>document.getElementById("DataSourceServers");
  var ServersString = POSTtoServer("GetServers", {});
  ServerSelectElement.disabled = true;
  ServersString.then((value) =>{
    AddToOptions(ServerSelectElement,value);
  })
  
}
function GetCategories(){
  var CategoriesSelectElement = <HTMLSelectElement>document.getElementById("DataSourceCategories");
  var ServersString = POSTtoServer("GetCategories", {});
  CategoriesSelectElement.disabled = true;
  ServersString.then((value) =>{
    AddToOptions(CategoriesSelectElement,value);
  })
  
}
function GetDatabases(){
  var ServerSelectElement = <HTMLSelectElement>document.getElementById("DataSourceServers");
  var DatabaseSelectElement = <HTMLSelectElement>document.getElementById("DataSourceDB");
  if(ServerSelectElement.value != ""){
    var ServersString = POSTtoServer("GetDatabases", {serverid: ServerSelectElement.value});
  
    ServersString.then((value) =>{
      AddToOptions(DatabaseSelectElement,value);
    })
  }
}
function GetTables(){
  var ServerSelectElement = <HTMLSelectElement>document.getElementById("DataSourceServers");
  var DatabaseSelectElement = <HTMLSelectElement>document.getElementById("DataSourceDB");
  var TableSelectElement = <HTMLSelectElement>document.getElementById("DataSourceTables");
  TableSelectElement.disabled = true;
  if(ServerSelectElement.value != "" && DatabaseSelectElement.value  != ""){
    var ServersString = POSTtoServer("GetTables", {serverid: ServerSelectElement.value, databaseid: DatabaseSelectElement.value});
    console.log(ServersString)
    ServersString.then((value) =>{
      AddToOptions(TableSelectElement,value);
    })
  }
}
function GetTableSchemas(){
  var ServerSelectElement = <HTMLSelectElement>document.getElementById("DataSourceServers");
  var DatabaseSelectElement = <HTMLSelectElement>document.getElementById("DataSourceDB");
  var TableSchemaSelectElement = <HTMLSelectElement>document.getElementById("DataSourceSchemas");
  TableSchemaSelectElement.disabled = true;
  if(ServerSelectElement.value != "" && DatabaseSelectElement.value  != ""){
    var ServersString = POSTtoServer("GetSchemas", {serverid: ServerSelectElement.value, databaseid: DatabaseSelectElement.value});
  
    ServersString.then((value) =>{
      AddToOptions(TableSchemaSelectElement,value);
    })
  }

}
function GetSelectionConditions(){
  var ConditionSelectElement = <HTMLSelectElement>document.getElementById("DataSourceSelectionCondition");
  var ServersString = POSTtoServer("GetSelectionConditions", {});
  ServersString.then((value) =>{
    AddToOptions(ConditionSelectElement,value);
  })
}
function GetTableCollumns(){
  var ServerSelectElement = <HTMLSelectElement>document.getElementById("DataSourceServers");
  var DatabaseSelectElement = <HTMLSelectElement>document.getElementById("DataSourceDB");
  var TableSchemaSelectElement = <HTMLSelectElement>document.getElementById("DataSourceSchemas");
  var TableSelectElement = <HTMLSelectElement>document.getElementById("DataSourceTables");
  var StatusColumnSelectElement = <HTMLSelectElement>document.getElementById("DataSourceStatusColumn");
  StatusColumnSelectElement.disabled = true;
  var ServersString = POSTtoServer("GetDatabaseCollumns", {serverid: ServerSelectElement.value, databaseid: DatabaseSelectElement.value, tableid: TableSelectElement.value, tableschemaid: TableSchemaSelectElement.value});
  if(ServerSelectElement.value != "" && DatabaseSelectElement.value  != ""&& TableSelectElement.value  != "" && TableSchemaSelectElement.value  != ""){
    ServersString.then((value) =>{
      AddToOptions(StatusColumnSelectElement,value);
      var columnFlexDiv = document.getElementById("collumnFlex");
      var ColumnssArray = JSON.parse(value);
      columnFlexDiv!.innerHTML = "";
      for (let index = 0; index < ColumnssArray.length; index++) {
        var e = document.createElement("button")
        e.innerText = ColumnssArray[index];
        e.setAttribute("class","columnButton");
        e.setAttribute("id","cbut"+index);
        e.setAttribute("value",index.toString());
        columnFlexDiv?.appendChild(e);
        e.addEventListener("click", function(event){
          var targetElement = <HTMLElement>event.target;
          if(targetElement != null) CheckButton(targetElement);
      });
      
      }
    })
  }



}
function GetStatus(){
  var ServersString = POSTtoServer("GetStatus",{})
    ServersString.then((value) =>{
      CurrentServerObjects = JSON.parse(value);
      GenerateSidepanel();
      GenerateStatus();
  });
}
//#endregion

//#region Get-Utility-Funktions
function CheckButton(_e:HTMLElement){
  var eclasses = _e.getAttribute("class")
  if(eclasses?.includes("cbutChecked")){
    _e.setAttribute("class","columnButton");
  } else {
    _e.setAttribute("class","columnButton cbutChecked");
  }
}
function AddToOptions(_selectElement:HTMLSelectElement, _OptionsString: string){
  var OptionsArray = JSON.parse(_OptionsString);
  _selectElement.innerHTML = "";
  _selectElement.disabled = false;
  for (let index = 0; index < OptionsArray.length; index++) {
    var e = document.createElement("option")
    e.text = OptionsArray[index];
    e.value = index.toString();
    _selectElement.appendChild(e);
  }
}
function AddSource(){
  var ServerSelectElement = <HTMLSelectElement>document.getElementById("DataSourceServers");
  var DatabaseSelectElement = <HTMLSelectElement>document.getElementById("DataSourceDB");
  var TableSchemaSelectElement = <HTMLSelectElement>document.getElementById("DataSourceSchemas");
  var StatusColumnSelectElement = <HTMLSelectElement>document.getElementById("DataSourceStatusColumn");
  var TableSelectElement = <HTMLSelectElement>document.getElementById("DataSourceTables");
  var SelectionConditionSelectElement = <HTMLSelectElement>document.getElementById("DataSourceSelectionCondition");
  var CategoriesSelectElement = <HTMLSelectElement>document.getElementById("DataSourceCategories");
  var TitleInputElement = <HTMLInputElement>document.getElementById("DatasourceDisplayTitle");
  var CheckedColumns = <HTMLCollectionOf<HTMLButtonElement>>document.getElementsByClassName("cbutChecked");
  var UTCTime = <HTMLSelectElement>document.getElementById("DataSourceUTCTime");
  var CheckedCollumnsArray: number[] = [];
  for (let index = 0; index < CheckedColumns.length; index++) {
    CheckedCollumnsArray[index] = parseInt(CheckedColumns[index].value)
  }
  if(ServerSelectElement.value != "" && DatabaseSelectElement.value  != ""&& TableSelectElement.value  != ""  &&StatusColumnSelectElement.value != "" && TableSchemaSelectElement.value  != "" && CheckedCollumnsArray.length != 0 && SelectionConditionSelectElement.value != ""&& CategoriesSelectElement.value != "" && TitleInputElement.value != ""){
    var ErrorDiv = document.getElementById("ErrorAddDiv");
    ErrorDiv!.innerHTML = "";
    POSTtoServer("AddSource",{
      serverid: ServerSelectElement.value,
      databaseid: DatabaseSelectElement.value,
      tableid: TableSelectElement.value,
      statuscollumnid: StatusColumnSelectElement.value,
      tableschemaid: TableSchemaSelectElement.value,
      visibleCollumnNumbers: CheckedCollumnsArray,
      selectConditionid: SelectionConditionSelectElement.value,
      categoryid: CategoriesSelectElement.value,
      DisplayTitle: TitleInputElement.value,
      UTCTimeOffset: UTCTime.value
    });
  }

  
}
function ResetInput(){
  var ServerSelectElement = <HTMLSelectElement>document.getElementById("DataSourceServers");
  var DatabaseSelectElement = <HTMLSelectElement>document.getElementById("DataSourceDB");
  var TableSchemaSelectElement = <HTMLSelectElement>document.getElementById("DataSourceSchemas");
  var TableSelectElement = <HTMLSelectElement>document.getElementById("DataSourceTables");
  var SelectionConditionSelectElement = <HTMLSelectElement>document.getElementById("DataSourceSelectionCondition");
  var CategoriesSelectElement = <HTMLSelectElement>document.getElementById("DataSourceCategories");
  var columnFlexDiv = <HTMLDivElement>document.getElementById("collumnFlex");
  var TitleInputElement = <HTMLInputElement>document.getElementById("DataSourceTables");
  var StatusColumnSelectElement = <HTMLInputElement>document.getElementById("DataSourceStatusColumn");
  ServerSelectElement.innerHTML = "";
  DatabaseSelectElement.innerHTML = "";
  TableSchemaSelectElement.innerHTML = "";
  TableSelectElement.innerHTML = "";
  SelectionConditionSelectElement.innerHTML = "";
  CategoriesSelectElement.innerHTML = "";
  columnFlexDiv.innerHTML = "";
  TitleInputElement.value = "";
  StatusColumnSelectElement.innerHTML = "";
  DatabaseSelectElement.disabled = true;
  TableSchemaSelectElement.disabled = true;
  TableSelectElement.disabled = true;
  SelectionConditionSelectElement.disabled = true;
  CategoriesSelectElement.disabled = true;
  StatusColumnSelectElement.disabled =  true;
  var ErrorDiv = document.getElementById("ErrorAddDiv");
  ErrorDiv!.innerHTML = "Missing Input";

  ResetUTCLabel();
  GetServers();
  GetCategories();
  GetStatus();
}
//#endregion

//#region Status-Generation
function GenerateSidepanel(){
  var SideSQLSources = <HTMLElement>document.getElementById("SideSQLSources");
  SideSQLSources.innerHTML=""
  for (let index = 0; index < CurrentServerObjects.length; index++) {
    var  e = document.createElement("li")
    if(typeof(CurrentServerObjects[index].Data) === "string") e.innerHTML = "<a href='#'><i class='uil-exclamation-octagon fa-fw'></i>"+CurrentServerObjects[index].SourceObject.DisplayTitle+"</a>"
    else e.innerHTML = "<a href='#'><i class='uil-database fa-fw'></i>"+CurrentServerObjects[index].SourceObject.DisplayTitle+"</a>"
    SideSQLSources.appendChild(e);
  }
}

function GenerateStatus(){
  //var gridbox = document.getElementById("gridbox");
  //var listbox = document.getElementById("listbox");
  var gridsizeselect = <HTMLSelectElement>document.getElementById("GridSizeSelect");
  var orderbyselect = <HTMLSelectElement>document.getElementById("OrderSelect");
  var displayselect = <HTMLSelectElement>document.getElementById("DisplaySelect");
  var gridsection = document.getElementById("gridsection");
  var listsection = document.getElementById("listsection");


  var _method = orderbyselect.value
  var gridsize = parseInt(gridsizeselect.value);
  var displaytype = displayselect.value;


  if(gridsection!=null && listsection!=null){
    gridsection.innerHTML = "";
    listsection.innerHTML = "";
    var gridbox = document.createElement("div");
    var listbox = document.createElement("div");
    gridbox.setAttribute("class","row")
    listbox.setAttribute("class","row")
    gridsection.appendChild(gridbox);
    listsection.appendChild(listbox)


    /*
    var gridsizecss = "grid-template-columns:"
    for (let i = 0; i < gridsize; i++) {
      gridsizecss += " auto"
    }*/

    var gridsizecss = "grid-template-columns: repeat("+gridsize+", minmax(0, 1fr));"
    gridbox.setAttribute("style",gridsizecss)

    if(_method == "Standart"){
      for (let i = 0; i < CurrentServerObjects.length; i++) {
        DisplayAs(CurrentServerObjects[i],displaytype,_method,gridbox,listbox)
      }
      
    } else if(_method == "Alphabetical") {
      var SortedStatus = Array.from(CurrentServerObjects);
      SortedStatus = sortbyprop("SourceObject.DisplayTitle",SortedStatus);
      for (let i = 0; i < SortedStatus.length; i++) {
        DisplayAs(SortedStatus[i],displaytype,_method,gridbox,listbox)
      }

    } else if(_method == "Category") {
      var SortedStatus = Array.from(CurrentServerObjects);
      SortedStatus = sortbyprop("SourceObject.Category",SortedStatus);
      var currentCategory = "";
      var Categories: any[] = []
      for (let i = 0; i < SortedStatus.length; i++) {
        if(currentCategory != SortedStatus[i].SourceObject.Category){
          currentCategory = SortedStatus[i].SourceObject.Category
          var newgridbox = document.createElement("div");
          var newlistbox = document.createElement("div");
          newlistbox.setAttribute("class","row mb-2");
          newgridbox.setAttribute("class","row mb-2");
          newgridbox.setAttribute("style",gridsizecss)
          if(displaytype == "Grid"){
            var gridheader = document.createElement("h3");
            gridheader.innerHTML = currentCategory;
            gridheader.setAttribute("class","CategoryHeader")
            gridsection.appendChild(gridheader);
            
          } else if(displaytype == "List") {
            var listheader = document.createElement("h3");
            listheader.innerHTML = currentCategory;
            listsection.appendChild(listheader);
          }
          gridsection.appendChild(newgridbox);
          listsection.appendChild(newlistbox);
          Categories.push({category:currentCategory,listbox:newlistbox,gridbox:newgridbox});
        }
      }
      for (let i = 0; i < Categories.length; i++) {
        for (let j = 0; j < SortedStatus.length; j++) {
          if(SortedStatus[j].SourceObject.Category ==  Categories[i].category){
            DisplayAs(SortedStatus[j],displaytype,_method, Categories[i].gridbox, Categories[i].listbox)
          }
        }
      }
    } else if(_method == "Urgency") {
      var forSorting: any[] = [];
      for (let i = 0; i < CurrentServerObjects.length; i++) {
        if(CurrentServerObjects[i].Data instanceof String) var datetouse:string = "";
        else var datetouse:string = CurrentServerObjects[i].Data[CurrentServerObjects[i].Data.length-1][CurrentServerObjects[i].SourceObject.StatusColumn];
        forSorting.push({index: i, date:datetouse})
      }
      var forSort = Array.from(forSorting);
      forSort = sortbyprop("date",forSort);
      for (let i = 0; i < forSort.length; i++) {
        DisplayAs(CurrentServerObjects[forSort[i].index],displaytype,_method,gridbox,listbox)
      }
    }
  }

}

function DisplayAs(_currentobject:ServerObject,_displaytype:string,_method:string,_gridbox:HTMLElement,_listbox:HTMLElement){
  if(_currentobject.SourceObject.DisplayTitle.toLowerCase().includes(currentSearchTerm) || currentSearchTerm == ""){
    var errorDisplay = false;
    if(typeof(_currentobject.Data) === "string") errorDisplay = true
    var lastdate = "";
    if(errorDisplay) lastdate = "";
    else lastdate = _currentobject.Data[_currentobject.Data.length-1][_currentobject.SourceObject.StatusColumn]
    var formattedDate = FormatDateTime(lastdate, _currentobject.SourceObject.UTCTimeOffset);
    console.log(formattedDate)
    if(_displaytype == "Grid"){
      var e = document.createElement("div");
      if(errorDisplay) e.setAttribute("class","d-flex align-items-center rounded-2 p-3 Statusdiv StatusDivError")
      else e.setAttribute("class","d-flex align-items-center rounded-2 p-3 Statusdiv")
      if(formattedDate != null){
        e.innerHTML = "<div class='Status' style='background-color: "+GetBackgroundColor(formattedDate.formattedDate)+";'></div>"
        e.innerHTML += "<div class='ms-3 statustext'><h3 class='fs-5 mb-1 testingwithstyle'>"+_currentobject.SourceObject.DisplayTitle+"</h3><p class='mb-0 Statuspara'>Last-Check: "+formattedDate.formattedDate+"</p><p class='mb-0 Statuspara'>Original: "+formattedDate.originalDate+"</p></div>";
      } else {
        e.innerHTML += "<div class='ms-3 statustext'><h3 class='fs-5 mb-1 testingwithstyle'>"+_currentobject.SourceObject.DisplayTitle+"</h3></div>"
      }
      _gridbox.appendChild(e);
      e.addEventListener("click",function(){
        DisplayDetailedStats(_currentobject);
      })
      
    } else if(_displaytype == "List"){
      var e = document.createElement("div");
      if(errorDisplay) e.setAttribute("class","d-flex align-items-center rounded-2 p-2 Statusdiv2 StatusDivError")
      else e.setAttribute("class","d-flex align-items-center rounded-2 p-2 Statusdiv2")
      if(formattedDate != null){
        e.innerHTML = "<div class='Status' style='background-color: "+GetBackgroundColor(formattedDate.formattedDate)+";'></div>"
        e.innerHTML += "<h3 class='fs-5 mb-0 ms-3'>"+_currentobject.SourceObject.DisplayTitle+"</h3><h3 class='mb-0 ms-3 mt-1 fs-6 '>Last-Check: "+formattedDate.formattedDate+"</h3>"+"<h3 class='mb-0 ms-3 mt-1 fs-6 '>Original: "+formattedDate.originalDate+"</h3>"
      } else {
        e.innerHTML += "<h3 class='fs-5 mb-0 ms-3'>"+_currentobject.SourceObject.DisplayTitle+"</h3>"
      }
      
      _listbox.appendChild(e);
      e.addEventListener("click",function(){
        DisplayDetailedStats(_currentobject);
      })
    }
  }
  
  
 
}

function DisplayDetailedStats(_currentobject:ServerObject){
  var DisplaySection = document.getElementById("Displaysection")
  if(DisplaySection!=null){
    DisplaySection.innerHTML = "";


    var titleElement = document.createElement("h3");
    titleElement.innerHTML = _currentobject.SourceObject.DisplayTitle
    titleElement.setAttribute("class","StatusDisplayTitle");
    

    var buttondisplay = document.createElement("div")
    buttondisplay.setAttribute("id","buttonDisplay")


    var div = document.createElement("div");
    div.setAttribute("id","DisplayTableDiv");
    div.appendChild(titleElement);
    div.appendChild(buttondisplay);

    
    

    var div2 = document.createElement("div");
    div2.setAttribute("id","DisplayTableDiv2");
    var e = document.createElement("table");
    CreateDisplayTable(_currentobject,e,true);
    var xbutton = document.createElement("button");
    xbutton.innerHTML = "<i class='uil uil-multiply'></i>"
    xbutton.addEventListener("click", function(){
      DisplaySection!.innerHTML = "";
    })
    buttondisplay.appendChild(xbutton);

    var sortbutton = document.createElement("button");
    var index = 0;
    sortbutton.innerHTML = "Sort: Ascending"
    sortbutton.addEventListener("click", function(){
      e.innerHTML = ""
      if(sortbutton.innerHTML == "Sort: Ascending"){
        sortbutton.innerHTML = "Sort: Descending"
        CreateDisplayTable(_currentobject,e,false)
      } else {
        sortbutton.innerHTML = "Sort: Ascending"
        CreateDisplayTable(_currentobject,e,true)
      }
      
    })
    buttondisplay.appendChild(sortbutton);




    div2.appendChild(e);
    div.appendChild(div2);
    DisplaySection.appendChild(div);
  }
}

function CreateDisplayTable(_currentobject:ServerObject,e:HTMLElement,sortingdirection:boolean){
  if(typeof(_currentobject.Data) === "string"){
    e.innerText = ""+_currentobject.Data;

  } else {
    var trh = document.createElement("tr");
    for (let i = 0; i < _currentobject.SourceObject.Columns.length; i++) {
      trh.innerHTML+="<th>"+_currentobject.SourceObject.Columns[i]+"</th>"
    }
    e.appendChild(trh);
  
    if(sortingdirection){
      for (let i = 0; i < _currentobject.Data.length; i++) {
        var tr = document.createElement("tr");
        for (let j = 0; j < _currentobject.SourceObject.Columns.length; j++) {
          tr.innerHTML+= "<td>"+_currentobject.Data[i][_currentobject.SourceObject.Columns[j]]+"</td>"
        }
        e.appendChild(tr);
      }
    }  else  {
      for (let i = _currentobject.Data.length-1; i >= 0; i--) {
        var tr = document.createElement("tr");
        for (let j = 0; j < _currentobject.SourceObject.Columns.length; j++) {
          tr.innerHTML+= "<td>"+_currentobject.Data[i][_currentobject.SourceObject.Columns[j]]+"</td>"
        }
        e.appendChild(tr);
      }
    }
     

  }
  
 
  
}


var sortbyprop = function (prop:any, arr:any) {
  prop = prop.split('.');
  var len = prop.length;

  arr.sort(function (a:any, b:any) {
      var i = 0;
      while( i < len ) { a = a[prop[i]]; b = b[prop[i]]; i++; }
      if (a < b) {
          return -1;
      } else if (a > b) {
          return 1;
      } else {
          return 0;
      }
  });
  return arr;
};

function FormatDateTime(_dateTime: string, _dateFormat:string): { formattedDate: string; originalDate: any; } | null{
  console.log(_dateFormat)
  console.log(utcOffsets);
  if(!Number.isNaN(Date.parse(_dateTime))){
    let originalDate: Date =  new Date(Date.parse(_dateTime));
    let newdate = new Date(originalDate.getTime());
    for (let i = 0; i < utcOffsets.length; i++) {

      if(utcOffsets[i].label == _dateFormat){
        newdate = new Date(newdate.getTime() - utcOffsets[i].value*60*60*1000);
      }
    }
    var visualOffset = GetUTCOffset();
    newdate = new Date(newdate.getTime() + visualOffset*60*60*1000);
    let formattedDate: string = "";
    formattedDate = newdate.toISOString();
    formattedDate = formattedDate.replace("T"," ").replace("Z","");
    formattedDate = formattedDate.slice(0,formattedDate.length-4)


    let formattedOriginalDate: string = "";
    formattedOriginalDate = originalDate.toISOString();
    formattedOriginalDate = formattedOriginalDate.replace("T"," ").replace("Z","");
    formattedOriginalDate = formattedOriginalDate.slice(0,formattedOriginalDate.length-4)

    return {
      formattedDate: formattedDate,
      originalDate: formattedOriginalDate
    };
  } else {
    return null;
  }
}

function GetBackgroundColor(_dateTime: string): string {
  let newdate = new Date(Date.parse(_dateTime));
  let currentTime = Date.now();
  let timeToCalculate = currentTime - newdate.getTime();
  let miliseconds = MaxTimeSinceUpdateInMin*60*1000;

  // Generates a Hexcode based to Time (From 00FF00 to FF0000)[Green to Red]
  let hexcode = "#"
  if( timeToCalculate > miliseconds){
      hexcode += "FF0000"
  } else {
      
      if (timeToCalculate > miliseconds/2){
          //red
          let color = Math.floor(255-(((timeToCalculate-(miliseconds/2))/(miliseconds/2))*255))
          let hexpart = color.toString(16);
          if(hexpart.length == 1){
              hexpart = "0"+hexpart;
          }
          
          hexcode += "ff"+hexpart+"00";

      } else {
          //green
          let color = Math.floor((timeToCalculate/(miliseconds/2))*255)
          let hexpart = color.toString(16);
          if(hexpart.length == 1){
              hexpart = "0"+hexpart;
          }
          
          hexcode += hexpart+"ff00";
      }
  }
  return hexcode;
}  

document.getElementById("GridSizeSelect")?.addEventListener("change", function(){
  var selectElement = <HTMLSelectElement>document.getElementById("GridSizeSelect");
  if(selectElement!=null){
    console.log(selectElement.value)
    GenerateStatus();
  }
});
document.getElementById("OrderSelect")?.addEventListener("change", function(){
  var selectElement = <HTMLSelectElement>document.getElementById("OrderSelect");
  if(selectElement!=null){
    console.log(selectElement.value)
    GenerateStatus();
  }
});
document.getElementById("DisplaySelect")?.addEventListener("change", function(){
  var selectElement = <HTMLSelectElement>document.getElementById("DisplaySelect");
  if(selectElement!=null){
    console.log(selectElement.value)
    GenerateStatus();
  }
});

document.getElementById("InputTimeForUpdate")?.addEventListener("input", function(){
  var input = <HTMLInputElement>this
  if(input!=null){
    var parsed = parseInt(input.value);
    if(!Number.isNaN(parsed)){
      MaxTimeSinceUpdateInMin = parsed;
    } else {
      MaxTimeSinceUpdateInMin = 0;
    }
    
    console.log(MaxTimeSinceUpdateInMin)
    GenerateStatus();
  }
});





//#endregion

//#region Desing
function select(selector: any) {
  return document.querySelector(selector)
}

function find(el:Element, selector: any) {
  let finded
  return (finded = el.querySelector(selector)) ? finded : null
}

function siblings(el:Element) {
  const siblings = []
  for (let sibling of el.parentNode!.children) {
    if (sibling !== el) {
      siblings.push(sibling)
    }
  }
  return siblings
}

const showAsideBtn = select('.show-side-btn')
const showAsideBtn2 = select('.show-side-btn2');
const sidebar = select('.sidebar')
const wrapper = select('#wrapper')

showAsideBtn.addEventListener('click', function (this: HTMLElement) {
    select(`#${this.dataset.show}`).classList.toggle('show-sidebar')
  wrapper.classList.toggle('fullwidth')
})
showAsideBtn2.addEventListener('click', function (this: HTMLElement) {
  select(`#${this.dataset.show}`).classList.toggle('show-sidebar');
  wrapper.classList.toggle('fullwidth');
});

if (window.innerWidth < 767) {
  sidebar.classList.add('show-sidebar');
}

window.addEventListener('resize', function () {
  if (window.innerWidth > 767) {
    sidebar.classList.remove('show-sidebar')
  }
})

// dropdown menu in the side nav
var slideNavDropdown = select('.sidebar-dropdown');

select('.sidebar .categories').addEventListener('click', function (event:  any) {
  event.preventDefault()

  const item = event.target.closest('.has-dropdown')

  if (! item) {
    return
  }

  item.classList.toggle('opened')

  siblings(item).forEach(sibling => {
    sibling.classList.remove('opened')
  })

  if (item.classList.contains('opened')) {
    const toOpen = find(item, '.sidebar-dropdown')

    if (toOpen) {
      toOpen.classList.add('active')
    }

    siblings(item).forEach(sibling => {
      const toClose = find(sibling, '.sidebar-dropdown')

      if (toClose) {
        toClose.classList.remove('active')
      }
    })
  } else {
    find(item, '.sidebar-dropdown').classList.toggle('active')
  }
})

select('.sidebar .close-aside').addEventListener('click', function (this: HTMLElement) {
    select(`#${this.dataset.close}`).classList.add('show-sidebar')
  wrapper.classList.remove('margin')
})
//#endregion

//#region Server-Connectivity
async function POSTtoServer(_method: string, _parameters: any): Promise<string> {
  var objectBody  = {
    ...{method: _method},
    ..._parameters
  };

  var request = new Request(currentHost, {method: 'POST' ,body: JSON.stringify(objectBody)})
  let response: Response = await fetch(request);
  let message: string = await response.text();
  return message;

  
}

interface ServerObject{
  SourceObject: SourceObject;
  Data: any;
}

interface SourceObject{
  DisplayTitle: string;
  ServerName: string;
  DatabaseName: string;
  TableName: string;
  TableSchema: string;
  SelectCondition: string;
  Category: string;
  StatusColumn: string;
  Columns: string[];
  UTCTimeOffset: string;
}
//#endregion


//#region Time
function StartSetupUTCTime() {
  // Create a list with all timezones
  var timezones = [];
  for (var i = -12; i <= 14; i++) {
    timezones.push(i);
  }
  
  // Create a list with all utc offsets with a label
  utcOffsets = timezones.map(function (tz) {
    return {
      label: 'UTC ' + (tz > 0 ? '+' : '') + tz,
      value: tz
    };
  });
  
  
  // Add all utc offsets to the select box
  var UTCSelectBox = <HTMLSelectElement>document.getElementById("UTCSelect");
  UTCSelectBox.innerHTML = "";
  for (var i = 0; i < utcOffsets.length; i++) {
    var option = document.createElement("option");
    option.value = utcOffsets[i].value.toString();
    option.text = utcOffsets[i].label;
    if(utcOffsets[i].value == 0){
      option.selected = true;
    }
    UTCSelectBox.add(option);
  }
  
  UTCSelectBox.addEventListener("change", function(){
    var selectElement = <HTMLSelectElement>document.getElementById("UTCSelect");
    if(selectElement!=null){
      console.log(selectElement.value)
      GenerateStatus();
    }
  });
}

function GetUTCOffset(){
  var selectElement = <HTMLSelectElement>document.getElementById("UTCSelect");
  if(selectElement!=null){
    return parseInt(selectElement.value);
  }
  return 0;
}


function ResetUTCLabel(){
  var DataSourceUTCSelectBox = <HTMLSelectElement>document.getElementById("DataSourceUTCTime");
  DataSourceUTCSelectBox.innerHTML = "";
  for (var i = 0; i < utcOffsets.length; i++) { 
    var option = document.createElement("option");
    option.value = utcOffsets[i].label;
    option.text = utcOffsets[i].label;
    DataSourceUTCSelectBox.add(option);
  }
}
//#endregion

