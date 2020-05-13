
const fs = require('fs');
const path = require('path');
const sub_app_ath = path.resolve('../');
console.log(sub_app_ath)
const sub_apps = fs.readdirSync(sub_app_ath).filter(i => /^mfe|portal/.test(i));
exports.apps = sub_apps

/*define({
    sub_apps : fs.readdirSync(sub_app_ath).filter(i => /^mfe|portal/.test(i))
})*/
/*define(function () {
    const sub_apps = fs.readdirSync(sub_app_ath).filter(i => /^mfe|portal/.test(i));
    return{
        sub_apps:sub_apps
    }
})*/
