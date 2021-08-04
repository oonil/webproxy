

const cookieUtil=require('../util/cookieUtil');
const headerUtil=require('../util/headerUtil');

const fetcher=require('../fetch/curl');

function web(clientRequest,serverResponse){

    fetcher.getContent(clientRequest,serverResponse)
    .then(fetchResponse=>{
        try{
            if(fetchResponse.page){
                if(fetchResponse.headers['set-cookie']!=undefined){ 
                    serverResponse=cookieUtil
                    .injectCookies(fetchResponse.headers['set-cookie'],serverResponse);
                }
                serverResponse=headerUtil.headersInsert(fetchResponse.headers,serverResponse) ;
                serverResponse.set('content-type',fetchResponse.headers['content-type']);
                serverResponse.send(Buffer.from(fetchResponse.data,'binary'));
            }
           }catch(e){ console.log(e); }
           
        //    set headers

    }).catch(error=>{
        console.log(error);
        serverResponse.send(error+'::something Went COntent Error');
    })
    // serverResponse.send(clientRequest.details);
}
module.exports=web;