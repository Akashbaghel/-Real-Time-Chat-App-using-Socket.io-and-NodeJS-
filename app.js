const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;


app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

var clients = 0;

//Server side socket.io code
io.on('connection', (socket) => {
 	clients++;
 	io.emit('join', {clients: clients});

 	socket.on('disconnect', () => {
    	clients--;
    	socket.broadcast.emit('leave', {clients: clients});
  	})

   socket.on('typing', (data) => {
       socket.broadcast.emit('typing', data)
   })

  	socket.on('message', (msg) => {
		socket.broadcast.emit('message', msg);
	})
});


http.listen(port, () => {
	console.log('Server started at port ' + port);
});