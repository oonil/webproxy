function codeGenerate(){
    let scriptTag=` <head>
    <script __oop="1" src="/___o_0.js">
    </script>
    `;
    return scriptTag;
}
/**
 *  inject necessary Code in the html block just afterbegin head tag
 * @param {*} response  response from axios
 */
function injectCode(response){

        let stringData=response.data.toString('latin1');
        // let headArr=stringData.split('<head>');
        if(stringData.trim()==""){
            response.data=Buffer.from("");
            return response;
        }
        let headPosition=stringData.indexOf('<head>');
        let headCharacter='<head>'.length;
        let beforeHead=stringData.slice(0,headPosition);
        let afterHead=stringData.slice(headPosition+headCharacter);

        let insertCode=codeGenerate();

        let finalCode=beforeHead+insertCode+afterHead;

        response.data=Buffer.from(finalCode,'latin1');

        return response;

}


module.exports={injectCode};
