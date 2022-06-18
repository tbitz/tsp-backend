const mongoose = require("mongoose");
const Joi = require("joi");

const labelSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
});

const validate = (label) => {
  const schema = Joi.object({
    label: Joi.string().required(),
    value: Joi.string().required(),
  });
  return schema.validate(label);
};

const Label = mongoose.model("label", labelSchema);

module.exports = { Label, validate };
