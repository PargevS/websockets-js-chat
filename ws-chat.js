const express = require('express');
const cors = require('cors');
const events = require('events');
const ws = require('ws');

// main vars
const emitter = new events.EventEmitter();
const PORT = 8000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.get('/connect', (req, res) => {
    res.writeHead(200, {
        'Connection': 'keep-alive',
        'Content-type': 'text/event-stream',
        'Cache-control': 'no-cache'
    });

    emitter.on('newMessage', (message) => res.write(`data: ${JSON.stringify(message)}\n\n`));
});

app.post('/add-message', (req, res) => {
    // receiving a new message
    const message = req.body;

    console.log(req.body)

    //sending a new message to the chat to show
    emitter.emit('newMessage', message);

    res.status(200);
});



// run server
app.listen(PORT, () => console.log(`server started on port ${PORT}`));