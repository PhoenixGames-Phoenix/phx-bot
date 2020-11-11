const conn = require("../utils/dbConnection");
const { Schema } = require("mongoose");

const tempbanSchema = new Schema({
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

module.exports = async function (offender, moderator, reason, duration) {
  (await conn).useDb("discord");
  const model = conn.model("tempban", tempbanSchema, "punishments");
  const tempban = new model({
    type: "tempban",
    offender: offender,
    moderator: moderator,
    reason: reason,
    duration: duration,
  });
  tempban.save();
};
