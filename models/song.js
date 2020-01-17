const mongoose = require("mongoose");
var uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const songSchema = new Schema({
    spotify_id: {
        type: String,
        required: [true, "spotify_id is required (Syntax: album-song)"]
    },
    name: {
        type: String,
        required: [true, "name is required (Syntax: album-song)"]
    },
    album: {
        type: String,
        required: [true, "album es is required"]
    }
});

songSchema.plugin(uniqueValidator, { message: "{PATH} has to be uniq" });

module.exports = mongoose.model("SpotifySong", songSchema);
