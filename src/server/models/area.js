const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

// Schema definition
const areaSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Name is required!"],
    },
    description: {
        type: String
    }
});

// values uniques
areaSchema.plugin(uniqueValidator, {
    message: '{PATH} would be unique!!'
});

// exports model
module.exports = mongoose.model("Area", areaSchema);