var port = 8100;
//var currentHost: string = "http://"+window.location.hostname+":"+port+"/";
var currentHost: string = "http://localhost:"+port+"/";
var currentPage: string = window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1);
UpdateTables();


setInterval(UpdateTables,60000)

var titleElement = document.getElementById("Title");
titleElement!.innerHTML = "Waiting for Title...";




function UpdateTables(): void {
    var TablePromise = getData();
    var Tables;
    TablePromise.then(function(TablePromiseResult: string) {
        
        Tables = new DOMParser().parseFromString(TablePromiseResult,"text/html");

        var newTitle = Tables.body.children[0].innerHTML;
        var titleElement = document.getElementById("Title");
        titleElement!.innerHTML = newTitle;

        var pureTables = Tables.getElementsByTagName("table");
        var pureHeaders = Tables.getElementsByTagName("h2");
        /*
        console.log(pureTables[1])
        console.log(pureHeaders[1])
        */

        var tableDiv = document.getElementById("TableDiv");
        tableDiv!.innerHTML = ""
        for (let i = 0; i < pureHeaders.length; i++) {
            tableDiv!.innerHTML += pureHeaders[i].outerHTML;
            tableDiv!.innerHTML += pureTables[i].outerHTML;
        }
        
        
        


        searchFunction();
    })
    
}




async function getData(): Promise<string> {
    let url: string = currentHost + currentPage;

    url = url + "?" + "getData=1";
    
    let response: Response = await fetch(url);
    let message: string = await response.text();
    return message;
}


function searchFunction(): void {
    var input: HTMLInputElement, filter, tables: HTMLCollectionOf<HTMLTableElement>, tr:HTMLCollectionOf<HTMLTableRowElement>, td: HTMLCollectionOf<HTMLTableCellElement>, txtValue;
    var input = <HTMLInputElement>document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    var tables = document.getElementsByTagName("table");
    
    if(input && tables)
    for (let j = 0; j < tables.length; j++) {
        tr = tables[j].getElementsByTagName("tr");
        for (let i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td");
            if(td.length > 0){
                var showRow = false;
                for (let k = 0; k < td.length; k++) {
                    if (td) {
                        txtValue = td[k].textContent || td[k].innerText;

                        if ((txtValue.toUpperCase().indexOf(filter) > -1)) {
                        showRow = true;
                        }
                    }     
                    
                }
                if(showRow){
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
            



            
          }
        
    }
    
  }