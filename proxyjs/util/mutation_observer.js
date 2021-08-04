import {domload_changes} from './domload_changes';


function domObserverCallback(mutationList,observer){
    const  config={
        attributes:true,
        childList:true,
        subtree:true,
    }
    
    for(let i=0;i<mutationList.length;i++){

        let currentMutation=mutationList[i];        

        if(currentMutation.type=='childList'){
            if(currentMutation.addedNodes.length==0)
                break;
                
            for(let j=0;j<currentMutation.addedNodes.length;j++){
                
                domload_changes(currentMutation.addedNodes[j]);

            }
            
        }else if(currentMutation.type=='attributes'){
            // console.log('attributes');
            // console.log(currentMutation.target);
            //?change attributes
            try{
                let attribName=currentMutation.attributeName;//*Attribute Name

                if(attribName=="href"||attribName=="src"||attribName=="action"){

                    if(currentMutation.target.getAttribute('__oop')=="1"){

                        domload_changes(currentMutation.target,observer,config);

                    }else{

                        domload_changes(currentMutation.target)
                    }
                }
            }catch(e){
                console.log(e+"mutationOBserver");
            }

        }
        
    }

};


function muationObserver(){
    const domElement=document;
    const  config={
        attributes:true,
        childList:true,
        subtree:true,
    }

    const observer=new MutationObserver(domObserverCallback) //callback details 
    observer.observe(domElement,config);//provide details to observer

};

export {
    muationObserver
}