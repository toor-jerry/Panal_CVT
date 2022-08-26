// ==========================
// Enviroment
// ==========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==========================
// Server Port 
// ==========================
process.env.PORT = process.env.PORT || 3001;

// ==========================
// URL Server
// ==========================
process.env.URI_SERVER = process.env.URI_SERVER || 'http://localhost:3001';

// ==========================
// DataBase URI
// ==========================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost/panal';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URL_DB = process.env.URL_DB || urlDB;

// ==========================
// Session secret
// ==========================
process.env.KEY_1 = 'this-my-secret-key-1-2020';
process.env.KEY_2 = 'this-my-secret-key-2-2020';