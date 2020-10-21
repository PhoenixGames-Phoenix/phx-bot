const mongoose = require("mongoose");
const { Schema } = mongoose;

const permbanSchema = new Schema({
	type: { type: String },
	offender: Number,
	moderator: Number,
	reason: String,
	active: Boolean,
});

module.exports = mongoose.model("permban", permbanSchema, "punishments");
