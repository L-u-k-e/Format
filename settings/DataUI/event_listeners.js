$(document).ready(function(){

	$('#UI-container').on('click', 'input', function(event){ //on('hover', '.dataUI, .dataUI input', function(event){
		var UIcontainer= $(event.target).parents('.dataUI')[0];
		if(!UIcontainer.object_.active){
			UIcontainer.object_.editButton.focus();
		}
	});

	$('#UI-container').on('click', '.activate', function(event){
		var UIcontainer= $(event.target).parents('.dataUI')[0];
		var UI= UIcontainer.object_;
		console.log(UI);
		UI.manager.selectUI(UI);
	})

});