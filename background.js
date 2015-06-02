var available_commands;
var hrefTop="something";




chrome.runtime.onInstalled.addListener(initDB);

chrome.runtime.onMessage.addListener(queryURL);

chrome.contextMenus.onClicked.addListener(requestHandler);

chrome.tabs.onActivated.addListener(tabAdjustment);



function requestHandler(info, tab)
{  
    var choice= info.menuItemId;
   /* if(choice.split('--')[0]=='constant'){
        chrome.tabs.create({'url': "/settings.html" } );
    }*/
    //else{
        var text = (info.selectionText == undefined) ? " " : info.selectionText;
        var command = available_commands[choice];
        var mode=command[1];
        var new_text;
        if(mode==0)
        {
            new_text= command[0] + text + command[0];
        }
        else if(mode==1)
        {
            var close_tag = command[0].replace("<","</");
            new_text = command[0] + text + close_tag;
        }
        else if(mode==2)
        {
            new_text = command[0];
        }
        else if(mode==3)
        {
            new_text = command[0] + text;
        }
        var result = {text:new_text, frame:info.frameUrl, href:hrefTop};
        sendToFront(tab.id, result);
    //}
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
            queryURL({host:queryStr, href: tab.url});
        }
    }
    );
}

function queryURL(message, sender)
{
    chrome.contextMenus.removeAll();
   // createConstantMenuItems();
    
    hrefTop=message.href;

    var openRequest = indexedDB.open("Tags",CURRENT_DB_VERSION);
    openRequest.onsuccess = function(event){
        var queryURL= message.host;
        var db= event.target.result;
        var object_store= db.transaction("domains").objectStore("domains");
        var query= object_store.index("domain").get(queryURL);    
        query.onsuccess = function(event){
            if(query.result != undefined){
                delete query.result["domain"];
                createMenuItems(query.result);
                available_commands= query.result; 
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
    //add available markdown formatting tags
    for(var command in tags)
    {
        chrome.contextMenus.create({
            "title":tag_titles[command],
            "contexts":["editable"],
            "id":command
        });
    }
}


function createConstantMenuItems(){
    chrome.contextMenus.create({
        "title":"Settings",
        "contexts":["all"],
        "id":"constant--settings"
    });
}
