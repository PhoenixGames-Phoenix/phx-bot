const conn = require("../utils/dbConnection");
const { Schema } = require("mongoose");

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

module.exports = async function (offender, moderator, reason, duration) {
  // I dont even know if the useDb() is needed, i'll just use it
  (await conn).useDb("discord");
  const model = conn.model("tempmute", tempmuteSchema, "punishments");
  const tempmute = new model({
    type: "tempmute",
    offender: offender,
    moderator: moderator,
    reason: reason,
    duration: duration,
  });
  tempmute.save();
};
