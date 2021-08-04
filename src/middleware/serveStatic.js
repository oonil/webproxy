
const path=require('path');

function serveStatic(clientRequest,serverResponse,next){

        if(clientRequest.originalUrl==="/___o_0.js"){

            serverResponse.set('Content-Type','text/javascript');
            serverResponse.sendFile("___o_0.js",{'root':path.join(__dirname,'../../public')});
        }

        else if(clientRequest.originalUrl==="/___o_0.sw.js"){
            serverResponse.set('Content-Type','text/javascript');
            serverResponse.sendFile("___o_0.sw.js",{'root':path.join(__dirname,'../../public')});
        }

        else if(clientRequest.originalUrl==="/favicon.ico"){
            serverResponse.sendFile("favicon.ico",{'root':path.join(__dirname,'../../public')});
        }

        else if(clientRequest.originalUrl==="/"){
            serverResponse.set('Content-Type','text/html');
            serverResponse.sendFile("index.html",{'root':path.join(__dirname,'../../public')});

        }

        else{
            next();
        }
}

module.exports=serveStatic;