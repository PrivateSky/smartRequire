

process.env.NODE_DEV_MODULES = __dirname + "/../test-helper/modules";
var assert = require('assert');
var path = require('path');

var xrequire = require("../lib/index.js");



xrequire.chroot(__dirname);


try{
    var testModule = require('testmodule');
} catch(err){

    assert(err.toString() == "Error: Security error caused by xrequire.chroot");
    console.log("First xrequire.chroot test: successfull!");

}

var newRoot =  path.resolve(__dirname + "/../");
xrequire.chroot(newRoot);


try{
    var testModule = require('testmodule');
    console.log("All good! Second xrequire.chroot test: successfull!");
    return;
} catch(err){
    console.log("Fail Second xrequire.chroot  tested failed!", err.stack);
}

console.log("Test failed!");

