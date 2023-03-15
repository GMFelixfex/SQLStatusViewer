import * as Http from 'http'
import * as DatabaseConnector from './DatabaseConnector'
import * as fs from 'fs'
import SQLServersJson from '../config/DatabaseServers.json'
import ServerConfig from '../ServerConfig.json'
import SelectionConditions from '../Config/SelectionConditions.json'
import DataCategories from '../Config/DataCategories.json'
import * as URL from 'url'
import { Console } from 'console'


// Sets Port if it was not already set
let port: number = ServerConfig.Port;
if (!port || port == 0) {
    port = 8100;
}
// creates an Array for All connections to SQL-Servers
var SQLServers: DatabaseConnector.ServerConnection[] = [];
var SQLServerNames: string[] = []

    for (let i = 0; i < SQLServersJson.length; i++) {
        SQLServers.push(new DatabaseConnector.ServerConnection(SQLServersJson[i].IPAddress,SQLServersJson[i].ServerName,SQLServersJson[i].Port,SQLServersJson[i].Username,SQLServersJson[i].Password));
        SQLServerNames.push(SQLServersJson[i].ServerName);
    }


var Datasourcestext = fs.readFileSync("../SQLStatusViewer/Config/Datasources.json","utf8");
var Datasources = JSON.parse(Datasourcestext);


// Starts Node.js Server with a Listen and Request handler
startServer(port);

function startServer(_port: number): void {
    console.log("Starting server" + _port);
    let server: Http.Server = Http.createServer();
    server.addListener("request", handleRequest);
    server.addListener("listening", handleListen);
    // Retrieves the SQL-Data
    
    
    

    GetFullData();
    setInterval(function(){
        GetFullData();
    
    },ServerConfig.DataFetchTimeInMin*60*1000)

    
    
    server.listen(_port);
    
}

// Consoleoutput to tel when the Server has startet
function handleListen(): void {
    console.log("Listening");
    
}

// Request handling 
function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {
    let body: any[] = [];
    var requestBodyJSON: any;
    console.log(_request.method)
    _request.on('data', (chunk) => {
        console.log("chunk "+chunk);
        body.push(chunk);
      })
    _request.on('end', () => {
        var requestBody = Buffer.concat(body).toString();
        console.log("Body:"+requestBody)
        requestBodyJSON = JSON.parse(requestBody);
        
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        

        let requestURL: string = _request.url!;

        let urlWithQuery: URL.UrlWithParsedQuery = URL.parse(requestURL,true);
        console.log("I hear voices from: " + requestURL);
        var query: typeof urlWithQuery.query = urlWithQuery.query;
        var sendString: string = "";
        var apiMethod = "";
        if(requestBodyJSON != undefined) apiMethod = requestBodyJSON.method;
        console.log(apiMethod);



//#region Rest-Api

        if(apiMethod == "GetServers"){
            sendString = JSON.stringify(SQLServerNames);
            _response.write(sendString);
            _response.end();
            
        }

        else if(apiMethod == "GetDatabases"){
            var res = GetDatabases(parseInt(requestBodyJSON.serverid));
            res.then((value) =>{
                _response.write(JSON.stringify(value));
                _response.end();
            })
        }

        else if(apiMethod == "GetTables"){
            var res = GetTables(parseInt(requestBodyJSON.serverid),parseInt(requestBodyJSON.databaseid));
            res.then((value) =>{
                _response.write(JSON.stringify(value));
                _response.end();
            })
        }

        else if(apiMethod == "GetDatabaseCollumns"){
            var res = GetTableCollumns(parseInt(requestBodyJSON.serverid),parseInt(requestBodyJSON.databaseid),parseInt(requestBodyJSON.tableid),parseInt(requestBodyJSON.tableschemaid));
            res.then((value) =>{
                _response.write(JSON.stringify(value));
                _response.end();
            })
        }

        else if(apiMethod == "GetCategories"){
            _response.write(JSON.stringify(DataCategories));
            _response.end();
        }
        else if(apiMethod == "GetSelectionConditions"){
            _response.write(JSON.stringify(SelectionConditions));
            _response.end();
        }

        else if(apiMethod == "GetSchemas"){
            var res = GetSchemas(parseInt(requestBodyJSON.serverid),parseInt(requestBodyJSON.databaseid));
            res.then((value) =>{
                _response.write(JSON.stringify(value));
                _response.end();
            })
        }

        else if(apiMethod == "AddSource"){
            
            AddSource(parseInt(requestBodyJSON.serverid),
                parseInt(requestBodyJSON.databaseid),
                parseInt(requestBodyJSON.tableid),
                parseInt(requestBodyJSON.tableschemaid),
                parseInt(requestBodyJSON.statuscollumnid),
                requestBodyJSON.visibleCollumnNumbers,
                parseInt(requestBodyJSON.selectConditionid),
                parseInt(requestBodyJSON.categoryid),
                requestBodyJSON.DisplayTitle);
            sendString = ""
            _response.write(sendString);
            _response.end();
        }

        else if(apiMethod == "GetStatus"){
            sendString = JSON.stringify(FetchedData);
            _response.write(sendString);
            _response.end();
        }

        else if(apiMethod == "VerifyTableName"){
            var res = VerifyTableName(<string>query.useddb,<string>query.tablename);
            res.then((value) =>{
                _response.write(value);
                _response.end();
            })
        }

        else if(apiMethod == "VerifyDBName"){
            var res = VerifyDBName(parseInt(<string>query.serverid),<string>query.databasename);
            res.then((value) =>{
                _response.write(value);
                _response.end();
            })
        }

//#endregion
        

    });  
}

//adding another Source form the userinput
async function AddSource(_servernumber:number, _dbnumber:number, _tablenumber:number, _tableschemanumber:number, _statuscollumnnumber:number ,_visibleCollumnsArray:number[], _selectionConditionNumber:number, _categoryNumber: number, _displayTitle:string) {
    var text = fs.readFileSync("../SQLStatusViewer/Config/Datasources.json", "utf8");
    Datasources = JSON.parse(text);
        
    var server: string = SQLServerNames[_servernumber];
    var databases = await GetDatabases(_servernumber);
    var database: string = databases[_dbnumber];
    var tables = await GetTables(_servernumber,_dbnumber);
    var table: string = tables[_tablenumber];
    var schemas = await GetSchemas(_servernumber,_dbnumber);
    var schema: string = schemas[_tableschemanumber];
    var collumns: string[] = await GetTableCollumns(_servernumber,_dbnumber,_tablenumber,_tableschemanumber);
    var statuscolumn:  string =  collumns[_statuscollumnnumber];
    var visibleCollumnNames: string[] = [];
    for (let index = 0; index < collumns.length; index++) {
        if(_visibleCollumnsArray.includes(index)){
            visibleCollumnNames[visibleCollumnNames.length] = collumns[index];
        }
    }
    var condition = GetCondition(_selectionConditionNumber, [server,database,table,schema,statuscolumn]);
    var NewSource = {
                    "DisplayTitle": _displayTitle,
                    "ServerName": server,
                    "DatabaseName": database,
                    "TableName": table,
                    "TableSchema": schema,
                    "SelectCondition": condition,
                    "Category": DataCategories[_categoryNumber],
                    "StatusColumn": collumns[_statuscollumnnumber],
                    "Columns": visibleCollumnNames
                }
    Datasources.push(NewSource);
    var stringJson = JSON.stringify(Datasources, null, "\t");
    fs.writeFile("../SQLStatusViewer/Config/Datasources.json", stringJson,'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
     
        console.log("JSON file has been saved.");
    });
    GetFullData();
    
}

function GetCondition(_conditionNumber: number, extra:any ): string {
    if(_conditionNumber <= 1){
        return SelectionConditions[_conditionNumber].replace("@CurrentTable","["+extra[1]+"].["+extra[3]+"].["+extra[2]+"]");
    }
    else if(_conditionNumber == (2 || 3)){
        var find = "@Statuscolumn"
        var re = new RegExp(find, 'g')
        return SelectionConditions[_conditionNumber].replace("@CurrentTable","["+extra[1]+"].["+extra[3]+"].["+extra[2]+"]").replace(re,extra[4]);
    }
    else {
        return "";
    }
}



async function VerifyTableName(_dbname:string, _tablename:string):Promise<any>{
    var res = await SQLServers[0].GetTableNamesFromDB(_dbname);
    if(res!=null){
        var returnbool = false;
        var recordset = res.recordset
        for (let index = 0; index < recordset.length; index++) {
            console.log(recordset[index].name)
            console.log(_tablename)
            if(recordset[index].name == _tablename){
                returnbool = true;
                console.log(true)
            }
        }
        return returnbool;
    }
    return null
    
}

async function VerifyDBName(_servernumber:number, _dbname:string):Promise<any>{
    var res = await SQLServers[_servernumber].GetDBNamesFromServer();
    if(res!=null){
        var returnbool = false;
        var recordset = res.recordset
        for (let index = 0; index < recordset.length; index++) {
            console.log(recordset[index].name)
            if(recordset[index].name == _dbname){
                returnbool = true;
                console.log(true)
            }
        }
        return returnbool;
    }
    return null 
}

async function GetDatabases(_servernumber:number):Promise<any>{
    var res = await SQLServers[_servernumber].GetDBNamesFromServer();
    if(res!=null){
        var returnStringArray: string[] = [];
        var recordset = res.recordset
        for (let index = 0; index < recordset.length; index++) {
            returnStringArray[index] = recordset[index].name
        
        }
        return returnStringArray;
    }

    
}

async function GetTables(_servernumber:number, _dbnumber:number):Promise<any>{
    var databases = await GetDatabases(_servernumber);
    var res = await SQLServers[_servernumber].GetTableNamesFromDB(databases[_dbnumber])
    if(res!=null){
        var returnStringArray: string[] = [];
        var recordset = res.recordset
        for (let index = 0; index < recordset.length; index++) {
            returnStringArray[index] = recordset[index].name
        
        }
        return returnStringArray;
    }

    
}

async function GetSchemas(_servernumber:number, _dbnumber:number):Promise<any>{
    var databases = await GetDatabases(_servernumber);
    var res = await SQLServers[_servernumber].GetSchemas(databases[_dbnumber])
    if(res!=null){
        var returnStringArray: string[] = [];
        var recordset = res.recordset
        for (let index = 0; index < recordset.length; index++) {
            returnStringArray[index] = recordset[index].name
        
        }
        return returnStringArray;
    }

    
}

async function GetTableCollumns(_servernumber:number, _dbnumber:number, _tablenumber:number, _tableschemanumber:number):Promise<any>{
    var databases = await GetDatabases(_servernumber);
    var tables = await GetTables(_servernumber, _dbnumber);
    var tableSchemas = await GetSchemas(_servernumber,_dbnumber);
    var res = await SQLServers[_servernumber].GetCollumnNamesFromTable(databases[_dbnumber],tables[_tablenumber],tableSchemas[_tableschemanumber]);
    if(res!=null){
        var returnStringArray: string[] = [];
        var recordset = res.recordset
        for (let index = 0; index < recordset.length; index++) {
            returnStringArray[index] = recordset[index].name
        
        }
        return returnStringArray;
    }

    
}

var FetchedData: any[] = [];

function GetFullData(): any{
    FetchedData = [];
    var DataArray = [];
    for (let i = 0; i < Datasources.length; i++) {
        var Data = FetchDataSimple(Datasources[i]);
        DataArray.push(Data);
    }

    Promise.all(DataArray).then((values) =>{
        for (let j = 0; j < values.length; j++) {
            var Sourcedata = [];
            if(values[j] != null){
                for (let l = 0; l < values[j].recordset.length; l++) {
                    Sourcedata.push(values[j].recordset[l])
                }
                FetchedData.push({SourceObject: Datasources[j], Data: Sourcedata});
            } else {
                FetchedData.push({SourceObject: Datasources[j], Data: "Error: Database not Online"})
            }
            
        }
        console.log(FetchedData)
    })

    
}


async function FetchDataSimple(Datasource: typeof Datasources[number]): Promise<any>{
    var serverindex = SQLServerNames.indexOf(Datasource.ServerName);
    var res = SQLServers[serverindex].VerifyDBState(Datasource.DatabaseName)
    return res.then((value)=>{
        var state = value.recordset[0].state
        if(state==0){
            var query = "Select ";
            for (let index = 0; index < Datasource.Columns.length; index++) {
                query += Datasource.Columns[index];
                if(index < Datasource.Columns.length-1){
                    query+= ", "
                }
            }
            query += " From ["+Datasource.DatabaseName+"].["+Datasource.TableSchema+"].["+Datasource.TableName+"] "+Datasource.SelectCondition;
            console.log(query);
            return  SQLServers[serverindex].ExecuteSQL(query)
        }
        else return null
    })

    


}

console.log("end of programm")