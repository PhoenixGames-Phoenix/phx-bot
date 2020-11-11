const conn = require("../utils/dbConnection");
const { Schema } = require("mongoose");

const permbanSchema = new Schema({
  type: { type: String },
  offender: Number,
  moderator: Number,
  reason: String,
  active: Boolean,
});

module.exports = async function (offender, moderator, reason, active) {
  (await conn).useDb("discord");
  const model = conn.model("ban", permbanSchema, "punishments");
  const permban = new model({
    type: "ban",
    offender: offender,
    moderator: moderator,
    reason: reason,
    active: active,
  });
  permban.save();
};
