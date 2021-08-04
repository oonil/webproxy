//*patchuser
// import './util/patch_user';

//* load polyfill and vendor
// import './vendor/fetch.polyfill.min';
// import './vendor/base64.polyfill.min';


// * custom scripts in order

// import './util/urlUtil';
// import './util/xml_hook';
// import './util/domload_changes';
// import './util/mutation_observer';

import {
    XHROverwrite,
    fetchOverwrite
}   from './util/xml_hook';

import {
    submitOverwrite,
    historyOverwrite,
    cookieOverWrite 
} from './util/patch_user';


import {
    domload_changes
} from './util/domload_changes';

import {
    muationObserver
} from './util/mutation_observer';


// Overwrite Default Function submit,service worker etc
function initPatchUser(){
  submitOverwrite();
  historyOverwrite();
  cookieOverWrite();
}

// overwrite network function XHR and fetch
function initXHROverWrite(){
    XHROverwrite();
    fetchOverwrite();
}

//changes links and urls
function initDomLoadChange(){
    domload_changes();
}

//muation observer
function initObserver(){
    muationObserver();
}

//initalize oo proxy
function initOOP(){
        initPatchUser();
        initXHROverWrite();
        initDomLoadChange();
        initObserver();
}
// DomContentLoaded
document.addEventListener('DOMContentLoaded',function(event){
    initOOP();
});