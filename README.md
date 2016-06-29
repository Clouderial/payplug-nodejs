# payplug-nodejs
An NodeJS API for Payplug solution : https://www.payplug.com

This module aims to implement the Curl Payplug API describe here : https://www.payplug.com/docs/api

It is used as payment solution of the StartUp Clouderial (<a href="http://clouderial.com">online project management, invoices, quotation and tasks for independant workers</a>)

## Install
<code>$ npm install payplug-nodejs</code>

## Authenticate against PayPlug API
To authenticate :

<pre>
var PayPlugAPI = require('lib/payplug-nodejs.js').PayPlugAPI;

var payplugapi = new PayPlugAPI('mySecretKey');

payplugapi.authenticate()
	.then(function (result) {
		// you are authenticated.
		// paypluapi can be use to manage payments
	})
	.fail(function(err){
		log.error('Error while authenticating. Message="%s"', err.message);
	})
	.done();
if (payplugapi.authenticated) {
	// The API is successfully authenticated
}
</pre>

To test if authentication is successfull :
<pre>
if (payplugapi.authenticated) {
	// The API is successfully authenticated
}
</pre>

## Payment
### To create a payment :

<pre>
// Cf above to have an authenticated PayplugApi object
// var payplugapi = new PayPlugAPI('mySecretKey');
// payplugapi.authenticate()
// ... 

// Create a new Payment
payment = new Payment(payplugapi, 'paymentid', {
    'amount': 1000,
    'currency': 'EUR',
    'customer': {
        'email': 'testu@payplug-nodejs.com',
        'first_name': 'ClientFirstname',
        'last_name': 'ClientLastname'
    },
    'save_card': false,
    'force_3ds': true
});

// Send the Payment creation
payment.sendCreate()
    .then(function (newPayment) {
        // The API call is successfull
        // newPayment if Payment updated with id and tracker;
        newPayment.getId();
        newPayment.getTracker();
        // if payment
        if (newPayemnt.isFailed()) {
            newPayment.payment.failure.code;
            newPayment.payment.failure.message;
        }
    })
    .fail(function(err){
        // there have been an error during payment creation
        err.message;
    })
    .done();
</pre>

### To retrieve a payment :

<pre>
// Cf above to have an authenticated PayplugApi object
// var payplugapi = new PayPlugAPI('mySecretKey');
// payplugapi.authenticate()
// ... 

// Retrieve a Payment wth its Id
Payment.retrieve(payplugapi, 'theIDOfPayment')
    .then(function (payment) {
        // The API call is successfull
        // payment if Payment updated with id and tracker;
        payment.getId();
        payment.getTracker();
        
        // if payment is aborted of failed
        if (newPayemnt.isFailed()) {
            newPayment.payment.failure.code;
            newPayment.payment.failure.message;
        }
    })
    .fail(function(err){
        // there have been an error during payment creation
        err.message;
    })
    .done();
</pre>


## Tests
To launch the test you must first provide a tests/config.json file with you secret key. Example :

<pre>
{
  "testSecretKey": "sk_test_751BVqbli82hx9hyL5GRGT"
}
</pre>

