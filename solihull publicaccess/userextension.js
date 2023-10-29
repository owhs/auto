// ==UserScript==
// @name         PublicAccess & EPortal Advanced UI
// @namespace    PublicAccess & EPortal Ripper
// @version      0.1
// @description  More Advanced Systems
// @author       owhs
// @match        https://publicaccess.solihull.gov.uk/*
// @match        https://publicaccess.tewkesbury.gov.uk/*
// @match        https://publicaccess.*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=solihull.gov.uk
// @grant        none
// @run-at        document-end
// ==/UserScript==

// https://publicaccess.solihull.gov.uk/online-applications/propertyDetails.do?activeTab=relatedCases&keyVal=O6P7S9OE03G00
// https://publicaccess.tewkesbury.gov.uk/online-applications/propertyDetails.do?activeTab=relatedCases&keyVal=000FE8QDLI000

(function() {
    'use strict';

    var dsamp = ()=>(new Date).toString().split(" (")[0].split(" ").slice(0,-1).join(" ");

    var logEl = document.createElement("div");
    logEl.id="console";

    window.ripper = {
        applicationList: ()=>[...document.querySelectorAll("#Application li")].map(x=>{
            var t = x.innerText.split("\n\n"),y=t[1].split(" | ").map(z=>z.split(": ")[1]),year=+y[0].split("/")[1],a=x.querySelector("a").href.replace("&activeTab=summary","")+"activeTab=";

            var dl = document.createElement("input");
            dl.type="checkbox";
            dl.title = "Download documents";

            x.querySelector("a").before(dl);

            x.querySelector("a").addEventListener("click",e=>{
                e.preventDefault();
                ripper.newJob(e.target.href.replace("activeTab=summary","activeTab=printPreview"),dl.checked)
            });
            x.dataset.year=year;
            return {id:y[0],title:t[0],status:y[1],url:a,year:year,el:x};
        }).sort((a, b) => a.year - b.year).reverse(),
        newJob: async (u,dl)=>{
            var job = {
                keyVal:u.split("&").slice(1).filter(b=>b.includes("keyVal="))[0].split("=")[1]
            };
            var jEl = document.createElement("div");
            jEl.id = job.keyVal;
            jEl.dataset.starttime = dsamp();
            jEl.dataset.status = "started";

            job.el = jEl;
            var currjob;

            job.log = (txt,to=500)=>{
                clearTimeout(currjob);
                var en = document.createElement("div");
                en.dataset.time = dsamp();
                en.innerText = txt;
                jEl.append(en);
                if(to>0) currjob = setTimeout(()=>en.style.color="red",to);
                return en;
            };

            logEl.prepend(jEl);

            job.log("Job initiated: " + job.keyVal);
            job.log("fetching details..",5000);
            jEl.dataset.status = "running";
            var html = await(await fetch(u)).text();

            job.log("parsing details..");
            jEl.dataset.status = "parsing";
            var dom=(new DOMParser()).parseFromString(html,"text/html"),
                data= {};
            dom.querySelectorAll("#popupContainer #simpleDetailsTable tr").forEach(x=>{
                var c=[...x.children].map(c=>c.innerText.trim());
                data[c[0]]=c[1];
            });
            data.Contacts = [...dom.querySelectorAll("#popupContainer>#applicationDetails+h2~div")].map(c=>c.innerText.split("\n\n").join(" ").split("\t").join(": ").split("\n").join(" ").trim());
            data.Constraints = [...dom.querySelectorAll("#popupContainer>#caseConstraints tr")].map(c=>c.innerText.split("\t").join(" - ").split("\n").join(" ").trim());
            data.Documents = +dom.querySelector(".associateddocument").innerText.split(" ").slice(2)[0].trim();
            data.Cases = +dom.querySelector(".associatedcase").innerText.split(" ").slice(2)[0].trim();
            data.Properties = +dom.querySelector(".associatedproperty").innerText.split(" ").slice(2)[0].trim();
            data.applicationKey = job.keyVal;
            data.propertyKey = location.href.split("&").slice(1).filter(b=>b.includes("keyVal="))[0].split("=")[1];


            jEl.dataset.log = data.Reference + " - " + data.Status + ": " + (data.Decision||data["Expiry Date"]);

            var blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json" });
            var dlEl = document.createElement('a');
            dlEl.innerText = data.Reference.replace(/\//g,"-")+".json";
            dlEl.setAttribute("style", "color:#fff!important" );
            dlEl.setAttribute("href",     URL.createObjectURL(blob)     );
            dlEl.setAttribute("download", data.Reference.replace(/\//g,"-")+".json");
            job.log("Converted file: ").append(dlEl);
            dlEl.click();

            if (dl && data.Documents>0){
                job.log("fetching documents ("+data.Documents+") list..",8000);
                jEl.dataset.status = "running";
                html = await(await fetch(u.replace("activeTab=printPreview","activeTab=documents"))).text();

                jEl.dataset.status = "parsing";
                job.log("fetched list");
                dom=(new DOMParser()).parseFromString(html,"text/html"),
                    data= {};
                dom.querySelectorAll("#caseDownloadForm input.bulkCheck").forEach(i=>i.checked=true);
                var fd = new FormData(dom.querySelector("#caseDownloadForm"),dom.querySelector("#caseDownloadForm #downloadFiles"));
                //ODO finish his shi

                //for (const [key, value] of fd) {
                //    console.log(`${key}: ${value}\n`);
                //}

                //console.log(dom.querySelector("form#caseDownloadForm").outerHTML);
            }

            job.log("complete",0);
            jEl.dataset.status = "done";

        }
    };
    var datayr = ((x,n)=>Array(x-n+1).fill().map((z,i)=>"[data-year='"+(x-i)+"']>[data-year='"+(x-i)+"']").join(",")+"{display:block!important}");
    var dlBtn = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAtElEQVR4nN3TMQ7CMAxA0T9BJ84FqCeBOwAjF2RjomMXmBmMIgWpslI1dpMOtWSlqpK81nFgjXEEOkAy8uYBcjcXL/Jf2E7kG/jGufcagHgRCyAexAoI8Bk8FwPaEbBIe/bA1QpY27O3AqkJosYNcBkpYzYQ8gTsE8AT2M0FHkATR1HANtZ+FhC+/KwWSOIv3YB+Vwyo3kUH4FXzHlS/yYsBnfEsZJChxJNhOQtRm4cWX1n8ACZG49HKmv+eAAAAAElFTkSuQmCC';

    var css = "*{user-select:none}div#idox div#pa #toolbar.js,div#idox div#pa div#header,div#idox div#pa div#footer,#searchresultsback,.pagehelp,#print,#breadcrumbs,#poweredBy{display:none!important}div#relatedItems>div{max-height:70px;overflow:hidden}div#relatedItems>div>h2{cursor:pointer}div#relatedItems>div.active{max-height:100%}#Application>ul>li[data-year]{display:none}div#idox div#pa #breadcrumbs+.container{width:49%;margin-left:0;padding:20px;border-right:1px solid #215a6d}"+
        "div#console{position:fixed;top:0;width:calc(50% - 21px);height:100%;right:1px;bottom:1px;background:#000e;overflow:auto;font-family:monospace;color:#ccc;padding:0 10px;border:1px solid #292929}#console>div{border:1px solid #555;margin: 10px 0 0;border-radius:3px;overflow:hidden}#console>div:before{content:attr(id)': ('attr(data-status)') 'attr(data-log);display:block;background:#222;padding:0 6px;height:32px;line-height:32px}#console>div>div{font-size:medium;margin-left:10px}#console>div>div:hover,#console>div:hover:before{color:#fff}#console>div>div:before{content:attr(data-time)': ';font-size:smaller}";
    var styleEl = document.createElement("style");
    styleEl.innerHTML=css;
    document.head.append(styleEl);

    if (location.pathname.split("/").slice(-1)[0]==="propertyDetails.do"){
        var list = window.ripper.applicationList(),years=[...new Set(list.map(x=>x.year))];
        document.querySelectorAll(".container>.content>.tabs a").forEach(z=>z.addEventListener("click",e=>e.preventDefault()));
        styleEl.innerHTML+=datayr(years[0],years.slice(-1)[0]);

        document.querySelectorAll("#relatedItems>div>h2").forEach(x=>x.addEventListener("click",e=>x.parentElement.classList.toggle("active")));
        var appTab = document.querySelector("#Application");
        appTab.classList.add("active");
        appTab.querySelector("h2").outerHTML += '<ul class="tabs">'+years.map(x=>'<li><a href="javascript:void(0)"><span>'+x+'</span></a></li>').join("")+"</ul>";
        document.querySelectorAll("#Application .tabs>li>a").forEach(x=>x.addEventListener("click",e=>{
            document.querySelectorAll("#Application .tabs>li>a.active").forEach(z=>z.classList.remove("active"));
            x.classList.add("active")
            document.querySelector("#Application ul.tabs+ul").dataset.year=x.innerText;
        }));
        document.querySelector("#Application .tabs>li>a").click();

        document.querySelector("#pa>#breadcrumbs+div.container").after(logEl);
    }
})();
