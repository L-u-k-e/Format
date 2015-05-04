chrome.runtime.onMessage.addListener(handleRequest);

function handleRequest(message)
{ 
    if(correct_frame(message))
    {
        replaceSelectedText(message);
    }
}

function correct_frame(message)
{
    console.log(window.location.href);
    console.log(message.href);
    var correct_frame=false;
    if((window.location.href == message.frame) || (window.location.href==message.href && message.frame==undefined))
    {
        correct_frame=true;
        console.log("Frame found");
    }
    return correct_frame;
}

function replaceSelectedText(message) 
{
    console.log("replacing");
    var newText=message.text;
    var frameUrl=message.frame;

    var frames=window.frames;
    var e=document.activeElement;
    
    var eType=e.nodeName;
    if(eType=='TEXTAREA' || eType=='INPUT')
    {
        var start = e.selectionStart;
        var end = e.selectionEnd;
        e.value = e.value.slice(0, start) + newText + e.value.substr(end);
    
        // Set cursor after selected text
        e.selectionStart = start + newText.length;
        e.selectionEnd = e.selectionStart;  
    }
 
    else if (e.isContentEditable)
    {
        var newNode = document.createTextNode(newText);
        var sel = window.getSelection();
        
        // Remove previous selection, if any.
        sel.deleteFromDocument();
        
        // If there is no range in the selection, add a new one, with the
        // caret set to the end of the input element to avoid the next error:
        //"Failed to execute 'getRangeAt' on 'Selection': 0 is not a valid index."
        if (sel.rangeCount === 0) 
        {
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
