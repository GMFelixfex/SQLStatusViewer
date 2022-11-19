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
var port = 8100;
//var currentHost: string = "http://"+window.location.hostname+":"+port+"/";
var currentHost = "http://localhost:" + port + "/";
var currentPage = window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1);
//var UsedDatabase = localStorage.getItem("LastUsedDatabase");
var UsedDatabase = "test";
UpdateTables();
setInterval(UpdateTables, 60000);
var titleElement = document.getElementById("Title");
titleElement.innerHTML = "Waiting for Title...";
function UpdateTables() {
    let TablePromise = getTableData();
    let Tables;
    TablePromise.then(function (TablePromiseResult) {
        console.log(TablePromiseResult);
        Tables = new DOMParser().parseFromString(TablePromiseResult, "text/html");
        console.log(Tables);
        var newTitle = Tables.body.children[0].innerHTML;
        var titleElement = document.getElementById("Title");
        titleElement.innerHTML = newTitle;
        var pureTables = Tables.getElementsByTagName("table");
        var pureHeaders = Tables.getElementsByTagName("h2");
        /*
        console.log(pureTables[1])
        console.log(pureHeaders[1])
        */
        var tableDiv = document.getElementById("TableDiv");
        tableDiv.innerHTML = "";
        for (let i = 0; i < pureHeaders.length; i++) {
            tableDiv.innerHTML += pureHeaders[i].outerHTML;
            tableDiv.innerHTML += pureTables[i].outerHTML;
        }
        searchFunction();
    });
}
function getTableData() {
    return __awaiter(this, void 0, void 0, function* () {
        let url = currentHost + currentPage;
        url = url + "?" + "useddb=" + UsedDatabase;
        let response = yield fetch(url);
        let message = yield response.text();
        return message;
    });
}
function searchFunction() {
    var input, filter, tables, tr, td, txtValue;
    var input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    var tables = document.getElementsByTagName("table");
    if (input && tables)
        for (let j = 0; j < tables.length; j++) {
            tr = tables[j].getElementsByTagName("tr");
            for (let i = 0; i < tr.length; i++) {
                td = tr[i].getElementsByTagName("td");
                if (td.length > 0) {
                    var showRow = false;
                    for (let k = 0; k < td.length; k++) {
                        if (td) {
                            txtValue = td[k].textContent || td[k].innerText;
                            if ((txtValue.toUpperCase().indexOf(filter) > -1)) {
                                showRow = true;
                            }
                        }
                    }
                    if (showRow) {
                        tr[i].style.display = "";
                    }
                    else {
                        tr[i].style.display = "none";
                    }
                }
            }
        }
}
