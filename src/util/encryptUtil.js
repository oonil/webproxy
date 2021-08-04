/**
 *  convert string to base64 encoding
 * 
 * @param {string} text  -text string convert to base64 encoding;
 */
function encodeBase64(text){
    let buff=new Buffer.from(text);  //plain text
    let encodedString=buff.toString('base64');
    return encodedString;

}

/**
 *  decode string from base64 to string 
 * @param {string} text  - base64 text string decode to string type
 */
function decodeBase64(text){
    if(text==null||text==undefined){
        return null;
    }
    let buff=new Buffer.from(text,'base64')//specifiying encoding type
    let decodedString=buff.toString('ascii');
    return decodedString;
}

module.exports={
    encodeBase64,decodeBase64,
};