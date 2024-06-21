const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema({
    image: {
        type: Buffer,
        required: true
    }
});

module.exports = mongoose.model("Image", imageSchema);