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
UpdateStatus();
setInterval(UpdateStatus, 60000);
function UpdateStatus() {
    let TablePromise = getStatusData();
    let ReturnElements;
    TablePromise.then(function (TablePromiseResult) {
        console.log(TablePromiseResult);
        ReturnElements = new DOMParser().parseFromString(TablePromiseResult, "text/html");
        console.log(ReturnElements);
        var flexDivs = ReturnElements.getElementsByTagName("div");
        var Databasenames = ReturnElements.getElementsByTagName("p");
        var statusFlexbox = document.getElementById("StatusFlexbox");
        statusFlexbox.innerHTML = "";
        for (let i = 0; i < flexDivs.length; i++) {
            statusFlexbox.innerHTML += flexDivs[i].outerHTML;
        }
        for (let i = 0; i < statusFlexbox.children.length; i++) {
            statusFlexbox.children[i].addEventListener("click", function () {
                openTablePage(Databasenames[i].innerHTML);
            });
        }
    });
}
function openTablePage(databasename) {
    console.log("open");
    localStorage.setItem("LastUsedDatabase", databasename);
    let curLoc = window.location.pathname.replace("/index.html", "");
    location.href = curLoc + "/" + "process.html";
}
function getStatusData() {
    return __awaiter(this, void 0, void 0, function* () {
        let url = currentHost + currentPage;
        url = url + "?" + "getStatusData=1";
        let response = yield fetch(url);
        let message = yield response.text();
        return message;
    });
}
