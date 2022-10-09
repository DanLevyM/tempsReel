const { WebSocketServer } = require('ws');

const server = new WebSocketServer({ port: 8080 });
let subscribers = {};

server.addListener('connection', (socket, req) => {
	// console.dir(socket);
	const remoteAddress = req.socket.remoteAddress;
	const query = req.url.split('?')[1];
	const params = new URLSearchParams(query);
	const username = params.get('username');
	console.log(`New connection from: ${remoteAddress} - ${username}`);
	subscribers[username] = socket;
	broadcast(socket, `New user connected: ${username}`);

	socket.addListener('message', (message) => {
		message = message.toString('utf-8');
		let match = message.match(/^@([a-z0-9]+)\s+(.*)$/);
		if (match) {
			const [, username, message] = match;
			sendToUser(username, message);
		} else {
			broadcast(socket, message);
		}
	});
	socket.addListener('close', () => {
		subscribers.pop(socket);
		console.log(`${username} has been disconnected.`);
	});
});

server.addListener('listening', () => {
	console.log('Server running on port 8080..');
});

function broadcast(sender, message) {
	Object.values(subscribers).forEach((socket) => {
		if (socket !== sender) {
			console.log('BROADCAST: ' + message);
			socket.send(message);
		}
	});
}

function sendToUser(username, message) {
	const socket = subscribers[username];
	if (socket) {
		console.log('SEND TO USER: ' + message);
		socket.send(message);
	}
}
