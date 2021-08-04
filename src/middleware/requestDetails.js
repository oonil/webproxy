
const headerUtil=require('../util/headerUtil');
const cookieUtil=require('../util/cookieUtil');
const queryUtil=require('../util/queryUtil');

const cookie=require('cookie');
const HEADER_URL='__0_0';
const DOMAIN_QUERY='___(~_~)';



async function requestDetails(clientRequest,serverResponse,next){


   //* details object created
   clientRequest.details={};

   //* url details
   let urlObj={};
   urlObj.url=clientRequest.url;
   urlObj.baseUrl=clientRequest.baseUrl;
   urlObj.originalUrl=clientRequest.originalUrl;

   //* request method
   clientRequest.details.method=clientRequest.method;


    //* request Query string
    let qsObj={};
    qsObj.ispresent=queryUtil.isQueryExists(clientRequest);
    qsObj.raw=queryUtil.getRawQueryString(clientRequest);
    qsObj.clean=queryUtil.deleteQueryString(clientRequest,DOMAIN_QUERY);

    //* request Cookies
    let cookieObj={};
    let cookieDeleteArr=['connect.sid'];
    cookieObj.ispresent=cookieUtil.isCookieExists(clientRequest);
    cookieObj.raw=cookieUtil.getRawCookies(clientRequest);
    cookieObj.clean=cookieUtil.deleteCookies(clientRequest,cookieDeleteArr);//nothing to delete
    cookieObj.cleanHeader=cookieUtil.createCookieHeader(cookieObj.clean);

    //* request Headers
    let headersObj={};
    let deleteHeadersArr=["host","cookie"];
    headersObj.raw=headerUtil.getRawHeaders(clientRequest);
    headersObj.clean=headerUtil.deleteHeaders(clientRequest,deleteHeadersArr);
    if(headersObj.clean!=undefined){
        headersObj.clean['cookie']=cookieObj.cleanHeader;//attach clean cookies
    }


    //* Create Object

    clientRequest.details.url=urlObj; // url object
    clientRequest.details.qs=qsObj;
    clientRequest.details.headers=headersObj; //headersObject
    clientRequest.details.cookies=cookieObj;
    
    next();
}

module.exports=requestDetails;