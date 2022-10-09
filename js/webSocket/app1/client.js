let username = null;

document.getElementById('formuser').addEventListener('submit', (e) => {
	e.preventDefault();
	const data = new FormData(e.target);
	username = data.get('username');
	document.getElementById('formuser').style.display = 'none';
	startWebServer(username).then((socket) => {
		document.getElementById('chat').style.display = 'block';
		startChat(socket);
	});
});

function startChat(socket) {
	document.getElementById('formmessage').addEventListener('submit', (e) => {
		e.preventDefault();
		const data = new FormData(e.target);
		const msg = data.get('message');
		socket.send(msg);
		e.target.reset();
		addMessage(msg);
	});
}

function startWebServer(username) {
	return new Promise((resolve) => {
		const websocket = new WebSocket(
			'ws://localhost:8080/?username=' + username
		);
		websocket.onopen = () => {
			console.log('Connected to server');
			console.log('websocket:', websocket);
			resolve(websocket);
		};
		websocket.onmessage = (event) => {
			console.log('EVENT DATA: ', event.data);
			const msg = event.data;
			addMessage(msg);
		};
		websocket.onclose = () => {
			console.log('Disconnected from server');
		};
		websocket.onerror = (err) => {
			console.log(`Disconnected from server - Error ${err}`);
		};
	});
}

function addMessage(msg) {
	console.log('===', msg);
	const li = document.createElement('li');
	const text = document.createTextNode(msg);
	li.append(text);
	document.getElementById('messageList').appendChild(li);
}
