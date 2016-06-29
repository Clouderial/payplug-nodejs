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
    _ = require('lodash'),
    Q = require('q'),
    ppnj = require('lib/payplug-nodejs.js'),
    PayPlugAPI = ppnj.PayPlugAPI,
    ppnj_payment = require('lib/payment.js'),
    Payment = ppnj_payment.Payment,
    config = require('tests/config.json');

// The tests
describe('<PlayPlug Paymnt API Unit Test>', function () {
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
            'save_card': false,
            'force_3ds': true
        });
        payment.sendCreate()
            .then(function (p) {
                expect(p.getTracker()).to.equal('paymentid');
                expect(p.getId()).to.exist;
                payment = p;
                done();
            })
            .fail(done)
            .done();
    });

    it('Should be possible to list the payments', function (done) {
        Payment.list(payplugapi)
            .then(function (list) {
                expect(list.length).to.be.above(0);
                var newPayments = _.filter(list, function (p) {
                    return p.getId() === payment.getId();
                });
                expect(newPayments).to.have.length(1);
                expect(newPayments[0].getId()).to.equal(payment.getId());
                expect(newPayments[0].getTracker()).to.equal(payment.getTracker());
                expect(newPayments[0].payment.amount).to.equal(payment.payment.amount);
                done();
            })
            .fail(done)
            .done();
    });

    it('Should be possible to retrieve the new payment', function (done) {
        expect(payment).to.exist;
        Payment.retrieve(payplugapi, payment.getId())
            .then(function (p) {
                expect(p.getId()).to.equal(payment.getId());
                expect(p.getTracker()).to.equal(payment.getTracker());
                expect(p.payment.amount).to.equal(payment.payment.amount);
                done();
            })
            .fail(done)
            .done();
    });

    it('Should be possible to abort the new payment', function (done) {
        expect(payment).to.exist;
        payment.sendAbort()
            .then(function (p) {
                expect(p.getId()).to.equal(payment.getId());
                expect(p.getTracker()).to.equal(payment.getTracker());
                expect(p.payment.amount).to.equal(payment.payment.amount);
                expect(p.payment.failure).to.exist;
                expect(p.payment.failure.code).to.equal(ppnj_payment.PAYMENT_ABORT_STATUS);
                expect(p.payment.failure.message).to.exist;
                payment = p;
                done();
            })
            .fail(done)
            .done();
    });

    it('Should be possible to abort all payment created by those tests', function (done) {
        Payment.list(payplugapi)
            .then(function (list) {
                var bigPromise = [];
                _.forEach(list, function(payment) {
                    if (!payment.isFailed()) {
                        bigPromise.push(payment.sendAbort());
                    }
                });
                return Q.all(bigPromise);
            })
            .then(function (res) {
                log.debug('Number of old payments aborted: "%d"', res.length);
                done();
            })
            .fail(done)
            .done();
    });
});