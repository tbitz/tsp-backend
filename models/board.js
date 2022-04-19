const mongoose = require("mongoose");
const Joi = require("joi");

const boardSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const validate = (board) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });
  return schema.validate(board);
};

const Board = mongoose.model("board", boardSchema);

module.exports = { Board, validate };
