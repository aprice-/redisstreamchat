const socketio = require('socket.io');
const Rx = require('rxjs/Rx');

const data = require('./data');
const server = require('./server');

let sockets = [];

let socketServer = socketio(server, {path: '/api/socket.io'});

Rx.Observable.fromEvent(socketServer, 'connection') // when a new connection occurs
    .flatMap(socket => { // for each connection
        sockets.push(socket);
        const part$ = Rx.Observable.fromEvent(socket, 'part'); // when user leaves a channel
        const disconnect$ = Rx.Observable.fromEvent(socket, 'disconnect') // user disconnects
            .do(() => sockets.splice(sockets.indexOf(socket), 1)); // remove socket

        return Rx.Observable.fromEvent(socket, 'join') // when user joins a channel
            .flatMap(channel => { // for the joined channel
                return data.pollNewMessages(channel) // get a poller
                    .takeUntil(part$.filter(c => c === channel)) // listen until channel is left
            })
            .do(message => socket.emit('message', message)) // emit each message on the socket
            .takeUntil(disconnect$); // stop listening if user disconnects
    })
    .finally(() => sockets.forEach((socket) => {socket.destroy()})) // destroy sockets
    .takeUntil(Rx.Observable.fromEvent(process, 'SIGINT')) // listen until server is stopped
    .subscribe(() => {}); // start processing
