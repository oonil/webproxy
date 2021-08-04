
const qs=require('query-string');


/**
 *  check if query string is present in uri
 * @param {*} clientRequest -request stream
 */
function isQueryExists(clientRequest){
    let url=clientRequest.originalUrl;//using original url
    let parsedUrl=qs.parseUrl(url);
    if(Object.keys(parsedUrl.query).length!=0){
        return true;
    }
    return false;
}

/**
 * get all query string; 
 * @param {*} clientRequest  -request stream
 */
function getRawQueryString(clientRequest){

    if(isQueryExists(clientRequest)){
        let url=clientRequest.originalUrl;
        let parsedUrl=qs.parseUrl(url);
        return parsedUrl.query;
    }
    return null;
}

/**
 *  get queryString if not found return null
 * @param {*} clientRequest --request stream
 * @param {*} queryStringName  --query string
 */
function getQueryString(clientRequest,qsName){
    
    if(isQueryExists(clientRequest)){

        let url=clientRequest.originalUrl;
        let parsedUrl=qs.parseUrl(url);//return url+query

        if(parsedUrl.query[qsName]!=undefined){
            return parsedUrl.query[qsName];
        }
        return null;
    }
    return null;

}

/**
 * 
 * @param {*} req  --request stream
 * @param {*} deleteQuery  query to delete
 */
function deleteQueryString(req,deleteQuery){

    if(isQueryExists(req)){

      let query=getRawQueryString(req);
      delete query[deleteQuery];
      return query;

    }
    return null;
}

module.exports={

    isQueryExists,
    getRawQueryString,
    deleteQueryString,
    getQueryString

}