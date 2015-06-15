/* Author: Lucas Parzych
 * Email:  lukeepar@gmail.com
 * broadcast.js
 *
 * This script runs in the top frame of every page that is loaded.
 * 
 * The script broadcasts the URL information to the event page (background.js)
 * It checks in set intervals to see if the current location has changed within
 * the current page. This is possible on pages with iframes, like youtube, for 
 * example. 
*/
var last_known_location;
function broadcast(){
	if(window.location.href != last_known_location){
		last_known_location = window.location.href;
		var url = window.location.host.split('.');
		var current_location = url[url.length - 2]; 
		chrome.runtime.sendMessage({type: 'broadcast', host: current_location, href: window.location.href});
	}
}

setInterval(broadcast,1000);
