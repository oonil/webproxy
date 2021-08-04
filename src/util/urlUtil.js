const https = require('https');
const http = require('http');
const cookie = require('cookie')
// function get headers

function urlDetails(req) {
    let url = req.details.decoded_domain + req.baseUrl
    delete req.headers.host
    let options = {

        url: url,
        method: req.method,
        // hostname:req.details.decoded_domain,
        // port:80,
        headers: req.headers,//* <object>
        // path:req.baseUrl,  //* /index.html?page=12
        // protocol:'https:',  //default HTTPS,
        // rejectUnauthorized:false
    }
    let details = {};
    return new Promise((resolve, reject) => {
        let secureRequest = https.request(url, options, (res) => {

            res.on('data', (chunk) => {
                //console.log(res);
                details['content-type'] = res.headers['content-type'];
                details['content-encoding'] = res.headers['content-encoding'];
                details['transfer-encoding'] = res.headers['transfer-encoding'];
                resolve(details);
            })
            res.on('end', (chunk) => {

            });
            res.on('close', () => {
                // console.log('connection closed');
            });
            res.on('error', (error) => {
                console.log('error');
            });
        });
        secureRequest.on('error', (error) => {
            resolve('something went wrong');
            console.log(error);
        });
        secureRequest.on('timeout', () => {
            resolve('something went worng');
        });
        //secureRequest.write(); //pass value if you want to send request bodyk
        secureRequest.end();  //initate the request
    });

}
module.exports = urlDetails;