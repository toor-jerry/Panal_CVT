const mongoose = require('mongoose'); // ODM

// Connection definition
mongoose.connect(process.env.URL_DB, {
        /*useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false*/
        useUnifiedTopology: true
    })
    .then(db => console.log('DB \x1b[36m%s\x1b[0m', ' is connected!!'))
    .catch(err => {
        throw new Error(err);
    });