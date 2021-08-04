
const axios=require('axios');
const injectUtil=require('../util/injectUtil');

const DOMAIN_QUERY='___(~_~)';

function getContent(req,res){

    return new Promise((resolve,reject)=>{
       axios(req.axiosObject).then((response)=>{
            try{
                if(response.headers['content-type'].match(/text.html/)!=null)  {
                    response.page=true;//set as it's html page
                    //* add session query here
                    req.session.url=req.details.qs.raw[DOMAIN_QUERY];
                    response=injectUtil.injectCode(response);
                    resolve(response);
                    
                }else{
                    resolve(response);
                }

            }catch(e){
                console.log(e);
            }
        })
        .catch(error=>{
            reject(error+"<==FETCHERROR fetcher.js ln:77");
        });
    });

}
module.exports={
  getContent
}