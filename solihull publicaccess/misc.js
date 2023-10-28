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




var f = await fetch("https://publicaccess.solihull.gov.uk/online-applications/download/", {
  "headers": {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "cache-control": "no-cache",
    "content-type": "application/x-www-form-urlencoded",
    "pragma": "no-cache",
    "upgrade-insecure-requests": "1"
  },
  "referrer": "https://publicaccess.solihull.gov.uk/online-applications/applicationDetails.do?activeTab=documents&keyVal=RTBGFPOEIQX00",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "_csrf=5a68bea7-9988-4548-9d45-3ab5ab011340&file=95F8F70062D1563A822F100B25B14771%2FRE-PRINT__DECISION_APPROVAL-1933040.pdf&file=F01605ECDF88B745913713EBDBA08369%2FSMBC_-_DRAINAGE___LLFA-1925626.docx&file=6ED42C03F8D9896CC6679562A2C2AD13%2FSMBC_-_DRAINAGE___LLFA-1903973.docx&file=AE6200A6EE463DEBE84CEAD0476A086B%2FSMBC_-_HIGHWAYS-1897756.pdf&file=C03407AB3B4DDB47C19F68009BAE63F0%2FAPPLICATION_FORM_REDACTED-1890347.pdf&file=C833361A315C77FB439B997D0D9918A2%2FLOCATION_PLAN-1890350.pdf&file=CB441A960EAD83F76C538172FCA240DF%2FEXISTING_SITE_PLAN-1890351.pdf&file=E344578D82432114B18410879899EE4A%2FPROPOSED_SITE_PLAN-1890352.pdf&file=86D5F5A214DC42EC37EEDDCDC9E6130F%2FPROPOSED_PLAN-1890353.pdf&file=8AC35C4610E28A7D1CD429BD17AC01B4%2FPROPOSED_LAYOUT-1890354.pdf&file=509DC4EE333A21A862EA369C99C8E397%2FPROPOSED_ROOF_PLAN-1890355.pdf&file=AFB24E3812DC8668AABEE10E02BC38CD%2FSECTIONS_AA-BB-1890356.pdf&file=20652AAE752ED5EC37008DC53A9EB1E4%2FELEVATIONS-1890357.pdf&file=DE49795454D621AFC20896786F7CB2B6%2FSUPPORTING_LETTER-1890424.pdf&caseNumber=PL%2F2023%2F00838%2FPPFL",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});
 var a = document.createElement("a");
  a.href = window.URL.createObjectURL(await f.blob());
  a.download = decodeURIComponent("PL%2F2023%2F00838%2FPPFL").replace(/\//g,"-")+".zip";
  a.click();
