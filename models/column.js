const mongoose = require("mongoose");
const Joi = require("joi");
const ObjectId = mongoose.Schema.Types.ObjectId;

const columnSchema = new mongoose.Schema({
  user: { type: String, ref: "user", required: true },
  title: { type: String, required: true },
  index: { type: Number, required: true },
});

const validate = (column) => {
  const schema = Joi.object({
    user: Joi.string().required(),
    title: Joi.string().required(),
    index: Joi.number().required(),
  });
  return schema.validate(column);
};

const Column = mongoose.model("column", columnSchema);

module.exports = { Column, validate };
