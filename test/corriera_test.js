/*
 * corriera
 * https://github.com/parroit/corriera
 *
 * Copyright (c) 2013 Andrea Parodi
 * Licensed under the MIT license.
 */

'use strict';

var eventBus = require('../lib/corriera.js');
var expect = require('chai').expect;
require('chai').should();


describe('EventBus',function(){
    describe("module",function() {
        it("should load",function(){
            expect(eventBus).not.to.be.equal(null);
            expect(eventBus).to.be.a('object');

        })
    });

    describe("emit",function() {
        it("should pass arguments to listeners",function(){
            eventBus.once('test',/^param$/,function(one,two){
                expect(one).to.be.equal(1);
                expect(two).to.be.equal(2);
            });

            eventBus.emit('test','param',1,2);



        });


        it("should broadcast event to matched listeners",function(){
            var called = false;
            eventBus.once('test',/^param$/,function(){
                called = true;
            });

            eventBus.emit('test','param');


            expect(called).to.be.true

        });

        it("should not broadcast event to non matched listeners",function(){
            var uncalled = false;
            eventBus.once('test',/^param$/,function(){
                uncalled  = true;
            });

            var called = false;
            eventBus.once('test',/^param-not$/,function(){
                called = true;
            });


            eventBus.emit('test','param-not');

            expect(uncalled).to.be.false;
            expect(called).to.be.true;

        });


        it("should throw on falsy event name",function(){
            (function () {
                eventBus.emit('','','');
            }).should.throw(Error);
        });

        it("should throw on non string event name",function(){
            (function () {
                eventBus.emit(null,'','');
            }).should.throw(Error);

            (function () {
                eventBus.emit(undefined,'','');
            }).should.throw(Error);

            (function () {
                eventBus.emit(true,'','');
            }).should.throw(Error);

            (function () {
                eventBus.emit(/ /,'','');
            }).should.throw(Error);

            (function () {
                eventBus.emit(42,'','');
            }).should.throw(Error);

            (function () {
                eventBus.emit({},'','');
            }).should.throw(Error);

            (function () {
                eventBus.emit(function(){},'','');
            }).should.throw(Error);

        });

        it("should throw on empty selector",function(){
            (function () {
                eventBus.emit('anEvent',null,'');
            }).should.throw(Error);

            (function () {
                eventBus.emit('anEvent',undefined,'');
            }).should.throw(Error);



        });

        it("should not throw on correct argument types",function(){
            eventBus.emit('someEvent','some selector');
        });
    });

    describe("removeListener",function() {
        it("should do what it say",function(){
            var counter = 0;
            var listener = function () {
                counter++;
            };

            eventBus.on('test',/(.*)/, listener);
            eventBus.emit('test','any');
            eventBus.removeListener('test',listener)
            eventBus.emit('test','any');

            expect(counter).to.be.equal(1);


        });
    });

    describe("on",function() {
        it("should throw on falsy event name",function(){
            (function () {
                eventBus.on('','','');
            }).should.throw(Error);
        });

        it("should throw on non string event name",function(){
            (function () {
                eventBus.on(null,'','');
            }).should.throw(Error);

            (function () {
                eventBus.on(undefined,'','');
            }).should.throw(Error);

            (function () {
                eventBus.on(true,'','');
            }).should.throw(Error);

            (function () {
                eventBus.on(/ /,'','');
            }).should.throw(Error);

            (function () {
                eventBus.on(42,'','');
            }).should.throw(Error);

            (function () {
                eventBus.on({},'','');
            }).should.throw(Error);

            (function () {
                eventBus.on(function(){},'','');
            }).should.throw(Error);

        });


        it("should throw on non regex event name",function(){
            (function () {
                eventBus.on('someEvent',null,'');
            }).should.throw(Error);

            (function () {
                eventBus.on('someEvent',undefined,'');
            }).should.throw(Error);

            (function () {
                eventBus.on('someEvent',true,'');
            }).should.throw(Error);

            (function () {
                eventBus.on('someEvent','filter?','');
            }).should.throw(Error);

            (function () {
                eventBus.on('someEvent',42,'');
            }).should.throw(Error);

            (function () {
                eventBus.on('someEvent',{},'');
            }).should.throw(Error);

            (function () {
                eventBus.on('someEvent',function(){},'');
            }).should.throw(Error);

        });

        it("should throw on non function listener",function(){
            (function () {
                eventBus.on('someEvent',/./,null);
            }).should.throw(Error);

            (function () {
                eventBus.on('someEvent',/./,undefined);
            }).should.throw(Error);

            (function () {
                eventBus.on('someEvent',/./,true);
            }).should.throw(Error);

            (function () {
                eventBus.on('someEvent',/./,'filter?');
            }).should.throw(Error);

            (function () {
                eventBus.on('someEvent',/./,42);
            }).should.throw(Error);

            (function () {
                eventBus.on('someEvent',/./,{});
            }).should.throw(Error);

            (function () {
                eventBus.on('someEvent',/./,/./);
            }).should.throw(Error);

        });

        it("should not throw on correct argument types",function(){
            eventBus.on('someEvent',/ /,function(){

            });
        });

    });
});