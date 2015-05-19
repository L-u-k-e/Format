const db_name="Tags";


var request = window.indexedDB.open(db_name, CURRENT_DB_VERSION);
var tags  = [
    //codes: 0 - markdown wrap tag
    //       1 - HTML wrap tag 
    //       2 - single tag, overwrite
    //       3 - single tag, prefix
    { domain: ["youtube"], 

      bold          : ["*",0],
      strikethrough : ["-",0],
      italic        : ["_",0] 
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

    { domain: ["reddit"],

      bold          : ["**",0],
      italic        : ["*",0],
      strikethrough : ["~~",0],
      code          : ["`",0],
      superscript   : ["^",3],
      quote         : [">",3]
    }
];


request.onerror = function(event) {
  alert("Error opening the database");
};

request.onupgradeneeded = function(event) {
   var db = event.target.result;
   var objectStore = db.createObjectStore("domains", {autoIncrement: true });
   objectStore.createIndex("domain", "domain", { unique: true, multiEntry: true });
   for(var i in tags)
   {
       objectStore.add(tags[i]);
       console.log("added " + tags[i]["domain"] + " to the DB");
   }
};
