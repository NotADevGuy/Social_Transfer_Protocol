let mongoose = require("mongoose");

let schema = mongoose.Schema;

let User = new schema({
    name: String,   username: String,
    email: String,  password: String,

    kudos: Number,
    address: String, lastAddressChange: Date,

    friends: [{
        user: {type: mongoose.Schema.Types.ObjectId, ref: "users"},
        username: String
    }],

    files: [{
        name: String,
        owner: {type: mongoose.Schema.Types.ObjectId, ref: "users"},
    }]
});



const user_model = mongoose.model("users", User);

module.exports = user_model;