const mongoose = require("mongoose");
const { Schema } = mongoose;

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

module.exports = mongoose.model("tempmute", tempmuteSchema, "punishments");
