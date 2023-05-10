let mongoose = require("mongoose");

let schema = mongoose.Schema;

let friendRequest = new schema({
    sender: {type: mongoose.Schema.Types.ObjectId, ref: "users"},
    receiver: {type: mongoose.Schema.Types.ObjectId, ref: "users"},
    status: {type: String, enum: ["pending", "accepted", "rejected"], default: "pending"}
})

const friend_request_model = mongoose.model("friend_requests", friendRequest);
module.exports = friend_request_model;
