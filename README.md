# AIS Demo

There are 2 main components in this project: The server and client. 

### 1. Server
Before running the server, you must assign values to the `client_id` and `client_secret` values to retrieve your token. You can refer to the `notes.md` file or the Kystverket website for details.

After that, you can run the server through the `npm start` command (`npm run dev` for nodemon). This starts the Node server that will serve the web pages and handle HTTP requests to the AIS provider.

### 2. Client
Once the server is running and ready to serve, go to a browser and type down `localhost:3000` or whatever port is assigned to "PORT". From there, the web page will give you instructions on how to generate the token, send the AIS stream request and view the data on the Leaflet map.

## Important Components
### [needle](https://www.npmjs.com/package/needle)
Lean HTTP client. Automatic JSON parsing.

### [Node.js Stream Interface](https://nodejs.org/api/stream.html)
This interface allows chunks of data to flow in, even if it's never-ending. The 'data' event listens for these chunks and I was able to parse the AIS data through the callback.

### [Leaflet](https://leafletjs.com/)
Provides the map.

### [Socket.IO](https://socket.io/)
Allows communication between the client and server. This is done through setting up sockets and emitting events.