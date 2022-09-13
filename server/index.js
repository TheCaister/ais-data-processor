// We'll be using Socket.io which allows us to use WebSockets, an open door connection between the server and client. The client could be anything. In this case, we'll probably just use vanilla JavaScript in HTML. However, the client could also be React, Angular, etc.

const http = require('http');
const path = require('path');
const express = require('express');
const socketIo = require('socket.io');

const needle = require('needle');
const config = require('dotenv').config();

// Creating a port
const PORT = process.env.PORT || 3000;

// Initialising express
const app = express();

// Using sockets
// Creating server with express app.
const server = http.createServer(app);
const io = socketIo(server);

// Serving with express
// Now, index.html should be served when you go to localhost:{PORT}
app.get('/', (req, res) => {
    // "__dirname" gives the current folder where the JS file is located.
    res.sendFile(path.resolve(__dirname, '../', 'app', 'index.html'))
})

const url_token = 'https://id.barentswatch.no/connect/token';
const url_ais = 'https://live.ais.barentswatch.no/v1/ais';

const client_id = '';
const client_secret = '';

var token = '';

var AISArray = [];

async function getToken(socket) {
    const body = `client_id=${client_id}&client_secret=${client_secret}&scope=ais&grant_type=client_credentials`;
    var request = 'https://id.barentswatch.no/connect/token';

    needle.post(request,
        body,
        (err, res) => {
            if(err){
                console.log(err);
            };
            
            data = res.body;
            token = data.access_token;
            socket.emit('display_token', token.toString());
            // console.log(token);
        });
}

// Prints stream of AIS data.
async function printAISStream(socket) {

    var maxNum = 20;
    var iterator = 0;

    const stream = needle.get(url_ais, {
        headers: {
            'Authorization': `bearer ${token}`
        }
    });

    // Receive data in buffers.
    stream.on('data', (data) => {
        // Leave the "catch" part empty. This keeps the connection open even if there aren't any tweets coming in.
        try {
            if(iterator < maxNum){

                var json = JSON.parse(data);
                AISArray.push(json);
                // console.log(json);

                // console.log(`Iterator: ${iterator}`);

                // Emit an event out from the socket
                // This is how communication can be done back and forth
                socket.emit('ais', json);
                // iterator++; 
                iterator--;
            }
            else{
                // Removing listener once the maximum number has been reached.
                // stream.removeAllListeners();
            }
            
            // console.log('Array start: ', AISArray, ': End');
        } catch (error) {}
    })
}

// When the client connects

io.on('connection', async (socket) => {
    console.log('Client connected!');

    socket.on('token', () => {
        console.log('Generating token...');

        getToken(socket);
    })

    socket.on('ais_req', (io) => {
        console.log('Sending AIS stream...');

        printAISStream(socket);
    })
})

// Listening on port on server
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

console.log("This is the end of the program");

// printAISStream();
// getToken();

///////////////////////////////// RabbitMQ //////////////////////////////////////

// // Promised based AMQP library
// const amqp = require("amqplib");

// var msg = 'hi';

// connect();

// /**
//  * Connects to Message Queue and sends a message.
//  */
// async function connectToMQ(){
//     try {
//         // If the return type is a Bluebird, it's Promise based so you have to use the "await" keyword.

//         // Must create connection first and then channels
//         // const connection = await amqp.connect("amqp://localhost:5672");
//         const connection = await amqp.connect("amqps://lkxcwyfq:posv1_VqG7KutIoDuUUDmZRKch43Vqll@sparrow.rmq.cloudamqp.com/lkxcwyfq");
        
//         const channel = await connection.createChannel();

//         // Makes sure queue exists. If it doesn't, it will be created.
//         const result = await channel.assertQueue("jobs");

//         channel.sendToQueue("jobs", Buffer.from(JSON.stringify(msg)));

//         console.log(`Job sent: ${msg.number}`);
//     } catch (error) {
//         console.error(error);
//     }
// }

///////////////////////////////// RabbitMQ //////////////////////////////////////
