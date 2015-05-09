var url = window.location.host.split('.');
var current_location = url[url.length -2];
console.log("From content.js " + window.location.href);
chrome.runtime.sendMessage({host: current_location, href: window.location.href});
