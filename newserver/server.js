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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Http = __importStar(require("http"));
const DatabaseConnector = __importStar(require("./DatabaseConnector"));
const fs = __importStar(require("fs"));
const DatabaseServers_json_1 = __importDefault(require("../config/DatabaseServers.json"));
const ServerConfig_json_1 = __importDefault(require("../ServerConfig.json"));
const SelectionConditions_json_1 = __importDefault(require("../Config/SelectionConditions.json"));
const DataCategories_json_1 = __importDefault(require("../Config/DataCategories.json"));
const URL = __importStar(require("url"));
// Sets Port if it was not already set
let port = ServerConfig_json_1.default.Port;
if (!port || port == 0) {
    port = 8100;
}
// creates an Array for All connections to SQL-Servers
var SQLServers = [];
var SQLServerNames = [];
for (let i = 0; i < DatabaseServers_json_1.default.length; i++) {
    SQLServers.push(new DatabaseConnector.ServerConnection(DatabaseServers_json_1.default[i].IPAddress, DatabaseServers_json_1.default[i].ServerName, DatabaseServers_json_1.default[i].Port, DatabaseServers_json_1.default[i].Username, DatabaseServers_json_1.default[i].Password));
    SQLServerNames.push(DatabaseServers_json_1.default[i].ServerName);
}
var Datasourcestext = fs.readFileSync("../SQLStatusViewer/Config/Datasources.json", "utf8");
var Datasources = JSON.parse(Datasourcestext);
// Starts Node.js Server with a Listen and Request handler
startServer(port);
function startServer(_port) {
    console.log("Starting server" + _port);
    let server = Http.createServer();
    server.addListener("request", handleRequest);
    server.addListener("listening", handleListen);
    // Retrieves the SQL-Data
    GetFullData();
    setInterval(function () {
        GetFullData();
    }, ServerConfig_json_1.default.DataFetchTimeInMin * 60 * 1000);
    server.listen(_port);
}
// Consoleoutput to tel when the Server has startet
function handleListen() {
    console.log("Listening");
}
// Request handling 
function handleRequest(_request, _response) {
    let body = [];
    var requestBodyJSON;
    console.log(_request.method);
    _request.on('data', (chunk) => {
        console.log("chunk " + chunk);
        body.push(chunk);
    });
    _request.on('end', () => {
        var requestBody = Buffer.concat(body).toString();
        console.log("Body:" + requestBody);
        requestBodyJSON = JSON.parse(requestBody);
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        let requestURL = _request.url;
        let urlWithQuery = URL.parse(requestURL, true);
        console.log("I hear voices from: " + requestURL);
        var query = urlWithQuery.query;
        var sendString = "";
        var apiMethod = "";
        if (requestBodyJSON != undefined)
            apiMethod = requestBodyJSON.method;
        console.log(apiMethod);
        //#region Rest-Api
        if (apiMethod == "GetServers") {
            sendString = JSON.stringify(SQLServerNames);
            _response.write(sendString);
            _response.end();
        }
        else if (apiMethod == "GetDatabases") {
            var res = GetDatabases(parseInt(requestBodyJSON.serverid));
            res.then((value) => {
                if (value != undefined && value != null) {
                    _response.write(JSON.stringify(value));
                    _response.end();
                }
                else {
                    _response.write(JSON.stringify(value));
                    _response.end();
                }
            });
        }
        else if (apiMethod == "GetTables") {
            var res = GetTables(parseInt(requestBodyJSON.serverid), parseInt(requestBodyJSON.databaseid));
            res.then((value) => {
                if (value != undefined && value != null) {
                    _response.write(JSON.stringify(value));
                    _response.end();
                }
            });
        }
        else if (apiMethod == "GetDatabaseCollumns") {
            var res = GetTableCollumns(parseInt(requestBodyJSON.serverid), parseInt(requestBodyJSON.databaseid), parseInt(requestBodyJSON.tableid), parseInt(requestBodyJSON.tableschemaid));
            res.then((value) => {
                if (value != undefined && value != null) {
                    _response.write(JSON.stringify(value));
                    _response.end();
                }
            });
        }
        else if (apiMethod == "GetCategories") {
            _response.write(JSON.stringify(DataCategories_json_1.default));
            _response.end();
        }
        else if (apiMethod == "GetSelectionConditions") {
            _response.write(JSON.stringify(SelectionConditions_json_1.default));
            _response.end();
        }
        else if (apiMethod == "GetSchemas") {
            var res = GetSchemas(parseInt(requestBodyJSON.serverid), parseInt(requestBodyJSON.databaseid));
            res.then((value) => {
                if (value != undefined && value != null) {
                    _response.write(JSON.stringify(value));
                    _response.end();
                }
            });
        }
        else if (apiMethod == "AddSource") {
            AddSource(parseInt(requestBodyJSON.serverid), parseInt(requestBodyJSON.databaseid), parseInt(requestBodyJSON.tableid), parseInt(requestBodyJSON.tableschemaid), parseInt(requestBodyJSON.statuscollumnid), requestBodyJSON.visibleCollumnNumbers, parseInt(requestBodyJSON.selectConditionid), parseInt(requestBodyJSON.categoryid), requestBodyJSON.DisplayTitle, requestBodyJSON.UTCTimeOffset);
            sendString = "";
            _response.write(sendString);
            _response.end();
        }
        else if (apiMethod == "GetStatus") {
            sendString = JSON.stringify(FetchedData);
            _response.write(sendString);
            _response.end();
        }
        else if (apiMethod == "VerifyTableName") {
            var res = VerifyTableName(query.useddb, query.tablename);
            res.then((value) => {
                if (value != undefined && value != null) {
                    _response.write(value);
                    _response.end();
                }
            });
        }
        else if (apiMethod == "VerifyDBName") {
            var res = VerifyDBName(parseInt(query.serverid), query.databasename);
            res.then((value) => {
                if (value != undefined && value != null) {
                    _response.write(value);
                    _response.end();
                }
            });
        }
        //#endregion
    });
}
//adding another Source form the userinput
function AddSource(_servernumber, _dbnumber, _tablenumber, _tableschemanumber, _statuscollumnnumber, _visibleCollumnsArray, _selectionConditionNumber, _categoryNumber, _displayTitle, _UTCTimeOffset) {
    return __awaiter(this, void 0, void 0, function* () {
        var text = fs.readFileSync("../SQLStatusViewer/Config/Datasources.json", "utf8");
        Datasources = JSON.parse(text);
        var server = SQLServerNames[_servernumber];
        var databases = yield GetDatabases(_servernumber);
        var database = databases[_dbnumber];
        var tables = yield GetTables(_servernumber, _dbnumber);
        var table = tables[_tablenumber];
        var schemas = yield GetSchemas(_servernumber, _dbnumber);
        var schema = schemas[_tableschemanumber];
        var collumns = yield GetTableCollumns(_servernumber, _dbnumber, _tablenumber, _tableschemanumber);
        var statuscolumn = collumns[_statuscollumnnumber];
        var visibleCollumnNames = [];
        for (let index = 0; index < collumns.length; index++) {
            if (_visibleCollumnsArray.includes(index)) {
                visibleCollumnNames[visibleCollumnNames.length] = collumns[index];
            }
        }
        var condition = GetCondition(_selectionConditionNumber, [server, database, table, schema, statuscolumn]);
        var NewSource = {
            "DisplayTitle": _displayTitle,
            "ServerName": server,
            "DatabaseName": database,
            "TableName": table,
            "TableSchema": schema,
            "SelectCondition": condition,
            "UTCTimeOffset": _UTCTimeOffset,
            "Category": DataCategories_json_1.default[_categoryNumber],
            "StatusColumn": collumns[_statuscollumnnumber],
            "Columns": visibleCollumnNames
        };
        Datasources.push(NewSource);
        var stringJson = JSON.stringify(Datasources, null, "\t");
        fs.writeFile("../SQLStatusViewer/Config/Datasources.json", stringJson, 'utf8', function (err) {
            if (err) {
                console.log("An error occured while writing JSON Object to File.");
                return console.log(err);
            }
            console.log("JSON file has been saved.");
        });
        GetFullData();
    });
}
function GetCondition(_conditionNumber, extra) {
    if (_conditionNumber <= 1) {
        return SelectionConditions_json_1.default[_conditionNumber].replace("@CurrentTable", "[" + extra[1] + "].[" + extra[3] + "].[" + extra[2] + "]");
    }
    else if (_conditionNumber == (2 || 3)) {
        var find = "@Statuscolumn";
        var re = new RegExp(find, 'g');
        return SelectionConditions_json_1.default[_conditionNumber].replace("@CurrentTable", "[" + extra[1] + "].[" + extra[3] + "].[" + extra[2] + "]").replace(re, extra[4]);
    }
    else {
        return "";
    }
}
function VerifyTableName(_dbname, _tablename) {
    return __awaiter(this, void 0, void 0, function* () {
        var res = yield SQLServers[0].GetTableNamesFromDB(_dbname);
        if (res != null) {
            var returnbool = false;
            var recordset = res.recordset;
            for (let index = 0; index < recordset.length; index++) {
                console.log(recordset[index].name);
                console.log(_tablename);
                if (recordset[index].name == _tablename) {
                    returnbool = true;
                    console.log(true);
                }
            }
            return returnbool;
        }
        return null;
    });
}
function VerifyDBName(_servernumber, _dbname) {
    return __awaiter(this, void 0, void 0, function* () {
        var res = yield SQLServers[_servernumber].GetDBNamesFromServer();
        if (res != null) {
            var returnbool = false;
            var recordset = res.recordset;
            for (let index = 0; index < recordset.length; index++) {
                console.log(recordset[index].name);
                if (recordset[index].name == _dbname) {
                    returnbool = true;
                    console.log(true);
                }
            }
            return returnbool;
        }
        return null;
    });
}
function GetDatabases(_servernumber) {
    return __awaiter(this, void 0, void 0, function* () {
        var res = yield SQLServers[_servernumber].GetDBNamesFromServer();
        if (res != null) {
            var returnStringArray = [];
            var recordset = res.recordset;
            for (let index = 0; index < recordset.length; index++) {
                returnStringArray[index] = recordset[index].name;
            }
            return returnStringArray;
        }
    });
}
function GetTables(_servernumber, _dbnumber) {
    return __awaiter(this, void 0, void 0, function* () {
        var databases = yield GetDatabases(_servernumber);
        var res = yield SQLServers[_servernumber].GetTableNamesFromDB(databases[_dbnumber]);
        if (res != null) {
            var returnStringArray = [];
            var recordset = res.recordset;
            for (let index = 0; index < recordset.length; index++) {
                returnStringArray[index] = recordset[index].name;
            }
            return returnStringArray;
        }
    });
}
function GetSchemas(_servernumber, _dbnumber) {
    return __awaiter(this, void 0, void 0, function* () {
        var databases = yield GetDatabases(_servernumber);
        var res = yield SQLServers[_servernumber].GetSchemas(databases[_dbnumber]);
        if (res != null) {
            var returnStringArray = [];
            var recordset = res.recordset;
            for (let index = 0; index < recordset.length; index++) {
                returnStringArray[index] = recordset[index].name;
            }
            return returnStringArray;
        }
    });
}
function GetTableCollumns(_servernumber, _dbnumber, _tablenumber, _tableschemanumber) {
    return __awaiter(this, void 0, void 0, function* () {
        var databases = yield GetDatabases(_servernumber);
        var tables = yield GetTables(_servernumber, _dbnumber);
        var tableSchemas = yield GetSchemas(_servernumber, _dbnumber);
        var res = yield SQLServers[_servernumber].GetCollumnNamesFromTable(databases[_dbnumber], tables[_tablenumber], tableSchemas[_tableschemanumber]);
        if (res != null) {
            var returnStringArray = [];
            var recordset = res.recordset;
            for (let index = 0; index < recordset.length; index++) {
                returnStringArray[index] = recordset[index].name;
            }
            return returnStringArray;
        }
    });
}
var FetchedData = [];
function GetFullData() {
    FetchedData = [];
    var DataArray = [];
    for (let i = 0; i < Datasources.length; i++) {
        var Data = FetchDataSimple(Datasources[i]);
        DataArray.push(Data);
    }
    Promise.all(DataArray).then((values) => {
        for (let j = 0; j < values.length; j++) {
            var Sourcedata = [];
            if (values[j] != null) {
                for (let l = 0; l < values[j].recordset.length; l++) {
                    Sourcedata.push(values[j].recordset[l]);
                }
                FetchedData.push({ SourceObject: Datasources[j], Data: Sourcedata });
            }
            else {
                FetchedData.push({ SourceObject: Datasources[j], Data: "Error: Database not Online" });
            }
        }
        console.log(FetchedData);
    });
}
function FetchDataSimple(Datasource) {
    return __awaiter(this, void 0, void 0, function* () {
        var serverindex = SQLServerNames.indexOf(Datasource.ServerName);
        var res = SQLServers[serverindex].VerifyDBState(Datasource.DatabaseName);
        return res.then((value) => {
            var state = value.recordset[0].state;
            if (state == 0) {
                var query = "Select ";
                for (let index = 0; index < Datasource.Columns.length; index++) {
                    query += Datasource.Columns[index];
                    if (index < Datasource.Columns.length - 1) {
                        query += ", ";
                    }
                }
                query += " From [" + Datasource.DatabaseName + "].[" + Datasource.TableSchema + "].[" + Datasource.TableName + "] " + Datasource.SelectCondition;
                console.log(query);
                return SQLServers[serverindex].ExecuteSQL(query);
            }
            else
                return null;
        });
    });
}
