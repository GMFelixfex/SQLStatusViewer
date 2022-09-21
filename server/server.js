"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Http = __importStar(require("http"));
const DatabaseConnector = __importStar(require("./DatabaseConnector"));
const DatabaseTables_json_1 = __importDefault(require("../Config/DatabaseTables.json"));
const DatabaseServer_json_1 = __importDefault(require("../Config/DatabaseServer.json"));
const HtmlPresetViews_json_1 = __importDefault(require("../Config/HtmlPresetViews.json"));
const ServerConfig_json_1 = __importDefault(require("../ServerConfig.json"));
// Sets Port if it was not already set
let port = ServerConfig_json_1.default.Port;
if (!port || port == 0) {
    port = 8100;
}
// creates an Array for All connections to SQL-Servers
var SQLServers = [];
var SQLServerNames = [];
for (let i = 0; i < DatabaseServer_json_1.default.length; i++) {
    SQLServers.push(new DatabaseConnector.ServerConnection(DatabaseServer_json_1.default[i].IPAddress, DatabaseServer_json_1.default[i].SQLServerName, DatabaseServer_json_1.default[i].Port, DatabaseServer_json_1.default[i].Username, DatabaseServer_json_1.default[i].Password));
    SQLServerNames.push(DatabaseServer_json_1.default[i].SQLServerName);
}
var unformattedData = [];
var SortedTableInfo = [];
// Starts Node.js Server with a Listen and Request handler
startServer(port);
function startServer(_port) {
    console.log("Starting server" + _port);
    let server = Http.createServer();
    server.addListener("request", handleRequest);
    server.addListener("listening", handleListen);
    // Retrieves the SQL-Data
    GetAllData();
    setInterval(function () {
        GetAllData();
    }, ServerConfig_json_1.default.DataFetchTimeInMin * 60 * 1000);
    server.listen(_port);
}
// Consoleoutput to tel when the Server has startet
function handleListen() {
    console.log("Listening");
}
// Request handling 
function handleRequest(_request, _response) {
    _response.setHeader("content-type", "text/html; charset=utf-8");
    _response.setHeader("Access-Control-Allow-Origin", "*");
    let requestURL = new URL(_request.url, `http://${_request.headers.host}`);
    console.log("I hear voices from: " + requestURL);
    var pathname = requestURL.pathname;
    var sendString = "";
    // Returns the Formatted Data
    if (pathname == "/index.html") {
        sendString = GetFromattedData();
    }
    _response.write(sendString);
    _response.end();
}
// Function the get All data form the Databse-Tables
function GetAllData() {
    let preUnsortedTableInfo = [];
    let promiseArrays = [];
    //Loops through all presets (All Resulting Tables)
    for (let i = 0; i < HtmlPresetViews_json_1.default.length; i++) {
        let partialTableInfo = [];
        let partialPromiseArray = [];
        //Loops through all SQL-Tables
        for (let j = 0; j < DatabaseTables_json_1.default.length; j++) {
            if (DatabaseTables_json_1.default[j].HtmlPresetId == i) {
                let ServerIndex = SQLServerNames.indexOf(DatabaseTables_json_1.default[j].ServerName);
                if (ServerIndex != undefined) {
                    //Creates Query
                    let query = "SELECT ";
                    for (let k = 0; k < HtmlPresetViews_json_1.default[i].Columns.length; k++) {
                        if (k != 0) {
                            query += ", ";
                        }
                        query += HtmlPresetViews_json_1.default[i].Columns[k][0];
                    }
                    query += " FROM [" + DatabaseTables_json_1.default[j].DatabaseName + "].[" + DatabaseTables_json_1.default[j].TableSchema + "].[" + DatabaseTables_json_1.default[j].TableName + "] " + DatabaseTables_json_1.default[j].SelectCondition;
                    //Executes Query
                    partialPromiseArray.push(SQLServers[ServerIndex].ExecuteSQL(query));
                    partialTableInfo.push(DatabaseTables_json_1.default[j]);
                    /*
                    //Waits for the Result and pushes it into the arrays
                    sqlReturnData.then(function (sqlReturnData: any){
                        // Loops through all returned rows
                        for (let l = 0; l < sqlReturnData.recordset.length; l++) {
                            unforamttedTable.push(sqlReturnData.recordset[l]);
                            partialTableInfo.push(tablesjson[j])
                        }
                        
                    })*/
                }
            }
        }
        promiseArrays.push(partialPromiseArray);
        preUnsortedTableInfo.push(partialTableInfo);
    }
    let preSortedTableData = [];
    let preSortedTableInfo = [];
    for (let i = 0; i < promiseArrays.length; i++) {
        let allDataRows = [];
        let allInfoRows = [];
        Promise.all(promiseArrays[i]).then((values) => {
            console.log(values);
            for (let j = 0; j < values.length; j++) {
                for (let l = 0; l < values[j].recordset.length; l++) {
                    allDataRows.push(values[j].recordset[l]);
                    allInfoRows.push(preUnsortedTableInfo[i][j]);
                }
            }
        });
        preSortedTableData.push(allDataRows);
        preSortedTableInfo.push(allInfoRows);
    }
    // Only changes the Array at the end of the function to guarantee to always have a full Array
    unformattedData = preSortedTableData;
    SortedTableInfo = preSortedTableInfo;
}
//Formats the Data into HTML-Table-Strings 
function GetFromattedData() {
    var FormattedData = [];
    //loops through all HTML-Tables (Table Presets)
    for (let i = 0; i < unformattedData.length; i++) {
        // Tables header with a Unique Class to maybe at desings later
        let tableHeader = "<table class='preset_" + i + "'><tr class='header'><th>Tablename</th>";
        let keys = HtmlPresetViews_json_1.default[i].Columns;
        for (let j = 0; j < keys.length; j++) {
            tableHeader += "<th class=" + keys[j][1] + ">" + keys[j][0] + "</th>";
        }
        tableHeader += "</tr>";
        let tableRows = "";
        //Loops through all rows of each table
        for (let j = 0; j < unformattedData[i].length; j++) {
            //Sets the first column to always contain the SQLTableName
            let tempRow = "<tr><td>" + SortedTableInfo[i][j].DatabaseName + "." + SortedTableInfo[i][j].TableSchema + "." + SortedTableInfo[i][j].TableName + "</td>";
            let values = Object.values(unformattedData[i][j]);
            for (let k = 0; k < values.length; k++) {
                //Sets color to rows with DateTime contrains
                if (keys[k][1] == "DateTime" || keys[k][1] == "DateTime2") {
                    tempRow += "<td class='" + keys[k][1] + "' style='background-color: " + GetBackgroundColor(values[k]) + "'>" + FormatDateTime(values[k]) + "</td>";
                }
                else {
                    tempRow += "<td class=" + keys[k][1] + ">" + values[k] + "</td>";
                }
            }
            tempRow += "</tr>";
            tableRows += tempRow;
        }
        FormattedData.push(tableHeader + tableRows);
    }
    return FormattedData.join(" ");
}
// Formats datetime from UTC to ISO without the "T" and "Z"
function FormatDateTime(_dateTime) {
    let formattedDate = "";
    formattedDate = _dateTime.toISOString();
    formattedDate = formattedDate.replace("T", " ").replace("Z", "");
    return formattedDate;
}
//Generates the Background color based on "The Max Time since Update"
function GetBackgroundColor(_dateTime) {
    let currentTime = Date.now();
    let timeToCalculate = currentTime - _dateTime.getTime();
    let miliseconds = ServerConfig_json_1.default.MaxTimeSinceUpdateInMin * 60 * 1000;
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
