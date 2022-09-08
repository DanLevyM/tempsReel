const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(
	cors({
		origin: 'http://127.0.0.1:5500',
		credentials: true,
	})
);

let subscribers = [];

// POST MESSAGE
app.post('/messages', (req, res) => {
	// SSE
	subscribers.forEach((subscriber) => {
		console.log('Sending message to: ' + subscriber.socket.remoteAddress);
		subscriber.write('data: ' + JSON.stringify(req.body) + '\n\n');
	});
	res.send();
});

// SUBSCRIBE
app.get('/subscribe', (req, res) => {
	subscribers.push(res);
	console.log('New connection: ' + res.socket.remoteAddress);

	req.on('end', () => {
		subscribers = subscribers.filter((sub) => sub !== res);
	});

	// SSE
	res.writeHead(200, {
		Connection: 'keep-alive',
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
	});
});

app.listen(3001, () => console.log('Server running...'));
