import express from 'express';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(
	cors({
		// VSC
		// origin: 'http://127.0.0.1:5500',
		// WEBSTORM
		origin: 'http://localhost:63342',
		credentials: true,
	})
);

let subscribers: Response[] = [];

app.post('/message', (req: Request, res: Response) => {
	// SSE
	subscribers.forEach((subscriber: Response) => {
		if (subscriber.socket)
			console.log('Sending message to: ' + subscriber.socket.remoteAddress);
		subscriber.write('data: ' + JSON.stringify(req.body) + '\n\n');
	});
	res.send();
});

app.get('/subscribe', (req: Request, res: Response) => {
	subscribers.push(res);
	if (res.socket) console.log('New connection: ' + res.socket.remoteAddress);

	req.on('end', () => {
		subscribers = subscribers.filter((sub: any) => sub !== res);
	});

	res.writeHead(200, {
		Connection: 'keep-alive',
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
	});
});

app.listen(3001, () => console.log('Server running...'));
