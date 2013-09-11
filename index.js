#!/usr/bin/env node

var program = require('commander'),
    fs = require('fs'),
    watch = require('node-watch'),
    path = require('path'),
    packageJson = require('./package.json'),
    fork = require('child_process').fork,
    watchPath = './',
    throttle = 300,
    throttleTimeout;

program._name = 'gw';

function list(value) {
    return value.split(',') || [];
}

program
    .version(packageJson.version)
    .option('-v, --verbose', 'Verbose output')
    .option('-w, --watch [path]', 'Watch Path [default ' + watchPath +']', watchPath)
    .option('-t, --throttle [milliseconds]', 'Minimum time between processing [default ' + throttle +']', throttle)
    .option('-m, --module [path]', 'Path to Node module to run')
    .option('-a, --arguments <args>', 'Arguments to pass to Node module to run', list)
    .option('-i, --includedExtentions <files>', 'Files extentions to include', list)
    .option('-e, --excludedFiles <files>', 'Files to excluded from triggering', list)
    .parse(process.argv);

function tryToProcess(filename){
    var now = new Date();

    clearTimeout(throttleTimeout);
    throttleTimeout = setTimeout(function(){
            processFile(filename);
        }, program.throttle);
}

function processFile(filename) {
    if(filename){
        console.log('Processing triggered by save on: ' + filename);
    }

    fork(program.module, program.arguments);
}

if(!program.module){
    console.log('Must provide a module to run.');
    return process.exit(1);
}

if(!program.excludedFiles){
    program.excludedFiles = [];
}

console.log('Watching ' + program.watch + ' for changes.');

tryToProcess();

watch(program.watch, function(filename){
    if((program.includedExtentions.length && !~program.includedExtentions.indexOf(path.extname(filename))) ||
        ~program.excludedFiles.indexOf(path.basename(filename))){
        return;
    }
    tryToProcess(filename);
});