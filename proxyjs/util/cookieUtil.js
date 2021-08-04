import {getQueryDomain}  from './urlUtil';
function getOriginalCookie(value){
    return value;

}

function getChangedCookiee(value){

    let valueSplit=value.split(';');
    if(valueSplit.length>1){

    }else{
        return value;
    }
    return value;

}

function getChangedCookie(value){
    let valueSplit=value.split(';');
    let cookieObj={};
    let flag=false;
    
    valueSplit.find(row=>{
        
        //console.log(row.trim());
        if(!flag){
            cookieObj[row.trim().split('=')[0]]=row.trim().split('=')[1];
            flag=true;
        }
        if(row.trim().startsWith('domain')){
            cookieObj.domain=row.trim().split('=')[1];
        }
    
        if(row.trim().startsWith('max-age')){
            cookieObj.maxAge=row.trim().split('=')[1];
        }

        if(row.trim().startsWith('path')){
            cookieObj.path=row.trim().split('=')[1];
        }
        if(row.trim().startsWith('expires')){
            cookieObj.expires=row.trim().split('=')[1];
        }
        
    });
    console.log(cookieObj);

    // Name
    let cookieName=Object.keys(cookieObj)[0];
    let cookieValue=cookieObj[Object.keys(cookieObj)[0]];


    let domain=(cookieObj.domain!=undefined)
                ?"domain="+cookieObj.domain+";"
                :'';

    let maxAge=(cookieObj.maxAge!=undefined)
               ?"max-age="+cookieObj.maxAge+";"
               :'';

    let path =(cookieObj.path!=undefined)
               ?"path="+cookieObj.path+";"
               :'';

    let expires=(cookieObj.expires!=undefined)
               ?"expires="+cookieObj.expires+";"
               :'';
}

export{
    getOriginalCookie,
    getChangedCookie
}