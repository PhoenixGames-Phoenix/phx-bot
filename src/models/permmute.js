const conn = require('../utils/dbConnection');
const { Schema } = require('mongoose');

const permmuteSchema = new Schema({
    type: { type: String },
    offender: Number,
    moderator: Number,
    reason: String,
    active: Boolean,
});

module.exports = conn.model('mute', permmuteSchema, 'punishments');
