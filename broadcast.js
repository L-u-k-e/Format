var last_known_location;
function broadcast(){
	if(window.location.href != last_known_location){
		last_known_location= window.location.href;
		var url = window.location.host.split('.');
		var current_location = url[url.length - 2]; 
		chrome.runtime.sendMessage({host: current_location, href: window.location.href});
	}
}

setInterval(broadcast,1000);
