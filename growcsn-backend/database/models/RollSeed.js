/** @format */

const mongoose = require("mongoose");

const rollSeedSchema = new mongoose.Schema({
  seedServer: { type: String },
  hash: { type: String },
  seedPublic: { type: String },
  chain: { type: String },
  state: { type: String, default: "created" }, // Set default value to 'created'
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("RollSeed", rollSeedSchema);
