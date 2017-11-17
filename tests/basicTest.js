

process.env.NODE_DEV_MODULES = __dirname + "/../test-helper/modules";
require("../lib/index.js");
var assert = require('assert');
var testModule = require('testmodule');


var includeFromDev = require("incInDev.js");

var includeFromLocal = require("./incInLocal.js");



assert(includeFromLocal.isIncluded === true);
assert(testModule.isIncluded === true);
console.log("All good! Hooking require successfully!");