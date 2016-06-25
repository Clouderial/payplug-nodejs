'use strict';

/*
 * PayPlug API for NodeJS. Developped first by clouderial.com for its own use and given to the community
 */

/*
 * This module holds the Payment class which holds all payment feature
 */

var _ = require('lodash'),
	Q = require('q'),
	log = require('log4js').getLogger('ppnjs.Payment'),
	jmcnetException = require('jmcnet').exception,
	util = require('util');

/**
 * Instanciate a new Payment.
 * @param payplugApi Object  The PayplugAPI with sucessfull authentication
 * @param paymentTracker String  A payment tracker (id) that will be send and received by PayPlug API to follow the payment. This tracked will be inserted in metadata
 * @param payment   Object  The payment options. More informations here : https://www.payplug.com/docs/api/apiref.html?powershell#create-a-payment
 * @return [nothing]
 * @see PayPlugAPI.authenticate The authentication method
 */
var Payment = function (payplugApi, paymentTracker, payment) {
	if (_.isEmpty(payplugApi) || !payplugApi.authenticated) {
		log.error('Cannot create Payment without authenticated payplugApi');
		if (payplugApi) {
			throw new jmcnetException.FunctionalException('The API must be authenticated to create a Payment.');
		} else {
			throw new jmcnetException.TechnicalException('You must be provide an authenticated PayplugAPI instance to create a Payment.');
		}
	}
	if (_.isEmpty(paymentTracker)) {
		log.error('Cannot create Payment without "paymentTracker"');
		throw new jmcnetException.TechnicalException('You must be provide an paymentTracker to create a Payment.');
	}
	this.payplugApi = payplugApi;
	this.payment = _.extend({
		hosted_payment: {
			return_url: payplugApi.options.sucessReturnUrl + paymentTracker,
			cancel_url: payplugApi.options.cancelReturnUrl + paymentTracker
		},
		notification_url: payplugApi.options.notificationUrl + paymentTracker
	}, payment);
	this.paymentTracker = paymentTracker;
	log.trace('Payment is "%s"', util.inspect(this.options));
};

Payment.toString = function () {
	return '{payment: { paymentTracker: ' + this.paymentTracker + ', amount:' + this.payment.amount + ' currency: ' + this.payment.currency + '}}';
};

Payment.prototype.sendCreate = function () {
	log.info('Calling Payment.sendCreate payment="%s"', this.toString());

	var me = this;
	var deferred = Q.defer();

	// force adding tracker into metadata
	if (!me.payment.metadata) {
		me.payment.metadata = {};
	}
	me.payment.metadata.payementTracker = me.paymentTracker;

	me.payplugApi.doPost('/v1/payments', me.payment)
		.then(function (res) {
			me.payment = _.extend(me.payment, res);
			deferred.resolve(me);
		})
		.fail(deferred.reject)
		.done();

	return deferred.promise;
};

module.exports = {
    Payment: Payment  
};