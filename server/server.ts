import * as Http from 'http'
import * as DatabaseConnector from './DatabaseConnector'
import tablesjson from '../config/DatabaseTables.json'
import SQLServersJson from '../config/DatabaseServers.json'
import HtmlPresetViews from '../config/HtmlPresetViews.json'
import ServerConfig from '../ServerConfig.json'

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



var unformattedData: any = [];
var SortedTableInfo: any = [];


// Starts Node.js Server with a Listen and Request handler
startServer(port);
function startServer(_port: number): void {
    console.log("Starting server" + _port);
    let server: Http.Server = Http.createServer();
    server.addListener("request", handleRequest);
    server.addListener("listening", handleListen);
    // Retrieves the SQL-Data
    GetAllData();
    setInterval(function(){
        GetAllData();
    },ServerConfig.DataFetchTimeInMin*60*1000)
    server.listen(_port);
}

// Consoleoutput to tel when the Server has startet
function handleListen(): void {
    console.log("Listening");
}

// Request handling 
function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {
    _response.setHeader("content-type", "text/html; charset=utf-8");
    _response.setHeader("Access-Control-Allow-Origin", "*");

    let requestURL:  URL = new URL(_request.url!, `http://${_request.headers.host}`);
    console.log("I hear voices from: " + requestURL);
    var pathname = requestURL.pathname
    var sendString: string = "";

    // Returns the Formatted Data
    if(pathname == "/index.html"){
        sendString = "<p>"+ServerConfig.PageTitle+"</p>"+GetFromattedData();
    }


    _response.write(sendString);
    _response.end();

}


// Function the get All data form the Databse-Tables
function GetAllData():  any{
    console.log("Fetching Data...")
    let preUnsortedTableInfo: any = [];
    let promiseArrays: any = [];
    //Loops through all presets (All Resulting Tables)
    for (let i = 0; i < HtmlPresetViews.length; i++) {
        
        let partialTableInfo: any = [];
        let partialPromiseArray: Promise<any>[] = []
        //Loops through all SQL-Tables
        for (let j = 0; j < tablesjson.length; j++) {
            if(tablesjson[j].HtmlPresetId == i){
                let ServerIndex = SQLServerNames.indexOf(tablesjson[j].ServerName);
                if(ServerIndex != undefined){
                    //Creates Query
                    let query = "SELECT ";
                    for (let k = 0; k < HtmlPresetViews[i].ShowColumns.length; k++) {
                        if(k != 0){
                            query += ", "
                        }
                        query += HtmlPresetViews[i].ShowColumns[k][0];
                        
                    }
                    query += " FROM ["+ tablesjson[j].DatabaseName + "].["+tablesjson[j].TableSchema+"].["+tablesjson[j].TableName + "] "+tablesjson[j].SelectCondition;
                    
                    //Executes Query
                    partialPromiseArray.push(SQLServers[ServerIndex].ExecuteSQL(query));
                    partialTableInfo.push(tablesjson[j])
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
        let allDataRows: any = [];
        let allInfoRows: any = [];
        Promise.all(promiseArrays[i]).then((values) =>{
            for (let j = 0; j < values.length; j++) {
                for (let l = 0; l < values[j].recordset.length; l++) {
                    allDataRows.push(values[j].recordset[l])
                    allInfoRows.push(preUnsortedTableInfo[i][j])
                    
                }
            }

        })
        preSortedTableData.push(allDataRows);
        preSortedTableInfo.push(allInfoRows);
    }

    // Only changes the Array at the end of the function to guarantee to always have a full Array
    unformattedData = preSortedTableData;
    SortedTableInfo = preSortedTableInfo;
    console.log("Finished Fetching")
}


//Formats the Data into HTML-Table-Strings 
function GetFromattedData(): string{
    var FormattedData: string[] = [];

    //loops through all HTML-Tables (Table Presets)
    for (let i = 0; i < unformattedData.length; i++) {

        // Tables header with a Unique Class to maybe at desings later
        let tableHeader =  "<h2 class='header_"+i+"'>"+HtmlPresetViews[i].ShowTitle+"</h2><table class='preset_"+i+"'><tr class='header'><th>TableName</th>"
        let keys = HtmlPresetViews[i].ShowColumns;
        for (let j = 0; j < keys.length; j++) {
            tableHeader += "<th class="+keys[j][1]+">" + keys[j][0] + "</th>"
        }
        tableHeader += "</tr>";
        let tableRows: string = "";

        //Loops through all rows of each table
        for (let j = 0; j < unformattedData[i].length; j++) {

            //Sets the first column to always contain the SQLTableName
            let tempRow = "<tr><td>"+SortedTableInfo[i][j].DatabaseName+"."+SortedTableInfo[i][j].TableSchema+"."+SortedTableInfo[i][j].TableName+"</td>";
            let values = Object.values(unformattedData[i][j]);
            for (let k = 0; k < values.length; k++) {

                //Sets color to rows with DateTime contrains
                if(keys[k][1] == "DateTime" || keys[k][1] == "DateTime2"){
                    tempRow += "<td class='"+keys[k][1]+"' style='background-color: "+GetBackgroundColor(<Date>values[k])+"'>" + FormatDateTime(<Date>values[k]) + "</td>";
                }else {
                    tempRow += "<td class="+keys[k][1]+">" + values[k] + "</td>";
                }

            }
            tempRow += "</tr>";
            tableRows += tempRow;
        }

        FormattedData.push(tableHeader+tableRows);
        
    }

    return FormattedData.join("");
}

// Formats datetime from UTC to ISO without the "T" and "Z"
function FormatDateTime(_dateTime: Date): string{
    let formattedDate: string = "";
    formattedDate = _dateTime.toISOString();
    formattedDate = formattedDate.replace("T"," ").replace("Z","");
    return formattedDate;
}

//Generates the Background color based on "The Max Time since Update"
function GetBackgroundColor(_dateTime: Date): string {
    let currentTime = Date.now();
    let timeToCalculate = currentTime - _dateTime.getTime();
    let miliseconds = ServerConfig.MaxTimeSinceUpdateInMin*60*1000;
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