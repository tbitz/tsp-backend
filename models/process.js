const mongoose = require("mongoose");
const Joi = require("joi");

const processSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

const validate = (process) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });
  return schema.validate(process);
};

const Process = mongoose.model("process", processSchema);

module.exports = { Process, validate };
