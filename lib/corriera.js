/*
 * corriera
 * https://github.com/parroit/corriera
 *
 * Copyright (c) 2013 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';
var events = require("events");

function listenerProxy(selector,filter,listener,args){
    if (filter.test(selector)){
        try {

            listener.apply(this,args);
        } catch(err) {
            console.log(err);
        }
    }
}

function checkOnArguments(event, filter, listener) {
    var eventError = "Please provide a non-empty string event name";
    if (typeof (event) !== 'string') {
        throw new Error(eventError);
    }

    if (event == '') {
        throw new Error(eventError);
    }

    if (!(filter instanceof RegExp)) {
        throw new Error("Please provide a regex filter");
    }


    if (!(listener instanceof Function)) {
        throw new Error("Please provide a function listener");
    }
}

function checkEmitArguments(event, selector) {
    var eventError = "Please provide a non-empty string event name";
    if (typeof (event) !== 'string') {
        throw new Error(eventError);
    }

    if (event == '') {
        throw new Error(eventError);
    }

    if (selector === null || selector === undefined) {
        throw new Error("please provide a selector");
    }
}

module.exports={
    _emitter: new events.EventEmitter(),

    on: function(event,filter, listener){
        checkOnArguments(event, filter, listener);
        this._emitter.on(event,function(selector){
            var args = [].slice.call(arguments);
            args.splice(0,1);
            listenerProxy (selector,filter,listener,args);
        });

    },

    once: function(event,filter, listener){
        checkOnArguments(event, filter, listener);
        this._emitter.once(event,function(selector){
            var args = [].slice.call(arguments);
            args.splice(0,1);
            listenerProxy (selector,filter,listener,args);
        });

    },

    emit: function (event, selector /* ,[arg1], [arg2], [...]*/){
        checkEmitArguments(event, selector);
        var args = [].slice.call(arguments);

        this._emitter.emit.apply(this._emitter,args);
    }
};
