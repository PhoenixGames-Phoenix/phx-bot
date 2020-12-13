const conn = require('../utils/dbConnection');
const mongoose = require('mongoose');

const tempmuteSchema = new mongoose.Schema({
    punishmenttype: String,
    offender: String,
    moderator: String,
    reason: String,
    duration: {
        type: Object,
        startTime: Number,
        endTime: Number,
    },
});

module.exports = conn.model('tempmute', tempmuteSchema, 'punishments');
