const baidu = require("baidu-translate-api");
const google = require('translate-google');
const {translate:bing} = require('bing-translate-api');


const engineType = {

    baidu:async function (word:string){
        let res = await baidu(word, {to: 'en'} );
        return res.trans_result.dst
    },

    bing:async function (word:string){
        let res = await bing(word, null, 'en', true)
        return res.translation
    },

    google:function(word:string){
        return google(word, {to: 'en',tld: "cn"})
    }

    
};


module.exports = engineType;









































