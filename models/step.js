const mongoose = require("mongoose");
const Joi = require("joi");

const stepSchema = new mongoose.Schema({
  name: { type: String, required: true },
  step: { type: String, required: true },
});

const Step = mongoose.model("step", stepSchema);

module.exports = { Step };
