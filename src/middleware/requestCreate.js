'use strict';

const queryUtil=require('../util/queryUtil');
const encrypt=require('../util/encryptUtil');
const querystring=require('querystring');


//Domain Name in Url
const DOMAIN_QUERY='___(~_~)';


/**
 * Send Error Page
 * 
 */
function sendErrorPage(){
    let code=`
        <html>
              <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>
                            Request Failed!!
                    </title>
                    <style>
                        html{
                            border:3px solid black;
                            border-style:dashed;
                            font-family:sans-serif;
                        }
                        body{
                            display:flex;
                            justify-content:center;
                        }
                        .error-wrapper{
                            width:80%;
                        }
                    </style>
              </head>
              <body>
                   <div class="error-wrapper">
                            <h2>⚠️ Request Failed !!</h2>
                            <p>
                                Connection Error.Invalid Request
                                the Url is outdated(1).
                            </p>
                   </div> 
              </body>
        </html>
    `;
    return code;
}

/**
 *  check what type of request user is sending
 * @param {*} clientRequest -request stream
 */
function requestType(clientRequest){

    //check for DOMAIN query in QUeryString
    if(queryUtil.getQueryString(clientRequest,DOMAIN_QUERY)!=null){

        //*encrypted domain
        let encodedDomain=queryUtil.getQueryString(clientRequest,DOMAIN_QUERY);
        let decodedDomain=encrypt.decodeBase64(encodedDomain);
        
        //* base url
        let baseUrl=clientRequest.baseUrl;

        //* querystring
        let qstring=querystring.stringify(clientRequest.details.qs.clean);        
        if(qstring){
            qstring="?"+qstring;
        }

        let finalUrl=decodedDomain+baseUrl+qstring;
        
        return finalUrl;

    }else{ 
        /**
         *      if client DOMAIn query Doesn't Exist then 
         *      maybe It's a Session Request(htmlPage ALready Send)
         */

        if(clientRequest.session.url!=undefined){
            let encodedDomain=clientRequest.session.url;
            let decodedDomain=encrypt.decodeBase64(encodedDomain);
            return decodedDomain+clientRequest.originalUrl;
            
        }else{
             
            return undefined;
        }
        //no domain name;
    }
}




/**
 * create Request object for axios & 'request' ;
 * @param {*} clientRequest 
 * @param {*} serverResponse 
 * @param {*} next 
 */
async function requestCreate(clientRequest,serverResponse,next){
    
    if(requestType(clientRequest)==undefined){
        //send Error Page
        // serverResponse.send('something went wrong');
        let errorPage=sendErrorPage();
        serverResponse.send(errorPage);
        
    }else{

        clientRequest.requestObject={
            url:requestType(clientRequest),
            method:clientRequest.details.method,
            headers:clientRequest.details.headers.clean,
            body:clientRequest.body,
        }
        next();
    }

}
module.exports= requestCreate;