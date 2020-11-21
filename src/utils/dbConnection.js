const mongoose = require('mongoose');
const config = require('./config').loadconfig();
const secrets = require('./config').loadsecrets();

module.exports = mongoose.createConnection(
    'mongodb://' +
        config.mongodb.User +
        ':' +
        secrets.MongoPassword +
        '@' +
        config.mongodb.Host +
        ':' +
        config.mongodb.Port +
        '/',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        authSource: config.mongodb.AuthSource,
        dbName: config.mongodb.AuthSource,
    }
);
