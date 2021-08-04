

/**
 * Return Raw Headers  object
 * @param {} req  --reqeust stream || response
 * @returns {object}  --request headers object
 */
function getRawHeaders(req){
  if(req.headers==undefined){
      return undefined;
  }
  return req.headers;
}


/**
 * 
 * @param {*} req --request stream 
 * @param {array} headersList --array list to remove e.g['host','test']
 */
function deleteHeaders(req,headersList){

  let reqHeaders={};
  Object.assign(reqHeaders,req.headers); // copying Object

  for(let i=0;i<headersList.length;i++){
       delete reqHeaders[headersList[i]];
  }
  return reqHeaders;

}


/**
 *  Write List of headers to response Stream
 * @param {object} headersObj  --headers object to insert
 * @param {http.ServerResponse} serverResponse   --response Stream
 * @return {*} --return writtedn headers
 */
function headersInsert(headersObj,serverResponse){


  for(eachHeader in headersObj){

      if(eachHeader==="content-security-policy"){ //* change for CORS:issue
        // serverResponse.set(eachHeader,"upgrade-insecure-requests; default-src * data: gap: blob: about: 'unsafe-inline' 'unsafe-eval'")
        serverResponse.set( eachHeader, "default-src * data: gap: blob: about: 'unsafe-inline' 'unsafe-eval'");
      }

      try{
        if(eachHeader!='set-cookie'&&eachHeader!='content-security-policy'){
          serverResponse.set(eachHeader,headersObj[eachHeader]);
          
        }
      }catch(e){
          console.log(e);
      }
  }
  return serverResponse;

}

module.exports={
  getRawHeaders,
  headersInsert,
  deleteHeaders
}