const DB_NAME = "Tags";
const CURRENT_DB_VERSION = 1;
const OBJECT_STORE_NAME = "domains";


var tag_titles = {

    "bold"          :   "Boldify",
    "italic"        :   "Italicize",
    "underline"     :   "Underline",
    "strikethrough" :   "Strikethrough",
    "quote"         :   "Quote",
    "blockquote"    :   "Blockquote",
    "code"          :   "Code",
    "newline"       :   "Line Break",
    "horizontal"    :   "Horizontal Line",
    "superscript"   :   "Super-Script",
    "subscript"     :   "Sub-Script",
    "heading1"      :   "Heading 1",
    "heading2"      :   "Heading 2",
    "heading3"      :   "Heading 3",
    "heading4"      :   "Heading 4",
    "heading5"      :   "Heading 5",
    "heading6"      :   "Heading 6"
    
};

var tag_types = [
	"Markdown -- wrap selected text",
  "HTML -- wrap selected text", 
  "HTML/Markdown -- overwrite selected text",
  "HTML/Markdown -- prefix selected text"
];


var invert = function (obj) {
  var new_obj = {};
  for (var prop in obj) {
    if(obj.hasOwnProperty(prop)) {
      new_obj[obj[prop]] = prop;
    }
  }
  return new_obj;
};

var inverted_tag_titles = invert(tag_titles);