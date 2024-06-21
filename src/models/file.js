const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    data: { type: Buffer, contentType: String } // Buffer to store file data, contentType to store MIME type
});

module.exports = mongoose.model('File', fileSchema);