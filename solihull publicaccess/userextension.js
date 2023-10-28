// ==UserScript==
// @name         PublicAccess & EPortal Advanced UI
// @namespace    PublicAccess & EPortal Ripper
// @version      0.1
// @description  More Advanced Systems
// @author       owhs
// @match        https://publicaccess.solihull.gov.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=solihull.gov.uk
// @grant        none
// @run-at        document-end
// ==/UserScript==

//https://publicaccess.solihull.gov.uk/online-applications/propertyDetails.do?activeTab=relatedCases&keyVal=O6P7S9OE03G00

(function() {
    'use strict';

    var logEl = document.createElement("div");
    logEl.id="console";

    window.ripper = {
        applicationList: ()=>[...document.querySelectorAll("#Application li")].map(x=>{
            var t = x.innerText.split("\n\n"),y=t[1].split(" | ").map(z=>z.split(": ")[1]),year=+y[0].split("/")[1],a=x.querySelector("a").href.replace("&activeTab=summary","")+"activeTab=";
            x.querySelector("a").addEventListener("click",e=>{
                e.preventDefault();

            });
            x.dataset.year=year;
            return {id:y[0],title:t[0],status:y[1],url:a,year:year,el:x};
        }).sort((a, b) => a.year - b.year).reverse()
    };
    var datayr = ((x,n)=>Array(x-n+1).fill().map((z,i)=>"[data-year='"+(x-i)+"']>[data-year='"+(x-i)+"']").join(",")+"{display:block!important}");

    var css = "*{user-select:none}div#idox div#pa #toolbar.js,div#idox div#pa div#header,div#idox div#pa div#footer,#searchresultsback,.pagehelp,#print{display:none!important}div#relatedItems>div{max-height:70px;overflow:hidden}div#relatedItems>div>h2{cursor:pointer}div#relatedItems>div.active{max-height:100%}#Application>ul>li[data-year]{display:none}div#console{position:fixed;top:0;width:calc(50% - 21px);height:100%;right:1px;bottom:1px;background:#000e;overflow:auto;color:#ccc;padding:10px;border:1px solid #292929}div#idox div#pa #breadcrumbs+.container{width:49%;margin-left:0;padding:20px;border-right:1px solid #215a6d}";
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
