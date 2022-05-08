const mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

// Roles for users
const rolesValids = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} not role valid!!'
};

// Schema definition
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required!"]
    },
    last_name: {
        type: String,
        required: [false, "Lastname is required!"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required!"]
    },
    password: {
        type: String,
        required: [true, "Password is required!"],
        minlength: [8, "Min length 8."]
    },
    role: {
        type: String,
        required: true,
        default: "USER_ROLE",
        enum: rolesValids
    },
    area: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Area'
    }
});

// values uniques
userSchema.plugin(uniqueValidator, {
    message: '{PATH} would be unique!!'
});

module.exports = mongoose.model("User", userSchema);