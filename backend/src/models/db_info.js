const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.url = "Enter MongoDB URL here."

db.users = require("./user_model");
db.files = require("./file_model");

module.exports = db;