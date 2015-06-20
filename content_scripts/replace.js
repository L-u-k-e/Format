/* Author: Lucas Parzych
 * replace.js
 *
 * This script listens for messages from the event page and uses the informaion
 * contained in the message to perform text substitution on the active element. 
 *
 * Incoming messages should be in the form: {href: 'http[s]://www.example.com',
 *                                           frame: undefined OR 'https://...',
 *                                           text: '..replacement text..' }
 *
 * The script first checks to see if it is in the correct frame by checking its
 * location against message.frame. (A copy of this script should be running in 
 * every frame)
 *
 * If it is determined that the script is in the correct frame, then it performs 
 * the substitution.
*/


chrome.runtime.onMessage.addListener(handleRequest);
function handleRequest(message){ 
    if(correct_frame(message)){
        replaceSelectedText(message);
    }
}

function correct_frame(message){
    var correct_frame = false;
    if((window.location.href == message.frame) || (window.location.href == message.href && !message.frame)){
        correct_frame=true;
    }
    return correct_frame;
}

function replaceSelectedText(message) {
    var newText = message.text;
    var frameUrl = message.frame;

    var frames = window.frames;
    var e = document.activeElement;

    var eType = e.nodeName.toUpperCase();
    if(eType == 'TEXTAREA' || eType == 'INPUT'){
        var start = e.selectionStart;
        var end = e.selectionEnd;
        e.value = e.value.slice(0, start) + newText + e.value.substr(end);
    
        // Set cursor after selected text
        e.selectionStart = start + newText.length;
        e.selectionEnd = e.selectionStart;  
    } 
    else if (e.isContentEditable){
        var newNode = document.createTextNode(newText);
        var sel = window.getSelection();
        
        // Remove previous selection, if any.
        sel.deleteFromDocument();
        
        // If there is no range in the selection, add a new one, with the
        // caret set to the end of the input element to avoid the next error:
        //"Failed to execute 'getRangeAt' on 'Selection': 0 is not a valid index."
        if (sel.rangeCount === 0){
            sel.addRange(document.createRange().createRangeAtSelection(document.getSelection(0)));
            sel.getRangeAt(0).collapse(elem, 1);
        }
        
        // Insert new text
        var range = sel.getRangeAt(0);
        range.insertNode(newNode);
        
        // Set the cursor to the end of the text node
        sel.collapse(newNode, 1);
    }
}
