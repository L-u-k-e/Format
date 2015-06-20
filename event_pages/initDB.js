var os_data = [
    //codes: 0 - markdown wrap tag
    //       1 - HTML wrap tag 
    //       2 - single tag, overwrite
    //       3 - single tag, prefix
    { domain: ["youtube"], 

      bold          : ["*",0],
      strikethrough : ["-",0],
      italic        : ["_",0] 
    },

    { domain:["github"],

      bold          : ["**", 0],
      italic        : ["*",0],
      strikethrough : ["~~",0],
      quote         : [">",3],
      code          : ["`",0],
      heading1      : ["#",3],
      heading2      : ["##",3],
      heading3      : ["###",3],
      heading4      : ["####",3],
      heading5      : ["#####",3],
      heading6      : ["######",3]
    },

    { domain: ["stackexchange",
               "stackoverflow",
               "superuser",
               "askubuntu",
               "serverfault"], 

      bold          : ["<strong>",1], 
      italic        : ["<em>",1],
      strikethrough : ["<del>",1],
      superscript   : ["<sup>",1],
      subscript     : ["<sub>",1],
      heading1      : ["<h1>",1],
      heading2      : ["<h2>",1],
      heading3      : ["<h3>",1],
      blockquote    : ["<blockquote>",1],
      code          : ["<code>",1],
      newline       : ["<br>",2],
      horizontal    : ["<hr>",2]
    },

    { domain: ["twitch"],

      bold          : ["**", 0],
      italic        : ["*", 0],
      strikethrough : ["~~", 0],
      superscript   : ["^", 3],
      heading1      : ["#",3],
      heading2      : ["##",3],
      heading3      : ["###",3],
      horizontal    : ["*****",2]
    },

    { domain: ["reddit"],

      bold          : ["**",0],
      italic        : ["*",0],
      strikethrough : ["~~",0],
      code          : ["`",0],
      superscript   : ["^",3],
      quote         : [">",3]
    }
];








var request = window.indexedDB.open(DB_NAME, CURRENT_DB_VERSION);

request.onerror = function(event) {
  alert("Error opening the database");
};

request.onupgradeneeded = function(event){
  var db = event.target.result;

  if(event.oldVersion){ db.deleteObjectStore(OBJECT_STORE_NAME); }

  var objectStore = db.createObjectStore(OBJECT_STORE_NAME, {keyPath: "id", autoIncrement: true});
  objectStore.createIndex("domain", "domain", {multiEntry: true });
  for(var i=0; i<os_data.length; i++){
    objectStore.add(os_data[i]);
    
    console.log("Added " + os_data[i]["domain"] + " to the IDBObjectStore " + 
    OBJECT_STORE_NAME + " in the IDBDatabase "+ DB_NAME +" (Format)");
  }

  generateUpdateNotification(event.oldVersion);
};



function generateUpdateNotification(upgrade){
  var message = {type: 'update'};
  if(upgrade){ message.update_type = "upgrade"; } 
  else { message.update_type = "fresh_install"; }

  chrome.tabs.create({url: '/update/update.html'}, function(tab){   
    var update_request = setInterval(function(){ 
      chrome.tabs.sendMessage(tab.id, message, {}, function(response){
        clearInterval(update_request); 
      });
    }, 300);    
  });
}
