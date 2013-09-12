
function SolarObject(params) {

	var commands = [499, 'E', 'v', '@sun', 'g', 'eclip', '2012-10-10', '2012-11-10', '1d', 'y'],
		commandPointer = 0;

	this.getNextCommand = function() {
		return commands[commandPointer++] || false;
	}

}

exports.object = SolarObject;