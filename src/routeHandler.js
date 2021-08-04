
const web=require('./web/web');

/**
 * 
 * @param {*} clientRequest  http.incomingRequest
 * @param {*} serverResponse  http.serverResponse
 * @param {*} next 
 */

function routeHandler(clientRequest,serverResponse,next){
   web(clientRequest,serverResponse);
}

module.exports= routeHandler;