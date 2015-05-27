getAllObjects();

//connect to indexedDB and get all the things. 
function getAllObjects(callback){
	var entries=[];
	var openRequest = indexedDB.open("Tags",CURRENT_DB_VERSION);
    openRequest.onsuccess = function(event){
        var db = event.target.result;
        var objectStore = db.transaction("domains").objectStore("domains");
        objectStore.openCursor().onsuccess= function(event){
        	var cursor= event.target.result;
        	if(cursor){
        		entries.push(cursor.value);
        		cursor.continue();
        	}
        	else{
        		createUIs(entries);
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

var dataUI = function(obj){
	this.instances.push(this);
	this.info= obj;
	this.active= false;

	container= document.createElement('div');
	container.className= "dataUI";

	this.appendTagTitle("Sites: ", container);
	var domains= obj['domain'];
	for(var i=0; i<domains.length; i++){
		this.appendTextInput(domains[i], container);
	} 
	br(container);

	var cols=document.createElement('div');
	cols.id="column-wrapper";
	container.appendChild(cols);

	var titles= this.createColumn(cols);
	var tags= this.createColumn(cols);
	var types= this.createColumn(cols);
	var edit= this.createColumn(cols);
	edit.id="edit-column";
	for(var key in obj){
		if(key=="domain"){continue;}
		this.appendTagTitle(tag_titles[key], titles);    br(titles);
		this.appendTextInput(obj[key][0], tags);         br(tags);
		this.appendTagTypeSelectBox(obj[key][1], types); br(types);
	}

	this.editButton= document.createElement('button');
	this.editButton.appendChild(document.createTextNode('Edit'));
	this.editButton.className='activate';
	edit.appendChild(this.editButton);
	
	clearDiv(titles);
	clearDiv(tags);
	clearDiv(types);
	clearDiv(edit);
	clearDiv(cols);
	clearDiv(container);

	this.dbIndex=obj;
	this.element= container;
	container.object_=this;
};

dataUI.prototype= {
	constructor: dataUI,
	instances:[],

	//appends a column <ul> to $parent_element
    createColumn: function(parent_element){
    	parent_element= parent_element || this.container;

		var col= document.createElement('ul');
		col.className= 'column';
		parent_element.appendChild(col);
		return col;
	},

	//appends a tag-title label styled so that it lines up with text inputs in the other columns
    appendTagTitle: function(text, parent_element){
    	parent_element= parent_element || this.container;

	    var span= document.createElement('label');
	    span.appendChild(document.createTextNode(text));
	    span.className='tag_title'
 	    parent_element.appendChild(span);
 	    return span;
    },

    //appends text input to $parent element with $text as the place holder
    appendTextInput: function(text, parent_element){
    	parent_element= parent_element || this.container;

		var inp=document.createElement('input');
		inp.type='text';
		inp.value=text;
		parent_element.appendChild(inp);
		inp.readOnly=true;
		return inp;
	},

	//appends a tag-type select box to $parent_element with the specifed selected index
	appendTagTypeSelectBox: function(selected_index, parent_element){
		var sel= document.createElement('select');
		parent_element.appendChild(sel);
		sel.className="tag-type-select"
		for(var i=0; i<tag_types.length; i++){
			var opt= document.createElement('option');
			sel.appendChild(opt);
			opt.value=tag_types[i];
			opt.textContent=tag_types[i];
		}
		sel.selectedIndex=selected_index;
		sel.disabled=true;
		return sel;
	},

	//toggles the state of the dataUI-- pass in true to activate, false to deactivate 
	toggle: function(activate){
		var selects= $(this.element).find('select');
		for(var i=0; i<selects.length; i++){ selects[i].disabled= !activate};

		var inputs= $(this.element).find('input');
		for(var i=0; i<inputs.length; i++){ inputs[i].readOnly= !activate};

		this.active=  activate;
	},

	//activates this dataUI and deactivates all other dataUIs
	select: function(){
		for(var i=0; i<this.instances.length; i++){
			this.instances[i].toggle(false);
		}
		this.toggle(true);
	}
};


//calls createDataUI on all the objects passed in.
//adds the divs to the dom
function createUIs(objs){
	var dataUIs=[];
	for(var i=0; i<objs.length; i++){
		dataUIs.push(new dataUI(objs[i]));
	}
	appendDataUIs(dataUIs);
}


//takes a bunch of divs representing the individual dataUIs. 
//wraps them up in one big container div and appends that to document.body 
function appendDataUIs(divs){
	var container= document.getElementById('UI-container');

	for(var i=0; i<divs.length; i++){
		container.appendChild(document.createElement('hr'));
		container.appendChild(divs[i].element);
	}
}

//append $num <br> tags to $parent_element
function br(parent_element, num){
	num= num || 1;
	for(var i=0; i<num; i++){
		parent_element.appendChild(document.createElement('br'));
	}
}

//append a div styled with 'clear:both' to $parent_element.
//this forces $parent_element to extend far enough to encompass all floating elements
function clearDiv(parent_element){
	var cl= document.createElement('div');
	cl.className= 'clear';
	parent_element.appendChild(cl);
}