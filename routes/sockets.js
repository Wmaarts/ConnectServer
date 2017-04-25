var socketio = require('socket.io');
var moment = require('moment-timezone');

module.exports.listen = function(app){
    io = socketio.listen(app)

  	// Socket!
    io.sockets.on('connection', function(socket){
    	socket.on('refresh', function(msg){
    		// Request current service!
    		getUsersLive(function(data){
    			if(data){
    				socket.emit('activeService', data);
    			} else {
    				socket.emit('noService');
    			}
    		})
    	});
    	var counter = 0;
    	setInterval(function(){
    		counter++;
    		socket.emit('numbers', counter);
    	}, 1000);
    });
    
    return io
}

function getUsersLive(callback){
	var thisMoment = moment();
    var previousMoment = moment().subtract(1, 'days');

	var query = {
        "$and" : [{ startDateTime : { $lt: thisMoment, $gt: previousMoment, }, }]
	};

    Service.findOne(query)
    .populate('usersVisited')
    .exec(function (err, service) {
    	console.log(service);
        if(err || service == undefined) {
            return undefined;
        }
        callback({service: service.name, guests: service.usersVisited});
    });
}