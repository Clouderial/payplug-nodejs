# payplug-nodejs
An NodeJS API for Payplug solution : https://www.payplug.com

This module aims to implement the Curl Payplug API describe here : https://www.payplug.com/docs/api

It is used as payment solution of the StartUp Clouderial (<a href="http://clouderial.com">online project management, invoices, quotation and tasks for independant workers</a>)

## Install
<code>$ npm install payplug-nodejs</code>

## Authenticate again PayPlug API
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

## Tests
To launch the test you must first provide a tests/config.json file with you secret key. Example :

<pre>
{
  "testSecretKey": "sk_test_POUIZEHXIUEHD987H4D9U7H98"
}
</pre>

