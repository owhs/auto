// https://publicaccess.solihull.gov.uk/online-applications/propertyDetails.do?activeTab=relatedCases&keyVal=O6P7S9OE03G00

window.ripper = {
  applicationList: ()=>[...document.querySelectorAll("#Application li")].map(x=>{
        var t = x.innerText.split("\n\n"),y=t[1].split(" | ").map(z=>z.split(": ")[1]),a=x.querySelector("a").href.replace(location.origin,"").replace("activeTab=summary","activeTab=documents");
        return {id:y[0],title:t[0],status:y[1],url:a};
    })
};
