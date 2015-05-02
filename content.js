var url = window.location.host.split('.');
var current_location = url[url.length -2];
chrome.runtime.sendMessage({host: current_location, href: window.location.href});
