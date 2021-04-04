const ws = require('ws');

const PORT = 8000;


const wss = new ws.Server({port: PORT}, () => console.log(`Server started on port ${PORT}`));


wss.on('connection', function connection(ws) {
    ws.send('message', (message) => {
        message = JSON.parse(message);

        switch (message.event) {
            case "message":
                sendMessage(message)
                break;
            case "connection":
                sendMessage(message);
                break;
        }
    });
});

const message = {
    event: 'message/connection',
    id: 284848,
    date: '',
    message: 'Message text'
}

const sendMessage = (message) => {
    wss.clients.forEach(client => {
        client.send(JSON.stringify(message));
    });
}