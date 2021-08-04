
const request=require('request');
const injectUtil=require('../util/injectUtil');
const DOMAIN_QUERY='___(~_~)';
const zlib=require('zlib');


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




function getContent(req,res){
   return new Promise((resolve,reject)=>{
        request(req.requestObject,function(error,httpResponse,body){
            if(error){
                return console.log('Error::',error);
            }

            try{
                httpResponse.data=body;

                let contentType=httpResponse.headers['content-type'];

                if(contentType!=undefined &&
                    contentType.match(/text.html/)!=null &&
                    req.details.qs.raw!=undefined&&
                    req.details.qs.raw[DOMAIN_QUERY]!=undefined){
                        
                    httpResponse.page=true;//set as it's html page
                    console.log('pagehtml');

                    let contentEncoding=httpResponse.headers['content-encoding'];

                    uncompress(httpResponse.data,contentEncoding)
                    .then((uncompressData)=>{

                        httpResponse.data=uncompressData;
                        httpResponse.page=true;//set as it's html page
                        //* add session query here
                        req.session.url=req.details.qs.raw[DOMAIN_QUERY];
                        httpResponse=injectUtil.injectCode(httpResponse);

                        compress(httpResponse.data,contentEncoding)
                        .then((compressData)=>{
                            httpResponse.data=compressData;
                            resolve(httpResponse);
                        }) 
                        
                    });
                    
                }else{
                    
                    console.log(req.requestObject.url);
                    console.log('--------------------------');
                    console.log(httpResponse.headers);
                    resolve(httpResponse);
                    
                }
            }catch(e){
                console.log("Error Catched",e);
            }
        });
   }); 
}
module.exports={getContent};