"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b, _c, _d, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
var currentHost = "http://" + window.location.hostname + ":" + 8100 + "/";
var MaxTimeSinceUpdateInMin = 15;
document.getElementById("InputTimeForUpdate").value = "15";
GetServers();
GetCategories();
GetStatus();
var CurrentServerObjects = [];
//#region Setup
var currentSearchTerm = "";
(_a = document.getElementById("SearchInput")) === null || _a === void 0 ? void 0 : _a.addEventListener("input", function () {
    var searchinput = this;
    currentSearchTerm = searchinput.value;
    console.log(currentSearchTerm);
    GenerateStatus();
});
(_b = document.getElementById("addSource")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () {
    var promtbox = document.getElementById("promtbox");
    if (promtbox != null)
        promtbox.hidden = !promtbox.hidden;
});
(_c = document.getElementById("CancelDataSource")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", function () {
    var promtbox = document.getElementById("promtbox");
    if (promtbox != null)
        promtbox.hidden = true;
    ResetInput();
});
(_d = document.getElementById("AddDataSource")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", function () {
    var promtbox = document.getElementById("promtbox");
    AddSource();
    ResetInput();
    if (promtbox != null)
        promtbox.hidden = true;
});
(_f = document.getElementById("DataSourceServers")) === null || _f === void 0 ? void 0 : _f.addEventListener("change", function () {
    var selectElement = document.getElementById("DataSourceServers");
    if (selectElement != null) {
        console.log(selectElement.value);
        if (selectElement.value != "") {
            GetDatabases();
        }
    }
});
(_g = document.getElementById("DataSourceServers")) === null || _g === void 0 ? void 0 : _g.addEventListener("click", function () {
    var selectElement = document.getElementById("DataSourceServers");
    var options = selectElement === null || selectElement === void 0 ? void 0 : selectElement.querySelectorAll("option");
    var count = options === null || options === void 0 ? void 0 : options.length;
    if (typeof (count) === "undefined" || count < 2) {
        console.log(selectElement.value);
        GetDatabases();
    }
});
(_h = document.getElementById("DataSourceDB")) === null || _h === void 0 ? void 0 : _h.addEventListener("change", function () {
    var selectElement = document.getElementById("DataSourceDB");
    if (selectElement != null) {
        console.log(selectElement.value);
        GetTables();
        GetTableSchemas();
        GetSelectionConditions();
    }
});
(_j = document.getElementById("DataSourceDB")) === null || _j === void 0 ? void 0 : _j.addEventListener("click", function () {
    var selectElement = document.getElementById("DataSourceDB");
    var options = selectElement === null || selectElement === void 0 ? void 0 : selectElement.querySelectorAll("option");
    var count = options === null || options === void 0 ? void 0 : options.length;
    if (typeof (count) === "undefined" || count < 2) {
        console.log(selectElement.value);
        GetTables();
        GetTableSchemas();
        GetSelectionConditions();
    }
});
(_k = document.getElementById("DataSourceTables")) === null || _k === void 0 ? void 0 : _k.addEventListener("change", function () {
    var selectElement = document.getElementById("DataSourceTables");
    if (selectElement != null) {
        console.log(selectElement.value);
        GetTableCollumns();
    }
});
(_l = document.getElementById("DataSourceTables")) === null || _l === void 0 ? void 0 : _l.addEventListener("click", function () {
    var selectElement = document.getElementById("DataSourceTables");
    var options = selectElement === null || selectElement === void 0 ? void 0 : selectElement.querySelectorAll("option");
    var count = options === null || options === void 0 ? void 0 : options.length;
    if (typeof (count) === "undefined" || count < 2) {
        console.log(selectElement.value);
        GetTableCollumns();
    }
});
(_m = document.getElementById("DataSourceCategories")) === null || _m === void 0 ? void 0 : _m.addEventListener("change", function () {
    var selectElement = document.getElementById("DataSourceCategories");
    if (selectElement != null) {
        console.log(selectElement.value);
    }
});
(_o = document.getElementById("DataSourceCategories")) === null || _o === void 0 ? void 0 : _o.addEventListener("click", function () {
    var selectElement = document.getElementById("DataSourceCategories");
    var options = selectElement === null || selectElement === void 0 ? void 0 : selectElement.querySelectorAll("option");
    var count = options === null || options === void 0 ? void 0 : options.length;
    if (typeof (count) === "undefined" || count < 2) {
        console.log(selectElement.value);
    }
});
(_p = document.getElementById("DataSourceStatusColumn")) === null || _p === void 0 ? void 0 : _p.addEventListener("change", function () {
    var selectElement = document.getElementById("DataSourceStatusColumn");
    if (selectElement != null) {
        console.log(selectElement.value);
    }
});
(_q = document.getElementById("DataSourceStatusColumn")) === null || _q === void 0 ? void 0 : _q.addEventListener("click", function () {
    var selectElement = document.getElementById("DataSourceStatusColumn");
    var options = selectElement === null || selectElement === void 0 ? void 0 : selectElement.querySelectorAll("option");
    var count = options === null || options === void 0 ? void 0 : options.length;
    if (typeof (count) === "undefined" || count < 2) {
        console.log(selectElement.value);
    }
});
(_r = document.getElementById("DataSourceSchemas")) === null || _r === void 0 ? void 0 : _r.addEventListener("change", function () {
    var selectElement = document.getElementById("DataSourceSchemas");
    if (selectElement != null) {
        console.log(selectElement.value);
    }
});
(_s = document.getElementById("DataSourceSchemas")) === null || _s === void 0 ? void 0 : _s.addEventListener("click", function () {
    var selectElement = document.getElementById("DataSourceSchemas");
    var options = selectElement === null || selectElement === void 0 ? void 0 : selectElement.querySelectorAll("option");
    var count = options === null || options === void 0 ? void 0 : options.length;
    if (typeof (count) === "undefined" || count < 2) {
        console.log(selectElement.value);
    }
});
(_t = document.getElementById("DataSourceSelectionCondition")) === null || _t === void 0 ? void 0 : _t.addEventListener("change", function () {
    var selectElement = document.getElementById("DataSourceSelectionCondition");
    if (selectElement != null) {
        console.log(selectElement.value);
    }
});
(_u = document.getElementById("DataSourceSelectionCondition")) === null || _u === void 0 ? void 0 : _u.addEventListener("click", function () {
    var selectElement = document.getElementById("DataSourceSelectionCondition");
    var options = selectElement === null || selectElement === void 0 ? void 0 : selectElement.querySelectorAll("option");
    var count = options === null || options === void 0 ? void 0 : options.length;
    if (typeof (count) === "undefined" || count < 2) {
        console.log(selectElement.value);
    }
});
//#endregion
//#region Get-Funktions
function GetServers() {
    var ServerSelectElement = document.getElementById("DataSourceServers");
    ServerSelectElement.disabled = false;
    var ServersString = POSTtoServer("GetServers", {});
    ServersString.then((value) => {
        AddToOptions(ServerSelectElement, value);
    });
}
function GetCategories() {
    var CategoriesSelectElement = document.getElementById("DataSourceCategories");
    CategoriesSelectElement.disabled = false;
    var ServersString = POSTtoServer("GetCategories", {});
    ServersString.then((value) => {
        AddToOptions(CategoriesSelectElement, value);
    });
}
function GetDatabases() {
    var ServerSelectElement = document.getElementById("DataSourceServers");
    var DatabaseSelectElement = document.getElementById("DataSourceDB");
    DatabaseSelectElement.disabled = false;
    var ServersString = POSTtoServer("GetDatabases", { serverid: ServerSelectElement.value });
    ServersString.then((value) => {
        AddToOptions(DatabaseSelectElement, value);
    });
}
function GetTables() {
    var ServerSelectElement = document.getElementById("DataSourceServers");
    var DatabaseSelectElement = document.getElementById("DataSourceDB");
    var TableSelectElement = document.getElementById("DataSourceTables");
    TableSelectElement.disabled = false;
    var ServersString = POSTtoServer("GetTables", { serverid: ServerSelectElement.value, databaseid: DatabaseSelectElement.value });
    ServersString.then((value) => {
        AddToOptions(TableSelectElement, value);
    });
}
function GetTableSchemas() {
    var ServerSelectElement = document.getElementById("DataSourceServers");
    var DatabaseSelectElement = document.getElementById("DataSourceDB");
    var TableSchemaSelectElement = document.getElementById("DataSourceSchemas");
    TableSchemaSelectElement.disabled = false;
    var ServersString = POSTtoServer("GetSchemas", { serverid: ServerSelectElement.value, databaseid: DatabaseSelectElement.value });
    ServersString.then((value) => {
        AddToOptions(TableSchemaSelectElement, value);
    });
}
function GetSelectionConditions() {
    var ConditionSelectElement = document.getElementById("DataSourceSelectionCondition");
    var ServersString = POSTtoServer("GetSelectionConditions", {});
    ConditionSelectElement.disabled = false;
    ServersString.then((value) => {
        AddToOptions(ConditionSelectElement, value);
    });
}
function GetTableCollumns() {
    var ServerSelectElement = document.getElementById("DataSourceServers");
    var DatabaseSelectElement = document.getElementById("DataSourceDB");
    var TableSchemaSelectElement = document.getElementById("DataSourceSchemas");
    var TableSelectElement = document.getElementById("DataSourceTables");
    var StatusColumnSelectElement = document.getElementById("DataSourceStatusColumn");
    StatusColumnSelectElement.disabled = false;
    var ServersString = POSTtoServer("GetDatabaseCollumns", { serverid: ServerSelectElement.value, databaseid: DatabaseSelectElement.value, tableid: TableSelectElement.value, tableschemaid: TableSchemaSelectElement.value });
    ServersString.then((value) => {
        AddToOptions(StatusColumnSelectElement, value);
        var columnFlexDiv = document.getElementById("collumnFlex");
        var ColumnssArray = JSON.parse(value);
        columnFlexDiv.innerHTML = "";
        for (let index = 0; index < ColumnssArray.length; index++) {
            var e = document.createElement("button");
            e.innerText = ColumnssArray[index];
            e.setAttribute("class", "columnButton");
            e.setAttribute("id", "cbut" + index);
            e.setAttribute("value", index.toString());
            columnFlexDiv === null || columnFlexDiv === void 0 ? void 0 : columnFlexDiv.appendChild(e);
            e.addEventListener("click", function (event) {
                var targetElement = event.target;
                if (targetElement != null)
                    CheckButton(targetElement);
            });
        }
    });
}
function GetStatus() {
    var ServersString = POSTtoServer("GetStatus", {});
    ServersString.then((value) => {
        CurrentServerObjects = JSON.parse(value);
        GenerateSidepanel();
        GenerateStatus();
    });
}
//#endregion
//#region Get-Utility-Funktions
function CheckButton(_e) {
    var eclasses = _e.getAttribute("class");
    if (eclasses === null || eclasses === void 0 ? void 0 : eclasses.includes("cbutChecked")) {
        _e.setAttribute("class", "columnButton");
    }
    else {
        _e.setAttribute("class", "columnButton cbutChecked");
    }
}
function AddToOptions(_selectElement, _OptionsString) {
    var OptionsArray = JSON.parse(_OptionsString);
    _selectElement.innerHTML = "";
    for (let index = 0; index < OptionsArray.length; index++) {
        var e = document.createElement("option");
        e.text = OptionsArray[index];
        e.value = index.toString();
        _selectElement.appendChild(e);
    }
}
function AddSource() {
    var ServerSelectElement = document.getElementById("DataSourceServers");
    var DatabaseSelectElement = document.getElementById("DataSourceDB");
    var TableSchemaSelectElement = document.getElementById("DataSourceSchemas");
    var StatusColumnSelectElement = document.getElementById("DataSourceStatusColumn");
    var TableSelectElement = document.getElementById("DataSourceTables");
    var SelectionConditionSelectElement = document.getElementById("DataSourceSelectionCondition");
    var CategoriesSelectElement = document.getElementById("DataSourceCategories");
    var TitleInputElement = document.getElementById("DatasourceDisplayTitle");
    var CheckedColumns = document.getElementsByClassName("cbutChecked");
    var CheckedCollumnsArray = [];
    for (let index = 0; index < CheckedColumns.length; index++) {
        CheckedCollumnsArray[index] = parseInt(CheckedColumns[index].value);
    }
    POSTtoServer("AddSource", {
        serverid: ServerSelectElement.value,
        databaseid: DatabaseSelectElement.value,
        tableid: TableSelectElement.value,
        statuscollumnid: StatusColumnSelectElement.value,
        tableschemaid: TableSchemaSelectElement.value,
        visibleCollumnNumbers: CheckedCollumnsArray,
        selectConditionid: SelectionConditionSelectElement.value,
        categoryid: CategoriesSelectElement.value,
        DisplayTitle: TitleInputElement.value
    });
}
function ResetInput() {
    var ServerSelectElement = document.getElementById("DataSourceServers");
    var DatabaseSelectElement = document.getElementById("DataSourceDB");
    var TableSchemaSelectElement = document.getElementById("DataSourceSchemas");
    var TableSelectElement = document.getElementById("DataSourceTables");
    var SelectionConditionSelectElement = document.getElementById("DataSourceSelectionCondition");
    var CategoriesSelectElement = document.getElementById("DataSourceCategories");
    var columnFlexDiv = document.getElementById("collumnFlex");
    var TitleInputElement = document.getElementById("DataSourceTables");
    var StatusColumnSelectElement = document.getElementById("DataSourceStatusColumn");
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
    StatusColumnSelectElement.disabled = true;
    GetServers();
    GetCategories();
    GetStatus();
}
//#endregion
//#region Status-Generation
function GenerateSidepanel() {
    var SideSQLSources = document.getElementById("SideSQLSources");
    SideSQLSources.innerHTML = "";
    for (let index = 0; index < CurrentServerObjects.length; index++) {
        var e = document.createElement("li");
        e.innerHTML = "<a href='#'><i class='uil-database fa-fw'></i>" + CurrentServerObjects[index].SourceObject.DisplayTitle + "</a>";
        SideSQLSources.appendChild(e);
    }
}
function GenerateStatus() {
    //var gridbox = document.getElementById("gridbox");
    //var listbox = document.getElementById("listbox");
    var gridsizeselect = document.getElementById("GridSizeSelect");
    var orderbyselect = document.getElementById("OrderSelect");
    var displayselect = document.getElementById("DisplaySelect");
    var DisplaySection = document.getElementById("Displaysection");
    var gridsection = document.getElementById("gridsection");
    var listsection = document.getElementById("listsection");
    DisplaySection.innerHTML = "";
    var _method = orderbyselect.value;
    var gridsize = parseInt(gridsizeselect.value);
    var displaytype = displayselect.value;
    if (gridsection != null && listsection != null) {
        gridsection.innerHTML = "";
        listsection.innerHTML = "";
        var gridbox = document.createElement("div");
        var listbox = document.createElement("div");
        gridbox.setAttribute("class", "row");
        listbox.setAttribute("class", "row");
        gridsection.appendChild(gridbox);
        listsection.appendChild(listbox);
        /*
        var gridsizecss = "grid-template-columns:"
        for (let i = 0; i < gridsize; i++) {
          gridsizecss += " auto"
        }*/
        var gridsizecss = "grid-template-columns: repeat(" + gridsize + ", minmax(0, 1fr));";
        gridbox.setAttribute("style", gridsizecss);
        if (_method == "Standart") {
            for (let i = 0; i < CurrentServerObjects.length; i++) {
                DisplayAs(CurrentServerObjects[i], displaytype, _method, gridbox, listbox);
            }
        }
        else if (_method == "Alphabetical") {
            var SortedStatus = Array.from(CurrentServerObjects);
            SortedStatus = sortbyprop("SourceObject.DisplayTitle", SortedStatus);
            for (let i = 0; i < SortedStatus.length; i++) {
                DisplayAs(SortedStatus[i], displaytype, _method, gridbox, listbox);
            }
        }
        else if (_method == "Category") {
            var SortedStatus = Array.from(CurrentServerObjects);
            SortedStatus = sortbyprop("SourceObject.Category", SortedStatus);
            var currentCategory = "";
            var Categories = [];
            for (let i = 0; i < SortedStatus.length; i++) {
                if (currentCategory != SortedStatus[i].SourceObject.Category) {
                    currentCategory = SortedStatus[i].SourceObject.Category;
                    var newgridbox = document.createElement("div");
                    var newlistbox = document.createElement("div");
                    newlistbox.setAttribute("class", "row mb-2");
                    newgridbox.setAttribute("class", "row mb-2");
                    newgridbox.setAttribute("style", gridsizecss);
                    if (displaytype == "Grid") {
                        var gridheader = document.createElement("h3");
                        gridheader.innerHTML = currentCategory;
                        gridheader.setAttribute("class", "CategoryHeader");
                        gridsection.appendChild(gridheader);
                    }
                    else if (displaytype == "List") {
                        var listheader = document.createElement("h3");
                        listheader.innerHTML = currentCategory;
                        listsection.appendChild(listheader);
                    }
                    gridsection.appendChild(newgridbox);
                    listsection.appendChild(newlistbox);
                    Categories.push({ category: currentCategory, listbox: newlistbox, gridbox: newgridbox });
                }
            }
            for (let i = 0; i < Categories.length; i++) {
                for (let j = 0; j < SortedStatus.length; j++) {
                    if (SortedStatus[j].SourceObject.Category == Categories[i].category) {
                        DisplayAs(SortedStatus[j], displaytype, _method, Categories[i].gridbox, Categories[i].listbox);
                    }
                }
            }
        }
        else if (_method == "Urgency") {
            var forSorting = [];
            for (let i = 0; i < CurrentServerObjects.length; i++) {
                var datetouse = CurrentServerObjects[i].Data[CurrentServerObjects[i].Data.length - 1][CurrentServerObjects[i].SourceObject.StatusColumn];
                forSorting.push({ index: i, date: datetouse });
            }
            var forSort = Array.from(forSorting);
            forSort = sortbyprop("date", forSort);
            for (let i = 0; i < forSort.length; i++) {
                DisplayAs(CurrentServerObjects[forSort[i].index], displaytype, _method, gridbox, listbox);
            }
        }
    }
}
function DisplayAs(_currentobject, _displaytype, _method, _gridbox, _listbox) {
    if (_currentobject.SourceObject.DisplayTitle.toLowerCase().includes(currentSearchTerm) || currentSearchTerm == "") {
        var lastdate = "";
        lastdate = _currentobject.Data[_currentobject.Data.length - 1][_currentobject.SourceObject.StatusColumn];
        var formattedDate = FormatDateTime(lastdate);
        if (_displaytype == "Grid") {
            var e = document.createElement("div");
            e.setAttribute("class", "d-flex align-items-center rounded-2 p-3 Statusdiv");
            if (formattedDate != null) {
                e.innerHTML = "<div class='Status' style='background-color: " + GetBackgroundColor(formattedDate) + ";'></div>";
                e.innerHTML += "<div class='ms-3 statustext'><h3 class='fs-5 mb-1 testingwithstyle'>" + _currentobject.SourceObject.DisplayTitle + "</h3><p class='mb-0 Statuspara'>Statuschecked: " + formattedDate + "</p></div>";
            }
            else {
                e.innerHTML += "<div class='ms-3 statustext'><h3 class='fs-5 mb-1 testingwithstyle'>" + _currentobject.SourceObject.DisplayTitle + "</h3></div>";
            }
            _gridbox.appendChild(e);
            e.addEventListener("click", function () {
                DisplayDetailedStats(_currentobject);
            });
        }
        else if (_displaytype == "List") {
            var e = document.createElement("div");
            e.setAttribute("class", "d-flex align-items-center rounded-2 p-2 Statusdiv2");
            if (formattedDate != null) {
                e.innerHTML = "<div class='Status' style='background-color: " + GetBackgroundColor(formattedDate) + ";'></div>";
                e.innerHTML += "<h3 class='fs-5 mb-0 ms-3'>" + _currentobject.SourceObject.DisplayTitle + "</h3><h3 class='mb-0 ms-3 mt-1 fs-6 '>Statuschecked: " + formattedDate + "</h3>";
            }
            else {
                e.innerHTML += "<h3 class='fs-5 mb-0 ms-3'>" + _currentobject.SourceObject.DisplayTitle + "</h3>";
            }
            _listbox.appendChild(e);
            e.addEventListener("click", function () {
                DisplayDetailedStats(_currentobject);
            });
        }
    }
}
function DisplayDetailedStats(_currentobject) {
    var DisplaySection = document.getElementById("Displaysection");
    if (DisplaySection != null) {
        DisplaySection.innerHTML = "";
        var titleElement = document.createElement("h3");
        titleElement.innerHTML = _currentobject.SourceObject.DisplayTitle;
        titleElement.setAttribute("class", "StatusDisplayTitle");
        var buttondisplay = document.createElement("div");
        buttondisplay.setAttribute("id", "buttonDisplay");
        var div = document.createElement("div");
        div.setAttribute("id", "DisplayTableDiv");
        div.appendChild(titleElement);
        div.appendChild(buttondisplay);
        var e = document.createElement("table");
        CreateDisplayTable(_currentobject, e, true);
        var xbutton = document.createElement("button");
        xbutton.innerHTML = "<i class='uil uil-multiply'></i>";
        xbutton.addEventListener("click", function () {
            DisplaySection.innerHTML = "";
        });
        buttondisplay.appendChild(xbutton);
        var sortbutton = document.createElement("button");
        var index = 0;
        sortbutton.innerHTML = "Sort: Ascending";
        sortbutton.addEventListener("click", function () {
            e.innerHTML = "";
            if (sortbutton.innerHTML == "Sort: Ascending") {
                sortbutton.innerHTML = "Sort: Descending";
                CreateDisplayTable(_currentobject, e, false);
            }
            else {
                sortbutton.innerHTML = "Sort: Ascending";
                CreateDisplayTable(_currentobject, e, true);
            }
        });
        buttondisplay.appendChild(sortbutton);
        div.appendChild(e);
        DisplaySection.appendChild(div);
    }
}
function CreateDisplayTable(_currentobject, e, sortingdirection) {
    var trh = document.createElement("tr");
    for (let i = 0; i < _currentobject.SourceObject.Columns.length; i++) {
        trh.innerHTML += "<th>" + _currentobject.SourceObject.Columns[i] + "</th>";
    }
    e.appendChild(trh);
    if (sortingdirection) {
        for (let i = 0; i < _currentobject.Data.length; i++) {
            var tr = document.createElement("tr");
            for (let j = 0; j < _currentobject.SourceObject.Columns.length; j++) {
                tr.innerHTML += "<td>" + _currentobject.Data[i][_currentobject.SourceObject.Columns[j]] + "</td>";
            }
            e.appendChild(tr);
        }
    }
    else {
        for (let i = _currentobject.Data.length - 1; i >= 0; i--) {
            var tr = document.createElement("tr");
            for (let j = 0; j < _currentobject.SourceObject.Columns.length; j++) {
                tr.innerHTML += "<td>" + _currentobject.Data[i][_currentobject.SourceObject.Columns[j]] + "</td>";
            }
            e.appendChild(tr);
        }
    }
}
var sortbyprop = function (prop, arr) {
    prop = prop.split('.');
    var len = prop.length;
    arr.sort(function (a, b) {
        var i = 0;
        while (i < len) {
            a = a[prop[i]];
            b = b[prop[i]];
            i++;
        }
        if (a < b) {
            return -1;
        }
        else if (a > b) {
            return 1;
        }
        else {
            return 0;
        }
    });
    return arr;
};
function FormatDateTime(_dateTime) {
    if (!Number.isNaN(Date.parse(_dateTime))) {
        let newdate = new Date(Date.parse(_dateTime));
        let formattedDate = "";
        formattedDate = newdate.toISOString();
        formattedDate = formattedDate.replace("T", " ").replace("Z", "");
        return formattedDate;
    }
    else {
        return null;
    }
}
function GetBackgroundColor(_dateTime) {
    let newdate = new Date(Date.parse(_dateTime));
    let currentTime = Date.now();
    let timeToCalculate = currentTime - newdate.getTime();
    let miliseconds = MaxTimeSinceUpdateInMin * 60 * 1000;
    // Generates a Hexcode based to Time (From 00FF00 to FF0000)[Green to Red]
    let hexcode = "#";
    if (timeToCalculate > miliseconds) {
        hexcode += "FF0000";
    }
    else {
        if (timeToCalculate > miliseconds / 2) {
            //red
            let color = Math.floor(255 - (((timeToCalculate - (miliseconds / 2)) / (miliseconds / 2)) * 255));
            let hexpart = color.toString(16);
            if (hexpart.length == 1) {
                hexpart = "0" + hexpart;
            }
            hexcode += "ff" + hexpart + "00";
        }
        else {
            //green
            let color = Math.floor((timeToCalculate / (miliseconds / 2)) * 255);
            let hexpart = color.toString(16);
            if (hexpart.length == 1) {
                hexpart = "0" + hexpart;
            }
            hexcode += hexpart + "ff00";
        }
    }
    return hexcode;
}
(_v = document.getElementById("GridSizeSelect")) === null || _v === void 0 ? void 0 : _v.addEventListener("change", function () {
    var selectElement = document.getElementById("GridSizeSelect");
    if (selectElement != null) {
        console.log(selectElement.value);
        GenerateStatus();
    }
});
(_w = document.getElementById("OrderSelect")) === null || _w === void 0 ? void 0 : _w.addEventListener("change", function () {
    var selectElement = document.getElementById("OrderSelect");
    if (selectElement != null) {
        console.log(selectElement.value);
        GenerateStatus();
    }
});
(_x = document.getElementById("DisplaySelect")) === null || _x === void 0 ? void 0 : _x.addEventListener("change", function () {
    var selectElement = document.getElementById("DisplaySelect");
    if (selectElement != null) {
        console.log(selectElement.value);
        GenerateStatus();
    }
});
(_y = document.getElementById("InputTimeForUpdate")) === null || _y === void 0 ? void 0 : _y.addEventListener("input", function () {
    var input = this;
    if (input != null) {
        var parsed = parseInt(input.value);
        if (!Number.isNaN(parsed)) {
            MaxTimeSinceUpdateInMin = parsed;
        }
        else {
            MaxTimeSinceUpdateInMin = 0;
        }
        console.log(MaxTimeSinceUpdateInMin);
        GenerateStatus();
    }
});
//#endregion
//#region Desing
function select(selector) {
    return document.querySelector(selector);
}
function find(el, selector) {
    let finded;
    return (finded = el.querySelector(selector)) ? finded : null;
}
function siblings(el) {
    const siblings = [];
    for (let sibling of el.parentNode.children) {
        if (sibling !== el) {
            siblings.push(sibling);
        }
    }
    return siblings;
}
const showAsideBtn = select('.show-side-btn');
const showAsideBtn2 = select('.show-side-btn2');
const sidebar = select('.sidebar');
const wrapper = select('#wrapper');
showAsideBtn.addEventListener('click', function () {
    select(`#${this.dataset.show}`).classList.toggle('show-sidebar');
    wrapper.classList.toggle('fullwidth');
});
showAsideBtn2.addEventListener('click', function () {
    select(`#${this.dataset.show}`).classList.toggle('show-sidebar');
    wrapper.classList.toggle('fullwidth');
});
if (window.innerWidth < 767) {
    sidebar.classList.add('show-sidebar');
}
window.addEventListener('resize', function () {
    if (window.innerWidth > 767) {
        sidebar.classList.remove('show-sidebar');
    }
});
// dropdown menu in the side nav
var slideNavDropdown = select('.sidebar-dropdown');
select('.sidebar .categories').addEventListener('click', function (event) {
    event.preventDefault();
    const item = event.target.closest('.has-dropdown');
    if (!item) {
        return;
    }
    item.classList.toggle('opened');
    siblings(item).forEach(sibling => {
        sibling.classList.remove('opened');
    });
    if (item.classList.contains('opened')) {
        const toOpen = find(item, '.sidebar-dropdown');
        if (toOpen) {
            toOpen.classList.add('active');
        }
        siblings(item).forEach(sibling => {
            const toClose = find(sibling, '.sidebar-dropdown');
            if (toClose) {
                toClose.classList.remove('active');
            }
        });
    }
    else {
        find(item, '.sidebar-dropdown').classList.toggle('active');
    }
});
select('.sidebar .close-aside').addEventListener('click', function () {
    select(`#${this.dataset.close}`).classList.add('show-sidebar');
    wrapper.classList.remove('margin');
});
//#endregion
//#region Server-Connectivity
function POSTtoServer(_method, _parameters) {
    return __awaiter(this, void 0, void 0, function* () {
        var objectBody = Object.assign({ method: _method }, _parameters);
        var request = new Request(currentHost, { method: 'POST', body: JSON.stringify(objectBody) });
        let response = yield fetch(request);
        let message = yield response.text();
        return message;
    });
}
//#endregion
