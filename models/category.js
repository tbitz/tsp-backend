const mongoose = require("mongoose");
const Joi = require("joi");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

const validate = (category) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });
  return schema.validate(category);
};

const Category = mongoose.model("category", categorySchema);

module.exports = { Category, validate };
