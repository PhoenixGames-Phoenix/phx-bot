const conn = require('../utils/dbConnection');
const mongoose = require('mongoose');

const permbanSchema = new mongoose.Schema({
    punishmenttype: String,
    offender: String,
    moderator: String,
    reason: String,
});

module.exports = conn.model('permban', permbanSchema, 'punishments');
