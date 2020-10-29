const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;


app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket) {
 	console.log('New user connected');

 	socket.on('disconnect', () => {
    	console.log('user disconnected');
  	})

  	socket.on('message', (msg) => {
		//console.log(msg);
		socket.broadcast.emit('message', msg);
	})
});


http.listen(port, () => {
	console.log('Server started at port ' + port);
});