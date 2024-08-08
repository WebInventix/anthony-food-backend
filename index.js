const express = require('express');
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const sockets = require('./socket');
const fileUpload = require('express-fileupload');

const connectToMongo = require('./database');
const all_routes = require('./routes/index');
const error_handler = require("./middlewares/error_handler");
const { PORT } = require('./config');
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", // Adjust according to your setup
        methods: ["GET", "POST"]
    }
});
// Allow CORS for all routes
app.use(cors());

app.use(
    cors({
        origin: function (origin, callback) {
            return callback(null, true);
        },
        optionsSuccessStatus: 200,
        credentials: true,
    })
)


app.use(express.json())

app.use(fileUpload({
    useTempFiles: true
}))

// Initialized all routes
app.use(all_routes)

// Initial Route
app.get('*', (req, res) => {
    res.send('<h1 style="text-align:center;">Backend is working...</h1>');

})

connectToMongo()
sockets(io);
app.use(error_handler)

// Start the server
server.listen(PORT || 5000, () => {
    console.log('Server listening on port 5000');
});

