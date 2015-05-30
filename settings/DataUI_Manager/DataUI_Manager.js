var DataUI_Manager= function(){
	this.raw_objects=[];
	this.UIs=[];

};

DataUI_Manager.prototype= {
	constructor: DataUI_Manager,

	createDataUIsFromDB: function(db_name, db_version){
		var instance=this;
		var openRequest = indexedDB.open(db_name, db_version);
		openRequest.onsuccess = function(event){
		    var db = event.target.result;
		    var domains = db.transaction("domains").objectStore("domains");
		    domains.openCursor().onsuccess= function(event){
		    	var cursor= event.target.result;
		    	if(cursor){

		    		instance.raw_objects.push(cursor.value);
		    		cursor.continue();
		    	}
		    	else{
		    		instance.createUIs();
		    	}
		    };
		};
	},

	createUIs: function(){
		for(var i=0; i<this.raw_objects.length; i++){
			this.UIs.push(new dataUI(this.raw_objects[i], this));
		}

		var container= document.getElementById('UI-container');
		for(var i=0; i<this.UIs.length; i++){
			container.appendChild(document.createElement('hr'));
			container.appendChild(this.UIs[i].element);
		}
	},


	get: function(member){
		return this.UIs[this.UIs.indexOf(member)];
	},

	//activate $member and grey out/deactivate all other UIs
	selectUI: function(member){
		this.UIs.forEach(function(element){
			if(element==member){ 
				element.toggle(true);
			}
			else{ 
				element.toggle(false);
				element.gray(); 
			}
		});
	},

	//call this from the UI when their $info property changes to update the DB accordingly
	updateNotice: function(UI){
		console.log('Notice Received');
	}
};

var manager= new DataUI_Manager();
manager.createDataUIsFromDB("Tags",CURRENT_DB_VERSION);