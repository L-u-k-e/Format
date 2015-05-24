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



//calls createDataUI on all the objects passed in.
//adds the divs to the dom
function createUIs(objs){
	var dataUIs=[];
	for(var i=0; i<objs.length; i++){
		dataUIs.push(createDataUI(objs[i]));
	}
	appendDataUIs(dataUIs);
}

//creates a UI (wrapped in a div) for an entry in the DB
//returns the div wrapper, ready to be added to the DOM
function createDataUI(obj){
	var container= document.createElement('div');
	container.className= "dataUI";

	appendSpan(container, "Sites: ");

	var domains= obj['domain'];
	for(var i=0; i<domains.length; i++){
		var domain_input= document.createElement('input');
		domain_input.type= 'text';
		domain_input.readOnly= true;
		domain_input.value=domains[i];
		container.appendChild(domain_input);
	}

	container.appendChild(document.createElement('br'));
	var titles= createColumn(container);
	var tags= createColumn(container);
	var types= createColumn(container);
	for(var key in obj){
		if(key=="domain"){continue;}
		appendSpan(titles, tag_titles[key]);
		titles.appendChild(document.createElement('br'));
		appendReadonlyTextInput(tags, obj[key][0]);
		tags.appendChild(document.createElement('br'));
		createTagTypeSelect(types, obj[key][1]);
		types.appendChild(document.createElement('br'));
	}
	clearDiv(container);
	return container;
}

//takes a bunch of divs representing the individual dataUIs. 
//wraps them up in one big container div and appends that to document.body 
function appendDataUIs(divs){
	var container= document.getElementById('UI-container');

	for(var i=0; i<divs.length; i++){
		container.appendChild(document.createElement('hr'));
		container.appendChild(divs[i]);
	}
}

//create a span containing the provided text and append it to the provided element. 
function appendSpan(parent_element, text){
	var span= document.createElement('label');
	span.appendChild(document.createTextNode(text));
	span.className='tag_title'
 	parent_element.appendChild(span);
 	return span;
}

function appendReadonlyTextInput(parent_element, text){
	var inp=document.createElement('input');
	inp.type='text';
	inp.readonly=true;
	inp.value=text;
	parent_element.appendChild(inp);
	return inp;
}

function createColumn(parent_element){
	var col= document.createElement('ul');
	col.className= 'column';
	parent_element.appendChild(col);
	return col;
}

function clearDiv(parent_element){
	var cl= document.createElement('div');
	cl.className= 'clear';
	parent_element.appendChild(cl);
}

function createTagTypeSelect(parent_element, selected_index){
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
	//sel.disabled=true;

}