/* jshint expr:true*/
'use strict';

/*
 * PayPlug API for NodeJS. Developped first by clouderial.com for its own use and given to the community
 */

/*
 * This module test the main class and entry point to the API
 */

/**
 * Module dependencies.
 */
var expect = require('chai').expect; // jshint ignore:line
var log = require('log4js').getLogger('testu'),
//    _ = require('lodash'),
    PayPlugAPI = require('lib/payplug-nodejs.js').PayPlugAPI;

// The tests
describe('<PlayPlug API Unit Test>', function () {
    var payplugapi;
    before(function (done) {
        payplugapi = new PayPlugAPI();
        done();
    });

    it('Should be possible to authenticate', function (done) {
        log.debug('--> Testing "Should be possible to authenticate"');
        payplugapi.authenticate()
            .then(function (result) {
                expect(result).to.exist;
                log.debug('<-- EndOf "Should be possible to authenticate"');
                done();
            })
            .fail(done)
            .done();
    });
});