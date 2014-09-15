// Testing suite for website wide A/B tests configured via a json file
// Matthias Gattermeier, last edits: Sept 11, 2014
// Dependency: jQuery

/*Developernotes:

> Eventually page validation conditionals should be AND not OR, via an array.
> json config should be created & edited via a form driven backend (node, angular)

*/


/*
VALID PAGE CONDTIONS (IDENTIFIER TYPES)

all - always execute (don't do a rewrite action here ;)
param - validate for a destinct parameter in the URL 
seq - validate for a sequence in the URL
seq-param - validate for a sequence AND a destinct parameter in the URL 
tag - look for a tag with a specific
elementclass - look for any DOM element with a specific class
elementid - look for any DOM element with a specific ID
bodyclass - look for a specific class in the body tag
seq-id - validate for a sequence in the URL & look for any DOM element with a specific ID
*/


/*
VALID ACTION TYPES

redirect - Redirect to a different page
rewrite - Rewite a link to a different link,  for element(s) identified by class or ID. 
prepend - Prepend an element with content, for element(s) identified by class or ID. 
toggleClass - toggle between two classes, for element(s) identified by class or ID. 
removeClass - remove a Class from element, for element(s) identified by class or ID. 
addClass - add a Class to element, for element(s) identified by class or ID.

*/



// GENERAL HELPER FUNCTIONS

function print(output) {
      console.log(output);  
}

function empty(str) {
        if(!!str){
               return true;
        }
}

function random() {
        if (Math.floor(Math.random()*2) == 1) { return true } else { return false }
}



// ACTIONS TO EXECUTE A/B FOR

function redirect(json) {
        if (random() == true) {
                print(true + " redirect to url.. ");
                window.location.replace(json.action.url);
        }
        return false;
}

function rewrite(json) {
        if (random() == true) {
                switch(json.action.element.type) {
                                case "id":
                                        document.getElementById(json.action.element.value).href = json.action.url;
                                        break;
                                case "class":
                                        document.getElementsByClassName(json.action.element.value).href = json.action.url;
                                        break;
                                default:
                                        break;
                        }
        }
        return false;
}

function prepend(json) {
        if (random() == true) {
                switch(json.action.element.type) {
                        case "id":
                                jQuery('#'+json.action.element.value).prepend(json.action.value);
                                break;
                        case "class":
                                jQuery('.'+json.action.element.value).prepend(json.action.value);
                                break;
                        default:
                                break;
                }
        }
        return false;
}

function append(json) {
        if (random() == true) {
                switch(json.action.element.type) {
                        case "id":
                                jQuery('#'+json.action.element.value).append(json.action.value);
                                break;
                        case "class":
                                jQuery('.'+json.action.element.value).append(json.action.value);
                                break;
                        default:
                                break;
                }
        }
        return false;
}

function addClass(json) {
        if (random() == true) {
                switch(json.action.element.type) {
                        case "id":
                                jQuery('#'+json.action.element.value).addClass(json.action.value);
                                break;
                        case "class":
                                jQuery('.'+json.action.element.value).addClass(json.action.value);
                                break;
                        default:
                                break;
                }
        }
        return false;
}

function removeClass(json) {
        if (random() == true) {
                switch(json.action.element.type) {
                        case "id":
                                jQuery('#'+json.action.element.value).removeClass(json.action.value);
                                break;
                        case "class":
                                jQuery('.'+json.action.element.value).removeClass(json.action.value);
                                break;
                        default:
                                break;
                }
        }
        return false;
}


function identifyAction(json) {
        switch(json.action.type) {
                        case "redirect":
                                redirect(json);
                                break;
                        case "rewrite":
                                rewrite(json);
                                break;
                        case "prepend":
                                prepend(json);
                                break;
                        case "append":
                                append(json);
                                break;
                        case "addClass":
                                addClass(json);
                                break;
                        case "removeClass":
                                removeClass(json);
                                break;
                        default:
                                return "undefined";
                                break;
                
                }

}

// HELPER FUNCTIONS FOR PAGE VALIDATION


function findUrlParam(separator, key, connector, value){
        
        
       print(separator);
       if (empty(separator)) {print("empty?")}
       if (!(empty(separator))) {print("really empty")}

       
       if (!empty(separator)) {separator ="&";}
       if (!empty(connector)) {connector ="=";}
       
       var query = window.location.search.substring(1);
       var vars = query.split(separator);
       
       for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split(connector);
                if(pair[0] == key){  
                        if (pair[1] == value) {
                                return true
                                }
                        print(pair[0] +','+ key);
                        return pair[1];
                }
        }
       
       return(false);
    }

// VALIDATE PAGE FOR AN A/B TEST

// for all pages
function all(json) {
        print("Selector: all");
}

// search for a parameter in the current URL
function param(json) {
        print('Selector: param for:' + json.identifier.separator + json.identifier.param + json.identifier.connector + json.identifier.search);
        var value = findUrlParam(json.identifier.separator, json.identifier.param, json.identifier.connector, json.identifier.search);
        switch(value) {
                case true:
                        print('case ' + true);
                        // identify A/B type
                        identifyAction(json);
                        break;
                case false:
                        print('case ' + false);
                        break;
                default:
                        print('key found, but value does not match: '+ value);
                        // this could be used for a catch all case .. 
                        break;
        }
}

// search for a character sequence in the current URL
function seq(json) {
        print("Selector: seq");
        print("Search term: " + json.identifier.search);
        if (window.location.href.indexOf( json.identifier.search ) >= 0) {
                identifyAction(json);
        }                    
}

// search for a character sequence and a parameter in the current URL
function seqParam(json){
        print("Selector: seq-param");
        print("Search term: " + json.identifier.search);
}

function tag(json){
        print("Selector: tag");
        print("Search term: " + json.identifier.search);
}

function elementClass(json){
        print("Selector: elementClass");
        print("Search term: " + json.identifier.search);
}

function elementID(json){
        print("Selector: elementID");
        print("Search term: " + json.identifier.search);
}

function bodyClass(json){
        print("Selector: bodyClass");
        print("Search term: " + json.identifier.search);
}


// start processing AB for the individual json entry by processing the selector (identify the condition)
function processAB(json){
        print("\nProcessing entry: "+ json.id);
        switch(json.identifier.type) {
                case "all":
                        all(json);
                        break;
                case "param":
                        param(json);
                        break;
                case "seq":
                        seq(json);
                        break;
                case "seq-param":
                        seqParam(json);
                        break;
                case "tag":
                        tag(json);
                        break;
                case "elementClass":
                        elementClass(json);
                        break;
                case "elementID":
                        elementID(json);
                        break;
                case "bodyClass":
                        bodyClass(json);
                        break;
                //case "seq-id":
                //        seqID(json);
                //        break;
                default:
                    print("error identifying selector: "+ json.identifier.type);
        }
}

// ------- //

// read the json file with the A/B tests as configured
function read_json(path) {
        if (empty(path)) {print("ops")}
        jQuery.getJSON(path, function(data){
                var json = data;
                var json_container = [];
                $.each(json, function(i, record) {
                        if (record.active == true) {
                            json_container.push(record);
                        }
                });
                json = json_container;
            })
        .done(function(json) {
                for (i = 0; i < json.length; i++) {
                        processAB(json[i]);
                        }
                })
        .fail(function() {
                print( "\nError .. likely some issue with the json file" );
                })
        .always(function() {
                print( "\nComplete.. all objects in json iterated" );
        });
    };


// here is where the magic starts
function ab(path){ 
        read_json(path);
        return this;
}