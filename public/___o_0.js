/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "XHROverwrite": () => (/* binding */ XHROverwrite),
/* harmony export */   "fetchOverwrite": () => (/* binding */ fetchOverwrite),
/* harmony export */   "originOpen": () => (/* binding */ originOpen),
/* harmony export */   "originSend": () => (/* binding */ originSend),
/* harmony export */   "originsetRequestHeader": () => (/* binding */ originsetRequestHeader),
/* harmony export */   "originFetch": () => (/* binding */ originFetch)
/* harmony export */ });
/* harmony import */ var _urlUtil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);


//XMLHtttpRequest Hook

  let originOpen=XMLHttpRequest.prototype.open;
  let originSend=XMLHttpRequest.prototype.send;
  let originsetRequestHeader=XMLHttpRequest.prototype.setRequestHeader;
  let originPostMessage=XMLHttpRequest.prototype.postMessage;

  let originSendBeacon=window.Navigator.prototype.sendBeacon;

  let originFetch=window.fetch;

  // let startProxy=true;

  /**
   * ?OverWrites XMLHttpReqeust
   */
  function XHROverwrite(){ 
    XMLHttpRequest.prototype.open=function(){
    
        let requestObj={};
        requestObj.method=arguments[0];
        requestObj.url=arguments[1];
        requestObj.headers={};

        arguments[1]=(0,_urlUtil__WEBPACK_IMPORTED_MODULE_0__.getBetterUrl)(arguments[1],'xhr');
    
        this.requestObj=requestObj; //adding request object to (this)
        return originOpen.apply(this, arguments);
    }

    /**
     *  *add request body if it's post request
     */
    XMLHttpRequest.prototype.send=function(){
    
        this.requestObj.data=arguments[0];
        return originSend.apply(this,arguments)
    }
    
    /**
     *  Add request headers
     */
    XMLHttpRequest.prototype.setRequestHeader=function(){
        this.requestObj.headers[arguments[0]]=arguments[1];
        return originsetRequestHeader.apply(this,arguments);
    }
    
    //SendBeacon
    window.Navigator.prototype.sendBeacon=function(){

       arguments[0]=(0,_urlUtil__WEBPACK_IMPORTED_MODULE_0__.getBetterUrl)(arguments[0],'xhr');
       return originSendBeacon.apply(this,arguments);
    }

    //PostMessage
    window.postMessage=function(){
      arguments[1]=(0,_urlUtil__WEBPACK_IMPORTED_MODULE_0__.getBetterUrl)(arguments[1],'xhr');
      return originPostMessage.apply(this,arguments);
    }



  }

  /**
   * Overwrites window.fetch 
   */
  function fetchOverwrite(){
    window.fetch=function(){
      
       arguments[0]=(0,_urlUtil__WEBPACK_IMPORTED_MODULE_0__.getBetterUrl)(arguments[0],'xhr');
       return originFetch.apply(this,arguments);
    }
  }

  

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getBetterUrl": () => (/* binding */ getBetterUrl),
/* harmony export */   "parser": () => (/* binding */ parser),
/* harmony export */   "toBase64Url": () => (/* binding */ toBase64Url),
/* harmony export */   "getQueryDomain": () => (/* binding */ getQueryDomain),
/* harmony export */   "isShort": () => (/* binding */ isShort)
/* harmony export */ });



/**
 * manage short url 
 * @param {*} urlStr 
 * @returns 
 */
function getShortBetterUrl(urlStr){
      if(urlStr.split('?').length!==1){ // queryString Found
        return urlStr+"&"+getQueryDomain(window.location.href);
      }else{ //queryString not found
        return urlStr+"?"+getQueryDomain(window.location.href);
      }
}
/**
 * Get Better Url Long 
 * @param {*} urlStr 
 * @returns 
 */
function getLongBetterUrl(urlStr){

  //? parse url
  let parsedUrl=parser(urlStr);
  let queryDomain=getQueryDomain(urlStr);

  if(queryDomain!=undefined){
    return  urlStr;
  }
  if(parsedUrl.prototcol==="https:"||parsedUrl.prototcol==="http:"){
        //? request page url
        let urlToEncode=parsedUrl.prototcol+"//"+parsedUrl.host;
        let encodedUrl="___(~_~)="+toBase64Url(urlToEncode);

        //?current Page Encdoing
        let curentPageUrl=document.location.protocol+"//"+document.location.host;
        let currentPageEncoded="___(~_~)="+toBase64Url(curentPageUrl);

        encodedUrl=(encodedUrl===currentPageEncoded)
            ? getQueryDomain(window.location.href)
            :encodedUrl;
          let baseUrl=(parsedUrl.search!="")
                      ?parsedUrl.pathname+parsedUrl.search+"&"+encodedUrl
                      :parsedUrl.pathname+"?"+encodedUrl;


    return baseUrl;


  }
}
/**
 *  get Better url for xhr and links;
 * @param {string} urlStr 
 * @param {string} type  -type [xhr,url]
 */
function getBetterUrl(urlStr,type){

  if(urlStr===undefined){
    return urlStr;
  }
  //* xhr type request;
  if(type==='xhr'){

      if(isShort(urlStr)){
        return getShortBetterUrl(urlStr);
      }else{
        return getLongBetterUrl(urlStr);
      }
   }

  //* url type request
  if(type=='url'){
    //* return if match protocol
    if(urlStr.match(/^data:/)!=null){
      return urlStr;
    }
      if(isShort(urlStr)){
        return getShortBetterUrl(urlStr);
      }else{
        return getLongBetterUrl(urlStr);
      }
  }

 }



/**
 * Url Parser  return object with all details
 * @param {string} urlText 
 */
function parser(urlText){
  let urlObject={};
  let parser = document.createElement('a');
  parser.href = urlText; // "http://example.com:3000/pathname/?search=test#hash";
  
   //add Necessary details
   urlObject.prototcol=parser.protocol; //=>"Http:"
   urlObject.hostname=parser.hostname;  //=> "example.com"
   urlObject.port=parser.port;          //=> "3000"
   urlObject.pathname=parser.pathname;  //=> "/pathname/"
   urlObject.search=parser.search;      //=> "?search=test"
   urlObject.hash=parser.hash;          //=> "#hash"
   urlObject.host=parser.host;          //=> "example.com:3000"
   return urlObject;
 }

/**
 *  return query String 
 * @param {string} domain 
 */ 
function getQueryDomain(domain){
    const DOMAIN_QUERY='___(~_~)';
    if(domain.split('?').length==1){
      return undefined;
    }
    // console.log(domain);
    let queryString=domain.split('?')[1];

    let eachQuery=queryString.split('&');
    for(let i=0;i<eachQuery.length;i++){

        if(eachQuery[i].match(/___\(~_~\)/)!=null){
            return eachQuery[i];
        }
    }


} 

/**
 *  checks if url is short or long
 * @param {string} url 
 * @returns {boolean}
 */
function isShort(url){

   if(url.trim().match('^\/')!=null){
      return true;
   }else{
     return false;
   }
}


/**
 *  replace uri sensitive characters; 
 * @param {string} textstr 
 */
function toBase64Url(textstr){
  textstr=window.btoa(textstr);
  return textstr.replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "submitOverwrite": () => (/* binding */ submitOverwrite),
/* harmony export */   "historyOverwrite": () => (/* binding */ historyOverwrite),
/* harmony export */   "cookieOverWrite": () => (/* binding */ cookieOverWrite)
/* harmony export */ });
/* harmony import */ var _urlUtil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _cookieUtil__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);



// change certain settings;
window.origin=atob((0,_urlUtil__WEBPACK_IMPORTED_MODULE_0__.getQueryDomain)(window.location.href).split('=')[1]);


//patch Websocket

window.WebSocket=undefined;
//removing default fetch
// window.fetch=undefined;

//removing service workers
//1.
// if(navigator.serviceWorker!=undefined){
//     navigator.serviceWorker.register=function(){};
// }

var originalSubmit=HTMLFormElement.prototype.submit;

var originalPushState=window.history.pushState;
var originalReplaceState=window.history.replaceState;
var originalCookie=Object.getOwnPropertyDescriptor(Document.prototype,'cookie');

function submitOverwrite(){
    HTMLFormElement.prototype.submit=function(){
        //debugger;

        if(this.method==="get"){
            let allData=new FormData(this);
            let arrData=Array.from(allData);
            const DOMAIN_QUERY='___(~_~)';

            if(arrData.length>0){
                let urlParams=[];
                let finalUrl="";
                for(let i=0;i<arrData.length;i++){
                    urlParams.push(arrData[i][0]+"="+arrData[i][1]);
                }
                let urlParamsStr=urlParams.join('&');
                let queryString=(0,_urlUtil__WEBPACK_IMPORTED_MODULE_0__.getQueryDomain)(window.location.href);
                // let parsedAction=parser(this.getAttribute('__originalaction'));              

                let parsedAction=(0,_urlUtil__WEBPACK_IMPORTED_MODULE_0__.parser)(this.getAttribute('action'));              
                finalUrl=parsedAction.pathname+"?"+urlParamsStr+"&"+queryString;
                
                window.location.href=finalUrl;
                console.log(finalUrl);
                
            }

        }else{
            originalSubmit.apply(this);
        }

    };

}
function historyOverwrite(){
    window.history.pushState=function(){
        console.log("pushh the state");
        arguments[2]=(0,_urlUtil__WEBPACK_IMPORTED_MODULE_0__.getBetterUrl)(arguments[2],'url');
        console.log(arguments[2]);
        originalPushState.apply(window.history,arguments);
        window.location.href=arguments[2];
    }
    window.history.replaceState=function(){
        console.log("wanna replace the state");
        arguments[2]=(0,_urlUtil__WEBPACK_IMPORTED_MODULE_0__.getBetterUrl)(arguments[2],'url');
        console.log(arguments[2]);
        // window.location.href=arguments[2];
        // return originalReplaceState.apply(window.history,arguments);
    }
}
function cookieOverWrite(){
   Object.defineProperty(document,'cookie',{
       get:function(){
            console.log('cookie-get-call');
            let value=originalCookie.get.call(document);
            return (0,_cookieUtil__WEBPACK_IMPORTED_MODULE_1__.getOriginalCookie)(value);
       },
       set:function(value){
           console.log('cookie-set-call');
           value=(0,_cookieUtil__WEBPACK_IMPORTED_MODULE_1__.getChangedCookie)(value);
           return originalCookie.set.call(document,value);
       }

   }) ;
}



/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getOriginalCookie": () => (/* binding */ getOriginalCookie),
/* harmony export */   "getChangedCookie": () => (/* binding */ getChangedCookie)
/* harmony export */ });
/* harmony import */ var _urlUtil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);

function getOriginalCookie(value){
    return value;

}

function getChangedCookiee(value){

    let valueSplit=value.split(';');
    if(valueSplit.length>1){

    }else{
        return value;
    }
    return value;

}

function getChangedCookie(value){
    let valueSplit=value.split(';');
    let cookieObj={};
    let flag=false;
    
    valueSplit.find(row=>{
        
        //console.log(row.trim());
        if(!flag){
            cookieObj[row.trim().split('=')[0]]=row.trim().split('=')[1];
            flag=true;
        }
        if(row.trim().startsWith('domain')){
            cookieObj.domain=row.trim().split('=')[1];
        }
    
        if(row.trim().startsWith('max-age')){
            cookieObj.maxAge=row.trim().split('=')[1];
        }

        if(row.trim().startsWith('path')){
            cookieObj.path=row.trim().split('=')[1];
        }
        if(row.trim().startsWith('expires')){
            cookieObj.expires=row.trim().split('=')[1];
        }
        
    });
    console.log(cookieObj);

    // Name
    let cookieName=Object.keys(cookieObj)[0];
    let cookieValue=cookieObj[Object.keys(cookieObj)[0]];


    let domain=(cookieObj.domain!=undefined)
                ?"domain="+cookieObj.domain+";"
                :'';

    let maxAge=(cookieObj.maxAge!=undefined)
               ?"max-age="+cookieObj.maxAge+";"
               :'';

    let path =(cookieObj.path!=undefined)
               ?"path="+cookieObj.path+";"
               :'';

    let expires=(cookieObj.expires!=undefined)
               ?"expires="+cookieObj.expires+";"
               :'';
}



/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "domload_changes": () => (/* binding */ domload_changes)
/* harmony export */ });
/* harmony import */ var _urlUtil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);


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
                currentElement.setAttribute(elementAttr,(0,_urlUtil__WEBPACK_IMPORTED_MODULE_0__.getBetterUrl)(currentElement[elementAttr],'url'));

                if(eachTagName=="form"){
                    currentElement.addEventListener('submit',formSubmitHandler);
                }

            }else{

                if(observer!=undefined){
                    observer.disconnect();
                }
                currentElement.setAttribute('__oop',"1");
                currentElement.setAttribute("__original"+tagObject[eachTagName].attr,currentElement[elementAttr]);
                currentElement.setAttribute(elementAttr,(0,_urlUtil__WEBPACK_IMPORTED_MODULE_0__.getBetterUrl)(currentElement[elementAttr],'url'));

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
                let changeUrl=(0,_urlUtil__WEBPACK_IMPORTED_MODULE_0__.getBetterUrl)(currentElement[elementAttr],'url');
                currentElement.setAttribute(elementAttr,changeUrl);

                if(observer!=undefined){
                    observer.observe(document,config);
                }
            }
        }
    }

}




/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "muationObserver": () => (/* binding */ muationObserver)
/* harmony export */ });
/* harmony import */ var _domload_changes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);



function domObserverCallback(mutationList,observer){
    const  config={
        attributes:true,
        childList:true,
        subtree:true,
    }
    
    for(let i=0;i<mutationList.length;i++){

        let currentMutation=mutationList[i];        

        if(currentMutation.type=='childList'){
            if(currentMutation.addedNodes.length==0)
                break;
                
            for(let j=0;j<currentMutation.addedNodes.length;j++){
                
                (0,_domload_changes__WEBPACK_IMPORTED_MODULE_0__.domload_changes)(currentMutation.addedNodes[j]);

            }
            
        }else if(currentMutation.type=='attributes'){
            // console.log('attributes');
            // console.log(currentMutation.target);
            //?change attributes
            try{
                let attribName=currentMutation.attributeName;//*Attribute Name

                if(attribName=="href"||attribName=="src"||attribName=="action"){

                    if(currentMutation.target.getAttribute('__oop')=="1"){

                        (0,_domload_changes__WEBPACK_IMPORTED_MODULE_0__.domload_changes)(currentMutation.target,observer,config);

                    }else{

                        (0,_domload_changes__WEBPACK_IMPORTED_MODULE_0__.domload_changes)(currentMutation.target)
                    }
                }
            }catch(e){
                console.log(e+"mutationOBserver");
            }

        }
        
    }

};


function muationObserver(){
    const domElement=document;
    const  config={
        attributes:true,
        childList:true,
        subtree:true,
    }

    const observer=new MutationObserver(domObserverCallback) //callback details 
    observer.observe(domElement,config);//provide details to observer

};



/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util_xml_hook__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _util_patch_user__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _util_domload_changes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);
/* harmony import */ var _util_mutation_observer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6);
//*patchuser
// import './util/patch_user';

//* load polyfill and vendor
// import './vendor/fetch.polyfill.min';
// import './vendor/base64.polyfill.min';


// * custom scripts in order

// import './util/urlUtil';
// import './util/xml_hook';
// import './util/domload_changes';
// import './util/mutation_observer';











// Overwrite Default Function submit,service worker etc
function initPatchUser(){
  (0,_util_patch_user__WEBPACK_IMPORTED_MODULE_1__.submitOverwrite)();
  (0,_util_patch_user__WEBPACK_IMPORTED_MODULE_1__.historyOverwrite)();
  (0,_util_patch_user__WEBPACK_IMPORTED_MODULE_1__.cookieOverWrite)();
}

// overwrite network function XHR and fetch
function initXHROverWrite(){
    (0,_util_xml_hook__WEBPACK_IMPORTED_MODULE_0__.XHROverwrite)();
    (0,_util_xml_hook__WEBPACK_IMPORTED_MODULE_0__.fetchOverwrite)();
}

//changes links and urls
function initDomLoadChange(){
    (0,_util_domload_changes__WEBPACK_IMPORTED_MODULE_2__.domload_changes)();
}

//muation observer
function initObserver(){
    (0,_util_mutation_observer__WEBPACK_IMPORTED_MODULE_3__.muationObserver)();
}

//initalize oo proxy
function initOOP(){
        initPatchUser();
        initXHROverWrite();
        initDomLoadChange();
        initObserver();
}
// DomContentLoaded
document.addEventListener('DOMContentLoaded',function(event){
    initOOP();
});
})();

/******/ })()
;