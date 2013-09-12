var jplClient = require('./jplClient'),
	clients = [],
	maxClients = 10;

function getClient(callback)
{
	//look for client that is ready
	for (var i = 0 ; i < clients.length ; i++) {
		if (clients[i].isReady()) {
			console.log('Using existing client ' + i);
			return callback(clients[i]);
		}
	}

	//add a new client
	if(clients.length < maxClients) {

		var newClient = new jplClient.client();
		clients.push(newClient);

		newClient.connect(function() {
			console.log('New client created.');
			return callback(newClient);
		});
	}

}

exports.getClient = getClient;