var content = document.querySelector('#content');
var new_data = [];




var request_recieved=false;
chrome.runtime.onMessage.addListener(function(message){
	if(message.type != 'update' || request_recieved){return;}
	request_recieved=true;

	createHeader(message.update_type);
	displayObjectStoreContents();

	return true;
});









function createHeader(update_type){
	var html;
	if(update_type == "upgrade"){
		html = '<span class="xx-large"> Format: </span>'+
			'<span class="xx-large blink">Update!</span>'+
			'<br><br><br><br>'+
			'<span class="x-large"> Format has expanded its database! </span>'+
			'<br>' +
			'<span>The update process has already completed. You don\'t have to do anything. </span>' +
			'<br><span>Feel free to close this tab. </span>' +
			'<br><br><br>'+
			'<span class="large"> This is what the new database looks like:</span>'+
			'<br><br><br>';
	}
	else if(update_type == "fresh_install"){
		html = '<span class="xx-large"> Format: </span>'+
			'<span class="xx-large blink">Welcome!</span>'+
			'<br><br><br><br>'+
			'<span class="x-large"> The install is complete, feel free to close this tab. </span>' +
			'<br><br><br><br>'+
			'<span class="large">Whenever you visit a site that\'s registered in our database,</span>' + '<br>' +
			'<span class="large">options for the available markdown/HTML tags will populate the</span>' + '<br>' +
			'<span class="large">Format sub-menu found in your context menu options. </span>' + '<br>' +
			'<br><br><br>'+
			'<span class="large"> This is the official database:</span>'+
			'<br><br><br>';
	}
	content.innerHTML += html;
}










function displayObjectStoreContents(){
	var objects = [];
	var db_open_request = indexedDB.open(DB_NAME,CURRENT_DB_VERSION);
  db_open_request.onsuccess = function(event){
  	var db = event.target.result;
    var object_store = db.transaction(OBJECT_STORE_NAME).objectStore(OBJECT_STORE_NAME);
    var cursor_request = object_store.openCursor();
    cursor_request.onsuccess = function(event){
    	var cursor = event.target.result;
    	if(cursor){ 
    		objects.push(cursor.value); 
    		cursor.continue();
    	}
    	else{
    		objects.forEach(function(object){ 
    			content.appendChild(new ObjectDisplay(object)); 
    		});
			}
    };
  };    
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