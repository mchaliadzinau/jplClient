var aggregate 	= require('./clientAggregate'),
	express 	= require('express'),
	app 		= express();

app.get('/api/:object', function(req, res) {

	aggregate.getClient(function(client) {
		client.getObject(req.params.object);
	});

});

app.listen(3000);
console.log('Listening on port 3000');

