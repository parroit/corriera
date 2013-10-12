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

    _proxyes:{},

    on: function(event,filter, listener){
        checkOnArguments(event, filter, listener);
        var proxy = function (selector) {
            var args = [].slice.call(arguments);
            args.splice(0, 1);
            listenerProxy(selector, filter, listener, args);
        };
        this._proxyes[listener] = proxy;
        this._emitter.on(event, proxy);

    },

    removeListener: function(event, listener){
        var proxy=this._proxyes[listener];
        delete this._proxyes[listener];
        this._emitter.removeListener(event,proxy);
    },

    once: function(event,filter, listener){
        checkOnArguments(event, filter, listener);
        var self = this;
        var proxy = function (selector) {
            delete self._proxyes[listener];
            var args = [].slice.call(arguments);
            args.splice(0, 1);
            listenerProxy(selector, filter, listener, args);
        };
        this._proxyes[listener] = proxy;
        this._emitter.once(event, proxy);

    },

    emit: function (event, selector /* ,[arg1], [arg2], [...]*/){
        checkEmitArguments(event, selector);
        var args = [].slice.call(arguments);

        this._emitter.emit.apply(this._emitter,args);
    }
};
