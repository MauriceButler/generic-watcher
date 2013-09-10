#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    fork = require('child_process').fork,
    watchPath = '../../public/app',
    throttle = 300,
    moduleToRun,
    excludedFiles = [],
    throttleTimeout;



var program = require('commander'),
    fs = require('fs'),
    path = require('path'),
    packageJson = require('./package.json'),
    watchPath = './',
    throttle = 300,
    throttleTimeout;

program._name = 'generic-watcher';

program
    .version(packageJson.version)
    .option('-v, --verbose', 'Verbose output')
    .option('-w, --watch [path]', 'Watch Path [default ' + watchPath +']',  String, watchPath)
    .option('-t, --throttle [milliseconds]', 'Minimum time between processing (milliseconds) [default ' + throttle +']', Number, throttle)
    .option('-m, --module [path]', 'Path to Node module to run', String, moduleToRun)
    .option('-e, --excludedFiles [paths]', 'Files to excluded from triggering', String, excludedFiles)
    .parse(process.argv);


function hasError(error){
    if(error){
        console.log(error.stack || error);
        return true;
    }
}

function tryToProcess(filename){
    var now = new Date();

    clearTimeout(throttleTimeout);
    throttleTimeout = setTimeout(function(){
            processFile(filename);
        }, throttle);
}

function processFile(filename) {
    if(filename){
        log('Processing triggered by save on: ' + filename);
    }

    fork(moduleToRun);
}

if(!program.module){
    console.log('Must provide a module to run.');
    return process.exit(1);
}

if(program.excludedFiles && program.excludedFiles.length){
    excludedFiles = program.excludedFiles.split(',');
}

console.log('Watching ' + watchPath + ' for changes.');

tryToProcess();

fs.watch(watchPath, function(eventType, filename){
    if(eventType !== 'change' ||
        path.extname(filename).toLowerCase() !== '.js' ||
        path.extname(filename).toLowerCase() !== '.scss' ||
        ~excludedFiles.indexOf(filename.toLowerCase())){
        return;
    }

    tryToProcess(filename);
});