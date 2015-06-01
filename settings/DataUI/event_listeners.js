$(document).ready(function(){

	$('#UI-container').on('click', 'input', function(event){ //on('hover', '.dataUI, .dataUI input', function(event){
		var UIcontainer= $(event.target).parents('.dataUI')[0];
		if(!UIcontainer.object_.active){
			UIcontainer.object_.editButton.focus();
		}
	});

	$('#UI-container').on('click', '.activate:not(.save)', function(event){
		var UIcontainer= $(event.target).parents('.dataUI')[0];
		var UI= UIcontainer.object_;
		UI.manager.selectUI(UI);
	});

	$('#UI-container').on('click', '.save', function(event){
		var UI=$(event.target).parents('.dataUI')[0].object_;
		UI.save();
	});
});