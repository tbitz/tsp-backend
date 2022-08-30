const mongoose = require("mongoose");
const Joi = require("joi");

const messageSchema = new mongoose.Schema({
  timestamp: { type: Number, required: true, unique: true },
  text: { type: String },
  receiverId: { type: String, required: true },
  senderId: { type: String, required: true },
});

const validate = (message) => {
  const schema = Joi.object({
    timestamp: Joi.number().required(),
    text: Joi.string().required(),
    receiverId: Joi.string().required(),
    senderId: Joi.string().required(),
  });
  return schema.validate(message);
};

const Message = mongoose.model("message", messageSchema);

module.exports = { Message, validate };
