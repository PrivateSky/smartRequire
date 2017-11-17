/**
 * Created by salboaie on 11/17/17.
 */

var Module = require('module');
var savedRequire = Module.prototype.require;
var develPath = process.env.NODE_DEV_MODULES;

var fs = require("fs");
var path = require('path');

function xrequire(name){
    if(develPath){
        var devPath = path.resolve(develPath, name) ;
        if (fs.existsSync(devPath)) {
            return savedRequire(devPath);
        }
    }

    return savedRequire.apply(this,arguments);
}

Module.prototype.require = xrequire;

/*
Add constraints to require to not escape paths
 */


function getFullPath(path, calledFrom) {
    var resolvedPath;
    try {
        resolvedPath = require.resolve(path);
    } catch(e) { }

    var isExternal = /[/\\]node_modules[/\\]/.test(resolvedPath);
    var isSystemModule = resolvedPath === path;
    if (isExternal || isSystemModule) {
        return resolvedPath;
    }

    var isLocalModule = /^\.{1,2}[/\\]/.test(path);
    if (!isLocalModule) {
        return path;
    }

    var localModuleName = join(dirname(calledFrom), path);
    try {
        return Module._resolveFilename(localModuleName);
    } catch (e) {
        if (isModuleNotFoundError(e)) { return localModuleName; }
        else { throw e; }
    }
}


var currentRoot = "";
var originalLoader   = Module._load;
function newLoader(request) {

    var fullFilePath = getFullPath(request);
    //console.log("Comparing...:", fullFilePath, currentRoot);

    if(fullFilePath.startsWith(currentRoot)){
        return originalLoader.apply(this, arguments);
    }
    throw new Error("Security error caused by xrequire.chroot");
};


exports.chroot = function(newRoot){
    currentRoot = path.resolve(newRoot);
    Module._load = newLoader;
}


exports.reset = function(){
    currentRoot = "";
    Module._load = originalLoader;
}