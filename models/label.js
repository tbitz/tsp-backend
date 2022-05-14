const mongoose = require("mongoose");
const Joi = require("joi");

const labelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  color: { type: Object, required: true },
});

const validate = (label) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    color: Joi.object({
      r: Joi.number().required(),
      g: Joi.number().required(),
      b: Joi.number().required(),
      a: Joi.number().required(),
    }),
  });
  return schema.validate(label);
};

const Label = mongoose.model("label", labelSchema);

module.exports = { Label, validate };
