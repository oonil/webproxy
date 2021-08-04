import {getBetterUrl} from './urlUtil';

//forms submit event
function formSubmitHandler(event){
    event.preventDefault();
    // event.stopPropagation();
    this.submit();
}

function domload_changes(targetNode,observer,config){

    if(targetNode===undefined){
        targetNode=document.documentElement;
    }

    let tagObject={
        "form":{
            "attr":"action"
        },

        "a":{
            "attr":"href",
        },
        "link":{
            "attr":"href",
        },
        "base":{
            "attr":"href"
        },
        "area":{
            "attr":"href"
        },

        "blockquote":{
            "attr":"cite"
        },

        "script":{
            "attr":"src",
        },
        "img":{
            "attr":"src",
        },
        "iframe":{
            "attr":"src",
        },
        "embed":{
            "attr":"src"
        },
        "source":{
            "attr":"src"
        },
        "track":{
            "attr":"src"
        },
        "input":{
            "attr":"src"
        },
        "audio":{
            "attr":"src"
        },
        "video":{
            "attr":"src"
        }

    };

    for(let eachTagName in tagObject){
        //? single element changes

        if(eachTagName.toUpperCase()===targetNode.tagName){ 

            let currentElement=targetNode;
            let elementAttr=tagObject[eachTagName].attr;

            if(currentElement.getAttribute('__oop')==null){

                currentElement.setAttribute('__oop',"1");
                currentElement.setAttribute("__original"+tagObject[eachTagName].attr,currentElement[elementAttr]);
                currentElement.setAttribute(elementAttr,getBetterUrl(currentElement[elementAttr],'url'));

                if(eachTagName=="form"){
                    currentElement.addEventListener('submit',formSubmitHandler);
                }

            }else{

                if(observer!=undefined){
                    observer.disconnect();
                }
                currentElement.setAttribute('__oop',"1");
                currentElement.setAttribute("__original"+tagObject[eachTagName].attr,currentElement[elementAttr]);
                currentElement.setAttribute(elementAttr,getBetterUrl(currentElement[elementAttr],'url'));

                if(eachTagName=="form"){
                    currentElement.addEventListener('submit',formSubmitHandler);
                }

                if(observer!=undefined){
                    observer.observe(document,config);
                }
            }
        }
        
        // console.log("---------------"+eachTagName+"----------------");


        
        if(typeof targetNode.querySelectorAll!="function"){
            break;
        }

        let allElement=targetNode.querySelectorAll(eachTagName);
        let totalElement=(allElement!=null)?allElement.length:0;//total elements

        for(let i=0;i<totalElement;i++){

            let currentElement=allElement[i];//current Element
            let elementAttr=tagObject[eachTagName].attr; //current Attr name

            if(currentElement.getAttribute('__oop')===null
                && currentElement[elementAttr].trim()!=""
            ){
                if(observer!=undefined){
                    observer.disconnect();
                }

                if(eachTagName=="form"){
                    currentElement.addEventListener('submit',formSubmitHandler);
                }
                currentElement.setAttribute('__oop',"1");
                currentElement.setAttribute("__original"+elementAttr,currentElement[elementAttr]);
                let changeUrl=getBetterUrl(currentElement[elementAttr],'url');
                currentElement.setAttribute(elementAttr,changeUrl);

                if(observer!=undefined){
                    observer.observe(document,config);
                }
            }
        }
    }

}


export{
    domload_changes
}