'use strict';

/*
 * PayPlug API for NodeJS. Developped first by clouderial.com for its own use and given to the community
 */

/*
 * This module holds the main class and entry point to the API
 */

var _ = require('lodash'),
    Q = require('q'),
    log = require('log4js').getLogger('ppnjs.PayPlugAPI'),
    jmcnetException = require('jmcnet').exception,
    util = require('util'),
    http = require('http');

var PAYPLUG_URL='https://api.payplug.com/';

/**
 * Instanciate a new PayPlugAPI connector.
 * @param secretKey String  The secret key. Must be retrieved from https://www.payplug.com/portal2/#/account/customization
 * @param options   Object  Some options :
 *      - payplugUrl    String  The base PayPlug URL of API. Defaults to https://api.payplug.com/
 * @return [nothing]
 * @see PayPlugAPI.getPayPlugURL return the value of options.payplugUrl
 */
var PayPlugAPI = function(secretKey, options) {
    if (_.isEmpty(secretKey)) {
        log.error('Cannot create PayPlugAPI without secretKey');
        throw new jmcnetException.TechnicalException('secret key is mandatory');
    }
    this.secretKey = secretKey;
    this.authenticated = false;
    this.options = _.extend(options, {
        payplugUrl: PAYPLUG_URL
    });
    log.trace('PayPlugAPI options are "%s"', util.inspect(options));
    // Add a trailing / in base URL
    if (!_.endsWith(this.options.payplugUrl), '/')
        this.options.payplugUrl += '/';
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

PayPlugAPI.prototype.getPayPlugURL = function(){
    return this.options.payplugUrl;
};

module.exports = {
    DEFAULT_PAYPLUG_URL: PAYPLUG_URL,
    PayPlugAPI: PayPlugAPI
};