import {getBetterUrl} from './urlUtil';

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

        arguments[1]=getBetterUrl(arguments[1],'xhr');
    
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

       arguments[0]=getBetterUrl(arguments[0],'xhr');
       return originSendBeacon.apply(this,arguments);
    }

    //PostMessage
    window.postMessage=function(){
      arguments[1]=getBetterUrl(arguments[1],'xhr');
      return originPostMessage.apply(this,arguments);
    }



  }

  /**
   * Overwrites window.fetch 
   */
  function fetchOverwrite(){
    window.fetch=function(){
      
       arguments[0]=getBetterUrl(arguments[0],'xhr');
       return originFetch.apply(this,arguments);
    }
  }

  export{
        XHROverwrite,fetchOverwrite,
        originOpen,originSend,originsetRequestHeader,
        originFetch
  }