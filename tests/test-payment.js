/* jshint expr:true*/
'use strict';

/*
 * PayPlug API for NodeJS. Developped first by clouderial.com for its own use and given to the community
 */

/*
 * This module test the payment API. Main doc URL is there : https://www.payplug.com/docs/api/apiref.html?powershell#payments
 */

/**
 * Module dependencies.
 */
var expect = require('chai').expect; // jshint ignore:line
var log = require('log4js').getLogger('testu'),
	jmcnet = require('jmcnet'),
	jmcnetException = jmcnet.exception,
	//    _ = require('lodash'),
	ppnj = require('lib/payplug-nodejs.js'),
	PayPlugAPI = ppnj.PayPlugAPI,
	Payment = require('lib/payment.js').Payment,
	config = require('tests/config.json');

// The tests
describe.only('<PlayPlug Paymnt API Unit Test>', function () {
	var payplugapi;
	before(function () {
		log.debug('--> Testing "Payment.beforeAll"');
		payplugapi = new PayPlugAPI(config.testSecretKey, {
			sucessReturnUrl: 'https://example.net/payplugapi/test/success?tracker=',
        	cancelReturnUrl: 'https://example.net/payplugapi/test/cancel?tracker=',
        	notificationUrl: 'https://example.net/payplugapi/test/notifications?tracker=',
		});
		log.debug('<-- EndOf "Payment.beforeAll"');
	});

	it('Should be not possible to instanciate Payment without parameter', function (done) {
		try {
			new Payment();
			done('We should not be there');
		} catch (err) {
			expect(err).to.be.instanceof(jmcnetException.TechnicalException);
			done();
		}
	});

	it('Should be not possible to instanciate Payment with PayPlugAPI not authenticated', function (done) {
		try {
			new Payment(payplugapi, 'paymentTracker', {});
			done('We should not be there');
		} catch (err) {
			expect(err).to.be.instanceof(jmcnetException.FunctionalException);
			done();
		}
	});

	it('Should be possible to authenticate', function (done) {
		log.debug('--> Start "Should be possible to authenticate"');
		payplugapi.authenticate()
			.then(function (result) {
				expect(payplugapi.authenticated).to.be.true;
				log.debug('<-- EndOf "Should be possible to authenticate"');
				done();
			})
			.fail(done)
			.done();
	});

	it('Should be not possible to instanciate Payment without paymentTracker', function (done) {
		try {
			new Payment(payplugapi);
			done('We should not be there');
		} catch (err) {
			expect(err).to.be.instanceof(jmcnetException.TechnicalException);
			done();
		}
	});

	var payment;
	it('Should be possible to instanciate a Payment', function (done) {
		payment = new Payment(payplugapi, 'paymentid', {
			'amount': 1000,
			'currency': 'EUR',
			'customer': {
				'email': 'testu@payplug-nodejs.com',
				'first_name': 'Testu',
				'last_name': 'Payplug-nodejs'
			},
			'save_card': 'false',
			'force_3ds': true
		});
		payment.sendCreate()
			.then(function (p) {
				expect(p.isSend).to.be.true;
				expect(p.payment.metadata.paymentTracker);
				done();
			})
			.fail(done)
			.done();
	});
	
	it('Should be possible to list the payments', function(done){
		Payment.list(payplugapi)
		.then(function(list) {
			expect(list.length).to.be.above(0);
			done();
		})
		.fail(done)
		.done();
	});
});