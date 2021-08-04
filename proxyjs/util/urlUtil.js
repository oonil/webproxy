
export {
  getBetterUrl,
  parser, toBase64Url,
  getQueryDomain,isShort,
};

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
