// ==UserScript==
// @name         PublicAccess & EPortal Advanced UI
// @namespace    PublicAccess & EPortal Ripper
// @version      0.1
// @description  PublicAccess & EPortal Advanced UI
// @author       owhs
// @match        https://publicaccess.solihull.gov.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=solihull.gov.uk
// @grant        none
// @run-at        document-end
// ==/UserScript==

(function() {
    'use strict';
    window.ripper = {
        applicationList: ()=>[...document.querySelectorAll("#Application li")].map(x=>{
            var t = x.innerText.split("\n\n"),y=t[1].split(" | ").map(z=>z.split(": ")[1]),year=+y[0].split("/")[1],a=x.querySelector("a").href.replace("&activeTab=summary","")+"activeTab=";
            x.dataset.year=year;
            return {id:y[0],title:t[0],status:y[1],url:a,year:year,el:x};
        }).sort((a, b) => a.year - b.year).reverse()
    };
    var css = "div#idox div#pa div#header,div#idox div#pa div#footer{display:none}div#relatedItems>div{max-height:70px;overflow:hidden}div#relatedItems>div>h2{cursor:pointer}div#relatedItems>div.active{max-height:100%}#Application>ul>li[data-year]{display:none}div#console{position:fixed;top:0;width:calc(50% - 21px);height:100%;right:1px;bottom:1px;background:#000e;overflow:auto;color:#ccc;padding:10px;border:1px solid #292929}div#idox div#pa #breadcrumbs+.container{width:49%;margin-left:0;padding:20px;border-right:1px solid #215a6d}[data-year='2023']>[data-year='2023'],[data-year='2022']>[data-year='2022'],[data-year='2021']>[data-year='2021'],[data-year='2020']>[data-year='2020'],[data-year='2019']>[data-year='2019'],[data-year='2018']>[data-year='2018'],[data-year='2017']>[data-year='2017'],[data-year='2016']>[data-year='2016'],[data-year='2015']>[data-year='2015'],[data-year='2014']>[data-year='2014'],[data-year='2013']>[data-year='2013'],[data-year='2012']>[data-year='2012'],[data-year='2011']>[data-year='2011'],[data-year='2010']>[data-year='2010'],[data-year='2009']>[data-year='2009'],[data-year='2008']>[data-year='2008'],[data-year='2007']>[data-year='2007'],[data-year='2006']>[data-year='2006'],[data-year='2005']>[data-year='2005'],[data-year='2004']>[data-year='2004'],[data-year='2003']>[data-year='2003'],[data-year='2002']>[data-year='2002'],[data-year='2001']>[data-year='2001'],[data-year='2000']>[data-year='2000'],[data-year='1999']>[data-year='1999'],[data-year='1998']>[data-year='1998'],[data-year='1997']>[data-year='1997'],[data-year='1996']>[data-year='1996'],[data-year='1995']>[data-year='1995'],[data-year='1994']>[data-year='1994'],[data-year='1993']>[data-year='1993'],[data-year='1992']>[data-year='1992'],[data-year='1991']>[data-year='1991'],[data-year='1990']>[data-year='1990'],[data-year='1989']>[data-year='1989'],[data-year='1988']>[data-year='1988'],[data-year='1987']>[data-year='1987'],[data-year='1986']>[data-year='1986'],[data-year='1985']>[data-year='1985'],[data-year='1984']>[data-year='1984'],[data-year='1983']>[data-year='1983'],[data-year='1982']>[data-year='1982'],[data-year='1981']>[data-year='1981'],[data-year='1980']>[data-year='1980'],[data-year='1979']>[data-year='1979'],[data-year='1978']>[data-year='1978'],[data-year='1977']>[data-year='1977'],[data-year='1976']>[data-year='1976'],[data-year='1975']>[data-year='1975'],[data-year='1974']>[data-year='1974'],[data-year='1973']>[data-year='1973'],[data-year='1972']>[data-year='1972'],[data-year='1971']>[data-year='1971'],[data-year='1970']>[data-year='1970']{display:block!important}";
    var styleEl = document.createElement("style");
        styleEl.innerHTML=css;
    document.head.append(styleEl);

    if (location.pathname.split("/").slice(-1)[0]==="propertyDetails.do"){
        var list = window.ripper.applicationList(),years=new Set(list.map(x=>x.year));

        document.querySelectorAll("#relatedItems>div>h2").forEach(x=>x.addEventListener("click",e=>x.parentElement.classList.toggle("active")));
        var appTab = document.querySelector("#Application");
        appTab.classList.add("active");
        appTab.querySelector("h2").outerHTML += '<ul class="tabs">'+[...years].map(x=>'<li><a href="javascript:void(0)"><span>'+x+'</span></a></li>').join("")+"</ul>";
        document.querySelectorAll("#Application .tabs>li>a").forEach(x=>x.addEventListener("click",e=>{
            document.querySelectorAll("#Application .tabs>li>a.active").forEach(z=>z.classList.remove("active"));
            x.classList.add("active")
            document.querySelector("#Application ul.tabs+ul").dataset.year=x.innerText;
        }));
        document.querySelector("#Application .tabs>li>a").click();

        var consl = document.createElement("div");
        consl.id="console";
        document.querySelector("#pa>#breadcrumbs+div.container").after(consl);
        //'<ul class="tabs">'+[...temp1].map(x=>'<li><a href="javascript:void(0)"><span>'+x+'</span></a></li>').join("")+"</ul>"
        //console.log(years);

        //setTimeout(()=>document.querySelector("#pageheading").scrollIntoView(),500);
    }
})();
