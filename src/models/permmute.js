const conn = require("../utils/dbConnection");
const { Schema } = require("mongoose");

const permmuteSchema = new Schema({
  type: { type: String },
  offender: Number,
  moderator: Number,
  reason: String,
  active: Boolean,
});

module.exports = async function (offender, moderator, reason, active) {
  (await conn).useDb("discord");
  const permmutemodel = await conn.model("mute", permmuteSchema, "punishments");
  const permmutedoc = new permmutemodel({
    type: "mute",
    offender: offender,
    moderator: moderator,
    reason: reason,
    active: active,
  });
  permmutedoc.save();
};
