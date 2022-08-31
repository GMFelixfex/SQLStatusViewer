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
var ip = "http://localhost:8100/";
var currentPage = window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1);
UpdateTables();
setInterval(UpdateTables, 60000);
function UpdateTables() {
    var TablePromise = getData();
    var Tables = "";
    TablePromise.then(function (TablePromiseResult) {
        Tables = TablePromiseResult;
        var tableDiv = document.getElementById("TableDiv");
        tableDiv.innerHTML = Tables;
        searchFunction();
    });
}
function getData() {
    return __awaiter(this, void 0, void 0, function* () {
        let url = ip + currentPage;
        url = url + "?" + "getData=1";
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
