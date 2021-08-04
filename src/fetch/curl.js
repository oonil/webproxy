const {Curl, CurlFeature}=require('node-libcurl');

const zlib=require('zlib');

const DOMAIN_QUERY='___(~_~)';

const Stream=require('stream');

const injectUtil=require('../util/injectUtil');
const { pipeline } = require('stream');

const headerUtil=require('../util/headerUtil');
const { response } = require('express');

function uncompress(data,contentType){
    return new Promise((resolve,reject)=>{
        switch (contentType) {
            case 'br':
                zlib.brotliDecompress(data,function(error,buff){
                    resolve(buff);
                });
              break;
            case 'gzip':
                
               zlib.unzip(data,function(err,buff){
                   resolve(buff);
               });
              break;
            case 'deflate':
                zlib.inflate(data,function(error,buff){
                    resolve(buff);
                });
              break;

            default:
                resolve(data);
              break;
        }
    });
}

function compress(data,contentType){
    
    return new Promise((resolve,reject)=>{
        switch (contentType) {
            case 'br':
                zlib.brotliCompress(data,function(error,buff){
                    resolve(buff);
                });
              break;
            case 'gzip':

               zlib.gzip(data,function(error,buff){
                    resolve(buff);
               });

              break;
            case 'deflate':
                zlib.deflate(data,function(error,buff){
                    resolve(buff);
                });
              break;

            default:
                resolve(data);
              break;
        }
    });
}

/**
 *  converts object's keys to lowercase 
 * @param {object} obj 
 * @returns {object}
 */
function ObjectKeysLower(obj){
    let newObj={};
     for(element in obj){
       newObj[element.toLowerCase()]=obj[element];
     }
     return newObj;
   
}

/**
 *  converts headers of object to array
 * @param {object} headerObject   
 * @returns {array} 
 */
function getArrayHeaders(headerObject){
    let arr=[];
      for(elem in headerObject){
          
        arr.push(`${elem}:${headerObject[elem]}`);  
        
      }
   
    return arr;
  
}

/**
 *  converts array of headers to Object array
 * @param {Array} headerArr -Array of header
 */
function getObjectHeaderFromArray(headerArr){
    
    let iterv=0;
    let beforeHeaderObj={}
    headerArr.map(key=>{
        if(key.trim()!=""){
            if(iterv==0){
                iterv++;
            }else{
                // console.log(key.split(':')[0].trim(),key.split(':')[1].trim());
                beforeHeaderObj[key.split(':')[0].trim()]=key.split(':')[1].trim();
                
                } 
        }
    })
    return beforeHeaderObj;

}


function getContent(clientRequest,serverResponse){
    return new Promise((resolve,reject)=>{

        const curl=new Curl();


        curl.setOpt('IPRESOLVE','IPRESOLVE_V4')
        curl.enable(CurlFeature.NoDataParsing);//no data parsing so get's raw buffer
        curl.setOpt(Curl.option.HTTP_VERSION,0);
        // curl.setOpt(Curl.option.HTTP_VERSION,"HTTP_VERSION_1_1");

        /**
         *  If not disable creates issue while ssl request if have valid ssl
         * then enable this
         */
        curl.setOpt(Curl.option.SSL_VERIFYPEER,false);
        curl.setOpt(Curl.option.SSL_VERIFYHOST,false);
        curl.setOpt(Curl.option.SSL_VERIFYSTATUS,false);

        /**
         *  Custom request {get,put,delete etc}
         */
        curl.setOpt(Curl.option.CUSTOMREQUEST,clientRequest.details.method);

        /**
         *  URl pass to curl
         */
        curl.setOpt(Curl.option.URL,clientRequest.requestObject.url);

       /**
        *   headers set for request
        **/ 
        //    console.log(clientRequest.details.headers.clean,"<==test");
        //    console.log(clientRequest.details.cookies.clean,"<==Clean");
       curl.setOpt(Curl.option.HTTPHEADER,getArrayHeaders(clientRequest.details.headers.clean));//send array of data;
       curl.setOpt('FOLLOWLOCATION',true);

       /**
        *   Proxy Setting 
        */
        // curl.setOpt(Curl.option.PROXY,"protocol://hostname:port")
       


        /**
         * *curl on header event [fired every time each header is received] ;
         *  *every single header is comes line by line
         */

        let totalHeaders=[];
        let responseContentype=undefined;
        let isHeadersSent=undefined;
        let responseStream=new Stream.Readable({
            read(){}
        });
        
        responseStream.on('end',()=>{
            serverResponse.end();
        });
        responseStream.on('error',(e)=>{
            serverResponse.end();
        })
        curl.on('header',function(chunk,curlInstance){

            totalHeaders.push(chunk.toString().trim());

            if(chunk.toString().trim().match(/^content-type/i)!=null
               && chunk.toString().match(/text.html/i)==null){

                responseContentype=chunk.toString().split(':')[1].trim();

                // * PipeLine responseStream to serverResponse
                pipeline(responseStream,serverResponse,function(err){
                    if(err){
                        console.log('something Went Wrong');
                        serverResponse.end();
                    }
                });
            }

        });

        /**
         *  curl Data event
         */
        curl.on('data',function(chunk,curlInstance){

               if(responseContentype!=undefined) {

                    if(isHeadersSent==undefined){
                        let headerObj=getObjectHeaderFromArray(totalHeaders);
                        serverResponse=headerUtil.headersInsert(headerObj,serverResponse);
                        isHeadersSent=true;
                    }
                    responseStream.push(chunk)

               }

        });

        /**
         *   curl on End  Event fired [once]
         */
        curl.on('end',function(statusCode,data,headers){

            if(responseContentype!=undefined){
                responseStream.push(null);
                // responseStream.destroy();
                // serverResponse.end();
                return 
            }
            let httpResponse={};

            try{

                httpResponse.data=data;
                
                httpResponse.headers=ObjectKeysLower(headers[headers.length-1]);

                //get content-encoding
                let contentType=httpResponse.headers['content-type'];

                if( contentType!=undefined&&
                   contentType.match(/text.html/)!=null &&
                   clientRequest.details.qs.raw!=undefined &&
                   clientRequest.details.qs.raw[DOMAIN_QUERY]!=undefined)
                {

                    let contentEncoding=httpResponse.headers['content-encoding'];

                    uncompress(httpResponse.data,contentEncoding)
                    .then((uncompressData)=>{

                        httpResponse.data=uncompressData;
                        httpResponse.page=true;//set as it's html page

                        //* add session query here
                        clientRequest.session.url=clientRequest.details.qs.raw[DOMAIN_QUERY];
                        httpResponse=injectUtil.injectCode(httpResponse);

                        compress(httpResponse.data,contentEncoding)
                        .then((compressData)=>{
                            httpResponse.data=compressData;
                            resolve(httpResponse);
                        }) 

                    });

                }else{

                    // console.log(clientRequest.requestObject.url);
                    // console.log('doicomehere');
                    // serverResponse.sendStatus(200);
                    console.log('iamhere');
                    serverResponse.send(httpResponse.data);
                    serverResponse.end();
                    // this.close();

                }
            }catch(e){
                console.log(e);
            }
        });


        /**
         *  Fired when error occures
         */
        curl.on('error',function(error,errorCode,curlInstance){

            console.log('---------URL------------');
            console.log(clientRequest.requestObject.url)
            console.log('---------error-----------');
            console.log(error);

            console.log('---------errorCode-------');
            console.log(errorCode);
            curl.close.bind(curl);
            //* if Error Happens Send this
            if(!serverResponse.headersSent){
                serverResponse.sendStatus(400);
                serverResponse.end();
            }
        });

        curl.perform();//intialize the request 

    })

}

module.exports={
    getContent
}