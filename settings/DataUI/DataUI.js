var dataUI = function(obj, manager){
	this.manager=manager;
	this.active= false;

	container= document.createElement('div');
	container.className= "dataUI";

	this.appendTagTitle("Sites: ", container);
	var domains= obj['domain'];
	for(var i=0; i<domains.length; i++){
		this.appendTextInput(domains[i], container);
	} 
	this.domains=domains;
	br(container);

	var cols=document.createElement('div');
	cols.id="column-wrapper";
	container.appendChild(cols);

	this.titles= this.createColumn(cols);
	this.tags= this.createColumn(cols);
	this.types= this.createColumn(cols);
	var edit= this.createColumn(cols);
	edit.id="edit-column";
	for(var key in obj){
		if(key=="domain"){continue;}
		this.appendTagTitle(tag_titles[key], this.titles);    br(this.titles);
		this.appendTextInput(obj[key][0], this.tags);         br(this.tags);
		this.appendTagTypeSelectBox(obj[key][1], this.types); br(this.types);
	}

	this.editButton= document.createElement('button');
	this.editButtonText=document.createTextNode('Edit');
	this.editButton.appendChild(this.editButtonText);
	this.editButton.className='activate';
	edit.appendChild(this.editButton);
	
	clearDiv(this.titles);
	clearDiv(this.tags);
	clearDiv(this.types);
	clearDiv(edit);
	clearDiv(cols);
	clearDiv(container);

	this.db_object=obj;
	this.element= container;
	container.object_=this;
};

dataUI.prototype= {
	constructor: dataUI,

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

		if(activate){
			this.editButtonText.nodeValue='Save';
			this.editButton.className+=' save';
		}
		else{
			this.editButtonText.nodeValue='Edit';
			this.editButton.className=this.editButton.className.replace(/ .*/,'');
		}

		this.active=  activate;
	},

	gray: function(){
		this.gray_div=document.createElement('div');
		this.gray_div.className='gray-div';
		this.element.appendChild(this.gray_div);
	},

	unGray: function(){
		if(this.gray_div){
			this.element.removeChild(this.gray_div);
		}
	},

	save: function(){
		var titles= $(this.titles).children('label');
		var tags= $(this.tags).children('input');
		var types= $(this.types).children('select');
		for(var i=0; i<tags.length; i++){
			this.db_object[inverted_tag_titles[titles[i].textContent]]= [tags[i].value, types[i].selectedIndex];
		}
		this.manager.updateNotice(this);
	}


};

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
