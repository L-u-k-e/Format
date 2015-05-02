var available_commands;
var hrefTop;
var tag_titles= {

    "bold"          :   "Boldify",
    "italic"        :   "Italicize",
    "underline"     :   "Underline",
    "strikethrough" :   "Strikethrough",
    "blockquote"    :   "Block Quote",
    "code"          :   "Code",
    "newline"       :   "Line Break",
    "horizontal"    :   "Horizontal Line",
    "superscript"   :   "Super-Script",
    "subscript"     :   "Sub-Script",
    "heading1"      :   "Heading 1",
    "heading2"      :   "Heading 2",
    "heading3"      :   "Heading 3",
    
};




chrome.runtime.onInstalled.addListener(initDB);

chrome.runtime.onMessage.addListener(queryURL);

chrome.contextMenus.onClicked.addListener(requestHandler);

chrome.tabs.onActivated.addListener(tabAdjustment);



function requestHandler(info, tab)
{  
    var text = (info.selectionText == undefined) ? " " : info.selectionText;
    var choice = info.menuItemId; 
    
    var command = available_commands[choice];
    var mode=command[1];
    var new_text;
    if(mode==0)
    {
        new_text= command[0] + text + command[0];
    }
    else if (mode==1)
    {
        var close_tag = command[0].replace("<","</");
        new_text = command[0] + text + close_tag;
    }
    else
    {
        new_text = command[0];
    }
    console.log(info.frameUrl);
    var result = {text:new_text, frame:info.frameUrl, href:hrefTop};
    sendToFront(tab.id, result);
}

function sendToFront(tab, message)
{ 
    chrome.tabs.sendMessage(tab, message); 
}

function initDB(reason, previousVersion)
{  
    var head= document.getElementsByTagName('head')[0];
    var script= document.createElement('script');
    script.type= 'text/javascript';
    script.src= 'initDB.js';
    head.appendChild(script);
}

function tabAdjustment(activeInfo)
{
    chrome.tabs.get(activeInfo.tabId,function(tab){
        var a =tab.url.split("://");
        var b =a[a.length-1].split("/")[0].split(".");
        var queryStr = b[b.length-2];
        if(queryStr !=undefined)
        {
            queryURL({host:queryStr});
        }
    }
    );
}

function queryURL(message, sender)
{
    chrome.contextMenus.removeAll();
    hrefTop=message.href;

    var openRequest = indexedDB.open("Tags",1);
    openRequest.onsuccess = function(event){
        var queryURL = message.host;
        var db = event.target.result;
        var objectStore = db.transaction("domains").objectStore("domains");
        var query = objectStore.index("domain").get(queryURL)
        query.onsuccess = function(event){
            if(query.result != undefined)
            {
                delete query.result["domain"];
                createMenuItems(query.result);
                available_commands=query.result; 
            }
        };

        db.onerror = function(event){
            console.log("an error bubbled up during a transaction.");
        };
    };
    openRequest.onerror = function(event){
        console.log("error opening DB");
    };
}

function createMenuItems(tags)
{
    for(var command in tags)
    {
        chrome.contextMenus.create({
            "title":tag_titles[command],
            "contexts":["editable"],
            "id":command
        });
    }
}
