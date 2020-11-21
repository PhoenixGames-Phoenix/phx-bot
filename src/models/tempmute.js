const conn = require('../utils/dbConnection');
const { Schema } = require('mongoose');

const tempmuteSchema = new Schema({
    type: { type: String },
    offender: Number,
    moderator: Number,
    reason: String,
    duration: {
        type: Object,
        startTime: Number,
        endTime: Number,
    },
});

module.exports = conn.model('tempmute', tempmuteSchema, 'punishments');
