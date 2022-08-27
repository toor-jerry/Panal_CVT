// Requires
require('./config/config'); // Settings
require('dotenv').config();
const express = require('express'); // Framework backend
const bodyParser = require('body-parser'); // Tranform data
const path = require('path'); // Filesystem routes
const socketIO = require('socket.io'); // websockets <- framework socket.io
const http = require('http'); // Http request
const cookieSession = require('cookie-session'); // sessions
const hbs = require('express-hbs'); // HBS


// Initialization vars
const app = express();
const server = http.createServer(app);

// Morgan (view petitions) <enviroment dev>
const morgan = require('morgan');
app.use(morgan('dev'));

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.json());

// Static files
app.use(express.static(path.resolve(__dirname, '../public')));

// Express HBS
require('./hbs/helpers/helpers'); // helpers
app.engine('hbs', hbs.express4({ // register partials
    partialsDir: path.resolve(__dirname, '../../views/partials')
}));

app.set('view engine', 'hbs'); //register engine <hbs>

// Sessions
app.use(cookieSession({
    name: 'session',
    keys: [process.env.KEY_1, process.env.KEY_2]
}));

// io
module.exports.io = socketIO(server, {
    cors: {
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket', 'polling']
});


// Routes
app.use(require('./routes/index'));

// Database connection
require('./DataBase/connection');


// Listen petitions
server.listen(process.env.PORT, (err) => {
    if (err) throw new Error(err);

    console.log(`Server on port ${process.env.PORT}: \x1b[36monline\x1b[0m`);
});