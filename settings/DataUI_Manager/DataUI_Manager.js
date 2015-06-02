var DataUI_Manager= function(db_name, db_version){
	this.db_name= db_name;
	this.db_version= db_version;
	this.raw_objects=[];
	this.UIs=[];
};

DataUI_Manager.prototype= {
	constructor: DataUI_Manager,

	createDataUIsFromDB: function(){
		var instance=this;
		var openRequest = indexedDB.open(this.db_name, this.db_version);
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

	updateNotice: function(UI){
		var edit_approved=true;
		//search for domain duplicates
		this.UIs.forEach(function(UI){
			if(UI.active){return;}
			//...
		});	

		if(edit_approved){
			//update the database
			var manager= this;
			var DBOpenRequest= window.indexedDB.open(this.db_name, this.db_version);
			DBOpenRequest.onsuccess= function(event){
				var db= event.target.result;
				var domains=db.transaction('domains', 'readwrite').objectStore('domains');
				console.log(UI.db_object);
				var overwrite= domains.put(UI.db_object);
				overwrite.onsuccess= function(event){
					manager.UIs.forEach(function(UI){
						if(UI.active){UI.toggle(false);}
						else{UI.unGray();}
					});
				};
			};
		}
	},
};

var manager= new DataUI_Manager("Tags", CURRENT_DB_VERSION);
manager.createDataUIsFromDB();