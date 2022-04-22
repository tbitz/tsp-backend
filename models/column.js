const mongoose = require("mongoose");
const Joi = require("joi");

const columnSchema = new mongoose.Schema({
  title: { type: String, required: true },
  boardId: { type: String, required: true },
});

const validate = (column) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    boardId: Joi.string().required(),
  });
  return schema.validate(column);
};

const Column = mongoose.model("column", columnSchema);

module.exports = { Column, validate };
