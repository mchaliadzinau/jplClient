var net 		= require('net'),
	events 		= require('events'),
	SolarObject	= require('./SolarObject')
	util 		= require('util'),
	port 		= 6775,
	host 		= "horizons.jpl.nasa.gov";

function Client()
{
	events.EventEmitter.call(this);

	var self = this;

	this.isReady 	= false,
	this.socket 	= null;

	return {

		connect: function(callback) {

			var that = this;

			self.socket = net.connect({
				port: port,
				host: host,
				allowHalfOpen: true
			});

			self.socket.setEncoding('utf8');

			self.socket.on("connect", function () {
				console.log('Connection created');
				callback();
			});

			self.socket.on('data', function(data) {

				console.log(data);
				if(data.match(/(Horizons>|<cr>:|\] :)/)) {
					self.isReady = true;
					self.emit('ready');
				}
			});

			self.socket.on('end', function(data) {
				console.log('Connection Ended');
			});
		},

		write: function(string, callback)
		{
			var that = this;

			if(self.socket === null) {
				throw new Error("Client is not connected");
			}

			self.isReady = false;

			self.once('ready', function() {
				self.isReady = true;
				callback();
			});

			self.socket.write(string + '\r\n');
		},

		getObject: function(callback)
		{
			var that 			= this
				solarObject 	= null,
				issueCommand 	= null;

			solarObject = new SolarObject.object({
				'object': 399,
				'type'	: 'vectorCoordinates'
			});

			issueCommand = function(i) {

				if(command = solarObject.getNextCommand()) {
					that.write(command, function() {
						issueCommand();
					});
				}
			}

			if(this.isReady()) {
				issueCommand(0);
			}
			else {
				self.once('ready', function() {
					issueCommand(0);
				});
			}
		},

		isReady: function()
		{
			return self.isReady;
		}
	}
}

util.inherits(Client, events.EventEmitter);

exports.client = Client;
