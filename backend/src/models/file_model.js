let mongoose = require("mongoose");

let schema = mongoose.Schema;

let File = new schema({
    name: String,
    size: Number,
    extension: String,
    owner: {type: mongoose.Schema.Types.ObjectId, ref: "users"},
    ownerUsername: String,
});

const file_model = mongoose.model("files", File);
module.exports = file_model;