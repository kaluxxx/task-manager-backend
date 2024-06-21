const config = require('../../config');
const {connect, connection} = require("mongoose");
const Grid = require('gridfs-stream');
const {GridFSBucket} = require("mongodb");


const connectDB = async () => {
    // si pas de fichier config on throw une erreur
    if (!config.mongoURI) {
        throw new Error('MongoURI not found in config');
    }
    const uri = config.mongoURI;
    try {
        await connect(uri);

        console.log('MongoDB connected');
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
        process.exit(1);
    }
};

let gfsBucket;
const conn = connection;
conn.once('open', () => {
    gfsBucket = new GridFSBucket(conn.db, { bucketName: 'uploads' });
});

module.exports = { connectDB, gfsBucket };
