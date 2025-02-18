const mongoose = require("mongoose");

const catSchema = new mongoose.Schema({
    name: String,
    isReadyToPet: Boolean,
});

const Cat = mongoose.model('Cat', catSchema);

module.exports = Cat;