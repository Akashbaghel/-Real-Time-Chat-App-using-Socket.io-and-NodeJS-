const socket = io();

let name;
let timeout = undefined;

do {
	name = prompt('Please enter your name')
} while(!name)

let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message_area');

textarea.addEventListener('keyup', (e) => {
	if(e.key === 'Enter') {
		sendMessage(e.target.value)
	}

})

textarea.addEventListener('keypress', (e) => {
	if(e.which!=13){
        socket.emit('typing', {name:name, typing:true})
    }
})

function sendMessage(message) {
	let msg = {
		user: name,
		message: message.trim()
	}
	appendMessage(msg, 'outgoing');
	textarea.value = '';
	scrollToBottom();
	socket.emit('message', msg);
}

function appendMessage(msg, type) {
	let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
}


//Receive message

socket.on('join', (data) => {
	console.log(data.clients);
	document.getElementById("counter").innerHTML = data.clients.toString();
})

socket.on('leave', (data) => {
	console.log(data.clients);
	document.getElementById("counter").innerHTML = data.clients.toString();
})

socket.on('typing', (data) => {
	if(data.typing==true) {
		document.getElementById("typing").innerHTML = `${data.name} is typing...`;
		setTimeout(() => {
			document.getElementById("typing").innerHTML = "";
		}, 2000);
	}
})

socket.on('message', (msg) => {
	appendMessage(msg, 'incoming');
	scrollToBottom();
})


function scrollToBottom() {
	messageArea.scrollTop = messageArea.scrollHeight;
}