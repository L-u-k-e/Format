/* Author: Lucas Parzych
 * Email:  FoxMcCloud@gmail.com
 * background.js
 *
 * This is an event page that listens for messages from broadcast.js
 * (a content script). 
 * Messages should be sent when the URL of the current window changes.  
 *
 * Incoming messages should be in the form {host: 'example', 
 *                                          href: 'https://www.example.com'}
 *
 * This script then queries the DB for the given host. If a defined result is 
 * returned, it uses the result to create context menu items and listens for 
 * click events on them. 
 *
 * When a context menu item is clicked, the appropriate string is crafted here 
 * and then sent to replace.js (a content script) to do the actual text 
 * substitution. 
*/



chrome.runtime.onInstalled.addListener(initDB);
function initDB(reason, previousVersion){  
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'initDB.js';
    head.appendChild(script);
}







var available_commands; 
var hrefTop;

chrome.runtime.onMessage.addListener(queryURL);
function queryURL(message, sender){
     if(message.type!='broadcast'){return;}
        chrome.contextMenus.removeAll(function(){ 
        hrefTop = message.href;
        var openRequest = indexedDB.open("Tags",CURRENT_DB_VERSION);
        openRequest.onsuccess = function(event){
            var queryURL = message.host;
            var db = event.target.result;
            var object_store = db.transaction("domains").objectStore("domains");
            var query = object_store.index("domain").get(queryURL);    
            query.onsuccess = function(event){
                if(query.result){
                    delete query.result.domain;
                    delete query.result.id;
                    createMenuItems(query.result);
                    available_commands = query.result; 
                }
            };
            db.onerror = function(event){
                console.log("an error bubbled up during a transaction.");
            };
        };
        openRequest.onerror = function(event){
            console.log("error opening DB");
        };
    });
}

function createMenuItems(tags){
    for(var command in tags){
        chrome.contextMenus.create({
            "title":tag_titles[command],
            "contexts":["editable"],
            "id":command
        });
    }
}

// Listen for tab changes and query URL 
//    If the tab is changed, but the user is just switching to an already 
//    loaded tab, then broadcast.js won't know to send a message because,
//    from its prespective, window.location never changed.  
chrome.tabs.onActivated.addListener(tabAdjust);
function tabAdjust(activeInfo){
    chrome.tabs.get(activeInfo.tabId, function(tab){
        var a = tab.url.split("://");
        var b = a[a.length-1].split("/")[0].split(".");
        var queryStr = b[b.length-2];
        if(queryStr){ queryURL({host:queryStr, href: tab.url}); }
    });
}







chrome.contextMenus.onClicked.addListener(requestHandler);
function requestHandler(info, tab){  
    var text = info.selectionText || ' ';
    var choice = info.menuItemId;
    var command = available_commands[choice];
    var mode = command[1];
    var new_text;
    switch(mode){
    case(0):
        new_text= command[0] + text + command[0];
        break;
    case(1):
        var close_tag = command[0].replace("<","</");
        new_text = command[0] + text + close_tag;
        break;
    case(2):
        new_text = command[0];
        break;
    case(3):
        new_text = command[0] + text;
        break;
    }
    var result = {text:new_text, frame:info.frameUrl, href:hrefTop};
    sendToFront(tab.id, result);
}

function sendToFront(tab, message){ 
    chrome.tabs.sendMessage(tab, message); 
}
