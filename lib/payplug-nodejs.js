'use strict';

/*
 * PayPlug API for NodeJS. Developped first by clouderial.com for its own use and given to the community
 */

/*
 * This module holds the main class and entry point to the API
 */

var _ = require('lodash'),
    Q = require('q'),
    log = require('log4js').getLogger('ppn.PayPlugAPI'),
    http = require('http');

var PAYPLUG_URL='https://api.payplug.com/';

var PayPlugAPI = function(secretKey, options) {
    this.secretKey = secretKey;
    this.authenticated = false;
    this.options = _.extend({
        payplugUrl: PAYPLUG_URL
    }, options);
};

/**
 * Do the authentication against PayPlug server.
 * @return promise  A promise resolved if authentication is successfull or reject if not
 */
PayPlugAPI.prototype.authenticate = function(){
    log.info('Calling authenticate');
    var deferred = Q.defer();
    
    log.info('EndOf authenticate');
    return deferred.promise;
};

module.exports = {
    PayPlugAPI: PayPlugAPI
};