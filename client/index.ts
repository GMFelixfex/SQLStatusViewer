var port = 8100;
//var currentHost: string = "http://"+window.location.hostname+":"+port+"/";
var currentHost: string = "http://localhost:"+port+"/";
var currentPage: string = window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1);
UpdateStatus();


setInterval(UpdateStatus,60000)



function UpdateStatus(): void {
    let TablePromise = getStatusData();
    let ReturnElements;
    TablePromise.then(function(TablePromiseResult: string) {
        console.log(TablePromiseResult);
        ReturnElements = new DOMParser().parseFromString(TablePromiseResult,"text/html");
        console.log(ReturnElements);

        var flexDivs = ReturnElements.getElementsByTagName("div");
        var Databasenames = ReturnElements.getElementsByTagName("p");


        var statusFlexbox = document.getElementById("StatusFlexbox");
        statusFlexbox!.innerHTML = ""
        for (let i = 0; i < flexDivs.length; i++) {
            statusFlexbox!.innerHTML += flexDivs[i].outerHTML;
        }
        
        for (let i = 0; i < statusFlexbox!.children.length; i++) {
            statusFlexbox!.children[i].addEventListener("click",function() {
                openTablePage(Databasenames[i].innerHTML);
              });
            
        }

    })
    
}

function openTablePage(databasename: string): void{
    console.log("open")
    localStorage.setItem("LastUsedDatabase",databasename);
    let curLoc = window.location.pathname.replace("/index.html","");
    location.href = curLoc+"/"+"process.html"
}



async function getStatusData(): Promise<string> {
    let url: string = currentHost + currentPage;

    url = url + "?" + "getStatusData=1";
    
    let response: Response = await fetch(url);
    let message: string = await response.text();
    return message;
}


