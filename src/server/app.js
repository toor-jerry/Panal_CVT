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

// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getStorage } = require( "firebase/storage");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBt5cFXrI0D0NF4AJ1TQJRmd6X3WUOnuLs",
    authDomain: "panal-6aa84.firebaseapp.com",
    databaseURL: "https://panal-6aa84-default-rtdb.firebaseio.com",
    projectId: "panal-6aa84",
    storageBucket: "panal-6aa84.appspot.com",
    messagingSenderId: "390583139213",
    appId: "1:390583139213:web:e16721c150ef8fb4871bc4",
    measurementId: "G-V5E33ME7XZ"
  };


// Initialization vars
const app = express();
const server = http.createServer(app);
// Initialize Firebase
const appFire = initializeApp(firebaseConfig);
const storage = getStorage(appFire);


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