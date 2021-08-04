/**
 *  
 *  @fileoverview Cookies Related Functions
 *  @requires     cookie  https://npmjs.com/package/cookie
 * 
 */


const cookie = require('cookie');

/**
 *  check if cookie header exists on request stream
 * @param {http.IncomingMessage} clientRequest  -user request stream
 */

function isCookieExists(clientRequest) {

    const COOKIE_HEADER = "cookie";
    
    if (clientRequest.headers[COOKIE_HEADER] != undefined)
        return true;

    return false;
}

/**
 *  retun all raw cookies  in object form from request stream
 * @param {http.IncomingMessage} clientRequest  --request stream
 */
function getRawCookies(clientRequest) {

    if(!isCookieExists(clientRequest)) //check cookie exists
        return null;
    
    let cookieHeader=clientRequest.headers['cookie'];
    return cookie.parse(cookieHeader); // Cookies:object
    
}

/**
 *  delete provided list of cookies  from request stream
 * @param {http.IncomingMessage} clientRequest  --request stream
 * @param {array} deleteList --cookie list to delete
 */
function deleteCookies(clientRequest,deleteList){
    if(!isCookieExists)
        return null;

    let rawCookies=getRawCookies(clientRequest);

    try{
        for(key of deleteList){  //value interation deleting list cookies;
            delete rawCookies[key];
        }
    }catch(e){}
    return rawCookies;  //cleaned cookies;
}


/**
 *  return same value
 * @param {string} value 
 * @returns {string} value --return same value
 */
function encodeCookie(value) {
    return value;
}


/**
 * Inject cookies  on response stream
 * 
 * @param {Array} cookieList  e.g [foo=bar; equation=E%3Dmc%5E2] -Url Encoded
 * @param {http.ServerResponse} serverResponse  --response stream
 */
function injectCookies(cookieList, serverResponse) {

    for (var i = 0; i < cookieList.length; i++) {   //iterate through cookielist

        let currentCookie = cookie.parse(cookieList[i]);
        let cookieName = Object.keys(currentCookie)[0];
        let cookieValue = currentCookie[cookieName];
        let domain = currentCookie.domain;
        let path = currentCookie.path;

        if(serverResponse.cookie==undefined){
            return serverResponse;
        }
        serverResponse.cookie(cookieName, cookieValue, {
            path: path,
            httpOnly: false,
            encode: encodeCookie
        });

    }
    return serverResponse;
}

/**
 *  Create String from cookie Object
 * @param {*} cleanCookieObj  -- cookie object
 * @returns {String}  
 */
function createCookieHeader(cleanCookieObj){

        let arr=[];
        let arrString=undefined;
        for(eachCookie in cleanCookieObj){
            arr.push(`${eachCookie}=${cleanCookieObj[eachCookie]}`)
        }
        return arr.join(';');
}

module.exports = {
    isCookieExists,
    getRawCookies,
    deleteCookies,
    injectCookies,
    createCookieHeader
}