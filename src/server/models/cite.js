const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Schema definition
const citeSchema = new Schema({
    full_name: {
        type: String
    },
    email: {
        type: String
    },
    whatsapp: {
        type: String
    },
    date: {
        type: String,
        default: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
    },
    hour: {
        type: String,
        required: [true, "Hour is required!"]
    },
    description: {
        type: String
    },
    area: {
        type: Schema.Types.ObjectId,
        ref: 'Area'
    },
});

// exports model
module.exports = mongoose.model("Cite", citeSchema);