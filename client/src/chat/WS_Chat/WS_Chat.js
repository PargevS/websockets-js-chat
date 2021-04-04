import React, {useState, useEffect, useRef} from 'react';
import classNames from 'classnames';
import axios from 'axios';
import uuid from 'uuid-random';
//* import of components and developer packages
import './WS_Chat.scss';

const WS_Chat = () => {
    const [inputVal, setInputVal] = useState('');
    const [messages, setMessage] = useState([]);
    const [connected, setConnected] = useState(false);
    const [userName, setUserName] = useState('');
    const socket = useRef();

    // retrieving message content
    const inputChangeHandler = () => (e) => setInputVal(e.target.value);

    // receiving and sending new messages over websockets
    const connect = () => {
        socket.current = new WebSocket('ws://localhost:8400');

        socket.current.onopen = () => {
            setConnected(true);
            console.log('success connection')
            const message = {
                event: 'connection',
                username: userName,
                id: uuid()
            }
            socket.current.send(JSON.stringify(message))
        }

        socket.current.onmessage = (e) => {
            const mess = JSON.parse(e.data);
            setMessage(pr => [...pr, mess])
        }

        socket.current.onclose = () => {

        }

        socket.current.onerror = (err) => {
            console.log(err.message)
            console.log('An error has occurred');
        }
    }

    // sending a message to the server
    const sendMessage = async () => {
        // message creation
        const mess = {
            username: userName,
            message: inputVal,
            id: uuid(),
            event: 'message'
        }
        // empty message check
        if (inputVal !== '') {
            socket.current.send(JSON.stringify(mess));
            setInputVal('')
        }
    }

    // simulate login
    if (!connected) {
        return (
            <div className='pl-chat'>
                <div className="form">
                    <input type="text"
                           placeholder='Your name'
                           onInput={(e) => setUserName(e.target.value)}
                           value={userName}/>
                    <button onClick={connect}>Log In</button>
                </div>
            </div>
        );
    }

    // display messages
    return (
        <div className='pl-chat'>
            <div>
                <div className="form">
                    <input type="text"
                           onInput={inputChangeHandler()}
                           value={inputVal}/>
                    <button onClick={sendMessage}>Send Message</button>
                </div>
                <div className="messages">
                    {messages.map(mess => {
                        if (mess.event === 'connection') {
                            return (<div className='username' key={mess.id}>UserName: {mess.username}</div>);
                        } else {
                            return (<div className='message' key={mess.id}>{mess.message}</div>);
                        }
                    })}
                </div>
            </div>
        </div>
    );
};

export default WS_Chat;