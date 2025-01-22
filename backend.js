
 
    window.onload = function(){
    var language_src = "https://www.diki.pl/slownik-angielskiego?q=";
    var content = document.getElementById("content");
    const frame = document.getElementById("myframe");
    const input = document.getElementById("searchBox");
    var Searchbutton = document.getElementById("GoSearch");
    // fetch("welcome.html")
    // .then(response => response.text())
    // .then(text=> content.innerHTML=text);
    content.innerHTML = "<h1>Witaj w wielojęzycznym słowniku Diki!</h1> <h3>By wyszukać, wpisz słówko do wyszukiwarki i naciśnij ENTER lub kliknij przycisk \"Wyszukaj\".</h3> <h3>Aby wyczyścić pasek wyszukiwania kliknij na niego prawym przyciskiem myszy.</h3>Motyw: <select id=\"themeSet\" style=\"background:#484848; color:white;\"><option value=\"Dark\">Ciemny</option><option value=\"Light\">Jasny</option></select> </h3>&nbsp;&nbsp;&nbsp;Lektor: <select id=\"lector\" style=\"background:#484848; color:white;\"><option value=\"off\">wyłączony</option><option value=\"on\">włączony</option></select>";
    Searchbutton.onclick = function() { GOSEARCH(); }
    var themeL = document.getElementById("themeSet");
    var lector = document.getElementById("lector");
    

    
    function GOSEARCH(val){
        if(input.value=="") return;
        if(lector.value=="on") {
            frame.src=language_src+input.value;
            input.focus();
        }
        window.scrollTo(0, 0);
        if(val!=null) input.value = val;
        fetch(language_src+input.value).then ( response =>{
            return response.text();
        }).then(function (html){
            //diki-results-container
            //"eTutorPromotionalLink\">"
            console.log(
                html.indexOf("class=\"diki-results-left-column\">"),
                html.indexOf("class=\"siteFooter")
            )
            
            // if(html.indexOf("dictionarySuggestions\"")==-1)
            {
                //searches of the first instances of string and adds the same string to prevent from outputting string in window
                html = html.substring(html.indexOf("class=\"dikiContainer\">")+("class=\"dikiContainer\">").length,html.indexOf("class=\"siteFooter"))
                .replace(/<a/g,"<button class=\"spann\"").replace(/<\/a/g,"</button")
                .replaceAll("<div class=\"additionalSentences\""," <button class=\"showHideButton\" type=\"button\">Pokaż/Ukryj przykłady</button> <div class=\"additionalSentences\""); 
                //eTutorPromotionalLink
                //<footer>
            }
            
            // else{
            //     html = html.substring(html.indexOf("dikiBackgroundBannerPlaceholder\">")+"dikiBackgroundBannerPlaceholder\">".length,html.indexOf("<footer>"))
            //     .replace(/<a/g,"<button class=\"spann\"").replace(/<\/a/g,"</button")
            //     .replaceAll("<div class=\"additionalSentences\""," <button class=\"showHideButton\" type=\"button\">Pokaż/Ukryj przykłady</button> <div class=\"additionalSentences\""); 
            //     //absmiddle flag
            // }
            
            
            content.innerHTML = html;
            // html = html.substring(html.indexOf("dikiBackgroundBannerPlaceholder\">")+"dikiBackgroundBannerPlaceholder\">".length,html.indexOf("<p>powered by&nbsp;&nbsp;"))
            // .replace(/<a/g,"<button class=\"spann\"").replace(/<\/a/g,"</button")
            // .replaceAll("<div class=\"additionalSentences\""," <button class=\"showHideButton\" type=\"button\">Pokaż/Ukryj przykłady</button> <div class=\"additionalSentences\"");
            // content.innerHTML = html;
            setTimeout(function() {
                input.focus();
            }, 500);
            document.querySelectorAll(".spann").forEach( (i) => {
                var temp = i.innerText;
                if(temp=="" || temp.includes("*")){
                 i.style.cursor = "default";
                }else i.onclick = function() {GOSEARCH(temp); };
            })
            document.querySelectorAll(".showHideButton").forEach( (i) => {
                
                 i.onclick = function() {Show_HideExamples(); };
            })
        }).catch(function (err) {
           content.innerHTML = language_src+input.value;
        });
    }
    
    
    themeL.onchange = function(){ console.log("Changed to "+themeL.value); chrome.storage.local.set({ theme: themeL.value })
    SetTheme();};
    lector.onchange = function(){ console.log("Changed to "+lector.value); chrome.storage.local.set({ lector: lector.value })};  
    
    
    GOSEARCH();
    function SetTheme(){
    chrome.storage.local.get("theme", (item) => {
        var link = document.getElementById("link");
        var the = JSON.parse( JSON.stringify(item) ).theme;
        if ( the!=null ){
        console.log("theme from storage: "+the);
           themeL.value = the;
           link.href = the+".css";
        }else{
            chrome.storage.local.set({ theme: "Dark" });
            console.log("NO STORAGE");
            link.href = "Dark.css";
        }
    });
    }
    SetTheme();
    
    function SetLector(){
    chrome.storage.local.get("lector", (item) => {
        var lec = JSON.parse( JSON.stringify(item) ).lector;
        if ( lec!=null ){
           lector.value = lec;
        }else{
            chrome.storage.local.set({ lector: "off" });
            console.log("NO STORAGE");
        }
    });
    }
    SetLector();
    
    function SetLanguage(){
    chrome.storage.local.get("language", (item) => {
        var lan = JSON.parse( JSON.stringify(item) ).language;
        input.focus();
        if ( lan!=null ){
            document.getElementById(  lan  ).click();
        }else
            document.getElementById("angielski").click();
    });
    }
    
    SetLanguage();
    
    document.addEventListener('keydown', (event)=> {
            if(event.keyCode == 13) {
                GOSEARCH();
            }
    });
    
    input.onfocus = ((event)=> {
        input.select();
    });
    
    input.oncontextmenu =  ((event)=>{
        input.value = "";
        event.preventDefault();
    });
    
    //  function GOSEARCH(){
    //     back.src = language_src+input.value;
    // }
    
    function Show_HideExamples(){
        console.log("Show!!");
        var temp = document.querySelectorAll(".additionalSentences");
        temp.forEach(element => {
            console.log(element.style.overflow);
           if (element.style.overflow!="visible")
        {
            element.style.overflow="visible";
            element.style.height="auto";
        }else{
            element.style.overflow="hidden";
            element.style.height="0px"; 
        } 
        });
        
    }
    
    
    document.getElementById("angielski").onclick =  ()=>{
    language_src = "https://www.diki.pl/slownik-angielskiego?q=";
    chrome.storage.local.set({ language: "angielski" });
    GOSEARCH();
    }
    document.getElementById("niemiecki").onclick =  ()=>{
    language_src = "https://www.diki.pl/slownik-niemieckiego?q=";
    chrome.storage.local.set({ language: "niemiecki" });
    GOSEARCH();
    }
    document.getElementById("hiszpanski").onclick =  ()=>{
    language_src = "https://www.diki.pl/slownik-hiszpanskiego?q=";
    chrome.storage.local.set({ language: "hiszpanski" });
    GOSEARCH();
    }
    document.getElementById("francuski").onclick =  ()=>{
    language_src = "https://www.diki.pl/slownik-francuskiego?q=";
    chrome.storage.local.set({ language: "francuski" });
    GOSEARCH();
    }
    document.getElementById("wloski").onclick =  ()=>{
    language_src = "https://www.diki.pl/slownik-wloskiego?q=";
    chrome.storage.local.set({ language: "wloski" });
    GOSEARCH();
    }
    
  
        
}


// "matches":["<all_urls>"],