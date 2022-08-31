var ip: string = "http://localhost:8100/";
var currentPage: string = window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1);
UpdateTables();

setInterval(UpdateTables,60000)


function UpdateTables(): void {
    var TablePromise = getData();
    var Tables = "";
    TablePromise.then(function(TablePromiseResult: string) {
        Tables = TablePromiseResult;
        var tableDiv = document.getElementById("TableDiv");
        tableDiv!.innerHTML = Tables;
        searchFunction();
    })
    
}




async function getData(): Promise<string> {
    let url: string = ip + currentPage;

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