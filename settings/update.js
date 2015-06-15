var content = document.querySelector('#content');
var new_data = [];

var request_recieved=false;
chrome.runtime.onMessage.addListener(function(message){
	if(message.type != 'upgrade request' || request_recieved){return;}
	request_recieved=true;
	new_data = message.new_data;
	chooseUpdateType();
	return true;
});

function chooseUpdateType(){
	//open the database and collect the objects while also scanning for objects marked as custom.
	var custom_entries=[];
	var old_data=[]; 
	var open = window.indexedDB.open(DB_NAME, CURRENT_DB_VERSION);
	open.onsuccess = function(event){
		var db = event.target.result;
		var cursor_request = db.transaction(OBJECT_STORE_NAME, 'readonly').objectStore(OBJECT_STORE_NAME).openCursor();
	  cursor_request.onsuccess = function(event){
	  	var cursor = event.target.result;
	  	if(cursor){
	  		old_data.push(cursor.value);
	  		if(cursor.value.custom){
	  			custom_entires.push(cursor.value);
	  		}
	  		cursor.continue();
	  	}
	  	else{
	  		if(custom_entries.length){customUpdate();}
	  		else{standardUpdate();}
	  	}
	  }
	}
}

function standardUpdate(){
	var html = '<span class="xx-large"> Format: </span>'+
		'<span class="xx-large blink">Update!</span>'+
		'<br><br><br><br>'+
		'<span class="x-large"> Format has expanded its database! </span>'+
		'<br>' +
		'<span>The update process has already started. You don\'t have to do anything. </span>' +
		'<br><span>Feel free to close this tab. </span>' +
		'<br><br><br>'+
		'<span class="large"> This is what the new database looks like:</span>'+
		'<br><br><br>';
	content.innerHTML += html;
	displayNewData();
}

function displayNewData(){
	for(var i=0; i<new_data.length; i++){
		content.appendChild(new ObjectDisplay(new_data[i]));
	}
}

function customUpdate(){
	var html =	'<span class="xx-large"> Format: </span>' +
		'<span class="xx-large blink">Update Available!</span>' +
		'<br><br><br><br>' +
		'<span class="x-large"> Format has expanded its database, but you have customized' +
		'some items that the update manager would like to overwrite.' +
		'<br><br>' +
		'Please select the items that you would like to overwrite:</span>' +
		'<br><br><br><br>' +
		'<input class="quick-select" type="checkbox" value="overwrite">' +
		'<span class="large">Overwrite all</span>' +
		'<input class="quick-select"type="checkbox" value="no-overwrite">' +
		'<span class="large">Overwrite none</span><br>' +
		'<br>';
	content.innerHTML += html;
}




function ObjectDisplay(obj){
	this.obj = obj;
	this.element = document.createElement('div');
	this.element.className = 'object-display';
	this.element.object_ = this;

	this.domains = document.createElement('div');
	this.domains.className = 'domain-list';
	this.element.appendChild(this.domains);
	this.domains.appendChild(this.generateDomainList());

	this.element.appendChild(this.generateTagTable());

	return this.element;
}

ObjectDisplay.prototype.generateTagTitle = function(title){
	var span = document.createElement('span');
	span.textContent = title;
	span.className = 'tag-title'
	return span;
};

ObjectDisplay.prototype.generateDomainList = function(){
	var domain_list = document.createElement('span');
	domain_list.textContent = this.obj.domain.join(', ');
	return domain_list;
};

ObjectDisplay.prototype.generateSingleTagRow = function(key){
	var row = document.createElement('tr');
	
	var title = document.createElement('td');
	row.appendChild(title);
	title.appendChild(this.generateTagTitle(tag_titles[key]+': '));

	var tag = document.createElement('td');
	row.appendChild(tag);
	var tag_contents = document.createElement('span');
	tag.appendChild(tag_contents);
	tag_contents.textContent = this.obj[key][0];

	var tag_type = document.createElement('td');
	row.appendChild(tag_type);
	var tag_type_contents = document.createElement('span');
	tag_type.appendChild(tag_type_contents);
	tag_type_contents.textContent = tag_types[this.obj[key][1]];

	return row;
};

ObjectDisplay.prototype.generateTagTable = function(){
	var table=document.createElement('table');
	var tbody=document.createElement('tbody');
	table.appendChild(tbody);
	for(var key in this.obj){
		if(['domain', 'id'].indexOf(key)>=0){continue;}
		tbody.appendChild(this.generateSingleTagRow(key));
	}
	return table;
};