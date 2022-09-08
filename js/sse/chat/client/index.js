const eventSource = new EventSource('http://localhost:3001/subscribe', {
	withCredentials: true,
});

eventSource.onmessage = (event) => {
	const { title: msg } = JSON.parse(event.data);
	const li = document.createElement('li');
	const text = document.createTextNode(msg);
	li.appendChild(text);
	document.getElementById('messagesList').appendChild(li);
};

document.getElementById('sendMessage').addEventListener('submit', (event) => {
	event.preventDefault();
	const data = new FormData(event.target);
	fetch('http://localhost:3001/messages', {
		method: 'POST',
		body: JSON.stringify({ title: data.get('message') }),
		headers: {
			'Content-Type': 'application/json',
		},
	}).then(() => {
		alert('Message sent');
	});
});
