const db_name="Tags";


var request = window.indexedDB.open(db_name, 1);
var tags  = [
    //codes: 0 - markdown wrap tag
    //       1 - HTML wrap tag 
    //       2 - single tag
    { domain: ["youtube"], 

      bold:["*",0],
      strikethrough:["-",0],
      italic:["_",0] 
    },


    { domain: ["stackoverflow","stackexchange","superuser","askubuntu","serverfault"], 

      bold:["<strong>",1], 
      italic:["<em>",1],
      strikethrough:["<del>",1],
      superscript:["<sup>",1],
      subscript:["<sub>",1],
      heading1:["<h1>",1],
      heading2:["<h2>",1],
      heading3:["<h3>",1],
      blockquote:["<blockquote>",1],
      code:["<code>",1],
      newline:["<br>",2],
      horizontal:["<hr>",2]
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
