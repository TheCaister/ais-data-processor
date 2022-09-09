const needle = require('needle');
const config = require('dotenv').config();

const url_token = 'https://id.barentswatch.no/connect/token';
const url_ais = 'https://live.ais.barentswatch.no/v1/ais';

var AISArray = [];

async function getToken() {
    const body = `client_id=${client_id}&client_secret=${client_secret}&scope=ais&grant_type=client_credentials`;
    var request = 'https://id.barentswatch.no/connect/token';

    needle.post(request,
        body,
        (err, res) => {
            if(err){
                console.log(err);
            };
            console.log(res.body);
            data = res.body;
            token = data.access_token;
        });
}

// Prints stream of AIS data.
function printAISStream() {
    console.log("Checking...");
    const stream = needle.get(url_ais, {
        headers: {
            'Authorization': `bearer ${token}`
        }
    });

    // Receive data in buffers.
    stream.on('data', (data) => {
        // Leave the "catch" part empty. This keeps the connection open even if there aren't any tweets coming in.
        try {
            var maxNum = 5;
            var iterator = 0;

            while(iterator < maxNum){
                var json = JSON.parse(data);
                AISArray.push(json);
                // console.log(json);
                iterator++; 
            }
            
            stream.removeAllListeners();
            console.log('Array start: ', AISArray, ': End');
        } catch (error) {}
    })
}

// printAISStream();
// getToken();

// Promised based AMQP library
const amqp = require("amqplib");

var msg = 'hi';

connect();

async function connect(){
    try {
        // If the return type is a Bluebird, it's Promise based so you have to use the "await" keyword.

        // Must create connection first and then channels
        // const connection = await amqp.connect("amqp://localhost:5672");
        const connection = await amqp.connect("amqps://lkxcwyfq:posv1_VqG7KutIoDuUUDmZRKch43Vqll@sparrow.rmq.cloudamqp.com/lkxcwyfq");
        
        const channel = await connection.createChannel();

        // Makes sure queue exists. If it doesn't, it will be created.
        const result = await channel.assertQueue("jobs");

        channel.sendToQueue("jobs", Buffer.from(JSON.stringify(msg)));

        console.log(`Job sent: ${msg.number}`);
    } catch (error) {
        console.error(error);
    }
}