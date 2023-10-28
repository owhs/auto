var url = document.querySelectorAll("#searchresults a")[0].href.replace("activeTab=summary","activeTab=documents");
var html = await (await fetch(url)).text();
var doc = (new DOMParser()).parseFromString(html,"text/html");
document.body.append(doc.querySelector("#caseDownloadForm"));
document.querySelectorAll("#caseDownloadForm input.bulkCheck").forEach(x=>x.checked=true);



window.onscroll=function (e) {
    if(window.scrollY>(document.body.scrollHeight-document.body.clientHeight*2)){
        console.log("LOL")
    }
}




//https://publicaccess.solihull.gov.uk/online-applications/propertyDetails.do?keyVal=O6P7S9OE03G00&activeTab=summary
