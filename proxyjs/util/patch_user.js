import {getQueryDomain,parser,getBetterUrl} from './urlUtil';
import {getOriginalCookie,getChangedCookie} from './cookieUtil';

// change certain settings;
window.origin=atob(getQueryDomain(window.location.href).split('=')[1]);


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
                let queryString=getQueryDomain(window.location.href);
                // let parsedAction=parser(this.getAttribute('__originalaction'));              

                let parsedAction=parser(this.getAttribute('action'));              
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
        arguments[2]=getBetterUrl(arguments[2],'url');
        console.log(arguments[2]);
        originalPushState.apply(window.history,arguments);
        window.location.href=arguments[2];
    }
    window.history.replaceState=function(){
        console.log("wanna replace the state");
        arguments[2]=getBetterUrl(arguments[2],'url');
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
            return getOriginalCookie(value);
       },
       set:function(value){
           console.log('cookie-set-call');
           value=getChangedCookie(value);
           return originalCookie.set.call(document,value);
       }

   }) ;
}

export {
    submitOverwrite,
    historyOverwrite,
    cookieOverWrite
};